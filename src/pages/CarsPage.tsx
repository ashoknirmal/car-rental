import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Car } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CarCard from '@/components/cars/CarCard';
import CarFilters from '@/components/cars/CarFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCars, useCarLocations } from '@/hooks/useCars';
import { CarFilters as CarFiltersType } from '@/types/database';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const CarsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [filters, setFilters] = useState<CarFiltersType>(
    initialCategory ? { category: initialCategory as any } : {}
  );
  const [searchQuery, setSearchQuery] = useState('');

  const { data: cars, isLoading, error } = useCars(filters);
  const { data: locations = [] } = useCarLocations();

  const filteredCars = cars?.filter((car) =>
    searchQuery
      ? car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Browse Our Fleet
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Find the perfect car for your next adventure from our premium selection
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <CarFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={handleResetFilters}
                  locations={locations}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Search & Mobile Filter */}
              <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, brand, or model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Mobile Filter Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Filter className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <CarFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        onReset={handleResetFilters}
                        locations={locations}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {isLoading
                    ? 'Loading...'
                    : `${filteredCars?.length || 0} cars available`}
                </p>
              </div>

              {/* Cars Grid */}
              {isLoading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl border border-border overflow-hidden animate-pulse"
                    >
                      <div className="aspect-[4/3] bg-muted" />
                      <div className="p-5 space-y-3">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-10 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive">Error loading cars. Please try again.</p>
                </div>
              ) : filteredCars && filteredCars.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Cars Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CarsPage;
