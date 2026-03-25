import { useState } from "react";
import { useLandingData, ContactData } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ContactEditor = () => {
  const { contact, setContact } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<ContactData>(() => ({ ...contact }));
  const [saving, setSaving] = useState(false);

  const update = (field: keyof ContactData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "contact", value: JSON.stringify(draft) }, { onConflict: "key" });
      if (error) throw error;
      setContact(draft);
      toast({ title: "Contact section updated!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Save failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Section Text</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Section Title</Label>
            <Input value={draft.sectionTitle} onChange={(e) => update("sectionTitle", e.target.value)} maxLength={80} className="mt-1" />
          </div>
          <div>
            <Label>Section Description</Label>
            <Input value={draft.sectionDescription} onChange={(e) => update("sectionDescription", e.target.value)} maxLength={300} className="mt-1" placeholder="Optional subtitle below the title" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Form Labels</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email Field Label</Label>
            <Input value={draft.emailLabel} onChange={(e) => update("emailLabel", e.target.value)} maxLength={60} className="mt-1" />
          </div>
          <div>
            <Label>Organization Field Label</Label>
            <Input value={draft.organizationLabel} onChange={(e) => update("organizationLabel", e.target.value)} maxLength={60} className="mt-1" />
          </div>
          <div>
            <Label>Country Field Label</Label>
            <Input value={draft.countryLabel} onChange={(e) => update("countryLabel", e.target.value)} maxLength={60} className="mt-1" />
          </div>
          <div>
            <Label>Message Field Label</Label>
            <Input value={draft.messageLabel} onChange={(e) => update("messageLabel", e.target.value)} maxLength={100} className="mt-1" />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input value={draft.buttonText} onChange={(e) => update("buttonText", e.target.value)} maxLength={40} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Email Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Recipient Email</Label>
            <Input type="email" value={draft.recipientEmail} onChange={(e) => update("recipientEmail", e.target.value)} maxLength={255} className="mt-1" placeholder="admin@voix.cx" />
            <p className="text-xs text-muted-foreground mt-1">Form submissions will be sent to this email address.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Auto-Reply to User</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Auto-Reply Subject</Label>
            <Input value={draft.autoReplySubject} onChange={(e) => update("autoReplySubject", e.target.value)} maxLength={200} className="mt-1" placeholder="Thank you for contacting us!" />
          </div>
          <div>
            <Label>Auto-Reply Message</Label>
            <Textarea value={draft.autoReplyMessage} onChange={(e) => update("autoReplyMessage", e.target.value)} maxLength={2000} className="mt-1" placeholder="We have received your message and will get back to you shortly." rows={4} />
            <p className="text-xs text-muted-foreground mt-1">This message will be sent automatically to the user after they submit the contact form.</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Contact"}
      </Button>
    </div>
  );
};

export default ContactEditor;
