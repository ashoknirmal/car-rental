import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, BookingStatus } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { API_URL } from "./config";

export const useBookings = () => {
  const { user, session } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user || !session) return [];

      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch bookings');
      
      const data = await res.json();
      return data.map((b: any) => ({
        ...b,
        id: b._id || b.id,
        car: b.car_id ? {
          ...b.car_id,
          images: b.car_id.images || [],
        } : null,
        profile: b.user_id
      })) as (Booking & { car: any })[];
    },
    enabled: !!user && !!session,
  });
};

export const useAllBookings = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['all-bookings'],
    queryFn: async () => {
      if (!session) return [];
      
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch all bookings');

      const data = await res.json();
      return data.map((b: any) => ({
        ...b,
        id: b._id || b.id,
        car: b.car_id ? {
          ...b.car_id,
          images: b.car_id.images || [],
        } : null,
        profile: b.user_id
      }));
    },
    enabled: !!session,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  return useMutation({
    mutationFn: async (booking: {
      car_id: string;
      pickup_date: string;
      dropoff_date: string;
      pickup_location: string;
      dropoff_location: string;
      total_days: number;
      total_amount: number;
      payment_method: 'Cash' | 'Online Payment';
      notes?: string;
    }) => {
      if (!user || !session) throw new Error('You must be logged in to book');

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(booking),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!session) throw new Error('Unauthorized');
      
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to cancel booking');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel booking');
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      if (!session) throw new Error('Unauthorized');

      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update booking status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update booking');
    },
  });
};

