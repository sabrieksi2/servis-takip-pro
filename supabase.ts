
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const getEnv = (key: string): string | undefined => {
  // Vite, Vercel ve Browser ortamları için en geniş kapsamlı kontrol
  return (import.meta as any)?.env?.[key] || (process.env as any)?.[key] || (window as any)?.[key];
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!) 
  : null;

if (!isSupabaseConfigured) {
  console.warn("Supabase yapılandırması eksik. LocalStorage modu aktif.");
}
