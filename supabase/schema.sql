-- Principle-Centered Planner Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission Statements table
CREATE TABLE IF NOT EXISTS mission_statements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  statement TEXT NOT NULL,
  values JSONB DEFAULT '[]'::jsonb,
  principles JSONB DEFAULT '[]'::jsonb,
  legacy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles table (Father, Developer, Friend, etc.)
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '👤',
  color TEXT DEFAULT '#6366f1',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Plans table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  reflection JSONB,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Big Rocks table (major weekly goals)
CREATE TABLE IF NOT EXISTS big_rocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  weekly_plan_id UUID REFERENCES weekly_plans(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT FALSE,
  scheduled_day INTEGER, -- 0-6 for Sunday-Saturday
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table (smaller items)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  big_rock_id UUID REFERENCES big_rocks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  quadrant TEXT DEFAULT 'q2' CHECK (quadrant IN ('q1', 'q2', 'q3', 'q4')),
  scheduled_date DATE,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Renewal Logs table (Sharpen the Saw tracking)
CREATE TABLE IF NOT EXISTS renewal_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  physical INTEGER DEFAULT 0 CHECK (physical >= 0 AND physical <= 10),
  mental INTEGER DEFAULT 0 CHECK (mental >= 0 AND mental <= 10),
  spiritual INTEGER DEFAULT 0 CHECK (spiritual >= 0 AND spiritual <= 10),
  social INTEGER DEFAULT 0 CHECK (social >= 0 AND social <= 10),
  physical_notes TEXT,
  mental_notes TEXT,
  spiritual_notes TEXT,
  social_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- Circle of Control items
CREATE TABLE IF NOT EXISTS circle_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('control', 'no_control')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mission_statements_user ON mission_statements(user_id);
CREATE INDEX IF NOT EXISTS idx_roles_user ON roles(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_week ON weekly_plans(week_start);
CREATE INDEX IF NOT EXISTS idx_big_rocks_plan ON big_rocks(weekly_plan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_renewal_logs_user ON renewal_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_renewal_logs_date ON renewal_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_circle_items_user ON circle_items(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE big_rocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Mission Statements policies
CREATE POLICY "Users can view own mission" ON mission_statements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mission" ON mission_statements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mission" ON mission_statements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mission" ON mission_statements FOR DELETE USING (auth.uid() = user_id);

-- Roles policies
CREATE POLICY "Users can view own roles" ON roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roles" ON roles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roles" ON roles FOR DELETE USING (auth.uid() = user_id);

-- Weekly Plans policies
CREATE POLICY "Users can view own plans" ON weekly_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON weekly_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON weekly_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON weekly_plans FOR DELETE USING (auth.uid() = user_id);

-- Big Rocks policies (need to join through weekly_plans)
CREATE POLICY "Users can view own rocks" ON big_rocks FOR SELECT 
  USING (EXISTS (SELECT 1 FROM weekly_plans WHERE weekly_plans.id = big_rocks.weekly_plan_id AND weekly_plans.user_id = auth.uid()));
CREATE POLICY "Users can insert own rocks" ON big_rocks FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM weekly_plans WHERE weekly_plans.id = big_rocks.weekly_plan_id AND weekly_plans.user_id = auth.uid()));
CREATE POLICY "Users can update own rocks" ON big_rocks FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM weekly_plans WHERE weekly_plans.id = big_rocks.weekly_plan_id AND weekly_plans.user_id = auth.uid()));
CREATE POLICY "Users can delete own rocks" ON big_rocks FOR DELETE 
  USING (EXISTS (SELECT 1 FROM weekly_plans WHERE weekly_plans.id = big_rocks.weekly_plan_id AND weekly_plans.user_id = auth.uid()));

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Renewal Logs policies
CREATE POLICY "Users can view own logs" ON renewal_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON renewal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON renewal_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON renewal_logs FOR DELETE USING (auth.uid() = user_id);

-- Circle Items policies
CREATE POLICY "Users can view own items" ON circle_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON circle_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON circle_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON circle_items FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_mission_statements_timestamp BEFORE UPDATE ON mission_statements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_weekly_plans_timestamp BEFORE UPDATE ON weekly_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
