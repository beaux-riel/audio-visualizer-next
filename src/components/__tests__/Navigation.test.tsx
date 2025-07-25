import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navigation from "../Navigation";

// Mock usePathname hook from Next.js
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("Navigation", () => {
  it("renders the logo/title correctly", () => {
    render(<Navigation />);

    expect(screen.getByText("Audio Visualizer")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Navigation />);

    // Check for Home link
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    // Check for About link
    const aboutLink = screen.getByRole("link", { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("applies correct CSS classes for styling", () => {
    render(<Navigation />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass(
      "bg-black/20",
      "backdrop-blur-lg",
      "border-b",
      "border-white/10"
    );
  });

  it("shows active state for home page", () => {
    // Default mock returns '/' so home should be active
    render(<Navigation />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveClass("active");

    const aboutLink = screen.getByRole("link", { name: /about/i });
    expect(aboutLink).not.toHaveClass("active");
  });

  it("shows navigation structure correctly", () => {
    // This test verifies the navigation renders properly
    render(<Navigation />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    const aboutLink = screen.getByRole("link", { name: /about/i });

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();

    // Home should be active by default (mocked pathname is '/')
    expect(homeLink).toHaveClass("active");
  });

  it("contains proper navigation structure", () => {
    render(<Navigation />);

    // Check container structure
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Check that logo link exists and points to home
    const logoLink = screen.getByRole("link", { name: "Audio Visualizer" });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("has responsive design classes", () => {
    render(<Navigation />);

    // Check for responsive text visibility classes
    const homeText = screen.getByText("Home");
    expect(homeText).toHaveClass("hidden", "sm:inline");

    const aboutText = screen.getByText("About");
    expect(aboutText).toHaveClass("hidden", "sm:inline");
  });

  it("includes icons in navigation links", () => {
    render(<Navigation />);

    // Check that SVG icons are present in the DOM
    const container = screen.getByRole("navigation");
    const svgElements = container.querySelectorAll("svg");
    expect(svgElements.length).toBe(2); // Home icon + About icon
  });

  it("maintains proper accessibility attributes", () => {
    render(<Navigation />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    // Check that all links are accessible
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3); // Logo + Home + About

    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });
  });
});
