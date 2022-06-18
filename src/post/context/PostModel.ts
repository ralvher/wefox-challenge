import { useState, useEffect } from "react";

import * as postClient from "../client";

export interface Post {
  id?: string;
  title: string;
  content: string;
  lat?: number | null;
  long?: number | null;
  imageUrl?: string | null;
}

export interface UsePost {
  isLoading: boolean;
  error: string | null;
  data: Post[];
  getById: (id: string) => Post | undefined;
  create: (post: Post) => Promise<void>;
}

interface UsePostProps {
  initialState?: Post[];
}

const usePost = ({ initialState = [] }: UsePostProps): UsePost => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      const { data: posts, error } = await postClient.getAllPosts();
      if (error) {
        setError(error.message);
      }
      if (posts?.length) {
        setData(posts.map(mapper));
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, []);

  return {
    isLoading,
    data,
    error,
    getById: (id: string) => data.find((item) => item.id === id),
    create: async (post: Post) => {
      const postToCreate = {
        id: new Date().getTime().toString(),
        title: post.title,
        content: post.content,
        long: post.long ?? null,
        lat: post.lat ?? null,
        image: post.imageUrl ?? null,
      };
      setIsLoading(true);
      setData((prevData) => prevData.concat(postToCreate));

      const { data, error } = await postClient.createPost(postToCreate);

      if (data) {
        setData((prevData) =>
          prevData.map((post) => {
            if (post.id === postToCreate.id) return { ...post, id: data.id };
            return post;
          })
        );
      }
      if (error) {
        setData((prevData) =>
          prevData.filter((post) => {
            return post.id !== postToCreate.id;
          })
        );
        setError(error.message);
      }
      setIsLoading(false);
    },
  };
};

export const mapper = (post: postClient.PostData): Post => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    long: post.long,
    lat: post.lat,
    imageUrl: post.image,
  };
};

export default usePost;