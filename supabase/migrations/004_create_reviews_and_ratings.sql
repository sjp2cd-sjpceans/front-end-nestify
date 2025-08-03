-- Migration 004: Create Reviews and Ratings Tables
-- TrustSearch - Philippine Real Estate Platform

-- Create enum types for review categories
CREATE TYPE review_type AS ENUM ('agent_review', 'property_review', 'transaction_review');
CREATE TYPE transaction_type AS ENUM ('purchase', 'rental', 'consultation');

-- Reviews table (agent and property reviews)
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Review Target (one of these will be set)
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    
    -- Review Details
    review_type review_type NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    title TEXT,
    content TEXT NOT NULL,
    
    -- Transaction Context
    transaction_type transaction_type,
    transaction_date DATE,
    transaction_amount BIGINT, -- In centavos
    
    -- Review Metadata
    is_verified BOOLEAN DEFAULT FALSE, -- Verified transaction
    is_anonymous BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    moderation_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure reviewer can only review each agent/property once
    CONSTRAINT unique_agent_review UNIQUE (reviewer_id, agent_id),
    CONSTRAINT unique_property_review UNIQUE (reviewer_id, property_id),
    
    -- Ensure either agent_id or property_id is set, not both
    CONSTRAINT check_review_target CHECK (
        (agent_id IS NOT NULL AND property_id IS NULL) OR
        (agent_id IS NULL AND property_id IS NOT NULL)
    )
);

-- Review responses table (agent responses to reviews)
CREATE TABLE public.review_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
    response TEXT NOT NULL,
    is_official BOOLEAN DEFAULT TRUE, -- Official agent response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review helpfulness tracking
CREATE TABLE public.review_helpfulness (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one vote per user per review
    CONSTRAINT unique_review_helpfulness UNIQUE (review_id, user_id)
);

-- Agent ratings summary table (for performance)
CREATE TABLE public.agent_ratings_summary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Overall Ratings
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    
    -- Rating Distribution
    rating_5_count INTEGER DEFAULT 0,
    rating_4_count INTEGER DEFAULT 0,
    rating_3_count INTEGER DEFAULT 0,
    rating_2_count INTEGER DEFAULT 0,
    rating_1_count INTEGER DEFAULT 0,
    
    -- Category Ratings
    communication_rating DECIMAL(3,2) DEFAULT 0.0,
    professionalism_rating DECIMAL(3,2) DEFAULT 0.0,
    knowledge_rating DECIMAL(3,2) DEFAULT 0.0,
    responsiveness_rating DECIMAL(3,2) DEFAULT 0.0,
    
    -- Trust Metrics
    verified_reviews_count INTEGER DEFAULT 0,
    trust_score_from_reviews DECIMAL(3,1) DEFAULT 5.0,
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property ratings summary table (for performance)
CREATE TABLE public.property_ratings_summary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Overall Ratings
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    
    -- Category Ratings
    location_rating DECIMAL(3,2) DEFAULT 0.0,
    value_rating DECIMAL(3,2) DEFAULT 0.0,
    condition_rating DECIMAL(3,2) DEFAULT 0.0,
    amenities_rating DECIMAL(3,2) DEFAULT 0.0,
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX idx_reviews_agent_id ON public.reviews(agent_id);
CREATE INDEX idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX idx_reviews_review_type ON public.reviews(review_type);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_is_verified ON public.reviews(is_verified);
CREATE INDEX idx_reviews_is_approved ON public.reviews(is_approved);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

CREATE INDEX idx_review_responses_review_id ON public.review_responses(review_id);
CREATE INDEX idx_review_responses_agent_id ON public.review_responses(agent_id);

CREATE INDEX idx_review_helpfulness_review_id ON public.review_helpfulness(review_id);
CREATE INDEX idx_review_helpfulness_user_id ON public.review_helpfulness(user_id);

CREATE INDEX idx_agent_ratings_summary_agent_id ON public.agent_ratings_summary(agent_id);
CREATE INDEX idx_property_ratings_summary_property_id ON public.property_ratings_summary(property_id);

-- Create triggers for updated_at
CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_review_responses_updated_at
    BEFORE UPDATE ON public.review_responses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_agent_ratings_summary_updated_at
    BEFORE UPDATE ON public.agent_ratings_summary
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_property_ratings_summary_updated_at
    BEFORE UPDATE ON public.property_ratings_summary
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to update agent ratings summary
CREATE OR REPLACE FUNCTION public.update_agent_ratings_summary()
RETURNS TRIGGER AS $$
DECLARE
    agent_uuid UUID;
BEGIN
    -- Determine which agent to update
    IF TG_OP = 'DELETE' THEN
        agent_uuid = OLD.agent_id;
    ELSE
        agent_uuid = NEW.agent_id;
    END IF;
    
    -- Skip if not an agent review
    IF agent_uuid IS NULL THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Update or insert agent ratings summary
    INSERT INTO public.agent_ratings_summary (agent_id)
    VALUES (agent_uuid)
    ON CONFLICT (agent_id) DO NOTHING;
    
    -- Calculate and update ratings
    UPDATE public.agent_ratings_summary
    SET 
        total_reviews = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE
        ),
        average_rating = (
            SELECT COALESCE(AVG(rating), 0.0)
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE
        ),
        rating_5_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE AND rating >= 4.5
        ),
        rating_4_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE AND rating >= 3.5 AND rating < 4.5
        ),
        rating_3_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE AND rating >= 2.5 AND rating < 3.5
        ),
        rating_2_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE AND rating >= 1.5 AND rating < 2.5
        ),
        rating_1_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE AND rating < 1.5
        ),
        verified_reviews_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE agent_id = agent_uuid AND is_approved = TRUE AND is_verified = TRUE
        ),
        last_updated = NOW()
    WHERE agent_id = agent_uuid;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update agent ratings summary when reviews change
CREATE TRIGGER trigger_reviews_update_agent_summary
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_agent_ratings_summary();

-- Function to update review helpfulness count
CREATE OR REPLACE FUNCTION public.update_review_helpfulness_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.reviews
    SET helpful_count = (
        SELECT COUNT(*) 
        FROM public.review_helpfulness 
        WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) AND is_helpful = TRUE
    )
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update helpfulness count
CREATE TRIGGER trigger_review_helpfulness_update_count
    AFTER INSERT OR UPDATE OR DELETE ON public.review_helpfulness
    FOR EACH ROW
    EXECUTE FUNCTION public.update_review_helpfulness_count();

-- Comments for documentation
COMMENT ON TABLE public.reviews IS 'User reviews for agents and properties';
COMMENT ON TABLE public.review_responses IS 'Agent responses to user reviews';
COMMENT ON TABLE public.review_helpfulness IS 'User votes on review helpfulness';
COMMENT ON TABLE public.agent_ratings_summary IS 'Aggregated rating statistics for agents (performance optimization)';
COMMENT ON TABLE public.property_ratings_summary IS 'Aggregated rating statistics for properties (performance optimization)';
COMMENT ON COLUMN public.reviews.is_verified IS 'Review from verified transaction (affects trust score calculation)';
COMMENT ON COLUMN public.reviews.transaction_amount IS 'Transaction amount in Philippine centavos for context'; 