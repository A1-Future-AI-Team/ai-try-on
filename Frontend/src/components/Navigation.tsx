import React from 'react'
import { Home, History, LogOut, Sparkles, HelpCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface NavigationProps {
  currentPage: 'landing' | 'home' | 'history' | 'help'
  onPageChange: (page: 'landing' | 'home' | 'history' | 'help') => void
  onLogoClick?: () => void
}

export function Navigation({ currentPage, onPageChange, onLogoClick }: NavigationProps) {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={onLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-lg sm:text-xl font-bold text-white">TryOn Studio</span>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => onPageChange('home')}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                currentPage === 'home'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </button>
            
            <button
              onClick={() => onPageChange('history')}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                currentPage === 'history'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">History</span>
            </button>

            <button
              onClick={() => onPageChange('help')}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                currentPage === 'help'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Help</span>
            </button>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 text-sm sm:text-base"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}