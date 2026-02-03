export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          github_username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          github_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          github_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      user_settings: {
        Row: {
          id: string;
          email_notifications: boolean;
          weekly_digest: boolean;
          leaderboard_changes: boolean;
          slack_notifications: boolean;
          discord_notifications: boolean;
          auto_sync: boolean;
          sync_frequency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email_notifications?: boolean;
          weekly_digest?: boolean;
          leaderboard_changes?: boolean;
          slack_notifications?: boolean;
          discord_notifications?: boolean;
          auto_sync?: boolean;
          sync_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email_notifications?: boolean;
          weekly_digest?: boolean;
          leaderboard_changes?: boolean;
          slack_notifications?: boolean;
          discord_notifications?: boolean;
          auto_sync?: boolean;
          sync_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_settings_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string | null;
          full_name: string | null;
          avatar_url: string | null;
          github_username: string | null;
          created_at: string | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
