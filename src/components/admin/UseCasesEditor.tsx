import { useState } from "react";
import { useLandingData, UseCaseCard } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const UseCasesEditor = () => {
  const { useCases, setUseCases } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<UseCaseCard[]>(() => JSON.parse(JSON.stringify(useCases)));
  const [saving, setSaving] = useState(false);

  const update = (index: number, field: keyof UseCaseCard, value: string) => {
    setDraft((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

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
          <CardHeader><CardTitle>{uc.title || `Use Case ${i + 1}`}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={uc.title} onChange={(e) => update(i, "title", e.target.value)} maxLength={60} className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={uc.description} onChange={(e) => update(i, "description", e.target.value)} maxLength={300} rows={3} className="mt-1" />
            </div>
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
