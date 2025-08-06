import React from "react";
import { Helmet } from "react-helmet-async";
import { MyMaintenanceHistory } from "../section/Maintenance";

const MyMaintenanceHistoryPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FMS | Lịch Sử Yêu Cầu Bảo Trì</title>
      </Helmet>
      <MyMaintenanceHistory />
    </>
  );
};

export default MyMaintenanceHistoryPage;