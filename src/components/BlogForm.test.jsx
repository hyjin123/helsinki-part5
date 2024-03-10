import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("Blog form calls the event handler with the right details", async () => {
  const mockHandler = vi.fn();

  const { container } = render(<BlogForm createBlog={mockHandler} />);

  const user = userEvent.setup();

  // select all the inputs
  const titleInput = container.querySelector(".title");
  const authorInput = container.querySelector(".author");
  const urlInput = container.querySelector(".url");

  const submitButton = screen.getByText("submit");

  await user.type(titleInput, "Vitest is cool");
  await user.type(authorInput, "Sean Jin");
  await user.type(urlInput, "www.google.ca");

  await user.click(submitButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0]).toBe("Vitest is cool");
  expect(mockHandler.mock.calls[0][1]).toBe("Sean Jin");
  expect(mockHandler.mock.calls[0][2]).toBe("www.google.ca");
});
