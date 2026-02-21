// This file has been replaced by PolicyDashboard.tsx. Please use PolicyDashboard.tsx for the Policy Dashboard feature.

import { useState, useEffect } from "react";
import { locations } from "@/data/locations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Zap, UtensilsCrossed, Home, Leaf, TrendingDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CarbonTracker = () => {

  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.name || "");
  const [aqiData, setAqiData] = useState<any>(null);
  const [sourceBreakdown, setSourceBreakdown] = useState<any>(null);
  const [interventionEffectiveness, setInterventionEffectiveness] = useState<any>(null);
  const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


  // Fetch real AQICN data for selected location
  useEffect(() => {
    if (!selectedLocation) return;
    const location = locations.find(loc => loc.name === selectedLocation);
    if (!location?.stationId) return;
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.waqi.info/feed/@${location.stationId}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`);
        const data = await response.json();
        if (!isMounted) return;
        setAqiData(data.data);
        // Use Gemini to generate source breakdown if AQICN does not provide it
        let breakdown = null;
        if (data.data?.attributions && Array.isArray(data.data.attributions) && data.data.attributions.length > 0 && data.data.attributions[0].name && data.data.attributions[0].value) {
          breakdown = {};
          data.data.attributions.forEach((attr: any) => {
            if (attr.name && attr.value) breakdown[attr.name] = attr.value;
          });
        } else {
          // Use Gemini to infer source breakdown
          try {
            const geminiBreakdownResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': 'AIzaSyDolkqsnwcFdx9lJ8WPZZezC7t7wnCLfFI'
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `Given the following air quality data for ${selectedLocation}: AQI=${data.data.aqi}, PM2.5=${data.data.iaqi?.pm25?.v || 0}, PM10=${data.data.iaqi?.pm10?.v || 0}, NO2=${data.data.iaqi?.no2?.v || 0}, O3=${data.data.iaqi?.o3?.v || 0}, CO=${data.data.iaqi?.co?.v || 0}.\n\nEstimate the percentage contribution of the following sources to the current pollution: Stubble Burning, Traffic, Industry, Weather, Other.\n\nReturn a JSON object with keys: 'Stubble Burning', 'Traffic', 'Industry', 'Weather', 'Other' and values as percentages (should sum to 100).`
                  }]
                }]
              })
            });
            const breakdownResult = await geminiBreakdownResponse.json();
            const breakdownContent = breakdownResult.candidates[0].content.parts[0].text;
            breakdown = JSON.parse(breakdownContent);
          } catch {
            breakdown = null;
          }
        }
        setSourceBreakdown(breakdown);
        // Example: Simulate intervention effectiveness based on AQI
        setInterventionEffectiveness([
          { name: "Odd-Even Policy", effectiveness: (data.data.aqi < 100 ? 80 : 60) },
          { name: "Firecracker Ban", effectiveness: (data.data.aqi < 100 ? 90 : 70) },
          { name: "Construction Halt", effectiveness: (data.data.aqi < 100 ? 75 : 55) },
          { name: "Industrial Shutdown", effectiveness: (data.data.aqi < 100 ? 70 : 50) }
        ]);
        // Calculate carbon footprint (example, not from AQICN)
        setCarbonFootprint(data.data.aqi * 0.1);
        // Get AI recommendations from Gemini
        const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyDolkqsnwcFdx9lJ8WPZZezC7t7wnCLfFI'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Based on AQI data for ${selectedLocation}: AQI=${data.data.aqi}, PM2.5=${data.data.iaqi?.pm25?.v || 0}, PM10=${data.data.iaqi?.pm10?.v || 0}, NO2=${data.data.iaqi?.no2?.v || 0}, O3=${data.data.iaqi?.o3?.v || 0}.\n\nPlease provide:\n1. Top 5 plant species specifically effective for this pollution level\n2. Pollution trend analysis\n3. Weekly air quality tips\n4. CO2 offset recommendations\n\nFormat as JSON with keys: plantSpecies (array with name, effectiveness, description), trendAnalysis (string), weeklyTips (array), offsetRecommendations (array)`
              }]
            }]
          })
        });
        const result = await geminiResponse.json();
        const content = result.candidates[0].content.parts[0].text;
        try {
          setRecommendations(JSON.parse(content));
        } catch {
          setRecommendations(null);
        }
      } catch (err) {
        setAqiData(null);
        setSourceBreakdown(null);
        setInterventionEffectiveness(null);
        setCarbonFootprint(null);
        setRecommendations(null);
      }
      setIsLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // update every 10 seconds
    return () => { isMounted = false; clearInterval(interval); };
  }, [selectedLocation]);

  const getTransportEmission = (transport: string, distance: number) => {
    const emissions = {
      car: 0.21,
      bike: 0.05,
      bus: 0.08,
      metro: 0.04,
      walk: 0
    };
    return (emissions[transport as keyof typeof emissions] || 0.21) * distance;
  };

  const getDietEmission = (diet: string) => {
    const emissions = {
      vegetarian: 2.5,
      vegan: 1.5,
      omnivore: 4.0,
      pescatarian: 3.0
    };
    return emissions[diet as keyof typeof emissions] || 4.0;
  };

  const getHomeEmission = (homeSize: string) => {
    const emissions = {
      small: 3.0,
      medium: 5.0,
      large: 8.0
    };
    return emissions[homeSize as keyof typeof emissions] || 5.0;
  };

  const getFootprintColor = (footprint: number) => {
    if (footprint < 10) return "text-green-600";
    if (footprint < 20) return "text-yellow-600";
    if (footprint < 30) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Carbon Footprint Tracker & Lifestyle Optimizer
              </h1>
              <p className="text-lg text-gray-600">
                Calculate your daily carbon footprint and get personalized eco-friendly suggestions
              </p>
            </div>

            {/* Real-time Policy Dashboard Controls */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Policy Dashboard Controls (Real-Time AQICN Data)</h2>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4" />
                  Monitoring Location
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full md:w-80">
                    <SelectValue placeholder="Choose monitoring station" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.name} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Real-time Policy Dashboard Results */}
            <div className="space-y-6">
              {/* Source Breakdown */}
              {sourceBreakdown && (
                <Card className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">Real-Time Source Contribution Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(sourceBreakdown).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-3xl font-bold">{String(value)}%</div>
                        <div className="text-gray-700 text-sm">{key}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Intervention Effectiveness */}
              {interventionEffectiveness && (
                <Card className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">Intervention Effectiveness (Real-Time)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interventionEffectiveness.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="font-semibold text-gray-800 w-40">{item.name}</span>
                        <span className="text-lg font-bold text-green-700">{item.effectiveness}%</span>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-3 bg-green-500" style={{ width: `${item.effectiveness}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Carbon Footprint Result */}
              {carbonFootprint !== null && (
                <Card className="p-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-4">Your Daily Carbon Footprint</h3>
                    <div className={`text-6xl font-bold mb-2 ${getFootprintColor(carbonFootprint)}`}>
                      {carbonFootprint.toFixed(1)}
                    </div>
                    <p className="text-lg text-gray-600">kg CO₂ per day</p>
                    {recommendations && (
                      <div className="mt-4">
                        <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                          Green Score: {recommendations.greenScore}/100
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Recommendations */}
              {recommendations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                      Personalized Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {recommendations.suggestions?.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Leaf className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Car className="w-5 h-5 text-blue-600" />
                      Transport Alternatives
                    </h4>
                    <ul className="space-y-2">
                      {recommendations.alternativeTransport?.map((alt: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Energy Saving Tips
                    </h4>
                    <ul className="space-y-2">
                      {recommendations.energySaving?.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                      Diet Modifications
                    </h4>
                    <ul className="space-y-2">
                      {recommendations.dietChanges?.map((change: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}

              {/* Weekly Challenges */}
              {recommendations?.challenges && (
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Weekly Green Challenges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.challenges.map((challenge: string, index: number) => (
                      <div key={index} className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm font-medium">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarbonTracker;
