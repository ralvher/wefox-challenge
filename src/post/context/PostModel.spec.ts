import { renderHook, act } from "@testing-library/react-hooks";

import * as postClient from "../client";
import usePostModel, { Post } from "./PostModel";
import { postMock } from "./__fixtures__";

jest.mock("../client");
const allPostMocked = [postMock];

describe("PostModel", () => {
  it("should retrieve all posts", async () => {
    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });
    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    const { data } = result.current;
    expect(data.length).toEqual(1);
    expect(data).toEqual([
      {
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        id: "4d564f82-a48a-4ead-b864-958b8fca8f50",
        imageUrl:
          "https://c2.staticflickr.com/2/1269/4670777817_d657cd9819_b.jpg",
        lat: 40.41678,
        long: -3.70379,
        title: "Madrid",
      },
    ]);
  });

  it("should allow to create a new post", async () => {
    const postToCreate: Post = {
      title: "title",
      content: "content",
    };

    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest
      .spyOn(postClient, "createPost")
      .mockResolvedValueOnce({ data: { id: "my-id", ...postToCreate } });

    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    await act(async () => {
      await result.current.create(postToCreate);
    });

    const { data, getById } = result.current;

    expect(data.length).toEqual(2);
    expect(getById("my-id")).toEqual({
      content: "content",
      id: "my-id",
      image: null,
      lat: null,
      long: null,
      title: "title",
    });
  });

  it("should not create a post when fail", async () => {
    const postToCreate: Post = {
      title: "title",
      content: "content",
    };

    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest
      .spyOn(postClient, "createPost")
      .mockResolvedValueOnce({
        error: { message: "an error happened", status: "500" },
      });

    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    await act(async () => {
      await result.current.create(postToCreate);
    });

    const { data, getById, error} = result.current;

    expect(data.length).toEqual(1);
    expect(getById("my-id")).toBeUndefined();
    expect(error).not.toBeNull();
  });
});
