-- Migration 003: Create Properties and Images Tables
-- TrustSearch - Philippine Real Estate Platform

-- Create enum types for property specifications
CREATE TYPE property_type AS ENUM ('house', 'condo', 'townhouse', 'lot', 'commercial');
CREATE TYPE property_status AS ENUM ('active', 'sold', 'pending', 'inactive', 'draft');
CREATE TYPE listing_type AS ENUM ('sale', 'rent', 'pre_selling');

-- Properties table (main property listings)
CREATE TABLE public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT NOT NULL,
    
    -- Basic Information
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    property_type property_type NOT NULL,
    listing_type listing_type DEFAULT 'sale',
    status property_status DEFAULT 'draft',
    
    -- Pricing (in Philippine Peso)
    price BIGINT NOT NULL CHECK (price > 0), -- Price in centavos for precision
    price_per_sqm BIGINT, -- Calculated field
    currency TEXT DEFAULT 'PHP',
    
    -- Property Specifications
    bedrooms INTEGER CHECK (bedrooms >= 0),
    bathrooms INTEGER CHECK (bathrooms >= 0),
    parking_spaces INTEGER DEFAULT 0,
    floor_area DECIMAL(8,2), -- Square meters
    lot_area DECIMAL(8,2), -- Square meters
    floors INTEGER DEFAULT 1,
    
    -- Building Information
    building_name TEXT,
    unit_number TEXT,
    floor_number INTEGER,
    year_built INTEGER CHECK (year_built >= 1900 AND year_built <= EXTRACT(YEAR FROM NOW()) + 5),
    
    -- Amenities and Features
    amenities TEXT[], -- Pool, gym, security, etc.
    inclusions TEXT[], -- Appliances, furniture included
    nearby_landmarks TEXT[], -- Malls, schools, hospitals nearby
    
    -- Trust and Quality Metrics
    trust_score DECIMAL(3,1) DEFAULT 5.0 CHECK (trust_score >= 1.0 AND trust_score <= 10.0),
    listing_quality_score DECIMAL(3,1) DEFAULT 5.0 CHECK (listing_quality_score >= 1.0 AND listing_quality_score <= 10.0),
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    
    -- SEO and Search
    slug TEXT UNIQUE, -- URL-friendly identifier
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    
    -- Statistics
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property images table
CREATE TABLE public.property_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    
    -- Image Information
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    
    -- Image Metadata
    file_name TEXT,
    file_size INTEGER, -- Size in bytes
    width INTEGER,
    height INTEGER,
    mime_type TEXT,
    
    -- Organization
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    room_type TEXT, -- 'living_room', 'bedroom', 'kitchen', 'bathroom', 'exterior', etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property environmental tags junction table
CREATE TABLE public.property_environmental_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    environmental_tag_id UUID REFERENCES public.environmental_tags(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique property-tag combinations
    CONSTRAINT unique_property_tag UNIQUE (property_id, environmental_tag_id)
);

-- Property views tracking table (for analytics)
CREATE TABLE public.property_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_properties_agent_id ON public.properties(agent_id);
CREATE INDEX idx_properties_location_id ON public.properties(location_id);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_trust_score ON public.properties(trust_score DESC);
CREATE INDEX idx_properties_featured ON public.properties(featured);
CREATE INDEX idx_properties_verified ON public.properties(verified);
CREATE INDEX idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX idx_properties_published_at ON public.properties(published_at DESC);

-- Full-text search index
CREATE INDEX idx_properties_search ON public.properties USING gin(to_tsvector('english', title || ' ' || description));

CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_display_order ON public.property_images(property_id, display_order);
CREATE INDEX idx_property_images_is_primary ON public.property_images(property_id, is_primary);

CREATE INDEX idx_property_environmental_tags_property_id ON public.property_environmental_tags(property_id);
CREATE INDEX idx_property_environmental_tags_tag_id ON public.property_environmental_tags(environmental_tag_id);

CREATE INDEX idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX idx_property_views_viewed_at ON public.property_views(viewed_at DESC);

-- Create triggers for updated_at
CREATE TRIGGER trigger_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_property_images_updated_at
    BEFORE UPDATE ON public.property_images
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate price per square meter
CREATE OR REPLACE FUNCTION public.calculate_price_per_sqm()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.floor_area > 0 THEN
        NEW.price_per_sqm = ROUND(NEW.price / NEW.floor_area);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate price per sqm
CREATE TRIGGER trigger_properties_calculate_price_per_sqm
    BEFORE INSERT OR UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_price_per_sqm();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_property_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
        NEW.slug = REGEXP_REPLACE(NEW.slug, '\s+', '-', 'g');
        NEW.slug = NEW.slug || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE TRIGGER trigger_properties_generate_slug
    BEFORE INSERT OR UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_property_slug();

-- Comments for documentation
COMMENT ON TABLE public.properties IS 'Real estate property listings with Philippine specifications';
COMMENT ON TABLE public.property_images IS 'Property photos and media files';
COMMENT ON TABLE public.property_environmental_tags IS 'Junction table linking properties to environmental tags';
COMMENT ON TABLE public.property_views IS 'Property view tracking for analytics';
COMMENT ON COLUMN public.properties.price IS 'Property price in Philippine centavos (₱1 = 100 centavos)';
COMMENT ON COLUMN public.properties.trust_score IS 'Property trust score based on agent verification and listing quality';
COMMENT ON COLUMN public.properties.floor_area IS 'Floor area in square meters (sqm)';
COMMENT ON COLUMN public.properties.lot_area IS 'Lot area in square meters (sqm)'; 