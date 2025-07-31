import React from "react";
import { Helmet } from "react-helmet-async";
import AssetManagement from "../section/Asset/Asset";


const AssetPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FMS | Asset Management</title>
      </Helmet>
      <AssetManagement />
    </>
  );
};

export default AssetPage;
