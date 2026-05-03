import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const TURNSTILE_SITE_KEY = "";

const Contact = () => {
  const { toast } = useToast();
  const { contact } = useLandingData();
  const { lang } = useLanguage();
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
      toast({ title: lang === "ka" ? "გთხოვთ შეავსოთ ელ-ფოსტა და შეტყობინება." : "Please fill in at least your email and message.", variant: "destructive" });
      return;
    }
    if (turnstileEnabled && !turnstileToken) {
      toast({ title: lang === "ka" ? "გთხოვთ გაიაროთ უსაფრთხოების შემოწმება." : "Please complete the security check.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const res = await supabase.functions.invoke("send-contact-email", {
        body: {
          senderEmail: trimmed.email,
          organization: trimmed.organization,
          country: trimmed.country,
          message: trimmed.message,
          website_url_check: honeypot,
          turnstileToken,
        },
      });
      if (res.error) {
        const errData = res.error;
        if (typeof errData === "object" && "context" in errData) {
          const ctx = errData.context as any;
          if (ctx?.status === 429) {
            toast({ title: lang === "ka" ? "ძალიან ბევრი მოთხოვნა" : "Too many requests", description: lang === "ka" ? "გთხოვთ დაელოდოთ." : "Please wait before submitting again.", variant: "destructive" });
            return;
          }
        }
        throw new Error("Failed");
      }
      toast({ title: lang === "ka" ? "მადლობა!" : "Thank you!", description: lang === "ka" ? "დადასტურება გამოგზავნილია თქვენს ელ-ფოსტაზე." : "A confirmation has been sent to your email." });
      setForm({ email: "", organization: "", country: "", message: "" });
      setHoneypot("");
      setTurnstileToken(null);
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.reset(turnstileRef.current);
      }
    } catch (err) {
      console.error(err);
      toast({ title: lang === "ka" ? "გაგზავნა ვერ მოხერხდა" : "Failed to send", description: lang === "ka" ? "მოხდა შეცდომა. სცადეთ ხელახლა." : "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 animate-fade-up bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
          {lang === "ka" ? "მოდი ვისაუბროთ" : "Let's Talk"}
        </h2>
        <p className="text-muted-foreground mb-10">
          {lang === "ka"
            ? "მოგვიყევით თქვენი გამოყენების შესახებ და ჩვენ პასუხს გაგცემთ 24 საათში."
            : "Tell us about your use case and we'll get back within 24 hours."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl shadow-md p-8 md:p-12 max-w-2xl mx-auto text-left">
          <div className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10 overflow-hidden">
            <label htmlFor="website_url_check" className="hidden">Leave this empty</label>
            <input type="text" id="website_url_check" name="website_url_check" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="email" type="email" value={form.email} onChange={handleChange} maxLength={255} placeholder={t(contact.emailLabel, lang) || (lang === "ka" ? "თქვენი ელ-ფოსტა" : "Your Email")} />
            <Input name="organization" value={form.organization} onChange={handleChange} maxLength={100} placeholder={t(contact.organizationLabel, lang) || (lang === "ka" ? "ორგანიზაციის სახელი" : "Organization Name")} />
          </div>
          <Input name="country" value={form.country} onChange={handleChange} maxLength={100} placeholder={t(contact.countryLabel, lang) || (lang === "ka" ? "ქვეყანა" : "Country")} />
          <Textarea name="message" value={form.message} onChange={handleChange} maxLength={1000} placeholder={t(contact.messageLabel, lang) || (lang === "ka" ? "რა ინფორმაციის გაზიარება გსურთ?" : "What information you want to share with us?")} rows={4} />
          
          <div className="flex justify-center">
            <div ref={turnstileRef}></div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={sending} className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
              {sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {lang === "ka" ? "იგზავნება..." : "Sending..."}</> : (t(contact.buttonText, lang) || (lang === "ka" ? "გაგზავნა" : "Send"))}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
