import React from "react";
import { Helmet } from "react-helmet-async";
import { TechnicianMaintenanceManagement } from "../section/Maintenance";

const TechnicianMaintenancePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> FMS | Maintenance Tasks</title>
      </Helmet>
      <TechnicianMaintenanceManagement />
    </>
  );
};

export default TechnicianMaintenancePage;
