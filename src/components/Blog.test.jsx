import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;

  const blog = {
    title: "Testing",
    author: "Nancy Tran",
    url: "www.google.ca",
    likes: 2,
    user: { name: "Nancy Tran", username: "Best", id: "123" },
  };

  const user = { name: "Nancy Tran", username: "Best", id: "123" };

  const mockHandler = vi.fn();

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={user} handleLikeSubmit={mockHandler} />
    ).container;
  });

  test("renders content", () => {
    // test to show that title and author is shown
    const element = screen.getByText("Testing - Nancy Tran");
    expect(element).toBeVisible();

    // test to check that url is not shown
    const url = screen.getByText("www.google.ca");
    expect(url).not.toBeVisible();

    // test to check that likes is not shown
    const likes = screen.getByText("likes: 2");
    expect(likes).not.toBeVisible();

    // make sure the div that contains the url and likes doesn't show
    const div = container.querySelector(".blog");
    expect(div).toHaveStyle("display: none");
  });

  test("shows url and likes when view button is pressed", async () => {
    const dummyUser = userEvent.setup();
    const button = screen.getByText("view");

    await dummyUser.click(button);

    // test to check that url is shown
    const url = screen.getByText("www.google.ca");
    expect(url).toBeVisible();

    // test to check that likes is shown
    const likes = screen.getByText("likes: 2");
    expect(likes).toBeVisible();

    // make sure the div that contains the url and likes shows
    const div = container.querySelector(".blog");
    expect(div).toHaveStyle("display: block");
  });

  test("when a like button is clicked twice, event handler is called twice", async () => {
    // view button is pressed once first
    const dummyUser = userEvent.setup();
    const viewButton = screen.getByText("view");

    await dummyUser.click(viewButton);

    // like button is pressed twice
    const likeButton = screen.getByText("like");

    await dummyUser.click(likeButton);
    await dummyUser.click(likeButton);

    // test to see if the mock handler is called twice
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
