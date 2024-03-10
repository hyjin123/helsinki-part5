import { useState } from "react";

const Blog = ({ blog, user, handleLikeSubmit, handleDelete }) => {
  const [view, setView] = useState(false);

  const toggleVisibility = () => {
    setView(!view);
  };

  const hideWhenVisible = { display: view ? "none" : "" };
  const showWhenVisible = { display: view ? "" : "none" };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} - {blog.author}
        <button style={hideWhenVisible} onClick={toggleVisibility}>
          view
        </button>
        <button style={showWhenVisible} onClick={toggleVisibility}>
          hide
        </button>
        <div style={showWhenVisible}>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}
            <button onClick={handleLikeSubmit}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {/* only allow user to see the remove button if they are the creator of the blog */}
          {blog.user.id === user.id && (
            <div>
              <button onClick={handleDelete}>remove</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
