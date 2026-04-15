import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Fuel, Users, Cog, MapPin, Check, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCar } from '@/hooks/useCars';
import { useCreateBooking } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const categoryColors: Record<string, string> = {
  suv: 'bg-blue-100 text-blue-700',
  sedan: 'bg-green-100 text-green-700',
  hatchback: 'bg-purple-100 text-purple-700',
  luxury: 'bg-amber-100 text-amber-700',
  sports: 'bg-red-100 text-red-700',
  convertible: 'bg-pink-100 text-pink-700',
};

const CarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: car, isLoading, error } = useCar(id!);
  const createBooking = useCreateBooking();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online Payment'>('Cash');

  const placeholderImages = [
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
  ];

  const images = car?.images?.length ? car.images : placeholderImages;

  const totalDays = pickupDate && dropoffDate
    ? differenceInDays(dropoffDate, pickupDate)
    : 0;

  const totalAmount = car ? totalDays * Number(car.price_per_day) : 0;

  const handleBook = async () => {
    if (!user) {
      toast.error('Please sign in to book a car');
      navigate('/auth');
      return;
    }

    if (!pickupDate || !dropoffDate) {
      toast.error('Please select pickup and drop-off dates');
      return;
    }

    if (totalDays < 1) {
      toast.error('Drop-off date must be after pickup date');
      return;
    }

    try {
      const bookingResponse = await createBooking.mutateAsync({
        car_id: car!.id,
        pickup_date: format(pickupDate, 'yyyy-MM-dd'),
        dropoff_date: format(dropoffDate, 'yyyy-MM-dd'),
        pickup_location: car!.location,
        dropoff_location: car!.location,
        total_days: totalDays,
        total_amount: totalAmount,
        payment_method: paymentMethod,
      });

      if (paymentMethod === 'Online Payment') {
        const stripeSessionResponse = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/payment/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: bookingResponse._id || bookingResponse.id,
            car_name: `${car!.brand} ${car!.model}`,
            total_amount: totalAmount
          }),
        });

        const sessionData = await stripeSessionResponse.json();
        
        if (sessionData.url) {
          // Temporarily show toast since we don't have preventDefault the react way here
          toast.success('Redirecting to Stripe...');
          window.location.href = sessionData.url;
          return;
        } else {
          toast.error('Failed to create payment session.');
        }
      }

      navigate('/bookings');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Something went wrong during booking.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !car) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Car Not Found</h1>
          <p className="text-muted-foreground mb-6">The car you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/cars">Browse Available Cars</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <img
                src={images[currentImageIndex]}
                alt={car.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === currentImageIndex ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${categoryColors[car.category]} border-0 capitalize`}>
                  {car.category}
                </Badge>
                {!car.is_available && (
                  <Badge variant="destructive">Unavailable</Badge>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {car.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {car.brand} {car.model} • {car.year}
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Fuel className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                <span className="text-sm font-medium capitalize">{car.fuel_type}</span>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Cog className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                <span className="text-sm font-medium capitalize">{car.transmission}</span>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Users className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                <span className="text-sm font-medium">{car.seats} Seats</span>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <MapPin className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                <span className="text-sm font-medium">{car.location}</span>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h3 className="font-display font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground">{car.description}</p>
              </div>
            )}

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-lg mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {car.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            {car.location && (
              <div>
                <h3 className="font-display font-semibold text-lg mb-3">Location</h3>
                <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-muted border border-border">
                  <iframe
                    title="Car Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(car.location)}&output=embed`}
                  ></iframe>
                </div>
              </div>
            )}

            {/* Booking Card */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-display font-bold text-foreground">
                    ${Number(car.price_per_day).toFixed(0)}
                  </span>
                  <span className="text-muted-foreground">/day</span>
                </div>
                {totalDays > 0 && (
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <div className="text-xl font-bold text-accent">${totalAmount.toFixed(2)}</div>
                  </div>
                )}
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      {pickupDate ? format(pickupDate, 'MMM d, yyyy') : 'Pickup Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={pickupDate}
                      onSelect={(date) => {
                        setPickupDate(date);
                        if (date && (!dropoffDate || dropoffDate <= date)) {
                          setDropoffDate(addDays(date, 1));
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      {dropoffDate ? format(dropoffDate, 'MMM d, yyyy') : 'Drop-off Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dropoffDate}
                      onSelect={setDropoffDate}
                      disabled={(date) => date <= (pickupDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {totalDays > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  {totalDays} day{totalDays > 1 ? 's' : ''} rental
                </p>
              )}

              <div className="space-y-2">
                <span className="text-sm font-medium">Payment Method</span>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'Cash' | 'Online Payment')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash on Pickup</SelectItem>
                    <SelectItem value="Online Payment">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={!car.is_available || createBooking.isPending}
                onClick={handleBook}
              >
                {createBooking.isPending ? 'Booking...' : car.is_available ? 'Book Now' : 'Unavailable'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CarDetailPage;
