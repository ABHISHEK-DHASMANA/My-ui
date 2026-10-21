import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompanyLogo } from "@/components/CompanyLogo";

describe("CompanyLogo", () => {
  it("tries alternate logo URLs before falling back to the website favicon", async () => {
    render(
      <CompanyLogo
        name="Example Company"
        logoUrl="https://invalid.example/logo.svg; https://example.com/logo.png"
        websiteUrl="https://example.com"
      />
    );

    const image = screen.getByAltText("Example Company logo");
    expect(image).toHaveAttribute("src", "https://invalid.example/logo.svg");

    fireEvent.error(image);
    await waitFor(() =>
      expect(screen.getByAltText("Example Company logo")).toHaveAttribute(
        "src",
        "https://example.com/logo.png"
      )
    );

    fireEvent.error(screen.getByAltText("Example Company logo"));
    await waitFor(() =>
      expect(screen.getByAltText("Example Company icon")).toHaveAttribute(
        "src",
        "https://www.google.com/s2/favicons?domain=example.com&sz=128"
      )
    );
  });

  it("uses the known company domain when stored logo URLs are stale", async () => {
    render(
      <CompanyLogo
        name="JPMorgan Chase & Co."
        logoUrl="https://upload.wikimedia.org/broken-logo.svg"
        websiteUrl="#"
      />
    );

    fireEvent.error(screen.getByAltText("JPMorgan Chase & Co. logo"));
    await waitFor(() =>
      expect(screen.getByAltText("JPMorgan Chase & Co. icon")).toHaveAttribute(
        "src",
        "https://www.google.com/s2/favicons?domain=jpmorganchase.com&sz=128"
      )
    );
  });

  it("uses a first-party favicon when a company has no valid logo URL", async () => {
    render(
      <CompanyLogo name="Hexagon Capability Center India" logoUrl="NA" />
    );

    await waitFor(() =>
      expect(screen.getByAltText("Hexagon Capability Center India icon")).toHaveAttribute(
        "src",
        "https://hexagon.com/favicon.ico"
      )
    );
  });

  it("extracts an image URL from a Yahoo image-search logo value", () => {
    render(
      <CompanyLogo
        name="MintAir Corp"
        logoUrl="https://images.search.yahoo.com/search/images?imgurl=https%3A%2F%2Flinktr.ee%2Fog%2Fimage%2Fmintair.jpg"
      />
    );

    expect(screen.getByAltText("MintAir Corp logo")).toHaveAttribute(
      "src",
      "https://linktr.ee/og/image/mintair.jpg"
    );
  });

  it("shows the company initial when no logo URL or website domain is available", () => {
    render(<CompanyLogo name="Example Company" logoUrl="NA" websiteUrl="#" />);
    expect(screen.getByText("E")).toBeInTheDocument();
  });
});
