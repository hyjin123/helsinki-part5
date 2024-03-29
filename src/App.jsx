import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  // fetches blog list again once like is modified
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      // make the user data persist even if page is refreshed
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));

      // set the token, so it can be used when submitting a new blog (making a post request)
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage(exception.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    // wipe out the entire local storage
    window.localStorage.clear();
    // set the user state to empty
    setUser(null);
  };

  const handleBlogSubmit = async (title, author, url) => {
    try {
      const result = await blogService.create({
        title,
        author,
        url,
      });

      // hide the form when new blog is created
      blogFormRef.current.toggleVisibility();

      // re-set the blog list, so it shows when new blog is added right away
      setBlogs([...blogs, result]);
      setErrorMessage(`New Blog: ${title} has been added!`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("Cannot add the blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLikeSubmit = async (blog) => {
    try {
      const result = await blogService.like(blog);

      const updatedBlogList = blogs.map((element) => {
        if (element.id === blog.id) {
          result.user = blog.user;
          return result;
        } else {
          return element;
        }
      });

      // re-set the blog list with the new updated information
      setBlogs(updatedBlogList);
      setErrorMessage("You liked a blog!");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("Cannot update the blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const compare = (a, b) => {
    return b.likes - a.likes;
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        const result = await blogService.remove(blog.id);

        const updatedBlogList = blogs.filter(
          (element) => element.id !== result.id
        );

        // re-set the blog list with the new updated information
        setBlogs(updatedBlogList);

        setErrorMessage(
          `Blog: ${result.title} by ${result.author} has been deleted!`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      } catch (exception) {
        setErrorMessage("Cannot delete the blog");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    }
  };

  // 7f8, 15
  if (user === null) {
    return (
      <div>
        <h2>Login to application to view blogs</h2>
        <div>{errorMessage}</div>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>blogs</h2>
        <h3>logged in as {user.name}</h3>
        <button onClick={handleLogout}>logout</button>
        <div>{errorMessage}</div>
        <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
          <BlogForm createBlog={handleBlogSubmit} />
        </Togglable>
        <div>
          {blogs.sort(compare).map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              handleLikeSubmit={() => handleLikeSubmit(blog)}
              handleDelete={() => handleDelete(blog)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
