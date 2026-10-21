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

  it.each([
    [
      "Mitsubishi UFJ Financial Group, Inc.",
      "https://www.mufg.jp/dam/cmn/cmn_logo_mufg_001.png",
    ],
    [
      "Tata Consultancy Services Limited",
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/TATA_Consultancy_Services_Logo.svg",
    ],
  ])("uses the verified logo override for %s", (name, logoUrl) => {
    render(
      <CompanyLogo name={name} logoUrl="https://invalid.example/broken.png" />
    );

    expect(screen.getByAltText(`${name} logo`)).toHaveAttribute("src", logoUrl);
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

  it("uses the verified Schneider Electric favicon after logo URLs fail", async () => {
    render(
      <CompanyLogo
        name="Schneider Electric"
        logoUrl="https://invalid.example/schneider.svg"
      />
    );

    fireEvent.error(screen.getByAltText("Schneider Electric logo"));
    await waitFor(() =>
      expect(screen.getByAltText("Schneider Electric icon")).toHaveAttribute(
        "src",
        "https://www.se.com/favicon.ico"
      )
    );
  });

  it("uses Zepto's correct public domain when its stored URL fails", async () => {
    render(
      <CompanyLogo
        name="Zepto Technologies Private Limited"
        logoUrl="https://invalid.example/zepto.svg"
      />
    );

    fireEvent.error(
      screen.getByAltText("Zepto Technologies Private Limited logo")
    );
    await waitFor(() =>
      expect(
        screen.getByAltText("Zepto Technologies Private Limited icon")
      ).toHaveAttribute(
        "src",
        "https://www.google.com/s2/favicons?domain=zeptonow.com&sz=128"
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
