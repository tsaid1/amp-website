import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { getPostBySlug, getCategoryLabel } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_COLORS: Record<string, string> = {
  compliance: "#F59E0B",
  efficiency: "#10B981",
  technology: "#0EA5E9",
  "thought-leadership": "#8B5CF6",
};

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Amp Blog";
  const category = post?.category ?? "efficiency";
  const readingTime = post?.readingTime ?? "";
  const categoryColor = CATEGORY_COLORS[category] ?? "#10B981";
  const categoryLabel = getCategoryLabel(category);

  const fontData = await readFile(
    join(process.cwd(), "src/assets/fonts/SpaceGrotesk-Bold.ttf")
  );

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
            justifyContent: "space-between",
            alignItems: "center",
            padding: "40px 48px 0 48px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

          {/* Category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: 999,
              background: `${categoryColor}cc`,
              color: "white",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "Space Grotesk",
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            padding: "0 48px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 52,
              fontWeight: 700,
              fontFamily: "Space Grotesk",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              overflow: "hidden",
              maxHeight: 192,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            {readingTime}
          </span>
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
