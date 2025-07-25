import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';

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

const Authentication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
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
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      await login(loginEmail, loginPassword);
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setLoginError('Invalid email or password');
      console.error('Login error:', error);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    
    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    // Validate terms agreement
    if (!agreeToTerms) {
      setRegisterError('You must agree to the terms and conditions');
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
      navigate('/'); // Redirect to home page after successful registration
    } catch (error) {
      setRegisterError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/">
            <h1 className="text-center text-3xl font-bold text-[#002B5C]">Nestify</h1>
          </Link>
        </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`w-1/2 py-2 text-center font-medium text-sm ${
                activeTab === 'login'
                  ? 'text-[#002B5C] border-b-2 border-[#002B5C]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 text-center font-medium text-sm ${
                activeTab === 'register'
                  ? 'text-[#002B5C] border-b-2 border-[#002B5C]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6 text-gray-900">
                Welcome Back
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                Sign in to your Nestify account
              </p>

              {loginError && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {loginError}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  icon={<EmailIcon />}
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

                <Button type="submit" fullWidth>
                  Sign In
                </Button>
              </form>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6 text-gray-900">
                Create Your Account
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                Join Nestify to find your perfect property
              </p>

              {registerError && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
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

                <Button type="submit" fullWidth>
                  Create Account
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
    </>
  );
};

export default Authentication; 