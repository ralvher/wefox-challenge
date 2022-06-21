import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../ui/Loading";
import PostCard from "./components/PostCard";
import usePosts from "./context";
import { Post } from "./context/PostModel";

const PostDetail = () => {
  const params = useParams();
  const { isLoading, getById, edit, remove } = usePosts();
  const [editable, setEditable] = useState(false);

  const post = getById(params?.id || "");

  const handleEditPost = async (post: Post) => {
    setEditable(true);
  };

  const handleSavePost = async (post: Post) => {
    await edit(post);
    setEditable(false);
  };

  const handleRemovePost = async (post: Post) => {
    await remove(post);
    setEditable(false);
  };

  if (isLoading) return <Loading />;
  if (!post) return <div>Post not found</div>;

  return (
    <PostCard
      post={post}
      editable={editable}
      onRemove={handleRemovePost}
      onSave={handleSavePost}
      onEdit={handleEditPost}
      onCancel={() => setEditable(false)}
    />
  );
};

export default PostDetail;
