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
