import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Users, Cog, MapPin } from 'lucide-react';
import { Car } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CarCardProps {
  car: Car;
}

const categoryColors: Record<string, string> = {
  suv: 'bg-blue-100 text-blue-700',
  sedan: 'bg-green-100 text-green-700',
  hatchback: 'bg-purple-100 text-purple-700',
  luxury: 'bg-amber-100 text-amber-700',
  sports: 'bg-red-100 text-red-700',
  convertible: 'bg-pink-100 text-pink-700',
};

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const placeholderImage = `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop`;

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border card-hover">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={car.images?.[0] || placeholderImage}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${categoryColors[car.category]} border-0 capitalize`}>
            {car.category}
          </Badge>
          {!car.is_available && (
            <Badge variant="destructive">Unavailable</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
              {car.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {car.brand} {car.model} • {car.year}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 py-3 border-y border-border my-3 text-muted-foreground">
          <div className="flex items-center gap-1.5 text-sm">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Cog className="h-4 w-4" />
            <span className="capitalize">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="h-4 w-4" />
            <span>{car.seats}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span>{car.location}</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-display font-bold text-foreground">
              ${car.price_per_day}
            </span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <Button asChild size="sm" disabled={!car.is_available}>
            <Link to={`/cars/${car.id}`}>
              {car.is_available ? 'View Details' : 'Unavailable'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
