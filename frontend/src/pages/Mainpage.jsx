import React, { useState } from "react";
import ServiceCategories from "../components/ServiceCategories";
import WorkersPage from "./Workerspage";

const MainPage = () => {
  const [selectedProfession, setSelectedProfession] = useState("All");

  return (
    <>
      <ServiceCategories onSelectProfession={setSelectedProfession} />
      <Otherservices onSelectProfession={setSelectedProfession} />
      <WorkersPage selectedProfession={selectedProfession} />
    </>
  );
};

export default MainPage;
