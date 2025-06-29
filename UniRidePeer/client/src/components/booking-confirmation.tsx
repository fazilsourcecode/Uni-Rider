import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import { Motorcycle, Booking } from "@/types";

interface BookingConfirmationProps {
  booking: Booking;
  motorcycle: Motorcycle;
  onClose: () => void;
}

export default function BookingConfirmation({ 
  booking, 
  motorcycle, 
  onClose 
}: BookingConfirmationProps) {
  const [, setLocation] = useLocation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateDuration = () => {
    const start = new Date(booking.startDateTime);
    const end = new Date(booking.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    return hours;
  };

  const handleGoToBookings = () => {
    onClose();
    setLocation('/dashboard');
  };

  const handleMessageOwner = () => {
    onClose();
    setLocation(`/chat/${motorcycle.ownerId}/${booking.id}`);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center px-6 fade-in">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="text-green-600 text-3xl w-12 h-12" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8">
          Your motorcycle has been successfully booked. Check your email for details.
        </p>
        
        {/* Booking Details Card */}
        <Card className="bg-gray-50 p-6 text-left mb-8 max-w-sm mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-medium">#{String(booking.id).padStart(8, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Motorcycle</span>
              <span className="font-medium">{motorcycle.make} {motorcycle.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">{formatDate(booking.startDateTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-medium">
                {formatTime(booking.startDateTime)} - {formatTime(booking.endDateTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{calculateDuration()} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-medium text-primary">${booking.totalAmount}</span>
            </div>
          </div>
        </Card>
        
        <div className="space-y-3 w-full max-w-sm mx-auto">
          <Button
            onClick={handleGoToBookings}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90"
            size="lg"
          >
            Go to My Bookings
          </Button>
          <Button
            onClick={handleMessageOwner}
            variant="outline"
            className="w-full border-primary text-primary py-4 rounded-xl font-semibold hover:bg-primary/5"
            size="lg"
          >
            Message Owner
          </Button>
        </div>
      </div>
    </div>
  );
}
