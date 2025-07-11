#!/bin/bash

# Script to help configure existing Azure resources for ETF Garage application
# This script assumes you already have Azure resources created

# Exit on error
set -e

# Variables - replace these with your own values
RESOURCE_GROUP="eft-resources"
APP_SERVICE="eft-webapp"
STORAGE_ACCOUNT="etfstore"
STORAGE_CONTAINER="cars"

echo "Configuring existing Azure resources for ETF Garage application..."

# Check if user is logged in to Azure CLI
az account show > /dev/null 2>&1 || { echo "Please login to Azure CLI first using 'az login'"; exit 1; }

# Get storage account connection string
echo "Getting storage account connection string..."
CONNECTION_STRING=$(az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query connectionString \
  --output tsv)

# Verify storage container exists or create it
echo "Verifying storage container exists..."
CONTAINER_EXISTS=$(az storage container exists \
  --name $STORAGE_CONTAINER \
  --account-name $STORAGE_ACCOUNT \
  --connection-string "$CONNECTION_STRING" \
  --query exists \
  --output tsv)

if [ "$CONTAINER_EXISTS" = "false" ]; then
  echo "Creating storage container..."
  az storage container create \
    --name $STORAGE_CONTAINER \
    --account-name $STORAGE_ACCOUNT \
    --connection-string "$CONNECTION_STRING" \
    --public-access blob
fi

# Configure App Service settings
echo "Configuring App Service settings..."
az webapp config appsettings set \
  --name $APP_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --settings \
  NODE_ENV=production \
  AZURE_STORAGE_CONTAINER_NAME=$STORAGE_CONTAINER

# Get publish profile
echo "Getting publish profile..."
az webapp deployment list-publishing-profiles \
  --name $APP_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --xml > publish_profile.xml

echo ""
echo "Azure resources configured successfully!"
echo ""
echo "Next steps:"
echo "1. Add the following secrets to your GitHub repository:"
echo "   - AZURE_WEBAPP_PUBLISH_PROFILE: content of publish_profile.xml"
echo "   - AZURE_STORAGE_CONNECTION_STRING: $CONNECTION_STRING"
echo "   - AZURE_STORAGE_CONTAINER_NAME: $STORAGE_CONTAINER"
echo "   - MONGODB_URI: Your production MongoDB connection string"
echo "   - ADMIN_EMAIL: Admin email for production"
echo "   - ADMIN_PASSWORD: Admin password for production"
echo "   - JWT_SECRET: A secure random string for JWT signing"
echo "   - NEXT_PUBLIC_API_URL: https://$APP_SERVICE.azurewebsites.net"
echo ""
echo "2. Push your code to the main branch to trigger the deployment"
echo ""
echo "Note: The publish_profile.xml file contains sensitive information. Keep it secure and delete it after adding to GitHub secrets."