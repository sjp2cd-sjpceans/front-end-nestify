# TrustSearch - AI-Powered Real Estate Trust Engine 🏠🤖

> **Hackathon Project**: An AI-driven real estate search engine for the Philippines that combines verified agent profiles, trust-based ranking, and AI-powered area risk intelligence to help buyers find scam-free, livable homes.

## 🎯 **Project Overview**

TrustSearch addresses the critical trust deficit in Philippine real estate by providing:
- **Trust-Based Property Rankings** - Properties ranked by agent verification and trust scores
- **AI Real Estate Assistant** - Gemini-powered chatbot with local market expertise
- **Area Risk Intelligence** - Comprehensive safety and livability assessments
- **Verified Agent Network** - Only work with document-verified real estate professionals
- **Scam Prevention** - Built-in safeguards to protect buyers from fraudulent listings

## 🚀 **Tech Stack**

### **Frontend**
- **React 18** + **TypeScript** - Modern, type-safe UI development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with responsive design
- **React Router DOM** - Client-side routing

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Secure data access policies
- **Supabase Edge Functions** - Serverless functions for AI integration

### **AI & Intelligence**
- **Google Gemini 1.5 Flash** - Advanced AI for real estate assistance
- **Local JSON Context** - Optimized AI responses with pre-filtered data
- **Intent Recognition** - Smart query parsing for property searches

### **Deployment**
- **Vercel** - Frontend hosting with automatic deployments
- **Supabase Cloud** - Managed database and API services

## ✨ **Key Features**

### 🔍 **Smart Property Search** (FREE)
- Advanced filtering by location, price, property type
- Trust score-based rankings
- Real-time search with optimized performance
- Basic property listings and agent information

### 🤖 **AI Real Estate Assistant** (FREEMIUM)
- **FREE**: General market information and basic property search
- **FREE**: Simple greetings and navigation assistance
- **PREMIUM**: Specific property analysis and detailed insights
- **PREMIUM**: Personalized property recommendations
- **PREMIUM**: Area risk assessments and safety analysis
- **PREMIUM**: Agent verification details and trust score explanations

### 🏡 **Property Detail Pages** (FREEMIUM)
- **FREE**: High-resolution image galleries with thumbnail navigation
- **FREE**: Basic property specifications (price, size, location)
- **FREE**: Agent contact information
- **PREMIUM**: Detailed area risk profiles and safety ratings
- **PREMIUM**: Comprehensive market analysis and price insights
- **PREMIUM**: Advanced property comparison tools

### 🛡️ **Trust & Safety Features**
- **Inclusive Listing Policy**: ALL agents can list properties (including unverified agents)
- **Agent Verification Levels**: Unverified → Document Verified → Premium Verified
- **Trust Score Algorithm**: Based on reviews (40%), verification (30%), listing quality (30%)
- **Ranking by Trust**: Verified agents appear higher in search results, not excluded
- **Promotion Privileges**: Only verified agents can feature/promote listings
- **FREE**: Basic trust scores and verification badges
- **PREMIUM**: Detailed area risk profiles (crime rates, flood risks, safety scores)
- **PREMIUM**: Advanced scam detection insights

### 📱 **Mobile-First Design**
- Responsive design optimized for Philippine mobile users (70%+ mobile traffic)
- Touch-friendly interfaces
- Optimized for slower internet connections
- Progressive Web App capabilities

## 💰 **Freemium Model**

### **🆓 FREE TIER** (Unverified Users)
**Perfect for property browsing and basic research**

#### **✅ What's Included:**
- **Property Search**: Browse all active listings with basic filters (including unverified agent listings)
- **Basic Property Details**: Price, size, location, photos
- **Agent Contact Info**: Name, phone, email, basic verification status
- **Trust Scores**: See agent and property trust ratings (all agents visible)
- **Basic AI Chat**: General market questions, navigation help
- **Mobile App**: Full mobile experience

#### **📱 AI Assistant (Free Features):**
- "Show me properties in Cebu City" (includes all agents)
- "What's the average price in Manila?"
- "How many verified agents are there?"
- General market information and navigation

### **⭐ PREMIUM TIER** (Paid Subscription)
**For serious buyers who want detailed insights and protection**

#### **🔥 Premium Features:**
- **Detailed AI Property Analysis**: Specific property questions and insights
- **Area Risk Intelligence**: Crime rates, flood risks, earthquake zones
- **Market Analytics**: Price trends, neighborhood analysis
- **Advanced Property Comparison**: Side-by-side detailed comparisons
- **Priority Support**: Direct line to customer service
- **Exclusive Listings**: Access to premium-only properties

#### **🤖 AI Assistant (Premium Features):**
- "Is this specific property a good investment?"
- "What are the safety risks in this exact barangay?"
- "Compare these 3 properties for my family"
- "What's the flood risk for this address?"
- "Is the asking price fair for this property?"
- Detailed area insights and personalized recommendations

#### **💳 Pricing:**
- **Monthly**: ₱299/month
- **Annual**: ₱2,999/year (Save 17%)
- **7-Day Free Trial**: Full premium access

### **🎯 Conversion Strategy**
- **Inclusive Platform**: All agents can list, verification improves visibility
- **Trust-Based Ranking**: Verified agents rank higher, unverified still visible
- **Agent Incentives**: Verification unlocks promotion features and higher rankings
- **Soft Paywall**: Allow 3 premium AI questions per day for free users
- **Value Demonstration**: Show preview of premium insights
- **Trust Building**: Prove value with free features first
- **Philippine Pricing**: Affordable for local market (₱10/day)

## 🛠️ **Setup & Installation**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud account (for Gemini API)

### **1. Clone & Install**
```bash
git clone https://github.com/yourusername/trustsearch.git
cd trustsearch
npm install
```

### **2. Environment Configuration**
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### **3. Database Setup**
1. Import the database schema from `supabase/migrations/`
2. Run the SQL scripts in order:
   - `001_create_initial_schema.sql`
   - `002_create_locations_and_risk_profiles.sql`
   - `003_create_properties_and_agents.sql`
   - `004_create_reviews_system.sql`
   - `005_create_rls_policies.sql`
   - `006_create_trust_score_functions.sql`
   - `007_create_property_view_functions.sql`

### **4. Seed Sample Data**
```bash
# Import sample data for demo
psql -h your-db-host -U postgres -d postgres -f supabase/seed/seed_data.sql
```

### **5. Deploy Edge Functions**
```bash
supabase functions deploy ai-chatbot-local
```

### **6. Run Development Server**
```bash
npm run dev
# Open http://localhost:5174
```

## 🎨 **Project Structure**

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── property/        # Property-related components
│   ├── agent/           # Agent-related components
│   └── search/          # Search and filter components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/                 # External service integrations
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
├── constants/           # App constants
└── data/                # Local JSON data for AI context

supabase/
├── migrations/          # Database schema migrations
├── functions/           # Edge Functions
└── seed/               # Sample data
```

## 🚦 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🎯 **Hackathon Demo Features**

### **Live Demo Flow**
1. **Landing Page** - Trust-focused value proposition with freemium model
2. **Property Search** - Filter by location, price, trust score (FREE)
3. **AI Chatbot** - Basic questions free, detailed analysis premium
4. **Property Details** - Basic info free, risk analysis premium
5. **Agent Verification** - Trust scores free, detailed verification premium
6. **Premium Upgrade** - Clear value proposition for paid features

### **Key Demo Points**
- ✅ **Freemium Model** - Clear free vs premium feature distinction
- ✅ **Trust-First Approach** - All properties ranked by trustworthiness
- ✅ **AI Integration** - Smart, context-aware property assistance with paywall
- ✅ **Philippine Context** - Local market knowledge and affordable pricing
- ✅ **Mobile Optimized** - Works perfectly on mobile devices
- ✅ **Real Data** - Connected to live Supabase database

## 🏆 **Hackathon Value Proposition**

### **Problem Solved**
- **Trust Deficit**: 60% of Filipino property buyers report scam concerns
- **Information Gap**: Lack of reliable area safety and livability data
- **Agent Reliability**: Difficulty verifying real estate agent credentials
- **Accessibility**: Premium real estate insights are too expensive for average Filipinos

### **Solution Impact**
- **Buyer Protection**: Verified agents and trust-based rankings (FREE)
- **Informed Decisions**: AI-powered area insights and risk assessments (PREMIUM)
- **Market Transparency**: Open trust scores and verification systems (FREE)
- **Affordable Intelligence**: Premium insights at ₱10/day (PREMIUM)

### **Business Model Innovation**
- **Democratized Access**: Basic property search free for everyone
- **Value-Based Pricing**: Pay only for detailed insights you need
- **Trust Building**: Prove value with free features before asking for payment
- **Philippine Market Fit**: Pricing aligned with local purchasing power

## 🔮 **Future Roadmap**

### **Phase 1** (Current - Hackathon)
- ✅ Core property search and AI chatbot
- ✅ Trust scoring and agent verification
- ✅ Mobile-responsive design

### **Phase 2** (Post-Hackathon)
- 📍 Interactive maps with risk overlays
- 💰 Mortgage calculator integration
- 📊 Market analytics and price predictions
- 🔔 Property alert notifications

### **Phase 3** (Scale)
- 🌏 Expansion to other Southeast Asian markets
- 🤝 Real estate agency partnerships
- 📱 Native mobile apps
- 🏦 Financial services integration
