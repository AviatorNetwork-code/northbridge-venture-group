import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Northbridge Venture Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          Northbridge Venture Group
        </div>
        <div
          style={{
            width: 120,
            height: 6,
            backgroundColor: "#B11226",
            marginTop: 24,
          }}
        />
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.8)",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Aviation & financial services ventures
        </div>
      </div>
    ),
    { ...size }
  );
}
