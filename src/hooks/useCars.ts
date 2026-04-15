import { useQuery } from '@tanstack/react-query';
import { Car, CarFilters } from '@/types/database';

const fetchCars = async (): Promise<Car[]> => {
  const res = await fetch('/api/cars');
  if (!res.ok) throw new Error('Failed to fetch cars');
  return res.json();
};

export const useCars = (filters?: CarFilters) => {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      let data = await fetchCars();
      data = data.filter(car => car.is_available);

      if (filters?.category) {
        data = data.filter(car => car.category === filters.category);
      }
      if (filters?.location) {
        data = data.filter(car => car.location === filters.location);
      }
      if (filters?.fuelType) {
        data = data.filter(car => car.fuel_type === filters.fuelType);
      }
      if (filters?.transmission) {
        data = data.filter(car => car.transmission === filters.transmission);
      }
      if (filters?.minPrice) {
        data = data.filter(car => car.price_per_day >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        data = data.filter(car => car.price_per_day <= filters.maxPrice!);
      }

      return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  });
};

export const useCar = (id: string) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const res = await fetch(`/api/cars/${id}`);
      if (!res.ok) throw new Error('Failed to fetch car');
      return res.json() as Promise<Car>;
    },
    enabled: !!id,
  });
};

export const useAllCars = () => {
  return useQuery({
    queryKey: ['all-cars'],
    queryFn: async () => {
      const data = await fetchCars();
      return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  });
};

export const useCarLocations = () => {
  return useQuery({
    queryKey: ['car-locations'],
    queryFn: async () => {
      const data = await fetchCars();
      const availableCars = data.filter(car => car.is_available);
      const uniqueLocations = [...new Set(availableCars.map((item) => item.location))];
      return uniqueLocations;
    },
  });
};
