-- Create bikes table
CREATE TABLE IF NOT EXISTS public.bikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  frame_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suspension_setups table
CREATE TABLE IF NOT EXISTS public.suspension_setups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  setup_name TEXT NOT NULL,
  
  -- Fork settings
  fork_brand TEXT,
  fork_model TEXT,
  fork_hsc INTEGER, -- High Speed Compression clicks
  fork_lsc INTEGER, -- Low Speed Compression clicks
  fork_hsr INTEGER, -- High Speed Rebound clicks
  fork_lsr INTEGER, -- Low Speed Rebound clicks
  fork_air_pressure DECIMAL(5,1), -- PSI
  fork_volume_spacers INTEGER,
  fork_spring_rate DECIMAL(6,2), -- lb/in for coil
  fork_notes TEXT,
  
  -- Shock settings
  shock_brand TEXT,
  shock_model TEXT,
  shock_hsc INTEGER,
  shock_lsc INTEGER,
  shock_hsr INTEGER,
  shock_lsr INTEGER,
  shock_air_pressure DECIMAL(5,1),
  shock_volume_spacers INTEGER,
  shock_spring_rate DECIMAL(6,2),
  shock_notes TEXT,
  
  -- General notes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspension_setups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bikes table
CREATE POLICY "Users can view their own bikes"
  ON public.bikes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bikes"
  ON public.bikes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bikes"
  ON public.bikes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bikes"
  ON public.bikes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for suspension_setups table
CREATE POLICY "Users can view their own setups"
  ON public.suspension_setups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own setups"
  ON public.suspension_setups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own setups"
  ON public.suspension_setups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own setups"
  ON public.suspension_setups FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_bikes_user_id ON public.bikes(user_id);
CREATE INDEX idx_suspension_setups_bike_id ON public.suspension_setups(bike_id);
CREATE INDEX idx_suspension_setups_user_id ON public.suspension_setups(user_id);
