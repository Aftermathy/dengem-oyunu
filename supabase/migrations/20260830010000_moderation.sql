-- Moderation for the public leaderboard (App Store Review Guideline 1.2).
--
-- The board shows a nickname the player types, to every other player. Guideline
-- 1.2 asks an app with user-generated content for four things: a way to filter
-- objectionable material, a way to report it, a way to block the person behind
-- it, and published contact details. This migration provides the middle two and
-- the automatic filter; the nickname check at entry and the contact address on
-- the support page cover the rest.
--
-- Nothing here ever hands a user_id to a client. Both actions take the id of a
-- leaderboard row — which the public view already exposes — and resolve it to a
-- player server-side.

-- ── Blocks ──────────────────────────────────────────────────────────────────

create table if not exists public.player_blocks (
  blocker_uid     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  blocked_user_id text not null,
  created_at      timestamptz not null default now(),
  primary key (blocker_uid, blocked_user_id)
);

alter table public.player_blocks enable row level security;

drop policy if exists "blocks_own" on public.player_blocks;
create policy "blocks_own" on public.player_blocks
  for all to authenticated
  using (blocker_uid = auth.uid())
  with check (blocker_uid = auth.uid());

-- ── Reports ─────────────────────────────────────────────────────────────────

create table if not exists public.content_reports (
  id                uuid primary key default gen_random_uuid(),
  reporter_uid      uuid not null references auth.users(id) on delete cascade,
  reported_user_id  text not null,
  reported_nickname text not null,
  reason            text,
  created_at        timestamptz not null default now(),
  -- One report per person per player: the auto-hide below counts reporters, and
  -- without this one person could hide anyone by pressing the button three times.
  unique (reporter_uid, reported_user_id)
);

alter table public.content_reports enable row level security;

/*
  No policy is written, so RLS denies everything to every client. Reports are
  only ever written through report_leaderboard_entry() below, which runs as
  definer — a reporter must not be able to read who else reported whom, and a
  reported player must not be able to delete the reports against them.
*/

create index if not exists content_reports_reported_idx
  on public.content_reports (reported_user_id);

-- ── Report ──────────────────────────────────────────────────────────────────

create or replace function public.report_leaderboard_entry(
  p_entry_id uuid,
  p_reason   text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid  uuid := auth.uid();
  tgt  record;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select user_id, nickname into tgt
  from public.leaderboard_scores
  where id = p_entry_id;

  if not found then
    raise exception 'no such entry';
  end if;

  if tgt.user_id = uid::text then
    raise exception 'cannot report your own entry';
  end if;

  insert into public.content_reports (reporter_uid, reported_user_id, reported_nickname, reason)
  values (uid, tgt.user_id, tgt.nickname, left(coalesce(p_reason, ''), 500))
  on conflict (reporter_uid, reported_user_id) do nothing;
end;
$$;

revoke execute on function public.report_leaderboard_entry(uuid, text) from public, anon;
grant execute on function public.report_leaderboard_entry(uuid, text) to authenticated;

-- ── Block ───────────────────────────────────────────────────────────────────

create or replace function public.block_leaderboard_entry(p_entry_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  tgt text;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select user_id into tgt from public.leaderboard_scores where id = p_entry_id;

  if tgt is null then
    raise exception 'no such entry';
  end if;

  if tgt = uid::text then
    raise exception 'cannot block yourself';
  end if;

  insert into public.player_blocks (blocker_uid, blocked_user_id)
  values (uid, tgt)
  on conflict do nothing;
end;
$$;

revoke execute on function public.block_leaderboard_entry(uuid) from public, anon;
grant execute on function public.block_leaderboard_entry(uuid) to authenticated;

-- ── The board, with moderation applied ──────────────────────────────────────

/*
  Two filters, both evaluated per viewer inside the view so a client cannot skip
  them:

  * blocked — rows the viewer has blocked disappear for that viewer only.
  * reported — rows whose player has been reported by three different people
    disappear for everyone. Three distinct reporters is the automatic part of
    Guideline 1.2's "filter objectionable material": it removes a nickname
    within minutes rather than waiting for someone to read a report queue, and
    requiring three unrelated accounts keeps one annoyed player from silencing
    another. The report rows stay for a human to review afterwards.
*/
create or replace view public.public_leaderboard
with (security_invoker = false) as
select distinct on (s.user_id)
  s.id,
  (s.user_id = auth.uid()::text) as is_me,
  s.nickname,
  s.score,
  s.elections_won,
  s.max_money,
  s.max_election_pct,
  s.max_laundered,
  s.death_reason,
  s.created_at,
  p.avatar_id
from public.leaderboard_scores s
left join public.profiles p on p.user_id = s.user_id
where not exists (
        select 1 from public.player_blocks b
        where b.blocker_uid = auth.uid() and b.blocked_user_id = s.user_id
      )
  and (
        select count(distinct r.reporter_uid)
        from public.content_reports r
        where r.reported_user_id = s.user_id
      ) < 3
order by s.user_id, s.score desc, s.created_at desc;

revoke all on public.public_leaderboard from public;
grant select on public.public_leaderboard to anon, authenticated;

-- ── Deleting an account takes its moderation rows with it ───────────────────

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  delete from public.player_blocks   where blocker_uid = uid;
  delete from public.leaderboard_scores where user_id = uid::text;
  delete from public.profiles           where user_id = uid::text;
  -- Reports the user filed and reports filed against them go with the auth row
  -- via ON DELETE CASCADE on reporter_uid; reports about them are keyed by text
  -- and are cleared here so a deleted account leaves nothing behind.
  delete from public.content_reports where reported_user_id = uid::text;
  delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
