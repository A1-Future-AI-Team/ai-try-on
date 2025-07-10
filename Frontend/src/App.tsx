import React, { useState } from 'react'
import { AuthForm } from './components/AuthForm'
import { TryOnInterface } from './components/TryOnInterface'
import { HistoryPage } from './components/HistoryPage'
import { HelpPage } from './components/HelpPage'
import { LandingPage } from './components/LandingPage'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { useAuth } from './hooks/useAuth'
import { Loader2 } from 'lucide-react'

function App() {
  const { user, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [currentPage, setCurrentPage] = useState<'landing' | 'home' | 'history' | 'help'>('landing')
  const [showAuth, setShowAuth] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading your virtual try-on studio...</p>
        </div>
      </div>
    )
  }

  if (!user && showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm 
            mode={authMode} 
            onModeChange={setAuthMode}
            onBack={() => setShowAuth(false)}
          />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuth(true)} />
        <Footer />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex flex-col">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onLogoClick={() => setCurrentPage('landing')}
      />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {currentPage === 'landing' && (
          <>
            <LandingPage onGetStarted={() => setCurrentPage('home')} />
            <Footer />
          </>
        )}
        {currentPage === 'home' && <TryOnInterface />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'help' && <HelpPage />}
      </main>

      {currentPage !== 'landing' && <Footer />}
    </div>
  )
}

export default App