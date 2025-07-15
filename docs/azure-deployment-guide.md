# Azure Deployment Guide for MMP Garage

This guide explains how to configure existing Azure resources and set up GitHub Actions for deploying the MMP Garage application.

## Prerequisites

- Azure account with active subscription
- Existing Azure resources (Resource Group, App Service, Storage Account)
- GitHub account with repository access
- Azure CLI installed locally

## Configuring Azure Resources

### Option 1: Using the Configuration Script for Existing Resources

We've provided a helper script to configure your existing Azure resources:

1. Make sure you have Azure CLI installed and are logged in:
   ```bash
   az login
   ```

2. Edit the configuration script to use your existing resource names:
   ```bash
   # Open the script and update these variables with your existing resource names
   RESOURCE_GROUP="your-resource-group"
   APP_SERVICE="your-app-service-name"
   STORAGE_ACCOUNT="your-storage-account"
   STORAGE_CONTAINER="cars"
   ```

3. Run the configuration script:
   ```bash
   ./scripts/configure-existing-azure.sh
   ```

4. Follow the instructions provided by the script to add GitHub secrets.

### Option 2: Manual Configuration

#### 1. Configure Existing Azure Resources

1. **Get Storage Account Connection String**:
   ```bash
   az storage account show-connection-string \
     --name your-storage-account \
     --resource-group your-resource-group \
     --query connectionString \
     --output tsv
   ```

2. **Verify or Create Storage Container**:
   First, check if the container exists:
   ```bash
   az storage container exists \
     --name cars \
     --account-name your-storage-account \
     --connection-string "<connection-string>" \
     --query exists \
     --output tsv
   ```
   
   If it doesn't exist, create it:
   ```bash
   az storage container create \
     --name cars \
     --account-name your-storage-account \
     --connection-string "<connection-string>" \
     --public-access blob
   ```

3. **Configure App Service Settings**:
   ```bash
   az webapp config appsettings set \
     --name your-app-service \
     --resource-group your-resource-group \
     --settings \
     NODE_ENV=production \
     AZURE_STORAGE_CONTAINER_NAME=cars
   ```

4. **Get Publish Profile**:
   ```bash
   az webapp deployment list-publishing-profiles \
     --name your-app-service \
     --resource-group your-resource-group \
     --xml > publish_profile.xml
   ```

## Setting Up GitHub Actions

1. **Add GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `AZURE_WEBAPP_PUBLISH_PROFILE`: Content of the publish_profile.xml file
     - `MONGODB_URI`: Your production MongoDB connection string
     - `AZURE_STORAGE_CONNECTION_STRING`: Your Azure Storage connection string
     - `AZURE_STORAGE_CONTAINER_NAME`: Your Azure Storage container name (e.g., "cars")
     - `ADMIN_EMAIL`: Admin email for the production environment
     - `ADMIN_PASSWORD`: Admin password for the production environment
     - `JWT_SECRET`: A secure random string for JWT signing
     - `NEXT_PUBLIC_API_URL`: The URL of your deployed application (e.g., https://etf-garage.azurewebsites.net)

2. **Workflow File**:
   - The GitHub Actions workflow file is already created at `.github/workflows/azure-deploy.yml`
   - This workflow will automatically deploy your application when you push to the main branch

## Verifying Deployment

1. Push changes to the main branch to trigger the deployment:
   ```bash
   git add .
   git commit -m "Configure Azure deployment"
   git push origin main
   ```

2. Monitor the deployment in the GitHub Actions tab of your repository

3. Once deployed, your application will be available at your App Service URL (e.g., https://eft-webapp.azurewebsites.net)

## Troubleshooting

### Common Issues

1. **Deployment Failures**:
   - Check the GitHub Actions logs for detailed error messages
   - Verify that all secrets are correctly set
   - Ensure the publish profile is valid and up-to-date

2. **Image Upload Issues**:
   - Verify the Azure Storage connection string is correct
   - Check that the container name matches in both the application and the storage account
   - Ensure the container has the correct public access level (blob)

3. **Application Errors**:
   - Check the App Service logs in the Azure Portal
   - Verify environment variables are correctly set
   - Test the MongoDB connection from the App Service

### Updating Secrets

If you need to update any secrets:

1. Generate a new publish profile if needed:
   ```bash
   az webapp deployment list-publishing-profiles \
     --name your-app-service \
     --resource-group your-resource-group \
     --xml > publish_profile.xml
   ```

2. Update the corresponding GitHub secret with the new value

## Security Considerations

1. **Connection Strings and Secrets**:
   - Never commit sensitive information to the repository
   - Always use GitHub Secrets for storing sensitive values
   - Regularly rotate passwords and secrets

2. **Storage Security**:
   - Consider using Shared Access Signatures (SAS) for more granular access control
   - Implement proper CORS settings if accessing storage directly from the browser

3. **App Service Security**:
   - Enable HTTPS only
   - Consider implementing IP restrictions for admin routes
   - Use managed identities for Azure resource access when possible