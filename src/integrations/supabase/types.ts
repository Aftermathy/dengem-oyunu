export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      content_reports: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          reported_nickname: string
          reported_user_id: string
          reporter_uid: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          reported_nickname: string
          reported_user_id: string
          reporter_uid: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          reported_nickname?: string
          reported_user_id?: string
          reporter_uid?: string
        }
        Relationships: []
      }
      game_events: {
        Row: {
          created_at: string
          event_name: string
          event_type: string
          id: string
          properties: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string
          event_name: string
          event_type: string
          id?: string
          properties?: Json | null
          session_id: string
        }
        Update: {
          created_at?: string
          event_name?: string
          event_type?: string
          id?: string
          properties?: Json | null
          session_id?: string
        }
        Relationships: []
      }
      leaderboard_scores: {
        Row: {
          created_at: string
          death_reason: string | null
          elections_won: number
          id: string
          max_election_pct: number
          max_laundered: number
          max_money: number
          nickname: string
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          death_reason?: string | null
          elections_won?: number
          id?: string
          max_election_pct?: number
          max_laundered?: number
          max_money?: number
          nickname: string
          score?: number
          user_id: string
        }
        Update: {
          created_at?: string
          death_reason?: string | null
          elections_won?: number
          id?: string
          max_election_pct?: number
          max_laundered?: number
          max_money?: number
          nickname?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      player_blocks: {
        Row: {
          blocked_user_id: string
          blocker_uid: string
          created_at: string
        }
        Insert: {
          blocked_user_id: string
          blocker_uid?: string
          created_at?: string
        }
        Update: {
          blocked_user_id?: string
          blocker_uid?: string
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_id: string
          avatar_url: string | null
          claimed_achievements: string[]
          created_at: string
          id: string
          nickname: string
          total_ap: number
          unlocked_avatars: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_id?: string
          avatar_url?: string | null
          claimed_achievements?: string[]
          created_at?: string
          id?: string
          nickname?: string
          total_ap?: number
          unlocked_avatars?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_id?: string
          avatar_url?: string | null
          claimed_achievements?: string[]
          created_at?: string
          id?: string
          nickname?: string
          total_ap?: number
          unlocked_avatars?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_leaderboard: {
        Row: {
          avatar_id: string | null
          created_at: string | null
          death_reason: string | null
          elections_won: number | null
          id: string | null
          is_me: boolean | null
          max_election_pct: number | null
          max_laundered: number | null
          max_money: number | null
          nickname: string | null
          score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      block_leaderboard_entry: {
        Args: { p_entry_id: string }
        Returns: undefined
      }
      delete_my_account: { Args: never; Returns: undefined }
      report_leaderboard_entry: {
        Args: { p_entry_id: string; p_reason?: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
