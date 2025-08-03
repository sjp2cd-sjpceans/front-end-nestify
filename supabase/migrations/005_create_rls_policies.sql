-- Migration 005: Create Row Level Security Policies
-- TrustSearch - Philippine Real Estate Platform

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_environmental_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpfulness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_ratings_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_ratings_summary ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view basic user info for agents" ON public.users
    FOR SELECT USING (role = 'agent' AND verified = true);

-- Agents table policies
CREATE POLICY "Anyone can view verified agents" ON public.agents
    FOR SELECT USING (verified = true);

CREATE POLICY "Anyone can view agent profiles" ON public.agents
    FOR SELECT USING (true);

CREATE POLICY "Agents can update their own profile" ON public.agents
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Agents can insert their own profile" ON public.agents
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Locations and risk profiles (public read access)
CREATE POLICY "Anyone can view locations" ON public.locations
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view risk profiles" ON public.risk_profiles
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view environmental tags" ON public.environmental_tags
    FOR SELECT USING (true);

-- Properties table policies
CREATE POLICY "Anyone can view active properties" ON public.properties
    FOR SELECT USING (status = 'active' AND published_at IS NOT NULL);

CREATE POLICY "Agents can view their own properties" ON public.properties
    FOR SELECT USING (
        agent_id IN (
            SELECT id FROM public.agents WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Agents can insert properties" ON public.properties
    FOR INSERT WITH CHECK (
        agent_id IN (
            SELECT id FROM public.agents WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Agents can update their own properties" ON public.properties
    FOR UPDATE USING (
        agent_id IN (
            SELECT id FROM public.agents WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Agents can delete their own properties" ON public.properties
    FOR DELETE USING (
        agent_id IN (
            SELECT id FROM public.agents WHERE user_id = auth.uid()
        )
    );

-- Only verified agents can update properties (simplified policy)
-- Featured flag restriction will be handled at application level
CREATE POLICY "Only verified agents can feature properties" ON public.properties
    FOR UPDATE USING (
        agent_id IN (
            SELECT id FROM public.agents 
            WHERE user_id = auth.uid() AND verified = true
        )
    );

-- Property images policies
CREATE POLICY "Anyone can view property images for active properties" ON public.property_images
    FOR SELECT USING (
        property_id IN (
            SELECT id FROM public.properties 
            WHERE status = 'active' AND published_at IS NOT NULL
        )
    );

CREATE POLICY "Agents can manage their property images" ON public.property_images
    FOR ALL USING (
        property_id IN (
            SELECT p.id FROM public.properties p
            JOIN public.agents a ON p.agent_id = a.id
            WHERE a.user_id = auth.uid()
        )
    );

-- Property environmental tags policies
CREATE POLICY "Anyone can view property environmental tags" ON public.property_environmental_tags
    FOR SELECT USING (
        property_id IN (
            SELECT id FROM public.properties 
            WHERE status = 'active' AND published_at IS NOT NULL
        )
    );

CREATE POLICY "Agents can manage their property tags" ON public.property_environmental_tags
    FOR ALL USING (
        property_id IN (
            SELECT p.id FROM public.properties p
            JOIN public.agents a ON p.agent_id = a.id
            WHERE a.user_id = auth.uid()
        )
    );

-- Property views policies (for analytics)
CREATE POLICY "Anyone can insert property views" ON public.property_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own property views" ON public.property_views
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Agents can view views for their properties" ON public.property_views
    FOR SELECT USING (
        property_id IN (
            SELECT p.id FROM public.properties p
            JOIN public.agents a ON p.agent_id = a.id
            WHERE a.user_id = auth.uid()
        )
    );

-- Reviews table policies
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can view their own reviews" ON public.reviews
    FOR SELECT USING (reviewer_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (reviewer_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (reviewer_id = auth.uid());

-- Review responses policies
CREATE POLICY "Anyone can view review responses" ON public.review_responses
    FOR SELECT USING (true);

CREATE POLICY "Agents can respond to their reviews" ON public.review_responses
    FOR INSERT WITH CHECK (
        agent_id IN (
            SELECT id FROM public.agents WHERE user_id = auth.uid()
        ) AND
        review_id IN (
            SELECT id FROM public.reviews 
            WHERE agent_id IN (
                SELECT id FROM public.agents WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Agents can update their own responses" ON public.review_responses
    FOR UPDATE USING (
        agent_id IN (
            SELECT id FROM public.agents WHERE user_id = auth.uid()
        )
    );

-- Review helpfulness policies
CREATE POLICY "Anyone can view review helpfulness" ON public.review_helpfulness
    FOR SELECT USING (true);

CREATE POLICY "Users can vote on review helpfulness" ON public.review_helpfulness
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their helpfulness votes" ON public.review_helpfulness
    FOR UPDATE USING (user_id = auth.uid());

-- Rating summaries policies (public read access)
CREATE POLICY "Anyone can view agent ratings summary" ON public.agent_ratings_summary
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view property ratings summary" ON public.property_ratings_summary
    FOR SELECT USING (true);

-- Admin policies (for future admin panel)
CREATE POLICY "Admins can manage all data" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage agents" ON public.agents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage properties" ON public.properties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to check if user is verified agent
CREATE OR REPLACE FUNCTION public.is_verified_agent(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.agents 
        WHERE user_id = user_uuid AND verified = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns property
CREATE OR REPLACE FUNCTION public.user_owns_property(user_uuid UUID, property_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.properties p
        JOIN public.agents a ON p.agent_id = a.id
        WHERE a.user_id = user_uuid AND p.id = property_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant specific permissions for property creation
GRANT INSERT ON public.properties TO authenticated;
GRANT INSERT ON public.property_images TO authenticated;
GRANT INSERT ON public.property_environmental_tags TO authenticated;

-- Comments for documentation
COMMENT ON POLICY "Anyone can view active properties" ON public.properties IS 
'Public can view active, published properties for search functionality';

COMMENT ON POLICY "Only verified agents can feature properties" ON public.properties IS 
'Business rule: Only verified agents can promote/feature their listings (simplified policy)';

COMMENT ON FUNCTION public.is_verified_agent(UUID) IS 
'Helper function to check if user is a verified agent';

COMMENT ON FUNCTION public.user_owns_property(UUID, UUID) IS 
'Helper function to check if user owns a specific property'; 