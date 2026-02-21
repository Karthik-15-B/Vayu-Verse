
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Flower, MapPin, TrendingUp, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { locations } from "@/data/locations";
import { useQuery } from "@tanstack/react-query";

const AQIInsights = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [predictions, setPredictions] = useState<any>(null);

  const { data: locationData, isLoading } = useQuery({
    queryKey: ["location-aqi", selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) return null;
      const location = locations.find(loc => loc.name === selectedLocation);
      if (!location?.stationId) return null;
      
      const response = await fetch(`https://api.waqi.info/feed/@${location.stationId}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`);
      const data = await response.json();
      return data.data;
    },
    enabled: !!selectedLocation
  });

  const generateInsights = async () => {
    if (!locationData) return;

    // Fallback data to use if API fails
    const fallbackData = {
      plantSpecies: [
        { name: "Neem (Azadirachta indica)", effectiveness: "High", description: "Excellent for NO2 and PM2.5 absorption" },
        { name: "Peepal (Ficus religiosa)", effectiveness: "High", description: "24/7 oxygen production, CO2 absorption" },
        { name: "Ashoka (Saraca asoca)", effectiveness: "Medium", description: "Good for urban pollution and noise reduction" },
        { name: "Arjun (Terminalia arjuna)", effectiveness: "High", description: "Effective against particulate matter" },
        { name: "Jamun (Syzygium cumini)", effectiveness: "Medium", description: "Natural air purifier with fruit benefits" }
      ],
      trendAnalysis: `Current AQI of ${locationData.aqi} indicates ${locationData.aqi <= 50 ? 'good' : locationData.aqi <= 100 ? 'moderate' : locationData.aqi <= 200 ? 'unhealthy' : 'hazardous'} air quality. Seasonal patterns indicate higher pollution during winter months due to stubble burning and reduced wind circulation.`,
      weeklyTips: [
        "Avoid outdoor activities during peak pollution hours (6-10 AM, 6-9 PM)",
        "Use air purifiers indoors during high AQI days",
        "Plant recommended species in your garden or balcony",
        "Wear N95 masks when AQI exceeds 100"
      ],
      offsetRecommendations: [
        "Plant 2-3 recommended trees to offset daily CO2 emissions",
        "Use public transport or electric vehicles",
        "Install solar panels if possible",
        "Reduce energy consumption by 20%"
      ]
    };

    try {
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyC5ZTrj0768WpfDlthAAsvBOmJTy3xFkYw'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on AQI data for ${selectedLocation}: AQI=${locationData.aqi}, PM2.5=${locationData.iaqi?.pm25?.v || 0}, PM10=${locationData.iaqi?.pm10?.v || 0}, NO2=${locationData.iaqi?.no2?.v || 0}, O3=${locationData.iaqi?.o3?.v || 0}. 
              
              Please provide:
              1. Top 5 plant species specifically effective for this pollution level
              2. Pollution trend analysis
              3. Weekly air quality tips
              4. CO2 offset recommendations
              
              Format as JSON with keys: plantSpecies (array with name, effectiveness, description), trendAnalysis (string), weeklyTips (array), offsetRecommendations (array)`
            }]
          }]
        })
      });

      if (!geminiResponse.ok) {
        console.warn('Gemini API returned error, using fallback data');
        setPredictions(fallbackData);
        return;
      }

      const result = await geminiResponse.json();
      
      if (!result.candidates || !result.candidates[0]?.content?.parts?.[0]?.text) {
        console.warn('Invalid Gemini response format, using fallback data');
        setPredictions(fallbackData);
        return;
      }

      const content = result.candidates[0].content.parts[0].text;
      // Clean markdown code blocks if present
      const cleanedContent = content.replace(/```json|```/g, '').trim();
      const parsedData = JSON.parse(cleanedContent);
      setPredictions(parsedData);
    } catch (error) {
      console.warn('Error generating insights, using fallback data:', error);
      setPredictions(fallbackData);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Air Quality Insights + AI CO₂ Offset Suggestions
              </h1>
              <p className="text-lg text-gray-600">
                Get personalized plant recommendations and pollution insights for your location
              </p>
            </div>

            {/* Location Selection */}
            <Card className="p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Select Location:</span>
                </div>
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
                <Button 
                  onClick={generateInsights}
                  disabled={!selectedLocation || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Generate AI Insights
                </Button>
              </div>
            </Card>

            {/* Current AQI Display */}
            {locationData && (
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Current Air Quality - {selectedLocation}</h2>
                  <Badge className={`${getAQIColor(locationData.aqi)} text-white`}>
                    AQI: {locationData.aqi}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{locationData.iaqi?.pm25?.v || 0}</div>
                    <div className="text-sm text-gray-600">PM2.5</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{locationData.iaqi?.pm10?.v || 0}</div>
                    <div className="text-sm text-gray-600">PM10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{locationData.iaqi?.no2?.v || 0}</div>
                    <div className="text-sm text-gray-600">NO₂</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{locationData.iaqi?.o3?.v || 0}</div>
                    <div className="text-sm text-gray-600">O₃</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{locationData.iaqi?.co?.v || 0}</div>
                    <div className="text-sm text-gray-600">CO</div>
                  </div>
                </div>
              </Card>
            )}

            {/* AI Recommendations */}
            {predictions && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plant Recommendations */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TreePine className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold">Recommended Plants</h3>
                  </div>
                  <div className="space-y-4">
                    {predictions.plantSpecies?.map((plant: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-green-800">{plant.name}</h4>
                          <Badge variant={plant.effectiveness === 'High' ? 'default' : 'secondary'}>
                            {plant.effectiveness}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{plant.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Trend Analysis */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold">Pollution Trend Analysis</h3>
                  </div>
                  <p className="text-gray-700 mb-4">{predictions.trendAnalysis}</p>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      CO₂ Offset Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {predictions.offsetRecommendations?.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Weekly Tips */}
                <Card className="p-6 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                    <h3 className="text-xl font-semibold">Weekly Air Quality Tips</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {predictions.weeklyTips?.map((tip: string, index: number) => (
                      <div key={index} className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AQIInsights;
