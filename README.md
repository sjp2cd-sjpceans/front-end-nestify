# Nestify - Real Estate Web Platform

This project is a real estate web platform built with React, TypeScript, and Vite, enhanced with TanStack Query for data fetching and state management, and Axios for HTTP requests. Nestify aims to provide a modern, responsive interface for property seekers and real estate agents.

## Project Overview

Nestify offers a dual-interface platform:
- **For Clients**: Browse properties, save favorites, contact agents, and receive personalized recommendations
- **For Agents/Brokers**: Manage listings, respond to inquiries, and track performance metrics

The platform features AI-powered search capabilities, a modern UI with Tailwind CSS, and a responsive design for all devices.

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better developer experience
- **Vite**: Next-generation frontend tooling for faster development
- **TanStack Query**: Data fetching and state management library
- **Axios**: Promise-based HTTP client for making API requests
- **Tailwind CSS**: Utility-first CSS framework

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

## Project Structure

- `src/` - Source code for the application
  - `components/` - React components
    - `common/` - Generic components (buttons, inputs, cards)
    - `layout/` - Layout components (header, footer, sidebar)
    - `features/` - Feature-specific components
  - `pages/` - Page components corresponding to routes
  - `hooks/` - Custom React hooks
  - `services/` - API services using Axios
  - `utils/` - Utility functions
  - `types/` - TypeScript type definitions
  - `context/` - React context providers
  - `assets/` - Static assets (images, fonts)
  - `styles/` - Global styles and Tailwind configuration
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point

### Key Entry Points

- `src/main.tsx` - Application entry point that sets up React, TanStack Query, and renders the App component
- `src/App.tsx` - Main application component that sets up routing

## Component Organization

Components are organized into three main categories:

1. **Common Components** - Reusable UI elements used across the application
   - Button variants (primary, secondary, tertiary)
   - Form inputs (text, select, checkbox)
   - Cards, modals, and icons

2. **Layout Components** - Components that define the structure of pages
   - Header with navigation
   - Footer with links
   - Sidebar for dashboard navigation
   - Container components for consistent page width

3. **Feature Components** - Components specific to certain features
   - PropertyCard for listing displays
   - AgentProfile for agent information
   - SearchFilters for property filtering
   - ChatInterface for messaging
   - AISearchBar for smart search

## Pages and Routing

The application includes the following main pages:

- **Landing Page** - Welcome interface with hero section and CTAs
- **Login Page** - Authentication page for users
- **Dashboard** - Role-based dashboard (Client or Agent/Broker)
- **AI Search Page** - Smart search interface with filters
- **Listings Page** - Grid-style property browser
- **Property Details Page** - Detailed view of a property
- **Agent/Broker Profile** - Public profile page
- **Saved Properties** - List of bookmarked properties
- **Notifications** - User notifications center
- **Messages** - Chat interface for communication
- **Settings** - User profile and preferences

## API Integration

API services are organized in the `src/services` directory:

- Base Axios configuration
- Service modules for authentication, properties, users, and messaging
- TanStack Query for data fetching, caching, and state management
- Custom hooks that encapsulate query logic

## Design System

### Color Palette

- Deep Navy (`#002B5C`) - Primary navigation bar, CTAs, headers
- Gold (`#FFD700`) - Accent for icons, highlight, buttons
- White (`#FFFFFF`) - Backgrounds and content blocks
- Light Gray (`#F8F9FA`) - Neutral backdrop for cards/sections
- Slate Gray (`#6B7280`) - Muted text, placeholder labels

### UI Components

All components feature:
- Rounded corners
- Soft drop shadows
- Generous white space
- Responsive design with mobile-first approach

## Role-Based Features

### Client Features

- Personalized property recommendations
- Saved properties list
- Property search and filtering
- Agent contact and messaging
- Viewing history

### Agent/Broker Features

- Listing management (add, edit, delete)
- Client inquiries and messaging
- Performance metrics dashboard
- Listing approval status
- Profile customization

## Development Guidelines

- Mobile-first responsive design approach
- Component-based architecture
- Type safety with TypeScript
- API integration with TanStack Query and Axios
- Consistent styling with Tailwind CSS

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally
