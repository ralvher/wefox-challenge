import { render, screen } from "@testing-library/react";
import { PostDetails } from ".";
import { PostProvider } from "./context";
import { PATH } from "./client";
import { axiosMock } from "../tests/config";
import { postMock } from "./client/__fixtures__";
import userEvent from "@testing-library/user-event";

const PATH_WITH_ID = `${PATH}/${postMock.id}`;

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

const PostDetailWrapper = () => (
  <PostProvider>
    <PostDetails />
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

  it("should show not found", async () => {
    axiosMock.onGet(PATH).reply(200, []);
    render(<PostDetailWrapper />);

    const notFound = await screen.findByText(/Post not found/);
    expect(notFound).toBeInTheDocument();
  });

  it("should allow to cancel the edition the post", async () => {
    axiosMock.onGet(PATH).reply(200, [postMock]);
    axiosMock.onPut(PATH_WITH_ID).reply(200, {});

    render(<PostDetailWrapper />);

    const card = await screen.findByTestId("card");
    expect(card).toBeInTheDocument();

    const editButton = screen.getByText("Edit");
    userEvent.click(editButton);

    const titleInput = screen.getByPlaceholderText("Insert a title");
    const newTitle = "My new title";
    userEvent.clear(titleInput);
    userEvent.type(titleInput, newTitle);

    const saveButton = screen.getByText("Cancel");
    userEvent.click(saveButton);

    const titleContent = await screen.findByText(postMock.title);
    expect(titleContent).toBeInTheDocument();
  });

  it("should allow to edit the post", async () => {
    axiosMock.onGet(PATH).reply(200, [postMock]);
    axiosMock.onPut(PATH_WITH_ID).reply(200, {});

    render(<PostDetailWrapper />);

    const card = await screen.findByTestId("card");
    expect(card).toBeInTheDocument();

    const editButton = screen.getByText("Edit");
    userEvent.click(editButton);

    const titleInput = screen.getByPlaceholderText("Insert a title");
    const newTitle = "My new title";
    userEvent.clear(titleInput);
    userEvent.type(titleInput, newTitle);

    const saveButton = screen.getByText("Save");
    userEvent.click(saveButton);

    const titleContent = await screen.findByText("My new title");
    expect(titleContent).toBeInTheDocument();
  });

  it("should allow to remove the post", async () => {
    axiosMock.onGet(PATH).reply(200, [postMock]);
    axiosMock.onDelete(PATH_WITH_ID).reply(200, {});

    render(<PostDetailWrapper />);

    const card = await screen.findByTestId("card");
    expect(card).toBeInTheDocument();

    const removeButton = screen.getByText("Remove");
    userEvent.click(removeButton);

    const titleContent = screen.queryByText(postMock.title);
    expect(titleContent).not.toBeInTheDocument();
  });
});
