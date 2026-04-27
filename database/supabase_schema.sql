
-- 1. SETUP EXTENSIONS AND TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Extends Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    weight_kg REAL,
    height_cm REAL,
    allergies TEXT[] DEFAULT '{}',
    current_medications TEXT[] DEFAULT '{}',
    role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DISEASES LIBRARY
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
    description TEXT,
    typical_duration TEXT,
    symptoms_json JSONB DEFAULT '[]',          -- [{name, frequency}]
    treatment_protocols_json JSONB NOT NULL,   -- {acute: {}, subacute: {}, chronic: {}}
    diagnostic_questions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 4. CONSULTATIONS
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    chief_complaint TEXT,
    diagnosis TEXT,
    confidence_level TEXT CHECK (confidence_level IN ('Low', 'Medium', 'High')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    emergency_flag BOOLEAN DEFAULT FALSE,
    symptoms_snapshot JSONB DEFAULT '[]',      -- Snapshot of symptoms found
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('bot', 'user')),
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADMIN ACTIVITY LOG
CREATE TABLE admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES: PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());

-- POLICIES: CONSULTATIONS
CREATE POLICY "Users can view own consultations" ON consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own consultations" ON consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all consultations" ON consultations FOR SELECT USING (is_admin());

-- POLICIES: MESSAGES
CREATE POLICY "Users can view messages for own consultations" ON messages 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM consultations WHERE id = messages.consultation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages for own consultations" ON messages 
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM consultations WHERE id = messages.consultation_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all messages" ON messages FOR SELECT USING (is_admin());

-- POLICIES: DISEASES
CREATE POLICY "Public read access for active diseases" ON diseases FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage diseases" ON diseases ALL USING (is_admin());

-- 8. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
