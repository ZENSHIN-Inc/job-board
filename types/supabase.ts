// types/supabase.ts

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: number;
          project_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
        };
        Update: never;
      };
    };
  };
};
