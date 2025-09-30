import React, { lazy, Suspense } from "react";
import Headersection from "../components/Header";

// ✅ Lazy load heavy components
const Herosection = lazy(() => import("../components/Hero"));
const ServiceCategories = lazy(() => import("../components/ServiceCategories"));
const ServicesPage = lazy(() => import("../components/Servicepage"));
const Footer = lazy(() => import("../components/Footer"));

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-screen-xl px-4">
        <Headersection />

        <Suspense fallback={<div className="text-center p-4">Loading Hero...</div>}>
          <Herosection />
        </Suspense>

        <Suspense fallback={<div className="text-center p-4">Loading Categories...</div>}>
          <ServiceCategories />
        </Suspense>

        <Suspense fallback={<div className="text-center p-4">Loading Services...</div>}>
          <ServicesPage />
        </Suspense>

        <Suspense fallback={<div className="text-center p-4">Loading Footer...</div>}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
