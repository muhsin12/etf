# VPS Deployment Guide for MMP Garage

## Overview
This guide explains how to deploy your MMP Garage application to a VPS and manage clean deployments.

## Does VPS Automatically Clean on New Deployments?

**No, VPS deployments do NOT automatically clean previous versions.** Unlike managed platforms (like Vercel, Netlify, or Azure App Service), when you deploy to a VPS, you need to manually manage:

- Old application files
- Dependencies
- Process management
- Database migrations
- Static assets cleanup

## Clean Deployment Process

### 1. Manual Clean Deployment Steps

```bash
# 1. Stop the current application
sudo pm2 stop your-app-name

# 2. Backup current deployment (optional but recommended)
sudo cp -r /var/www/your-app /var/backups/your-app-backup-$(date +%Y%m%d)

# 3. Remove old files
sudo rm -rf /var/www/your-app/*

# 4. Deploy new files
# Option A: Git pull
cd /var/www/your-app
git pull origin main

# Option B: Upload new files
scp -r ./build/* user@your-vps:/var/www/your-app/

# 5. Install dependencies
npm ci --production

# 6. Build application
npm run build

# 7. Restart application
sudo pm2 restart your-app-name
```

### 2. Using the Provided Deployment Script

We've created a deployment script at `scripts/deploy-vps.sh` that automates the clean deployment process:

```bash
# Make the script executable
chmod +x scripts/deploy-vps.sh

# Run the deployment script
./scripts/deploy-vps.sh
```

## Recommended VPS Setup

### 1. Process Manager (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start your application
pm2 start npm --name "mmp-garage" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 2. Reverse Proxy (Nginx)
```nginx
# /etc/nginx/sites-available/mmp-garage
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /_next/static/ {
        alias /var/www/mmp-garage/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /uploads/ {
        alias /var/www/mmp-garage/public/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### 3. Environment Configuration
Create a production `.env` file:

```bash
# Production Environment Variables
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/mmp_garage_prod
ADMIN_EMAIL=admin@mmpgarage.com
ADMIN_PASSWORD=your_secure_production_password
JWT_SECRET=your_production_jwt_secret
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Deployment Strategies

### 1. Blue-Green Deployment
```bash
# Deploy to a new directory
sudo mkdir -p /var/www/mmp-garage-new
# ... deploy to new directory
# Switch symlink when ready
sudo ln -sfn /var/www/mmp-garage-new /var/www/mmp-garage-current
```

### 2. Rolling Deployment
```bash
# Gradually replace files while keeping service running
# Use PM2 cluster mode for zero-downtime deployments
pm2 start ecosystem.config.js
```

## Cleanup Recommendations

### 1. Regular Cleanup Script
```bash
#!/bin/bash
# cleanup-old-deployments.sh

BACKUP_DIR="/var/backups/mmp-garage"
DAYS_TO_KEEP=7

# Remove backups older than 7 days
find "$BACKUP_DIR" -type d -mtime +$DAYS_TO_KEEP -exec rm -rf {} +

# Clean npm cache
npm cache clean --force

# Clean PM2 logs
pm2 flush
```

### 2. Log Rotation
```bash
# Set up log rotation for PM2
sudo nano /etc/logrotate.d/pm2

/home/user/.pm2/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 0644 user user
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Monitoring and Health Checks

### 1. Application Health
```bash
# Check application status
pm2 status
pm2 logs mmp-garage

# Monitor resources
pm2 monit
```

### 2. Database Health
```bash
# MongoDB status
sudo systemctl status mongod

# Check database connection
mongo --eval "db.adminCommand('ismaster')"
```

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure your application port is available
2. **Permission issues**: Check file ownership and permissions
3. **Environment variables**: Verify all required env vars are set
4. **Database connection**: Ensure MongoDB is running and accessible
5. **Static files**: Check nginx configuration for serving static assets

### Quick Fixes:
```bash
# Restart all services
sudo systemctl restart nginx
pm2 restart all

# Check logs
pm2 logs --lines 50
sudo tail -f /var/log/nginx/error.log
```

## Security Considerations

1. **Firewall**: Configure UFW to only allow necessary ports
2. **SSL/TLS**: Use Let's Encrypt for HTTPS
3. **Updates**: Regularly update system packages
4. **Backups**: Implement automated database backups
5. **Monitoring**: Set up monitoring and alerting

## Conclusion

Unlike managed platforms, VPS deployments require manual cleanup and management. Use the provided scripts and follow the recommended practices for smooth, clean deployments of your MMP Garage application.