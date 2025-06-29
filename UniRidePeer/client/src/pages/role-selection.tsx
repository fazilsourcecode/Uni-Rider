import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Search, Bike } from "lucide-react";

export default function RoleSelection() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<'borrower' | 'lender' | null>(null);

  const handleRoleSelect = (role: 'borrower' | 'lender') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
      setLocation('/registration');
    }
  };

  return (
    <div className="h-screen flex flex-col fade-in">
      <div className="p-6 pt-12">
        <button onClick={() => setLocation('/')} className="mb-6">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
        <p className="text-gray-600 mb-8">Select how you'd like to use KYKLOS</p>
        
        <div className="space-y-4">
          {/* Borrower Role */}
          <Card 
            className={`p-6 cursor-pointer transition-all ${
              selectedRole === 'borrower' 
                ? 'border-primary bg-blue-50 border-2' 
                : 'border-gray-200 hover:border-primary'
            }`}
            onClick={() => handleRoleSelect('borrower')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Search className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Borrower</h3>
                <p className="text-gray-600 text-sm">Rent motorcycles</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Find and rent motorcycles from other students and staff in your university.</p>
          </Card>
          
          {/* Lender Role */}
          <Card 
            className={`p-6 cursor-pointer transition-all ${
              selectedRole === 'lender' 
                ? 'border-primary bg-blue-50 border-2' 
                : 'border-gray-200 hover:border-primary'
            }`}
            onClick={() => handleRoleSelect('lender')}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Bike className="text-secondary text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Lender</h3>
                <p className="text-gray-600 text-sm">Rent out your motorcycle</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Earn money by renting out your motorcycle to other university members.</p>
          </Card>
        </div>
        
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-4 rounded-xl font-semibold mt-8 ${
            selectedRole 
              ? 'bg-primary text-white hover:bg-primary/90' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
