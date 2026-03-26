import { useState } from "react";
import { useLandingData, UseCaseCard } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import BilingualField from "./BilingualField";
import { t } from "@/context/LanguageContext";

const UseCasesEditor = () => {
  const { useCases, setUseCases } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<UseCaseCard[]>(() => JSON.parse(JSON.stringify(useCases)));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "use_cases", value: JSON.stringify(draft) }, { onConflict: "key" });
      if (error) throw error;
      setUseCases(draft);
      toast({ title: "Use Cases section updated!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Save failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {draft.map((uc, i) => (
        <Card key={i}>
          <CardHeader><CardTitle>{t(uc.title, "en") || `Use Case ${i + 1}`}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <BilingualField
              label="Title"
              value={uc.title}
              onChange={(v) => {
                setDraft((prev) => {
                  const next = [...prev];
                  next[i] = { ...next[i], title: v };
                  return next;
                });
              }}
              maxLength={60}
            />
            <BilingualField
              label="Description"
              value={uc.description}
              onChange={(v) => {
                setDraft((prev) => {
                  const next = [...prev];
                  next[i] = { ...next[i], description: v };
                  return next;
                });
              }}
              maxLength={300}
              multiline
              rows={3}
            />
          </CardContent>
        </Card>
      ))}

      <Button onClick={save} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Use Cases"}
      </Button>
    </div>
  );
};

export default UseCasesEditor;
