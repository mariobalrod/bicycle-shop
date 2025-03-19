# Bicycle Shop

A technical test implementation of a customizable bicycle e-commerce platform for Marcus's shop.

## Live Demo

The application is deployed and can be accessed at: [https://bicycle-shop-factorial.vercel.app/](https://bicycle-shop-factorial.vercel.app/)

### Admin Access Credentials

To access the admin dashboard, use the following credentials:

```
Email: marcus@gmail.com
Password: Test123.
```

## Project Overview

This project implements a web application for a bicycle shop that allows customers to:

- Browse available products
- Customize products with different components
- Add customized products to cart
- Manage inventory and customization rules (admin)

### Key Features

- **Public Pages**:
  - Products listing page
  - Detailed product customization page
  - Shopping cart
- **Admin Dashboard**:
  - Authentication login page
  - Product CRUD operations
  - Category CRUD operations
  - Stock management
  - Properties and options management with incompatibilities
  - Customization rules configuration

### Technical Decisions & Trade-offs

1. **Tech Stack**:

   **Core Framework**:

   - Next.js 14: Full-stack React framework providing SSR, advanced routing, and performance optimization

   **Database & ORM**:

   - PostgreSQL: Relational database system for managing complex component relationships
   - Prisma: Modern ORM with strong typing and automatic TypeScript type generation

   **Infrastructure**:

   - Docker: Development environment containerization for consistency
   - pnpm: Fast and efficient package manager with better dependency handling

   **Authentication & API**:

   - NextAuth.js: Secure and flexible authentication system
   - tRPC: End-to-end typesafe API with seamless React Query integration
   - React Query: Server state management and data caching

   **State Management**:

   - Zustand: Lightweight state management for shopping cart functionality
   - React Query: Server state and cache management

   **UI/UX**:

   - TailwindCSS: Utility-first CSS framework for rapid and consistent styling
   - shadcn/ui: Customizable and reusable UI components
   - Radix UI: Unstyled, accessible UI primitives
   - Storybook: Component development and documentation in isolation

   **Forms & Validation**:

   - React Hook Form: Efficient form handling with validation
   - Zod: TypeScript-first schema validation

   **Testing**:

   - Vitest: Fast and native testing framework for Vite with first-class TypeScript support

   **Developer Tools**:

   - TypeScript: Static typing for better maintainability and DX
   - lucide-react: Modern and customizable icons
   - ESLint + Prettier: Consistent code linting and formatting

2. **Database Design**:

   - Flexible schema to support future product types (skis, surfboards, etc.)
   - Relations between parts to handle forbidden combinations
   - Stock tracking at the component level

3. **Architecture Decisions**:
   - Server-side rendering for better SEO
   - API routes for dynamic operations
   - Modular component structure for reusability

## Getting Started

### Prerequisites

- Node.js 20 or later
- Docker and Docker Compose for database
- pnpm 8 or later
- PostgreSQL 15 (via Docker)

```bash
# Use correct Node version
nvm use

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file with the following variables:

```bash
# Database
POSTGRES_URL="postgresql://postgres:123456@localhost:5432/postgres?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://postgres:123456@localhost:5432/postgres?schema=public"
POSTGRES_HOST="localhost"
POSTGRES_DATABASE="postgres"
POSTGRES_PASSWORD="123456"
POSTGRES_PORT="5432"
POSTGRES_USER="postgres"

# NextAuth
NEXTAUTH_SECRET="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"
```

### Database Setup

```bash
# Create docker volumes
docker volume create bicycle-shop-database

# Create docker containers
docker-compose up -d

# Push Database
pnpm db:push

# Apply dev migrations
pnpm db:migrate

# Generate Prisma types
pnpm db:generate

# Run Database seed script
pnpm db:seed
```

### Development

```bash
# Run development server
pnpm dev

# Run Database Dashboard
pnpm db:studio

# Run Storybook
pnpm storybook

# Run tests
pnpm test
```

## Project Structure

```bash
prisma/                     # Prisma schema & migrations
src/
├── app/                    # Client-side application code
│   ├── (routes)/           # Next.js application routes
│   ├── api/                # Next API route handlers
│   ├── components/         # Shared & Base components
│   ├── styles/             # Global styles and CSS modules
│   └── utils/              # Client-side utility functions
│
├── server/                 # Server-side application code
│   ├── api/                # API implementations
│   ├── trpc/               # tRPC router and procedures
│   ├── auth.ts             # Authentication configuration
│   └── db.ts               # Database client and utilities
│
├── test/                   # Test files and test setup
└── env.js                  # Environment variables validation
```

## Data Models

### Core Entities

#### User

- Authentication and authorization model
- Properties: id, email, role (ADMIN/USER), name, password
- Timestamps: createdAt, updatedAt

#### Category

- Product categorization
- Properties: id, name, slug, description
- Relations: products[]
- Timestamps: createdAt, updatedAt

#### Product

- Main product entity (bicycles, skis, surfboards, etc.)
- Properties: id, name, slug, imageUrl, description, price, type, hasStock
- Relations: category, properties[]
- Timestamps: createdAt, updatedAt
- Supported types: BICYCLE, SKI, SURFBOARD, ROLLER_SKATE, ACCESSORY

#### ProductProperty

- Customizable properties for products
- Properties: id, name
- Relations: product, options[]
- Timestamps: createdAt, updatedAt

#### ProductPropertyOption

- Available options for product properties
- Properties: id, name, hasStock
- Relations: property, incompatibleWith[], incompatibleWithMe[]
- Timestamps: createdAt, updatedAt
- Special feature: Manages incompatibility relationships between options

### Key Relationships

- Products belong to Categories (many-to-one)
- Products have multiple Properties (one-to-many)
- Properties have multiple Options (one-to-many)
- Options can be incompatible with other Options (many-to-many)

## Future Improvements

1. Checkout process implementation with payment gateway integration
2. Enhanced UI/UX design
3. Order management system with status tracking
4. User profile management and order history
5. Email notifications for order updates and stock alerts
6. Performance optimizations and caching strategies

## Development Decisions

1. **Product Customization System**:

   - Properties and options model for flexible product customization
   - Many-to-many relationships for handling incompatible options
   - Database-level constraints for maintaining data integrity
   - Real-time validation during the customization process

2. **Stock Management**:

   - Dual-level stock tracking:
     - Product level: General product availability
     - Option level: Individual component stock status
   - Automatic stock status updates via hasStock boolean flags
   - Independent stock management for each customization option

3. **Authentication & Authorization**:

   - Role-based access control (ADMIN/USER)
   - Secure password handling
   - Protected admin routes and API endpoints
   - NextAuth.js integration for session management

4. **API Architecture**:

   - tRPC for type-safe API development
   - Server-side validation using Zod schemas
   - Centralized error handling
   - Efficient data fetching with React Query

5. **Database Design**:

   - Normalized schema for efficient data management
   - Cascading deletes for maintaining referential integrity
   - Unique constraints for critical fields (slugs, names)
   - Flexible product type system for future expansion

6. **State Management Strategy**:

   - Client-side cart state with Zustand for persistence and performance
   - Clear separation between server and client state
