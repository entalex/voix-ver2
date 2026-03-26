import { useState } from "react";
import { useLandingData, WhyVoixData } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import BilingualField from "./BilingualField";

const ICON_OPTIONS = [
  "Zap", "Lock", "TrendingUp", "Shield", "Eye", "Mic", "BarChart3",
  "Search", "FileText", "Upload", "Store", "HeartPulse", "GraduationCap", "Building2",
];

const WhyVoixEditor = () => {
  const { whyVoix, setWhyVoix } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<WhyVoixData>(() => JSON.parse(JSON.stringify(whyVoix)));
  const [saving, setSaving] = useState(false);

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
      console.error(err);
      toast({ title: "Save failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Section Header</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <BilingualField
            label="Section Title"
            value={draft.sectionTitle}
            onChange={(v) => setDraft((p) => ({ ...p, sectionTitle: v }))}
            maxLength={80}
          />
          <BilingualField
            label="Section Subtitle"
            value={draft.sectionSubtitle}
            onChange={(v) => setDraft((p) => ({ ...p, sectionSubtitle: v }))}
            maxLength={200}
            multiline
            rows={2}
          />
        </CardContent>
      </Card>

      {draft.cards.map((card, i) => (
        <Card key={i}>
          <CardHeader><CardTitle>Card {i + 1}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Icon</Label>
              <Select value={card.iconName} onValueChange={(v) => {
                setDraft((prev) => {
                  const cards = [...prev.cards];
                  cards[i] = { ...cards[i], iconName: v };
                  return { ...prev, cards };
                });
              }}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <BilingualField
              label="Title"
              value={card.title}
              onChange={(v) => {
                setDraft((prev) => {
                  const cards = [...prev.cards];
                  cards[i] = { ...cards[i], title: v };
                  return { ...prev, cards };
                });
              }}
              maxLength={60}
            />
            <BilingualField
              label="Description"
              value={card.description}
              onChange={(v) => {
                setDraft((prev) => {
                  const cards = [...prev.cards];
                  cards[i] = { ...cards[i], description: v };
                  return { ...prev, cards };
                });
              }}
              maxLength={200}
              multiline
              rows={3}
            />
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
