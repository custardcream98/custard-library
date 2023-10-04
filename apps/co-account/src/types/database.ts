export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      test: {
        Row: {
          created_at: string;
          id: number;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          text?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
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
