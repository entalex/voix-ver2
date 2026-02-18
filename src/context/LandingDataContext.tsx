import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  features as defaultFeatures,
  teamMembers as defaultTeamMembers,
  teamSection as defaultTeamSection,
} from "@/data/landingData";

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
  imageUrl?: string; // Local blob URL for now; TODO: Replace with Supabase Storage URL
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
  const [teamSection, setTeamSection] = useState<TeamSectionData>(defaultTeamSection);

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
