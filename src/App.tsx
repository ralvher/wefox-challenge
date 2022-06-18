import * as React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { Page as PostPage, AllPosts, PostDetail } from "./post";

const App = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Navigate to="/post" replace />,
    },
    {
      path: "post",
      element: <PostPage />,
      children: [
        { path: "", element: <Navigate to="all" replace /> },
        {
          path: "all",
          element: <AllPosts />,
        },
        { path: ":id", element: <PostDetail /> },
      ],
    },
  ]);
  return element;
};

export default App;
