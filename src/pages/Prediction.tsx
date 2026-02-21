import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PredictionTool from "@/components/PredictionTool";

const Prediction = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AQI Prediction Tool</h1>
              <p className="text-gray-600">
                Predict future Air Quality Index values based on hiatorical data and trends Upto 2100 Year
              </p>
            </div>
            
            <PredictionTool />

            {/* Disclaimer Section */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <h2 className="font-semibold">Disclaimer:</h2>
              <p>
                Predictions use hiatorical data collected from AQICN to estimate future AQI values and may vary with real-world conditions.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Prediction;

