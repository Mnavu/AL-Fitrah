import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not set. Registration functionality will be disabled. Please update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  
  // Export a mock supabase client to prevent crashes
  supabaseInstance = {
    from: (tableName: string) => {
      console.warn(`Attempted to access Supabase table "${tableName}" but credentials are not set.`);
      return {
        insert: () => Promise.resolve({ error: new Error('Supabase credentials not set.') }),
        select: () => Promise.resolve({ data: [], error: new Error('Supabase credentials not set.') }),
        // Add other methods as needed for mocking
      };
    },
  } as any; // Using 'any' to bypass strict type checking for the mock
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
