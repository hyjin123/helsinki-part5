import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

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
      setErrorMessage("Wrong Credentials");
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

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    const result = await blogService.create({
      title,
      author,
      url,
    });

    // re-set the blog list, so it shows when new blog is added right away
    setBlogs([...blogs, result]);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  if (user === null) {
    return (
      <div>
        <div>{errorMessage}</div>
        <h2>Login to application to view blogs</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            password
            <input
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
        <div>
          <h2>Create a new blog</h2>
          <form onSubmit={handleBlogSubmit}>
            <div>
              Title
              <input
                type="text"
                value={title}
                name="Title"
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div>
              Author
              <input
                type="text"
                value={author}
                name="Author"
                onChange={(event) => setAuthor(event.target.value)}
              />
            </div>
            <div>
              URL
              <input
                type="text"
                value={url}
                name="url"
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
