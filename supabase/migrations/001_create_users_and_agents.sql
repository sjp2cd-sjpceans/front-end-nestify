-- Migration 001: Create Users and Agents Tables
-- TrustSearch - Philippine Real Estate Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for verification levels and user roles
CREATE TYPE user_role AS ENUM ('buyer', 'agent', 'admin');
CREATE TYPE verification_level AS ENUM ('unverified', 'document_verified', 'premium_verified');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table (detailed agent profiles)
CREATE TABLE public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    trust_score DECIMAL(3,1) DEFAULT 5.0 CHECK (trust_score >= 1.0 AND trust_score <= 10.0),
    verified BOOLEAN DEFAULT FALSE,
    verification_level verification_level DEFAULT 'unverified',
    reviews_count INTEGER DEFAULT 0,
    average_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
    profile_image TEXT,
    license_number TEXT, -- PRC License for Philippine agents
    agency TEXT,
    bio TEXT,
    specializations TEXT[], -- Areas of expertise
    languages TEXT[] DEFAULT ARRAY['English', 'Filipino'], -- Languages spoken
    service_areas TEXT[], -- Cities/areas they serve
    years_experience INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique license numbers
    CONSTRAINT unique_license_number UNIQUE (license_number)
);

-- Create indexes for performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_verified ON public.users(verified);
CREATE INDEX idx_agents_trust_score ON public.agents(trust_score DESC);
CREATE INDEX idx_agents_verified ON public.agents(verified);
CREATE INDEX idx_agents_verification_level ON public.agents(verification_level);
CREATE INDEX idx_agents_user_id ON public.agents(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User accounts extending Supabase auth.users';
COMMENT ON TABLE public.agents IS 'Real estate agent profiles with Philippine licensing support';
COMMENT ON COLUMN public.agents.license_number IS 'PRC (Professional Regulation Commission) license number for Philippine real estate brokers';
COMMENT ON COLUMN public.agents.trust_score IS 'Calculated trust score (1-10) based on reviews, verification, and listing quality';
COMMENT ON COLUMN public.agents.service_areas IS 'Philippine cities/regions where agent provides services'; 