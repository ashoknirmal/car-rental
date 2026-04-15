import React from 'react';
import { Car, Calendar, DollarSign, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAllCars } from '@/hooks/useCars';
import { useAllBookings } from '@/hooks/useBookings';

const AdminDashboard = () => {
  const { data: cars } = useAllCars();
  const { data: bookings } = useAllBookings();

  const totalCars = cars?.length || 0;
  const availableCars = cars?.filter((car) => car.is_available).length || 0;
  const totalBookings = bookings?.length || 0;
  const activeBookings = bookings?.filter((b) => b.status === 'active' || b.status === 'confirmed').length || 0;
  const totalRevenue = bookings?.reduce((sum, b) => {
    if (b.status !== 'cancelled') {
      return sum + Number(b.total_amount);
    }
    return sum;
  }, 0) || 0;

  const stats = [
    {
      label: 'Total Cars',
      value: totalCars,
      subValue: `${availableCars} available`,
      icon: Car,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Bookings',
      value: totalBookings,
      subValue: `${activeBookings} active`,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      subValue: 'All time',
      icon: DollarSign,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Growth',
      value: '+12%',
      subValue: 'This month',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const recentBookings = bookings?.slice(0, 5) || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-6 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.subValue}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold text-foreground">Recent Bookings</h2>
          </div>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentBookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{booking.car?.name || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.car?.brand} {booking.car?.model}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {booking.pickup_date} - {booking.dropoff_date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                            booking.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : booking.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'completed'
                              ? 'bg-gray-100 text-gray-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        ${Number(booking.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
