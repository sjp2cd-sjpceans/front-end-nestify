# TrustSearch Database Setup

This directory contains the database schema, migrations, and seed data for the TrustSearch Philippine Real Estate Platform.

## Overview

TrustSearch uses Supabase (PostgreSQL) as its database with the following key features:
- **Trust Score Calculation**: Automated scoring based on reviews (40%), verification (30%), and listing quality (30%)
- **Philippine Location Support**: Complete hierarchical location structure (Region → Province → City → Barangay)
- **Area Risk Intelligence**: Comprehensive risk assessment including crime, flood, earthquake, and infrastructure data
- **Row Level Security (RLS)**: Secure data access policies
- **Real-time Subscriptions**: Live updates for property listings and reviews

## Database Schema

### Core Tables

1. **users** - User accounts (extends Supabase auth.users)
2. **agents** - Real estate agent profiles with PRC license support
3. **locations** - Philippine geographical locations
4. **risk_profiles** - Area risk intelligence data
5. **properties** - Property listings with trust scores
6. **reviews** - Agent and property reviews
7. **property_images** - Property photos and media

### Business Logic

The database implements TrustSearch business rules:
- **Trust Score Calculation**: Reviews (40%) + Verification (30%) + Listing Quality (30%)
- **Search Ranking**: Trust Score (50%) + Recency (25%) + Relevance (25%)
- **Verification Levels**: Unverified → Document Verified → Premium Verified
- **Agent Promotion**: Only verified agents can feature listings

## Migration Files

Run migrations in order:

1. `001_create_users_and_agents.sql` - User accounts and agent profiles
2. `002_create_locations_and_risk_profiles.sql` - Philippine locations and risk data
3. `003_create_properties_and_images.sql` - Property listings and media
4. `004_create_reviews_and_ratings.sql` - Review system and trust calculations
5. `005_create_rls_policies.sql` - Row Level Security policies
6. `006_create_trust_score_functions.sql` - Business logic functions

## Running Migrations

### Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase project
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push

# Or run individual migrations
supabase db reset --db-url YOUR_DATABASE_URL
```

### Manual Migration

1. Connect to your Supabase database
2. Run each migration file in order
3. Run the seed data file for development data

```sql
-- Run migrations in order
\i supabase/migrations/001_create_users_and_agents.sql
\i supabase/migrations/002_create_locations_and_risk_profiles.sql
\i supabase/migrations/003_create_properties_and_images.sql
\i supabase/migrations/004_create_reviews_and_ratings.sql
\i supabase/migrations/005_create_rls_policies.sql
\i supabase/migrations/006_create_trust_score_functions.sql

-- Load seed data (development only)
\i supabase/seed/seed_data.sql
```

## Seed Data

The seed data includes:
- **12 Philippine locations** (Cebu, Manila, Davao)
- **5 sample agents** with different verification levels
- **5 sample properties** with realistic pricing and details
- **15 environmental tags** for property categorization
- **Risk profiles** for each location
- **Sample reviews** and ratings
- **Property images** and analytics data

### Sample Data Overview

**Locations:**
- Cebu City: IT Park, Banilad, Lahug, Ayala Business Park
- Manila: Makati, BGC, Ortigas, Quezon City
- Davao: Lanang, Matina, Ecoland

**Sample Agents:**
- Maria Santos (Premium Verified, 9.2 trust score)
- Juan Dela Cruz (Document Verified, 8.7 trust score)
- Anna Reyes (Document Verified, 8.3 trust score)
- Mikko Geverola (Premium Verified, 8.9 trust score)
- Carlos Mendoza (Unverified, 6.2 trust score)

**Sample Properties:**
- IT Park Condo: ₱7.5M, 2BR/2BA, Premium location
- Banilad House: ₱12M, 4BR/3BA, Family home
- Talisay Townhouse: ₱4.5M, 3BR/2BA, Affordable
- Ayala Penthouse: ₱18.5M, 3BR/3BA, Luxury
- Budget House: ₱2.8M, 2BR/1BA, Entry-level

## Key Functions

### Trust Score Calculation

```sql
-- Calculate agent trust score
SELECT public.calculate_agent_trust_score('agent_uuid');

-- Calculate property trust score
SELECT public.calculate_property_trust_score('property_uuid');

-- Update all trust scores
SELECT public.update_all_agent_trust_scores();
SELECT public.update_all_property_trust_scores();
```

### Property Search

```sql
-- Search properties with ranking
SELECT * FROM public.search_properties(
    search_query := 'condo IT Park',
    min_price := 500000000,  -- ₱5M in centavos
    max_price := 1000000000, -- ₱10M in centavos
    verified_only := true,
    limit_count := 10
);
```

### Search Ranking

```sql
-- Get search ranking score
SELECT public.calculate_search_ranking_score(
    'property_uuid',
    'search query'
);
```

## Row Level Security (RLS)

The database uses RLS to ensure data security:

- **Public Access**: Active properties, agent profiles, locations, risk data
- **User Access**: Own profile, own reviews, own property views
- **Agent Access**: Own properties, own images, own agent profile
- **Admin Access**: Full access to all data for moderation

## Environment Variables

Set these in your `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Tips

1. **Trust Scores**: Automatically calculated via triggers when reviews/properties change
2. **Price Storage**: Stored in centavos (₱1 = 100 centavos) for precision
3. **Search Performance**: Uses GIN indexes for full-text search
4. **Philippine Context**: All locations use real Philippine administrative divisions
5. **Mobile Optimization**: Designed for 70%+ mobile users in Philippines

## Production Considerations

1. **Backup Strategy**: Regular automated backups
2. **Performance Monitoring**: Monitor query performance and indexes
3. **Security Audits**: Regular RLS policy reviews
4. **Data Validation**: Input validation for Philippine-specific data
5. **Scaling**: Consider read replicas for high traffic

## Support

For database-related issues:
1. Check migration logs
2. Verify RLS policies
3. Test trust score calculations
4. Monitor query performance
5. Review seed data consistency

## Philippine Real Estate Context

This database schema is specifically designed for the Philippine real estate market:
- **PRC License Support**: Professional Regulation Commission licensing
- **Barangay-level Locations**: Smallest administrative unit in Philippines
- **Peso Pricing**: Philippine Peso (₱) with centavo precision
- **Natural Disaster Risks**: Typhoons, earthquakes, floods common in Philippines
- **Trust-based System**: Addresses scam prevalence in Philippine real estate 