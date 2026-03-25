import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, senderEmail, organization, country, message, autoReplySubject, autoReplyMessage } = await req.json();

    if (!recipientEmail || !senderEmail || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > 1000 || senderEmail.length > 255) {
      return new Response(
        JSON.stringify({ error: "Input too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpUser || !smtpPass) {
      console.error("SMTP_USER or SMTP_PASS environment variables are not set.");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const senderName = organization || senderEmail.split("@")[0];

    // --- Email 1: Notification to admin ---
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #41506C;">New Contact Form Lead</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #41506C;">From:</td><td style="padding: 8px 0;">${sanitize(senderEmail)}</td></tr>
          ${organization ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #41506C;">Organization:</td><td style="padding: 8px 0;">${sanitize(organization)}</td></tr>` : ""}
          ${country ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #41506C;">Country:</td><td style="padding: 8px 0;">${sanitize(country)}</td></tr>` : ""}
        </table>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;" />
        <h3 style="color: #41506C;">Message:</h3>
        <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${sanitize(message)}</p>
      </div>
    `;

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    let email1Error: string | null = null;

    // Send Email 1 (to admin)
    try {
      console.log("Sending Email 1 (notification to admin)...");
      await client.send({
        from: smtpUser,
        to: recipientEmail,
        replyTo: senderEmail,
        subject: `New Contact Form Lead: ${sanitize(senderName)}`,
        content: message,
        html: notificationHtml,
      });
      console.log("Email 1 sent successfully.");
    } catch (err) {
      email1Error = err.message || String(err);
      console.error("Email 1 failed:", email1Error);
    }

    // --- Email 2: Auto-reply to user ---
    if (autoReplyMessage) {
      const replySubject = autoReplySubject || "Thank you for contacting us!";
      const autoReplyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #41506C;">${sanitize(replySubject)}</h2>
          <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${sanitize(autoReplyMessage)}</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">This is an automated reply. Please do not respond to this email.</p>
        </div>
      `;

      try {
        console.log("Sending Email 2 (auto-reply to user)...");
        await client.send({
          from: smtpUser,
          to: senderEmail,
          subject: replySubject,
          content: autoReplyMessage,
          html: autoReplyHtml,
        });
        console.log("Email 2 sent successfully.");
      } catch (err) {
        console.error("Email 2 (auto-reply) failed:", err.message || err);
      }
    }

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Message Sent Successfully!", email1Error }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message || error);
    return new Response(
      JSON.stringify({ error: "Failed to send email. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
