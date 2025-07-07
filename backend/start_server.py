#!/usr/bin/env python3
"""
Simple startup script for Virtual Try-On Backend
"""

import uvicorn
import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

def main():
    """Main function to start the FastAPI server"""
    
    # Configuration
    host = "0.0.0.0"
    port = 8000
    reload = True
    
    print(f"🚀 Starting Virtual Try-On Backend...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🔄 Reload: {reload}")
    print(f"📚 API Documentation: http://{host}:{port}/docs")
    print(f"🔍 Alternative Docs: http://{host}:{port}/redoc")
    print("-" * 50)
    
    # Start the server
    uvicorn.run(
        "simple_main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
        access_log=True
    )

if __name__ == "__main__":
    main() 