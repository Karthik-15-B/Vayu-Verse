import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LocationModal from "@/components/LocationModal";

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
  { id: "10707", name: "Sri Auribindo Marg" },

];

const About = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-4 bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Us</h1>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to our Air Quality Monitoring Platform – dedicated to enhancing the quality of life through real-time environmental data. We are focused on providing timely, accurate, and easily accessible air quality insights, empowering citizens, organizations, and policymakers to make informed decisions for a healthier tomorrow.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Our Vision</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Our vision is to become a leading platform for real-time air quality monitoring in DELHI NCR, providing critical insights that drive positive change in urban environments. By offering accurate data from multiple locations, we aim to raise awareness about air pollution and help mitigate its effects.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Our Monitoring Stations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                >
                  <p className="text-gray-800 font-medium">{location.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      
      {selectedLocation && (
        <LocationModal
          location={selectedLocation.name}
          stationId={selectedLocation.id}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default About;
