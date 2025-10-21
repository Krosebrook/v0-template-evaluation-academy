import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!resend) {
    console.log("[Email] Skipping email send (RESEND_API_KEY not configured):", { to, subject })
    return { success: true, data: null, skipped: true }
  }

  try {
    const data = await resend.emails.send({
      from: "Template Generation Academy <notifications@templategen.academy>",
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error }
  }
}
