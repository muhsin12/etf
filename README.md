# ETF Garage - Second-Hand Car Sales Website

A modern web application for ETF Garage's second-hand car sales business, built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- **Car Listings**: Browse available cars with detailed information and images
- **Advanced Filtering**: Filter cars by make, model, year, price, mileage, and more
- **Car Details**: View comprehensive information about each car
- **Enquiry System**: Submit enquiries about specific cars
- **Admin Dashboard**: Manage car listings and handle customer enquiries
- **Image Management**: Upload and manage multiple car images using AWS S3
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Image Storage**: AWS S3
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 16.8 or later
- MongoDB instance
- AWS S3 bucket and credentials
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

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create required collections

5. **AWS S3 Setup**
   - Create an S3 bucket
   - Configure bucket permissions for public read access
   - Update AWS credentials in `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── cars/              # Car listing pages
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
├── models/                # Mongoose models
└── middleware.ts          # Authentication middleware
```

## Admin Features

- Secure admin login
- Manage car listings (add, edit, delete)
- Upload multiple car images
- Handle customer enquiries
- Track enquiry status

## Security Features

- JWT-based authentication
- HTTP-only cookies
- Protected admin routes
- Secure image upload
- Input validation
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
