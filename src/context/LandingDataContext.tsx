import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  features as defaultFeatures,
  teamMembers as defaultTeamMembers,
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
  // TODO: Add `photoUrl` field here when connecting to Supabase storage for photo uploads
}

interface LandingDataState {
  hero: HeroData;
  features: FeatureItem[];
  teamMembers: TeamMember[];
  setHero: (hero: HeroData) => void;
  setFeatures: (features: FeatureItem[]) => void;
  setTeamMembers: (members: TeamMember[]) => void;
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

  // TODO: Replace useState with Supabase realtime subscription for persistent storage
  // e.g. useEffect(() => { supabase.from('landing_config').select('*')... }, [])

  return (
    <LandingDataContext.Provider value={{ hero, features, teamMembers, setHero, setFeatures, setTeamMembers }}>
      {children}
    </LandingDataContext.Provider>
  );
};

export const useLandingData = () => {
  const ctx = useContext(LandingDataContext);
  if (!ctx) throw new Error("useLandingData must be used within LandingDataProvider");
  return ctx;
};
