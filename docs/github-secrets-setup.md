# GitHub Secrets Setup for VPS Deployment

## Required GitHub Secrets

To enable automatic deployment to your VPS via GitHub Actions, you need to set up the following secrets in your GitHub repository:

### 1. VPS Connection Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

#### VPS_HOST
- **Name**: `VPS_HOST`
- **Value**: Your VPS IP address or domain (e.g., `gulf-restaurant.com` or `192.168.1.100`)

#### VPS_USERNAME
- **Name**: `VPS_USERNAME`
- **Value**: Your VPS username (e.g., `root` or `ubuntu`)

#### VPS_SSH_KEY
- **Name**: `VPS_SSH_KEY`
- **Value**: Your private SSH key content
- **How to get**: Run `cat ~/.ssh/id_rsa` on your local machine and copy the entire content

#### VPS_PORT (Optional)
- **Name**: `VPS_PORT`
- **Value**: SSH port (default is `22`)

### 2. Application Environment Secrets

#### MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: `mongodb://localhost:27017/mmp_garage_prod`

#### ADMIN_EMAIL
- **Name**: `ADMIN_EMAIL`
- **Value**: `admin@gulf-restaurant.com`

#### ADMIN_PASSWORD
- **Name**: `ADMIN_PASSWORD`
- **Value**: Your secure admin password

#### JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: A secure random string (generate with: `openssl rand -base64 32`)

#### NEXT_PUBLIC_API_URL
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://www.gulf-restaurant.com`

## SSH Key Setup

### 1. Generate SSH Key (if you don't have one)
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

### 2. Copy Public Key to VPS
```bash
ssh-copy-id username@your-vps-ip
```

### 3. Test SSH Connection
```bash
ssh username@your-vps-ip
```

### 4. Get Private Key for GitHub Secret
```bash
cat ~/.ssh/id_rsa
```
Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

## VPS Preparation

Before the first deployment, ensure your VPS has:

### 1. Node.js and npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. PM2 Process Manager
```bash
sudo npm install -g pm2
```

### 3. MongoDB
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 4. Nginx (if not already configured)
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Application Directory
```bash
sudo mkdir -p /var/www/mmp-garage
sudo chown -R $USER:$USER /var/www/mmp-garage
```

### 6. Log Directory
```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

## Deployment Workflow

Once secrets are configured, the deployment will automatically trigger when you:

1. Push to the `main` branch
2. Manually trigger via GitHub Actions tab

The workflow will:
1. ✅ Build the application
2. ✅ Connect to your VPS via SSH
3. ✅ Create a backup of the current deployment
4. ✅ Pull latest changes
5. ✅ Install dependencies
6. ✅ Build the application
7. ✅ Restart with PM2
8. ✅ Perform health checks

## Manual Deployment

You can also deploy manually from your local machine:

```bash
# Make script executable
chmod +x scripts/deploy-vps.sh

# Deploy to VPS
npm run deploy:vps
```

## Troubleshooting

### SSH Connection Issues
- Verify SSH key is correctly added to GitHub secrets
- Test SSH connection manually: `ssh username@your-vps-ip`
- Check VPS firewall settings for SSH port

### Application Not Starting
- Check PM2 logs: `pm2 logs mmp-garage`
- Verify environment variables in `/var/www/mmp-garage/.env`
- Check MongoDB connection

### Domain Not Accessible
- Verify Nginx configuration
- Check SSL certificates
- Ensure DNS is pointing to your VPS IP

## Security Notes

- Never commit sensitive information to your repository
- Use strong passwords for all accounts
- Regularly update your VPS packages
- Monitor application logs for suspicious activity
- Keep SSH keys secure and rotate them periodically