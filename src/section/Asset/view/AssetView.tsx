import React from "react";
import Asset from "../Asset";
import { Container } from "@mui/material";

const AssetView: React.FC = () => {
  return (
    <Container>
      <h1>Asset Management</h1>
      <p>Manage your assets here.</p>
      <Asset />
    </Container>
  );
};

export default AssetView;
