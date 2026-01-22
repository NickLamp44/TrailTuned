-- Fox Suspension Components Migration
-- Adds complete Fox fork and shock lineup for years 2023-2026
-- Before running: Back up existing data if needed

-- Delete only Fox components to preserve other brands
DELETE FROM public.suspension_components WHERE brand = 'Fox';

INSERT INTO public.suspension_components (component_type, brand, model, year, spring_type, damper_name, available_adjustments) VALUES

-- ========================================
-- FOX FORKS
-- ========================================

-- Fox 32 (XC Fork)
('fork', 'Fox', '32 SC Factory', 2026, 'air', 'GRIP SL', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '32 SC Performance', 2026, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '32 SC Factory', 2025, 'air', 'GRIP SL', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '32 SC Performance', 2025, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '32 SC Factory', 2024, 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 SC Performance Elite', 2024, 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 Performance', 2024, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '32 Factory', 2023, 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 Performance Elite', 2023, 'air', 'FIT4', '{"hsc": true, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '32 Performance', 2023, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox 34 (Trail Fork)
('fork', 'Fox', '34 Factory', 2026, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2026, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2026, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '34 Factory', 2025, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2025, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2025, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '34 Factory', 2024, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2024, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2024, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '34 Factory', 2023, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance Elite', 2023, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '34 Performance', 2023, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox 36 (Enduro Fork)
('fork', 'Fox', '36 Factory', 2026, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2026, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2026, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '36 Factory', 2025, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2025, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2025, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '36 Factory', 2024, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2024, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2024, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('fork', 'Fox', '36 Factory', 2023, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance Elite', 2023, 'air', 'GRIP', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '36 Performance', 2023, 'air', 'GRIP', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox 38 (Enduro/DH Fork)
('fork', 'Fox', '38 Factory', 2026, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Performance Elite', 2026, 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Factory', 2025, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Performance Elite', 2025, 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Factory', 2024, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Performance Elite', 2024, 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Factory', 2023, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '38 Performance Elite', 2023, 'air', 'GRIP X2', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Fox 40 (DH Fork)
('fork', 'Fox', '40 Factory', 2026, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '40 Factory', 2025, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '40 Factory', 2024, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('fork', 'Fox', '40 Factory', 2023, 'air', 'GRIP X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- ========================================
-- FOX SHOCKS
-- ========================================

-- Fox Float X2 (Enduro/DH Shock)
('shock', 'Fox', 'Float X2 Factory', 2026, 'air', 'X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X2 Factory', 2025, 'air', 'X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X2 Factory', 2024, 'air', 'X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X2 Factory', 2023, 'air', 'X2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),

-- Fox Float X (Trail Shock)
('shock', 'Fox', 'Float X Factory', 2026, 'air', 'X', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance Elite', 2026, 'air', 'X', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance', 2026, 'air', 'X', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Factory', 2025, 'air', 'X', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance Elite', 2025, 'air', 'X', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance', 2025, 'air', 'X', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Factory', 2024, 'air', 'X', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance Elite', 2024, 'air', 'X', '{"hsc": false, "lsc": true, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'Float X Performance', 2024, 'air', 'X', '{"hsc": false, "lsc": false, "hsr": false, "lsr": false, "air_pressure": true, "volume_spacers": true, "spring_rate": false, "rebound": true, "has_ramp_chamber": false, "compression": true, "other_adjustments": []}'),

-- Fox DHX2 (DH Coil Shock)
('shock', 'Fox', 'DHX2 Factory', 2026, 'coil', 'DHX2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'DHX2 Factory', 2025, 'coil', 'DHX2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'DHX2 Factory', 2024, 'coil', 'DHX2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}'),
('shock', 'Fox', 'DHX2 Factory', 2023, 'coil', 'DHX2', '{"hsc": true, "lsc": true, "hsr": true, "lsr": true, "air_pressure": false, "volume_spacers": false, "spring_rate": true, "rebound": false, "has_ramp_chamber": false, "compression": false, "other_adjustments": []}');

COMMIT;
