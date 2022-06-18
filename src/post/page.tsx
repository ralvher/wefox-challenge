import React from "react";
import { Outlet } from "react-router-dom";

const Page = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Outlet />
    </div>
  );
};

export default Page;
