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
  image_url: string;
  description: string;
  shape: 'Angular' | 'Round' | 'Oval' | 'Aviator' | 'Geometric' | 'Cat-Eye';
  color_temp: 'Warm' | 'Cool' | 'Neutral';
  material: 'Acetate' | 'Titanium' | 'Metal' | 'Mix';
  persona_match: string[]; 
  bridge_type: 'Fixed' | 'Adjustable';
  front_width: number;
  bridge_width: number;
  temple_length: number;
  lens_depth: number;
};

export type Profile = {
  id: string;
  user_id: string;
  ipd_result: number;
  face_shape: string;
  last_scan_date: string;
};

export type Recommendation = {
  id?: string;
  user_id: string;
  frame_name: string;
  frame_style?: string;
  frame_color?: string;
  match_score?: number;
  image_url?: string;
  reasoning?: string;
  front_size?: number;
  bridge_size?: number;
  temple_length?: number;
  frame_material?: string;
  brand_name?: string;
  model_name?: string;
  price?: number;
  discounted_price?: number;
  shop_id?: string;
  created_at?: string;
};

export type Shop = {
  id: string;
  name: string;
  address: string;
  phone: string;
};
