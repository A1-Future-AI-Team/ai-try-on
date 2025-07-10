import React, { useCallback, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  label: string
  accept?: string
  onImageSelect: (file: File) => void
  selectedImage?: File | null
  className?: string
}

export function ImageUpload({ 
  label, 
  accept = "image/*", 
  onImageSelect, 
  selectedImage,
  className = ""
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        onImageSelect(file)
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
  }, [onImageSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      onImageSelect(file)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, [onImageSelect])

  const clearImage = () => {
    setPreview(null)
    onImageSelect(null as any)
  }

  React.useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedImage)
    } else {
      setPreview(null)
    }
  }, [selectedImage])

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm sm:text-base font-medium text-gray-300">{label}</label>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 sm:p-6 transition-all duration-200 ${
          dragActive
            ? 'border-purple-400 bg-purple-400/5'
            : preview
            ? 'border-gray-700'
            : 'border-gray-700 hover:border-gray-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-60 object-contain rounded-lg bg-black"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-10 sm:w-12 h-10 sm:h-12 text-gray-500 mb-3 sm:mb-4">
              {dragActive ? (
                <Upload className="w-full h-full animate-bounce" />
              ) : (
                <ImageIcon className="w-full h-full" />
              )}
            </div>
            <div className="text-gray-300 mb-2 text-sm sm:text-base">
              {dragActive ? 'Drop your image here' : 'Drag and drop or click to upload'}
            </div>
            <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
          </div>
        )}

        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}