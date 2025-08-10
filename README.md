# Rental Asset Management Web App

A full-stack web application for managing rental assets, built with Nuxt.js (Vue.js) frontend and Node.js/Express backend.

## Хэрэглэгчийн эрхийн систем

### 1. Admin/Manager эрх
- **Хандах хуудаснууд**: Dashboard, Assets, Renters, Rentals, Reports, Settings
- **Layout**: Default admin layout (хажуу navigation)
- **Route protection**: Admin middleware ашиглана

### 2. User эрх (энгийн хэрэглэгч)  
- **Хандах хуудаснууд**: pages-user хавтасны хуудаснууд (cars, estate, agencies гэх мэт)
- **Layout**: User layout (дээд navigation)
- **Route protection**: User middleware ашиглана

### Тест хэрэглэгчид:
```bash
cd backend
node scripts/createTestUsers.js
```
- **admin@test.com** / password123 (admin эрх)
- **manager@test.com** / password123 (manager эрх) 
- **user@test.com** / password123 (user эрх)

## Features

- 🔐 User authentication and authorization with role-based access
- 🏠 Asset management (properties, equipment, etc.)
- 👥 Renter management
- 📋 Rental agreement tracking
- 📄 Document management
- 📊 Dashboard with analytics
- 🎨 Modern UI with Vuetify
- 👨‍💼 Admin panel for business management
- 🌐 User-friendly public interface

## Tech Stack

### Frontend
- **Nuxt.js 4** - Vue.js framework
- **Vuetify 3** - Material Design component library
- **Pinia** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Environment Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd rental-asset-management-web-app
```

### 2. Frontend Environment Setup

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` file with your configuration:
```env
# Frontend Environment Variables
API_BASE=http://localhost:3001
NODE_ENV=development
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

### 3. Backend Environment Setup

Navigate to the server directory:
```bash
cd server
cp env.example .env
```

Edit `server/.env` file with your configuration:
```env
# Backend Environment Variables
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rental-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Installation & Running

### 1. Install Frontend Dependencies
```bash
# From the root directory
npm install
```

### 2. Install Backend Dependencies
```bash
# From the server directory
cd server
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on your system. If using a local installation:
```bash
# Start MongoDB service
mongod
```

### 4. Run the Application

#### Option A: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# From the root directory
npm run dev
```

#### Option B: Use the provided scripts

Create a `package.json` script to run both services:
```bash
# Add this to the root package.json scripts
"dev:full": "concurrently \"npm run dev\" \"cd server && npm run dev\""
```

Then run:
```bash
npm run dev:full
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Assets
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Rentals
- `GET /api/rentals` - Get all rentals
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/:id` - Update rental
- `DELETE /api/rentals/:id` - Delete rental

### Renters
- `GET /api/renters` - Get all renters
- `POST /api/renters` - Create new renter
- `PUT /api/renters/:id` - Update renter
- `DELETE /api/renters/:id` - Delete renter

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd server
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
```

## Production Deployment

### Environment Variables for Production
Update your environment files with production values:
- Use a strong JWT secret
- Set up a production MongoDB instance
- Configure proper CORS origins
- Set NODE_ENV=production

### Build and Deploy
```bash
# Frontend
npm run build

# Backend
cd server
npm start
```

## File Structure

```
├── assets/                 # Static assets
├── components/             # Vue components
├── composables/            # Vue composables
├── layouts/                # Nuxt layouts
├── pages/                  # Application pages
├── plugins/                # Nuxt plugins
├── server/                 # Backend API
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── stores/                 # Pinia stores
├── types/                  # TypeScript types
└── uploads/                # File uploads directory
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in environment file
   - Verify network connectivity

2. **CORS Errors**
   - Check FRONTEND_URL in backend .env
   - Ensure frontend and backend ports match

3. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration settings

4. **File Upload Issues**
   - Ensure uploads directory exists
   - Check file size limits
   - Verify file permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
