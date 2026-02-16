import { useState } from "react";
import { useLandingData, HeroData, TeamMember } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Plus, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeaturesEditor from "@/components/admin/FeaturesEditor";

// --- Hero Editor ---
const HeroEditor = () => {
  const { hero, setHero } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<HeroData>(() => ({ ...hero }));

  const save = () => {
    setHero(draft);
    toast({ title: "Hero section updated!" });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Headline</Label>
          <Input value={draft.headline} onChange={(e) => setDraft((prev) => ({ ...prev, headline: e.target.value }))} maxLength={120} className="mt-1" />
        </div>
        <div>
          <Label>Subheadline</Label>
          <Textarea value={draft.subheadline} onChange={(e) => setDraft((prev) => ({ ...prev, subheadline: e.target.value }))} maxLength={300} rows={3} className="mt-1" />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input value={draft.buttonText} onChange={(e) => setDraft((prev) => ({ ...prev, buttonText: e.target.value }))} maxLength={40} className="mt-1" />
        </div>
        <Button onClick={save} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Save Hero</Button>
      </CardContent>
    </Card>
  );
};

// --- Team Editor ---
const TeamEditor = () => {
  const { teamMembers, setTeamMembers } = useLandingData();
  const { toast } = useToast();
  const [draft, setDraft] = useState<TeamMember[]>(() => teamMembers.map((m) => ({ ...m })));

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
    setTeamMembers([...draft]);
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
            <button type="button" onClick={() => removeMember(i)} className="absolute top-3 right-3 text-destructive hover:text-destructive/80">
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
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1">VOIX Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/10 gap-1">
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
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
