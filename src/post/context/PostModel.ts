import { useState, useEffect } from "react";

import * as postClient from "../client";

export interface Post {
  id: string;
  title: string;
  content: string;
  lat: number | null;
  long: number | null;
  imageUrl: string | null;
}

export interface UsePost {
  isLoading: boolean;
  error: string | null;
  data: Post[];
  getById: (id: string) => Post | undefined;
  create: (post: Post) => Promise<void>;
  remove: (post: Post) => Promise<void>;
  edit: (post: Post) => Promise<void>;
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

  const getById = (id: string) => data.find((item) => item.id === id);

  return {
    isLoading,
    data,
    error,
    getById,
    create: async (post: Post) => {
      const postToCreate = {
        id: new Date().getTime().toString(),
        title: post.title,
        content: post.content,
        long: post.long ?? null,
        lat: post.lat ?? null,
        imageUrl: post.imageUrl ?? null,
      };
      setIsLoading(true);
      setData((prevData) => prevData.concat(postToCreate));

      const { data, error } = await postClient.createPost({
        ...postToCreate,
        image: postToCreate.imageUrl,
      });

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
    remove: async (post: Post) => {
      setIsLoading(true);
      setData((prevData) => prevData.filter(({ id }) => id !== post.id));

      const { error } = await postClient.removePostById(`${post.id}`);

      if (error) {
        setData((prevData) => prevData.concat(post));
        setError(error.message);
      }
      setIsLoading(false);
    },

    edit: async (post: Post) => {
      const currentEditablePost = getById(post.id);
      if (!currentEditablePost) return;

      setIsLoading(true);

      setData((prevData) =>
        prevData.map((current) => (current.id === post.id ? post : current))
      );

      const postToEdit = {
        ...post,
        image: post.imageUrl ?? null,
      };

      const { error } = await postClient.updatePost(postToEdit);

      if (error) {
        setData((prevData) =>
          prevData.map((current) =>
            current.id === post.id ? currentEditablePost : current
          )
        );
        setError(error.message);
      }
      setIsLoading(false);
    },
  };
};

export const mapper = (post: postClient.PostData): Post => {
  return {
    id: String(post.id),
    title: post.title,
    content: post.content,
    long: post.long,
    lat: post.lat,
    imageUrl: post.image,
  };
};

export default usePost;
