# VPS Setup Checklist for Gulf Restaurant

## Pre-Deployment Requirements

### 1. VPS Server Requirements
- ✅ **Domain**: www.gulf-restaurant.com (configured)
- ✅ **User**: gulf-restaurant
- ✅ **Root Directory**: /home/gulf-restaurant/htdocs/www.gulf-restaurant.com
- ✅ **Node.js Version**: 22 LTS (as shown in control panel)
- ✅ **App Port**: 3001 (configured in ecosystem.config.js)

### 2. Required Software on VPS
```bash
# Check if these are installed on your VPS:
node --version    # Should be v22.x.x
npm --version     # Should be latest
git --version     # Required for repository cloning
pm2 --version     # Will be auto-installed if missing
```

### 3. Directory Structure Setup
```
/home/gulf-restaurant/
├── htdocs/
│   └── www.gulf-restaurant.com/    # Application files
├── logs/                           # PM2 logs
└── backups/                        # Deployment backups
```

### 4. GitHub Secrets Configuration
Ensure these secrets are set in your GitHub repository:

#### VPS Connection Secrets
- ✅ `VPS_HOST`: 89.116.33.57
- ✅ `VPS_USERNAME`: gulf-restaurant
- ✅ `VPS_SSH_KEY`: Your private SSH key (without passphrase)
- ✅ `VPS_PORT`: 22 (default)

#### Application Environment Secrets
- ⚠️ `MONGODB_URI`: Your MongoDB connection string
- ⚠️ `ADMIN_EMAIL`: Admin login email
- ⚠️ `ADMIN_PASSWORD`: Admin login password
- ✅ `JWT_SECRET`: 5696386e33bebe3ef7cf7e52ed57a5a89ce0fc1e1c2b21576deeefc016687882
- ⚠️ `NEXT_PUBLIC_API_URL`: https://www.gulf-restaurant.com

## Deployment Features

### ✅ Enhanced Deployment Script
- **Initial Setup Detection**: Automatically clones repository on first deployment
- **Directory Management**: Creates all necessary directories
- **Node.js Version Check**: Ensures Node 22 LTS is available
- **PM2 Auto-Installation**: Installs PM2 if not present
- **Environment File Creation**: Generates production .env automatically
- **Backup System**: Creates timestamped backups before updates
- **Startup Script**: Configures PM2 to start on server reboot

### ✅ Comprehensive Health Checks
- **Process Status**: Verifies PM2 application is running
- **Port Verification**: Checks if port 3001 is listening
- **Local HTTP Test**: Tests localhost:3001 connectivity
- **External HTTPS Test**: Tests public domain accessibility
- **Detailed Logging**: Shows PM2 status and recent logs

### ✅ Production Optimizations
- **Single Instance**: Configured for VPS resource efficiency
- **Fork Mode**: Better compatibility than cluster mode
- **Proper Logging**: Logs stored in /home/gulf-restaurant/logs/
- **Graceful Restarts**: Handles application updates smoothly

## Next Steps

### 1. Complete GitHub Secrets Setup
Add the missing environment secrets marked with ⚠️ above.

### 2. Test SSH Connection
```bash
ssh gulf-restaurant@89.116.33.57
```

### 3. Verify VPS Prerequisites
SSH into your VPS and run:
```bash
# Check Node.js version
node --version

# Check if directories exist (will be created automatically)
ls -la /home/gulf-restaurant/

# Check if PM2 is installed (will be installed automatically)
pm2 --version || echo "PM2 will be auto-installed"
```

### 4. Deploy Your Application
- Push to main branch, or
- Manually trigger GitHub Actions workflow

### 5. Monitor Deployment
Watch the GitHub Actions logs for:
- ✅ Successful repository cloning/updating
- ✅ Dependencies installation
- ✅ Application build completion
- ✅ PM2 process start/restart
- ✅ Health check passes

## Troubleshooting

### Common Issues and Solutions

1. **SSH Connection Failed**
   - Verify SSH key is added to VPS control panel
   - Ensure private key in GitHub secrets has no passphrase
   - Check VPS_HOST and VPS_USERNAME are correct

2. **Application Won't Start**
   - Check PM2 logs: `pm2 logs mmp-garage`
   - Verify environment variables are set correctly
   - Ensure MongoDB connection is accessible

3. **Port 3001 Not Accessible**
   - Check if port is open in VPS firewall
   - Verify application is binding to correct port
   - Ensure no other service is using port 3001

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are compatible
   - Review build logs in GitHub Actions

## Security Considerations

- ✅ SSH keys properly configured
- ✅ Environment variables stored as GitHub secrets
- ✅ No sensitive data in repository
- ✅ Production environment isolation
- ⚠️ Consider setting up SSL/TLS certificates
- ⚠️ Configure firewall rules for port 3001
- ⚠️ Set up MongoDB authentication if not already done

## Monitoring and Maintenance

### Regular Tasks
- Monitor PM2 process: `pm2 monit`
- Check application logs: `pm2 logs mmp-garage`
- Review disk space: `df -h`
- Clean old backups: Remove backups older than 30 days

### Performance Monitoring
- CPU usage: `top` or `htop`
- Memory usage: `free -h`
- Network connections: `netstat -tuln`
- Application response time: Use external monitoring tools