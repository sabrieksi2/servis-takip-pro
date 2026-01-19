
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Eğer URL veya Key yoksa client'ı oluşturma, null döndür. 
// Bu sayede uygulama "supabaseUrl is required" hatasıyla çökmez.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
