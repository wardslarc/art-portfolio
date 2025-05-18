import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
let supabase: ReturnType<typeof createClient<Database>>;

// Only create the client if the URL and key are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  console.error(
    "Supabase URL and/or Anonymous Key are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
  );
  // Create a mock client that will show appropriate errors when used
  supabase = {} as ReturnType<typeof createClient<Database>>;
}

export { supabase };
