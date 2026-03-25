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
    const { recipientEmail, senderEmail, organization, country, message } = await req.json();

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

    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASS = Deno.env.get("SMTP_PASS");

    if (!SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP credentials are not configured");
    }

    const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const emailHtml = `
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
          username: SMTP_USER,
          password: SMTP_PASS,
        },
      },
    });

    const senderName = organization || senderEmail.split("@")[0];

    await client.send({
      from: SMTP_USER,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: `New Contact Form Lead: ${senderName}`,
      content: message,
      html: emailHtml,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
