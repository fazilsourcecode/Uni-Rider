import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import BookingModal from "@/components/booking-modal";
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  CheckCircle, 
  Gauge, 
  Fuel, 
  Settings, 
  Users,
  MapPin,
  Star
} from "lucide-react";
import { Motorcycle } from "@/types";

export default function MotorcycleDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: motorcycle, isLoading } = useQuery({
    queryKey: [`/api/motorcycles/${id}`],
    enabled: !!id,
  });

  // Mock data for demonstration
  const mockMotorcycle: Motorcycle = {
    id: 1,
    ownerId: 2,
    make: "Honda",
    model: "CBR 250R",
    year: 2021,
    type: "Sport Bike",
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
  };

  const mockOwner = {
    id: 2,
    name: "Mike Johnson",
    role: "Computer Science Student",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    isVerified: true,
    rating: 4.8,
    reviewCount: 12,
  };

  const mockReviews = [
    {
      id: 1,
      reviewer: {
        name: "Sarah Chen",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
      },
      rating: 5,
      comment: "Great bike! Very smooth ride and Mike was super helpful. Perfect for getting around campus.",
      createdAt: "2 days ago",
    },
  ];

  const displayMotorcycle = motorcycle || mockMotorcycle;

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col overflow-y-auto fade-in">
      {/* Header with Back Button */}
      <div className="relative">
        <img 
          src={displayMotorcycle.images?.[0] || "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
          alt={`${displayMotorcycle.make} ${displayMotorcycle.model}`}
          className="w-full h-64 object-cover"
        />
        <button 
          onClick={() => setLocation('/dashboard')}
          className="absolute top-4 left-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 bg-white p-6">
        {/* Motorcycle Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {displayMotorcycle.make} {displayMotorcycle.model}
              </h3>
              <p className="text-gray-600">{displayMotorcycle.year} • {displayMotorcycle.type}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ${displayMotorcycle.hourlyRate}
                <span className="text-sm font-normal">/hour</span>
              </p>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {mockOwner.rating} ({mockOwner.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Available Now
          </Badge>
        </div>

        {/* Owner Info */}
        <Card className="bg-gray-50 p-4 mb-6">
          <div className="flex items-center">
            <img 
              src={mockOwner.profileImage}
              alt="Owner" 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{mockOwner.name}</h4>
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{mockOwner.role}</span>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Verified</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setLocation(`/chat/${mockOwner.id}`)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </Card>

        {/* Motorcycle Details */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Gauge className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Mileage</p>
                <p className="font-medium">{displayMotorcycle.mileage.toLocaleString()} km</p>
              </div>
            </div>
            <div className="flex items-center">
              <Fuel className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Fuel Type</p>
                <p className="font-medium">{displayMotorcycle.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Transmission</p>
                <p className="font-medium">{displayMotorcycle.transmission}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Seating</p>
                <p className="font-medium">{displayMotorcycle.seatingCapacity} Seats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
          <Card className="bg-gray-100 p-4">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm text-gray-700">{displayMotorcycle.location}</span>
            </div>
            <p className="text-xs text-gray-600">0.3 miles away • 2 min walk from your location</p>
          </Card>
        </div>

        {/* Recent Reviews */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Recent Reviews</h4>
          <div className="space-y-3">
            {mockReviews.map((review) => (
              <Card key={review.id} className="bg-gray-50 p-3">
                <div className="flex items-center mb-2">
                  <img 
                    src={review.reviewer.profileImage}
                    alt="Reviewer" 
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {review.reviewer.name}
                      </span>
                      <div className="flex ml-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{review.createdAt}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-white border-t border-gray-200 p-4">
        <Button
          onClick={() => setShowBookingModal(true)}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90"
          size="lg"
        >
          Book Now
        </Button>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          motorcycle={displayMotorcycle}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}
