import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { auth } from '../firebase/config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Type for reCAPTCHA verifier
interface RecaptchaVerifierType {
  render: () => void;
  verify: () => Promise<void>;
  clear: () => void;
  // Add other methods as needed
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifierType;
  }
}

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
  applyActionCode,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import {toast} from 'sonner'

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  
  const [currentPage, setCurrentPage] = useState(mode || 'login');
  
  // Redirect to home if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [canRegisterAsAdmin, setCanRegisterAsAdmin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'customer'>('customer');

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    // Clear any existing reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    // Initialize new reCAPTCHA verifier
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        'size': 'invisible',
        'callback': () => {
          console.log('reCAPTCHA verified');
        }
      }
    );

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Check admin availability when entering register page
  useEffect(() => {
    if (currentPage === 'register') {
      checkAdminAvailability();
    }
  }, [currentPage]);

  const checkAdminAvailability = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/check-admin-availability`);
      const data = await response.json();
      if (data.success) {
        setCanRegisterAsAdmin(data.canRegisterAsAdmin);
      }
    } catch (error) {
      console.error('Failed to check admin availability:', error);
      // Default to allowing admin registration on error
      setCanRegisterAsAdmin(true);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Ensure reCAPTCHA is ready
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA not ready. Please try again.');
      }

      // Format phone number (add country code if missing)
      const formattedPhoneNumber = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+254${phoneNumber}`; // Default to Kenya country code

      // Request verification code
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setCurrentPage('verify');
      setMessage('Verification code sent to your phone');
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      setError(error.message || 'Failed to send verification code');
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      if (confirmationResult) {
        await confirmationResult.confirm(verificationCode);
        // User is signed in
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification when oobCode is present
  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (oobCode && mode === 'verifyEmail') {
        try {
          await applyActionCode(auth, oobCode);
          setMessage('Email verified successfully! You can now sign in.');
          setCurrentPage('login');
          // Remove oobCode from URL
          navigate('/auth', { replace: true });
        } catch (error) {
          setError('Failed to verify email. The link may have expired or is invalid.');
          console.error('Email verification error:', error);
        }
      }
    };

    handleVerifyEmail();
  }, [oobCode, mode, navigate]);
  const handleEmailLogin = async () => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      // Success - user is signed in
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Error signing in:', error);
    }
  };
  const handleEmailRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Register user in MongoDB with role selection
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: name,
            isAdmin: selectedRole === 'admin',
            photoURL: user.photoURL,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          setError(data.message || 'Failed to register user');
          // Delete Firebase user if registration fails
          await user.delete();
          return;
        }
      } catch (dbError) {
        console.error('Database registration error:', dbError);
        setError('Failed to register user in database');
        await user.delete();
        return;
      }

      await sendEmailVerification(user);
      setMessage('Registration successful! Please check your email to verify your account.');
      setVerificationSent(true);
      setCurrentPage('verify-email');
    } catch (error) {
      setError('Failed to create an account. ' + (error as Error).message);
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      setError('');
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      setError('Failed to send verification email. ' + (error as Error).message);
      console.error('Resend verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
      setCurrentPage('login');
    } catch (error) {
      setError('Failed to send password reset email. ' + (error as Error).message);
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setIsLoading(true);
            setError('');

            // Sign in with Google and wait for the result
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user) {
            // Check if the user is new or existing
            const isNewUser = result._tokenResponse?.isNewUser;

            // If new user, register in MongoDB as customer (Google users default to customer)
            if (isNewUser) {
              try {
                await fetch(`${API_URL}/auth/register`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    isAdmin: false,
                    photoURL: user.photoURL,
                  }),
                });
              } catch (dbError) {
                console.error('Database registration error:', dbError);
                // Continue even if database registration fails
              }
            }

            // Redirect to profile after successful sign in
            toast({
                title: `Welcome back${isNewUser ? ' to Sweet Treats Cakes' : ''}, ${user.displayName || 'User'}!`,
                description: isNewUser ? 'Your account has been created successfully!' : undefined
            });

            // Use React Router's navigate for SPA navigation
            navigate('/profile');
            }
        } catch (error) {
            const errorMessage = (error as Error).message || 'Failed to sign in with Google.';
            setError(errorMessage);
            console.error('Google sign in error:', error);

            // Show error toast
            toast({
                title: "Sign In Failed",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    //sync URL params with current page
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (currentPage === 'login') {
            params.set('mode', 'login');
        } else {
            params.set('mode', currentPage);
        }
        navigate(`?${params.toString()}`, { replace: true });
    }, [currentPage, navigate, searchParams]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fce7f3' }}>
      {/* Success/Error Messages */}
      {message && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Verify Email Page */}
      {currentPage === 'verify-email' && (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Please check your email and click the verification link to activate your account.
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleResendVerification}
                className="w-full h-11 bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                Resend Verification Email
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage('login')}
                className="w-full h-11"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Password Page */}
      {currentPage === 'reset-password' && (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <Button 
              onClick={handlePasswordReset}
              className="w-full h-11 bg-pink-600 hover:bg-pink-700"
              disabled={isLoading}
            >
              Send Reset Link
            </Button>
            <div className="text-center">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                ← Back to Login
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Login Page */}
      {currentPage === 'login' && (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full h-11 text-base font-medium"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    onClick={() => setCurrentPage('reset-password')}
                    className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button 
                onClick={handleEmailLogin} 
                className="w-full h-11 bg-pink-600 hover:bg-pink-700"
              >
                Sign In
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or sign in with phone</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button 
                onClick={handlePhoneSubmit} 
                variant="outline"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
              <div id="recaptcha-container"></div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </CardFooter>
        </Card>
      )}

      {/* Registration Page */}
      {currentPage === 'register' && (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full h-11 text-base font-medium"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or register with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label>Account Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="customer-role"
                      name="role"
                      value="customer"
                      checked={selectedRole === 'customer'}
                      onChange={(e) => setSelectedRole(e.target.value as 'customer')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="customer-role" className="font-normal cursor-pointer">
                      Customer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="admin-role"
                      name="role"
                      value="admin"
                      checked={selectedRole === 'admin'}
                      onChange={(e) => setSelectedRole(e.target.value as 'admin')}
                      disabled={!canRegisterAsAdmin}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor="admin-role"
                      className={`font-normal cursor-pointer ${!canRegisterAsAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Admin
                      {!canRegisterAsAdmin && <span className="text-xs text-gray-500 ml-2">(Not available)</span>}
                    </Label>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleEmailRegister}
                className="w-full h-11 bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                Create Account
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </CardFooter>
        </Card>
      )}

      {currentPage === 'verify' && (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify Your Phone</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code sent to {phoneNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  maxLength={6}
                  className="h-11 text-center text-2xl tracking-widest"
                />
              </div>
              <Button 
                onClick={handleVerifySubmit}
                className="w-full h-11 bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                Verify and Continue
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                ← Back to Login
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button 
                  onClick={() => alert('Code resent!')}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Resend
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add reCAPTCHA container */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
    </div>
  );
}
