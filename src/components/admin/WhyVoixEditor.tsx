import { useState } from "react";
import { useLandingData, WhyVoixData } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ICON_OPTIONS = [
  "Zap", "Lock", "TrendingUp", "Shield", "Eye", "Mic", "BarChart3",
  "Search", "FileText", "Upload", "Store", "HeartPulse", "GraduationCap", "Building2",
];

const WhyVoixEditor = () => {
  const { whyVoix, setWhyVoix } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<WhyVoixData>(() => JSON.parse(JSON.stringify(whyVoix)));
  const [saving, setSaving] = useState(false);

  const updateCard = (index: number, field: string, value: string) => {
    setDraft((prev) => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, cards };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "why_voix", value: JSON.stringify(draft) }, { onConflict: "key" });
      if (error) throw error;
      setWhyVoix(draft);
      toast({ title: "Why VOIX section updated!" });
    } catch (err) {
      toast({ title: "Save failed", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Section Header</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Section Title</Label>
            <Input value={draft.sectionTitle} onChange={(e) => setDraft((p) => ({ ...p, sectionTitle: e.target.value }))} maxLength={80} className="mt-1" />
          </div>
          <div>
            <Label>Section Subtitle</Label>
            <Textarea value={draft.sectionSubtitle} onChange={(e) => setDraft((p) => ({ ...p, sectionSubtitle: e.target.value }))} maxLength={200} rows={2} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {draft.cards.map((card, i) => (
        <Card key={i}>
          <CardHeader><CardTitle>Card {i + 1}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Icon</Label>
              <Select value={card.iconName} onValueChange={(v) => updateCard(i, "iconName", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={card.title} onChange={(e) => updateCard(i, "title", e.target.value)} maxLength={60} className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={card.description} onChange={(e) => updateCard(i, "description", e.target.value)} maxLength={200} rows={3} className="mt-1" />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={save} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Why VOIX"}
      </Button>
    </div>
  );
};

export default WhyVoixEditor;
