
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainDashboard from "@/components/MainDashboard";
import LocationGrid from "@/components/LocationGrid";
import Footer from "@/components/Footer";

const LiveAQI = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        <Hero />
        
        <div className="container mx-auto px-4 py-8 space-y-8">
          <MainDashboard />
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Monitoring Stations</h2>
            <LocationGrid />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiveAQI;
