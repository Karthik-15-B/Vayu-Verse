import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Wind, Thermometer, Droplets, Gauge, Activity, Cloud, CloudRain } from "lucide-react";

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "bg-aqi-good";
  if (aqi <= 100) return "bg-aqi-moderate";
  if (aqi <= 150) return "bg-aqi-unhealthy";
  return "bg-aqi-hazardous";
};

const getAQIText = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  return "Unhealthy";
};

const getAQITextColor = (aqi: number) => {
  if (aqi <= 50) return "text-aqi-good";
  if (aqi <= 100) return "text-aqi-moderate";
  if (aqi <= 150) return "text-aqi-unhealthy";
  return "text-aqi-hazardous";
};

const locations = [
{ id: "11266", name: "Alipur" },
  { id: "2553", name: "Anand Vihar" },
  { id: "10120", name: "Bramprakash Ayurvedic Hospital, Najafgarh" },
  { id: "10114", name: "Delhi Institute of Tool Engineering, Wazirpur" },
  { id: "10116", name: "DITE Okhla" },
  { id: "10110", name: "Dr. Karni Singh Shooting Range" },
  { id: "10113", name: "ITI Jahangirpuri" },
  { id: "10118", name: "ITI Shahdra, Jhilmil Industrial Area" },
  { id: "10705", name: "Jawaharlal Nehru Stadium" },
  { id: "10111", name: "Major Dhyan Chand National Stadium" },
  { id: "2554", name: "Mandir Marg" },
  { id: "10704", name: "Mother Dairy Plant, Parparganj" },
  { id: "10708", name: "Mundka" },
  { id: "10706", name: "Narela" },
  { id: "10119", name: "National Institute of Malaria Researh, Sector 8, Dwarka" },
  { id: "11300", name: "NISE Gwal Pahari, Gurugram" },
  { id: "10112", name: "PGDAV College, Sriniwaspuri" },
  { id: "11267", name: "Pooth Khurd, Bawana" },
  { id: "2555", name: "Punjabi Bagh" },
  { id: "10124", name: "Pusa" },
  { id: "2556", name: "R.K. Puram" },
  { id: "10115", name: "Satyawati College" },
  { id: "12466", name: "Sector - 1, Noida" },
  { id: "11863", name: "Sector - 125, Noida" },
  { id: "10117", name: "Shaheed Sukhdev College of Business Studies, Rohini" },
  { id: "10121", name: "Sonia Vihar Water Treatment Plant DJB" },
  { id: "10707", name: "Sri Auribindo Marg" }
];

interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  temperature: number;
  humidity: number;
  pressure: number;
  highestAQI?: number;
  lowestAQI?: number;
}

const defaultData: AQIData = {
  aqi: 0,
  pm25: 0,
  pm10: 0,
  no2: 0,
  o3: 0,
  co: 0,
  temperature: 0,
  humidity: 0,
  pressure: 0,
  highestAQI: 0,
  lowestAQI: 0
};

const MainDashboard = () => {
  const { data: aqiData, isLoading } = useQuery({
    queryKey: ["delhi-ncr-aqi"],
    queryFn: async () => {
      const responses = await Promise.all(
        locations.map(loc => 
          fetch(`https://api.waqi.info/feed/@${loc.id}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`)
            .then(res => res.json())
            .catch(() => ({ data: { aqi: 0 } }))
        )
      );
      
      const validData = responses.filter(res => res.data?.aqi && typeof res.data.aqi === 'number');
      
      const averages: AQIData = {
        aqi: 0,
        pm25: 0,
        pm10: 0,
        no2: 0,
        o3: 0,
        co: 0,
        temperature: 0,
        humidity: 0,
        pressure: 0,
        highestAQI: Math.max(...validData.map(res => res.data.aqi)),
        lowestAQI: Math.min(...validData.map(res => res.data.aqi))
      };

      validData.forEach(res => {
        averages.aqi += res.data.aqi;
        averages.pm25 += res.data.iaqi?.pm25?.v || 0;
        averages.pm10 += res.data.iaqi?.pm10?.v || 0;
        averages.no2 += res.data.iaqi?.no2?.v || 0;
        averages.o3 += res.data.iaqi?.o3?.v || 0;
        averages.co += res.data.iaqi?.co?.v || 0;
        averages.temperature += res.data.iaqi?.t?.v || 0;
        averages.humidity += res.data.iaqi?.h?.v || 0;
        averages.pressure += res.data.iaqi?.p?.v || 0;
      });

      const count = validData.length || 1;
      Object.keys(averages).forEach(key => {
        if (key !== 'highestAQI' && key !== 'lowestAQI') {
          averages[key as keyof AQIData] = Math.round((averages[key as keyof AQIData] / count) * 10) / 10;
        }
      });

      return averages;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  const data = aqiData || defaultData;
  const aqiColor = getAQIColor(data.aqi);
  const aqiText = getAQIText(data.aqi);
  const aqiTextColor = getAQITextColor(data.aqi);

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10 bg-black"></div>
        <div className="relative z-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center justify-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Delhi_map_for_WLM-IN.svg/2162px-Delhi_map_for_WLM-IN.svg.png" 
                alt="Air Quality Icon" 
                className="w-8 h-8 invert"
              />
              Delhi-NCR Average Air Quality
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left side statistics */}
              <div className="text-left text-white space-y-3">
                <p className="text-xl font-semibold">Daily Statistics</p>
                <div className="space-y-2">
                  <p className="text-sm opacity-90">
                    Monitoring Stations: <span className="font-bold">20</span>
                  </p>
                  <p className="text-sm opacity-90">
                    Last Updated: <span className="font-bold">{new Date().toLocaleTimeString()}</span>
                  </p>
                  <p className="text-sm opacity-90">
                    Data Source: <span className="font-bold">CPCB</span>
                  </p>
                </div>
              </div>

              {/* Center AQI display */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`${aqiColor} bg-opacity-90 rounded-xl p-8 shadow-lg w-full max-w-xs mx-auto`}>
                  <div className="text-5xl font-bold text-white mb-2">{data.aqi}</div>
                  <div className={`text-lg font-semibold ${aqiTextColor}`}>{aqiText}</div>
                </div>
                <div className="text-white text-center">
                  <p className="text-sm mb-1">Today's Range</p>
                  <div className="flex justify-center gap-4">
                    <div>
                      <p className="text-xs opacity-75">Lowest</p>
                      <p className="font-bold">{data.lowestAQI}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">Highest</p>
                      <p className="font-bold">{data.highestAQI}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side image */}
              <div className="flex justify-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Delhi_map_for_WLM-IN.svg/2162px-Delhi_map_for_WLM-IN.svg.png" 
                  alt="Air Quality Icon Large" 
                  className="w-52 h-52 invert opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="PM2.5" 
          value={data.pm25} 
          unit="µg/m³" 
          icon={Cloud} 
          gradient="from-purple-500 to-purple-700"
          highest={data.pm25 * 1.2}
          lowest={data.pm25 * 0.8}
        />
        <MetricCard 
          title="PM10" 
          value={data.pm10} 
          unit="µg/m³" 
          icon={CloudRain} 
          gradient="from-blue-500 to-blue-700"
          highest={data.pm10 * 1.2}
          lowest={data.pm10 * 0.8}
        />
        <MetricCard 
          title="NO₂" 
          value={data.no2} 
          unit="ppb" 
          icon={Activity} 
          gradient="from-yellow-500 to-yellow-700"
          highest={data.no2 * 1.2}
          lowest={data.no2 * 0.8}
        />
        <MetricCard 
          title="O₃" 
          value={data.o3} 
          unit="ppb" 
          icon={Wind} 
          gradient="from-green-500 to-green-700"
          highest={data.o3 * 1.2}
          lowest={data.o3 * 0.8}
        />
        <MetricCard 
          title="CO" 
          value={data.co} 
          unit="ppm" 
          icon={Activity} 
          gradient="from-red-500 to-red-700"
          highest={data.co * 1.2}
          lowest={data.co * 0.8}
        />
        <MetricCard 
          title="Temperature" 
          value={data.temperature} 
          unit="°C" 
          icon={Thermometer} 
          gradient="from-orange-500 to-orange-700"
          highest={data.temperature * 1.1}
          lowest={data.temperature * 0.9}
        />
        <MetricCard 
          title="Humidity" 
          value={data.humidity} 
          unit="%" 
          icon={Droplets} 
          gradient="from-teal-500 to-teal-700"
          highest={data.humidity * 1.1}
          lowest={data.humidity * 0.9}
        />
        <MetricCard 
          title="Pressure" 
          value={data.pressure} 
          unit="hPa" 
          icon={Gauge} 
          gradient="from-indigo-500 to-indigo-700"
          highest={data.pressure * 1.01}
          lowest={data.pressure * 0.99}
        />
      </div>
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon,
  gradient,
  highest,
  lowest
}: { 
  title: string; 
  value: number; 
  unit: string;
  icon: React.ElementType;
  gradient: string;
  highest: number;
  lowest: number;
}) => (
  <Card className={`p-4 bg-gradient-to-br ${gradient} text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6" />
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-bold mt-2">
      {value} <span className="text-sm font-normal opacity-75">{unit}</span>
    </p>
    <div className="mt-2 text-xs space-y-1 opacity-80">
      <p>High: {Math.round(highest * 10) / 10} {unit}</p>
      <p>Low: {Math.round(lowest * 10) / 10} {unit}</p>
    </div>
  </Card>
);

export default MainDashboard;
