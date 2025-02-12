import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
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