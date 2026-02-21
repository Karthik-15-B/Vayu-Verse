
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
  const [dashboardData, setDashboardData] = useState<any>(null); // { sources, interventions, ai_recommendations }
  const [isLoading, setIsLoading] = useState(false);


useEffect(() => {
  if (!selectedLocation) return;
  const location = locations.find(loc => loc.name === selectedLocation);
  if (!location?.stationId) return;
  let isMounted = true;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.waqi.info/feed/@${location.stationId}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`
      );
      const data = await response.json();
      if (!isMounted) return;
      setAqiData(data.data);

      const params = {
        AQI: data.data.aqi,
        PM25: data.data.iaqi?.pm25?.v ?? null,
        PM10: data.data.iaqi?.pm10?.v ?? null,
        NO2: data.data.iaqi?.no2?.v ?? null,
        O3: data.data.iaqi?.o3?.v ?? null,
        CO: data.data.iaqi?.co?.v ?? null,
        SO2: data.data.iaqi?.so2?.v ?? null,
        NH3: data.data.iaqi?.nh3?.v ?? null
      };

      const geminiPrompt = `Given the following air quality data for ${selectedLocation} (as of ${new Date().toLocaleString()}):\n${Object.entries(params).map(([k,v])=>`${k}: ${v}`).join(", ")}\n
Respond ONLY with a valid JSON object in this format:
{
  "sources": {
    "stubble_burning": number,
    "traffic": number,
    "industries": number,
    "construction": number
  },
  "interventions": {
    "odd_even": { "effectiveness": number, "applied": boolean },
    "firecracker_ban": { "effectiveness": number, "applied": boolean },
    "construction_halt": { "effectiveness": number, "applied": boolean }
  },
  "ai_recommendations": [string, string, string]
}`;

      let dashboard = null;
      try {
        const geminiRes = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": "YOUR_API_KEY",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: geminiPrompt }] }],
            }),
          }
        );

        const geminiJson = await geminiRes.json();
        const dashboardText =
          geminiJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

        console.log("🔍 Gemini raw output:", dashboardText);

        const cleaned = dashboardText.replace(/```json|```/g, "").trim();
        dashboard = JSON.parse(cleaned);
      } catch (e) {
        console.error("❌ Gemini JSON parse error:", e);
        dashboard = null;
      }

      setDashboardData(dashboard);
    } catch (e) {
      console.error("❌ AQICN fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, [selectedLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Policy Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Real-time data visualization tools for policymakers:
                <ul className="list-disc list-inside text-left mx-auto max-w-2xl mt-2">
                  <li>Source contribution breakdown</li>
                  <li>Effectiveness of interventions</li>
                  <li>AI-generated recommendations for targeted interventions</li>
                </ul>
                <span className="text-xs text-gray-400 block mt-2">Powered by AQICN (WAQI) & Gemini AI</span>
              </p>
            </div>
            {/* Dashboard content below remains unchanged */}

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
              {/* AQICN Parameters Table */}
              {aqiData && (
                <Card className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">Current AQICN Parameters</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2">AQI</th>
                          <th className="px-3 py-2">PM2.5</th>
                          <th className="px-3 py-2">PM10</th>
                          <th className="px-3 py-2">NO₂</th>
                          <th className="px-3 py-2">O₃</th>
                          <th className="px-3 py-2">CO</th>
                          <th className="px-3 py-2">SO₂</th>
                          <th className="px-3 py-2">NH₃</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-3 py-2 text-center">{aqiData.aqi ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{aqiData.iaqi?.pm25?.v ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{aqiData.iaqi?.pm10?.v ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{aqiData.iaqi?.no2?.v ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{aqiData.iaqi?.o3?.v ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{aqiData.iaqi?.co?.v ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{aqiData.iaqi?.so2?.v ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{aqiData.iaqi?.nh3?.v ?? '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Gemini Dashboard Data */}
              {dashboardData && (
                <>
                  {/* Source Contribution Breakdown */}
                  {dashboardData.sources && (
                    <Card className="p-6">
                      <h3 className="text-2xl font-semibold mb-4">Source Contribution Breakdown</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(dashboardData.sources).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-3xl font-bold">[value]%</div>
                            <div className="text-gray-700 text-sm capitalize">{key.replace(/_/g, ' ')}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                  {/* Interventions */}
                  {dashboardData.interventions && (
                    <Card className="p-6">
                      <h3 className="text-2xl font-semibold mb-4">Intervention Effectiveness</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(dashboardData.interventions).map(([key, val]: [string, any]) => (
                          <div key={key} className="flex items-center gap-4">
                            <span className="font-semibold text-gray-800 w-40 capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="text-lg font-bold text-green-700">{val.effectiveness}%</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 ml-2">{val.applied ? 'Applied' : 'Not Applied'}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                  {/* AI Recommendations */}
                  {dashboardData.ai_recommendations && (
                    <Card className="p-6">
                      <h3 className="text-2xl font-semibold mb-4">AI Recommendations</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {dashboardData.ai_recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-gray-800">{rec}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </>
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
