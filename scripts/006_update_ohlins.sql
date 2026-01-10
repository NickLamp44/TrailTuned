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
-- OHLINS FORKS (With Ramp Chamber Support)
-- ========================================

-- Ohlins RXF36 (Enduro Fork) - TTX Air damper with RAMP CHAMBER
('fork', 'Ohlins', 'RXF36 M.2', 2026, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXF36 M.2', 2025, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXF36 M.2', 2024, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXF36 M.2', 2023, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),

-- Ohlins RXF38 (Enduro Fork) - TTX Air damper with RAMP CHAMBER
('fork', 'Ohlins', 'RXF38 M.2', 2026, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXF38 M.2', 2025, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXF38 M.2', 2024, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXF38 M.2', 2023, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),

-- Ohlins RXC34 (XC Fork) - No ramp chamber
('fork', 'Ohlins', 'RXC34 M.2', 2026, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXC34 M.2', 2025, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'RXC34 M.2', 2024, 'M.2', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Ohlins DH38 (DH Fork) - TTX damper with RAMP CHAMBER
('fork', 'Ohlins', 'DH38 M.2', 2026, 'M.2', 'air', 'TTX', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'DH38 M.2', 2025, 'M.2', 'air', 'TTX', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),
('fork', 'Ohlins', 'DH38 M.2', 2024, 'M.2', 'air', 'TTX', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": true, "compression": false, "other_adjustments": []}'),

-- ========================================
-- OHLINS SHOCKS
-- ========================================

-- Ohlins TTX Air (Trail/Enduro)
('shock', 'Ohlins', 'TTX Air', 2026, 'TTX Air', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Ohlins', 'TTX Air', 2025, 'TTX Air', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Ohlins', 'TTX Air', 2024, 'TTX Air', 'air', 'TTX Air', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Ohlins TTX Coil (DH/Enduro)
('shock', 'Ohlins', 'TTX Coil', 2026, 'TTX Coil', 'coil', 'TTX', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Ohlins', 'TTX Coil', 2025, 'TTX Coil', 'coil', 'TTX', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Ohlins', 'TTX Coil', 2024, 'TTX Coil', 'coil', 'TTX', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Ohlins TXC XC Shock
('shock', 'Ohlins', 'TXC Air', 2026, 'TXC', 'air', 'TXC', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Ohlins', 'TXC Air', 2025, 'TXC', 'air', 'TXC', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Ohlins', 'TXC Air', 2024, 'TXC', 'air', 'TXC', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": false, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

