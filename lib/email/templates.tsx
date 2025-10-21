const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://templategen.academy"

export function welcomeEmail(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .checklist { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .checklist-item { padding: 8px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Template Generation Academy!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>We're thrilled to have you join our community of template generators! You're now part of a platform where creativity meets quality.</p>
            
            <div class="checklist">
              <h3>Get Started Checklist:</h3>
              <div class="checklist-item">✓ Complete your profile</div>
              <div class="checklist-item">✓ Browse existing templates</div>
              <div class="checklist-item">✓ Submit your first template</div>
              <div class="checklist-item">✓ Start generating templates</div>
              <div class="checklist-item">✓ Earn your first certification</div>
            </div>

            <a href="${baseUrl}/training" class="button">Start Training</a>

            <p>Need help? Check out our <a href="${baseUrl}/help">Help Center</a> or reply to this email.</p>
          </div>
          <div class="footer">
            <p>Template Generation Academy</p>
            <p>You're receiving this because you signed up for an account.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function generationCompleteEmail(userName: string, templateName: string, templateId: string, score: number) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(``\`typescript file="lib/email/templates.tsx"
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://templategen.academy"

export function welcomeEmail(userName: string) {
  return `
    <!DOCTYPE html>\
    <html>
      <head>
        <meta charset="utf-8">
        <style>\
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }\
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }\
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }\
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }\
          .checklist { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }\
          .checklist-item { padding: 8px 0; }\
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Template Generation Academy!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>We're thrilled to have you join our community of template generators! You're now part of a platform where creativity meets quality.</p>
            
            <div class="checklist">
              <h3>Get Started Checklist:</h3>
              <div class="checklist-item">✓ Complete your profile</div>
              <div class="checklist-item">✓ Browse existing templates</div>
              <div class="checklist-item">✓ Submit your first template</div>
              <div class="checklist-item">✓ Start generating templates</div>
              <div class="checklist-item">✓ Earn your first certification</div>
            </div>

            <a href="${baseUrl}/training" class="button">Start Training</a>

            <p>Need help? Check out our <a href="${baseUrl}/help">Help Center</a> or reply to this email.</p>
          </div>
          <div class="footer">
            <p>Template Generation Academy</p>
            <p>You're receiving this because you signed up for an account.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function generationCompleteEmail(userName: string, templateName: string, templateId: string, score: number) {
  return `
    <!DOCTYPE html>
    <html>\
      <head>
        <meta charset="utf-8">
        <style>\
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }\
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }\
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }\
          .score { font-size: 48px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }\
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }\
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Generation Complete! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Your template "<strong>${templateName}</strong>" has been successfully generated!</p>
            
            <div class="score">${score}/10</div>
            <p style="text-align: center; color: #6b7280;">Overall Score</p>

            <a href="${baseUrl}/templates/${templateId}" class="button">View Results</a>

            <p>Keep up the great work! Your contributions help make our community stronger.</p>
          </div>
          <div class="footer">
            <p>Template Generation Academy</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function commentReplyEmail(
  userName: string,
  commenterName: string,
  templateName: string,
  templateId: string,
  commentText: string,
) {
  return `\
    <!DOCTYPE html>\
    <html>
      <head>
        <meta charset="utf-8">
        <style>\
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }\
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }\
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }\
          .comment { background: #f9fafb; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px; }\
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }\
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Comment on Your Template</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p><strong>${commenterName}</strong> commented on your template "<strong>${templateName}</strong>":</p>
            
            <div class="comment">
              ${commentText}
            </div>

            <a href="${baseUrl}/templates/${templateId}#comments" class="button">View & Reply</a>
          </div>
          <div class="footer">
            <p>Template Generation Academy</p>
            <p><a href="${baseUrl}/profile/settings">Manage notification preferences</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function certificationEarnedEmail(userName: string, certificationLevel: string) {
  return `\
    <!DOCTYPE html>\
    <html>
      <head>
        <meta charset="utf-8">
        <style>\
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }
          .badge { text-align: center; margin: 30px 0; }
          .badge-icon { font-size: 80px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Congratulations! 🏆</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>You've earned the <strong>${certificationLevel} Generator Certification</strong>!</p>
            
            <div class="badge">
              <div class="badge-icon">🎖️</div>
              <h2>${certificationLevel}</h2>
            </div>

            <p>This achievement recognizes your expertise and dedication to quality template generation. Your certification badge is now displayed on your profile.</p>

            <a href="${baseUrl}/certificate" class="button">View Certificate</a>

            <p>Share your achievement with the community and keep pushing the boundaries of what's possible!</p>
          </div>
          <div class="footer">
            <p>Template Generation Academy</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function weeklyDigestEmail(
  userName: string,
  newTemplates: Array<{ name: string; id: string; score: number }>,
  topGenerators: Array<{ name: string; count: number }>,
) {
  const templatesList = newTemplates
    .map(
      (t) =>
        `<li><a href="${baseUrl}/templates/${t.id}">${t.name}</a> - Score: ${t.score}/10</li>`,
    )
    .join("")

  const generatorsList = topGenerators.map((g) => `<li>${g.name} - ${g.count} generations</li>`).join("")

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }
          .section { margin: 30px 0; }
          ul { list-style: none; padding: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Weekly Digest</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Here's what happened this week in the Template Generation Academy:</p>
            
            <div class="section">
              <h3>🆕 New Templates</h3>
              <ul>${templatesList}</ul>
            </div>

            <div class="section">
              <h3>⭐ Top Generators</h3>
              <ul>${generatorsList}</ul>
            </div>

            <a href="${baseUrl}/browse" class="button">Explore Templates</a>
          </div>
          <div class="footer">
            <p>Template Generation Academy</p>
            <p><a href="${baseUrl}/profile/settings">Unsubscribe from weekly digest</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}
