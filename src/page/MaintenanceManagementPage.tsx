import React from "react";
import { Helmet } from "react-helmet-async";
import { MaintenanceManagement } from "../section/Maintenance";

const MaintenanceManagementPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> FMS | Maintenance Management</title>
      </Helmet>
      <MaintenanceManagement />
    </>
  );
};

export default MaintenanceManagementPage; 