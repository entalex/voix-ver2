import { useState } from "react";
import { useLandingData, HeroData, FeatureItem, TeamMember } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Hero Editor ---
const HeroEditor = () => {
  const { hero, setHero } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<HeroData>({ ...hero });

  const save = () => {
    // TODO: Replace with Supabase upsert: supabase.from('landing_config').upsert({ key: 'hero', value: draft })
    setHero(draft);
    toast({ title: "Hero section updated!" });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Headline</Label>
          <Input value={draft.headline} onChange={(e) => setDraft({ ...draft, headline: e.target.value })} maxLength={120} className="mt-1" />
        </div>
        <div>
          <Label>Subheadline</Label>
          <Textarea value={draft.subheadline} onChange={(e) => setDraft({ ...draft, subheadline: e.target.value })} maxLength={300} rows={3} className="mt-1" />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input value={draft.buttonText} onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })} maxLength={40} className="mt-1" />
        </div>
        {/* TODO: Add image upload input here — connect to Supabase Storage bucket */}
        <Button onClick={save} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Save Hero</Button>
      </CardContent>
    </Card>
  );
};

// --- Features Editor ---
const FeaturesEditor = () => {
  const { features, setFeatures } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<FeatureItem[]>(features.map((f) => ({ ...f })));

  const update = (index: number, field: keyof FeatureItem, value: string) => {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addFeature = () => {
    setDraft((prev) => [...prev, { title: "", description: "", imageLabel: "New Feature" }]);
  };

  const removeFeature = (index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    // TODO: Replace with Supabase batch upsert to 'features' table
    setFeatures(draft);
    toast({ title: "Features updated!" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Features (Zig-Zag)</CardTitle>
        <Button variant="outline" size="sm" onClick={addFeature}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {draft.map((feature, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-3 relative">
            <button onClick={() => removeFeature(i)} className="absolute top-3 right-3 text-destructive hover:text-destructive/80">
              <Trash2 className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-muted-foreground">Feature {i + 1}</span>
            <div>
              <Label>Title</Label>
              <Input value={feature.title} onChange={(e) => update(i, "title", e.target.value)} maxLength={80} className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={feature.description} onChange={(e) => update(i, "description", e.target.value)} maxLength={500} rows={3} className="mt-1" />
            </div>
            {/* TODO: Add image upload per feature — connect to Supabase Storage */}
            <div>
              <Label>Image Label (placeholder)</Label>
              <Input value={feature.imageLabel} onChange={(e) => update(i, "imageLabel", e.target.value)} maxLength={60} className="mt-1" />
            </div>
          </div>
        ))}
        <Button onClick={save} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Save Features</Button>
      </CardContent>
    </Card>
  );
};

// --- Team Editor ---
const TeamEditor = () => {
  const { teamMembers, setTeamMembers } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<TeamMember[]>(teamMembers.map((m) => ({ ...m })));

  const update = (index: number, field: keyof TeamMember, value: string) => {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addMember = () => {
    setDraft((prev) => [...prev, { name: "", role: "", initials: "" }]);
  };

  const removeMember = (index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    // TODO: Replace with Supabase batch upsert to 'team_members' table
    // TODO: Include photo upload to Supabase Storage bucket
    setTeamMembers(draft);
    toast({ title: "Team updated!" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        <Button variant="outline" size="sm" onClick={addMember}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {draft.map((member, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-3 relative">
            <button onClick={() => removeMember(i)} className="absolute top-3 right-3 text-destructive hover:text-destructive/80">
              <Trash2 className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-muted-foreground">Member {i + 1}</span>
            <div>
              <Label>Name</Label>
              <Input value={member.name} onChange={(e) => update(i, "name", e.target.value)} maxLength={80} className="mt-1" />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={member.role} onChange={(e) => update(i, "role", e.target.value)} maxLength={80} className="mt-1" />
            </div>
            <div>
              <Label>Initials</Label>
              <Input value={member.initials} onChange={(e) => update(i, "initials", e.target.value)} maxLength={3} className="mt-1" />
            </div>
            {/* TODO: Add photo upload input — connect to Supabase Storage bucket */}
          </div>
        ))}
        <Button onClick={save} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Save Team</Button>
      </CardContent>
    </Card>
  );
};

// --- Admin Page ---
const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">VOIX Admin Dashboard</h1>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Tabs defaultValue="hero">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="hero"><HeroEditor /></TabsContent>
          <TabsContent value="features"><FeaturesEditor /></TabsContent>
          <TabsContent value="team"><TeamEditor /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
