#!/bin/bash

# Script to help set up Azure resources for ETF Garage application
# This is a helper script and should be customized based on your specific needs

# Exit on error
set -e

# Variables - replace these with your own values
RESOURCE_GROUP="eft-resources"
LOCATION="uksouth"
APP_SERVICE_PLAN="eft-plan"
APP_SERVICE="eft-webapp"
STORAGE_ACCOUNT="etfstore"
STORAGE_CONTAINER="cars"

echo "Creating Azure resources for ETF Garage application..."

# Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create storage account
echo "Creating storage account..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2

# Get storage account connection string
CONNECTION_STRING=$(az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query connectionString \
  --output tsv)

# Create storage container
echo "Creating storage container..."
az storage container create \
  --name $STORAGE_CONTAINER \
  --account-name $STORAGE_ACCOUNT \
  --connection-string "$CONNECTION_STRING" \
  --public-access blob

# Create App Service Plan
echo "Creating App Service Plan..."
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku B1 \
  --is-linux

# Create App Service
echo "Creating App Service..."
az webapp create \
  --name $APP_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "NODE|22-lts"

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
echo "Azure resources created successfully!"
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