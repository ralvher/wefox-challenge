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
        id: "1",
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
      id: "",
      title: "title",
      content: "content",
      long: null,
      lat: null,
      imageUrl: null,
    };

    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest.spyOn(postClient, "createPost").mockResolvedValueOnce({
      data: { ...postToCreate, id: "my-id", image: "", lat: null, long: null },
    });

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
      imageUrl: null,
      lat: null,
      long: null,
      title: "title",
    });
  });

  it("should not create a post when fail", async () => {
    const postToCreate: Post = {
      id: "",
      title: "title",
      content: "content",
      long: null,
      imageUrl: null,
      lat: null,
    };

    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest.spyOn(postClient, "createPost").mockResolvedValueOnce({
      error: { message: "an error happened", status: "500" },
    });

    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    await act(async () => {
      await result.current.create(postToCreate);
    });

    const { data, getById, error } = result.current;

    expect(data.length).toEqual(1);
    expect(getById("my-id")).toBeUndefined();
    expect(error).not.toBeNull();
  });

  it("should allow to remove a post", async () => {
    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest
      .spyOn(postClient, "removePostById")
      .mockResolvedValueOnce({ data: true });

    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    const postToDelete = result.current.getById(postMock.id);

    await act(async () => {
      if (postToDelete) {
        await result.current.remove(postToDelete);
      }
    });

    const { data, getById } = result.current;

    expect(data.length).toEqual(0);
    expect(getById(postMock.id)).toBeUndefined();
  });

  it("should not remove a post when fail", async () => {
    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest
      .spyOn(postClient, "removePostById")
      .mockResolvedValueOnce({ error: { message: "error", status: "500" } });

    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    const postToDelete = result.current.getById(postMock.id);

    await act(async () => {
      if (postToDelete) {
        await result.current.remove(postToDelete);
      }
    });

    const { data, getById } = result.current;

    expect(data.length).toEqual(1);
    expect(getById(postMock.id)).toBeDefined();
  });

  it("should allow to edit a  post", async () => {
    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest.spyOn(postClient, "updatePost").mockResolvedValueOnce({ data: true });

    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    expect(result.current.getById(postMock.id)?.content).toEqual(
      postMock.content
    );

    const postToEdit = result.current.getById(postMock.id);

    await act(async () => {
      if (postToEdit) {
        await result.current.edit({ ...postToEdit, content: "my new content" });
      }
    });

    expect(result.current.data.length).toEqual(1);
    expect(result.current.getById(postMock.id)?.content).toEqual(
      "my new content"
    );
  });

  it("should not allow to edit a post when fail", async () => {
    jest
      .spyOn(postClient, "getAllPosts")
      .mockResolvedValueOnce({ data: allPostMocked });

    jest
      .spyOn(postClient, "updatePost")
      .mockResolvedValueOnce({ error: { message: "an error", status: "500" } });

    const { result, waitForNextUpdate } = renderHook(() => usePostModel({}));

    await waitForNextUpdate();

    expect(result.current.getById(postMock.id)?.content).toEqual(
      postMock.content
    );

    const postToEdit = result.current.getById(postMock.id);

    await act(async () => {
      if (postToEdit) {
        await result.current.edit({ ...postToEdit, content: "my new content" });
      }
    });

    expect(result.current.data.length).toEqual(1);
    expect(result.current.getById(postMock.id)?.content).toEqual(
      postMock.content
    );
  });
});
