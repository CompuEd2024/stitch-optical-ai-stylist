import { createClient } from '@supabase/supabase-js';

// These would normally be in .env
// We handle them gracefully as per instructions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Frame = {
  id: string;
  brand: string;
  model: string;
  price: number;
  dimensions: {
    front: number;
    bridge: number;
    temple: number;
  };
  image_url: string;
  category: string;
};

export type Profile = {
  id: string;
  user_id: string;
  ipd_result: number;
  face_shape: string;
  last_scan_date: string;
};

export type Recommendation = {
  id: string;
  profile_id: string;
  frame_id: string;
  match_score: number;
  scientific_rationale: string;
};

export type Shop = {
  id: string;
  name: string;
  address: string;
  phone: string;
};
