import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { X, CreditCard, Wallet } from "lucide-react";
import { Motorcycle } from "@/types";
import BookingConfirmation from "./booking-confirmation";

const bookingSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().min(1, "End time is required"),
  paymentMethod: z.enum(["card", "wallet"], {
    required_error: "Please select a payment method",
  }),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  motorcycle: Motorcycle;
  onClose: () => void;
}

export default function BookingModal({ motorcycle, onClose }: BookingModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      paymentMethod: "card",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: (data) => {
      setBookingData(data);
      setShowConfirmation(true);
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: "Booking Confirmed",
        description: "Your motorcycle has been successfully booked",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calculateHours = (startDate: string, startTime: string, endDate: string, endTime: string) => {
    if (!startDate || !startTime || !endDate || !endTime) return 0;
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));
  };

  const onSubmit = (data: BookingForm) => {
    const hours = calculateHours(data.startDate, data.startTime, data.endDate, data.endTime);
    
    if (hours <= 0) {
      toast({
        title: "Invalid Duration",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(`${data.startDate}T${data.startTime}`).toISOString();
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`).toISOString();
    
    const rentalCost = hours * parseFloat(motorcycle.hourlyRate);
    const serviceFee = 5.00;
    const insurance = 8.00;
    const totalAmount = rentalCost + serviceFee + insurance;

    bookingMutation.mutate({
      borrowerId: currentUser.id,
      motorcycleId: motorcycle.id,
      startDateTime,
      endDateTime,
      totalAmount: totalAmount.toFixed(2),
      paymentMethod: data.paymentMethod === "card" ? "Credit Card" : "KYKLOS Wallet",
    });
  };

  const watchedValues = form.watch();
  const hours = calculateHours(
    watchedValues.startDate,
    watchedValues.startTime,
    watchedValues.endDate,
    watchedValues.endTime
  );
  const rentalCost = hours * parseFloat(motorcycle.hourlyRate || "0");
  const serviceFee = 5.00;
  const insurance = 8.00;
  const totalAmount = rentalCost + serviceFee + insurance;

  if (showConfirmation) {
    return (
      <BookingConfirmation
        booking={bookingData}
        motorcycle={motorcycle}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Book Motorcycle</h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Motorcycle Summary */}
          <Card className="bg-gray-50 p-4 mb-6">
            <div className="flex items-center">
              <img 
                src={motorcycle.images?.[0] || "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                alt={`${motorcycle.make} ${motorcycle.model}`}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {motorcycle.make} {motorcycle.model}
                </h4>
                <p className="text-sm text-gray-600">${motorcycle.hourlyRate}/hour</p>
              </div>
            </div>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Date & Time Selection */}
              <div className="space-y-4">
                <div>
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              {hours > 0 && (
                <Card className="bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Pricing Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental ({hours} hours)</span>
                      <span className="text-gray-900">${rentalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="text-gray-900">${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="text-gray-900">${insurance.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        <div className="border border-gray-300 rounded-lg p-3 flex items-center space-x-3">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                            <CreditCard className="text-primary mr-3 w-5 h-5" />
                            <span className="text-sm">•••• •••• •••• 1234</span>
                          </Label>
                        </div>
                        <div className="border border-gray-300 rounded-lg p-3 flex items-center space-x-3">
                          <RadioGroupItem value="wallet" id="wallet" />
                          <Label htmlFor="wallet" className="flex items-center flex-1 cursor-pointer">
                            <Wallet className="text-secondary mr-3 w-5 h-5" />
                            <span className="text-sm">KYKLOS Wallet ($125.50)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Booking */}
              <Button
                type="submit"
                disabled={bookingMutation.isPending || hours <= 0}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90"
                size="lg"
              >
                {bookingMutation.isPending ? "Confirming..." : "Confirm Booking"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
