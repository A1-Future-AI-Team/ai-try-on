// Add this at the top of the file for Vite env typing
/// <reference types="vite/client" />
import React, { useState } from 'react'
import { Sparkles, Download, Loader2 } from 'lucide-react'
import { ImageUpload } from './ImageUpload'
// import { supabase } from '../lib/supabase' // REMOVE THIS LINE
import { useAuth } from '../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'

const BACKEND_API_URL = (import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'

export function TryOnInterface() {
  const { user } = useAuth()
  const [personImage, setPersonImage] = useState<File | null>(null)
  const [clothingImage, setClothingImage] = useState<File | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [resultCreatedAt, setResultCreatedAt] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

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
    setResultImage(null) // Clear previous result
    setResultCreatedAt(null) // Clear previous expiration
    setSuccessMsg(null) // Clear previous success message

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      // 1. Upload person image
      const personFormData = new FormData()
      personFormData.append('image', personImage)
      personFormData.append('category', 'model')

      const personResponse = await fetch(`${BACKEND_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: personFormData
      })

      if (!personResponse.ok) {
        throw new Error('Failed to upload person image')
      }

      const personData = await personResponse.json()
      if (personData.status !== 'success') {
        throw new Error(personData.message || 'Failed to upload person image')
      }

      // 2. Upload clothing image
      const clothingFormData = new FormData()
      clothingFormData.append('image', clothingImage)
      clothingFormData.append('category', 'dress')

      const clothingResponse = await fetch(`${BACKEND_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: clothingFormData
      })

      if (!clothingResponse.ok) {
        throw new Error('Failed to upload clothing image')
      }

      const clothingData = await clothingResponse.json()
      if (clothingData.status !== 'success') {
        throw new Error(clothingData.message || 'Failed to upload clothing image')
      }

      // 3. Create try-on session
      const sessionResponse = await fetch(`${BACKEND_API_URL}/api/tryOn`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          modelImageId: personData.data.image._id,
          dressImageId: clothingData.data.image._id
        })
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create try-on session')
      }

      const sessionData = await sessionResponse.json()
      if (sessionData.status !== 'success') {
        throw new Error(sessionData.message || 'Failed to create try-on session')
      }

      // 4. Poll for completion
      const sessionId = sessionData.data.session.sessionId
      let attempts = 0
      const maxAttempts = 30 // 30 seconds max

      const pollForCompletion = async () => {
        const pollResponse = await fetch(`${BACKEND_API_URL}/api/tryOn/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!pollResponse.ok) {
          throw new Error('Failed to check session status')
        }

        const pollData = await pollResponse.json()
        if (pollData.status !== 'success') {
          throw new Error(pollData.message || 'Failed to check session status')
        }

        const session = pollData.data.session

        if (session.status === 'completed' && session.metadata.resultImageUrl) {
          setResultImage(`${BACKEND_API_URL}${session.metadata.resultImageUrl}`)
          setResultCreatedAt(new Date())
          setSuccessMsg('Image generated!')
          return
        } else if (session.status === 'failed') {
          throw new Error(session.errorMessage || 'Try-on processing failed')
        } else if (attempts >= maxAttempts) {
          throw new Error('Try-on processing timed out')
        }

        attempts++
        setTimeout(pollForCompletion, 1000) // Poll every second
      }

      await pollForCompletion()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 p-4 flex items-center justify-center">
      <div className="space-y-8 w-full max-w-4xl mx-auto">
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center mx-auto space-x-2"
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
          <div className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-6 shadow-xl animate-fade-in-up">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Virtual Try-On Result</h3>
              <p className="text-gray-300">Looking great! Download or save to your history.</p>
              {successMsg && (
                <div className="mt-2 text-green-400 font-semibold animate-fade-in-up">{successMsg}</div>
              )}
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
                title="Download result image"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            {resultCreatedAt && (
              <div className="mt-4 text-xs text-gray-400 text-center">
                Expires: {new Date(resultCreatedAt.getTime() + 24 * 60 * 60 * 1000).toLocaleString()} (24 hours)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}