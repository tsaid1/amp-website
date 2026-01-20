"use server";

import { Resend } from "resend";

// Initialize Resend client (API key from environment)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Formspree endpoint as fallback
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT;

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  // Honeypot field - should be empty if submitted by a real user
  website?: string;
}

export interface ContactFormResponse {
  success: boolean;
  error?: string;
}

// Validation helpers (server-side)
function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  if (email.length > 254) return "Email is too long";
  return null;
}

function validateName(name: string): string | null {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 100) return "Name must be less than 100 characters";
  return null;
}

function validateMessage(message: string): string | null {
  if (!message) return "Message is required";
  if (message.length < 10) return "Message must be at least 10 characters";
  if (message.length > 2000) return "Message must be less than 2000 characters";
  return null;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormResponse> {
  // Honeypot check - if filled, it's likely a bot
  if (data.website) {
    // Silently succeed for bots to avoid detection
    return { success: true };
  }

  // Server-side validation
  const nameError = validateName(data.name);
  if (nameError) {
    return { success: false, error: nameError };
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    return { success: false, error: emailError };
  }

  const messageError = validateMessage(data.message);
  if (messageError) {
    return { success: false, error: messageError };
  }

  // Try Resend first, then fall back to Formspree
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: "Amp Contact Form <noreply@ampenergy.ae>",
        to: ["hello@ampenergy.ae"],
        replyTo: data.email,
        subject: `Contact Form: ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text: buildPlainTextEmail(data),
        html: buildHtmlEmail(data),
      });

      if (error) {
        console.error("Resend error:", error);
        // Fall through to Formspree
      } else {
        return { success: true };
      }
    } catch (err) {
      console.error("Resend exception:", err);
      // Fall through to Formspree
    }
  }

  // Fallback to Formspree
  if (FORMSPREE_ENDPOINT) {
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company || "Not provided",
          message: data.message,
        }),
      });

      if (response.ok) {
        return { success: true };
      }

      const result = await response.json();
      console.error("Formspree error:", result);
      return {
        success: false,
        error: "Failed to send message. Please try again.",
      };
    } catch (err) {
      console.error("Formspree exception:", err);
      return {
        success: false,
        error: "Failed to send message. Please try again.",
      };
    }
  }

  // No email service configured
  if (!resend && !FORMSPREE_ENDPOINT) {
    console.warn("No email service configured. Set RESEND_API_KEY or FORMSPREE_ENDPOINT.");
    // In development, simulate success
    if (process.env.NODE_ENV === "development") {
      console.log("DEV MODE - Contact form submission:", data);
      return { success: true };
    }
    return {
      success: false,
      error: "Email service not configured. Please contact us directly at hello@ampenergy.ae",
    };
  }

  return {
    success: false,
    error: "Failed to send message. Please try again or email us directly.",
  };
}

function buildPlainTextEmail(data: ContactFormData): string {
  return `
New contact form submission from ampenergy.ae

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}

Message:
${data.message}

---
Sent from the Amp website contact form
`.trim();
}

function buildHtmlEmail(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">New Contact Form Submission</h1>
  </div>

  <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 100px;">Name</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <a href="mailto:${escapeHtml(data.email)}" style="color: #059669; text-decoration: none;">${escapeHtml(data.email)}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Company</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.company || "Not provided")}</td>
      </tr>
    </table>

    <div style="margin-top: 24px;">
      <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">Message</p>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
    </div>

    <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
      Sent from the Amp website contact form
    </p>
  </div>
</body>
</html>
`.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
