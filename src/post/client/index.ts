import api from "../../config/client";

export const PATH = "/api/v1/posts";

interface Post {
  title: string | null;
  content: string | null;
  lat: number | null;
  long: number | null;
  image: string | null;
}

export const getAllPosts = () => {};

export const getPostById = (id: string) => {};

export const updatePost = (post: Post) => {};

export const removePostById = (id: string) => {};

export const createPost = (post: Post) => {};

export const PostResponseMapper = (post: any): Post => {
  return {
    title: post.title,
    content: post.content,
    lat: post.lat ? Number(post.lat) : null,
    long: post.long ? Number(post.long) : null,
    image: post.image_url,
  };
};
