-- Create suspension_components table
CREATE TABLE IF NOT EXISTS public.suspension_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type TEXT NOT NULL CHECK (component_type IN ('fork', 'shock')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  spring_type TEXT CHECK (spring_type IN ('air', 'coil', NULL)),
  available_adjustments JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_suspension_components_lookup ON public.suspension_components(component_type, brand, model, year);

-- Enable RLS (read-only for all authenticated users)
ALTER TABLE public.suspension_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view suspension components"
  ON public.suspension_components FOR SELECT
  TO authenticated
  USING (true);

-- Add component_id references to suspension_setups table
ALTER TABLE public.suspension_setups 
  ADD COLUMN IF NOT EXISTS fork_component_id UUID REFERENCES public.suspension_components(id),
  ADD COLUMN IF NOT EXISTS shock_component_id UUID REFERENCES public.suspension_components(id);

-- Seed popular Fox Forks
INSERT INTO public.suspension_components (component_type, brand, model, year, spring_type, available_adjustments) VALUES
-- Fox 38 (2024-2021)
('fork', 'Fox', '38 Factory', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '38 Performance Elite', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '38 Factory', 2023, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '38 Factory', 2022, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '38 Factory', 2021, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),

-- Fox 36 (2024-2021)
('fork', 'Fox', '36 Factory', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '36 Performance Elite', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '36 Factory', 2023, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '36 Factory', 2022, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('fork', 'Fox', '36 Factory', 2021, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),

-- Fox 34 (2024-2021)  
('fork', 'Fox', '34 Factory', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'Fox', '34 Performance', 2024, 'air', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Forks
-- RockShox Zeb (2024-2021)
('fork', 'RockShox', 'Zeb Ultimate', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb Select', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb Ultimate', 2023, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb Ultimate', 2022, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Zeb Ultimate', 2021, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Lyrik (2024-2021)
('fork', 'RockShox', 'Lyrik Ultimate', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik Select', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik Ultimate', 2023, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Lyrik Ultimate', 2022, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Pike (2024-2021)
('fork', 'RockShox', 'Pike Ultimate', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('fork', 'RockShox', 'Pike Select', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}');

-- Seed Fox Shocks
INSERT INTO public.suspension_components (component_type, brand, model, year, spring_type, available_adjustments) VALUES
-- Fox Float X2 (2024-2021) - Air
('shock', 'Fox', 'Float X2 Factory', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('shock', 'Fox', 'Float X2 Factory', 2023, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('shock', 'Fox', 'Float X2 Factory', 2022, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),
('shock', 'Fox', 'Float X2 Factory', 2021, 'air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false}'),

-- Fox Float X (2024-2021) - Air
('shock', 'Fox', 'Float X Factory', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'Fox', 'Float X Performance Elite', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'Fox', 'Float X Factory', 2023, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- Fox DHX2 (2024-2021) - Coil
('shock', 'Fox', 'DHX2 Factory', 2024, 'coil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false}'),
('shock', 'Fox', 'DHX2 Factory', 2023, 'coil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false}'),
('shock', 'Fox', 'DHX2 Factory', 2022, 'coil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false}');

-- Seed RockShox Shocks
INSERT INTO public.suspension_components (component_type, brand, model, year, spring_type, available_adjustments) VALUES
-- RockShox Super Deluxe (2024-2021) - Air
('shock', 'RockShox', 'Super Deluxe Ultimate', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe Select+', 2024, 'air', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe Ultimate', 2023, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe Ultimate', 2022, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Vivid (2024-2021) - Air
('shock', 'RockShox', 'Vivid Ultimate', 2024, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),
('shock', 'RockShox', 'Vivid Ultimate', 2023, 'air', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true}'),

-- RockShox Super Deluxe Coil (2024-2021) - Coil
('shock', 'RockShox', 'Super Deluxe Ultimate Coil', 2024, 'coil', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": true}'),
('shock', 'RockShox', 'Super Deluxe Ultimate Coil', 2023, 'coil', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": true}');


-- Brands 
-- Rockshox
-- Fox 
-- Cane Creek 
-- Ohlins 
-- DT Swiss
-- Marzochi 
-- SR Suntour 
-- Mantue 
-- EXT
-- Formula
