# ETF Garage - Second-Hand Car Sales Website

A modern web application for ETF Garage's second-hand car sales business, built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- **Car Listings**: Browse available cars with detailed information and images
- **Advanced Filtering**: Filter cars by make, model, year, price, mileage, and more
- **Car Details**: View comprehensive information about each car
- **Enquiry System**: Submit enquiries about specific cars
- **Admin Dashboard**: Manage car listings and handle customer enquiries
- **Image Management**: Upload and manage multiple car images (local storage in development, Azure Blob Storage in production)
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Image Storage**: 
  - Development: Local file system
  - Production: Azure Blob Storage
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 16.8 or later
- MongoDB instance
- Azure Storage account and container (for production)
- Git

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd etf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy the example environment file:
     ```bash
     cp env.example .env.local
     ```
   - Update the `.env.local` file with your configuration values

## Image Storage Configuration

### Development Mode

In development mode, images are stored locally in the `/public/uploads` directory. These images are accessible via the `/uploads` URL path.

### Production Mode

In production, images are stored in Azure Blob Storage. You need to configure the following environment variables:

- `AZURE_STORAGE_CONNECTION_STRING`: Your Azure Storage connection string
- `AZURE_STORAGE_CONTAINER_NAME`: The name of your Azure Storage container (defaults to 'cars')

## Running the Application

### Development

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Admin Access

To access the admin dashboard, navigate to `/admin` and log in with the credentials specified in your `.env` file.

## Deployment

### Azure Deployment Pipeline

This project is configured with a GitHub Actions workflow to automatically deploy to Azure App Service and use Azure Storage for image storage.

#### Prerequisites for Deployment

1. **Azure Resources**:
   - Azure App Service plan and App Service
   - Azure Storage account with a blob container

2. **GitHub Secrets**:
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: The publish profile from your Azure App Service
   - `MONGODB_URI`: Your production MongoDB connection string
   - `AZURE_STORAGE_CONNECTION_STRING`: Your Azure Storage connection string
   - `AZURE_STORAGE_CONTAINER_NAME`: Your Azure Storage container name
   - `ADMIN_EMAIL`: Admin email for the production environment
   - `ADMIN_PASSWORD`: Admin password for the production environment
   - `JWT_SECRET`: JWT secret for authentication
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed application

#### Deployment Process

The deployment process is automated through GitHub Actions:

1. Push changes to the `main` branch
2. GitHub Actions workflow builds the application
3. The built application is deployed to Azure App Service
4. Images are stored in Azure Blob Storage

#### Configuring Existing Azure Resources

If you already have Azure resources created, you can use the provided script to configure them for deployment:

1. Edit the configuration script with your resource names:
   ```bash
   # Open and edit the script with your resource names
   nano scripts/configure-existing-azure.sh
   ```

2. Run the configuration script:
   ```bash
   ./scripts/configure-existing-azure.sh
   ```

3. Follow the instructions to set up GitHub secrets

For detailed instructions, see the [Azure Deployment Guide](docs/azure-deployment-guide.md).

## License

[MIT](LICENSE)
