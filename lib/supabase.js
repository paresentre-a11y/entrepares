import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jetjlftghxhzrbmlzjeh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldGpsZnRnaHhoenJibWx6amVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQwMjMsImV4cCI6MjA4OTk3MDAyM30.Eosrf8nST0e96nf5mx4lAJztkW2d8uArWydZokLqvQo'

let _client = null

export function getSupabase() {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return _client
}

export const supabase = getSupabase()