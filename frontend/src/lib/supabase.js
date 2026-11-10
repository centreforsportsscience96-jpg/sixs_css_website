import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://bjyyetnqxafykmzsnlcq.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_k29rUnm-86iVMWcJ6nI_7w_fiH2z9T5'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
