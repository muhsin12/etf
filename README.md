# MMP Garage - Second-Hand Car Sales Website

A modern, responsive web application for MMP Garage's second-hand car sales business. Built with Next.js 15, TypeScript, and MongoDB.

## 🌐 Live Website
Visit us at: [https://www.gulf-restaurant.com](https://www.gulf-restaurant.com)

## ✨ Features

- **Car Listings**: Browse and search through available vehicles
- **Admin Dashboard**: Manage car inventory, view enquiries
- **Contact System**: Customer enquiry management
- **Responsive Design**: Mobile-first approach with modern UI
- **Image Management**: Local storage for development, optimized for production
- **SEO Optimized**: Built-in SEO features for better search visibility

## 🚀 Deployment

### VPS Deployment (Production)

The application is configured for deployment to a VPS with automatic GitHub Actions workflow.

#### Quick Deploy
```bash
npm run deploy:vps
```

#### GitHub Actions Deployment
1. Set up GitHub secrets (see [GitHub Secrets Setup](docs/github-secrets-setup.md))
2. Push to `main` branch for automatic deployment
3. Monitor deployment in GitHub Actions tab

#### Manual VPS Setup
See detailed instructions in [VPS Deployment Guide](docs/vps-deployment-guide.md)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Local Setup
```bash
# Clone the repository
git clone <repository-url>
cd etf

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your local configuration

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts and reinstall dependencies
- `npm run deploy:vps` - Deploy to VPS

## 📁 Project Structure

```
src/
├── app/                 # Next.js 15 App Router
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   ├── cars/           # Car listing pages
│   ├── contact/        # Contact page
│   └── about/          # About page
├── components/         # Reusable React components
├── lib/               # Utility libraries
├── models/            # MongoDB/Mongoose models
└── styles/            # CSS styles
```

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/mmp_garage
ADMIN_EMAIL=admin@gulf-restaurant.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=https://www.gulf-restaurant.com
```

### Image Storage
- **Development**: Files stored in `public/uploads/`
- **Production**: Optimized for VPS deployment

## 📚 Documentation

- [VPS Deployment Guide](docs/vps-deployment-guide.md)
- [GitHub Secrets Setup](docs/github-secrets-setup.md)

## 🔒 Security

- JWT-based authentication for admin access
- Environment-based configuration
- Secure file upload handling
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for MMP Garage.

## 📞 Support

For technical support or questions, contact the development team.
