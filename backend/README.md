# Enhanced Virtual Try-On Backend

A comprehensive Python backend for virtual try-on system with **face preservation** using Gemini API and MySQL database.

## 🚀 Key Features

- **🤖 Gemini API Integration**: Advanced AI-powered virtual try-on
- **👤 Face Preservation**: Keeps the model's face unchanged using OpenCV face detection
- **🗄️ MySQL Database**: Robust, scalable database for production use
- **📸 Image Processing**: Advanced image manipulation with OpenCV
- **🔄 Fallback System**: Graceful degradation when API is unavailable
- **📊 Session Management**: Track all try-on sessions
- **👕 Garment Catalog**: Manage clothing inventory

## 🎯 Face Preservation Technology

The system uses advanced computer vision techniques to preserve the model's face:

1. **Face Detection**: OpenCV Haar Cascade classifier detects face regions
2. **Smart Blending**: Elliptical mask for smooth face integration
3. **Enhanced Prompts**: Detailed instructions to Gemini API for better results
4. **Fallback Processing**: Simple alpha blending when API fails

## 📋 Prerequisites

- Python 3.8+
- MySQL 8.0+
- Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
- pip (Python package manager)

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database:**
   ```bash
   # Connect to MySQL as root
   mysql -u root -p
   
   # Run the setup script
   source mysql_setup.sql;
   ```

5. **Set up environment variables:**
   ```bash
   # Windows
   set GEMINI_API_KEY=your_api_key_here
   set MYSQL_USER=virtual_tryon_user
   set MYSQL_PASSWORD=virtual_tryon_password
   set MYSQL_HOST=localhost
   set MYSQL_DATABASE=virtual_tryon
   
   # macOS/Linux
   export GEMINI_API_KEY=your_api_key_here
   export MYSQL_USER=virtual_tryon_user
   export MYSQL_PASSWORD=virtual_tryon_password
   export MYSQL_HOST=localhost
   export MYSQL_DATABASE=virtual_tryon
   ```

6. **Start the server:**
   ```bash
   python run.py
   ```

## 🚀 Running the Application

### Development Mode
```bash
python run.py
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Environment Variables
```bash
HOST=0.0.0.0          # Server host
PORT=8000             # Server port
RELOAD=true           # Auto-reload on changes
GEMINI_API_KEY=xxx    # Your Gemini API key
MYSQL_USER=xxx        # MySQL username
MYSQL_PASSWORD=xxx    # MySQL password
MYSQL_HOST=localhost  # MySQL host
MYSQL_DATABASE=xxx    # MySQL database name
```

## 📚 API Endpoints

### Virtual Try-On
- `POST /api/try-on` - Perform virtual try-on with face preservation
- `GET /api/results/{session_id}` - Get try-on result image

### Garment Management
- `POST /api/garments` - Add new garment to catalog
- `GET /api/garments` - Get all garments (with optional category filter)

### Session Management
- `GET /api/sessions` - Get all try-on sessions

### System
- `GET /` - Root endpoint with feature list
- `GET /health` - Health check with API status

## 🔐 API Usage Examples

### Virtual Try-On Request
```bash
curl -X POST "http://localhost:8000/api/try-on" \
  -H "Content-Type: multipart/form-data" \
  -F "person_image=@person.jpg" \
  -F "garment_image=@garment.jpg"
```

### Add Garment
```bash
curl -X POST "http://localhost:8000/api/garments" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Classic T-Shirt" \
  -F "category=T-Shirts" \
  -F "description=Premium cotton t-shirt" \
  -F "price=2500" \
  -F "image=@tshirt.jpg"
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - User email (unique)
- `name` - User name
- `created_at` - Registration timestamp
- `is_active` - Account status

### TryOnSessions Table
- `id` - Primary key
- `user_id` - User reference
- `person_image_path` - Original person image path
- `garment_image_path` - Garment image path
- `result_image_path` - Generated result path
- `created_at` - Session timestamp
- `status` - Processing status

### Garments Table
- `id` - Primary key
- `name` - Garment name
- `category` - Clothing category
- `description` - Product description
- `image_path` - Garment image path
- `price` - Price in cents
- `sizes` - Available sizes (JSON)
- `created_at` - Creation timestamp

## 🔧 Configuration

### Database
- **Type**: MySQL 8.0+
- **Host**: localhost (configurable)
- **Port**: 3306 (configurable)
- **Database**: virtual_tryon
- **User**: virtual_tryon_user
- **Auto-creation**: Tables created automatically

### File Storage
- **Person Images**: `uploads/person/`
- **Garment Images**: `uploads/garment/`
- **Results**: `uploads/results/`

### Gemini API
- **Model**: gemini-pro-vision
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 2048
- **Face Preservation**: Enabled by default

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔍 Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   ```
   Error: Can't connect to MySQL server
   ```
   Solution: 
   - Ensure MySQL is running
   - Check credentials in environment variables
   - Verify database exists

2. **Gemini API Key Not Set**
   ```
   Warning: GEMINI_API_KEY not set
   ```
   Solution: Set the environment variable

3. **Face Detection Fails**
   - Ensure person image has clear face
   - Check image quality and lighting
   - System falls back to simple blending

4. **Database Permission Errors**
   - Ensure user has proper privileges
   - Check MySQL user permissions
   - Run `mysql_setup.sql` as root

## 📦 Deployment

### Docker with MySQL
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: virtual_tryon
      MYSQL_USER: virtual_tryon_user
      MYSQL_PASSWORD: virtual_tryon_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql_setup.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MYSQL_HOST=mysql
      - MYSQL_USER=virtual_tryon_user
      - MYSQL_PASSWORD=virtual_tryon_password
      - MYSQL_DATABASE=virtual_tryon
    depends_on:
      - mysql
```

### Manual Deployment
1. Set up MySQL server
2. Run `mysql_setup.sql`
3. Install Python dependencies
4. Set environment variables
5. Run with production WSGI server

## 🔄 Updates and Improvements

### Recent Enhancements
- ✅ Face preservation technology
- ✅ Enhanced Gemini API prompts
- ✅ MySQL database integration
- ✅ Session tracking
- ✅ Garment catalog management
- ✅ Fallback processing system

### Future Roadmap
- 🔄 User authentication
- 🔄 Advanced face detection (dlib)
- 🔄 Multiple garment support
- 🔄 Real-time processing
- 🔄 Cloud storage integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check `/docs` endpoint
- **Issues**: GitHub issues
- **Email**: Support email (if available)

---

**Note**: This enhanced version focuses on preserving the model's face while providing realistic virtual try-on results using advanced AI technology with MySQL database for robust data storage. 