import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  university: z.string().min(1, "Please select your university"),
  countryCode: z.string().default("+1"),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function Registration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      phoneNumber: "",
      university: "",
      countryCode: "+1",
      termsAccepted: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; university: string; role: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('registrationPhone', form.getValues('phoneNumber'));
      localStorage.setItem('registrationUniversity', form.getValues('university'));
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${form.getValues('phoneNumber')}`,
      });
      setLocation('/otp-verification');
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    const selectedRole = localStorage.getItem('selectedRole') || 'borrower';
    const fullPhoneNumber = data.countryCode + data.phoneNumber;
    
    registerMutation.mutate({
      phoneNumber: fullPhoneNumber,
      university: data.university,
      role: selectedRole,
    });
  };

  return (
    <div className="h-screen flex flex-col fade-in">
      <div className="p-6 pt-12">
        <button onClick={() => setLocation('/role-selection')} className="mb-6">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600 mb-8">Enter your university phone number</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <div className="flex">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-20 rounded-r-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                            <SelectItem value="+91">+91</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        className="rounded-l-none"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="stanford">Stanford University</SelectItem>
                      <SelectItem value="mit">MIT</SelectItem>
                      <SelectItem value="harvard">Harvard University</SelectItem>
                      <SelectItem value="berkeley">UC Berkeley</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-600">
                      I agree to the{" "}
                      <span className="text-primary">Terms of Service</span> and{" "}
                      <span className="text-primary">Privacy Policy</span>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90"
              size="lg"
            >
              {registerMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
