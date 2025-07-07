import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiUpload, FiLoader } from 'react-icons/fi';

export default function Home() {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPersonDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setPersonImage(acceptedFiles[0]);
    }
  }, []);

  const onGarmentDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setGarmentImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps: getPersonRootProps, getInputProps: getPersonInputProps } = useDropzone({
    onDrop: onPersonDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const { getRootProps: getGarmentRootProps, getInputProps: getGarmentInputProps } = useDropzone({
    onDrop: onGarmentDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handleTryOn = async () => {
    if (!personImage || !garmentImage) {
      setError('Please upload both person and garment images');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('person_image', personImage);
      formData.append('garment_image', garmentImage);

      const response = await axios.post('http://localhost:8000/api/try-on', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setResultImage(`http://localhost:8000${response.data.result_image}`);
      } else {
        setError('Failed to process images');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing the images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Virtual Try-On System
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Person Image Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Person Image</h2>
            <div
              {...getPersonRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <input {...getPersonInputProps()} />
              {personImage ? (
                <div>
                  <img
                    src={URL.createObjectURL(personImage)}
                    alt="Person"
                    className="max-h-64 mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-500">{personImage.name}</p>
                </div>
              ) : (
                <div>
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop a person image here, or click to select
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Garment Image Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Garment Image</h2>
            <div
              {...getGarmentRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <input {...getGarmentInputProps()} />
              {garmentImage ? (
                <div>
                  <img
                    src={URL.createObjectURL(garmentImage)}
                    alt="Garment"
                    className="max-h-64 mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-500">{garmentImage.name}</p>
                </div>
              ) : (
                <div>
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop a garment image here, or click to select
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Try-On Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleTryOn}
            disabled={loading || !personImage || !garmentImage}
            className={`px-6 py-3 rounded-md text-white font-medium ${
              loading || !personImage || !garmentImage
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              'Try On'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Result Image */}
        {resultImage && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <img
              src={resultImage}
              alt="Try-On Result"
              className="max-h-96 mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
} 