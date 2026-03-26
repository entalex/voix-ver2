import { useState } from "react";
import { useLandingData, ContactData } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import BilingualField from "./BilingualField";

const ContactEditor = () => {
  const { contact, setContact } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<ContactData>(() => JSON.parse(JSON.stringify(contact)));
  const [saving, setSaving] = useState(false);

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

  const update = (field: keyof ContactData, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Section Text</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <BilingualField label="Section Title" value={draft.sectionTitle} onChange={(v) => update("sectionTitle", v)} maxLength={80} />
          <BilingualField label="Section Description" value={draft.sectionDescription} onChange={(v) => update("sectionDescription", v)} maxLength={300} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Form Labels</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <BilingualField label="Email Field Label" value={draft.emailLabel} onChange={(v) => update("emailLabel", v)} maxLength={60} />
          <BilingualField label="Organization Field Label" value={draft.organizationLabel} onChange={(v) => update("organizationLabel", v)} maxLength={60} />
          <BilingualField label="Country Field Label" value={draft.countryLabel} onChange={(v) => update("countryLabel", v)} maxLength={60} />
          <BilingualField label="Message Field Label" value={draft.messageLabel} onChange={(v) => update("messageLabel", v)} maxLength={100} />
          <BilingualField label="Button Text" value={draft.buttonText} onChange={(v) => update("buttonText", v)} maxLength={40} />
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
        <CardContent className="space-y-6">
          <BilingualField label="Auto-Reply Subject" value={draft.autoReplySubject} onChange={(v) => update("autoReplySubject", v)} maxLength={200} />
          <BilingualField label="Auto-Reply Message" value={draft.autoReplyMessage} onChange={(v) => update("autoReplyMessage", v)} maxLength={2000} multiline rows={4} />
          <p className="text-xs text-muted-foreground">This message will be sent automatically to the user after they submit the contact form.</p>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Contact"}
      </Button>
    </div>
  );
};

export default ContactEditor;
