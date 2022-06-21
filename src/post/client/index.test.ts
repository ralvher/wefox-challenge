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
    const { data, error } = await getAllPosts();
    const expectedValue = [PostResponseMapper(postMock)];
    expect(data).toEqual(expectedValue);
    expect(error).toBeUndefined();
  });

  it("should return empty array when fail", async () => {
    axiosMock.onGet(PATH).reply(404);
    const { data, error } = await getAllPosts();
    expect(data).toEqual([]);
    expect(error).toBeDefined();
  });
});

describe("getPostById", () => {
  afterEach(() => {
    axiosMock.reset();
  });
  it("should return the post given an id", async () => {
    axiosMock.onGet(PATH_WITH_ID).reply(200, postMock);
    const { data, error } = await getPostById(postMock.id);
    const expectedValue = PostResponseMapper(postMock);
    expect(data).toEqual(expectedValue);
    expect(error).toBeUndefined();
  });

  it("should return null when fail", async () => {
    axiosMock.onGet(PATH_WITH_ID).reply(404);
    const { data, error } = await getPostById(postMock.id);
    expect(data).toBeUndefined();
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

    const { data, error } = await updatePost(updatedPost);

    expect(data).toBeTruthy();
    expect(error).toBeUndefined();
  });

  it("should return an error when update fails", async () => {
    axiosMock.onPut(PATH_WITH_ID).reply(404);
    const { data, error } = await updatePost(updatedPost);

    expect(data).toBeUndefined();
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
    axiosMock.onPost(PATH).reply(200, postMock);
    const { data, error } = await createPost(newPost);

    const { id, ...newPostBody } = postMock;
    expect(axiosMock.history.post[0].data).toEqual(JSON.stringify(newPostBody));
    expect(data).toEqual(newPost);
    expect(error).toBeUndefined();
  });

  it("should return an error when fail", async () => {
    axiosMock.onPost(PATH).reply(404);
    const { data, error } = await createPost(newPost);

    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });
});
