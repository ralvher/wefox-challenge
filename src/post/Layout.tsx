import React from "react";
import { Outlet } from "react-router-dom";

import { PostProvider } from "./context";

const PostLayout = () => {
  return (
    <PostProvider>
      <div style={{ display: "flex", flexDirection: "column", padding: 24, }}>
        <Outlet />
      </div>
    </PostProvider>
  );
};

export default PostLayout;
