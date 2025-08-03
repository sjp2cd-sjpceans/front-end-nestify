-- Migration 006: Create Trust Score Functions and Business Logic
-- TrustSearch - Philippine Real Estate Platform

-- Function to calculate agent trust score
-- Based on cursor rules: reviews (40%), verification status (30%), listing quality (30%)
CREATE OR REPLACE FUNCTION public.calculate_agent_trust_score(agent_uuid UUID)
RETURNS DECIMAL(3,1) AS $$
DECLARE
    review_score DECIMAL(3,1) := 5.0;
    verification_score DECIMAL(3,1) := 5.0;
    listing_quality_score DECIMAL(3,1) := 5.0;
    final_trust_score DECIMAL(3,1);
    agent_record RECORD;
BEGIN
    -- Get agent information
    SELECT * INTO agent_record
    FROM public.agents
    WHERE id = agent_uuid;
    
    IF NOT FOUND THEN
        RETURN 5.0; -- Default score for non-existent agents
    END IF;
    
    -- 1. Calculate Review Score (40% weight)
    -- Based on average rating and number of reviews
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 5.0
            WHEN COUNT(*) < 5 THEN (AVG(rating) * 2.0) * 0.8 + 1.0 -- Penalty for few reviews
            WHEN COUNT(*) < 10 THEN (AVG(rating) * 2.0) * 0.9 + 0.5
            ELSE AVG(rating) * 2.0 -- Full score for 10+ reviews
        END INTO review_score
    FROM public.reviews
    WHERE agent_id = agent_uuid AND is_approved = TRUE;
    
    -- Boost score for verified reviews
    IF EXISTS (
        SELECT 1 FROM public.reviews 
        WHERE agent_id = agent_uuid AND is_verified = TRUE AND is_approved = TRUE
    ) THEN
        review_score := LEAST(review_score + 0.5, 10.0);
    END IF;
    
    -- 2. Calculate Verification Score (30% weight)
    verification_score := CASE agent_record.verification_level
        WHEN 'unverified' THEN 3.0
        WHEN 'document_verified' THEN 7.0
        WHEN 'premium_verified' THEN 10.0
        ELSE 5.0
    END;
    
    -- Bonus for PRC license
    IF agent_record.license_number IS NOT NULL AND LENGTH(agent_record.license_number) > 0 THEN
        verification_score := LEAST(verification_score + 1.0, 10.0);
    END IF;
    
    -- 3. Calculate Listing Quality Score (30% weight)
    -- Based on average listing quality of agent's properties
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 5.0
            ELSE AVG(listing_quality_score)
        END INTO listing_quality_score
    FROM public.properties
    WHERE agent_id = agent_uuid AND status = 'active';
    
    -- Bonus for having multiple high-quality images
    IF EXISTS (
        SELECT 1 FROM public.properties p
        JOIN public.property_images pi ON p.id = pi.property_id
        WHERE p.agent_id = agent_uuid
        GROUP BY p.id
        HAVING COUNT(pi.id) >= 5
    ) THEN
        listing_quality_score := LEAST(listing_quality_score + 0.3, 10.0);
    END IF;
    
    -- Calculate weighted final score
    final_trust_score := (
        (review_score * 0.4) +
        (verification_score * 0.3) +
        (listing_quality_score * 0.3)
    );
    
    -- Ensure score is within bounds
    final_trust_score := GREATEST(1.0, LEAST(10.0, final_trust_score));
    
    RETURN ROUND(final_trust_score, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate property trust score
CREATE OR REPLACE FUNCTION public.calculate_property_trust_score(property_uuid UUID)
RETURNS DECIMAL(3,1) AS $$
DECLARE
    agent_trust_score DECIMAL(3,1) := 5.0;
    listing_quality DECIMAL(3,1) := 5.0;
    location_safety DECIMAL(3,1) := 5.0;
    final_score DECIMAL(3,1);
    property_record RECORD;
BEGIN
    -- Get property with agent and location info
    SELECT 
        p.*,
        a.trust_score as agent_trust,
        rp.safety_score,
        rp.crime_rate,
        rp.flood_risk
    INTO property_record
    FROM public.properties p
    JOIN public.agents a ON p.agent_id = a.id
    LEFT JOIN public.risk_profiles rp ON p.location_id = rp.location_id
    WHERE p.id = property_uuid;
    
    IF NOT FOUND THEN
        RETURN 5.0;
    END IF;
    
    -- 1. Agent Trust Score (50% weight)
    agent_trust_score := COALESCE(property_record.agent_trust, 5.0);
    
    -- 2. Listing Quality (30% weight)
    listing_quality := property_record.listing_quality_score;
    
    -- Bonus for complete information
    IF property_record.description IS NOT NULL 
       AND LENGTH(property_record.description) > 100
       AND property_record.floor_area IS NOT NULL
       AND property_record.bedrooms IS NOT NULL THEN
        listing_quality := LEAST(listing_quality + 0.5, 10.0);
    END IF;
    
    -- Bonus for having images
    IF EXISTS (
        SELECT 1 FROM public.property_images 
        WHERE property_id = property_uuid
    ) THEN
        listing_quality := LEAST(listing_quality + 0.3, 10.0);
    END IF;
    
    -- 3. Location Safety (20% weight)
    IF property_record.safety_score IS NOT NULL THEN
        location_safety := property_record.safety_score;
    ELSE
        -- Default based on risk levels
        location_safety := CASE 
            WHEN property_record.crime_rate = 'low' AND property_record.flood_risk IN ('minimal', 'low') THEN 8.0
            WHEN property_record.crime_rate = 'moderate' OR property_record.flood_risk = 'moderate' THEN 6.0
            WHEN property_record.crime_rate = 'high' OR property_record.flood_risk IN ('high', 'very_high') THEN 4.0
            ELSE 5.0
        END;
    END IF;
    
    -- Calculate weighted final score
    final_score := (
        (agent_trust_score * 0.5) +
        (listing_quality * 0.3) +
        (location_safety * 0.2)
    );
    
    -- Ensure score is within bounds
    final_score := GREATEST(1.0, LEAST(10.0, final_score));
    
    RETURN ROUND(final_score, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to update all agent trust scores
CREATE OR REPLACE FUNCTION public.update_all_agent_trust_scores()
RETURNS INTEGER AS $$
DECLARE
    agent_record RECORD;
    updated_count INTEGER := 0;
    new_score DECIMAL(3,1);
BEGIN
    FOR agent_record IN SELECT id FROM public.agents LOOP
        new_score := public.calculate_agent_trust_score(agent_record.id);
        
        UPDATE public.agents
        SET trust_score = new_score,
            updated_at = NOW()
        WHERE id = agent_record.id;
        
        updated_count := updated_count + 1;
    END LOOP;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update all property trust scores
CREATE OR REPLACE FUNCTION public.update_all_property_trust_scores()
RETURNS INTEGER AS $$
DECLARE
    property_record RECORD;
    updated_count INTEGER := 0;
    new_score DECIMAL(3,1);
BEGIN
    FOR property_record IN SELECT id FROM public.properties LOOP
        new_score := public.calculate_property_trust_score(property_record.id);
        
        UPDATE public.properties
        SET trust_score = new_score,
            updated_at = NOW()
        WHERE id = property_record.id;
        
        updated_count := updated_count + 1;
    END LOOP;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-update agent trust score
CREATE OR REPLACE FUNCTION public.trigger_update_agent_trust_score()
RETURNS TRIGGER AS $$
DECLARE
    agent_uuid UUID;
    new_score DECIMAL(3,1);
BEGIN
    -- Determine which agent to update
    IF TG_OP = 'DELETE' THEN
        agent_uuid := OLD.agent_id;
    ELSE
        agent_uuid := NEW.agent_id;
    END IF;
    
    -- Skip if not an agent-related change
    IF agent_uuid IS NULL THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Calculate and update trust score
    new_score := public.calculate_agent_trust_score(agent_uuid);
    
    UPDATE public.agents
    SET trust_score = new_score,
        updated_at = NOW()
    WHERE id = agent_uuid;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-update property trust score
CREATE OR REPLACE FUNCTION public.trigger_update_property_trust_score()
RETURNS TRIGGER AS $$
DECLARE
    property_uuid UUID;
    new_score DECIMAL(3,1);
BEGIN
    -- Determine which property to update
    IF TG_OP = 'DELETE' THEN
        property_uuid := OLD.id;
    ELSE
        property_uuid := NEW.id;
    END IF;
    
    -- Calculate and update trust score
    new_score := public.calculate_property_trust_score(property_uuid);
    
    UPDATE public.properties
    SET trust_score = new_score,
        updated_at = NOW()
    WHERE id = property_uuid;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update trust scores
CREATE TRIGGER trigger_agent_trust_score_update
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_update_agent_trust_score();

CREATE TRIGGER trigger_property_trust_score_update
    AFTER INSERT OR UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_update_property_trust_score();

-- Function for property search ranking (trust 50%, recency 25%, relevance 25%)
CREATE OR REPLACE FUNCTION public.calculate_search_ranking_score(
    property_uuid UUID,
    search_query TEXT DEFAULT NULL
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    trust_score DECIMAL(3,1) := 5.0;
    recency_score DECIMAL(3,1) := 5.0;
    relevance_score DECIMAL(3,1) := 5.0;
    final_ranking DECIMAL(5,2);
    property_record RECORD;
    days_since_published INTEGER;
BEGIN
    -- Get property information
    SELECT p.*, a.trust_score as agent_trust
    INTO property_record
    FROM public.properties p
    JOIN public.agents a ON p.agent_id = a.id
    WHERE p.id = property_uuid;
    
    IF NOT FOUND THEN
        RETURN 0.0;
    END IF;
    
    -- 1. Trust Score (50% weight)
    trust_score := property_record.trust_score;
    
    -- 2. Recency Score (25% weight)
    IF property_record.published_at IS NOT NULL THEN
        days_since_published := EXTRACT(DAY FROM NOW() - property_record.published_at);
        
        recency_score := CASE
            WHEN days_since_published <= 1 THEN 10.0
            WHEN days_since_published <= 7 THEN 9.0
            WHEN days_since_published <= 30 THEN 7.0
            WHEN days_since_published <= 90 THEN 5.0
            WHEN days_since_published <= 180 THEN 3.0
            ELSE 1.0
        END;
    END IF;
    
    -- 3. Relevance Score (25% weight)
    IF search_query IS NOT NULL AND LENGTH(search_query) > 0 THEN
        -- Calculate text search relevance
        SELECT ts_rank(
            to_tsvector('english', property_record.title || ' ' || property_record.description),
            plainto_tsquery('english', search_query)
        ) * 10.0 INTO relevance_score;
        
        relevance_score := GREATEST(1.0, LEAST(10.0, relevance_score));
    END IF;
    
    -- Calculate weighted final ranking
    final_ranking := (
        (trust_score * 0.5) +
        (recency_score * 0.25) +
        (relevance_score * 0.25)
    ) * 10.0; -- Scale to 0-100 for ranking
    
    RETURN ROUND(final_ranking, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to get property search results with ranking
CREATE OR REPLACE FUNCTION public.search_properties(
    search_query TEXT DEFAULT NULL,
    min_price BIGINT DEFAULT NULL,
    max_price BIGINT DEFAULT NULL,
    property_type_filter property_type DEFAULT NULL,
    min_bedrooms INTEGER DEFAULT NULL,
    location_filter TEXT DEFAULT NULL,
    verified_only BOOLEAN DEFAULT FALSE,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    price BIGINT,
    property_type property_type,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor_area DECIMAL(8,2),
    trust_score DECIMAL(3,1),
    agent_name TEXT,
    agent_verified BOOLEAN,
    location_display TEXT,
    ranking_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.price,
        p.property_type,
        p.bedrooms,
        p.bathrooms,
        p.floor_area,
        p.trust_score,
        a.name as agent_name,
        a.verified as agent_verified,
        (l.barangay || ', ' || l.city) as location_display,
        public.calculate_search_ranking_score(p.id, search_query) as ranking_score
    FROM public.properties p
    JOIN public.agents a ON p.agent_id = a.id
    JOIN public.locations l ON p.location_id = l.id
    WHERE 
        p.status = 'active'
        AND p.published_at IS NOT NULL
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
        AND (property_type_filter IS NULL OR p.property_type = property_type_filter)
        AND (min_bedrooms IS NULL OR p.bedrooms >= min_bedrooms)
        AND (location_filter IS NULL OR l.city ILIKE '%' || location_filter || '%' OR l.barangay ILIKE '%' || location_filter || '%')
        AND (NOT verified_only OR a.verified = TRUE)
        AND (search_query IS NULL OR to_tsvector('english', p.title || ' ' || p.description) @@ plainto_tsquery('english', search_query))
    ORDER BY ranking_score DESC, p.featured DESC, p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON FUNCTION public.calculate_agent_trust_score(UUID) IS 
'Calculates agent trust score based on reviews (40%), verification (30%), listing quality (30%)';

COMMENT ON FUNCTION public.calculate_property_trust_score(UUID) IS 
'Calculates property trust score based on agent trust (50%), listing quality (30%), location safety (20%)';

COMMENT ON FUNCTION public.calculate_search_ranking_score(UUID, TEXT) IS 
'Calculates property search ranking score based on trust (50%), recency (25%), relevance (25%)';

COMMENT ON FUNCTION public.search_properties IS 
'Main property search function with filtering and ranking based on TrustSearch business rules'; 