import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get("title") || "Template Generation Academy"
  const description = searchParams.get("description") || "Generate, evaluate, and share quality templates"
  const score = searchParams.get("score")

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          maxWidth: "900px",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            color: "#1f2937",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "30px",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: score ? "30px" : "0",
          }}
        >
          {description}
        </p>
        {score && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "20px 40px",
              background: "#f3f4f6",
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: "72px", fontWeight: "bold", color: "#667eea" }}>{score}</span>
            <span style={{ fontSize: "36px", color: "#6b7280" }}>/10</span>
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "24px",
          color: "white",
          fontWeight: "600",
        }}
      >
        Template Generation Academy
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
