import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || " https://fmrsfkeypeoxahqdqsed.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcnNma2V5cGVveGFocWRxc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMDgwNjIsImV4cCI6MjA1NDU4NDA2Mn0.gVldJcAw8vm54fP2L9R2364CP1hY4SrKFjntLXabo_4"

// Check if we're in production and environment variables are missing
if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseAnonKey)) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
        },
    }
);