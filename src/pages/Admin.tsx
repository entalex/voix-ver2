import { useState, useRef } from "react";
import { useLandingData, HeroData } from "@/context/LandingDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Plus, Trash2, LogOut, Upload, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeaturesEditor from "@/components/admin/FeaturesEditor";
import WhyVoixEditor from "@/components/admin/WhyVoixEditor";
import UseCasesEditor from "@/components/admin/UseCasesEditor";
import ContactEditor from "@/components/admin/ContactEditor";
import FooterEditor from "@/components/admin/FooterEditor";
import { supabase } from "@/integrations/supabase/client";

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
  const { teamSection, setTeamSection } = useLandingData();
  const { toast } = useToast();
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(teamSection.barText);
  const [savingDescription, setSavingDescription] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement | null>(null);

  const save = async () => {
    setSavingDescription(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "team_description", value: descriptionDraft }, { onConflict: "key" });
      if (error) throw error;
      setTeamSection({ ...teamSection, barText: descriptionDraft });
      toast({ title: "Team section updated!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Save failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setSavingDescription(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    setUploadingBanner(true);
    try {
      const ext = file.name.split(".").pop();
      const storagePath = `team-banner/banner.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("voix-images")
        .upload(storagePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("voix-images").getPublicUrl(storagePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      // Persist to database so it survives page refresh
      const { error: dbError } = await supabase
        .from("site_settings")
        .upsert({ key: "team_banner_url", value: publicUrl }, { onConflict: "key" });
      if (dbError) throw dbError;

      setTeamSection({ ...teamSection, bannerImageUrl: publicUrl });
      toast({ title: "Team banner uploaded!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Upload failed", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Banner Upload */}
      <Card>
        <CardHeader><CardTitle>Team Banner Image</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {teamSection.bannerImageUrl ? (
            <img
              src={teamSection.bannerImageUrl}
              alt="Team Banner Preview"
              className="w-full aspect-[3/1] object-cover rounded-lg border"
            />
          ) : (
            <div className="w-full aspect-[3/1] rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
              No banner uploaded yet
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => bannerFileRef.current?.click()}
            disabled={uploadingBanner}
          >
            {uploadingBanner ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" /> Upload Banner Image</>
            )}
          </Button>
          <input
            ref={bannerFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleBannerUpload(file);
            }}
          />
          <p className="text-xs text-muted-foreground">Recommended: wide landscape image (3:1 ratio)</p>
        </CardContent>
      </Card>

      {/* Team Description */}
      <Card>
        <CardHeader><CardTitle>Team Description / Mission Text</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={descriptionDraft}
            onChange={(e) => setDescriptionDraft(e.target.value)}
            rows={5}
            maxLength={500}
            placeholder="Our mission is to empower teams with voice intelligence."
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground">This text appears in the bar below the team banner image.</p>
        </CardContent>
      </Card>

      {/* Save */}
      <Button onClick={save} disabled={savingDescription} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
        {savingDescription ? "Saving..." : "Save Team"}
      </Button>
    </div>
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
          <TabsList className="mb-6 w-full justify-start flex-wrap">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="why-voix">Why VOIX</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
             <TabsTrigger value="footer">Footer</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>
            <TabsContent value="hero"><HeroEditor /></TabsContent>
            <TabsContent value="why-voix"><WhyVoixEditor /></TabsContent>
            <TabsContent value="features"><FeaturesEditor /></TabsContent>
            <TabsContent value="team"><TeamEditor /></TabsContent>
            <TabsContent value="use-cases"><UseCasesEditor /></TabsContent>
            <TabsContent value="footer"><FooterEditor /></TabsContent>
            <TabsContent value="contact"><ContactEditor /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
