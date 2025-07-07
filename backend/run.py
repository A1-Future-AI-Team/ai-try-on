#!/usr/bin/env python3
"""
Startup script for Enhanced Virtual Try-On Backend
"""

import uvicorn
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from config.env
load_dotenv('config.env')

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

def main():
    """Main function to start the FastAPI server"""
    
    # Configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    # Check for Gemini API key
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        print("✅ Gemini API Key: Configured")
    else:
        print("❌ Warning: GEMINI_API_KEY not set in config.env")
    
    # Check MySQL configuration
    mysql_user = os.getenv("MYSQL_USER")
    mysql_host = os.getenv("MYSQL_HOST")
    mysql_database = os.getenv("MYSQL_DATABASE")
    
    print(f"🚀 Starting Enhanced Virtual Try-On Backend...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🔄 Reload: {reload}")
    print(f"🗄️  MySQL: {mysql_host}/{mysql_database} (user: {mysql_user})")
    print(f"📚 API Documentation: http://{host}:{port}/docs")
    print(f"🔍 Alternative Docs: http://{host}:{port}/redoc")
    print("-" * 50)
    
    # Start the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
        access_log=True
    )

if __name__ == "__main__":
    main() 