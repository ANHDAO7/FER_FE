import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qsqhqoanvxfvjojrwvku.supabase.co';
const supabaseKey = 'sb_publishable_AOqkSGycvNLOz3xNIBB1mw_MU4dSUXv';

export const supabase = createClient(supabaseUrl, supabaseKey);
