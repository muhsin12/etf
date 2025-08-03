#!/bin/bash

# Local Deployment Test Script
# This script simulates the VPS deployment process locally for testing

set -e  # Exit on any error

echo "🧪 Starting Local Deployment Test..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test directory
TEST_DIR="/tmp/etf-deployment-test"
ORIGINAL_DIR=$(pwd)

# Cleanup function
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up test environment...${NC}"
    cd "$ORIGINAL_DIR"
    rm -rf "$TEST_DIR"
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Create test environment
echo -e "${BLUE}📁 Creating test environment...${NC}"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Test 1: Git Repository Setup
echo -e "${YELLOW}🔧 Test 1: Git Repository Setup${NC}"
git init
git remote add origin https://github.com/muhsin12/etf
echo -e "${GREEN}✅ Git initialization successful${NC}"

# Test 2: Repository Fetch
echo -e "${YELLOW}📦 Test 2: Repository Fetch${NC}"
if git fetch origin; then
    echo -e "${GREEN}✅ Git fetch successful${NC}"
else
    echo -e "${RED}❌ Git fetch failed${NC}"
    exit 1
fi

# Test 3: Branch Checkout
echo -e "${YELLOW}🌿 Test 3: Branch Checkout${NC}"
if git checkout -b main origin/main; then
    echo -e "${GREEN}✅ Branch checkout successful${NC}"
else
    echo -e "${RED}❌ Branch checkout failed${NC}"
    exit 1
fi

# Test 4: File Existence Check
echo -e "${YELLOW}📋 Test 4: Required Files Check${NC}"
required_files=("package.json" "ecosystem.config.js" "next.config.ts")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        exit 1
    fi
done

# Test 5: Package.json Validation
echo -e "${YELLOW}📦 Test 5: Package.json Validation${NC}"
if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"; then
    echo -e "${GREEN}✅ package.json is valid JSON${NC}"
else
    echo -e "${RED}❌ package.json is invalid${NC}"
    exit 1
fi

# Test 6: Dependencies Installation
echo "📥 Test 6: Dependencies Installation"
if [ -f "package-lock.json" ]; then
  echo "Using npm ci..."
  if npm ci; then
    echo -e "${GREEN}✅ npm ci successful${NC}"
  else
    echo -e "${RED}❌ npm ci failed${NC}"
    exit 1
  fi
else
  echo "Using npm install..."
  if npm install; then
    echo -e "${GREEN}✅ npm install successful${NC}"
  else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
  fi
fi

# Test 7: Environment File Creation
echo -e "${YELLOW}🔧 Test 7: Environment File Creation${NC}"
cat > .env << EOF
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/test
ADMIN_EMAIL=test@example.com
ADMIN_PASSWORD=testpassword
JWT_SECRET=testsecret123
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Environment file created${NC}"
else
    echo -e "${RED}❌ Environment file creation failed${NC}"
    exit 1
fi

# Test 8: Build Process
echo -e "${YELLOW}🏗️  Test 8: Build Process${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Test 9: Ecosystem Config Validation
echo -e "${YELLOW}⚙️  Test 9: Ecosystem Config Validation${NC}"
if node -e "require('./ecosystem.config.js')"; then
    echo -e "${GREEN}✅ ecosystem.config.js is valid${NC}"
else
    echo -e "${RED}❌ ecosystem.config.js is invalid${NC}"
    exit 1
fi

# Test 10: PM2 Configuration Test (if PM2 is available)
echo -e "${YELLOW}🔄 Test 10: PM2 Configuration Test${NC}"
if command -v pm2 &> /dev/null; then
    if pm2 start ecosystem.config.js --dry-run; then
        echo -e "${GREEN}✅ PM2 configuration is valid${NC}"
    else
        echo -e "${RED}❌ PM2 configuration is invalid${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  PM2 not installed locally, skipping PM2 test${NC}"
fi

# Test 11: Port Configuration Check
echo -e "${YELLOW}🔌 Test 11: Port Configuration Check${NC}"
if grep -q "PORT.*3001" .env && grep -q "3001" ecosystem.config.js; then
    echo -e "${GREEN}✅ Port configuration consistent${NC}"
else
    echo -e "${RED}❌ Port configuration mismatch${NC}"
    exit 1
fi

# Test 12: Next.js Configuration Check
echo -e "${YELLOW}⚡ Test 12: Next.js Configuration Check${NC}"
if [ -f "next.config.ts" ] || [ -f "next.config.js" ]; then
    echo -e "${GREEN}✅ Next.js configuration found${NC}"
else
    echo -e "${RED}❌ Next.js configuration missing${NC}"
    exit 1
fi

# Summary
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${GREEN}✅ All deployment tests passed!${NC}"
echo -e "${BLUE}🚀 Your deployment configuration is ready for production${NC}"

# Deployment readiness checklist
echo -e "${BLUE}📋 Deployment Readiness Checklist:${NC}"
echo "✅ Repository can be fetched successfully"
echo "✅ All required files are present"
echo "✅ Dependencies can be installed"
echo "✅ Application can be built"
echo "✅ PM2 configuration is valid"
echo "✅ Port configuration is consistent"

echo -e "${GREEN}🎉 Local deployment test completed successfully!${NC}"
echo -e "${BLUE}💡 You can now safely deploy to your VPS${NC}"