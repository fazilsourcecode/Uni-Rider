import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, Upload, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  universityId: z.string().min(1, "University ID is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe", 
      email: "john.doe@university.edu",
      universityId: "STU123456",
      dateOfBirth: "1995-01-01",
    },
  });

  const handleImageUpload = (file: File, type: 'profile' | 'license') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (type === 'profile') {
        setProfileImage(base64String);
      } else {
        setLicenseImage(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const completeProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/complete-profile", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      toast({
        title: "Profile Created",
        description: "Your profile has been created successfully",
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Profile Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    const phoneNumber = localStorage.getItem('registrationPhone') || "";
    const university = localStorage.getItem('registrationUniversity') || "";
    const role = localStorage.getItem('selectedRole') || 'borrower';
    
    completeProfileMutation.mutate({
      ...data,
      phoneNumber,
      university,
      role,
      profileImageUrl: profileImage,
      licenseImageUrl: licenseImage,
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-y-auto fade-in">
      <div className="p-6 pt-12">
        <button onClick={() => setLocation('/otp-verification')} className="mb-6">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Profile</h2>
        <p className="text-gray-600 mb-6">Fill in your details to get started</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Photo */}
            <div className="text-center">
              <input
                type="file"
                ref={profileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'profile');
                }}
              />
              <div 
                className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors relative overflow-hidden"
                onClick={() => profileInputRef.current?.click()}
              >
                {profileImage ? (
                  <>
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileImage(null);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Camera className="text-gray-500 text-xl" />
                )}
              </div>
              <p className="text-sm text-gray-600">Upload Profile Photo</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="universityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your student/staff ID" {...field} />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">This will be verified by your university</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john.doe@university.edu" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driving License
              </label>
              <input
                type="file"
                ref={licenseInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'license');
                }}
              />
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors relative"
                onClick={() => licenseInputRef.current?.click()}
              >
                {licenseImage ? (
                  <div className="relative">
                    <img src={licenseImage} alt="License" className="max-w-full h-32 object-contain mx-auto rounded" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLicenseImage(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="text-gray-400 text-2xl mb-2 mx-auto" />
                    <p className="text-sm text-gray-600">Upload License Photo</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={completeProfileMutation.isPending}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90"
                size="lg"
              >
                {completeProfileMutation.isPending ? "Creating Profile..." : "Complete Profile"}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Profile photos are optional for prototype testing
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
