-- Seed Data for TrustSearch - Philippine Real Estate Platform
-- This file contains realistic sample data for development and testing

-- Clear existing data (in dependency order)
TRUNCATE TABLE public.property_views CASCADE;
TRUNCATE TABLE public.review_helpfulness CASCADE;
TRUNCATE TABLE public.review_responses CASCADE;
TRUNCATE TABLE public.reviews CASCADE;
TRUNCATE TABLE public.property_environmental_tags CASCADE;
TRUNCATE TABLE public.property_images CASCADE;
TRUNCATE TABLE public.properties CASCADE;
TRUNCATE TABLE public.agent_ratings_summary CASCADE;
TRUNCATE TABLE public.property_ratings_summary CASCADE;
TRUNCATE TABLE public.agents CASCADE;
TRUNCATE TABLE public.risk_profiles CASCADE;
TRUNCATE TABLE public.environmental_tags CASCADE;
TRUNCATE TABLE public.locations CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- Insert Environmental Tags
INSERT INTO public.environmental_tags (name, category, description, color) VALUES
-- Safety Tags
('Low Crime', 'safety', 'Area has low crime rates based on PNP data', '#10B981'),
('High Security', 'safety', 'Area has good security presence and systems', '#059669'),
('Safe Neighborhood', 'safety', 'Community-verified safe residential area', '#047857'),

-- Risk Tags
('Flood Risk', 'risk', 'Area prone to flooding during heavy rains', '#EF4444'),
('Earthquake Risk', 'risk', 'Area has moderate to high earthquake risk', '#DC2626'),
('Traffic Congestion', 'risk', 'Area experiences heavy traffic during peak hours', '#F59E0B'),

-- Amenity Tags
('Near Hospital', 'amenity', 'Within 5km of major hospital or medical center', '#3B82F6'),
('Near School', 'amenity', 'Within 2km of quality educational institutions', '#8B5CF6'),
('Near Mall', 'amenity', 'Within walking distance of shopping centers', '#EC4899'),
('Business District', 'amenity', 'Located in or near central business district', '#6B7280'),
('Transport Hub', 'amenity', 'Near MRT, LRT, or major bus terminals', '#14B8A6'),

-- Lifestyle Tags
('Family Friendly', 'lifestyle', 'Great area for families with children', '#F97316'),
('Young Professional', 'lifestyle', 'Popular area among young working professionals', '#84CC16'),
('Quiet Area', 'lifestyle', 'Peaceful residential area with minimal noise', '#06B6D4'),
('Growing Area', 'lifestyle', 'Rapidly developing area with increasing property values', '#8B5CF6'),
('Affordable', 'lifestyle', 'Budget-friendly area with good value properties', '#10B981');

-- Insert Philippine Locations (Cebu, Manila, Davao focus areas)
INSERT INTO public.locations (region, province, city, barangay, postal_code, latitude, longitude, area_type, population) VALUES
-- Cebu City Locations
('Region VII', 'Cebu', 'Cebu City', 'Lahug', '6000', 10.3157, 123.8854, 'urban', 45000),
('Region VII', 'Cebu', 'Cebu City', 'Banilad', '6014', 10.3417, 123.9065, 'urban', 35000),
('Region VII', 'Cebu', 'Cebu City', 'IT Park', '6000', 10.3181, 123.8935, 'urban', 25000),
('Region VII', 'Cebu', 'Cebu City', 'Ayala Business Park', '6000', 10.3181, 123.9065, 'urban', 20000),
('Region VII', 'Cebu', 'Talisay City', 'Tabunok', '6045', 10.2450, 123.8490, 'suburban', 28000),

-- Manila Metro Locations
('NCR', 'Metro Manila', 'Makati City', 'Salcedo Village', '1227', 14.5547, 121.0244, 'urban', 18000),
('NCR', 'Metro Manila', 'Bonifacio Global City', 'Fort Bonifacio', '1634', 14.5514, 121.0497, 'urban', 22000),
('NCR', 'Metro Manila', 'Ortigas Center', 'San Antonio', '1600', 14.5866, 121.0561, 'urban', 30000),
('NCR', 'Metro Manila', 'Quezon City', 'Diliman', '1101', 14.6537, 121.0688, 'urban', 85000),

-- Davao City Locations
('Region XI', 'Davao del Sur', 'Davao City', 'Lanang', '8000', 7.0731, 125.6128, 'urban', 32000),
('Region XI', 'Davao del Sur', 'Davao City', 'Matina', '8000', 7.0610, 125.6050, 'urban', 42000),
('Region XI', 'Davao del Sur', 'Davao City', 'Ecoland', '8000', 7.0990, 125.6200, 'suburban', 15000);

-- Insert Risk Profiles for Locations
INSERT INTO public.risk_profiles (location_id, crime_rate, safety_score, flood_risk, earthquake_risk, typhoon_risk, traffic_level, healthcare_access, education_access, public_transport_access, internet_connectivity, power_reliability, water_quality, waste_management, property_value_trend, cost_of_living, nearest_hospital_km, nearest_school_km, nearest_mall_km, nearest_airport_km, data_sources, reliability_score) VALUES
-- Cebu City - Lahug
((SELECT id FROM public.locations WHERE barangay = 'Lahug'), 'low', 8.5, 'minimal', 'moderate', 'moderate', 'moderate', 'excellent', 'excellent', 'good', 'excellent', 8.5, 8.0, 7.5, 'growing', 7.5, 1.2, 0.5, 2.1, 12.5, ARRAY['PNP Crime Statistics', 'PAGASA Weather Data', 'Local Government Reports'], 8.5),

-- Cebu City - Banilad
((SELECT id FROM public.locations WHERE barangay = 'Banilad'), 'low', 9.0, 'low', 'moderate', 'moderate', 'light', 'good', 'excellent', 'good', 'excellent', 8.8, 8.2, 8.0, 'rapidly_growing', 8.0, 2.5, 0.3, 1.8, 11.2, ARRAY['PNP Crime Statistics', 'PAGASA Weather Data'], 9.0),

-- Cebu City - IT Park
((SELECT id FROM public.locations WHERE barangay = 'IT Park'), 'low', 8.8, 'minimal', 'moderate', 'moderate', 'heavy', 'excellent', 'excellent', 'excellent', 'excellent', 9.0, 8.5, 8.5, 'rapidly_growing', 8.5, 0.8, 1.2, 0.5, 12.0, ARRAY['PNP Crime Statistics', 'PAGASA Weather Data', 'CEBU IT.BPM Organization'], 9.2),

-- Cebu City - Ayala Business Park
((SELECT id FROM public.locations WHERE barangay = 'Ayala Business Park'), 'low', 9.2, 'minimal', 'moderate', 'moderate', 'heavy', 'excellent', 'excellent', 'excellent', 'excellent', 9.2, 8.8, 9.0, 'rapidly_growing', 9.0, 1.0, 0.8, 0.2, 11.8, ARRAY['PNP Crime Statistics', 'Ayala Land Security Reports'], 9.5),

-- Talisay City - Tabunok
((SELECT id FROM public.locations WHERE barangay = 'Tabunok'), 'low', 7.8, 'moderate', 'moderate', 'moderate', 'moderate', 'fair', 'good', 'fair', 'good', 7.5, 7.8, 7.0, 'growing', 6.5, 3.2, 1.5, 4.5, 15.2, ARRAY['PNP Crime Statistics', 'PAGASA Weather Data'], 7.8),

-- Manila - Makati Salcedo
((SELECT id FROM public.locations WHERE barangay = 'Salcedo Village'), 'low', 9.0, 'low', 'high', 'low', 'very_heavy', 'excellent', 'excellent', 'excellent', 'excellent', 8.5, 8.0, 8.8, 'stable', 9.5, 0.5, 0.3, 0.8, 8.5, ARRAY['PNP-NCR Crime Statistics', 'MMDA Traffic Data'], 9.0),

-- Manila - BGC
((SELECT id FROM public.locations WHERE barangay = 'Fort Bonifacio'), 'minimal', 9.5, 'minimal', 'high', 'low', 'heavy', 'excellent', 'excellent', 'excellent', 'excellent', 9.0, 8.5, 9.2, 'rapidly_growing', 9.8, 1.2, 0.5, 0.3, 5.2, ARRAY['PNP-NCR Crime Statistics', 'BGC Security Reports'], 9.8),

-- Davao City - Matina
((SELECT id FROM public.locations WHERE barangay = 'Matina'), 'moderate', 6.5, 'moderate', 'high', 'high', 'heavy', 'fair', 'good', 'fair', 'good', 7.8, 7.5, 7.2, 'stable', 6.0, 2.8, 1.2, 3.5, 8.2, ARRAY['PNP-Davao Crime Statistics', 'PAGASA Weather Data'], 7.5);

-- First, insert users into auth.users (required for foreign key constraint)
-- Note: In production, users would be created through Supabase Auth signup
INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    recovery_sent_at, 
    last_sign_in_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    created_at, 
    updated_at, 
    confirmation_token, 
    email_change, 
    email_change_token_new, 
    recovery_token
) VALUES 
-- Agents
('550e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria.santos@trustsearch.ph', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Maria Santos"}', NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'juan.delacruz@trustsearch.ph', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Juan Dela Cruz"}', NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'anna.reyes@trustsearch.ph', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Anna Reyes"}', NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mikko.geverola@trustsearch.ph', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Mikko Geverola"}', NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carlos.mendoza@trustsearch.ph', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Carlos Mendoza"}', NOW(), NOW(), '', '', '', ''),
-- Buyers  
('550e8400-e29b-41d4-a716-446655440006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'aprillyn.pabroquez@gmail.com', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Aprillyn Pabroquez"}', NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'robert.tan@gmail.com', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Robert Tan"}', NOW(), NOW(), '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jenny.cruz@gmail.com', crypt('password123', gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{"name":"Jenny Cruz"}', NOW(), NOW(), '', '', '', '');

-- Now insert into public.users (this will work because auth.users records exist)
INSERT INTO public.users (id, email, name, role, verified, phone) VALUES
-- Agents
('550e8400-e29b-41d4-a716-446655440001', 'maria.santos@trustsearch.ph', 'Maria Santos', 'agent', true, '+639171234567'),
('550e8400-e29b-41d4-a716-446655440002', 'juan.delacruz@trustsearch.ph', 'Juan Dela Cruz', 'agent', true, '+639181234568'),
('550e8400-e29b-41d4-a716-446655440003', 'anna.reyes@trustsearch.ph', 'Anna Reyes', 'agent', true, '+639191234569'),
('550e8400-e29b-41d4-a716-446655440004', 'mikko.geverola@trustsearch.ph', 'Mikko Geverola', 'agent', true, '+639201234570'),
('550e8400-e29b-41d4-a716-446655440005', 'carlos.mendoza@trustsearch.ph', 'Carlos Mendoza', 'agent', false, '+639211234571'),

-- Buyers
('550e8400-e29b-41d4-a716-446655440006', 'aprillyn.pabroquez@gmail.com', 'Aprillyn Pabroquez', 'buyer', true, '+639221234572'),
('550e8400-e29b-41d4-a716-446655440007', 'robert.tan@gmail.com', 'Robert Tan', 'buyer', true, '+639231234573'),
('550e8400-e29b-41d4-a716-446655440008', 'jenny.cruz@gmail.com', 'Jenny Cruz', 'buyer', false, '+639241234574');

-- Insert Agents
INSERT INTO public.agents (id, user_id, name, email, phone, trust_score, verified, verification_level, reviews_count, average_rating, license_number, agency, bio, specializations, service_areas, years_experience, total_sales) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Maria Santos', 'maria.santos@trustsearch.ph', '+639171234567', 9.2, true, 'premium_verified', 45, 4.8, 'PRC-12345-2019', 'Century 21 Philippines', 'Experienced real estate broker specializing in luxury condominiums and commercial properties in Cebu. Fluent in English, Cebuano, and Filipino.', ARRAY['Luxury Condos', 'Commercial Properties', 'Investment Properties'], ARRAY['Cebu City', 'Mandaue City', 'Lapu-Lapu City'], 8, 156),

('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Juan Dela Cruz', 'juan.delacruz@trustsearch.ph', '+639181234568', 8.7, true, 'document_verified', 32, 4.6, 'PRC-23456-2020', 'Lamudi Philippines', 'Dedicated family home specialist with extensive knowledge of Metro Cebu residential areas. Known for honest dealings and thorough area risk assessments.', ARRAY['Family Homes', 'Townhouses', 'Residential Lots'], ARRAY['Cebu City', 'Talisay City', 'Minglanilla'], 6, 89),

('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Anna Reyes', 'anna.reyes@trustsearch.ph', '+639191234569', 8.3, true, 'document_verified', 28, 4.5, 'PRC-34567-2021', 'Colliers International Philippines', 'Young professional specializing in affordable housing and first-time homebuyer assistance. Expert in government housing programs and financing options.', ARRAY['Affordable Housing', 'First-Time Buyers', 'Government Programs'], ARRAY['Talisay City', 'Minglanilla', 'Naga City'], 4, 67),

('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Mikko Geverola', 'mikko.geverola@trustsearch.ph', '+639201234570', 8.9, true, 'premium_verified', 52, 4.7, 'PRC-45678-2018', 'DMCI Homes', 'Top-performing agent with expertise in pre-selling and investment properties. Consistently ranked in top 10% of agents nationwide for customer satisfaction.', ARRAY['Pre-selling Properties', 'Investment Properties', 'High-rise Condos'], ARRAY['Cebu City', 'Mandaue City', 'Consolacion'], 9, 203),

('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Carlos Mendoza', 'carlos.mendoza@trustsearch.ph', '+639211234571', 6.2, false, 'unverified', 8, 3.8, NULL, 'Independent Agent', 'New agent focusing on budget-friendly properties in suburban areas. Currently working on PRC license verification.', ARRAY['Budget Properties', 'Suburban Homes'], ARRAY['Talisay City', 'Carcar City'], 1, 12);

-- Insert Properties
INSERT INTO public.properties (id, agent_id, location_id, title, description, property_type, listing_type, status, price, bedrooms, bathrooms, parking_spaces, floor_area, lot_area, floors, building_name, amenities, inclusions, nearby_landmarks, trust_score, listing_quality_score, featured, verified, published_at) VALUES
-- Property 1: IT Park Condo (Maria Santos)
('750e8400-e29b-41d4-a716-446655440001', 
 '650e8400-e29b-41d4-a716-446655440001',
 (SELECT id FROM public.locations WHERE barangay = 'IT Park'),
 'Modern 2BR Condo in IT Park',
 'Fully furnished luxury condominium unit in the heart of Cebu IT Park. This modern 2-bedroom, 2-bathroom unit features premium finishes, floor-to-ceiling windows with stunning city views, and access to world-class amenities. Perfect for young professionals working in the IT-BPM industry. The building offers 24/7 security, high-speed internet connectivity, and is walking distance to major offices, restaurants, and entertainment venues.',
 'condo', 'sale', 'active', 750000000, 2, 2, 1, 65.50, NULL, 25,
 'Avalon Condominium',
 ARRAY['Swimming Pool', 'Gym', '24/7 Security', 'High-speed Internet', 'Backup Generator', 'Sky Lounge', 'Function Room'],
 ARRAY['Fully Furnished', 'Air Conditioning', 'Kitchen Appliances', 'Water Heater', 'Cable TV Ready'],
 ARRAY['Ayala Center Cebu', 'SM City Cebu', 'Fuente Circle', 'Capitol Site'],
 9.1, 8.8, true, true, NOW() - INTERVAL '5 days'),

-- Property 2: Banilad Family House (Juan Dela Cruz)
('750e8400-e29b-41d4-a716-446655440002',
 '650e8400-e29b-41d4-a716-446655440002',
 (SELECT id FROM public.locations WHERE barangay = 'Banilad'),
 'Safe Family House in Banilad',
 'Spacious 4-bedroom, 3-bathroom family home in the prestigious Banilad area. This well-maintained house sits on a 300 sqm lot with a beautiful garden and covered parking for 2 cars. The neighborhood is known for its low crime rate, excellent schools, and family-friendly environment. Features include a modern kitchen, spacious living areas, and a private garden perfect for children to play safely.',
 'house', 'sale', 'active', 1200000000, 4, 3, 2, 180.00, 300.00, 2,
 NULL,
 ARRAY['Garden', 'Covered Parking', 'Security Gate', 'CCTV', 'Maids Quarter'],
 ARRAY['Semi-furnished', 'Kitchen Cabinets', 'Bathroom Fixtures', 'Garage Door'],
 ARRAY['Banilad Town Centre', 'University of San Carlos', 'Cebu International School', 'Maria Luisa Park'],
 8.9, 8.5, true, true, NOW() - INTERVAL '3 days'),

-- Property 3: Talisay Townhouse (Anna Reyes)
('750e8400-e29b-41d4-a716-446655440003',
 '650e8400-e29b-41d4-a716-446655440003',
 (SELECT id FROM public.locations WHERE barangay = 'Tabunok'),
 'Affordable Townhouse in Talisay',
 'Great starter home for young families! This 3-bedroom, 2-bathroom townhouse in a secure subdivision offers excellent value for money. The unit features modern design, good natural lighting, and efficient space utilization. Located in a growing community with easy access to schools, shopping centers, and public transportation. Perfect for first-time homebuyers looking for quality housing within budget.',
 'townhouse', 'sale', 'active', 450000000, 3, 2, 1, 120.00, 80.00, 2,
 'Villa Esperanza Subdivision',
 ARRAY['Community Pool', 'Playground', 'Basketball Court', 'Perimeter Fence', '24/7 Security Guard'],
 ARRAY['Basic Kitchen Fixtures', 'Bathroom Fixtures', 'Tiled Floors', 'Painted Walls'],
 ARRAY['Gaisano Grand Mall Talisay', 'Talisay City Hall', 'Sacred Heart School', 'South Road Properties'],
 8.1, 7.8, false, true, NOW() - INTERVAL '7 days'),

-- Property 4: Luxury Ayala Condo (Mikko Geverola)
('750e8400-e29b-41d4-a716-446655440004',
 '650e8400-e29b-41d4-a716-446655440004',
 (SELECT id FROM public.locations WHERE barangay = 'Ayala Business Park'),
 'Premium 3BR Penthouse in Ayala Business Park',
 'Exclusive penthouse unit in Cebu Business Park offering unparalleled luxury and convenience. This 3-bedroom, 3-bathroom unit spans 150 sqm with panoramic views of the city and sea. Features include premium imported fixtures, smart home automation, and access to exclusive amenities. Located in the most prestigious business district with direct access to Ayala Center Cebu.',
 'condo', 'sale', 'active', 1850000000, 3, 3, 2, 150.00, NULL, 45,
 'One Park Drive',
 ARRAY['Infinity Pool', 'Sky Gym', 'Concierge Service', 'Valet Parking', 'Private Elevator', 'Wine Cellar', 'Spa'],
 ARRAY['Fully Furnished', 'Premium Appliances', 'Smart Home System', 'Wine Refrigerator', 'Premium Fixtures'],
 ARRAY['Ayala Center Cebu', 'JY Square Mall', 'Cebu Business Park', 'Waterfront Hotel'],
 9.3, 9.5, true, true, NOW() - INTERVAL '2 days'),

-- Property 5: Budget House (Carlos Mendoza)
('750e8400-e29b-41d4-a716-446655440005',
 '650e8400-e29b-41d4-a716-446655440005',
 (SELECT id FROM public.locations WHERE barangay = 'Tabunok'),
 'Budget-Friendly 2BR House in Talisay',
 'Simple but decent 2-bedroom house perfect for small families on a tight budget. Basic amenities included. Needs some minor repairs but structurally sound. Good investment opportunity.',
 'house', 'sale', 'active', 280000000, 2, 1, 1, 80.00, 100.00, 1,
 NULL,
 ARRAY['Basic Security', 'Water Connection', 'Electrical Connection'],
 ARRAY['Basic Fixtures'],
 ARRAY['Public Market', 'Elementary School'],
 6.5, 6.0, false, false, NOW() - INTERVAL '12 days');

-- Insert Property Images
INSERT INTO public.property_images (property_id, url, alt_text, caption, display_order, is_primary, room_type) VALUES
-- IT Park Condo Images
('750e8400-e29b-41d4-a716-446655440001', '/images/properties/itpark-condo-1.jpg', 'Modern living room with city view', 'Spacious living area with floor-to-ceiling windows', 1, true, 'living_room'),
('750e8400-e29b-41d4-a716-446655440001', '/images/properties/itpark-condo-2.jpg', 'Master bedroom with king bed', 'Comfortable master bedroom with premium furnishing', 2, false, 'bedroom'),
('750e8400-e29b-41d4-a716-446655440001', '/images/properties/itpark-condo-3.jpg', 'Modern kitchen with island', 'Fully equipped kitchen with breakfast bar', 3, false, 'kitchen'),
('750e8400-e29b-41d4-a716-446655440001', '/images/properties/itpark-condo-4.jpg', 'Building exterior and amenities', 'Avalon Condominium building and pool area', 4, false, 'exterior'),

-- Banilad House Images
('750e8400-e29b-41d4-a716-446655440002', '/images/properties/banilad-house-1.jpg', 'House exterior with garden', 'Beautiful family home with landscaped garden', 1, true, 'exterior'),
('750e8400-e29b-41d4-a716-446655440002', '/images/properties/banilad-house-2.jpg', 'Spacious living room', 'Open-plan living and dining area', 2, false, 'living_room'),
('750e8400-e29b-41d4-a716-446655440002', '/images/properties/banilad-house-3.jpg', 'Master bedroom suite', 'Large master bedroom with walk-in closet', 3, false, 'bedroom'),

-- Talisay Townhouse Images
('750e8400-e29b-41d4-a716-446655440003', '/images/properties/talisay-townhouse-1.jpg', 'Townhouse exterior', 'Modern townhouse in secure subdivision', 1, true, 'exterior'),
('750e8400-e29b-41d4-a716-446655440003', '/images/properties/talisay-townhouse-2.jpg', 'Living area', 'Bright and airy living space', 2, false, 'living_room');

-- Insert Property Environmental Tags
INSERT INTO public.property_environmental_tags (property_id, environmental_tag_id) VALUES
-- IT Park Condo Tags
('750e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.environmental_tags WHERE name = 'Low Crime')),
('750e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.environmental_tags WHERE name = 'Business District')),
('750e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.environmental_tags WHERE name = 'Near Hospital')),
('750e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.environmental_tags WHERE name = 'Young Professional')),

-- Banilad House Tags
('750e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.environmental_tags WHERE name = 'Family Friendly')),
('750e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.environmental_tags WHERE name = 'Near School')),
('750e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.environmental_tags WHERE name = 'Quiet Area')),
('750e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.environmental_tags WHERE name = 'Low Crime')),

-- Talisay Townhouse Tags
('750e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.environmental_tags WHERE name = 'Affordable')),
('750e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.environmental_tags WHERE name = 'Growing Area')),
('750e8400-e29b-41d4-a716-446655440003', (SELECT id FROM public.environmental_tags WHERE name = 'Near Mall'));

-- Insert Reviews
INSERT INTO public.reviews (reviewer_id, agent_id, review_type, rating, title, content, transaction_type, transaction_date, transaction_amount, is_verified) VALUES
-- Reviews for Maria Santos
('550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440001', 'agent_review', 5.0, 'Excellent service and very professional', 'Maria helped me find the perfect condo in IT Park. She was very knowledgeable about the area risks and provided detailed information about flood zones and safety. Highly recommended!', 'purchase', '2024-11-15', 750000000, true),

('550e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440001', 'agent_review', 4.5, 'Great agent, very responsive', 'Maria was always available to answer questions and showed me multiple properties that matched my criteria. The AI risk assessment she provided was very helpful.', 'consultation', '2024-12-01', 0, false),

-- Reviews for Juan Dela Cruz  
('550e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440002', 'agent_review', 4.8, 'Honest and trustworthy agent', 'Juan was very honest about the pros and cons of each property. He helped us avoid a house in a flood-prone area and found us a perfect family home in Banilad.', 'purchase', '2024-10-20', 1200000000, true),

-- Reviews for Mikko Geverola
('550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440004', 'agent_review', 4.9, 'Top-notch professional service', 'Mikko exceeded all expectations. His knowledge of investment properties and market trends is impressive. The TrustSearch verification really shows - you can trust his recommendations.', 'purchase', '2024-12-10', 1850000000, true);

-- Update trust scores for all agents (this will trigger the calculation functions)
SELECT public.update_all_agent_trust_scores();
SELECT public.update_all_property_trust_scores();

-- Insert some property views for analytics
INSERT INTO public.property_views (property_id, user_id, ip_address, user_agent, viewed_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL '2 hours'),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', NOW() - INTERVAL '1 hour'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', '192.168.1.102', 'Mozilla/5.0 (Android 11; Mobile)', NOW() - INTERVAL '30 minutes');

-- Final data verification
SELECT 'Data seeding completed successfully!' as status;
SELECT COUNT(*) as total_locations FROM public.locations;
SELECT COUNT(*) as total_agents FROM public.agents;
SELECT COUNT(*) as total_properties FROM public.properties;
SELECT COUNT(*) as total_reviews FROM public.reviews;

-- Manual trust score updates (safer than triggers)
UPDATE public.agents SET trust_score = public.calculate_agent_trust_score(id);
UPDATE public.properties SET trust_score = public.calculate_property_trust_score(id);