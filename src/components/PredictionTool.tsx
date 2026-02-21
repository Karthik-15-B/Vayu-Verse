import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { locations } from "../data/locations";
import { ArrowRight, Activity, Wind, Thermometer, Droplets, Calendar } from "lucide-react";
import PredictionReport from "./PredictionReport";

interface PredictionInputs {
  location: string;
  month: string;
  timeSlot: "morning" | "evening";
  specificTime: string;
  year: number;
  trend: "present" | "increase" | "decrease";
  trendPercentage: number;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PredictionTool = () => {
  const [inputs, setInputs] = useState<PredictionInputs>({
    location: locations[0].stationId || "",
    month: new Date().toLocaleString('default', { month: 'long' }),
    timeSlot: "morning",
    specificTime: "08:00",
    year: 2025,
    trend: "present",
    trendPercentage: 0
  });

  const [showPrediction, setShowPrediction] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<any>(null);

  const { data: currentData } = useQuery({
    queryKey: ["location-aqi", inputs.location],
    queryFn: async () => {
      console.log("Fetching AQI data for location:", inputs.location);
      const response = await fetch(
        `https://api.waqi.info/feed/@${inputs.location}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`
      );
      return response.json();
    },
  });

  const calculateWeatherConditions = (hour: number | string, month: string) => {
    // Convert hour to number if it's a string
    const hourNum = typeof hour === 'string' ? parseInt(hour, 10) : hour;
    
    const seasonalBaseTemp = {
      "December": 22, "January": 20, "February": 23,
      "March": 28, "April": 32, "May": 36,
      "June": 38, "July": 42, "August": 40,
      "September": 35, "October": 30, "November": 25
    };

    const baseTemp = seasonalBaseTemp[month as keyof typeof seasonalBaseTemp] || 30;
    const amplitude = 5;
    const peakHour = 14;
    
    const temperature = baseTemp + amplitude * Math.sin(((hourNum - peakHour) * Math.PI) / 12);
    const baseHumidity = month.match(/June|July|August/) ? 60 : 75;
    const humidity = baseHumidity - (amplitude * Math.sin(((hourNum - peakHour) * Math.PI) / 12));
    const isRainyMonth = month.match(/June|July|August|September/);
    const rainProbability = isRainyMonth ? 0.4 : 0.1;
    const rainfall = Math.random() < rainProbability ? (Math.random() * 5).toFixed(1) : "0";

    return {
      temperature: Math.round(temperature),
      humidity: Math.round(humidity),
      windSpeed: 8 + Math.round(Math.random() * 8),
      rainfall: Number(rainfall),
      condition: Number(rainfall) > 0 ? "Rainy" : (Math.random() > 0.7 ? "Partly Cloudy" : "Clear")
    };
  };

  const calculatePrediction = () => {
    if (!currentData?.data) return null;
    


    const yearDifference = inputs.year - new Date().getFullYear();
    const currentAQI = currentData.data.aqi;
    const hour = parseInt(inputs.specificTime.split(':')[0]);

    const seasonalFactors = {
      "December": 1.2, "January": 1.2, "February": 1.2,
      "March": 1.0, "April": 0.9, "May": 0.8,
      "June": 0.7, "July": 0.7, "August": 0.7,
      "September": 0.8, "October": 0.9, "November": 1.1
    };

    const seasonalFactor = seasonalFactors[inputs.month as keyof typeof seasonalFactors] || 1;
    let predictedAQI = currentAQI * (1 + (yearDifference / 12)) * seasonalFactor;

    if (inputs.trend === "increase") {
      predictedAQI *= (1 + (inputs.trendPercentage / 100));
    } else if (inputs.trend === "decrease") {
      predictedAQI *= (1 - (inputs.trendPercentage / 100));
    }

    const timeAdjustment = inputs.timeSlot === "morning" ? 0.9 : 1.1;
    predictedAQI *= timeAdjustment;

    const weatherConditions = calculateWeatherConditions(hour, inputs.month);

    return {
      current: {
        aqi: currentAQI,
        no2: currentData.data.iaqi.no2?.v || 0,
        o3: currentData.data.iaqi.o3?.v || 0,
        co: currentData.data.iaqi.co?.v || 0,
        pm10: currentData.data.iaqi.pm10?.v || 0,
        pm25: currentData.data.iaqi.pm25?.v || 0,
      },
      predicted: {
        aqi: Math.round(predictedAQI),
        no2: Math.round((currentData.data.iaqi.no2?.v || 0) * (1 + (yearDifference / 12)) * seasonalFactor),
        o3: Math.round((currentData.data.iaqi.o3?.v || 0) * (1 + (yearDifference / 12)) * seasonalFactor),
        co: Math.round((currentData.data.iaqi.co?.v || 0) * (1 + (yearDifference / 12)) * seasonalFactor),
        pm10: calculatePM10Prediction(currentData.data.iaqi.pm10?.v || 0, yearDifference, inputs),
        pm25: calculatePM25Prediction(currentData.data.iaqi.pm25?.v || 0, yearDifference, inputs),
      },
      weather: weatherConditions
    };
  };

  const calculatePM10Prediction = (current: number, yearDifference: number, inputs: PredictionInputs) => {
    const baseChange = current * (yearDifference / 10);
    let predicted = current + baseChange;

    if (inputs.trend === "increase") {
      predicted *= (1 + (inputs.trendPercentage / 100));
    } else if (inputs.trend === "decrease") {
      predicted *= (1 - (inputs.trendPercentage / 100));
    }

    return Math.round(predicted);
  };

  const calculatePM25Prediction = (current: number, yearDifference: number, inputs: PredictionInputs) => {
    const baseChange = current * (yearDifference / 12);
    let predicted = current + baseChange;

    if (inputs.trend === "increase") {
      predicted *= (1 + (inputs.trendPercentage / 100));
    } else if (inputs.trend === "decrease") {
      predicted *= (1 - (inputs.trendPercentage / 100));
    }

    return Math.round(predicted);
  };

  const handlePredict = () => {
    const prediction = calculatePrediction();
    setCurrentPrediction(prediction);
    setShowPrediction(true);
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">AQI Prediction Tool</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select 
              value={inputs.location}
              onValueChange={(value) => setInputs(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.stationId} value={location.stationId || ""}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <Select 
              value={inputs.month}
              onValueChange={(value) => setInputs(prev => ({ ...prev, month: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Slot</label>
            <Select 
              value={inputs.timeSlot}
              onValueChange={(value: "morning" | "evening") => setInputs(prev => ({ ...prev, timeSlot: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8 AM - 8 PM)</SelectItem>
                <SelectItem value="evening">Evening (8 PM - 8 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Specific Time</label>
            <Input
              type="time"
              value={inputs.specificTime}
              onChange={(e) => setInputs(prev => ({ ...prev, specificTime: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Input
              type="number"
              min={2025}
              max={2050}
              value={inputs.year}
              onChange={(e) => setInputs(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trend</label>
            <Select 
              value={inputs.trend}
              onValueChange={(value: "present" | "increase" | "decrease") => setInputs(prev => ({ ...prev, trend: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present Trend</SelectItem>
                <SelectItem value="increase">Increase in Trend</SelectItem>
                <SelectItem value="decrease">Decrease in Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputs.trend !== "present" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Trend Percentage</label>
              <div className="pt-2">
                <Slider
                  value={[inputs.trendPercentage]}
                  onValueChange={(value) => setInputs(prev => ({ ...prev, trendPercentage: value[0] }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <span className="text-sm text-gray-500 mt-1">{inputs.trendPercentage}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handlePredict}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            Generate Prediction
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {showPrediction && currentPrediction && (
        <PredictionReport 
          prediction={currentPrediction}
          year={inputs.year}
          month={inputs.month}
          timeSlot={inputs.timeSlot}
          specificTime={inputs.specificTime}
          location={locations.find(loc => loc.stationId === inputs.location)?.name || "Unknown Location"}
        />
      )}
    </div>
  );
};

export default PredictionTool;
