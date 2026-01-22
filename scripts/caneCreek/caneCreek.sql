-- ========================================
-- CANE CREEK SUSPENSION COMPONENTS
-- ========================================
-- Updated: Removed damper variants, consolidated models, verified adjustments

BEGIN;

-- Delete existing Cane Creek data to avoid duplicates
DELETE FROM public.suspension_components WHERE brand = 'Cane Creek';

-- Insert Cane Creek Forks and Shocks
INSERT INTO public.suspension_components (component_type, brand, model, year, spring_type, damper_name, available_adjustments)
VALUES
-- ========================================
-- CANE Creek FORKS
-- ========================================

-- Cane Creek Helm Air (DBair damper)
('fork', 'Cane Creek', 'Helm Air', 2026, 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm Air', 2025, 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm Air', 2024, 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Cane Creek Helm Coil (DBcoil damper)
('fork', 'Cane Creek', 'Helm Coil', 2026, 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm Coil', 2025, 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm Coil', 2024, 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- ========================================
-- CANE CREEK SHOCKS
-- ========================================

-- Cane Creek DB Air (Inline damper - air spring)
('shock', 'Cane Creek', 'DB Air', 2026, 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Air', 2025, 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Air', 2024, 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Cane Creek DB Coil (Inline damper - coil spring)
('shock', 'Cane Creek', 'DB Coil', 2026, 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Coil', 2025, 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Coil', 2024, 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Cane Creek Kitsuma Air (DBlite damper - lightweight)
('shock', 'Cane Creek', 'Kitsuma Air', 2026, 'air', 'DBlite', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Kitsuma Air', 2025, 'air', 'DBlite', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Kitsuma Air', 2024, 'air', 'DBlite', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Cane Creek Tigon Air (DBlite damper - simple tunable shock)
('shock', 'Cane Creek', 'Tigon Air', 2026, 'air', 'DBlite', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Tigon Air', 2025, 'air', 'DBlite', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Tigon Air', 2024, 'air', 'DBlite', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}');

COMMIT;
