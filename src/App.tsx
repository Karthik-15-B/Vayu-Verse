
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LiveAQI from "./pages/LiveAQI";
import About from "./pages/About";
import Prediction from "./pages/Prediction";
import AQIInsights from "./pages/AQIInsights";
import PolicyDashboard from "./pages/PolicyDashboard";
import CitizenSupport from "./pages/CitizenSupport";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("App component rendering");

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<LiveAQI />} />
            <Route path="/liveaqi" element={<LiveAQI />} />
            <Route path="/about" element={<About />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/aqiinsights" element={<AQIInsights />} />
            <Route path="/policydashboard" element={<PolicyDashboard />} />
            <Route path="/citizensupport" element={<CitizenSupport />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
