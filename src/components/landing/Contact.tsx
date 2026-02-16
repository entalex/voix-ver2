import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", organization: "", country: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = {
      name: form.name.trim(),
      organization: form.organization.trim(),
      country: form.country.trim(),
      message: form.message.trim(),
    };
    if (!trimmed.name || !trimmed.message) {
      toast({ title: "Please fill in at least your name and message.", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you shortly." });
    setForm({ name: "", organization: "", country: "", message: "" });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">Get in Touch</h2>
        <p className="mt-4 text-muted-foreground text-center mb-10">
          Have questions? Drop us a message and our team will respond promptly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} maxLength={100} placeholder="Your name" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" name="organization" value={form.organization} onChange={handleChange} maxLength={100} placeholder="Company name" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={form.country} onChange={handleChange} maxLength={100} placeholder="Your country" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" name="message" value={form.message} onChange={handleChange} maxLength={1000} placeholder="How can we help?" rows={4} className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-6 text-lg">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
