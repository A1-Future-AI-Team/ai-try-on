import google.generativeai as genai
import cv2
import numpy as np
from PIL import Image
import io
import base64
import os

class VirtualTryOn:
    def __init__(self):
        """Initialize the Virtual Try-On model with Gemini API"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro-vision')
    
    def try_on(self, person_img, garment_img):
        """
        Perform virtual try-on using Gemini Vision API
        
        Args:
            person_img: OpenCV image of person
            garment_img: OpenCV image of garment
            
        Returns:
            OpenCV image of the result
        """
        try:
            # Convert OpenCV images to PIL Images
            person_pil = self._cv2_to_pil(person_img)
            garment_pil = self._cv2_to_pil(garment_img)
            
            # Create prompt for virtual try-on
            prompt = """
            Create a realistic virtual try-on image where the person is wearing the garment.
            The result should show the person wearing the clothing item naturally and realistically.
            Focus on proper fit, lighting, and natural appearance.
            """
            
            # Generate response using Gemini
            response = self.model.generate_content([prompt, person_pil, garment_pil])
            
            # Try to extract image from response
            if hasattr(response, 'candidates') and response.candidates:
                for candidate in response.candidates:
                    if hasattr(candidate, 'content') and candidate.content:
                        for part in candidate.content.parts:
                            if hasattr(part, 'inline_data') and part.inline_data:
                                if part.inline_data.mime_type.startswith('image'):
                                    # Convert base64 image to OpenCV format
                                    image_data = base64.b64decode(part.inline_data.data)
                                    pil_image = Image.open(io.BytesIO(image_data))
                                    return self._pil_to_cv2(pil_image)
            
            # If no image in response, try to get text response and create a simple overlay
            if hasattr(response, 'text'):
                print(f"Gemini response: {response.text}")
            
            # Fallback: create a simple overlay of garment on person
            return self._create_simple_overlay(person_img, garment_img)
            
        except Exception as e:
            print(f"Error in virtual try-on: {e}")
            # Return person image as fallback
            return person_img
    
    def _create_simple_overlay(self, person_img, garment_img):
        """Create a simple overlay as fallback when Gemini doesn't return an image"""
        try:
            # Resize garment to match person dimensions
            h, w = person_img.shape[:2]
            garment_resized = cv2.resize(garment_img, (w, h))
            
            # Create a simple alpha blend (50% person, 50% garment)
            result = cv2.addWeighted(person_img, 0.5, garment_resized, 0.5, 0)
            return result
        except:
            return person_img
    
    def _cv2_to_pil(self, cv2_img):
        """Convert OpenCV image to PIL Image"""
        rgb_img = cv2.cvtColor(cv2_img, cv2.COLOR_BGR2RGB)
        return Image.fromarray(rgb_img)
    
    def _pil_to_cv2(self, pil_img):
        """Convert PIL Image to OpenCV image"""
        rgb_img = np.array(pil_img)
        return cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR) 