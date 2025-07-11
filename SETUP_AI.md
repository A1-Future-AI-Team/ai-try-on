# AI Virtual Try-On Setup Guide

This guide will help you set up the AI-powered virtual try-on functionality using Google's Gemini AI.

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection
- Google AI API key (Gemini)

## Getting Your Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" 
4. Create a new project or select an existing one
5. Generate your API key
6. Copy the API key for use in your environment variables

## Backend Setup

### 1. Install Dependencies

The Google Generative AI SDK has already been installed:

```bash
cd backend
npm install @google/genai
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/virtual-try-on

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Google AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key-here

# Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace `your-google-ai-api-key-here` with your actual Google AI API key.

### 3. Create Upload Directories

```bash
mkdir -p backend/uploads/results
```

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```

## Frontend Setup

The frontend has been updated to work with the new AI endpoints. No additional setup is required.

```bash
npm run dev
```

## How It Works

### AI Processing Flow

1. **Image Upload**: Users upload a model photo and clothing image
2. **Session Creation**: A try-on session is created with status "pending"
3. **AI Processing**: The backend processes images using Google Gemini AI
4. **Result Generation**: A composite image is generated and saved
5. **Status Updates**: Session status is updated to "completed" or "failed"
6. **Download**: Users can view and download the result

### API Endpoints

#### Try-On Endpoints

- `POST /api/tryOn` - Create a new try-on session
- `GET /api/tryOn` - Get all user's try-on sessions
- `GET /api/tryOn/:sessionId` - Get specific session details
- `GET /api/tryOn/:sessionId/download` - Download result image
- `DELETE /api/tryOn/:sessionId` - Delete a session

#### Session Status Flow

```
pending → processing → completed
                   ↘ failed
```

### Frontend Components

#### New Components Added

1. **TryOnResult** - Displays processing status and results
   - Shows processing animation
   - Displays result image when complete
   - Provides download and share functionality
   - Shows error messages if processing fails

2. **Updated UploadSection** - Enhanced upload experience
   - Real-time processing status
   - Polling for completion
   - Better error handling

## Usage Instructions

### For Users

1. **Register/Login**: Create an account or sign in
2. **Upload Model Photo**: Upload a clear photo of the person
3. **Upload Clothing**: Upload the dress or clothing item
4. **Process**: Click "Create Try-On" to start AI processing
5. **Wait**: Processing typically takes 15-30 seconds
6. **Download**: Once complete, download or share the result

### For Developers

#### Customizing AI Processing

The AI service is located in `backend/src/services/aiService.ts`. You can:

- Modify the prompt for different styles
- Adjust generation parameters
- Add preprocessing steps
- Implement different AI models

#### Adding New Features

1. **Batch Processing**: Process multiple clothing items at once
2. **Style Transfer**: Apply different artistic styles
3. **Background Removal**: Automatically remove/replace backgrounds
4. **Size Recommendations**: Suggest optimal clothing sizes

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your Google AI API key is correct
   - Check that billing is enabled in Google Cloud Console
   - Ensure the API key has proper permissions

2. **Processing Fails**
   - Check image file formats (JPEG, PNG, WebP supported)
   - Verify file sizes are under 10MB
   - Check server logs for detailed error messages

3. **Slow Processing**
   - Large images take longer to process
   - Consider implementing image resizing
   - Check your internet connection

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show detailed processing logs in the console.

## Limitations

### Current Implementation

- **Image Generation**: Currently uses a placeholder that copies the model image
- **Real AI Generation**: To implement actual image generation, you would need:
  - A dedicated image generation API (DALL-E, Midjourney, Stable Diffusion)
  - Image compositing algorithms
  - Advanced computer vision models

### Recommended Enhancements

1. **Integrate with DALL-E**: Use OpenAI's DALL-E for actual image generation
2. **Add Stable Diffusion**: Self-hosted image generation
3. **Implement Computer Vision**: Use OpenCV for image compositing
4. **Add Caching**: Cache results to improve performance

## Production Deployment

### Security Considerations

1. **API Key Security**: Never commit API keys to version control
2. **Rate Limiting**: Implement API rate limiting
3. **Input Validation**: Validate all uploaded images
4. **CORS Configuration**: Properly configure CORS for production

### Performance Optimization

1. **Image Optimization**: Compress images before processing
2. **Caching**: Cache processed results
3. **CDN**: Use a CDN for serving result images
4. **Queue System**: Implement job queues for heavy processing

### Monitoring

1. **Error Tracking**: Use services like Sentry for error monitoring
2. **Performance Monitoring**: Track processing times and success rates
3. **Usage Analytics**: Monitor API usage and costs

## Cost Considerations

- Google AI API charges per request
- Monitor your usage in Google Cloud Console
- Consider implementing usage limits per user
- Cache results to reduce API calls

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server logs for error details
3. Verify your API key and permissions
4. Test with smaller image files first

## Next Steps

1. Set up your Google AI API key
2. Test the basic functionality
3. Customize the AI prompts for your use case
4. Consider implementing real image generation
5. Add additional features as needed

Happy coding! 🎨✨ 