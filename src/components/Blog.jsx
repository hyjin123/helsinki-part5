import { useState } from "react";

const Blog = ({ blog }) => {
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
        {blog.title}
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
            <button>like</button>
          </div>
          <div>{blog.author}</div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
