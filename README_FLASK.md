# Virtual Try-On System (Flask Version) 🚀

A modern virtual try-on platform built with Flask, Google Gemini AI, and SQL database integration.

## 🎯 Features

- **AI-Powered Virtual Try-On**: Uses Google Gemini AI to create realistic try-on images
- **Flask Backend**: Lightweight and fast Python web framework
- **Database Integration**: SQL Workbench support for tracking usage and sessions
- **File Management**: Automatic cleanup of temporary files
- **Error Handling**: Comprehensive error handling and user feedback

## 📁 Project Structure

```
virtual-tryon/
├── app.py                 # Main Flask application
├── gemini_engine.py       # AI engine (converted from JS)
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (API key)
├── templates/
│   └── index.html        # Frontend interface
├── uploads/              # Image storage directory
└── database/
    └── schema.sql        # Database schema for SQL Workbench
```

## 🛠️ Installation & Setup

### 1. **Install Python Dependencies**
```bash
pip install -r requirements.txt
```

### 2. **Set up Environment Variables**
Create or update `.env` file:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. **Set up Database (Optional)**
1. Open SQL Workbench
2. Run the SQL commands in `database/schema.sql`
3. This creates tables for tracking usage and sessions

### 4. **Run the Application**
```bash
python app.py
```

The application will be available at: **http://localhost:5000**

## 🔧 How It Works

### **Core Process:**
1. **User Uploads**: Person image + Garment image
2. **Image Processing**: Resize and format images for AI
3. **AI Generation**: Send to Google Gemini with prompt
4. **Result Creation**: Generate realistic try-on image
5. **File Management**: Save result, clean up temp files
6. **Response**: Return result image to user

### **Key Components:**

**`app.py`** - Flask Server
- Handles file uploads
- Manages API endpoints
- Serves static files
- Error handling

**`gemini_engine.py`** - AI Engine
- Google Gemini AI integration
- Image processing and resizing
- Result generation and saving

**`templates/index.html`** - Frontend
- Drag & drop file upload
- Real-time preview
- Progress indicators
- Result display

## 🗄️ Database Schema

### **Tables:**
- **users**: User management (optional)
- **tryon_sessions**: Track each try-on session
- **usage_stats**: Daily usage statistics

### **Key Fields:**
- Session tracking with timestamps
- Success/failure status
- Error message storage
- Usage analytics

## 🔌 API Endpoints

### **Main Endpoints:**
- `GET /` - Main interface
- `POST /api/try-on` - Process try-on request
- `GET /uploads/<filename>` - Serve images
- `GET /health` - Health check

### **Request Format:**
```javascript
// POST /api/try-on
{
  "person_image": File,
  "garment_image": File
}
```

### **Response Format:**
```javascript
{
  "success": true,
  "result_image": "result_1234567890.png"
}
```

## 🚀 Deployment

### **Local Development:**
```bash
python app.py
```

### **Production (with Gunicorn):**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### **Environment Variables:**
- `GOOGLE_API_KEY`: Required for Gemini AI
- `FLASK_ENV`: Set to 'production' for production

## 📊 Monitoring & Analytics

The database tracks:
- **Usage Statistics**: Daily request counts
- **Session History**: All try-on attempts
- **Error Tracking**: Failed requests with error messages
- **Performance Metrics**: Processing times

## 🔒 Security Features

- **File Validation**: Only image files accepted
- **Size Limits**: 16MB max file size
- **Secure Filenames**: UUID-based naming
- **Automatic Cleanup**: Temporary files removed
- **Error Handling**: No sensitive data exposure

## 🐛 Troubleshooting

### **Common Issues:**

1. **"GOOGLE_API_KEY not set"**
   - Check `.env` file exists
   - Verify API key is valid

2. **"Port already in use"**
   - Change port in `app.py`
   - Kill existing processes

3. **"Import errors"**
   - Install dependencies: `pip install -r requirements.txt`
   - Check Python version (3.8+)

4. **"Database connection errors"**
   - Verify SQL Workbench connection
   - Check database schema is created

## 📈 Performance Tips

- **Image Optimization**: Images are automatically resized
- **File Cleanup**: Temporary files are removed after processing
- **Database Indexing**: Optimized queries with proper indexes
- **Error Recovery**: Graceful handling of API failures

## 🔄 Migration from Node.js

### **What Changed:**
- ✅ **Backend**: Node.js → Flask
- ✅ **AI Engine**: JavaScript → Python
- ✅ **File Handling**: Express → Flask
- ✅ **Frontend**: Next.js → Simple HTML (ready for Bolt)
- ✅ **Database**: Added SQL integration

### **What Stayed the Same:**
- ✅ **Core Logic**: Gemini AI integration
- ✅ **API Structure**: Same endpoints
- ✅ **File Storage**: Same upload system
- ✅ **Environment**: Same API key setup

## 🎉 Ready for Bolt Integration

The Flask backend is now ready for:
- **Bolt Frontend**: Replace HTML with Bolt components
- **Advanced UI**: Modern drag-and-drop interface
- **Real-time Updates**: WebSocket integration
- **User Management**: Authentication system

---

**Next Steps:**
1. Test the Flask backend
2. Integrate with Bolt frontend
3. Add advanced database features
4. Deploy to production

The core virtual try-on functionality is now working with Flask! 🎯 