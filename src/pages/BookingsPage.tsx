import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, X, Car, CreditCard } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useBookings, useCancelBooking } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: bookings, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-primary-foreground text-center">
            My Bookings
          </h1>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-card rounded-xl border border-border overflow-hidden card-hover"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Car Image */}
                    <div className="w-full md:w-48 h-40 md:h-auto bg-muted flex-shrink-0">
                      <img
                        src={
                          booking.car?.images?.[0] ||
                          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop'
                        }
                        alt={booking.car?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-foreground">
                            {booking.car?.name || 'Unknown Car'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.car?.brand} {booking.car?.model}
                          </p>
                        </div>
                        <Badge className={`${statusColors[booking.status]} border-0 capitalize`}>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(booking.pickup_date), 'MMM d')} -{' '}
                            {format(new Date(booking.dropoff_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{booking.total_days} days</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {booking.pickup_location}
                            <a
                              href={`https://www.google.com/maps?q=${encodeURIComponent(booking.pickup_location || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline ml-2 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Map
                            </a>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          <span>{booking.payment_method || 'Cash'}</span>
                        </div>
                        <div className="font-semibold text-foreground md:col-span-2">
                          Total: ${Number(booking.total_amount).toFixed(2)}
                        </div>
                      </div>

                      {/* Actions */}
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-1">
                                <X className="h-4 w-4" />
                                Cancel Booking
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this booking? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => cancelBooking.mutate(booking.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No Bookings Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any bookings. Browse our cars to get started!
              </p>
              <Button onClick={() => navigate('/cars')}>Browse Cars</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BookingsPage;
