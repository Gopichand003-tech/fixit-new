import React from "react";
import Headersection from "../components/Header";
import Herosection from "../components/Hero";
import ServiceCategories from "../components/ServiceCategories";
// import MapSection from "../components/Mapsection";
import Footer from "../components/Footer";
import ServicesPage from "../components/Servicepage";


export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-screen-xl px-4">
        <Headersection />
        <Herosection />
        <ServiceCategories />
        <ServicesPage/>
        {/* <MapSection/> */}
        <Footer/>
      </div>
    </div>
  );
}
