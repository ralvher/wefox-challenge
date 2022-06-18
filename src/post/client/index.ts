import { AxiosError } from "axios";
import api from "../../config/client";

export const PATH = "/api/v1/posts";

interface PostErrorResponse {
  message: string;
  status: string | null;
}
interface Post {
  id: string;
  title: string;
  content: string;
  lat: number | null;
  long: number | null;
  image: string | null;
}

interface PostReponse<T> {
  error?: PostErrorResponse;
  data?: T;
}

export const getAllPosts = async (): Promise<PostReponse<Post[]>> => {
  try {
    const { data = [] } = await api.get(PATH);
    return {
      data: data.map(PostResponseMapper) as Post[],
    };
  } catch (error) {
    return { data: [], ...mapError(error as AxiosError) };
  }
};

export const getPostById = async (id: string): Promise<PostReponse<Post>> => {
  try {
    const { data } = await api.get(`${PATH}/${id}`);
    return {
      data: PostResponseMapper(data),
    };
  } catch (error) {
    return mapError(error as AxiosError);
  }
};

export const updatePost = async (post: Post): Promise<PostReponse<Post>> => {
  try {
    const { data } = await api.put(`${PATH}/${post.id}`);
    return {
      data: PostResponseMapper(data),
    };
  } catch (error) {
    return mapError(error as AxiosError);
  }
};

export const removePostById = async (
  id: string
): Promise<PostReponse<boolean>> => {
  try {
    await api.delete(`${PATH}/${id}`);
    return {
      data: true,
    };
  } catch (error) {
    return mapError(error as AxiosError);
  }
};

export const createPost = async ({
  title,
  content,
  lat,
  long,
  image,
}: Post): Promise<PostReponse<Post>> => {
  try {
    const { data } = await api.post(PATH, {
      title,
      content,
      lat: String(lat),
      long: String(long),
      image_url: image,
    });
    return { data: PostResponseMapper(data) };
  } catch (error) {
    return mapError(error as AxiosError);
  }
};

const mapError = (error: AxiosError) => {
  return {
    error: {
      message: error.message,
      status: error.status,
    } as PostErrorResponse,
  };
};
export const PostResponseMapper = (post: any): Post => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    lat: post.lat ? Number(post.lat) : null,
    long: post.long ? Number(post.long) : null,
    image: post.image_url,
  };
};
