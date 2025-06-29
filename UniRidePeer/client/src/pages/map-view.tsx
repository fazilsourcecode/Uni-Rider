import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Plus, 
  Minus, 
  Navigation,
  Star
} from "lucide-react";
import { FaMotorcycle } from "react-icons/fa";
import { Motorcycle } from "@/types";

export default function MapView() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);

  const { data: motorcycles } = useQuery({
    queryKey: ['/api/motorcycles/search'],
    staleTime: 30000,
  });

  // Mock data for demonstration
  const mockMotorcycles: Motorcycle[] = [
    {
      id: 1,
      ownerId: 2,
      make: "Honda",
      model: "CBR 250R",
      year: 2021,
      type: "sport",
      mileage: 12450,
      fuelType: "Petrol",
      transmission: "Manual",
      seatingCapacity: 2,
      hourlyRate: "15.00",
      location: "Engineering Building Parking",
      latitude: "37.4275",
      longitude: "-122.1697",
      images: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
      description: "Well-maintained sport bike perfect for campus rides",
      isAvailable: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: 2,
      ownerId: 3,
      make: "Yamaha",
      model: "R15",
      year: 2022,
      type: "sport",
      mileage: 8200,
      fuelType: "Petrol",
      transmission: "Manual",
      seatingCapacity: 2,
      hourlyRate: "12.00",
      location: "Main Library Parking",
      latitude: "37.4285",
      longitude: "-122.1705",
      images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
      description: "Reliable bike with excellent fuel efficiency",
      isAvailable: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: 3,
      ownerId: 4,
      make: "KTM",
      model: "Duke 200",
      year: 2020,
      type: "naked",
      mileage: 15600,
      fuelType: "Petrol",
      transmission: "Manual",
      seatingCapacity: 2,
      hourlyRate: "18.00",
      location: "Student Center",
      latitude: "37.4265",
      longitude: "-122.1710",
      images: ["https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
      description: "Powerful naked bike for adventure seekers",
      isAvailable: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  const displayMotorcycles = motorcycles || mockMotorcycles;

  const handleMotorcycleClick = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle);
  };

  return (
    <div className="h-screen flex flex-col fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 pt-12 relative z-10">
        <div className="flex items-center mb-4">
          <button onClick={() => setLocation('/dashboard')} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Map View</h2>
        </div>
        
        {/* Search with Filters */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-16"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Button
            size="sm"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-lg text-xs hover:bg-primary/90"
          >
            <Filter className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Map Area (Simulated) */}
      <div className="flex-1 relative bg-gray-100">
        {/* Campus map background */}
        <img 
          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
          alt="University campus aerial view" 
          className="w-full h-full object-cover"
        />
        
        {/* Map Overlay Elements */}
        <div className="absolute inset-0">
          {/* Motorcycle Pins */}
          <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => handleMotorcycleClick(displayMotorcycles[0])}
              className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative"
            >
              <FaMotorcycle className="text-sm" />
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 text-xs text-gray-900 whitespace-nowrap shadow-lg opacity-0 hover:opacity-100 transition-opacity">
                Honda CBR - $15/hr
              </div>
            </button>
          </div>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => handleMotorcycleClick(displayMotorcycles[1])}
              className="bg-secondary text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <FaMotorcycle className="text-sm" />
            </button>
          </div>
          
          <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => handleMotorcycleClick(displayMotorcycles[2])}
              className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <FaMotorcycle className="text-sm" />
            </button>
          </div>

          {/* User Location Pin */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-blue-500 rounded-full w-4 h-4 border-2 border-white shadow-lg relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25"></div>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-32 right-4 space-y-2">
          <Button
            size="sm"
            className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Navigation className="w-5 h-5 text-primary" />
          </Button>
          <Button
            size="sm"
            className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </Button>
          <Button
            size="sm"
            className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Bottom Sheet (Selected Motorcycle) */}
      {selectedMotorcycle && (
        <div className="bg-white border-t border-gray-200 p-4 slide-up">
          <div className="flex items-center space-x-4">
            <img 
              src={selectedMotorcycle.images?.[0] || "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
              alt={`${selectedMotorcycle.make} ${selectedMotorcycle.model}`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {selectedMotorcycle.make} {selectedMotorcycle.model}
              </h4>
              <p className="text-sm text-gray-600">0.3 mi away • Available</p>
              <div className="flex items-center">
                <span className="text-primary font-semibold">
                  ${selectedMotorcycle.hourlyRate}/hr
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">4.8</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setLocation(`/motorcycle/${selectedMotorcycle.id}`)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
