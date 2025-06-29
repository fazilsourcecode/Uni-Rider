# KYKLOS - Campus Motorcycle Sharing Platform

## Overview

KYKLOS is a mobile-first web application designed for campus motorcycle sharing between students and staff. The platform enables users to either rent out their motorcycles (lenders) or rent motorcycles from others (borrowers) within university campuses. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and WebSocket for real-time messaging.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful APIs with WebSocket support for real-time features
- **Database ORM**: Drizzle ORM with type-safe schema definitions
- **Authentication**: Phone number-based OTP verification system

### Database Design
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- Phone number registration with OTP verification
- Role-based access (lender/borrower)
- University-specific user registration
- Profile completion flow with document uploads

### Motorcycle Management
- Motorcycle listing with detailed specifications
- Image gallery support
- Location-based search with geospatial queries
- Availability management

### Booking System
- Date/time-based booking with conflict prevention
- Payment method selection
- Booking status tracking (pending, confirmed, active, completed, cancelled)
- Real-time booking confirmations

### Messaging System
- WebSocket-based real-time messaging
- Booking-specific chat threads
- Message persistence and retrieval

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface components
- Progressive web app capabilities

## Data Flow

1. **User Registration**: Phone → OTP verification → Profile setup → Dashboard
2. **Motorcycle Discovery**: Search/Browse → Filter → Map view → Details
3. **Booking Process**: Select dates → Choose payment → Confirm → Real-time notification
4. **Communication**: Booking-triggered chat → Real-time messaging → Persistent history

## External Dependencies

### Frontend Dependencies
- **UI/UX**: Radix UI primitives, Lucide React icons, React Icons
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation
- **State Management**: TanStack Query for server state synchronization

### Backend Dependencies
- **Database**: Drizzle ORM, Neon serverless PostgreSQL
- **WebSocket**: ws library for real-time communication
- **Validation**: Zod for runtime type checking
- **Session Management**: connect-pg-simple for PostgreSQL session store

### Development Tools
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full type safety across frontend and backend
- **Development**: Replit-specific plugins for enhanced development experience

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- tsx for TypeScript execution in development
- Concurrent frontend and backend development with proxy setup

### Production Build
- Frontend: Vite build process generating static assets
- Backend: esbuild bundling with ES module output
- Single-server deployment with static file serving

### Database Management
- Schema migrations through Drizzle Kit
- Environment-based configuration for different deployment stages
- Connection pooling for production scalability

## Changelog

- June 29, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.