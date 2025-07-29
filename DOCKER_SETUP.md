# 🐳 Docker Setup - ProjectMoney

Quick setup guide for testing ProjectMoney on macOS/Linux using Docker.

## Prerequisites

- Docker Desktop installed
- Git

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ProjectMoney
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Database: localhost:5432

## What's Included

- ✅ PostgreSQL database with sample data
- ✅ Backend API server (Node.js/Express/Prisma)  
- ✅ Frontend React app (Vite)
- ✅ Automatic database migrations and seeding

## Default Credentials

The system will be seeded with test data including admin accounts.

## Services

| Service  | Port | Description |
|----------|------|-------------|
| Frontend | 5173 | React app with Vite |
| Backend  | 3001 | Node.js API server |
| Database | 5432 | PostgreSQL database |

## Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v && docker-compose up --build
```

## Troubleshooting

### Port conflicts
If ports are already in use, edit `docker-compose.yml` to change port mappings.

### Email features
Email functionality requires valid SMTP credentials in the environment variables.

### Volume permissions
On some systems, you may need to adjust volume permissions:
```bash
sudo chown -R $(whoami) ./server/node_modules ./client/node_modules
```

## Development

For development, you can still run services individually:
- Database only: `docker-compose up postgres`
- Then run backend/frontend locally

## Need Help?

Check the logs: `docker-compose logs service-name`