import React, { useState } from 'react'
import { AuthForm } from './components/AuthForm'
import { TryOnInterface } from './components/TryOnInterface'
import { HistoryPage } from './components/HistoryPage'
import { HelpPage } from './components/HelpPage'
import { Navigation } from './components/Navigation'
import { LandingPage } from './components/LandingPage'
import { useAuth } from './hooks/useAuth'
import { Loader2 } from 'lucide-react'

function App() {
  const { user, loading, signOut } = useAuth()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [currentPage, setCurrentPage] = useState<'home' | 'history' | 'help'>('home')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  // Handler for sign out - navigate back to landing page
  const handleSignOut = async () => {
    await signOut()
    setCurrentPage('home')
    setShowAuth(false)
    console.log('Sign out: Navigated back to LandingPage')
  }

  if (loading) {
    console.log('Loading spinner page')
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading your virtual try-on studio...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Show Landing Page when not authenticated */}
      {!user && !showAuth && (
        <LandingPage onGetStarted={() => { 
          setShowAuth(true); 
          console.log('LandingPage: Get Started clicked, showing AuthForm') 
        }} />
      )}

      {/* Show Auth Form when not authenticated and auth is requested */}
      {!user && showAuth && (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AuthForm
              mode={authMode}
              onModeChange={setAuthMode}
              onBack={() => {
                setShowAuth(false)
                console.log('AuthForm: Back to LandingPage')
              }}
              onSuccess={() => {
                if (authMode === 'register') {
                  setRegistrationSuccess(true)
                  setAuthMode('login')
                  console.log('Register: Registration successful, switching to login')
                } else {
                  setRegistrationSuccess(false)
                  setShowAuth(false)
                  setCurrentPage('home')
                  console.log('Login: Login successful, navigating to Home')
                }
              }}
              registrationSuccess={registrationSuccess}
            />
          </div>
        </div>
      )}

      {/* Show Main App when authenticated */}
      {user && (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex flex-col">
          <Navigation
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page)
              console.log('Navigation: Switched to page', page)
            }}
            onLogoClick={() => {
              setCurrentPage('home')
              console.log('Navigation: Logo clicked, switched to Home')
            }}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {currentPage === 'home' && (console.log('Rendering Home (TryOnInterface)'), <TryOnInterface />)}
            {currentPage === 'history' && (console.log('Rendering HistoryPage'), <HistoryPage onNavigateHome={() => setCurrentPage('home')} />)}
            {currentPage === 'help' && (console.log('Rendering HelpPage'), <HelpPage />)}
          </main>
        </div>
      )}
    </>
  )
}

export default App