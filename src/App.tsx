import * as React from "react";
import { Navigate, useRoutes } from "react-router-dom";

import { PostLayout, PostDetails, PostsOverview } from "./post";

const App = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Navigate to="/post" replace />,
    },
    {
      path: "post",
      element: <PostLayout />,
      children: [
        { path: "", element: <Navigate to="all" replace /> },
        {
          path: "all",
          element: <PostsOverview />,
        },
        { path: ":id", element: <PostDetails /> },
      ],
    },
  ]);
  return element;
};

export default App;
