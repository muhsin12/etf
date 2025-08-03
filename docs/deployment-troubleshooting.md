# VPS Deployment Troubleshooting Guide

## Common Deployment Issues and Solutions

### 1. Git Authentication Issues

**Error**: `fatal: could not read Username for 'https://github.com': No such device or address`

**Cause**: Git clone over HTTPS requires authentication credentials that aren't available in the SSH session.

**Solution**: ✅ **Fixed** - Changed from `git clone` to `git init` + `git fetch` approach:
```bash
git init
git remote add origin https://github.com/repository
git fetch origin
git checkout -b main origin/main
```

### 2. NPM CI Package Lock Issues

**Error**: `The npm ci command can only install with an existing package-lock.json`

**Cause**: `npm ci` requires an existing `package-lock.json` file, but the repository wasn't fully cloned.

**Solution**: ✅ **Fixed** - Added fallback logic:
```bash
if [ -f "package-lock.json" ]; then
  npm ci --omit=dev
else
  npm install --production
fi
```

### 3. Missing Package.json

**Error**: `Could not read package.json: Error: ENOENT: no such file or directory`

**Cause**: Repository files weren't properly pulled to the VPS.

**Solution**: ✅ **Fixed** - Added existence checks before operations:
```bash
if [ -f "package.json" ]; then
  npm run build
else
  echo "❌ package.json not found! Repository may not have been pulled correctly."
  exit 1
fi
```

### 4. PM2 Configuration File Missing

**Error**: `File ecosystem.config.js not found`

**Cause**: PM2 configuration file wasn't available due to incomplete repository setup.

**Solution**: ✅ **Fixed** - Added fallback PM2 configuration:
```bash
if [ -f "ecosystem.config.js" ]; then
  pm2 start ecosystem.config.js
else
  pm2 start npm --name "mmp-garage" -- start
fi
```

## Enhanced Deployment Features

### 1. Robust Git Setup
- ✅ Uses `git init` instead of `git clone` for better authentication handling
- ✅ Properly sets up remote origin
- ✅ Creates and checks out main branch

### 2. Smart Dependency Management
- ✅ Checks for `package-lock.json` existence
- ✅ Uses `npm ci --omit=dev` when available
- ✅ Falls back to `npm install --production` when needed
- ✅ Handles deprecated `--production` flag

### 3. File Existence Validation
- ✅ Validates `package.json` before building
- ✅ Validates `ecosystem.config.js` before PM2 operations
- ✅ Provides clear error messages for missing files

### 4. Fallback Mechanisms
- ✅ Fallback PM2 configuration if ecosystem.config.js is missing
- ✅ Alternative npm commands if preferred methods fail
- ✅ Graceful error handling with informative messages

## Pre-Deployment Checklist

### Repository Requirements
- [ ] Repository is public or SSH keys are properly configured
- [ ] `package.json` exists in repository root
- [ ] `package-lock.json` is committed to repository
- [ ] `ecosystem.config.js` is present and configured
- [ ] Build script is defined in `package.json`

### VPS Requirements
- [ ] Node.js 22 LTS is installed
- [ ] Git is installed and configured
- [ ] SSH access is working
- [ ] Directory permissions are correct
- [ ] PM2 is installed (or will be auto-installed)

### GitHub Secrets
- [ ] `VPS_HOST` - Your VPS IP address
- [ ] `VPS_USERNAME` - VPS username
- [ ] `VPS_SSH_KEY` - Private SSH key (no passphrase)
- [ ] `VPS_PORT` - SSH port (usually 22)
- [ ] `MONGODB_URI` - Database connection string
- [ ] `ADMIN_EMAIL` - Admin login email
- [ ] `ADMIN_PASSWORD` - Admin login password
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `NEXT_PUBLIC_API_URL` - Public API URL

## Debugging Commands

### Check Repository Status
```bash
ssh gulf-restaurant@your-vps-ip
cd /home/gulf-restaurant/htdocs/www.gulf-restaurant.com
ls -la
git status
git remote -v
```

### Check Node.js Environment
```bash
node --version
npm --version
which node
which npm
```

### Check PM2 Status
```bash
pm2 status
pm2 logs mmp-garage
pm2 describe mmp-garage
```

### Check Application Files
```bash
ls -la package.json
ls -la ecosystem.config.js
ls -la .env
cat .env
```

### Check Network Connectivity
```bash
netstat -tuln | grep 3001
curl -I http://localhost:3001
curl -I https://www.gulf-restaurant.com
```

## Recovery Procedures

### 1. Clean Restart
```bash
# Stop all PM2 processes
pm2 stop all
pm2 delete all

# Remove application directory
rm -rf /home/gulf-restaurant/htdocs/www.gulf-restaurant.com

# Re-run deployment
# (GitHub Actions will recreate everything)
```

### 2. Manual Repository Setup
```bash
cd /home/gulf-restaurant/htdocs/www.gulf-restaurant.com
git init
git remote add origin https://github.com/your-username/etf
git fetch origin
git checkout -b main origin/main
```

### 3. Manual Dependency Installation
```bash
cd /home/gulf-restaurant/htdocs/www.gulf-restaurant.com
npm install --production
npm run build
```

### 4. Manual PM2 Setup
```bash
cd /home/gulf-restaurant/htdocs/www.gulf-restaurant.com
pm2 start npm --name "mmp-garage" -- start
pm2 save
pm2 startup
```

## Monitoring and Maintenance

### Regular Health Checks
```bash
# Check application status
pm2 status

# Check application logs
pm2 logs mmp-garage --lines 50

# Check system resources
free -h
df -h
top
```

### Log Management
```bash
# Rotate PM2 logs
pm2 flush

# Check log files
ls -la /home/gulf-restaurant/logs/

# Monitor real-time logs
tail -f /home/gulf-restaurant/logs/mmp-garage.log
```

### Backup Management
```bash
# List backups
ls -la /home/gulf-restaurant/backups/

# Clean old backups (keep last 7 days)
find /home/gulf-restaurant/backups/ -type d -mtime +7 -exec rm -rf {} +
```

## Performance Optimization

### 1. PM2 Configuration
- Use single instance for VPS (avoid cluster mode overhead)
- Set appropriate memory limits
- Configure log rotation
- Enable graceful shutdowns

### 2. Node.js Optimization
- Use production environment variables
- Enable compression
- Optimize build process
- Use proper caching headers

### 3. System Optimization
- Configure firewall rules
- Set up reverse proxy (Nginx)
- Enable SSL/TLS certificates
- Monitor system resources

## Security Best Practices

### 1. SSH Security
- Use SSH keys instead of passwords
- Disable root login
- Change default SSH port
- Use fail2ban for brute force protection

### 2. Application Security
- Keep dependencies updated
- Use environment variables for secrets
- Enable HTTPS
- Implement proper authentication

### 3. System Security
- Keep system packages updated
- Configure firewall
- Monitor system logs
- Regular security audits