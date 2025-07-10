import React, { useState, useEffect } from 'react'
import { History, Download, Trash2, Calendar, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface TryOnResult {
  id: string
  person_image_url: string
  clothing_image_url: string
  result_image_url: string
  created_at: string
  expires_at: string
}

export function HistoryPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<TryOnResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadHistory()
    }
  }, [user])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('try_on_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResults(data || [])
    } catch (err) {
      setError('Failed to load history')
      console.error('Error loading history:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('try_on_results')
        .delete()
        .eq('id', id)

      if (error) throw error
      setResults(results.filter(result => result.id !== id))
    } catch (err) {
      console.error('Error deleting result:', err)
    }
  }

  const downloadResult = (resultImageUrl: string) => {
    const link = document.createElement('a')
    link.href = resultImageUrl
    link.download = `tryon-result-${Date.now()}.jpg`
    link.click()
  }

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
    <div className="max-w-4xl mx-auto">
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
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 text-center">
          <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
          <p className="text-gray-400 mb-6">
            Your virtual try-on results will appear here once you generate some.
          </p>
          <button
            onClick={() => window.location.href = '/home'}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200"
          >
            Create Your First Try-On
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {formatDate(result.created_at)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadResult(result.result_image_url)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="Download result"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteResult(result.id)}
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
                    src={result.person_image_url}
                    alt="Person"
                    className="w-full h-32 object-contain rounded-lg bg-black"
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Clothing Item</h4>
                  <img
                    src={result.clothing_image_url}
                    alt="Clothing"
                    className="w-full h-32 object-contain rounded-lg bg-black"
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Result</h4>
                  <img
                    src={result.result_image_url}
                    alt="Try-on result"
                    className="w-full h-32 object-contain rounded-lg bg-black"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Expires: {formatDate(result.expires_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}