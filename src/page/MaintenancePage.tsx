import React from "react";
import { Helmet } from "react-helmet-async";
import { MaintenanceRequestForm } from "../section/Maintenance";

const MaintenancePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> FMS | Maintenance Request</title>
      </Helmet>
      <MaintenanceRequestForm />
    </>
  );
};

export default MaintenancePage; 