-- Drop and recreate suspension_components with damper variant support
DROP TABLE IF EXISTS public.suspension_components CASCADE;

CREATE TABLE IF NOT EXISTS public.suspension_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type TEXT NOT NULL CHECK (component_type IN ('fork', 'shock')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  damper_variant TEXT, -- e.g., 'Factory', 'Performance Elite', 'Ultimate', 'Select+', etc.
  spring_type TEXT CHECK (spring_type IN ('air', 'coil', NULL)),
  available_adjustments JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_suspension_components_brand ON public.suspension_components(brand);
CREATE INDEX idx_suspension_components_lookup ON public.suspension_components(component_type, brand, model, year, damper_variant);

-- Enable RLS (read-only for all authenticated users)
ALTER TABLE public.suspension_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view suspension components"
  ON public.suspension_components FOR SELECT
  TO authenticated
  USING (true);

-- Seed Fox Forks with damper variants
INSERT INTO public.suspension_components (component_type, brand, model, year, damper_variant, spring_type, available_adjustments) VALUES

-- Fox 38 
('fork', 'Fox', '38', 2024, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '38', 2024, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '38', 2024, 'Performance', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '38', 2023, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '38', 2023, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '38', 2022, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '38', 2022, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '38', 2021, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),

-- Fox 36
('fork', 'Fox', '36', 2024, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '36', 2024, 'Performance Elite', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '36', 2024, 'Performance', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '36', 2023, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '36', 2023, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '36', 2022, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '36', 2022, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '36', 2021, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),

-- Fox 34
('fork', 'Fox', '34', 2024, 'Factory', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '34', 2024, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '34', 2024, 'Performance', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '34', 2023, 'Factory', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Zeb
('fork', 'RockShox', 'Zeb', 2024, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb', 2024, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb', 2024, 'Select', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb', 2023, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb', 2023, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb', 2022, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb', 2021, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Lyrik
('fork', 'RockShox', 'Lyrik', 2024, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik', 2024, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik', 2024, 'Select', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik', 2023, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik', 2023, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik', 2022, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Pike
('fork', 'RockShox', 'Pike', 2024, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Pike', 2024, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Pike', 2024, 'Select', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Pike', 2023, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Pike', 2023, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}');

-- Fox Shocks
INSERT INTO public.suspension_components (component_type, brand, model, year, damper_variant, spring_type, available_adjustments) VALUES

-- Fox Float X2 - Air
('shock', 'Fox', 'Float X2', 2024, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('shock', 'Fox', 'Float X2', 2023, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('shock', 'Fox', 'Float X2', 2022, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('shock', 'Fox', 'Float X2', 2021, 'Factory', 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),

-- Fox Float X - Air
('shock', 'Fox', 'Float X', 2024, 'Factory', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'Fox', 'Float X', 2024, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'Fox', 'Float X', 2024, 'Performance', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'Fox', 'Float X', 2023, 'Factory', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'Fox', 'Float X', 2023, 'Performance Elite', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- Fox DHX2 - Coil
('shock', 'Fox', 'DHX2', 2024, 'Factory', 'coil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false}'),
('shock', 'Fox', 'DHX2', 2023, 'Factory', 'coil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false}'),
('shock', 'Fox', 'DHX2', 2022, 'Factory', 'coil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false}');

-- RockShox Shocks
INSERT INTO public.suspension_components (component_type, brand, model, year, damper_variant, spring_type, available_adjustments) VALUES

-- RockShox Super Deluxe - Air
('shock', 'RockShox', 'Super Deluxe', 2024, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe', 2024, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe', 2024, 'Select', 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe', 2023, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe', 2023, 'Select+', 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe', 2022, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Vivid - Air
('shock', 'RockShox', 'Vivid', 2024, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Vivid', 2023, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Vivid', 2022, 'Ultimate', 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Super Deluxe - Coil  
('shock', 'RockShox', 'Super Deluxe Coil', 2024, 'Ultimate', 'coil', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe Coil', 2023, 'Ultimate', 'coil', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe Coil', 2024, 'Select+', 'coil', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": true}');
