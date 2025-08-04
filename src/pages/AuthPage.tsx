import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Loader2, Shield, CheckCircle, Users } from 'lucide-react'
import { Header } from '../components/ui/Header'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

type AuthTab = 'signin' | 'register'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  role: 'buyer' | 'agent'
  rememberMe: boolean
}

const initialFormData: FormData = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  role: 'buyer',
  rememberMe: false
}

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  
  const { signIn, signUp, loading, profile, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Effect to redirect already authenticated users
  useEffect(() => {
    if (isAuthenticated && profile && !loginSuccess) {
      const redirectTo = profile.role === 'buyer' ? '/dashboard' : '/'
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, profile, navigate, loginSuccess])

  // Effect to handle redirection after successful authentication
  useEffect(() => {
    if (loginSuccess && profile) {
      const redirectTo = profile.role === 'buyer' ? '/dashboard' : '/'
      navigate(redirectTo)
    }
  }, [loginSuccess, profile, navigate])

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    setSubmitError('')
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (activeTab === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      if (activeTab === 'signin') {
        const { error } = await signIn({
          email: formData.email,
          password: formData.password
        })

        if (error) {
          setSubmitError(error.message || 'Failed to sign in')
        } else {
          setLoginSuccess(true)
        }
      } else {
        const { error } = await signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role
        })

        if (error) {
          setSubmitError(error.message || 'Failed to create account')
        } else {
          setLoginSuccess(true)
        }
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Switch tabs and reset form
  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab)
    setFormData(initialFormData)
    setErrors({})
    setSubmitError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* TrustSearch Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">TrustSearch</h1>
          </div>
          <p className="text-lg text-gray-600">Find safer, smarter properties with AI</p>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => switchTab('signin')}
              className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'signin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Auth Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field - only for register */}
              {activeTab === 'register' && (
                <Input
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  icon={<User size={18} />}
                  placeholder="Enter your full name"
                  disabled={loading || isSubmitting}
                />
              )}

              {/* Email field */}
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                icon={<Mail size={18} />}
                placeholder="Enter your email"
                disabled={loading || isSubmitting}
                autoComplete={activeTab === 'signin' ? 'email' : 'username'}
              />

              {/* Password field */}
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                icon={<Lock size={18} />}
                placeholder="Enter your password"
                disabled={loading || isSubmitting}
                autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
              />

              {/* Confirm Password - only for register */}
              {activeTab === 'register' && (
                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  icon={<Lock size={18} />}
                  placeholder="Confirm your password"
                  disabled={loading || isSubmitting}
                  autoComplete="new-password"
                />
              )}

              {/* Role selection - only for register */}
              {activeTab === 'register' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('role', 'buyer')}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        formData.role === 'buyer'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading || isSubmitting}
                    >
                      Property Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('role', 'agent')}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        formData.role === 'agent'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading || isSubmitting}
                    >
                      Real Estate Agent
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password - only for signin */}
              {activeTab === 'signin' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      className="h-4 w-4 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      disabled={loading || isSubmitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    disabled={loading || isSubmitting}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Error */}
              {submitError && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || isSubmitting}
                icon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : undefined}
              >
                {isSubmitting 
                  ? (activeTab === 'signin' ? 'Signing in...' : 'Creating account...')
                  : (activeTab === 'signin' ? 'Sign In' : 'Create Account')
                }
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                disabled={loading || isSubmitting}
                onClick={() => {
                  // Google OAuth would be implemented here
                  alert('Google OAuth not implemented in demo')
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              {/* Switch Auth Mode */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => switchTab(activeTab === 'signin' ? 'register' : 'signin')}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  disabled={loading || isSubmitting}
                >
                  {activeTab === 'signin' ? 'Register instead' : 'Sign in instead'}
                </button>
              </div>

              {/* Additional Info for Register */}
              {activeTab === 'register' && (
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                  <p>
                    Email verification may be required for some features.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>
              <span className="font-medium">Secure &</span><br />
              <span className="font-medium">Encrypted</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>
              <span className="font-medium">Verified</span><br />
              <span className="font-medium">Platform</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span>
              <span className="font-medium">50+ Trusted</span><br />
              <span className="font-medium">Agents</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 