# Migration Guide: SQL to MongoDB Backend

This guide will help you migrate from the SQL-based backend to the new MongoDB backend.

## Prerequisites

1. **Install MongoDB** (if not already installed):
   - Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Install Node.js dependencies**:
   ```bash
   cd mongo
   npm install
   ```

## Setup Steps

### 1. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cd mongo
cp env.example .env
```

Edit `.env` with your configuration:
- Set `MONGODB_URI` to your MongoDB connection string
- Set `JWT_SECRET` to a secure random string
- Optionally configure Cloudinary and Google AI API keys

### 2. Build the MongoDB Backend

```bash
cd mongo
npm run build
```

### 3. Start the MongoDB Backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The MongoDB backend will run on port 3002 by default.

### 4. Update Frontend Configuration

The frontend has been updated to use the new MongoDB backend. Make sure your frontend environment variables are set:

```bash
# In Frontend/.env
VITE_MONGODB_API_URL=http://localhost:3002
```

## API Changes

### Authentication Endpoints

| Old SQL Endpoint | New MongoDB Endpoint |
|------------------|---------------------|
| `POST /api/register` | `POST /api/auth/register` |
| `POST /api/login` | `POST /api/auth/login` |
| `POST /api/validate-user` | `GET /api/auth/profile` (with JWT) |

### Try-On Endpoints

| Old SQL Endpoint | New MongoDB Endpoint |
|------------------|---------------------|
| `POST /api/try-on` | `POST /api/upload` (upload images) + `POST /api/tryOn` (create session) |
| `GET /api/try-on/history/:userId` | `GET /api/tryOn?status=completed` |
| `DELETE /api/try-on/:resultId` | `DELETE /api/tryOn/:sessionId` |

### New Features

1. **Image Management**: Separate endpoints for uploading and managing images
2. **Session-based Processing**: Try-on sessions with status tracking
3. **Better Error Handling**: Structured error responses
4. **JWT Authentication**: Secure token-based authentication
5. **AI Integration**: Built-in Google Gemini AI processing

## Data Migration

If you have existing data in your SQL database that you want to migrate:

1. Export your SQL data
2. Transform the data to match MongoDB schemas
3. Import into MongoDB collections

### Example Migration Script

```javascript
// Example: Migrate users from SQL to MongoDB
const migrateUsers = async () => {
  const sqlUsers = await pool.execute('SELECT * FROM users');
  
  for (const user of sqlUsers[0]) {
    await User.create({
      username: user.username,
      email: user.email,
      password: user.password, // Already hashed
      role: 'user',
      isActive: true
    });
  }
};
```

## Testing the Migration

1. **Start MongoDB backend**: `cd mongo && npm run dev`
2. **Start Frontend**: `cd Frontend && npm run dev`
3. **Test registration and login**
4. **Test image upload and try-on process**
5. **Test history and session management**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **CORS Errors**:
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend URL is in allowed origins

3. **Authentication Errors**:
   - Verify JWT_SECRET is set
   - Check token expiration settings

4. **Image Upload Issues**:
   - Ensure uploads directory exists
   - Check file permissions
   - Verify multer configuration

### Logs

Check the MongoDB backend logs for detailed error information:

```bash
cd mongo
npm run dev
```

The backend provides detailed logging for debugging.

## Rollback Plan

If you need to rollback to the SQL backend:

1. Stop the MongoDB backend
2. Update frontend environment variables back to SQL backend URL
3. Restart the SQL backend
4. Update frontend code to use old API endpoints

## Support

For issues with the migration:
1. Check the MongoDB backend logs
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Test API endpoints individually using tools like Postman 