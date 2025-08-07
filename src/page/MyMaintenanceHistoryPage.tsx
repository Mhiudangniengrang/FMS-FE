import React from "react";
import { Helmet } from "react-helmet-async";
import { MyMaintenanceHistory } from "../section/Maintenance";

const MyMaintenanceHistoryPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> FMS | My Maintenance History</title>
      </Helmet>
      <MyMaintenanceHistory />
    </>
  );
};

export default MyMaintenanceHistoryPage;