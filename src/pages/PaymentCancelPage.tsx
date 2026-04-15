import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-card rounded-xl border border-border p-10 text-center shadow-sm">
          <XCircle className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">Payment Cancelled</h2>
          <p className="text-muted-foreground mb-8">
            The payment process was interrupted. Since you selected "Online Payment", your booking remains in 'pending' status until payment is complete. You can try booking again or change your payment method.
          </p>
          <div className="flex gap-4">
            <Button className="flex-1" onClick={() => navigate('/bookings')}>
              Go to Bookings
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={() => navigate('/cars')}>
              <ArrowLeft className="h-4 w-4" /> Back to Cars
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCancelPage;
