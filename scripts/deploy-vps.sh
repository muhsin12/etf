#!/bin/bash

# VPS Deployment Script for MMP Garage
# This script handles clean deployment to a VPS
# Domain: www.gulf-restaurant.com

set -e  # Exit on any error

echo "🚀 Starting VPS deployment for MMP Garage..."

# Configuration
APP_NAME="mmp-garage"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
NODE_VERSION="18"
DOMAIN="www.gulf-restaurant.com"
APP_PORT="3000"

# Create backup of current deployment (if exists)
if [ -d "$APP_DIR" ]; then
    echo "📦 Creating backup of current deployment..."
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$APP_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)"
fi

# Stop current application
echo "🛑 Stopping current application..."
pm2 stop "$APP_NAME" || echo "Application was not running"

# Clean previous deployment
echo "🧹 Cleaning previous deployment..."
sudo rm -rf "$APP_DIR"
sudo mkdir -p "$APP_DIR"

# Clone/copy new application code
echo "📥 Deploying new application..."
# If using Git (recommended)
if [ -d ".git" ]; then
    echo "Using Git deployment..."
    git clone . "$APP_DIR" || (cd "$APP_DIR" && git pull origin main)
else
    echo "Copying files directly..."
    sudo cp -r ./* "$APP_DIR/"
fi

# Set proper ownership
sudo chown -R $USER:$USER "$APP_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$APP_DIR"
npm ci --production

# Build the application
echo "🔨 Building application..."
npm run build

# Set up environment variables
echo "⚙️  Setting up environment..."
if [ ! -f "$APP_DIR/.env" ]; then
    echo "⚠️  Warning: .env file not found. Creating production template..."
    cat > "$APP_DIR/.env" << EOF
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/mmp_garage_prod
ADMIN_EMAIL=admin@gulf-restaurant.com
ADMIN_PASSWORD=your_secure_production_password
JWT_SECRET=your_production_jwt_secret_here
NEXT_PUBLIC_API_URL=https://www.gulf-restaurant.com
EOF
    echo "📝 Please update the .env file with your production values"
fi

# Start application with PM2
echo "🚀 Starting application..."
if pm2 list | grep -q "$APP_NAME"; then
    pm2 restart "$APP_NAME"
else
    pm2 start ecosystem.config.js
fi

# Save PM2 configuration
pm2 save

# Test application
echo "🔍 Testing application..."
sleep 5

if pm2 list | grep -q "$APP_NAME.*online"; then
    echo "✅ Application is running successfully!"
    echo "🌐 Your application should be available at https://$DOMAIN"
    
    # Test local connection
    if curl -f -s "http://localhost:$APP_PORT" > /dev/null; then
        echo "✅ Local application is responding"
    else
        echo "⚠️  Local application test failed - check logs with: pm2 logs $APP_NAME"
    fi
else
    echo "❌ Application failed to start"
    pm2 logs "$APP_NAME" --lines 20
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "📊 Check status with: pm2 status"
echo "📋 View logs with: pm2 logs $APP_NAME"