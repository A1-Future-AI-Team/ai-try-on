import React from 'react'
import { Sparkles, Camera, Shirt, Zap } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-16 h-16 text-purple-400 mr-4" />
            <h1 className="text-4xl sm:text-6xl font-bold text-white">
              Virtual Try-On Studio
            </h1>
          </div>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8">
            Experience the future of fashion with AI-powered virtual try-on
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6">
            <Camera className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Upload Your Photo</h3>
            <p className="text-gray-400">Take a clear photo of yourself to get started</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6">
            <Shirt className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Choose Clothing</h3>
            <p className="text-gray-400">Select the clothing item you want to try on</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6">
            <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">See Results</h3>
            <p className="text-gray-400">Get instant AI-generated try-on results</p>
          </div>
        </div>

        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 flex items-center mx-auto space-x-2"
        >
          <Sparkles className="w-6 h-6" />
          <span>Get Started</span>
        </button>
      </div>
    </div>
  )
}