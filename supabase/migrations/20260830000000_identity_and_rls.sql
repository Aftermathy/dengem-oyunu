-- Identity: auth.uid() becomes the only thing that decides who owns a row.
--
-- Until now the app never opened a Supabase session. Apple's identityToken was
-- decoded client-side with atob() and its `sub` claim used as the user id —
-- signature, aud, iss, exp and nonce were never checked, and the token was never
-- sent anywhere. auth.uid() was therefore always NULL, so every policy had to be
-- written as USING (true), which is how the shipped anon key ended up able to
-- rewrite any player's profile and post any score under any name.
--
-- The app now signs in anonymously on first launch and upgrades that session to
-- a real Apple identity via signInWithIdToken, which Supabase verifies against
-- the Apple provider already configured for com.denizerdogan.imuststay. user_id
-- holds auth.uid() from here on.
--
-- Rows written under the old scheme (5 profiles, 10 scores) are keyed by a
-- device UUID or an Apple sub and are left in place but become unreachable.
-- No progress is lost: localStorage is the primary copy in this app and the
-- server row is a sync target, so those players' profiles re-create themselves
-- under the new identity on first launch of 1.0.5.

-- ── profiles ────────────────────────────────────────────────────────────────

drop policy if exists "Allow public profile updates" on public.profiles;
drop policy if exists "Allow public profile inserts" on public.profiles;
drop policy if exists "Profiles viewable by everyone" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (user_id = auth.uid()::text);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (user_id = auth.uid()::text);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "profiles_delete_own" on public.profiles
  for delete to authenticated
  using (user_id = auth.uid()::text);

-- ── leaderboard_scores ──────────────────────────────────────────────────────

drop policy if exists "Allow public score inserts" on public.leaderboard_scores;
drop policy if exists "Scores viewable by everyone" on public.leaderboard_scores;

create policy "scores_select_own" on public.leaderboard_scores
  for select to authenticated
  using (user_id = auth.uid()::text);

create policy "scores_insert_own" on public.leaderboard_scores
  for insert to authenticated
  with check (user_id = auth.uid()::text);

create policy "scores_delete_own" on public.leaderboard_scores
  for delete to authenticated
  using (user_id = auth.uid()::text);

/*
  The public board is a view rather than a table policy, because the thing that
  has to stay private is a column, not a row: user_id is the only identity in
  this system and the old "viewable by everyone" policy handed the whole list of
  them to anyone with the anon key. The view exposes what a leaderboard needs to
  show and nothing else.

  `distinct on (user_id)` also fixes the duplicate rows: a new row is inserted at
  the end of every run and the score is cumulative, so a single active player
  used to fill the entire top 50.
*/
create or replace view public.public_leaderboard
with (security_invoker = false) as
select distinct on (s.user_id)
  s.id,
  -- Whether this row belongs to the caller. The board has to highlight "you",
  -- and this answers that without handing out the identity it is asking about.
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
order by s.user_id, s.score desc, s.created_at desc;

revoke all on public.public_leaderboard from public;
grant select on public.public_leaderboard to anon, authenticated;

-- ── game_events ─────────────────────────────────────────────────────────────

/*
  Insert was open to the `anon` role with WITH CHECK (true), so anyone holding
  the shipped key could fill the table and burn the project's quota. It stays
  open to any signed-in client — including anonymous ones, which is every
  install — but no longer to callers with no session at all.
*/
drop policy if exists "Anyone can insert game events" on public.game_events;

create policy "events_insert_authenticated" on public.game_events
  for insert to authenticated
  with check (true);

-- ── Sanity bounds ───────────────────────────────────────────────────────────

/*
  Defence in depth: constraints are enforced for every writer regardless of
  which policy let the row through. The observed maxima today are total_ap 326
  and score 326, so these ceilings are orders of magnitude above real play and
  exist only to stop a forged value from being representable at all.
*/
alter table public.profiles
  drop constraint if exists profiles_total_ap_sane,
  add constraint profiles_total_ap_sane
  check (total_ap >= 0 and total_ap <= 10000000);

alter table public.profiles
  drop constraint if exists profiles_nickname_sane,
  add constraint profiles_nickname_sane
  check (char_length(nickname) <= 24);

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_score_sane,
  add constraint leaderboard_score_sane
  check (score >= 0 and score <= 10000000);

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_nickname_sane,
  add constraint leaderboard_nickname_sane
  check (char_length(nickname) <= 24);

-- ── Account deletion (App Store Review Guideline 5.1.1(v)) ──────────────────

/*
  Sign in with Apple creates a permanent server-side account, so the app must
  offer a way to delete it from inside the app. Everything the account owns goes,
  including the auth user itself — otherwise "delete" would only mean "sign out".

  security definer because the row being deleted from auth.users is not reachable
  under the caller's own privileges; the identity still comes from auth.uid(),
  so a caller can only ever delete themselves.
*/
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

  delete from public.leaderboard_scores where user_id = uid::text;
  delete from public.profiles where user_id = uid::text;
  delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

comment on function public.delete_my_account() is
  'Deletes the calling user''s profile, scores and auth account. Identity comes from auth.uid(); a caller can only delete themselves.';
