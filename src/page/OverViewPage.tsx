import React from "react";
import { Helmet } from "react-helmet-async";
import { OverViews } from "../section/Overview/view";

const OverViewPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> FMS | Overview</title>
      </Helmet>
      <OverViews />
    </>
  );
};

export default OverViewPage;
