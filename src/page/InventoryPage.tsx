import InventoryView from "@/section/Inventory/view/InventoryView";
import React from "react";
import { Helmet } from "react-helmet-async";

const InventoryPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FMS | Inventory</title>
      </Helmet>
      <InventoryView />
    </>
  );
};

export default InventoryPage;
