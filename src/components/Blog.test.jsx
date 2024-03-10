import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Testing",
    author: "Nancy Tran",
    url: "www.google.ca",
    likes: 2,
    user: { name: "Nancy Tran", username: "Best", id: "123" },
  };

  const user = { name: "Nancy Tran", username: "Best", id: "123" };

  render(<Blog blog={blog} user={user} />);

  // test to show that title and author is shown
  const element = screen.getByText("Testing - Nancy Tran");
  expect(element).toBeDefined();

  // test to check that url is not shown
  const url = screen.getByText("www.google.ca");
  expect(url).not.toBeVisible();

  // test to check that likes is not shown
  const likes = screen.getByText("likes: 2");
  expect(likes).not.toBeVisible();
});
