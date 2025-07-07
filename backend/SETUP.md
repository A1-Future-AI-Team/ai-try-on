# Virtual Try-On Backend Setup Guide

## Prerequisites

1. **Python 3.8 or higher** - Download from [python.org](https://python.org)
   - Make sure to check "Add Python to PATH" during installation
   - Verify installation: `python --version`

2. **Gemini API Key** (Optional but recommended)
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add it to `config.env` file

## Quick Start (Windows)

1. **Double-click** `start_backend.bat` in the backend folder
2. The script will automatically:
   - Check if Python is installed
   - Install required dependencies
   - Start the server

## Manual Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)
Edit `config.env` file:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the Server
```bash
python start_server.py
```

## Server Information

- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /api/try-on` - Virtual try-on endpoint
- `GET /api/results/{result_id}` - Get result image

## Troubleshooting

### Python not found
- Install Python from [python.org](https://python.org)
- Make sure to check "Add Python to PATH" during installation
- Restart your terminal/command prompt after installation

### Import errors
- Run `pip install -r requirements.txt` to install dependencies
- Make sure you're in the backend directory

### Gemini API errors
- Check your API key in `config.env`
- The backend will still work without the API key, but try-on functionality will be limited

### Port already in use
- Change the port in `start_server.py` or `config.env`
- Or stop other services using port 8000

## File Structure

```
backend/
├── start_backend.bat      # Windows startup script
├── start_server.py        # Python startup script
├── simple_main.py         # Main FastAPI application
├── ml_models.py          # Virtual try-on model
├── requirements.txt      # Python dependencies
├── config.env           # Environment variables
└── uploads/             # Uploaded files directory
    ├── person/          # Person images
    ├── garment/         # Garment images
    └── results/         # Generated results
```