import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import loginBg from '../../assets/images/login-bg.png';

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Authentication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, loading, isAuthenticated } = useAuth();
  
  // Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAgent, setIsAgent] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Form error state
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Parse URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    // Set active tab based on URL parameter
    if (tabParam === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location.search]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    
    try {
      await login(loginEmail, loginPassword);
      // Redirect will happen automatically due to the useEffect above
    } catch (error: any) {
      // Handle specific error messages from API
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsSubmitting(true);
    
    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      setRegisterError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    // Validate terms agreement
    if (!agreeToTerms) {
      setRegisterError('You must agree to the terms and conditions');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await register({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        role: isAgent ? 'agent' : 'client',
      });
      // Redirect will happen automatically due to the useEffect above
    } catch (error: any) {
      // Handle specific error messages from API
      if (error.response && error.response.data && error.response.data.error) {
        setRegisterError(error.response.data.error);
      } else {
      setRegisterError('Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Header />
      <div 
        className="min-h-screen flex flex-col justify-center items-center py-12"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Background overlay */}
        <div 
          className="absolute inset-0 bg-white/90"
          style={{ backdropFilter: 'blur(2px)' }}
        ></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
            <div className="flex">
            <button
                className={`w-1/2 py-4 text-center font-medium ${
                activeTab === 'login'
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
                disabled={loading}
            >
              Login
            </button>
            <button
                className={`w-1/2 py-4 text-center font-medium ${
                activeTab === 'register'
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
                disabled={loading}
            >
              Register
            </button>
          </div>

            <div className="px-8 py-8">
          {/* Login Form */}
          {activeTab === 'login' && (
            <div>
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center text-[#002B5C]">
                      <HomeIcon />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
                Welcome Back
              </h2>
                  <p className="text-center text-sm text-gray-600 mb-8">
                Sign in to your Nestify account
              </p>

              {loginError && (
                    <div className="mb-6 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {loginError}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <Input
                  label="Email Address"
                      type="text"
                      name="usernameOrEmail"
                      id="usernameOrEmail"
                  placeholder="Enter your email"
                      autoComplete="username email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  icon={<EmailIcon />}
                      disabled={isSubmitting}
                />

                <div>
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    icon={<LockIcon />}
                        disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#002B5C] focus:ring-[#002B5C] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-[#002B5C] hover:text-[#002B5C]/80">
                      Forgot password?
                    </a>
                  </div>
                </div>

                    <Button 
                      type="submit" 
                      fullWidth 
                      disabled={isSubmitting || !loginEmail || !loginPassword}
                      variant="secondary"
                      className="py-3"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <LoadingSpinner /> Signing In...
                        </span>
                      ) : (
                        'Sign In'
                      )}
                </Button>
              </form>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div>
                  <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
                Create Your Account
              </h2>
                  <p className="text-center text-sm text-gray-600 mb-8">
                Join Nestify to find your perfect property
              </p>

              {registerError && (
                    <div className="mb-6 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {registerError}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                        disabled={isSubmitting}
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                        disabled={isSubmitting}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  name="regEmail"
                  id="regEmail"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  icon={<EmailIcon />}
                      disabled={isSubmitting}
                />

                <Input
                  label="Password"
                  type="password"
                  name="regPassword"
                  id="regPassword"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  icon={<LockIcon />}
                      disabled={isSubmitting}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<LockIcon />}
                      disabled={isSubmitting}
                />

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="userType"
                      value="agent"
                      checked={isAgent}
                      onChange={(e) => setIsAgent(e.target.checked)}
                      className="h-4 w-4 text-[#002B5C] focus:ring-[#002B5C] border-gray-300 rounded"
                          disabled={isSubmitting}
                    />
                    <span className="ml-2 block text-sm text-gray-700">
                      Register as an Agent/Broker
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="terms"
                      required
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="h-4 w-4 text-[#002B5C] focus:ring-[#002B5C] border-gray-300 rounded"
                          disabled={isSubmitting}
                    />
                    <span className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-[#002B5C] hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#002B5C] hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                    <Button 
                      type="submit" 
                      fullWidth
                      className="py-3"
                      disabled={isSubmitting || !firstName || !lastName || !registerEmail || !registerPassword || !confirmPassword}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <LoadingSpinner /> Creating Account...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                </Button>
              </form>
            </div>
          )}

          <div className="mt-6">
            <p className="text-center text-xs text-gray-600">
              Secure access for Agents, Brokers, and Clients
            </p>
              </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Authentication; 