import { axiosMock } from "../../tests/config";
import {
  createPost,
  getAllPosts,
  getPostById,
  PATH,
  PostResponseMapper,
  removePostById,
  updatePost,
} from ".";
import { postMock } from "./__fixtures__";

const PATH_WITH_ID = `${PATH}/${postMock.id}`;

describe("getAllPosts", () => {
  afterEach(() => {
    axiosMock.reset();
  });

  it("should return all posts", async () => {
    axiosMock.onGet(PATH).reply(200, [postMock]);
    const { value, error } = await getAllPosts();
    const expectedValue = [PostResponseMapper(postMock)];
    expect(value).toBe(expectedValue);
    expect(error).toBeUndefined();
  });

  it("should return empty array when fail", async () => {
    axiosMock.onGet(PATH).reply(404);
    const { value, error } = await getAllPosts();
    expect(value).toBe([]);
    expect(error).toBeDefined();
  });
});

describe("getPostById", () => {
  afterEach(() => {
    axiosMock.reset();
  });
  it("should return the post given an id", async () => {
    axiosMock.onGet(PATH_WITH_ID).reply(200, postMock);
    const { value, error } = await getPostById(postMock.id);
    const expectedValue = PostResponseMapper(postMock);
    expect(value).toBe(expectedValue);
    expect(error).toBeUndefined();
  });

  it("should return null when fail", async () => {
    axiosMock.onGet(PATH_WITH_ID).reply(404);
    const { value, error } = await getPostById(postMock.id);
    expect(value).toBeUndefined();
    expect(error).toBeDefined();
  });
});

describe("updatePostById", () => {
  afterEach(() => {
    axiosMock.reset();
  });
  const updatedContent = "updated content";
  const updatedPost = {
    ...PostResponseMapper(postMock),
    content: "updated content",
  };

  it("should udpate the post given an id", async () => {
    axiosMock
      .onPut(PATH_WITH_ID)
      .reply(200, { ...postMock, content: updatedContent });

    const { value, error } = await updatePost(updatedPost);

    expect(value).toBe(updatedPost);
    expect(error).toBeUndefined();
  });

  it("should return an error when update fails", async () => {
    axiosMock.onPut(PATH_WITH_ID).reply(404);
    const { value, error } = await updatePost(updatedPost);

    expect(value).toBeUndefined();
    expect(error).toBeDefined();
  });
});

describe("removePostById", () => {
  afterEach(() => {
    axiosMock.reset();
  });
  it("should remove the post given an id", async () => {
    axiosMock.onDelete(PATH_WITH_ID).reply(200);
    const { error } = await removePostById(postMock.id);
    expect(error).toBeUndefined();
  });

  it("should return an error when fail", async () => {
    axiosMock.onDelete(PATH_WITH_ID).reply(401);
    const { error } = await removePostById(postMock.id);
    expect(error).toBeDefined();
  });
});

describe("createPost", () => {
  const newPost = PostResponseMapper(postMock);
  it("should create a post", async () => {
    axiosMock.onPost(PATH_WITH_ID, postMock).reply(200, postMock);
    const { value, error } = await createPost(newPost);

    expect(value).toBe(newPost);
    expect(error).toBeUndefined();
  });

  it("should return an error when fail", async () => {
    axiosMock.onPost(PATH_WITH_ID, postMock).reply(404);
    const { value, error } = await createPost(newPost);

    expect(value).toBeUndefined();
    expect(error).toBeDefined();
  });
});
