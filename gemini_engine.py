import os
import base64
import requests
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GeminiTryOn:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is not set.")
        
        # Choose your preferred model
        self.model = 'gemini-2.0-flash-exp-image-generation'
        # self.model = 'gemini-1.5-pro-vision'  # Optional alternative
        print("Initialized GeminiTryOn with model:", self.model)

    def try_on(self, person_image_path, garment_image_path):
        """Perform virtual try-on using Gemini REST API"""
        try:
            print("Starting virtual try-on process (REST API)")

            endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

            def encode_image(image_path):
                with Image.open(image_path) as img:
                    print(f"Encoding image: {image_path} | Format: {img.format} | Size: {img.size}")
                with open(image_path, "rb") as f:
                    return base64.b64encode(f.read()).decode("utf-8")

            # Encode both images
            person_image_b64 = encode_image(person_image_path)
            garment_image_b64 = encode_image(garment_image_path)

            # Prompt to Gemini
            prompt = (
                "You are a fashion AI assistant. Generate a photorealistic image of the person (first image) "
                "wearing the garment (second image). Ensure proper fitting, realistic lighting, body pose preservation, "
                "and visual consistency. The result should look natural and high-quality — not like a digital overlay."
            )

            data = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt},
                            {
                                "inline_data": {
                                    "mime_type": "image/png",
                                    "data": person_image_b64
                                }
                            },
                            {
                                "inline_data": {
                                    "mime_type": "image/png",
                                    "data": garment_image_b64
                                }
                            }
                        ]
                    }
                ]
            }

            headers = {"Content-Type": "application/json"}
            print("Calling Gemini REST API...")
            response = requests.post(endpoint, headers=headers, json=data)
            print("Gemini REST API status:", response.status_code)

            if response.status_code != 200:
                raise Exception(f"Gemini API error: {response.text}")

            result = response.json()
            print("Gemini REST API response:", result)

            # Try to extract the image from response
            candidates = result.get('candidates', [])
            for candidate in candidates:
                parts = candidate.get('content', {}).get('parts', [])
                for part in parts:
                    if 'inline_data' in part and 'data' in part['inline_data']:
                        image_data = part['inline_data']['data']
                        result_path = self._save_result_image(image_data, person_image_path)
                        print("✅ Successfully generated try-on image.")
                        return result_path

            # If no image, fallback to combined preview
            print("⚠️ Gemini returned no image. Falling back to simple combination preview.")
            return self._create_fallback_combined_image(person_image_path, garment_image_path)

        except Exception as e:
            print(f"❌ Error in try_on: {str(e)}")
            return self._create_fallback_combined_image(person_image_path, garment_image_path)

    def _save_result_image(self, base64_data, reference_path):
        """Save the decoded base64 image to disk"""
        result_dir = "uploads"
        os.makedirs(result_dir, exist_ok=True)
        filename = f"result_{int(os.path.getmtime(reference_path) * 1000)}.png"
        result_path = os.path.join(result_dir, filename)

        with open(result_path, "wb") as f:
            f.write(base64.b64decode(base64_data))
        return result_path

    def _create_fallback_combined_image(self, person_path, garment_path):
        """Fallback image: combine person and garment side by side"""
        with Image.open(person_path) as person_img, Image.open(garment_path) as garment_img:
            size = (512, 512)
            person_img = person_img.resize(size)
            garment_img = garment_img.resize(size)
            combined_img = Image.new("RGB", (size[0] * 2, size[1]))
            combined_img.paste(person_img, (0, 0))
            combined_img.paste(garment_img, (size[0], 0))
            
            result_dir = "uploads"
            os.makedirs(result_dir, exist_ok=True)
            fallback_path = os.path.join(result_dir, f"result_{int(os.path.getmtime(person_path) * 1000)}.png")
            combined_img.save(fallback_path)
            print("🟡 Created fallback combined image.")
            return fallback_path
