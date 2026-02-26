import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", organization: "", country: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    toast({ title: "Message sent!", description: "We'll get back to you shortly." });
    setForm({ email: "", organization: "", country: "", message: "" });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="email" type="email" value={form.email} onChange={handleChange} maxLength={255} placeholder="Your Email" />
            <Input name="organization" value={form.organization} onChange={handleChange} maxLength={100} placeholder="Organization Name" />
          </div>
          <Input name="country" value={form.country} onChange={handleChange} maxLength={100} placeholder="Country" />
          <Textarea name="message" value={form.message} onChange={handleChange} maxLength={1000} placeholder="What information you want to share with us?" rows={4} />
          <Button type="submit" className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-6 text-lg">
            Send
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
