import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OtpVerification() {
  const [, setLocation] = useLocation();
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const { toast } = useToast();
  
  const phoneNumber = localStorage.getItem('registrationPhone') || "";

  const verifyMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; code: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
      setLocation('/profile-setup');
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);
      
      // Move to next input if value is entered
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const code = otpCode.join('');
    if (code.length === 6) {
      verifyMutation.mutate({
        phoneNumber,
        code,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col fade-in">
      <div className="p-6 pt-12">
        <button onClick={() => setLocation('/registration')} className="mb-6">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Phone</h2>
        <p className="text-gray-600 mb-8">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium">{phoneNumber}</span>
        </p>
        
        <div className="flex justify-center space-x-3 mb-8">
          {otpCode.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 focus:border-primary"
            />
          ))}
        </div>
        
        <Button
          onClick={handleVerify}
          disabled={otpCode.join('').length !== 6 || verifyMutation.isPending}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold mb-4 hover:bg-primary/90"
          size="lg"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify & Continue"}
        </Button>
        
        <p className="text-center text-sm text-gray-500">
          Didn't receive the code?{" "}
          <span className="text-primary font-medium cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}
