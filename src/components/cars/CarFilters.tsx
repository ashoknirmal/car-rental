import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CarFilters as CarFiltersType, CarCategory, FuelType, TransmissionType } from '@/types/database';

interface CarFiltersProps {
  filters: CarFiltersType;
  onFilterChange: (filters: CarFiltersType) => void;
  onReset: () => void;
  locations: string[];
}

const categories: { value: CarCategory; label: string }[] = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'sports', label: 'Sports' },
  { value: 'convertible', label: 'Convertible' },
];

const fuelTypes: { value: FuelType; label: string }[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

const transmissions: { value: TransmissionType; label: string }[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];

const CarFilters: React.FC<CarFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  locations,
}) => {
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  );

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Select
          value={filters.location || 'all'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, location: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, category: value === 'all' ? undefined : (value as CarCategory) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <Label>Fuel Type</Label>
        <Select
          value={filters.fuelType || 'all'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, fuelType: value === 'all' ? undefined : (value as FuelType) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All fuel types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fuel types</SelectItem>
            {fuelTypes.map((fuel) => (
              <SelectItem key={fuel.value} value={fuel.value}>
                {fuel.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <Label>Transmission</Label>
        <Select
          value={filters.transmission || 'all'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, transmission: value === 'all' ? undefined : (value as TransmissionType) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All transmissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All transmissions</SelectItem>
            {transmissions.map((trans) => (
              <SelectItem key={trans.value} value={trans.value}>
                {trans.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range (per day)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
