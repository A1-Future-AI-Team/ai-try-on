import React, { useState, useEffect } from 'react'
import { History, Download, Trash2, Calendar, Clock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface TryOnResult {
  _id: string
  sessionId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  metadata: {
    modelImageUrl: string
    dressImageUrl: string
    resultImageUrl?: string
    processingTime?: number
  }
  createdAt: string
  processingCompletedAt?: string
  errorMessage?: string
}

interface HistoryPageProps {
  onNavigateHome?: () => void
}

export function HistoryPage({ onNavigateHome }: HistoryPageProps) {
  const { user } = useAuth()
  const [results, setResults] = useState<TryOnResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return;
    const loadHistory = async () => {
      try {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Authentication token not found')
          return
        }

        const response = await fetch(`${(import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'}/api/tryOn?status=completed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const result = await response.json()
        if (result.status !== 'success') throw new Error(result.message || 'Failed to load history')
        setResults(result.data.sessions || [])
      } catch (err) {
        console.error('Error loading history:', err)
        setError('Failed to load history')
      } finally {
        setLoading(false)
      }
    };
    loadHistory();
  }, [user]);

  const deleteResult = async (sessionId: string) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${(import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'}/api/tryOn/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.status !== 'success') throw new Error(result.message || 'Failed to delete result')
      setResults(results.filter(result => result.sessionId !== sessionId))
    } catch (err) {
      console.error('Error deleting result:', err)
    }
  }

  const downloadResult = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      // Try to get the file extension from the url, fallback to .png
      const ext = url.split('.').pop()?.split('?')[0] || 'png';
      const filename = `tryon-result-${Date.now()}.${ext}`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading your history...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <History className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Your Try-On History</h1>
          <p className="text-gray-300">View and manage your previous virtual try-on results</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-8 text-center shadow-xl animate-fade-in-up">
            <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
            <p className="text-gray-400 mb-6">
              Your virtual try-on results will appear here once you generate some.
            </p>
            <button
              onClick={onNavigateHome}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
            >
              Create Your First Try-On
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {results.map((result) => (
              <div
                key={result._id}
                className="bg-gray-900/50 glass border border-gray-800 rounded-2xl p-6 shadow-xl animate-fade-in-up"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 text-sm">
                      {formatDate(result.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.metadata.resultImageUrl && (
                      <button
                        onClick={() => downloadResult(`${(import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'}${result.metadata.resultImageUrl}`)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                        title="Download result"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteResult(result.sessionId)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete result"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Your Photo</h4>
                    <img
                      src={`${(import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'}${result.metadata.modelImageUrl}`}
                      alt="Person"
                      className="w-full h-32 object-contain rounded-lg bg-black"
                    />
                  </div>

                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Clothing Item</h4>
                    <img
                      src={`${(import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'}${result.metadata.dressImageUrl}`}
                      alt="Clothing"
                      className="w-full h-32 object-contain rounded-lg bg-black"
                    />
                  </div>

                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Result</h4>
                    {result.metadata.resultImageUrl ? (
                      <img
                        src={`${(import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002'}${result.metadata.resultImageUrl}`}
                        alt="Try-on result"
                        className="w-full h-32 object-contain rounded-lg bg-black"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Processing...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Status: {result.status}</span>
                    {result.metadata.processingTime && (
                      <span>• {Math.round(result.metadata.processingTime / 1000)}s</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    Expires: {new Date(new Date(result.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString()} (24 hours)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
