import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, Share2, ThermometerSun, Droplets, Wind, CloudRain, 
  ArrowUpRight, ArrowDownRight, AlertTriangle, Shield, Activity,
  Gauge, Leaf, Factory, Car, Users
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface PredictionReportProps {
  prediction: {
    current: {
      aqi: number;
      no2: number;
      o3: number;
      co: number;
      pm10: number;
      pm25: number;
    };
    predicted: {
      aqi: number;
      no2: number;
      o3: number;
      co: number;
      pm10: number;
      pm25: number;
    };
    weather: {
      temperature: number;
      humidity: number;
      windSpeed: number;
      rainfall: number;
      condition: string;
    };
  };
  year: number;
  month: string;
  timeSlot: string;
  specificTime: string;
  location: string;
}

const PredictionReport: React.FC<PredictionReportProps> = ({ 
  prediction, year, month, timeSlot, specificTime, location 
}) => {
  const getHealthRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return {
        status: "Good",
        recommendations: [
          "Continue outdoor activities normally",
          "Keep windows open for ventilation",
          "Perfect conditions for exercise",
          "Ideal for sensitive groups to be outdoors"
        ],
        causes: "Effective pollution control and favorable weather conditions",
        impact: "Maintaining these levels ensures optimal public health",
        preventiveMeasures: [
          "Continue supporting green initiatives",
          "Maintain current emission controls",
          "Monitor and report any sudden changes"
        ]
      };
    } else if (aqi <= 100) {
      return {
        status: "Moderate",
        recommendations: [
          "Sensitive individuals should limit prolonged outdoor exposure",
          "Consider indoor activities during peak hours",
          "Keep windows closed during high pollution periods",
          "Use air purifiers if available"
        ],
        causes: "Moderate increase in vehicular emissions and industrial activities",
        impact: "May cause respiratory issues for sensitive groups",
        preventiveMeasures: [
          "Use public transportation when possible",
          "Avoid burning materials outdoors",
          "Regular maintenance of air purification systems"
        ]
      };
    } else if (aqi <= 150) {
      return {
        status: "Unhealthy for Sensitive Groups",
        recommendations: [
          "Avoid prolonged outdoor activities",
          "Wear N95 masks when outdoors",
          "Use air purifiers indoors",
          "Keep all windows closed",
          "Stay updated with local air quality alerts"
        ],
        causes: "High industrial emissions, vehicle pollution, and unfavorable weather",
        impact: "Increased risk of respiratory and cardiovascular issues",
        preventiveMeasures: [
          "Implement stricter emission controls",
          "Increase use of public transportation",
          "Consider work-from-home options",
          "Regular health check-ups"
        ]
      };
    }
    return {
      status: "Hazardous",
      recommendations: [
        "Stay indoors as much as possible",
        "Seal windows and doors",
        "Use air purifiers on maximum setting",
        "Wear N95 masks if outdoors is necessary",
        "Consider temporary relocation if persistent"
      ],
      causes: "Severe industrial pollution, adverse weather conditions, and possible environmental emergencies",
      impact: "Serious health risks for all population groups",
      preventiveMeasures: [
        "Immediate implementation of emergency pollution controls",
        "Restrict non-essential outdoor activities",
        "Enhanced monitoring of vulnerable populations",
        "Emergency healthcare preparedness"
      ]
    };
  };

  const generatePDF = async () => {
    const element = document.getElementById('prediction-report');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`aqi-prediction-${location}-${month}-${year}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const shareReport = async () => {
    try {
      await navigator.share({
        title: `AQI Prediction Report - ${location}`,
        text: `Air Quality Prediction for ${location} in ${month} ${year}: Current AQI ${prediction.current.aqi} → Predicted AQI ${prediction.predicted.aqi}`,
        url: window.location.href
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const healthInfo = getHealthRecommendations(prediction.predicted.aqi);
  
  const getChangeIndicator = (current: number, predicted: number) => {
    const diff = predicted - current;
    const percentage = ((diff / current) * 100).toFixed(1);
    return {
      icon: diff > 0 ? ArrowUpRight : ArrowDownRight,
      color: diff > 0 ? "text-red-500" : "text-green-500",
      value: `${Math.abs(Number(percentage))}%`
    };
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-aqi-good text-white";
    if (aqi <= 100) return "bg-aqi-moderate text-white";
    if (aqi <= 150) return "bg-aqi-unhealthy text-white";
    return "bg-aqi-hazardous text-white";
  };

  const getTemperatureForTime = () => {
    const hour = parseInt(specificTime.split(':')[0]);
    // Temperature variation based on time
    if (hour >= 0 && hour < 6) return 22;
    if (hour >= 6 && hour < 12) return 26;
    if (hour >= 12 && hour < 15) return 30;
    if (hour >= 15 && hour < 18) return 28;
    if (hour >= 18 && hour < 21) return 25;
    return 23;
  };

  return (
    <div className="space-y-6" id="prediction-report">
      <Card className="p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Detailed Prediction Report</h3>
          <div className="flex gap-2">
            <Button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={shareReport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Current vs Predicted Values
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(prediction.current).map(([key, currentValue]) => {
                const predictedValue = prediction.predicted[key as keyof typeof prediction.predicted];
                const change = getChangeIndicator(currentValue, predictedValue);
                const ChangeIcon = change.icon;
                
                return (
                  <Card key={key} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 uppercase flex items-center gap-2">
                        {key === 'aqi' && <Gauge className="w-4 h-4 text-primary" />}
                        {key === 'no2' && <Factory className="w-4 h-4 text-orange-500" />}
                        {key === 'o3' && <Leaf className="w-4 h-4 text-green-500" />}
                        {key === 'co' && <Car className="w-4 h-4 text-red-500" />}
                        {key === 'pm10' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {key === 'pm25' && <Shield className="w-4 h-4 text-purple-500" />}
                        {key}
                      </span>
                      <ChangeIcon className={`w-4 h-4 ${change.color}`} />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-2xl font-bold ${key === 'aqi' ? getAQIColor(currentValue) : ''} px-2 py-1 rounded`}>
                        {currentValue}
                      </span>
                      <span className="text-lg text-gray-500">→</span>
                      <span className={`text-2xl font-bold ${key === 'aqi' ? getAQIColor(predictedValue) : ''} px-2 py-1 rounded`}>
                        {predictedValue}
                      </span>
                    </div>
                    <span className={`text-sm ${change.color} font-medium`}>{change.value} change</span>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-500" />
              Weather Conditions
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="flex items-center gap-3">
                  <ThermometerSun className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-xl font-medium">{prediction.weather.temperature}°C</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-center gap-3">
                  <Droplets className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="text-xl font-medium">{prediction.weather.humidity}%</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-teal-50 to-green-50">
                <div className="flex items-center gap-3">
                  <Wind className="w-8 h-8 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="text-xl font-medium">{prediction.weather.windSpeed} km/h</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <CloudRain className="w-8 h-8 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Rainfall</p>
                    <p className="text-xl font-medium">{prediction.weather.rainfall} mm</p>
                    <p className="text-sm text-gray-500">{prediction.weather.condition}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Health Status & Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Status
              </h5>
              <p className="text-lg font-semibold mb-2">{healthInfo.status}</p>
              <div className="space-y-2">
                {healthInfo.recommendations.map((rec, index) => (
                  <p key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {rec}
                  </p>
                ))}
              </div>
            </Card>
            <div className="space-y-4">
              <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-red-50">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Causes of Change
                </h5>
                <p className="text-sm text-gray-600">{healthInfo.causes}</p>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Preventive Measures
                </h5>
                <div className="space-y-1">
                  {healthInfo.preventiveMeasures.map((measure, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <Leaf className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {measure}
                    </p>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PredictionReport;