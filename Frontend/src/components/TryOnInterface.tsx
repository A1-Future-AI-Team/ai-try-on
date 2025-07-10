import React, { useState } from 'react'
import { Sparkles, Download, Loader2 } from 'lucide-react'
import { ImageUpload } from './ImageUpload'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000'

export function TryOnInterface() {
  const { user } = useAuth()
  const [personImage, setPersonImage] = useState<File | null>(null)
  const [clothingImage, setClothingImage] = useState<File | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload a file to Supabase Storage and return its public URL
  const uploadImageToSupabase = async (file: File | Blob, path: string) => {
    // Make sure the bucket name matches exactly 'try-on-images'
    const bucketName = 'try-on-images';
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, file)
    if (error) throw error
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path)
    return data.publicUrl
  }

  // Helper to get file extension
  const getFileExtension = (file: File) => {
    return file.name.split('.').pop() || 'png';
  };

  const handleSubmit = async () => {
    if (!personImage || !clothingImage || !user) {
      setError('Please upload both images and ensure you are logged in')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Send images to backend for Gemini processing
      const formData = new FormData()
      formData.append('personImage', personImage)
      formData.append('garmentImage', clothingImage)

      const response = await fetch(`${BACKEND_API_URL}/api/try-on`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate try-on result')
      }

      // 2. Display the result image
      const resultImageUrl = `${BACKEND_API_URL}/uploads/${result.resultImage}`
      setResultImage(resultImageUrl)

      // 3. Upload original images to Supabase Storage (with extension)
      const personImageExt = getFileExtension(personImage);
      const clothingImageExt = getFileExtension(clothingImage);
      const resultImageExt = 'png'; // result is always png
      const personImageId = uuidv4()
      const clothingImageId = uuidv4()
      const resultImageId = uuidv4()
      const personImageUrl = await uploadImageToSupabase(
        personImage,
        `${user.id}/person/${personImageId}.${personImageExt}`
      )
      const clothingImageUrl = await uploadImageToSupabase(
        clothingImage,
        `${user.id}/clothing/${clothingImageId}.${clothingImageExt}`
      )

      // 4. Fetch the result image as a Blob and upload to Supabase Storage
      const resultImageResponse = await fetch(resultImageUrl)
      const resultImageBlob = await resultImageResponse.blob()
      const supabaseResultPath = `${user.id}/result/${resultImageId}.${resultImageExt}`;
      const { data: resultUploadData, error: resultUploadError } = await supabase.storage
        .from('try-on-images')
        .upload(supabaseResultPath, resultImageBlob)
      if (resultUploadError) throw resultUploadError
      const { data: { publicUrl: resultImageSupabaseUrl } } = supabase.storage
        .from('try-on-images')
        .getPublicUrl(supabaseResultPath)

      // 5. Store all URLs in Supabase DB for history
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)
      const { error: dbError } = await supabase
        .from('try_on_results')
        .insert({
          user_id: user.id,
          person_image_url: personImageUrl,
          clothing_image_url: clothingImageUrl,
          result_image_url: resultImageSupabaseUrl,
          expires_at: expiresAt.toISOString()
        })
      if (dbError) throw dbError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process images')
    } finally {
      setLoading(false)
    }
  }

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement('a')
      link.href = resultImage
      link.download = 'virtual-tryon-result.jpg'
      link.click()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">
          Virtual Try-On Studio
        </h1>
        <p className="text-gray-300 text-base sm:text-lg px-4">
          Upload your photo and clothing item to see how you look
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <ImageUpload
          label="Upload Your Photo"
          onImageSelect={setPersonImage}
          selectedImage={personImage}
        />
        
        <ImageUpload
          label="Upload Clothing Item"
          onImageSelect={setClothingImage}
          selectedImage={clothingImage}
        />
      </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!personImage || !clothingImage || loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center mx-auto space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Try-On</span>
            </>
          )}
        </button>
      </div>

      {resultImage && (
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Virtual Try-On Result</h3>
            <p className="text-gray-300">Looking great! Download or save to your history.</p>
          </div>
          
          <div className="relative mx-auto max-w-sm sm:max-w-md">
            <img
              src={resultImage}
              alt="Try-on result"
              className="w-full rounded-lg shadow-lg"
            />
            <button
              onClick={downloadResult}
              className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-2 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}