import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostCard from "./PostCard";

describe("PostCard", () => {
  it("should allow to create a post", async () => {
    const spyOnSave = jest.fn();
    render(<PostCard onSave={spyOnSave} editable />);

    const title = screen.getByPlaceholderText("Insert a title");
    userEvent.type(title, "Title");
    const content = screen.getByPlaceholderText("Insert a description");
    userEvent.type(content, "Content");

    const save = screen.getByText("Save");
    userEvent.click(save);
    await waitFor(() => {
      expect(spyOnSave).toHaveBeenCalledTimes(1);
    });

    expect(spyOnSave).toHaveBeenCalledWith({
      content: "Content",
      id: "",
      imageUrl: "",
      lat: 0,
      long: 0,
      title: "Title",
    });
  });

  it("should allow to update a post", async () => {
    const spyOnSave = jest.fn();
    const post = {
      id: "1",
      title: "title",
      content: "content",
      imageUrl: null,
      lat: null,
      long: null,
    };
    render(<PostCard onSave={spyOnSave} post={post} editable />);

    const title = screen.getByPlaceholderText("Insert a title");
    userEvent.clear(title);
    userEvent.type(title, "Title");
    const content = screen.getByPlaceholderText("Insert a description");
    userEvent.clear(content);
    userEvent.type(content, "Content");

    const save = screen.getByText("Save");
    userEvent.click(save);

    await waitFor(() => {
      expect(spyOnSave).toHaveBeenCalledTimes(1);
    });
    expect(spyOnSave).toHaveBeenCalledWith({
      content: "Content",
      id: "1",
      imageUrl: "",
      lat: 0,
      long: 0,
      title: "Title",
    });
  });

  it("should allow to remove a post", async () => {
    const spyOnRemove = jest.fn();
    const post = {
      id: "1",
      title: "title",
      content: "content",
      imageUrl: null,
      lat: null,
      long: null,
    };
    render(<PostCard onRemove={spyOnRemove} post={post} />);

    const save = screen.getByText("Remove");
    userEvent.click(save);

    expect(spyOnRemove).toHaveBeenCalledWith(post);
  });

  it("should allow to edit a post", async () => {
    const spyOnEdit = jest.fn();
    const post = {
      id: "1",
      title: "title",
      content: "content",
      imageUrl: null,
      lat: null,
      long: null,
    };
    render(<PostCard onEdit={spyOnEdit} post={post} />);

    const save = screen.getByText("Edit");
    userEvent.click(save);

    expect(spyOnEdit).toHaveBeenCalledWith(post);
  });

  it("should allow to cancel edition", async () => {
    const spyOnCancel = jest.fn();

    render(<PostCard onCancel={spyOnCancel} editable />);

    const save = screen.getByText("Cancel");
    userEvent.click(save);

    expect(spyOnCancel).toHaveBeenCalled();
  });

  it("should allow to click in the car", async () => {
    const spyOnClick = jest.fn();
    const post = {
      id: "1",
      title: "title",
      content: "content",
      imageUrl: null,
      lat: null,
      long: null,
    };
    render(<PostCard post={post} onClick={spyOnClick} />);

    const card = screen.getByTestId("card");
    userEvent.click(card);

    expect(spyOnClick).toHaveBeenCalled();
  });
});
