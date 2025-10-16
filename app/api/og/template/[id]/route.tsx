import { ImageResponse } from "next/og"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "edge"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const { data: template } = await supabase
      .from("templates")
      .select(`
        *,
        evaluations (
          code_quality,
          documentation,
          usability,
          performance,
          accessibility,
          innovation
        )
      `)
      .eq("id", params.id)
      .single()

    if (!template) {
      return new Response("Template not found", { status: 404 })
    }

    // Calculate average score
    const evaluations = template.evaluations || []
    const avgScore =
      evaluations.length > 0
        ? evaluations.reduce(
            (sum: number, e: any) =>
              sum +
              (e.code_quality + e.documentation + e.usability + e.performance + e.accessibility + e.innovation) / 6,
            0,
          ) / evaluations.length
        : 0

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#18181b",
            borderRadius: "24px",
            padding: "60px",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {template.title}
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#a1a1aa",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            {template.description}
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                backgroundColor: "#27272a",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "24px",
                color: "#a1a1aa",
              }}
            >
              {template.category}
            </div>
            <div
              style={{
                backgroundColor: "#27272a",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "24px",
                color: "#a1a1aa",
              }}
            >
              {template.difficulty}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#3b82f6",
              padding: "24px 48px",
              borderRadius: "16px",
              fontSize: "48px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            {avgScore.toFixed(1)}/10
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("[v0] OG image generation error:", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
