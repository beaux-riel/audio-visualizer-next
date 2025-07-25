import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AudioVisualizer from "../AudioVisualizer";

describe("AudioVisualizer", () => {
  it("renders without crashing", () => {
    render(<AudioVisualizer />);
    expect(screen.getByText(/audio visualizer/i)).toBeInTheDocument();
  });
});
