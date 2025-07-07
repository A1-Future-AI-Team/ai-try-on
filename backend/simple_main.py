from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import shutil
import uuid
import cv2
from ml_models import VirtualTryOn

app = FastAPI(
    title="Virtual Try-On API",
    description="API for virtual try-on system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories for storing uploaded files
os.makedirs("uploads/person", exist_ok=True)
os.makedirs("uploads/garment", exist_ok=True)
os.makedirs("uploads/results", exist_ok=True)

# Initialize model (will be None if Gemini API key is not available)
tryon_model = None
try:
    tryon_model = VirtualTryOn()
    print("✅ Virtual Try-On model initialized successfully")
except Exception as e:
    print(f"⚠️  Warning: Could not initialize Virtual Try-On model: {e}")
    print("   The API will still work but try-on functionality will be limited")

@app.get("/")
async def root():
    return {"message": "Welcome to Virtual Try-On API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": tryon_model is not None}

@app.post("/api/try-on")
async def try_on(
    person_image: UploadFile = File(...),
    garment_image: UploadFile = File(...)
):
    """
    Process a virtual try-on request using Gemini
    """
    if tryon_model is None:
        raise HTTPException(status_code=503, detail="Virtual Try-On model not available")
    
    # Generate unique IDs for the files
    person_id = str(uuid.uuid4())
    garment_id = str(uuid.uuid4())
    result_id = str(uuid.uuid4())
    
    # Save uploaded files
    person_path = f"uploads/person/{person_id}.jpg"
    garment_path = f"uploads/garment/{garment_id}.jpg"
    result_path = f"uploads/results/{result_id}.jpg"
    
    try:
        # Save person image
        with open(person_path, "wb") as buffer:
            shutil.copyfileobj(person_image.file, buffer)
        
        # Save garment image
        with open(garment_path, "wb") as buffer:
            shutil.copyfileobj(garment_image.file, buffer)
        
        # Load images with OpenCV
        person_img = cv2.imread(person_path)
        garment_img = cv2.imread(garment_path)
        
        if person_img is None or garment_img is None:
            raise HTTPException(status_code=400, detail="Failed to load images")
        
        # Resize images to standard size
        person_img = cv2.resize(person_img, (512, 768))
        garment_img = cv2.resize(garment_img, (512, 768))
        
        # Perform virtual try-on with Gemini
        result_img = tryon_model.try_on(person_img, garment_img)
        
        # Save result
        cv2.imwrite(result_path, result_img)
        
        return {
            "success": True,
            "result_image": f"/api/results/{result_id}.jpg"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/results/{result_id}")
async def get_result(result_id: str):
    """
    Get a result image by ID
    """
    result_path = f"uploads/results/{result_id}.jpg"
    if not os.path.exists(result_path):
        raise HTTPException(status_code=404, detail="Result not found")
    
    return FileResponse(result_path)

@app.get("/api/health")
async def api_health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "model_loaded": tryon_model is not None} 