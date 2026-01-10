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


-- ========================================
-- CANE CREEK FORKS
-- ========================================

-- Cane Creek Helm (Enduro Fork) - DBair damper
('fork', 'Cane Creek', 'Helm MKII Air', 2026, 'MKII', 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm MKII Coil', 2026, 'MKII', 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm MKII Air', 2025, 'MKII', 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm MKII Coil', 2025, 'MKII', 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm MKII Air', 2024, 'MKII', 'air', 'DBair', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Cane Creek', 'Helm MKII Coil', 2024, 'MKII', 'coil', 'DBcoil', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),



-- ========================================
-- CANE CREEK SHOCKS
-- ========================================

-- Cane Creek DB Air IL (Inline)
('shock', 'Cane Creek', 'DB Air IL', 2026, 'IL', 'air', 'DBair IL', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Air IL', 2025, 'IL', 'air', 'DBair IL', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Air IL', 2024, 'IL', 'air', 'DBair IL', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Cane Creek DB Coil IL (Inline Coil)
('shock', 'Cane Creek', 'DB Coil IL', 2026, 'IL', 'coil', 'DBcoil IL', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Coil IL', 2025, 'IL', 'coil', 'DBcoil IL', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'DB Coil IL', 2024, 'IL', 'coil', 'DBcoil IL', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Cane Creek Kitsuma Air
('shock', 'Cane Creek', 'Kitsuma Air', 2026, 'Kitsuma', 'air', null, '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Kitsuma Air', 2025, 'Kitsuma', 'air', null, '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Kitsuma Air', 2024, 'Kitsuma', 'air', null, '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Cane Creek Tigon
('shock', 'Cane Creek', 'Tigon Air', 2026, 'Tigon', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Tigon Air', 2025, 'Tigon', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Cane Creek', 'Tigon Air', 2024, 'Tigon', 'air', null, '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}');
