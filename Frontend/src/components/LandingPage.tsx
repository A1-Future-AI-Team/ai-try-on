import React from 'react'
import { Sparkles, Camera, Shirt, Zap, Star, Users, Timer, CheckCircle, Cpu, Lock, Layers, ArrowRight, Mail, Phone, MapPin, User, ArrowLeft } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 flex flex-col items-center justify-start p-0 w-full">
      {/* Hero Section */}
      <nav className="w-full flex justify-between items-center px-8 py-6 bg-transparent">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">Virtual Try-On</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onGetStarted} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl text-lg transition-all duration-200 transform hover:scale-105">Get Started</button>
        </div>
      </nav>
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <section className="w-full flex flex-col items-center justify-center pt-12 pb-8 px-4 text-center">
          <button className="mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 text-purple-300 font-semibold shadow-lg animate-fade-in-up">AI-Powered Virtual Try-On</button>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 animate-fade-in-up">Try On Fashion <span className="text-purple-400">Without Limits</span></h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 animate-fade-in-up">Upload your model photo and any dress design. Our AI instantly creates realistic try-on results, revolutionizing fashion visualization.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up">
            <button onClick={onGetStarted} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
              <Sparkles className="w-6 h-6" />
              <span>Start Your Try-On</span>
            </button>
          </div>
        </section>
        {/* Stats Section */}
        <section className="w-full flex flex-row justify-center gap-16 py-8 bg-transparent animate-fade-in-up">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400">99.9%</div>
            <div className="text-gray-300 text-lg">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300">&lt; 30s</div>
            <div className="text-gray-300 text-lg">Processing Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400">10K+</div>
            <div className="text-gray-300 text-lg">Happy Customers</div>
          </div>
        </section>
        {/* Features / How It Works */}
        <section className="w-full max-w-6xl mx-auto py-16 px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4 animate-fade-in-up">Powerful <span className="text-purple-400">Features</span></h2>
          <p className="text-gray-300 text-lg text-center mb-12 animate-fade-in-up">Everything you need to create stunning virtual try-on experiences with professional-grade results</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-16 animate-fade-in-up">
            <div className="bg-gray-900/50 glass rounded-2xl p-6 flex flex-col items-center">
              <Camera className="w-10 h-10 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">01</div>
              <div className="text-lg font-semibold text-white mb-2">Upload Model Photo</div>
              <p className="text-gray-400 text-center text-sm mb-2">Upload a clear photo of yourself or your model. Our AI works best with well-lit, front-facing photos.</p>
              <span className="text-purple-400 text-xs">Tip: Use natural lighting for best results</span>
            </div>
            <div className="bg-gray-900/50 glass rounded-2xl p-6 flex flex-col items-center">
              <Shirt className="w-10 h-10 text-yellow-300 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">02</div>
              <div className="text-lg font-semibold text-white mb-2">Select Clothing</div>
              <p className="text-gray-400 text-center text-sm mb-2">Choose the dress or clothing item you want to try on. Upload your own design or select from our catalog.</p>
              <span className="text-yellow-300 text-xs">Tip: High-resolution images give better results</span>
            </div>
            <div className="bg-gray-900/50 glass rounded-2xl p-6 flex flex-col items-center">
              <Zap className="w-10 h-10 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">03</div>
              <div className="text-lg font-semibold text-white mb-2">AI Processing</div>
              <p className="text-gray-400 text-center text-sm mb-2">Our advanced AI technology processes both images and creates a realistic virtual try-on in seconds.</p>
              <span className="text-purple-400 text-xs">Tip: Processing typically takes 15-30 seconds</span>
            </div>
            <div className="bg-gray-900/50 glass rounded-2xl p-6 flex flex-col items-center">
              <ArrowRight className="w-10 h-10 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">04</div>
              <div className="text-lg font-semibold text-white mb-2">Download Results</div>
              <p className="text-gray-400 text-center text-sm mb-2">View, download, and share your virtual try-on results. Perfect for social media or decision making.</p>
              <span className="text-green-400 text-xs">Tip: Results are available in multiple formats</span>
            </div>
          </div>
        </section>
        {/* Technology & Capabilities */}
        <section className="w-full max-w-6xl mx-auto py-16 px-4">
          <div className="flex flex-col sm:flex-row gap-12">
            {/* AI Capabilities */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">AI Capabilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">Realistic lighting and shadow generation</span></div>
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">Fabric texture preservation</span></div>
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">Body pose adaptation</span></div>
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">Size and fit adjustment</span></div>
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">Color accuracy maintenance</span></div>
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">High-resolution output (up to 4K)</span></div>
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">Multiple clothing categories</span></div>
                <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-400 mr-3" /><span className="text-gray-300 text-base">Batch processing support</span></div>
              </div>
            </div>
            {/* Performance Metrics */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/60 rounded-xl p-6 flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-1 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-purple-400" />99.9%</div>
                  <div className="text-gray-300 text-base">Accuracy Rate</div>
                </div>
                <div className="bg-gray-900/60 rounded-xl p-6 flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-1">&lt; 30s</div>
                  <div className="text-gray-300 text-base">Processing Time</div>
                </div>
                <div className="bg-gray-900/60 rounded-xl p-6 flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-1">50M+</div>
                  <div className="text-gray-300 text-base">Images Processed</div>
                </div>
                <div className="bg-gray-900/60 rounded-xl p-6 flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">24/7</div>
                  <div className="text-gray-300 text-base">Availability</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 items-center justify-center mt-2">
                <span className="flex items-center"><Lock className="w-4 h-4 mr-1" />Enterprise Security</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-400" />99.9% Uptime</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-400" />SOC 2 Compliant</span>
                <span className="flex items-center"><Zap className="w-4 h-4 mr-1 text-purple-400" />Real-time Processing</span>
              </div>
            </div>
          </div>
        </section>
        {/* Call to Action / How It Works */}
        <section className="w-full flex flex-col items-center justify-center py-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-3">How It <span className="text-purple-400">Works</span></h2>
          <p className="text-gray-300 text-lg text-center mb-12 max-w-2xl">Get started with virtual try-on in just 4 simple steps. No technical expertise required.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 w-full max-w-5xl">
            {/* Step 1 */}
            <div className="bg-gray-900/50 glass rounded-2xl p-8 flex flex-col items-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Upload Model Photo</h3>
              <p className="text-gray-300 text-base text-center">Upload a clear photo of yourself or your model</p>
            </div>
            {/* Step 2 */}
            <div className="bg-gray-900/50 glass rounded-2xl p-8 flex flex-col items-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mb-6">
                <ArrowLeft className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Choose Clothing</h3>
              <p className="text-gray-300 text-base text-center">Select the dress or outfit you want to try on</p>
            </div>
            {/* Step 3 */}
            <div className="bg-gray-900/50 glass rounded-2xl p-8 flex flex-col items-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Get Results</h3>
              <p className="text-gray-300 text-base text-center">Receive your realistic virtual try-on in seconds</p>
            </div>
          </div>
          <button onClick={onGetStarted} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-12 py-5 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full bg-gray-950 border-t border-gray-800 py-12 px-4 mt-8 animate-fade-in-up">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-5 gap-8">
          <div className="sm:col-span-1 flex flex-col space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold text-white">Virtual Try-On</span>
            </div>
            <p className="text-gray-400 text-sm">Revolutionizing fashion with AI-powered virtual try-on technology. Experience the future of online shopping with realistic, instant results.</p>
            <div className="flex items-center space-x-2 mt-2 text-gray-400 text-sm">
              <Mail className="w-4 h-4" />
              <span>hello@virtualtry-on.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-white font-semibold mb-2">Product</span>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Virtual Try-On</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">API Documentation</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Pricing</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Enterprise</a>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-white font-semibold mb-2">Company</span>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">About Us</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Careers</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Blog</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Press Kit</a>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-white font-semibold mb-2">Support</span>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Help Center</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Contact Us</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Status</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Community</a>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-white font-semibold mb-2">Legal</span>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Privacy Policy</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Terms of Service</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">Cookie Policy</a>
            <a className="text-gray-400 hover:text-purple-400 text-sm" href="#">GDPR</a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-8">&copy; {new Date().getFullYear()} Virtual Try-On. All rights reserved.</div>
      </footer>
    </div>
  )
}