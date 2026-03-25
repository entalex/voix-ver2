import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLandingData } from "@/context/LandingDataContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const { contact } = useLandingData();
  const [form, setForm] = useState({ email: "", organization: "", country: "", message: "" });
  const [sending, setSending] = useState(false);

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

    setSending(true);
    try {
      if (contact.recipientEmail) {
        await supabase.functions.invoke("send-contact-email", {
          body: {
            recipientEmail: contact.recipientEmail,
            senderEmail: trimmed.email,
            organization: trimmed.organization,
            country: trimmed.country,
            message: trimmed.message,
          },
        });
      }
      toast({ title: "Message Sent Successfully!", description: "We'll get back to you shortly." });
      setForm({ email: "", organization: "", country: "", message: "" });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="email" type="email" value={form.email} onChange={handleChange} maxLength={255} placeholder={contact.emailLabel || "Your Email"} />
            <Input name="organization" value={form.organization} onChange={handleChange} maxLength={100} placeholder={contact.organizationLabel || "Organization Name"} />
          </div>
          <Input name="country" value={form.country} onChange={handleChange} maxLength={100} placeholder={contact.countryLabel || "Country"} />
          <Textarea name="message" value={form.message} onChange={handleChange} maxLength={1000} placeholder={contact.messageLabel || "What information you want to share with us?"} rows={4} />
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
