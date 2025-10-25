# Deployment Guide

This guide covers deploying the Pension Calculator application in various environments.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [VPS Deployment](#vps-deployment)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Monitoring & Logs](#monitoring--logs)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The application consists of two main components:

### Frontend (Static)
- Built with Vite + React + TypeScript
- Deployed to **GitHub Pages** (https://mariosbro82.github.io/app/)
- Automatic deployment via GitHub Actions
- No server required

### Backend (API)
- Express.js + PostgreSQL
- Requires hosting on VPS or container platform
- Exposes REST API on port 5000
- Requires PostgreSQL database

---

## Prerequisites

### Required Software
- **Node.js** 18+ (LTS)
- **npm** 9+
- **PostgreSQL** 16+ (or Docker)
- **Git**

### Optional (Recommended)
- **Docker** & **Docker Compose** (for containerized deployment)
- **PM2** (for production process management)
- **Nginx** (for reverse proxy)

---

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/mariosbro82/app.git
cd app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Setup Database
```bash
# Start PostgreSQL locally or via Docker
docker run -d \
  --name pension-postgres \
  -e POSTGRES_USER=pension_user \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=pension_calculator \
  -p 5432:5432 \
  postgres:16-alpine

# Run migrations
npm run db:push
```

### 5. Start Development Server
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Frontend is served by Vite (included in npm run dev)
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

---

## Docker Deployment

The recommended deployment method using Docker Compose.

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with production values
```

### 2. Build and Start
```bash
# Build images and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Run Migrations
```bash
# Access backend container
docker-compose exec backend sh

# Run migrations
npm run db:push
```

### 4. Verify Deployment
```bash
# Check health
curl http://localhost:5000/health

# Check cache stats
curl http://localhost:5000/api/cache/stats
```

### Services Included
- `postgres`: PostgreSQL 16 database
- `backend`: Express API server

### Volumes
- `postgres_data`: Database persistence
- `./logs`: Application logs (mounted from host)

---

## VPS Deployment

Deploy on a Virtual Private Server (Ubuntu 22.04 example).

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (optional, for reverse proxy)
sudo apt install -y nginx
```

### 2. Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database and user
CREATE USER pension_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE pension_calculator OWNER pension_user;
GRANT ALL PRIVILEGES ON DATABASE pension_calculator TO pension_user;
\q
```

### 3. Deploy Application
```bash
# Clone repository
git clone https://github.com/mariosbro82/app.git
cd app

# Install dependencies
npm ci --only=production

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Build backend
npm run build

# Run migrations
npm run db:push
```

### 4. Start with PM2
```bash
# Start application
pm2 start dist/index.js --name pension-backend

# Save PM2 config
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the command output

# Monitor
pm2 monit
pm2 logs pension-backend
```

### 5. Configure Nginx (Optional)
```nginx
# /etc/nginx/sites-available/pension-calculator

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pension-calculator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL with Let's Encrypt (Optional)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info` |
| `BACKEND_URL` | Backend URL for CORS | `http://localhost:5000` |
| `JWT_SECRET` | JWT signing secret (if auth enabled) | - |
| `SESSION_SECRET` | Session secret (if auth enabled) | - |

---

## Database Setup

### Using Docker
```bash
docker run -d \
  --name pension-postgres \
  -e POSTGRES_USER=pension_user \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=pension_calculator \
  -p 5432:5432 \
  -v pension_data:/var/lib/postgresql/data \
  postgres:16-alpine
```

### Using PostgreSQL Service
```bash
# Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE pension_calculator;

-- Create user
CREATE USER pension_user WITH ENCRYPTED PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE pension_calculator TO pension_user;

-- Exit
\q
```

### Run Migrations
```bash
# Using Drizzle Kit
npm run db:push

# Or manually
npx drizzle-kit push
```

### Backup Database
```bash
# Backup
pg_dump -U pension_user pension_calculator > backup_$(date +%Y%m%d).sql

# Restore
psql -U pension_user pension_calculator < backup_20240101.sql
```

---

## Monitoring & Logs

### Application Logs
Logs are stored in `logs/` directory (Winston):
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

### View Logs
```bash
# Docker
docker-compose logs -f backend

# PM2
pm2 logs pension-backend

# Direct
tail -f logs/combined.log
```

### Health Check
```bash
# Check application health
curl http://localhost:5000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 1234.56,
  "environment": "production"
}
```

### Cache Statistics
```bash
curl http://localhost:5000/api/cache/stats
```

### Database Monitoring
```bash
# PostgreSQL stats
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Connection count
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## Troubleshooting

### Backend Won't Start

**Problem:** Port already in use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
kill -9 <PID>
```

**Problem:** Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:** Update `server/middleware/security.ts`:
```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://mariosbro82.github.io',
  'https://your-domain.com',  // Add your domain
];
```

### High Memory Usage

**Problem:** Node.js process using too much memory

**Solution:** Add memory limits to PM2:
```bash
pm2 start dist/index.js --name pension-backend --max-memory-restart 500M
```

### Logs Not Writing

**Problem:** Log files not being created

**Solution:** Check permissions:
```bash
# Create logs directory
mkdir -p logs

# Set permissions
chmod 755 logs

# Check disk space
df -h
```

---

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords in `.env`
- [ ] Set strong `JWT_SECRET` and `SESSION_SECRET`
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Configure firewall (ufw/iptables)
- [ ] Disable PostgreSQL remote access (if not needed)
- [ ] Set up regular database backups
- [ ] Enable rate limiting (already configured)
- [ ] Review CORS allowed origins
- [ ] Set `NODE_ENV=production`
- [ ] Remove unnecessary environment variables
- [ ] Set up monitoring/alerts
- [ ] Configure log rotation

---

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Rebuild
npm run build

# Restart
pm2 restart pension-backend
# OR
docker-compose restart backend
```

### Database Migrations
```bash
# Generate migration
npm run db:push

# Apply migration
npx drizzle-kit push
```

### Log Rotation
```bash
# Install logrotate
sudo apt install logrotate

# Configure (create /etc/logrotate.d/pension-calculator)
/path/to/app/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
}
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/mariosbro82/app/issues
- Documentation: See ARCHITECTURE_REVIEW.md

---

**Last Updated:** 2025-10-25
