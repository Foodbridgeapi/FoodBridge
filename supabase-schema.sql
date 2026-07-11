-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('donor', 'recipient', 'both')),
  org_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Postings table
CREATE TABLE IF NOT EXISTS postings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity TEXT NOT NULL,
  photo_url TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  pickup_start TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_end TIMESTAMP WITH TIME ZONE NOT NULL,
  dietary_notes TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('prepared', 'bakery', 'produce', 'dairy', 'canned', 'beverages', 'other')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  posting_id UUID NOT NULL REFERENCES postings(id) ON DELETE CASCADE,
  claimant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  UNIQUE(posting_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  posting_id UUID NOT NULL REFERENCES postings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, posting_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_postings_status ON postings(status);
CREATE INDEX IF NOT EXISTS idx_postings_user_id ON postings(user_id);
CREATE INDEX IF NOT EXISTS idx_postings_category ON postings(category);
CREATE INDEX IF NOT EXISTS idx_postings_created_at ON postings(created_at);
CREATE INDEX IF NOT EXISTS idx_claims_posting_id ON claims(posting_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant_id ON claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_posting_id ON favorites(posting_id);

-- Enable realtime for postings table
ALTER PUBLICATION supabase_realtime ADD TABLE postings;

-- Row Level Security (RLS) policies

-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Postings table
ALTER TABLE postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available postings"
  ON postings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own postings"
  ON postings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own postings"
  ON postings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own postings"
  ON postings FOR DELETE
  USING (auth.uid() = user_id);

-- Claims table
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view claims"
  ON claims FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create claims"
  ON claims FOR INSERT
  WITH CHECK (auth.uid() = claimant_id);

CREATE POLICY "Users can update their own claims"
  ON claims FOR UPDATE
  USING (auth.uid() = claimant_id);

-- Favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update posting status when claimed
CREATE OR REPLACE FUNCTION update_posting_status_on_claim()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE postings
  SET status = 'claimed'
  WHERE id = NEW.posting_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER on_claim_created
  AFTER INSERT ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_posting_status_on_claim();
