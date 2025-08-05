import DepartmentView from "@/section/Department/view/DepartmentView";
import React from "react";
import { Helmet } from "react-helmet-async";

const DepartmentPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FMS | Departments</title>
      </Helmet>
      <DepartmentView />
    </>
  );
};

export default DepartmentPage;
