// Add this at the top of the file for Vite env typing
/// <reference types="vite/client" />
import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Download, Loader2, Upload, Brain, CheckCircle, Clock } from 'lucide-react'
import { ImageUpload } from './ImageUpload'
// import { supabase } from '../lib/supabase' // REMOVE THIS LINE
import { useAuth } from '../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'

const BACKEND_API_URL = (import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'

interface ProgressState {
  phase: 'uploading' | 'creating' | 'processing' | 'generating' | 'completed'
  percentage: number
  message: string
  timeRemaining?: string
}

export function TryOnInterface() {
  const { user } = useAuth()
  const [personImage, setPersonImage] = useState<File | null>(null)
  const [clothingImage, setClothingImage] = useState<File | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [resultCreatedAt, setResultCreatedAt] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressState>({
    phase: 'uploading',
    percentage: 0,
    message: 'Preparing...'
  })
  
  const startTimeRef = useRef<number>(0)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Helper to get file extension
  const getFileExtension = (file: File) => {
    return file.name.split('.').pop() || 'png';
  };

  // Progress management
  const updateProgress = (phase: ProgressState['phase'], percentage: number, message: string) => {
    const elapsed = Date.now() - startTimeRef.current
    let timeRemaining = ''
    
    if (percentage > 0 && percentage < 100) {
      const estimatedTotal = (elapsed / percentage) * 100
      const remaining = Math.max(0, estimatedTotal - elapsed)
      timeRemaining = `${Math.ceil(remaining / 1000)}s remaining`
    }
    
    setProgress({
      phase,
      percentage,
      message,
      timeRemaining
    })
  }

  // Simulate realistic progress during AI processing
  const simulateAIProgress = (startPercent: number, endPercent: number, duration: number) => {
    const startTime = Date.now()
    const interval = 100 // Update every 100ms
    
    const updateLoop = () => {
      const elapsed = Date.now() - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      
      // Use easing function for more realistic progress
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3)
      const currentPercent = startPercent + (endPercent - startPercent) * easedProgress
      
      if (progressRatio < 1) {
        updateProgress('generating', Math.round(currentPercent), '🎨 AI is creating your virtual try-on...')
        progressTimerRef.current = setTimeout(updateLoop, interval)
      }
    }
    
    updateLoop()
  }

  // Cleanup progress timer
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current)
      }
    }
  }, [])

  // Hide progress after result is shown with a delay
  useEffect(() => {
    if (resultImage && progress.phase === 'completed') {
      const hideProgressTimer = setTimeout(() => {
        setShowProgress(false)
      }, 3000) // Keep showing for 3 seconds after completion
      
      return () => clearTimeout(hideProgressTimer)
    }
  }, [resultImage, progress.phase])

  const handleSubmit = async () => {
    if (!personImage || !clothingImage || !user) {
      setError('Please upload both images and ensure you are logged in')
      return
    }

    setLoading(true)
    setShowProgress(true)
    setError(null)
    setResultImage(null)
    setResultCreatedAt(null)
    setSuccessMsg(null)
    startTimeRef.current = Date.now()

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      // Phase 1: Upload person image (0-25%)
      updateProgress('uploading', 5, '📤 Uploading your photo...')
      
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

      updateProgress('uploading', 15, '👗 Uploading clothing item...')

      // Phase 2: Upload clothing image (25-40%)
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

      updateProgress('creating', 30, '🔄 Creating AI session...')

      // Phase 3: Create try-on session (40-50%)
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

      updateProgress('processing', 40, '🧠 Initializing AI processing...')

      // Phase 4: AI Processing with realistic progress (50-95%)
      const sessionId = sessionData.data.session.sessionId
      let attempts = 0
      const maxAttempts = 60 // 60 seconds max
      
      // Start AI progress simulation
      simulateAIProgress(45, 90, 25000) // 25 seconds estimated for AI

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
          // Clear progress timer
          if (progressTimerRef.current) {
            clearTimeout(progressTimerRef.current)
          }
          
          updateProgress('completed', 100, '✨ Perfect! Your virtual try-on is ready!')
          setResultImage(`${BACKEND_API_URL}${session.metadata.resultImageUrl}`)
          setResultCreatedAt(new Date())
          setSuccessMsg('Amazing! Your AI-generated virtual try-on is complete!')
          
          // Keep progress visible for a bit longer, then hide
          setTimeout(() => {
            setLoading(false)
          }, 1500) // Show completion state for 1.5 seconds
          
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
      // Clear progress timer on error
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current)
      }
      setError(err instanceof Error ? err.message : 'Failed to process images')
      setLoading(false)
      setShowProgress(false)
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

  const getPhaseIcon = () => {
    switch (progress.phase) {
      case 'uploading': return <Upload className="w-5 h-5" />
      case 'creating': return <Loader2 className="w-5 h-5 animate-spin" />
      case 'processing': return <Brain className="w-5 h-5" />
      case 'generating': return <Sparkles className="w-5 h-5 animate-pulse" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />
      default: return <Loader2 className="w-5 h-5 animate-spin" />
    }
  }

  const getPhaseColor = () => {
    switch (progress.phase) {
      case 'uploading': return 'from-blue-500 to-cyan-500'
      case 'creating': return 'from-yellow-500 to-orange-500'
      case 'processing': return 'from-purple-500 to-pink-500'
      case 'generating': return 'from-pink-500 to-red-500'
      case 'completed': return 'from-green-500 to-emerald-500'
      default: return 'from-purple-500 to-pink-500'
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

        {/* Enhanced Progress Display - Stays visible throughout process */}
        {showProgress && (
          <div className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {getPhaseIcon()}
                <h3 className="text-xl font-bold text-white">{progress.message}</h3>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${getPhaseColor()} transition-all duration-500 ease-out`}
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              
              {/* Progress Stats */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{progress.percentage}% Complete</span>
                {progress.timeRemaining && progress.phase !== 'completed' && (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{progress.timeRemaining}</span>
                  </div>
                )}
                {progress.phase === 'completed' && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Done!</span>
                  </div>
                )}
              </div>
              
              {/* Phase Indicators */}
              <div className="flex justify-between mt-6 text-xs">
                <div className={`flex flex-col items-center ${progress.phase === 'uploading' ? 'text-blue-400' : progress.percentage > 25 ? 'text-green-400' : 'text-gray-500'}`}>
                  <Upload className="w-4 h-4 mb-1" />
                  <span>Upload</span>
                </div>
                <div className={`flex flex-col items-center ${progress.phase === 'creating' ? 'text-yellow-400' : progress.percentage > 40 ? 'text-green-400' : 'text-gray-500'}`}>
                  <Loader2 className="w-4 h-4 mb-1" />
                  <span>Create</span>
                </div>
                <div className={`flex flex-col items-center ${progress.phase === 'processing' || progress.phase === 'generating' ? 'text-purple-400' : progress.percentage > 50 ? 'text-green-400' : 'text-gray-500'}`}>
                  <Brain className="w-4 h-4 mb-1" />
                  <span>Process</span>
                </div>
                <div className={`flex flex-col items-center ${progress.phase === 'completed' ? 'text-green-400' : 'text-gray-500'}`}>
                  <CheckCircle className="w-4 h-4 mb-1" />
                  <span>Complete</span>
                </div>
              </div>
            </div>
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