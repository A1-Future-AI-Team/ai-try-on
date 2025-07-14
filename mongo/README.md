# Virtual Try-On Backend

A Node.js/Express backend for the Virtual Try-On application with MongoDB database, user authentication, image upload, and try-on session management.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Image Upload**: Cloudinary integration for image storage and processing
- **Try-On Sessions**: Management of virtual try-on sessions with status tracking
- **RESTful API**: Well-structured API endpoints with proper error handling
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, CORS, helmet, and input validation
- **TypeScript**: Full TypeScript support with proper types

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image storage)

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   - Set up MongoDB connection string
   - Configure Cloudinary credentials
   - Set JWT secret

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ username, email, password }`
- **Response**: User object with JWT token

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: User object with JWT token

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data

#### Update User Profile
- **PUT** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ username?, email? }`
- **Response**: Updated user profile

#### Logout
- **POST** `/api/auth/logout`
- **Response**: Success message

### Image Upload Endpoints

#### Upload Image
- **POST** `/api/upload`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData with `image` file and `category` (model/dress)
- **Response**: Image metadata

#### Get User Images
- **GET** `/api/upload?category=model&page=1&limit=20`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Paginated list of user images

#### Get Image by ID
- **GET** `/api/upload/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Image metadata

#### Delete Image
- **DELETE** `/api/upload/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Try-On Session Endpoints

#### Create Try-On Session
- **POST** `/api/tryOn`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ modelImageId, dressImageId }`
- **Response**: Try-on session object

#### Get User Sessions
- **GET** `/api/tryOn?status=completed&page=1&limit=20`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Paginated list of try-on sessions

#### Get Session by ID
- **GET** `/api/tryOn/:sessionId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Try-on session with populated image data

#### Update Session Status
- **PUT** `/api/tryOn/:sessionId/status`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ status, errorMessage?, resultImageId? }`
- **Response**: Updated session object

#### Delete Session
- **DELETE** `/api/tryOn/:sessionId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

#### Simulate Processing (Demo)
- **POST** `/api/tryOn/:sessionId/simulate`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Processing started message

### User Statistics Endpoints

#### Get User Stats
- **GET** `/api/user/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User statistics (image counts, session counts)

#### Get User Activity
- **GET** `/api/user/activity?limit=10`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Recent images and sessions

## Database Schema

### User Model
```typescript
{
  username: string;
  email: string;
  password: string; // hashed
  role: 'user' | 'admin';
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Image Model
```typescript
{
  userId: ObjectId;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  cloudinaryId: string;
  url: string;
  width: number;
  height: number;
  category: 'model' | 'dress' | 'result';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### TryOnSession Model
```typescript
{
  userId: ObjectId;
  sessionId: string;
  modelImageId: ObjectId;
  dressImageId: ObjectId;
  resultImageId?: ObjectId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorMessage?: string;
  metadata: {
    modelImageUrl: string;
    dressImageUrl: string;
    resultImageUrl?: string;
    processingTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── uploadController.ts
│   │   └── tryOnController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Image.ts
│   │   └── TryOnSession.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── upload.ts
│   │   ├── tryOn.ts
│   │   └── user.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── cloudinary.ts
│   └── server.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Environment Variables
Make sure to set up all required environment variables in your `.env` file:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Input validation and sanitization
- Helmet for security headers
- Error handling that doesn't leak sensitive information

## License

MIT 