import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Strip HTML tags and script patterns
function sanitizeInput(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/javascript:/gi, "") // strip JS protocol
    .replace(/on\w+\s*=/gi, "") // strip inline event handlers
    .replace(/[\r\n]+/g, "\n") // normalize newlines
    .trim();
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      recipientEmail, senderEmail, organization, country, message,
      autoReplySubject, autoReplyMessage,
      website_url_check, turnstileToken,
    } = body;

    // --- Layer 1: Honeypot ---
    if (website_url_check) {
      console.log("Honeypot triggered, silently rejecting.");
      return new Response(
        JSON.stringify({ success: true, message: "Message Sent Successfully!" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Basic validation ---
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

    // --- Layer 3: Input sanitization ---
    const cleanEmail = sanitizeInput(senderEmail);
    const cleanOrg = sanitizeInput(organization || "");
    const cleanCountry = sanitizeInput(country || "");
    const cleanMessage = sanitizeInput(message);

    // --- Layer 4: Cloudflare Turnstile verification ---
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecret) {
      if (!turnstileToken) {
        return new Response(
          JSON.stringify({ error: "Security verification required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.error("Turnstile verification failed:", verifyData);
        return new Response(
          JSON.stringify({ error: "Security verification failed" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log("Turnstile verification passed.");
    } else {
      console.warn("TURNSTILE_SECRET_KEY not set, skipping Turnstile verification.");
    }

    // --- Layer 2: Rate limiting ---
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("cf-connecting-ip")
      || "unknown";

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("form_submission_logs")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIp)
      .gte("created_at", oneHourAgo);

    if (countError) {
      console.error("Rate limit check error:", countError);
    } else if ((count ?? 0) >= 5) {
      console.log(`Rate limit exceeded for IP: ${clientIp}, count: ${count}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log this submission
    await supabaseAdmin.from("form_submission_logs").insert({ ip_address: clientIp });

    // --- Send emails ---
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpUser || !smtpPass) {
      console.error("SMTP_USER or SMTP_PASS not set.");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const senderName = cleanOrg || cleanEmail.split("@")[0];

    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #41506C;">New Contact Form Lead</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #41506C;">From:</td><td style="padding: 8px 0;">${escapeHtml(cleanEmail)}</td></tr>
          ${cleanOrg ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #41506C;">Organization:</td><td style="padding: 8px 0;">${escapeHtml(cleanOrg)}</td></tr>` : ""}
          ${cleanCountry ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #41506C;">Country:</td><td style="padding: 8px 0;">${escapeHtml(cleanCountry)}</td></tr>` : ""}
        </table>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;" />
        <h3 style="color: #41506C;">Message:</h3>
        <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
      </div>
    `;

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: { username: smtpUser, password: smtpPass },
      },
    });

    // Email 1: To admin
    try {
      console.log("Sending Email 1 (admin notification)...");
      await client.send({
        from: smtpUser,
        to: recipientEmail,
        replyTo: cleanEmail,
        subject: `New Contact Form Lead: ${escapeHtml(senderName)}`,
        content: cleanMessage,
        html: notificationHtml,
      });
      console.log("Email 1 sent successfully.");
    } catch (err) {
      console.error("Email 1 failed:", err.message || err);
    }

    // Email 2: Auto-reply to user
    if (autoReplyMessage) {
      const replySubject = autoReplySubject || "Thank you for contacting us!";
      const cleanAutoReply = sanitizeInput(autoReplyMessage);
      const autoReplyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #41506C;">${escapeHtml(replySubject)}</h2>
          <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(cleanAutoReply)}</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">This is an automated reply. Please do not respond to this email.</p>
        </div>
      `;

      try {
        console.log("Sending Email 2 (auto-reply)...");
        await client.send({
          from: smtpUser,
          to: cleanEmail,
          subject: replySubject,
          content: cleanAutoReply,
          html: autoReplyHtml,
        });
        console.log("Email 2 sent successfully.");
      } catch (err) {
        console.error("Email 2 failed:", err.message || err);
      }
    }

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Message Sent Successfully!" }),
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
