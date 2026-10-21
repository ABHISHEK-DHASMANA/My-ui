import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Normalize URL: strip trailing slash and strip /rest/v1 if inadvertently included
if (supabaseUrl) {
  supabaseUrl = supabaseUrl
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase Configuration Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables. Please provide valid credentials in your .env file."
  );
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
