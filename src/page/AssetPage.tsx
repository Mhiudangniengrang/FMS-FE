import React from "react";
import { Helmet } from "react-helmet-async";
import { AssetView } from "../section/Asset/view";

const AssetPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FMS | Asset Management</title>
      </Helmet>
      <AssetView />
    </>
  );
};

export default AssetPage;
