import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { COLORS } from '../constants/theme';
import { toast } from 'sonner';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, googleSignIn } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    display_name: '',
  });

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('At least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('At least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('At least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('At least one special character');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate password in real-time for signup
    if (isSignup && name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password for signup
    if (isSignup) {
      const errors = validatePassword(formData.password);
      if (errors.length > 0) {
        setPasswordErrors(errors);
        toast.error('Please fix password requirements');
        return;
      }
      
      // Validate required fields for signup
      if (!formData.username || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else {
      // Validate required fields for login
      if (!formData.email || !formData.password) {
        toast.error('Please fill in email and password');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup(formData);
        toast.success('Account created successfully!');
      } else {
        await login({ email: formData.email, password: formData.password });
        toast.success('Logged in successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(forgotPasswordEmail);
      toast.success('Password reset link sent! Check your email.');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to send reset email';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT token to get user info (simplified - in production, verify on backend)
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const userInfo = JSON.parse(jsonPayload);

      await googleSignIn({
        id_token: credentialResponse.credential,
        email: userInfo.email,
        full_name: userInfo.name,
        display_name: userInfo.given_name,
      });
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google sign-in failed');
      console.error(error);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div 
        className="flex items-center justify-center py-12 px-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS.brand.deepIndigo} 0%, ${COLORS.brand.deepTeal} 50%, ${COLORS.brand.mindBlue} 100%)`,
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Encouraging Text */}
          <div className="hidden md:block text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Start Retaining Knowledge Today
            </h2>
            <p className="text-xl mb-6 text-white/90">
              Make learning compound, not decay. Join professionals who are transforming how they retain, recall, and reuse knowledge.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: COLORS.brand.neuroYellow }}></div>
                <p className="text-white/90">Adaptive reinforcement guided by your forgetting curve</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: COLORS.brand.neuroYellow }}></div>
                <p className="text-white/90">Transform notes and documents into lasting knowledge</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: COLORS.brand.neuroYellow }}></div>
                <p className="text-white/90">Built for professionals who can't afford to forget</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12" style={{ color: COLORS.brand.deepTeal }} />
              </div>
              <CardTitle className="text-3xl font-bold">MentraFlow</CardTitle>
              <CardDescription>
                {isSignup ? 'Create your account' : 'Sign in to your account'}
              </CardDescription>
            </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="shree6791"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <Input
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    placeholder="John"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={isSignup && passwordErrors.length > 0 && formData.password ? 'border-red-300' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSignup && passwordErrors.length > 0 && formData.password && (
                <div className="mt-2 text-xs text-red-600">
                  <p className="font-medium mb-1">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!isSignup && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-brand-deepTeal hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || (isSignup && passwordErrors.length > 0 && formData.password)}
              style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
            >
              {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google sign-in failed')}
              />
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setPasswordErrors([]);
                setShowForgotPassword(false);
              }}
              className="hover:underline"
              style={{ color: COLORS.brand.deepTeal }}
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold mb-2">Reset Password</h3>
              <form onSubmit={handleForgotPassword} className="space-y-2">
                <Input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading}
                    style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
                  >
                    Send Reset Link
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </>
  );
};

export default Login;

