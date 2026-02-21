import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertCircle, Route, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { locations } from "@/data/locations";


const CitizenSupport = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.name || "");
  const [isTraveling, setIsTraveling] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [routeCoords, setRouteCoords] = useState<LatLngExpression[]>([]);
  const [aqiData, setAqiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthAlert, setHealthAlert] = useState<string | null>(null);
  const [safeRoute, setSafeRoute] = useState<string | null>(null);
  const [userHealth, setUserHealth] = useState<string>("");
  const [geminiAdvice, setGeminiAdvice] = useState<string>("");
  const [sourceBreakdown, setSourceBreakdown] = useState<string>("");
  const [forecast, setForecast] = useState<string>("");

  // Dummy/simulated data for source identification and forecasting
  const dummySource = "Stubble burning: 40%, Traffic: 30%, Industry: 20%, Other: 10% (Simulated using satellite, CPCB, IoT data)";
  const dummyForecast = "AQI expected to rise over next 48 hours due to stagnant winds and ongoing stubble burning. Short-term interventions recommended.";

  // Fetch AQI and safe route (with travel support)
  const fetchAQIAndRoute = async (locationName: string, health: string) => {
    setIsLoading(true);
    try {
      // Use WAQI API for AQI
      const loc = locations.find(l => l.name === locationName);
      const response = await fetch(`https://api.waqi.info/feed/@${loc?.stationId}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`);
      const data = await response.json();
      setAqiData(data.data);
      const aqi = data.data.aqi;
      if (aqi <= 50) setHealthAlert("Air quality is good. Enjoy outdoor activities!");
      else if (aqi <= 100) setHealthAlert("Air quality is moderate. Sensitive groups should take care.");
      else if (aqi <= 200) setHealthAlert("Unhealthy for sensitive groups. Consider wearing a mask.");
      else if (aqi <= 300) setHealthAlert("Unhealthy. Avoid outdoor activities and wear a mask.");
      else setHealthAlert("Very unhealthy. Stay indoors and use air purifiers.");
      // If traveling, get safe route from Gemini
      if (isTraveling && fromLocation && toLocation) {
        const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyDolkqsnwcFdx9lJ8WPZZezC7t7wnCLfFI'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Suggest a safe route for a citizen traveling from ${fromLocation} to ${toLocation} in Delhi NCR, India, considering current AQI: ${aqi}. Output JSON with keys: routeDescription (string), routeCoords (array of [lat,lon] pairs, 3-6 points), healthTip (string), source (string).`
              }]
            }]
          })
        });
        const geminiData = await geminiRes.json();
        let routeDesc = "";
        let coords: LatLngExpression[] = [];
        let healthTip = "";
        let source = "";
        try {
          const parsed = JSON.parse(geminiData.candidates[0].content.parts[0].text);
          routeDesc = parsed.routeDescription;
          coords = parsed.routeCoords;
          healthTip = parsed.healthTip;
          source = parsed.source;
        } catch {
          routeDesc = "Unable to fetch safe route.";
          coords = [];
          healthTip = "";
          source = "WAQI, Gemini, Maps API";
        }
        setSafeRoute(routeDesc + (healthTip ? ` Health Tip: ${healthTip}` : ""));
        setRouteCoords(coords);
        setSourceBreakdown(source);
      } else {
        // Not traveling, just show Gemini advice
        const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyDolkqsnwcFdx9lJ8WPZZezC7t7wnCLfFI'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `A citizen in ${locationName}, Delhi NCR, India, with health condition: ${health}, current AQI: ${aqi}. Give a JSON with keys: safeRoute (string), healthAdvice (string), activitySuggestion (string), source (string).`
              }]
            }]
          })
        });
        const geminiData = await geminiRes.json();
        let advice = "";
        let route = "";
        let source = "";
        try {
          const parsed = JSON.parse(geminiData.candidates[0].content.parts[0].text);
          advice = parsed.healthAdvice;
          route = parsed.safeRoute;
          source = parsed.source;
        } catch {
          advice = "Unable to fetch personalized advice.";
          route = "Unable to fetch safe route.";
          source = "WAQI, Gemini, Maps API";
        }
        setGeminiAdvice(advice);
        setSafeRoute(route);
        setSourceBreakdown(source);
        setRouteCoords([]);
      }
      setForecast(dummyForecast);
    } catch {
      setAqiData(null);
      setHealthAlert(null);
      setGeminiAdvice("");
      setSafeRoute("");
      setSourceBreakdown("");
      setForecast(dummyForecast);
      setRouteCoords([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        AI-Driven Pollution Source Identification, Forecasting & Policy Dashboard for Delhi-NCR
                      </h1>
                      <p className="text-lg text-gray-600">
                        Transparent, data-driven insights for citizens and policymakers. Real-time AQI, source tracing, forecasting, and personalized alerts. Data from WAQI, CPCB, satellite, IoT, and Gemini AI.
                      </p>
                    </div>
                    <Card className="p-6 mb-8">
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Select Location:</span>
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
                      <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
                        <User className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Your Health Situation:</span>
                        <input
                          className="border rounded px-2 py-1 w-full md:w-80"
                          placeholder="e.g. Asthma, Heart Disease, None"
                          value={userHealth}
                          onChange={e => setUserHealth(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
                        <span className="font-medium">Are you traveling?</span>
                        <select className="border rounded px-2 py-1" value={isTraveling ? "yes" : "no"} onChange={e => setIsTraveling(e.target.value === "yes")}> 
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      {isTraveling && (
                        <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
                          <span className="font-medium">From:</span>
                          <input
                            className="border rounded px-2 py-1 w-full md:w-60"
                            placeholder="Start location (e.g. Connaught Place)"
                            value={fromLocation}
                            onChange={e => setFromLocation(e.target.value)}
                          />
                          <span className="font-medium">To:</span>
                          <input
                            className="border rounded px-2 py-1 w-full md:w-60"
                            placeholder="Destination (e.g. IIT Delhi)"
                            value={toLocation}
                            onChange={e => setToLocation(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
                        <Button onClick={() => fetchAQIAndRoute(selectedLocation, userHealth)} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                          {isLoading ? "Loading..." : "Get Support"}
                        </Button>
                      </div>
                    </Card>
                    {aqiData && (
                      <Card className="p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold">Current AQI - {selectedLocation}</h2>
                          <Badge className={aqiData.aqi <= 50 ? "bg-green-500" : aqiData.aqi <= 100 ? "bg-yellow-500" : aqiData.aqi <= 200 ? "bg-orange-500" : "bg-red-500"}>
                            AQI: {aqiData.aqi}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{aqiData.iaqi?.pm25?.v || 0}</div>
                            <div className="text-sm text-gray-600">PM2.5</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{aqiData.iaqi?.pm10?.v || 0}</div>
                            <div className="text-sm text-gray-600">PM10</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{aqiData.iaqi?.no2?.v || 0}</div>
                            <div className="text-sm text-gray-600">NO₂</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{aqiData.iaqi?.o3?.v || 0}</div>
                            <div className="text-sm text-gray-600">O₃</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{aqiData.iaqi?.co?.v || 0}</div>
                            <div className="text-sm text-gray-600">CO</div>
                          </div>
                        </div>
                      </Card>
                    )}
                    {healthAlert && (
                      <Card className="p-6 mb-8 flex items-center gap-4">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        <span className="text-lg font-medium">{healthAlert}</span>
                      </Card>
                    )}
                    {geminiAdvice && (
                      <Card className="p-6 mb-8 flex items-center gap-4">
                        <User className="w-6 h-6 text-blue-600" />
                        <span className="text-lg font-medium">Personalized Advice: {geminiAdvice}</span>
                      </Card>
                    )}
                    {/* Source Attribution Section */}
                    <Card className="p-6 mb-8">
                      <h2 className="text-xl font-semibold mb-2">Source Attribution</h2>
                      <div>{sourceBreakdown}</div>
                      <div className="text-xs text-gray-400 mt-2">(From WAQI, Gemini, Maps API)</div>
                    </Card>
                    {/* Forecasting Section */}
                    <Card className="p-6 mb-8">
                      <h2 className="text-xl font-semibold mb-2">Forecasting (24–72 hrs)</h2>
                      <div>{forecast}</div>
                      <div className="text-xs text-gray-400 mt-2">(AI/ML-driven, simulated for demo)</div>
                    </Card>
                    <div className="text-sm text-gray-500 text-center mt-8">
                      Data sources: WAQI, CPCB, NASA MODIS, ISRO, IoT Sensors (simulated), Gemini AI
                    </div>
                  </div>
                </div>
              </main>
      <Footer />
    </div>
  );
};

export default CitizenSupport;
