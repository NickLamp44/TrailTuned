-- Add shock_hbo column to track Hydraulic Bottom Out clicks
ALTER TABLE public.suspension_setups 
ADD COLUMN IF NOT EXISTS shock_hbo INTEGER;

-- Truncate existing data to reload with HBO updates
TRUNCATE TABLE public.suspension_components;

-- ========================================
-- ROCKSHOX FORKS
-- ========================================

INSERT INTO public.suspension_components (component_type, brand, model, year, spring_type, damper_name, available_adjustments) VALUES

-- 2026 Boxxer Ultimate -- 
('fork', 'RockShox', 'BoXXer Ultimate', 2026, 'air', 'Charger 3.1', '{ 
"compression": false, 
    "hsc": true, 
    "lsc": true, 
"rebound": true, 
    "hsr": false, 
    "lsr": false, 
"air_pressure": true,
"has_ramp_chamber": false, 
"volume_spacers": true, 
"spring_rate": false, 
"other_adjustments": []}'),

-- 2026 Boxxer Base -- 
('fork', 'RockShox', 'BoXXer Base', 2026,  'air', 'Charger 3 RC' null,'{
"compression": true,
    "hsc": false, 
    "lsc": false, 
"rebound": true,
    "hsr": false, 
    "lsr": false, 
"air_pressure": true, 
"volume_spacers": true, 
"spring_rate": false,  
"has_ramp_chamber": false,
"other_adjustments": []}'),

-- 2025 Boxxer Ultimate -- 
('fork', 'RockShox', 'BoXXer Ultimate', 2025, 'air', 'Charger 3.1', '{ 
"compression": false, 
    "hsc": true, 
    "lsc": true, 
"rebound": true, 
    "hsr": false, 
    "lsr": false, 
"air_pressure": true,
"has_ramp_chamber": false, 
"volume_spacers": true, 
"spring_rate": false, 
"other_adjustments": []}'),

-- 2025 Boxxer Base -- 
('fork', 'RockShox', 'BoXXer Base', 2025,  'air', 'Charger 3 RC' null,'{
"compression": true,
    "hsc": false, 
    "lsc": false, 
"rebound": true,
    "hsr": false, 
    "lsr": false, 
"air_pressure": true, 
"volume_spacers": true, 
"spring_rate": false,  
"has_ramp_chamber": false,
"other_adjustments": []}'),

-- 2024 Boxxer Ultimate -- 
('fork', 'RockShox', 'BoXXer Ultimate', 2024, 'air', 'Charger 3', '{ 
"compression": false, 
    "hsc": true, 
    "lsc": true, 
"rebound": true, 
    "hsr": false, 
    "lsr": false, 
"air_pressure": true,
"has_ramp_chamber": false, 
"volume_spacers": true, 
"spring_rate": false, 
"other_adjustments": []}'),

-- 2024 Boxxer Base -- 
('fork', 'RockShox', 'BoXXer Base', 2024,  'air', 'Charger 3 RC' null,'{
"compression": true,
    "hsc": false, 
    "lsc": false, 
"rebound": true,
    "hsr": false, 
    "lsr": false, 
"air_pressure": true, 
"volume_spacers": true, 
"spring_rate": false,  
"has_ramp_chamber": false,
"other_adjustments": []}'),

-- 2023 Boxxer Ultimate -- 
('fork', 'RockShox', 'BoXXer Ultimate', 2023, 'air', 'Charger 3', '{ 
"compression": false, 
    "hsc": true, 
    "lsc": true, 
"rebound": true, 
    "hsr": false, 
    "lsr": false, 
"air_pressure": true,
"has_ramp_chamber": false, 
"volume_spacers": true, 
"spring_rate": false, 
"other_adjustments": []}'),

-- 2026 Boxxer Base -- 
('fork', 'RockShox', 'BoXXer Base', 2023,  'air', 'Charger 3 RC' null,'{
"compression": true,
    "hsc": false, 
    "lsc": false, 
"rebound": true,
    "hsr": false, 
    "lsr": false, 
"air_pressure": true, 
"volume_spacers": true, 
"spring_rate": false,  
"has_ramp_chamber": false,
"other_adjustments": []}'),

-- 2022 Boxxer Ultimate -- 
('fork', 'RockShox', 'BoXXer Ultimate', 2022, 'air', 'Charger 2', '{ 
"compression": false, 
    "hsc": true, 
    "lsc": true, 
"rebound": true, 
    "hsr": false, 
    "lsr": false, 
"air_pressure": true,
"has_ramp_chamber": false, 
"volume_spacers": true, 
"spring_rate": false, 
"other_adjustments": []}'),

-- 2022 Boxxer Base -- 
('fork', 'RockShox', 'BoXXer Base', 2022,  'air', 'Charger 2 RC' null,'{
"compression": true,
    "hsc": false, 
    "lsc": false, 
"rebound": true,
    "hsr": false, 
    "lsr": false, 
"air_pressure": true, 
"volume_spacers": true, 
"spring_rate": false,  
"has_ramp_chamber": false,
"other_adjustments": []}'),




COMMIT;


