import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLandingData } from "@/context/LandingDataContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Set your real Cloudflare Turnstile site key here to enable the widget
const TURNSTILE_SITE_KEY = "";

const Contact = () => {
  const { toast } = useToast();
  const { contact } = useLandingData();
  const [form, setForm] = useState({ email: "", organization: "", country: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const turnstileEnabled = !!TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!turnstileEnabled) return;

    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    (window as any).onTurnstileLoad = () => {
      if (turnstileRef.current && (window as any).turnstile) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(null),
        });
      }
    };

    if ((window as any).turnstile && turnstileRef.current) {
      (window as any).turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(null),
      });
    }
  }, [turnstileEnabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = {
      email: form.email.trim(),
      organization: form.organization.trim(),
      country: form.country.trim(),
      message: form.message.trim(),
    };
    if (!trimmed.email || !trimmed.message) {
      toast({ title: "Please fill in at least your email and message.", variant: "destructive" });
      return;
    }

    if (!turnstileToken) {
      toast({ title: "Please complete the security check.", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const res = await supabase.functions.invoke("send-contact-email", {
        body: {
          recipientEmail: contact.recipientEmail,
          senderEmail: trimmed.email,
          organization: trimmed.organization,
          country: trimmed.country,
          message: trimmed.message,
          autoReplySubject: contact.autoReplySubject,
          autoReplyMessage: contact.autoReplyMessage,
          website_url_check: honeypot,
          turnstileToken,
        },
      });

      if (res.error) {
        const errData = res.error;
        if (typeof errData === "object" && "context" in errData) {
          const ctx = errData.context as any;
          if (ctx?.status === 429) {
            toast({ title: "Too many requests", description: "Please wait before submitting again.", variant: "destructive" });
            return;
          }
        }
        throw new Error("Failed");
      }

      toast({ title: "Thank you!", description: "A confirmation has been sent to your email." });
      setForm({ email: "", organization: "", country: "", message: "" });
      setHoneypot("");
      setTurnstileToken(null);
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.reset(turnstileRef.current);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to send", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">
          {contact.sectionTitle || "Contact Us"}
        </h2>
        {contact.sectionDescription && (
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            {contact.sectionDescription}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot - hidden from humans */}
          <div className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10 overflow-hidden">
            <label htmlFor="website_url_check" className="hidden">Leave this empty</label>
            <input
              type="text"
              id="website_url_check"
              name="website_url_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="email" type="email" value={form.email} onChange={handleChange} maxLength={255} placeholder={contact.emailLabel || "Your Email"} />
            <Input name="organization" value={form.organization} onChange={handleChange} maxLength={100} placeholder={contact.organizationLabel || "Organization Name"} />
          </div>
          <Input name="country" value={form.country} onChange={handleChange} maxLength={100} placeholder={contact.countryLabel || "Country"} />
          <Textarea name="message" value={form.message} onChange={handleChange} maxLength={1000} placeholder={contact.messageLabel || "What information you want to share with us?"} rows={4} />
          
          {/* Cloudflare Turnstile widget */}
          <div className="flex justify-center">
            <div ref={turnstileRef}></div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={sending} className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
              {sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : (contact.buttonText || "Send")}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
