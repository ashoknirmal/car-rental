import React from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAllBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { BookingStatus } from '@/types/database';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminBookingsPage = () => {
  const { data: bookings, isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateStatus.mutate({ bookingId, status });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">Manage customer bookings</p>
        </div>

        {/* Bookings Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading bookings...</p>
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{booking.car?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{booking.car?.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {booking.profile?.full_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-muted-foreground">{booking.profile?.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-foreground">
                          {format(new Date(booking.pickup_date), 'MMM d')} -{' '}
                          {format(new Date(booking.dropoff_date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-muted-foreground">{booking.total_days} days</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${Number(booking.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${statusColors[booking.status]} capitalize`}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value as BookingStatus)}
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookingsPage;
