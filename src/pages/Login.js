import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { COLORS } from '../constants/theme';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, googleSignIn } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    display_name: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.error(error.response?.data?.detail || 'An error occurred');
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
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
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
              onClick={() => setIsSignup(!isSignup)}
              className="hover:underline"
              style={{ color: COLORS.brand.deepTeal }}
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </>
  );
};

export default Login;

