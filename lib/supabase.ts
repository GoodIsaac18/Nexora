import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uwccfqoikomhtlwmiwwt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Z1ZUcSNB1jvYRpHbl2zI4Q_o-M38lAK'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
