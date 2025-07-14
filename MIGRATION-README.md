# Virtual Try-On: SQL to MongoDB Migration

This project has been successfully migrated from a SQL-based backend to a modern MongoDB backend with enhanced features and better architecture.

## 🎯 Migration Overview

### What Changed

| Aspect | Before (SQL) | After (MongoDB) |
|--------|-------------|-----------------|
| **Database** | MySQL | MongoDB |
| **Language** | JavaScript | TypeScript |
| **Authentication** | Basic bcrypt | JWT + bcrypt |
| **API Structure** | Simple endpoints | RESTful with proper error handling |
| **Image Storage** | Local files | Local + Cloudinary support |
| **AI Processing** | Basic Gemini integration | Advanced AI service with fallbacks |
| **Error Handling** | Basic | Comprehensive with middleware |
| **Security** | Basic | Rate limiting, CORS, helmet |

### New Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Session Management** - Track try-on sessions with status  
✅ **Image Management** - Separate upload and management endpoints  
✅ **Better Error Handling** - Structured error responses  
✅ **Rate Limiting** - Prevent API abuse  
✅ **CORS Configuration** - Proper cross-origin handling  
✅ **TypeScript** - Type safety and better development experience  
✅ **MongoDB** - Flexible document-based storage  
✅ **AI Service** - Enhanced AI processing with fallbacks  

## 🚀 Quick Start

### 1. Install MongoDB

**Option A: Local Installation**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use package manager
brew install mongodb-community  # macOS
sudo apt install mongodb        # Ubuntu
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Setup MongoDB Backend

```bash
# Navigate to MongoDB backend
cd mongo

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
# At minimum, set:
# - MONGODB_URI=mongodb://localhost:27017/virtual-try-on
# - JWT_SECRET=your-secure-secret-key

# Build the project
npm run build

# Start the backend
npm run dev
```

### 3. Update Frontend

The frontend has been automatically updated to work with the new MongoDB backend. Just ensure your environment variables are set:

```bash
# In Frontend/.env
VITE_MONGODB_API_URL=http://localhost:3002
```

### 4. Test the Migration

```bash
# Test the backend
cd mongo
node test-backend.js

# Start the frontend
cd Frontend
npm run dev
```

## 📁 Project Structure

```
Virtual-Try-On-/
├── mongo/                    # New MongoDB Backend
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI service
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   └── server.ts        # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   ├── env.example          # Environment template
│   ├── start.sh             # Linux/Mac startup script
│   ├── start.bat            # Windows startup script
│   └── test-backend.js      # Backend test script
├── Frontend/                # Updated React Frontend
│   ├── src/
│   │   ├── components/      # Updated components
│   │   ├── hooks/           # Updated auth hooks
│   │   └── lib/             # Updated API types
│   └── package.json
├── backend/                 # Old SQL Backend (can be removed)
└── MIGRATION-README.md      # This file
```

## 🔄 API Changes

### Authentication

| Old Endpoint | New Endpoint | Changes |
|-------------|-------------|---------|
| `POST /api/register` | `POST /api/auth/register` | Added validation, better error handling |
| `POST /api/login` | `POST /api/auth/login` | JWT tokens, structured response |
| `POST /api/validate-user` | `GET /api/auth/profile` | JWT-based validation |

### Try-On Process

| Old Process | New Process |
|------------|-------------|
| Single endpoint for everything | Separate upload + session creation |
| Direct file processing | Session-based with status tracking |
| Simple error handling | Comprehensive error handling |

**New Try-On Flow:**
1. Upload person image → `POST /api/upload` (category: 'model')
2. Upload clothing image → `POST /api/upload` (category: 'dress')
3. Create try-on session → `POST /api/tryOn`
4. Poll for completion → `GET /api/tryOn/:sessionId`

### History Management

| Old Endpoint | New Endpoint | Changes |
|-------------|-------------|---------|
| `GET /api/try-on/history/:userId` | `GET /api/tryOn?status=completed` | JWT auth, better filtering |
| `DELETE /api/try-on/:resultId` | `DELETE /api/tryOn/:sessionId` | JWT auth, session-based |

## 🛠️ Development

### MongoDB Backend Commands

```bash
cd mongo

# Development
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start           # Start production server

# Testing
node test-backend.js # Run backend tests

# Linting
npm run lint        # Run ESLint
```

### Frontend Commands

```bash
cd Frontend

# Development
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🔧 Configuration

### Environment Variables

**MongoDB Backend (.env):**
```env
# Required
MONGODB_URI=mongodb://localhost:27017/virtual-try-on
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3002

# Optional
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GOOGLE_AI_API_KEY=your-google-ai-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend (.env):**
```env
VITE_MONGODB_API_URL=http://localhost:3002
```

## 🧪 Testing

### Backend Testing

```bash
cd mongo
node test-backend.js
```

This will test:
- Health check endpoint
- User registration
- User login
- JWT authentication
- User profile access
- User statistics
- Try-on sessions

### Manual Testing

1. **Start both servers:**
   ```bash
   # Terminal 1: MongoDB Backend
   cd mongo && npm run dev
   
   # Terminal 2: Frontend
   cd Frontend && npm run dev
   ```

2. **Test the application:**
   - Register a new user
   - Login with credentials
   - Upload images for try-on
   - Check history page
   - Test image download

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongosh
# or
mongo

# If not running, start it:
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**2. Port Already in Use**
```bash
# Check what's using port 3002
lsof -i :3002
# or
netstat -ano | findstr :3002  # Windows

# Kill the process or change PORT in .env
```

**3. CORS Errors**
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL is in allowed origins
- Verify frontend is running on correct port

**4. Authentication Errors**
- Verify `JWT_SECRET` is set in backend `.env`
- Check token expiration settings
- Ensure frontend is sending Authorization headers

**5. Image Upload Issues**
- Ensure `uploads` directory exists in mongo folder
- Check file permissions
- Verify multer configuration

### Debug Mode

Enable debug logging in the MongoDB backend:

```bash
# In mongo/.env
NODE_ENV=development
DEBUG=app:*
```

### Logs

Check backend logs for detailed information:

```bash
cd mongo
npm run dev
```

The backend provides comprehensive logging for debugging.

## 🔄 Rollback Plan

If you need to rollback to the SQL backend:

1. **Stop MongoDB backend:**
   ```bash
   # In mongo directory
   Ctrl+C
   ```

2. **Update frontend environment:**
   ```bash
   # In Frontend/.env
   VITE_BACKEND_API_URL=http://localhost:8000
   ```

3. **Revert frontend code changes:**
   - Restore old API endpoints in components
   - Revert authentication changes
   - Update image handling

4. **Start SQL backend:**
   ```bash
   cd backend
   node server.js
   ```

## 📊 Performance Comparison

| Metric | SQL Backend | MongoDB Backend |
|--------|------------|-----------------|
| **Setup Time** | 5 minutes | 10 minutes |
| **Development Speed** | Basic | Enhanced with TypeScript |
| **Error Handling** | Basic | Comprehensive |
| **Security** | Basic | Advanced (JWT, rate limiting) |
| **Scalability** | Limited | Better with MongoDB |
| **Maintainability** | Basic | High with TypeScript |

## 🎉 Migration Benefits

✅ **Better Architecture** - Clean separation of concerns  
✅ **Type Safety** - TypeScript prevents runtime errors  
✅ **Enhanced Security** - JWT, rate limiting, CORS  
✅ **Better Error Handling** - Structured error responses  
✅ **Session Management** - Track try-on progress  
✅ **Image Management** - Separate upload and processing  
✅ **AI Integration** - Enhanced AI service with fallbacks  
✅ **Documentation** - Comprehensive API documentation  
✅ **Testing** - Built-in test scripts  
✅ **Development Experience** - Hot reload, better tooling  

## 📞 Support

For issues with the migration:

1. Check the MongoDB backend logs
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Test API endpoints individually using tools like Postman
5. Review the migration guide in `mongo/migrate-to-mongodb.md`

## 🚀 Next Steps

After successful migration:

1. **Configure AI Service** - Add Google AI API key for real AI processing
2. **Setup Cloudinary** - Configure cloud image storage
3. **Add Monitoring** - Implement logging and monitoring
4. **Performance Optimization** - Add caching and optimization
5. **Deployment** - Deploy to production environment

---

**Migration completed successfully! 🎉**

The Virtual Try-On application now uses a modern MongoDB backend with enhanced features, better security, and improved development experience. 