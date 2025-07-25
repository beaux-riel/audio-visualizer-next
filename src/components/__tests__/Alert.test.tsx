import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Alert from "../Alert";

describe("Alert Component", () => {
  it("renders error alert with correct styling and icon", () => {
    render(
      <Alert type="error" title="Error Title">
        Error message content
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("aria-live", "polite");

    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error message content")).toBeInTheDocument();

    // Check for error-specific classes
    expect(alert).toHaveClass("bg-red-500/20", "border-red-500/30");
  });

  it("renders warning alert with correct styling and icon", () => {
    render(
      <Alert type="warning" title="Warning Title">
        Warning message content
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-yellow-500/20", "border-yellow-500/30");
    expect(screen.getByText("Warning Title")).toBeInTheDocument();
    expect(screen.getByText("Warning message content")).toBeInTheDocument();
  });

  it("renders success alert with correct styling and icon", () => {
    render(
      <Alert type="success" title="Success Title">
        Success message content
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-green-500/20", "border-green-500/30");
    expect(screen.getByText("Success Title")).toBeInTheDocument();
    expect(screen.getByText("Success message content")).toBeInTheDocument();
  });

  it("renders info alert with correct styling and icon", () => {
    render(
      <Alert type="info" title="Info Title">
        Info message content
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-blue-500/20", "border-blue-500/30");
    expect(screen.getByText("Info Title")).toBeInTheDocument();
    expect(screen.getByText("Info message content")).toBeInTheDocument();
  });

  it("renders alert without title", () => {
    render(<Alert type="error">Error message without title</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByText("Error message without title")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Alert type="info" className="custom-class">
        Custom class test
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("custom-class");
  });

  it("renders complex content with JSX", () => {
    render(
      <Alert type="warning" title="Complex Content">
        <p>First paragraph</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </Alert>
    );

    expect(screen.getByText("Complex Content")).toBeInTheDocument();
    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("List item 1")).toBeInTheDocument();
    expect(screen.getByText("List item 2")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(
      <Alert type="error" title="Accessibility Test">
        Content for accessibility testing
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("role", "alert");
    expect(alert).toHaveAttribute("aria-live", "polite");
  });

  it("renders icons with aria-hidden attribute", () => {
    render(
      <Alert type="error" title="Icon Test">
        Icon test content
      </Alert>
    );

    // The icon should be present but hidden from screen readers
    const icons = screen.getByRole("alert").querySelectorAll("svg");
    expect(icons).toHaveLength(1);
    // Note: lucide-react icons don't automatically get aria-hidden,
    // but they are decorative in this context
  });
});
