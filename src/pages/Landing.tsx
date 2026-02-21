
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Leaf, Brain, Wallet, Camera, TreePine, BarChart3, MapPin, Recycle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: "aqi-insights",
      title: "Source Identification",
      description: "Trace pollution sources in real-time using WAQI, CPCB, and satellite data. Get AI-driven breakdowns for targeted interventions.",
      icon: BarChart3,
      color: "from-blue-500 to-blue-700",
      route: "/aqi-insights"
    },
    {
      id: "carbon-tracker",
      title: "Policy Dashboard",
      description: "Real-time analytics for policymakers: source contribution, intervention effectiveness, and AI recommendations. Data from WAQI, CPCB, and more.",
      icon: Leaf,
      color: "from-green-500 to-green-700",
      route: "/carbon-tracker"
    },
    {
      id: "plant-designer",
      title: "Citizen App",
      description: "Hyperlocal AQI, personalized health alerts, and safe-route suggestions. Powered by real-time WAQI and CPCB data.",
      icon: TreePine,
      color: "from-emerald-500 to-emerald-700",
      route: "/plant-designer"
    },
    {
      id: "live-aqi",
      title: "Live AQI Monitoring",
      description: "24/7 air quality updates for Delhi-NCR. Data sourced from WAQI and CPCB monitoring stations.",
      icon: MapPin,
      color: "from-indigo-500 to-indigo-700",
      route: "/live-aqi"
    },
    {
      id: "prediction",
      title: "Forecasting",
      description: "Short-term (24–72 hr) and seasonal AQI predictions using advanced AI/ML models. Data from WAQI, CPCB, and meteorological sources.",
      icon: Brain,
      color: "from-purple-500 to-purple-700",
      route: "/prediction"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                AI-Driven Pollution Source Identification, Forecasting & Policy Dashboard for Delhi-NCR
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Real-time source tracing, AI/ML forecasting, citizen health alerts, and policy analytics for Delhi-NCR
              </p>
              <p className="text-lg text-gray-500 mb-12">
                Data from WAQI, CPCB, and satellite sources. Transparent, actionable insights for citizens and policymakers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/live-aqi")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  View Live AQI
                </Button>
                <Button
                  onClick={() => navigate("/prediction")}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
                >
                  AI Forecasting
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              End-to-End Pollution Management Platform
            </h2>
            <p className="text-lg text-gray-600">
              Real-time data, AI-driven insights, and actionable recommendations for Delhi-NCR
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`p-6 bg-gradient-to-br ${feature.color} text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer`}
                onClick={() => navigate(feature.route)}
              >
                <div className="flex items-center mb-4">
                  <feature.icon className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">{feature.description}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Explore Feature
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
                <div className="text-gray-600">Delhi-NCR Stations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-gray-600">AI/ML Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">72hr</div>
                <div className="text-gray-600">Forecast Range</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Real-time Updates</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
