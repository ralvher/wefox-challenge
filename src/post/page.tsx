import React from "react";
import { Outlet } from "react-router-dom";

import { PostProvider } from "./context";

const Page = () => {
  return (
    <PostProvider>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Outlet />
      </div>
    </PostProvider>
  );
};

export default Page;
