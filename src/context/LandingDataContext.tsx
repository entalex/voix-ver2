import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  features as defaultFeatures,
  teamMembers as defaultTeamMembers,
  teamSection as defaultTeamSection,
} from "@/data/landingData";
import { supabase } from "@/integrations/supabase/client";

// --- Types ---

export interface HeroData {
  headline: string;
  subheadline: string;
  buttonText: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  imageLabel: string;
  imageUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export interface TeamSectionData {
  heading: string;
  bannerLabel: string;
  barText: string;
  bannerImageUrl?: string;
}

interface LandingDataState {
  hero: HeroData;
  features: FeatureItem[];
  teamMembers: TeamMember[];
  teamSection: TeamSectionData;
  setHero: (hero: HeroData) => void;
  setFeatures: (features: FeatureItem[]) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setTeamSection: (data: TeamSectionData) => void;
}

const defaultHero: HeroData = {
  headline: "Unlock the Power of Voice AI",
  subheadline:
    "The objective in-person monitoring system. Capture interactions, audit performance, and uncover the unbiased truth.",
  buttonText: "Request Demo",
};

const LandingDataContext = createContext<LandingDataState | undefined>(undefined);

export const LandingDataProvider = ({ children }: { children: ReactNode }) => {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [features, setFeatures] = useState<FeatureItem[]>(
    defaultFeatures.map(({ title, description, imageLabel }) => ({ title, description, imageLabel }))
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [teamSection, setTeamSectionState] = useState<TeamSectionData>(defaultTeamSection);

  // Load persisted settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["team_banner_url"]);
      if (data) {
        const bannerRow = data.find((r) => r.key === "team_banner_url");
        if (bannerRow?.value) {
          setTeamSectionState((prev) => ({ ...prev, bannerImageUrl: bannerRow.value ?? undefined }));
        }
      }
    };
    loadSettings();
  }, []);

  const setTeamSection = (data: TeamSectionData) => {
    setTeamSectionState(data);
  };

  return (
    <LandingDataContext.Provider value={{ hero, features, teamMembers, teamSection, setHero, setFeatures, setTeamMembers, setTeamSection }}>
      {children}
    </LandingDataContext.Provider>
  );
};

export const useLandingData = () => {
  const ctx = useContext(LandingDataContext);
  if (!ctx) throw new Error("useLandingData must be used within LandingDataProvider");
  return ctx;
};
