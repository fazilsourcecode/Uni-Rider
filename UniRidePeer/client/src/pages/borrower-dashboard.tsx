import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Search, 
  Filter, 
  MapPin, 
  History, 
  Bell, 
  MessageCircle, 
  Home, 
  Map as MapIcon, 
  Calendar, 
  User,
  Star,
  CheckCircle 
} from "lucide-react";
import { Motorcycle } from "@/types";

export default function BorrowerDashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const { data: motorcycles, isLoading } = useQuery({
    queryKey: ['/api/motorcycles/search'],
    staleTime: 30000,
  });

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
      images: ["https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
      description: "Powerful naked bike for adventure seekers",
      isAvailable: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  const displayMotorcycles = motorcycles || mockMotorcycles;

  return (
    <div className="h-screen flex flex-col fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                Hi, {currentUser.firstName || 'User'}!
              </h3>
              <div className="flex items-center">
                <span className="text-xs text-green-600 font-medium">Verified</span>
                <CheckCircle className="w-3 h-3 text-green-600 ml-1" />
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>
            <button>
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by location, bike model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-16"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Button
            size="sm"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-lg text-xs hover:bg-primary/90"
          >
            <Filter className="w-3 h-3 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Actions */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={() => setLocation('/map')}
              className="gradient-primary text-white p-4 rounded-xl h-auto flex flex-col items-center justify-center hover:opacity-90"
            >
              <MapPin className="text-lg mb-2" />
              <span className="text-sm font-medium">Map View</span>
            </Button>
            <Button
              className="gradient-secondary text-white p-4 rounded-xl h-auto flex flex-col items-center justify-center hover:opacity-90"
            >
              <History className="text-lg mb-2" />
              <span className="text-sm font-medium">My Bookings</span>
            </Button>
          </div>
        </div>

        {/* Nearby Motorcycles */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Nearby Motorcycles</h4>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>

          <div className="space-y-4">
            {displayMotorcycles.map((motorcycle) => (
              <Card 
                key={motorcycle.id}
                className="p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setLocation(`/motorcycle/${motorcycle.id}`)}
              >
                <div className="flex space-x-4">
                  <img 
                    src={motorcycle.images?.[0] || "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                    alt={`${motorcycle.make} ${motorcycle.model}`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {motorcycle.make} {motorcycle.model}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {motorcycle.year} • {motorcycle.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          ${motorcycle.hourlyRate}/hr
                        </p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">4.8 (12)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>0.3 mi • 2 min walk</span>
                      </div>
                      <Badge 
                        className={`px-2 py-1 rounded-full text-xs ${
                          motorcycle.isAvailable 
                            ? 'bg-green-500 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        {motorcycle.isAvailable ? 'Available' : 'Busy Soon'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="h-20"></div> {/* Bottom spacing for navigation */}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 text-primary">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => setLocation('/map')}
            className="flex flex-col items-center py-2 text-gray-500"
          >
            <MapIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Map</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Bookings</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">Messages</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
