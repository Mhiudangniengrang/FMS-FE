import React from "react";
import { Helmet } from "react-helmet-async";
import { AuthenView } from "@/section/Authen/view";

const AuthenPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FMS | Authentication</title>
      </Helmet>
      <AuthenView />
    </>
  );
};

export default AuthenPage;
