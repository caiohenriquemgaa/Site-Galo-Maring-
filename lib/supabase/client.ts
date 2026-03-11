import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://monihwoitbugfkngtwjo.supabase.co"

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbmlod29pdGJ1Z2Zrbmd0d2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjE0OTAsImV4cCI6MjA4ODgzNzQ5MH0.w3obp86ovukFkyedt_3lpbzRC8qjW7P4TTnfZxYKvhc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
