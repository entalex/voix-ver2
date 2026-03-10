import { useState } from "react";
import { useLandingData, FooterData } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const FooterEditor = () => {
  const { footer, setFooter } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<FooterData>(() => ({ ...footer }));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "footer", value: JSON.stringify(draft) }, { onConflict: "key" });
      if (error) throw error;
      setFooter(draft);
      toast({ title: "Footer updated!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Save failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Footer</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Copyright Text</Label>
          <Input value={draft.copyrightText} onChange={(e) => setDraft({ copyrightText: e.target.value })} maxLength={120} className="mt-1" />
        </div>
        <Button onClick={save} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Footer"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FooterEditor;
