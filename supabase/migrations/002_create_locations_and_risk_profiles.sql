-- Migration 002: Create Locations and Risk Profiles Tables
-- TrustSearch - Philippine Real Estate Platform

-- Create enum types for risk levels
CREATE TYPE risk_level AS ENUM ('minimal', 'low', 'moderate', 'high', 'very_high');
CREATE TYPE traffic_level AS ENUM ('light', 'moderate', 'heavy', 'very_heavy');
CREATE TYPE access_level AS ENUM ('limited', 'fair', 'good', 'excellent');

-- Philippine locations table (hierarchical structure)
CREATE TABLE public.locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    region TEXT NOT NULL, -- Philippine regions (NCR, Region I, etc.)
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    barangay TEXT NOT NULL,
    postal_code TEXT,
    latitude DECIMAL(10, 8), -- GPS coordinates
    longitude DECIMAL(11, 8),
    area_type TEXT DEFAULT 'urban' CHECK (area_type IN ('urban', 'suburban', 'rural')),
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique location combinations
    CONSTRAINT unique_location UNIQUE (region, province, city, barangay)
);

-- Risk profiles table (area risk intelligence)
CREATE TABLE public.risk_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
    
    -- Crime and Safety
    crime_rate risk_level DEFAULT 'moderate',
    safety_score DECIMAL(3,1) DEFAULT 5.0 CHECK (safety_score >= 1.0 AND safety_score <= 10.0),
    
    -- Natural Disasters
    flood_risk risk_level DEFAULT 'moderate',
    earthquake_risk risk_level DEFAULT 'moderate',
    typhoon_risk risk_level DEFAULT 'moderate',
    
    -- Infrastructure and Accessibility
    traffic_level traffic_level DEFAULT 'moderate',
    healthcare_access access_level DEFAULT 'fair',
    education_access access_level DEFAULT 'fair',
    public_transport_access access_level DEFAULT 'fair',
    internet_connectivity access_level DEFAULT 'fair',
    
    -- Utilities and Services
    power_reliability DECIMAL(3,1) DEFAULT 7.0 CHECK (power_reliability >= 1.0 AND power_reliability <= 10.0),
    water_quality DECIMAL(3,1) DEFAULT 7.0 CHECK (water_quality >= 1.0 AND water_quality <= 10.0),
    waste_management DECIMAL(3,1) DEFAULT 6.0 CHECK (waste_management >= 1.0 AND waste_management <= 10.0),
    
    -- Economic Indicators
    property_value_trend TEXT DEFAULT 'stable' CHECK (property_value_trend IN ('declining', 'stable', 'growing', 'rapidly_growing')),
    cost_of_living DECIMAL(3,1) DEFAULT 5.0 CHECK (cost_of_living >= 1.0 AND cost_of_living <= 10.0),
    
    -- Amenities (distances in km)
    nearest_hospital_km DECIMAL(5,2),
    nearest_school_km DECIMAL(5,2),
    nearest_mall_km DECIMAL(5,2),
    nearest_airport_km DECIMAL(5,2),
    
    -- Data sources and reliability
    data_sources TEXT[], -- Sources of risk data
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reliability_score DECIMAL(3,1) DEFAULT 7.0 CHECK (reliability_score >= 1.0 AND reliability_score <= 10.0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one risk profile per location
    CONSTRAINT unique_location_risk_profile UNIQUE (location_id)
);

-- Environmental tags table (for property categorization)
CREATE TABLE public.environmental_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- 'safety', 'amenity', 'risk', 'lifestyle'
    description TEXT,
    color TEXT DEFAULT '#6B7280', -- Hex color for UI display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_locations_region ON public.locations(region);
CREATE INDEX idx_locations_province ON public.locations(province);
CREATE INDEX idx_locations_city ON public.locations(city);
CREATE INDEX idx_locations_barangay ON public.locations(barangay);
CREATE INDEX idx_locations_coordinates ON public.locations(latitude, longitude);

CREATE INDEX idx_risk_profiles_location_id ON public.risk_profiles(location_id);
CREATE INDEX idx_risk_profiles_crime_rate ON public.risk_profiles(crime_rate);
CREATE INDEX idx_risk_profiles_flood_risk ON public.risk_profiles(flood_risk);
CREATE INDEX idx_risk_profiles_safety_score ON public.risk_profiles(safety_score DESC);

CREATE INDEX idx_environmental_tags_category ON public.environmental_tags(category);

-- Create triggers for updated_at
CREATE TRIGGER trigger_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_risk_profiles_updated_at
    BEFORE UPDATE ON public.risk_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.locations IS 'Philippine geographical locations (Region > Province > City > Barangay)';
COMMENT ON TABLE public.risk_profiles IS 'Comprehensive area risk intelligence for each location';
COMMENT ON TABLE public.environmental_tags IS 'Categorized tags for property environmental features';
COMMENT ON COLUMN public.risk_profiles.safety_score IS 'Overall safety score (1-10) calculated from multiple risk factors';
COMMENT ON COLUMN public.risk_profiles.flood_risk IS 'Flood risk level based on historical data and topography';
COMMENT ON COLUMN public.risk_profiles.reliability_score IS 'Confidence level in the risk data (1-10)'; 