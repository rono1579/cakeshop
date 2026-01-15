import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Phone, Mail, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@/firebase/config';
import { 
  updateProfile as updateFirebaseProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendEmailVerification,
  signOut as firebaseSignOut
} from 'firebase/auth';

interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber?: string;
  emailVerified: boolean;
  photoURL?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Redirect to auth page if user is not logged in
        navigate('/auth');
        return;
      }
      
      setUser({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        emailVerified: user.emailVerified,
        photoURL: user.photoURL || ''
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);


  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const formData = new FormData(e.currentTarget);
    const displayName = formData.get('displayName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    try {
      setIsUpdating(true);
      // Update display name through Firebase
      await updateFirebaseProfile(auth.currentUser, {
        displayName,
        // Note: phoneNumber is not a valid property for updateProfile in Firebase Auth
        // We'll store it in Firestore or your backend in a real app
      });

      // Update local state with both displayName and phoneNumber
      setUser(prev => prev ? { 
        ...prev, 
        displayName, 
        phoneNumber: phoneNumber || prev.phoneNumber 
      } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser?.email) return;

    try {
      setIsUpdatingPassword(true);
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!auth.currentUser) return;

    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: "Verification Email Sent",
        description: "Please check your email to verify your account.",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
      navigate('/');
    } catch (err) {
      const error = err as Error;
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="min-h-screen flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">My Profile</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              {loading ? (
                <div className="flex items-center justify-center p-6">
                  <p>Loading profile...</p>
                </div>
              ) : (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <Input
                          name="displayName"
                          defaultValue={user?.displayName || ''}
                          placeholder="Full Name"
                          required
                          disabled={isUpdating}
                        />
                        <Input
                          name="phoneNumber"
                          defaultValue={user?.phoneNumber || ''}
                          placeholder="Phone Number"
                          disabled={isUpdating}
                        />
                        <div className="flex gap-2">
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : 'Save Changes'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            disabled={isUpdating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h2 className="text-xl font-medium">{user?.displayName || 'No name provided'}</h2>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user?.email}
                          {!user?.emailVerified && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              (Not verified)
                              <button 
                                onClick={handleSendVerificationEmail}
                                className="text-blue-600 hover:underline"
                                type="button"
                              >
                                Verify now
                              </button>
                            </span>
                          )}
                        </p>
                        {user?.phoneNumber && (
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {user.phoneNumber}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
              <p className="text-muted-foreground">No orders yet.</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsEditing(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/wishlist')}
                >
                  Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/cart')}
                >
                  View Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {loading ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
