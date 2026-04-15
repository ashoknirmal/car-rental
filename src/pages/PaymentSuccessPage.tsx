import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      toast.error('Invalid payment session');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/payment/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        toast.error('Failed to verify payment status');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-card rounded-xl border border-border p-8 text-center space-y-6 shadow-sm">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <h2 className="text-2xl font-display font-bold">Verifying Payment...</h2>
              <p className="text-muted-foreground mt-2">Please do not close this window.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">Payment Successful!</h2>
              <p className="text-muted-foreground mb-8">
                Your booking is now confirmed. You can view your booking details on your bookings page.
              </p>
              <div className="flex gap-4 w-full">
                <Button className="flex-1" onClick={() => navigate('/bookings')}>
                  View Bookings
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate('/cars')}>
                  Back to Cars
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-4">
              <XCircle className="h-20 w-20 text-destructive mb-6" />
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">Payment Error</h2>
              <p className="text-muted-foreground mb-8">
                We couldn't verify your payment. Please check your bookings or contact support if the issue persists.
              </p>
              <Button className="w-full" onClick={() => navigate('/bookings')}>
                Go to Bookings
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;
