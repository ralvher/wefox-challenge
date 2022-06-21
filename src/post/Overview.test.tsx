import { render, screen } from "@testing-library/react";
import { PostsOverview } from ".";
import { PostProvider } from "./context";
import { PATH } from "./client";
import { axiosMock } from "../tests/config";
import { postMock } from "./client/__fixtures__";
import userEvent from "@testing-library/user-event";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

const PostDetailWrapper = () => (
  <PostProvider>
    <PostsOverview />
  </PostProvider>
);

describe("Details", () => {
  afterEach(() => {
    axiosMock.reset();
  });

  it("should show loading", () => {
    render(<PostDetailWrapper />);
    const loading = screen.getByText(/Loading/);
    expect(loading).toBeInTheDocument();
  });

  it("should show warning about not posts", async () => {
    axiosMock.onGet(PATH).reply(200, []);
    render(<PostDetailWrapper />);

    const notFound = await screen.findByText(/No posts yet... write one!/);
    expect(notFound).toBeInTheDocument();
  });

  it("should allow to  create of a post", async () => {
    axiosMock.onGet(PATH).reply(200, []);
    axiosMock.onPost(PATH).reply(200, postMock);
    render(<PostDetailWrapper />);

    const createButton = await screen.findByText("Create Post");
    userEvent.click(createButton);

    const titleInput = screen.getByPlaceholderText("Insert a title");
    userEvent.clear(titleInput);
    userEvent.type(titleInput, postMock.title);

    const contentInput = screen.getByPlaceholderText("Insert a description");
    userEvent.clear(contentInput);
    userEvent.type(contentInput, postMock.content);

    const saveButton = screen.getByText("Save");
    userEvent.click(saveButton);

    const titleContent = await screen.findByText(postMock.title);
    expect(titleContent).toBeInTheDocument();
  });

  it("should allow to cancel creation of a post", async () => {
    axiosMock.onGet(PATH).reply(200, []);
    render(<PostDetailWrapper />);

    const createButton = await screen.findByText("Create Post");
    userEvent.click(createButton);

    const cancelButton = screen.getByText("Cancel");
    userEvent.click(cancelButton);

    const saveButton = screen.queryByText("Save");
    expect(saveButton).not.toBeInTheDocument();
  });

  it("should allow navigate to post", async () => {
    axiosMock.onGet(PATH).reply(200, [postMock]);
    render(<PostDetailWrapper />);

    const card = await screen.findByTestId("card");
    userEvent.click(card);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/post/${postMock.id}`, {
      replace: true,
    });
  });
});
