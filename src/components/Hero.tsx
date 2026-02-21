import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Breathe Fresh, Live Healthy
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Empowering communities with real-time air quality insights for a healthier tomorrow.
          </p>
          <Button
            onClick={() => navigate("/about")}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;