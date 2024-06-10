import React from "react";

const Post: React.FC<{ title: string; body: string }> = React.memo(
  ({ title, body }) => {
    return (
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    );
  }
);

export default Post;
