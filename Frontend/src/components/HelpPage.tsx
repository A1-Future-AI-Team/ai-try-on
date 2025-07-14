import React from 'react'
import { HelpCircle, Camera, Shirt, Zap, Download, Lightbulb } from 'lucide-react'

export function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Help & Instructions</h1>
          <p className="text-gray-300">Learn how to get the best results from your virtual try-on</p>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-8 shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-white mb-6">How to Use Virtual Try-On</h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Camera className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Step 1: Upload Your Photo</h3>
                <p className="text-gray-400 text-sm">Take a clear, full-body photo with good lighting</p>
              </div>
              <div className="text-center">
                <Shirt className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Step 2: Choose Clothing</h3>
                <p className="text-gray-400 text-sm">Upload an image of the clothing item you want to try</p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Step 3: Generate Result</h3>
                <p className="text-gray-400 text-sm">Click generate and wait for your AI-powered result</p>
              </div>
            </div>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Upload a clear photo of yourself (preferably full body)</li>
              <li>Upload an image of the clothing item you want to try on</li>
              <li>Click "Generate Try-On" to process your images</li>
              <li>Wait for the AI to generate your virtual try-on result</li>
              <li>Download your result or try again with different images</li>
            </ol>
          </div>

          <div className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-8 shadow-xl animate-fade-in-up">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Tips for Best Results</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Photo Quality</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Use high-quality, well-lit photos</li>
                  <li>Ensure your full body is visible</li>
                  <li>Use a plain background when possible</li>
                  <li>Make sure the lighting is even</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Clothing Images</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Use clear, front-facing clothing photos</li>
                  <li>Ensure the clothing item is fully visible</li>
                  <li>Use white or neutral backgrounds</li>
                  <li>Avoid busy patterns that might confuse the AI</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-8 shadow-xl animate-fade-in-up">
            <div className="flex items-center mb-6">
              <Download className="w-8 h-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Downloading Results</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Once your virtual try-on is generated, you can download the result image by clicking the download button 
              in the top-right corner of the result image. The image will be saved to your device in high quality.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 text-sm">
                <strong>Note:</strong> Results are automatically saved to your history for future reference.
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-8 shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-white mb-6">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Common Issues</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong>Poor quality results:</strong> Try using better lighting and clearer images</li>
                  <li><strong>Processing errors:</strong> Check your internet connection and try again</li>
                  <li><strong>Image not uploading:</strong> Ensure the file is a valid image format (JPG, PNG)</li>
                  <li><strong>Slow processing:</strong> Large images may take longer to process</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}