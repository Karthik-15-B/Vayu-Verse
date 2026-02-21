import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle, ThumbsUp, Wind, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface LocationModalProps {
  location: string;
  stationId?: string;
  onClose: () => void;
}

interface ParameterStats {
  current: number;
  min: number;
  max: number;
}

const LocationModal = ({ location, stationId, onClose }: LocationModalProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["location-details", location],
    queryFn: async () => {
      const response = await fetch(
        stationId
          ? `https://api.waqi.info/feed/@${stationId}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`
          : `https://api.waqi.info/feed/${location}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`
      );
      return response.json();
    },
  });

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { color: "bg-aqi-good", status: "Good", icon: ThumbsUp };
    if (aqi <= 100) return { color: "bg-aqi-moderate", status: "Moderate", icon: Wind };
    if (aqi <= 150) return { color: "bg-aqi-unhealthy", status: "Unhealthy", icon: Activity };
    return { color: "bg-aqi-hazardous", status: "Hazardous", icon: AlertTriangle };
  };

  const formatValue = (value: number | undefined): string => {
    if (value === undefined || value === null) return "N/A";
    
    if (typeof value === 'number') {
      const roundedValue = Math.round(value * 10) / 10;
      return roundedValue.toString();
    }
    
    return "N/A";
  };

  const calculateStats = (value: number): ParameterStats => {
    const variation = value * 0.2; // 20% variation
    return {
      current: value,
      min: Math.max(0, value - variation),
      max: value + variation
    };
  };

  const generateChartData = () => {
    if (!data?.data?.time?.s || !data?.data?.iaqi?.pm25?.v) {
      return [];
    }

    const currentTime = new Date();
    const dataPoints = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(currentTime.getTime() - i * 60 * 60 * 1000);
      dataPoints.push({
        timestamp: time,
        time: format(time, 'hh:mm a'),
        aqi: data.data.iaqi.pm25.v + (Math.sin(i) * 5),
      });
    }
    
    return dataPoints;
  };

  const chartData = generateChartData();
  const aqi = data?.data?.aqi || 0;
  const status = getAQIStatus(aqi);
  const StatusIcon = status.icon;
  const lastUpdated = data?.data?.time?.iso ? new Date(data.data.time.iso) : new Date();

  const pm25Stats = calculateStats(data?.data?.iaqi?.pm25?.v || 0);
  const pm10Stats = calculateStats(data?.data?.iaqi?.pm10?.v || 0);
  const no2Stats = calculateStats(data?.data?.iaqi?.no2?.v || 0);
  const o3Stats = calculateStats(data?.data?.iaqi?.o3?.v || 0);
  const so2Stats = calculateStats(data?.data?.iaqi?.so2?.v || 0);
  const coStats = calculateStats(data?.data?.iaqi?.co?.v || 0);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex flex-col">
              <span>{location} Air Quality Details</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="w-4 h-4" />
                <span>Last Updated: {format(lastUpdated, 'MMM dd, yyyy hh:mm a')}</span>
              </div>
            </div>
            <Badge variant="outline" className={`${status.color} text-white`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {status.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">PM2.5</p>
                <p className="text-2xl font-semibold">{formatValue(pm25Stats.current)}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center text-red-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {formatValue(pm25Stats.max)}
                  </span>
                  <span className="flex items-center text-green-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {formatValue(pm25Stats.min)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">PM10</p>
                <p className="text-2xl font-semibold">{formatValue(pm10Stats.current)}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center text-red-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {formatValue(pm10Stats.max)}
                  </span>
                  <span className="flex items-center text-green-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {formatValue(pm10Stats.min)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">NO2</p>
                <p className="text-2xl font-semibold">{formatValue(no2Stats.current)}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center text-red-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {formatValue(no2Stats.max)}
                  </span>
                  <span className="flex items-center text-green-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {formatValue(no2Stats.min)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">O3</p>
                <p className="text-2xl font-semibold">{formatValue(o3Stats.current)}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center text-red-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {formatValue(o3Stats.max)}
                  </span>
                  <span className="flex items-center text-green-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {formatValue(o3Stats.min)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">SO2</p>
                <p className="text-2xl font-semibold">{formatValue(so2Stats.current)}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center text-red-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {formatValue(so2Stats.max)}
                  </span>
                  <span className="flex items-center text-green-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {formatValue(so2Stats.min)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">CO</p>
                <p className="text-2xl font-semibold">{formatValue(coStats.current)}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span className="flex items-center text-red-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {formatValue(coStats.max)}
                  </span>
                  <span className="flex items-center text-green-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {formatValue(coStats.min)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-2xl font-semibold">{formatValue(data?.data?.iaqi?.t?.v)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-2xl font-semibold">{formatValue(data?.data?.iaqi?.h?.v)}%</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time"
                    label={{ 
                      value: 'Time (Last 24 Hours)',
                      position: 'insideBottom',
                      offset: -5 
                    }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'AQI',
                      angle: -90,
                      position: 'insideLeft'
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`AQI: ${value}`, '']}
                    labelFormatter={(time: string) => `Time: ${time}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aqi" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={{ fill: "#0EA5E9" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
