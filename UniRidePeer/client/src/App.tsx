import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import RoleSelection from "@/pages/role-selection";
import Registration from "@/pages/registration";
import OtpVerification from "@/pages/otp-verification";
import ProfileSetup from "@/pages/profile-setup";
import BorrowerDashboard from "@/pages/borrower-dashboard";
import MotorcycleDetails from "@/pages/motorcycle-details";
import MapView from "@/pages/map-view";
import Chat from "@/pages/chat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/role-selection" component={RoleSelection} />
      <Route path="/registration" component={Registration} />
      <Route path="/otp-verification" component={OtpVerification} />
      <Route path="/profile-setup" component={ProfileSetup} />
      <Route path="/dashboard" component={BorrowerDashboard} />
      <Route path="/motorcycle/:id" component={MotorcycleDetails} />
      <Route path="/map" component={MapView} />
      <Route path="/chat/:userId/:bookingId?" component={Chat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="mobile-container">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
