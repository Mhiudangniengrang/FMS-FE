import React from "react";
import { Helmet } from "react-helmet-async";
import { UserView } from "../section/User/view";

const UserPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FMS | User</title>
      </Helmet>
      <UserView />
    </>
  );
};

export default UserPage;
