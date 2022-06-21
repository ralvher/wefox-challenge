import React, { createContext, useContext } from "react";

import postModel, { Post, UsePost } from "./PostModel";

interface PostProviderProps {
  children: React.ReactNode;
  initialState?: Post[];
}
const PostContext = createContext<UsePost | null>(null);

export function PostProvider({ children, initialState }: PostProviderProps) {
  const value = postModel({ initialState });
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePosts() {
  const value = useContext(PostContext);
  if (!value) {
    throw new Error("missing a PostProvider");
  }
  return value;
}

export default usePosts;
