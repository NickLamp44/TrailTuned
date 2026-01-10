-- Add ramp chamber support for forks (second air chamber)
-- This migration adds columns for tracking ramp chamber pressure and updates component data

-- Add ramp chamber columns to suspension_setups table
ALTER TABLE public.suspension_setups 
ADD COLUMN IF NOT EXISTS fork_ramp_chamber_pressure DECIMAL(5,1); -- PSI for ramp chamber

-- Add ramp chamber tracking to suspension_components available_adjustments
-- We'll update the JSONB column to include has_ramp_chamber boolean

-- Update component data with ramp chamber support
-- Clear existing data first (optional - comment out if you want to keep existing data)
TRUNCATE TABLE public.suspension_components;


INSERT INTO public.suspension_components (component_type, brand, model, year, spring_type, damper_name, available_adjustments) VALUES
-- ========================================
-- FOX FORKS
-- ========================================

-- Fox 32 (XC Fork) - Grip SL, GRIP dampers
('fork', 'Fox', '32 SC Factory', 2026, 'air', 'GRIP SL', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

('fork', 'Fox', '32 SC Performance', 2026, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

('fork', 'Fox', '32 SC Factory', 2025, 'air', 'GRIP SL', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

('fork', 'Fox', '32 SC Performance', 2025, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),


('fork', 'Fox', '32 SC Factory', 2024, 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 SC Performance Elite', 2024, 'Performance Elite', 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 Performance', 2024, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '32 Factory', 2023, 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 Performance Elite', 2023, 'Performance Elite', 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 Performance', 2023, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox 34 (Trail Fork) - GRIP X2, GRIP, FIT dampers
('fork', 'Fox', '34 Factory', 2026, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2026, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2026, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '34 Factory', 2025,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2025, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2025, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '34 Factory', 2024,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2024, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2024, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '34 Factory', 2023,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2023, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2023, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox 36 (Enduro Fork) - GRIP X2, GRIP dampers
('fork', 'Fox', '36 Factory', 2026,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2026, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2026, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '36 Factory', 2025,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2025, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2025, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '36 Factory', 2024,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2024, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2024, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '36 Factory', 2023,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2023, 'Performance Elite', 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2023, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox 38 (Enduro/DH Fork) - GRIP X2 damper
('fork', 'Fox', '38 Factory', 2026,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Performance Elite', 2026, 'Performance Elite', 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Factory', 2025,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Performance Elite', 2025, 'Performance Elite', 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Factory', 2024,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38  Performance Elite', 2024, 'Performance Elite', 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Factory', 2023,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Performance Elite', 2023, 'Performance Elite', 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Fox 40 (DH Fork) - GRIP X2 damper
('fork', 'Fox', '40 Factory', 2026,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '40 Factory', 2025,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '40 Factory', 2024,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '40 Factory', 2023,  'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),


-- ========================================
-- FOX SHOCKS
-- ========================================

-- Fox Float X2 (Enduro/DH Shock)
('shock', 'Fox', 'Float X2 Factory', 2026, 'air', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X2 Factory', 2025, 'air', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X2 Factory', 2024, 'Factory', 'air', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X2 Factory', 2023, 'Factory', 'air', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Fox Float X (Trail Shock)
('shock', 'Fox', 'Float X Factory', 2026, 'Factory', 'air', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance Elite', 2026, 'Performance Elite', 'air', null, '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance', 2026, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Factory', 2025, 'Factory', 'air', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance Elite', 2025, 'Performance Elite', 'air', null, '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance', 2025, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Factory', 2024, 'Factory', 'air', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance Elite', 2024, 'Performance Elite', 'air', null, '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance', 2024, 'Performance', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox DHX2 (DH Coil Shock)
('shock', 'Fox', 'DHX2 Factory', 2026, 'Factory', 'coil', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'DHX2 Factory', 2025, 'Factory', 'coil', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'DHX2 Factory', 2024, 'Factory', 'coil', null, '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

