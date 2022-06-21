import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import PostCard from "./components/PostCard";
import usePosts from "./context";
import { Post } from "./context/PostModel";

const PostsOverview = () => {
  const { isLoading, data: posts, remove, create } = usePosts();
  const [createPost, setCreatePost] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  const handleCreatePost = async (post: Post) => {
    await create(post);
    setCreatePost(false);
  };

  return (
    <>
      <h3>All posts</h3>

      <div style={{ marginBottom: 12 }}>
        {posts.length === 0 && <p>No posts yet... write one! </p>}
        <Button
          onClick={() => {
            setCreatePost(true);
          }}
        >
          Create Post
        </Button>
        {createPost && (
          <PostCard
            editable
            onSave={handleCreatePost}
            onCancel={() => setCreatePost(false)}
          />
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {posts.map((post) => {
          return (
            <PostCard
              key={post.id}
              post={post}
              onRemove={remove}
              onClick={(post: Post) =>
                navigate(`/post/${post.id}`, { replace: true })
              }
            />
          );
        })}
      </div>
    </>
  );
};

export default PostsOverview;
