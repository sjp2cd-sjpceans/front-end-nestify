import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
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
}

const initialFormData: FormData = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  role: 'buyer'
}

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { signIn, signUp, loading } = useAuth()
  const navigate = useNavigate()

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
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
          navigate('/')
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
          navigate('/')
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
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {activeTab === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {activeTab === 'signin' 
                ? 'Find trusted properties and agents' 
                : 'Join TrustSearch for safer real estate transactions'
              }
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => switchTab('signin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'signin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Auth Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                <div className="space-y-2">
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
            </div>

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

            {/* Additional Info for Register */}
            {activeTab === 'register' && (
              <div className="text-xs text-gray-500 text-center space-y-2">
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
    </div>
  )
} 