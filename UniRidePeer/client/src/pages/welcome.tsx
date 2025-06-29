import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { FaMotorcycle } from "react-icons/fa";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 gradient-primary text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-32 right-8 w-24 h-24 rounded-full border border-white"></div>
          <div className="absolute top-1/2 right-16 w-16 h-16 rounded-full border border-white"></div>
        </div>
        
        <div className="text-center z-10 fade-in">
          <div className="mb-8">
            <FaMotorcycle className="text-6xl mb-4 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-4">KYKLOS</h1>
          <p className="text-lg opacity-90 mb-2">Campus Motorcycle Sharing</p>
          <p className="text-sm opacity-75 px-4">Rent motorcycles from fellow students and staff at your university</p>
        </div>
      </div>
      
      {/* Bottom CTA Section */}
      <div className="p-6 space-y-4">
        <Button 
          onClick={() => setLocation('/role-selection')}
          className="w-full gradient-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:opacity-90 transition-opacity"
          size="lg"
        >
          Get Started
        </Button>
        <p className="text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
