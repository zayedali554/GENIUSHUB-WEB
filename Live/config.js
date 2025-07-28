// Global Supabase client initialisation
// Load this file AFTER the `@supabase/supabase-js` CDN script
// and BEFORE any project files that need to use Supabase.

(function () {
  const SUPABASE_URL = 'https://gknodfvnbjkifcghajsf.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrbm9kZnZuYmpraWZjZ2hhanNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjA3NjgsImV4cCI6MjA2NzE5Njc2OH0.65m2vRzrKMpGrvgqaNM5fYgfx0UXLyI-W81VdK03gek';

  // Avoid re-creating if it already exists
  if (!window.supabaseClient && window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
})();
