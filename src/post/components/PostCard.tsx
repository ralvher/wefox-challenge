import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Post } from "../context/PostModel";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import TextArea from "../../ui/TextArea";

const FORM_INPUT_MARGIN = "8px 0";
interface PostCardProps {
  post?: Post;
  onSave?: (post: Post) => void;
  onRemove?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onClick?: (post: Post) => void;
  onCancel?: () => void;
  editable?: boolean;
}
type Inputs = {
  title: string;
  content: string;
  long: number;
  lat: number;
  imageUrl: string;
};

const PostCard = ({
  post,
  onSave,
  onRemove,
  onEdit,
  onClick,
  onCancel,
  editable,
}: PostCardProps) => {
  const { id, title, content, imageUrl, long, lat } = post || {};
  const { register, handleSubmit, watch } = useForm<Inputs>({
    defaultValues: {
      title,
      content,
      long: Number(long || 0),
      lat: Number(lat || 0),
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onSave?.({
      id: id || "",
      ...data,
    });
  };

  const image = watch("imageUrl");
  const Component = editable ? "form" : "div";

  return (
    <div
      data-testid="card"
      style={{ padding: 16, cursor: onClick && !editable ? "pointer" : "" }}
      onClick={() => post && !editable && onClick?.(post)}
    >
      <Component
        onSubmit={handleSubmit(onSubmit)}
        style={{
          maxWidth: "350px",
          minWidth: "100px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "1px -1px 20px 4px rgb(0 0 0 / 20%)",
        }}
      >
        <div
          style={{
            height: "225px",
            width: "100%",
            overflow: "hidden",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <img
            style={{
              objectFit: "cover",
              width: "100%",
              overflow: "hidden",
              borderRadius: "12px 12px 0 0",
            }}
            src={image || imageUrl || ""}
            alt={`${title}`}
          />
        </div>

        <div
          style={{
            padding: "16px 8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {editable ? (
            <Input
              type="text"
              style={{ margin: FORM_INPUT_MARGIN }}
              placeholder="Insert a title"
              defaultValue={title || ""}
              {...register("title", { required: true })}
            />
          ) : (
            <span style={{ fontWeight: "bold" }}>{title} </span>
          )}
          {editable ? (
            <TextArea
              style={{ margin: FORM_INPUT_MARGIN }}
              defaultValue={content || ""}
              placeholder="Insert a description"
              {...register("content", { required: true })}
            />
          ) : (
            <p>{content}</p>
          )}
          {editable ? (
            <Input
              type="text"
              style={{ margin: FORM_INPUT_MARGIN }}
              defaultValue={lat || ""}
              placeholder="Insert a latitude"
              {...register("lat")}
            />
          ) : (
            <span style={{ fontWeight: "bold" }}>{lat} </span>
          )}
          {editable ? (
            <Input
              type="text"
              style={{ margin: FORM_INPUT_MARGIN }}
              defaultValue={long || ""}
              placeholder="Insert a longitud"
              {...register("long")}
            />
          ) : (
            <span style={{ fontWeight: "bold" }}>{long} </span>
          )}

          {editable && (
            <Input
              type="text"
              style={{ margin: FORM_INPUT_MARGIN }}
              placeholder="Insert una url de una imagen"
              defaultValue={imageUrl || ""}
              {...register("imageUrl")}
            />
          )}

          <div style={{ textAlign: "end" }}>
            {editable && onCancel && (
              <Button type="button" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {post && !editable && onRemove && (
              <Button
                type="button"
                onClick={() => {
                  onRemove(post);
                }}
              >
                Remove
              </Button>
            )}
            {post && !editable && onEdit && (
              <Button
                type="button"
                onClick={() => {
                  onEdit(post);
                }}
              >
                Edit
              </Button>
            )}
            {editable && <Button type="submit">Save</Button>}
          </div>
        </div>
      </Component>
    </div>
  );
};

export default PostCard;
