import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Interactive Calendar", () => {
  it("renders the calendar and week view", () => {
    render(<App />);
    expect(screen.getByText("Interactive Calendar")).toBeInTheDocument();
    expect(screen.getByText("One-Week View")).toBeInTheDocument();
    expect(screen.getByText("AI Workshop")).toBeInTheDocument();
  });

  it("opens the create-post form", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /new post/i }));
    expect(screen.getByText("Create Post")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Post title")).toBeInTheDocument();
  });

  it("toggles optimization mode", async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole("button", { name: /optimization: on/i });
    await user.click(button);
    expect(screen.getByRole("button", { name: /optimization: off/i })).toBeInTheDocument();
  });
});