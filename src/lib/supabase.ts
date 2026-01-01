import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

// Client-side Supabase client with cookie storage
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Export a singleton instance for client components
export const supabase = createClient();
