"use server"

import { sendEmail } from "@/lib/email/client"
import {
  welcomeEmail,
  generationCompleteEmail,
  commentReplyEmail,
  certificationEarnedEmail,
  weeklyDigestEmail,
} from "@/lib/email/templates"

export async function sendWelcomeEmail(email: string, userName: string) {
  return await sendEmail({
    to: email,
    subject: "Welcome to Template Generation Academy!",
    html: welcomeEmail(userName),
  })
}

export async function sendGenerationCompleteEmail(
  email: string,
  userName: string,
  templateName: string,
  templateId: string,
  score: number,
) {
  return await sendEmail({
    to: email,
    subject: `Generation Complete: ${templateName}`,
    html: generationCompleteEmail(userName, templateName, templateId, score),
  })
}

export async function sendCommentReplyEmail(
  email: string,
  userName: string,
  commenterName: string,
  templateName: string,
  templateId: string,
  commentText: string,
) {
  return await sendEmail({
    to: email,
    subject: `New comment on ${templateName}`,
    html: commentReplyEmail(userName, commenterName, templateName, templateId, commentText),
  })
}

export async function sendCertificationEarnedEmail(email: string, userName: string, certificationLevel: string) {
  return await sendEmail({
    to: email,
    subject: `Congratulations! You earned ${certificationLevel} Certification`,
    html: certificationEarnedEmail(userName, certificationLevel),
  })
}

export async function sendWeeklyDigestEmail(
  email: string,
  userName: string,
  newTemplates: Array<{ name: string; id: string; score: number }>,
  topGenerators: Array<{ name: string; count: number }>,
) {
  return await sendEmail({
    to: email,
    subject: "Your Weekly Template Digest",
    html: weeklyDigestEmail(userName, newTemplates, topGenerators),
  })
}
