# Agroecological Canvas Designer

## Overview

Agroecological Canvas Designer is a web-based visual planning tool for sustainable farming projects. It provides an interactive canvas interface where users can design agricultural layouts using plants, terrain features, and structures. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence through Drizzle ORM.

The application targets agroecology practitioners, permaculture designers, and sustainable farming enthusiasts who need to visualize and plan their agricultural projects in an intuitive, drag-and-drop interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **UI Framework**: Radix UI components with shadcn/ui styling system for consistent, accessible design
- **Styling**: Tailwind CSS with custom design tokens for responsive, mobile-first design
- **State Management**: Tanstack React Query for server state and custom hooks for local state management
- **Routing**: Wouter for lightweight client-side routing
- **Canvas Implementation**: Custom HTML5 Canvas-like interface using React components with zoom, pan, and drawing capabilities
- **Bundler**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM with schema-first approach for type-safe database operations
- **Session Management**: Connect-pg-simple for PostgreSQL-based session storage
- **Development Server**: Hot module replacement with Vite integration for seamless development experience

### Canvas System Design
- **Coordinate System**: Dual coordinate system supporting both pixel-based UI coordinates and real-world meter measurements
- **Element Types**: Plants, terrain features, geometric shapes (rectangles, circles), and structures
- **Tool System**: Multiple drawing tools including select, move, shape drawing, terrain painting, and plant placement
- **Responsive Design**: Adaptive UI that works across mobile, tablet, and desktop devices with touch and mouse support
- **Export System**: Multiple export formats including PNG screenshots and high-resolution exports

### Data Architecture
- **Schema Design**: Shared TypeScript schemas between frontend and backend using Drizzle schema definitions
- **User Management**: Simple user model with username/password authentication structure
- **Type Safety**: End-to-end type safety from database to UI components using TypeScript and Zod validation

### State Management Strategy
- **Canvas State**: Custom undo/redo system with debounced state snapshots for performance
- **Library Management**: Separate state management for plant, terrain, and structure libraries
- **UI State**: Local component state for tool selection, zoom levels, and view settings
- **Responsive State**: Custom responsive hooks for device-specific behavior

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Headless UI primitives for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent icon library for UI elements
- **React Hook Form**: Form state management with validation

### Development Tools
- **Vite**: Build tool with hot module replacement and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking and modern JavaScript features
- **PostCSS**: CSS processing with Tailwind integration

### Canvas and Graphics
- **HTML2Canvas**: Client-side screenshot generation for export functionality
- **React Virtualized**: Efficient rendering for large plant/structure libraries
- **Framer Motion**: Smooth animations and transitions for UI interactions

### Additional Libraries
- **React Query**: Server state management and caching
- **Sonner**: Toast notifications with modern design
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight routing solution for single-page application navigation
- **Class Variance Authority**: Type-safe CSS class composition for component variants

The application is designed to run in development mode with hot reloading and can be built for production deployment with optimized static assets and a Node.js server.