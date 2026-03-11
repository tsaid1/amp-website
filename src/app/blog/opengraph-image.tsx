import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const fontData = await fetch(
    new URL(
      "https://github.com/nicholasgasior/gfonts/raw/master/fonts/space_grotesk/SpaceGrotesk-Bold.ttf"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #050F0D 0%, #0A1F1C 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(29, 185, 160, 0.08)",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            width: "100%",
            height: 6,
            background: "linear-gradient(90deg, #1DB9A0, #00D4AA)",
            flexShrink: 0,
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "40px 48px 0 48px",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#1DB9A0",
            }}
          />
          <span
            style={{
              color: "white",
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              letterSpacing: "-0.02em",
            }}
          >
            AMP
          </span>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 48px",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 64,
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            The Amp Blog
          </div>
          <div
            style={{
              color: "#8A9A97",
              fontSize: 28,
              fontFamily: "Space Grotesk",
            }}
          >
            Energy Intelligence Insights
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "0 48px 40px 48px",
          }}
        >
          <span
            style={{
              color: "#8A9A97",
              fontSize: 22,
              fontFamily: "Space Grotesk",
            }}
          >
            ampenergy.ae
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
