import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { initiateSTKPush, queryTransactionStatus, STKPushPayload } from '@/services/daraja';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().regex(/^(\+?254|0)?[17]\d{8}$/, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(2, 'Zip code is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const phoneNumber = watch('phoneNumber');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Query payment status periodically
  const { refetch: checkPaymentStatus } = useQuery({
    queryKey: ['paymentStatus', checkoutRequestID],
    queryFn: async () => {
      if (!checkoutRequestID) return null;
      return await queryTransactionStatus(checkoutRequestID);
    },
    enabled: paymentStatus === 'processing' && !!checkoutRequestID,
    refetchInterval: 5000,
    retry: false,
  });

  // STK Push mutation
  const stkPushMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const payload: STKPushPayload = {
        phoneNumber: data.phoneNumber,
        amount: total,
        accountReference: `ORD-${Date.now()}`,
        transactionDescription: `Cake order for ${data.firstName} ${data.lastName}`,
        orderId: `ORD-${Date.now()}`,
      };

      const response = await initiateSTKPush(payload);

      if (response.ResponseCode === '0') {
        setCheckoutRequestID(response.CheckoutRequestID);
        setPaymentStatus('processing');
        return response;
      } else {
        throw new Error(response.ResponseDescription || 'Failed to initiate payment');
      }
    },
    onError: (error: any) => {
      setPaymentStatus('failed');
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty',
        variant: 'destructive',
      });
      return;
    }

    setShowPaymentModal(true);
    await stkPushMutation.mutateAsync(data);
  };

  // Check payment status when processing
  useEffect(() => {
    if (paymentStatus === 'processing' && checkoutRequestID) {
      const interval = setInterval(async () => {
        try {
          const result = await queryTransactionStatus(checkoutRequestID);
          if (result.ResultCode === '0') {
            setPaymentStatus('success');
            toast({
              title: 'Success',
              description: 'Payment completed successfully!',
            });
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } else if (result.ResultCode !== '1016') {
            setPaymentStatus('failed');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [paymentStatus, checkoutRequestID, navigate, toast]);

  if (cartItems.length === 0 && !searchParams.get('from-cart')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/cart')}>Back to Cart</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-3xl font-serif font-bold mb-6">Checkout</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        placeholder="John"
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        placeholder="Doe"
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      {...register('phoneNumber')}
                      placeholder="+254712345678 or 0712345678"
                      className={errors.phoneNumber ? 'border-destructive' : ''}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      placeholder="123 Main Street"
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        placeholder="Nairobi"
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode')}
                        placeholder="00100"
                        className={errors.zipCode ? 'border-destructive' : ''}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900">
                      You will receive an M-Pesa prompt on <strong>{phoneNumber || 'your phone'}</strong> to enter your PIN and complete the payment.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || paymentStatus === 'processing'}
                  size="lg"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    'Complete Order'
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">ksh{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>ksh{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-4">
                  <span>Total</span>
                  <span>ksh{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Status Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
            {paymentStatus === 'processing' && (
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                <p className="text-muted-foreground mb-4">
                  Enter your M-Pesa PIN on your phone to complete the payment.
                </p>
                <p className="text-sm text-muted-foreground">
                  This window will close automatically once payment is confirmed.
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment Successful</h3>
                <p className="text-muted-foreground mb-4">
                  Your order has been placed successfully. You will be redirected shortly.
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
                <p className="text-muted-foreground mb-4">
                  Something went wrong. Please try again.
                </p>
                <Button
                  onClick={() => {
                    setPaymentStatus('idle');
                    setShowPaymentModal(false);
                  }}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Checkout;
