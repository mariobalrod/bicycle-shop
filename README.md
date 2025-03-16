# Bicycle Shop

## Getting Started

```bash
# Install dependencies
pnpm install

# Create a .env file and add the following variables

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

# Run
pnpm dev

# Run Database Dashboard
pnpm db:studio
```
