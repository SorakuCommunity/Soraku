import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side usage with elevated privileges
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

export type Database = {
  public: {
    Tables: {
      vtubers: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          avatar_url: string | null;
          generation: number;
          slug: string;
          agency: string | null;
          social_links: Record<string, string> | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["vtubers"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["vtubers"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          featured_image: string | null;
          author_id: string;
          author_name: string | null;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["blog_posts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          banner_image: string | null;
          start_date: string;
          end_date: string | null;
          status: "upcoming" | "ongoing" | "ended";
          discord_event_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["events"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      gallery: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          uploaded_by: string;
          uploader_name: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["gallery"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: "MANAGER" | "AGENSI" | "ADMIN" | "USER";
          username: string | null;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_roles"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Insert"]>;
      };
    };
  };
};
