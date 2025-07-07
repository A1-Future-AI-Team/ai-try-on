import os
import requests
from PIL import Image
from io import BytesIO

def download_image(url, save_path):
    """Download an image from URL and save it to the specified path"""
    try:
        response = requests.get(url)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            img.save(save_path)
            print(f"Downloaded image to {save_path}")
            return True
        else:
            print(f"Failed to download image from {url}")
            return False
    except Exception as e:
        print(f"Error downloading image: {e}")
        return False

def main():
    # Create directories if they don't exist
    os.makedirs('test_data/person', exist_ok=True)
    os.makedirs('test_data/garment', exist_ok=True)
    
    # Sample images (these are placeholder URLs - you'll need to replace with actual image URLs)
    person_image_url = "https://example.com/sample_person.jpg"  # Replace with actual URL
    garment_image_url = "https://example.com/sample_garment.jpg"  # Replace with actual URL
    
    # Download images
    print("Downloading test images...")
    person_success = download_image(person_image_url, 'test_data/person/test_person.jpg')
    garment_success = download_image(garment_image_url, 'test_data/garment/test_garment.jpg')
    
    if person_success and garment_success:
        print("\nSuccessfully downloaded all test images!")
    else:
        print("\nFailed to download some images. Please manually add test images to:")
        print("1. test_data/person/test_person.jpg - A full-body photo of a person")
        print("2. test_data/garment/test_garment.jpg - A photo of a garment on a white background")

if __name__ == "__main__":
    main() 