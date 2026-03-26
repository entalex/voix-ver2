import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  features as defaultFeatures,
  teamMembers as defaultTeamMembers,
  teamSection as defaultTeamSection,
  whyVoix as defaultWhyVoix,
  useCases as defaultUseCases,
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

export interface WhyVoixCard {
  iconName: string;
  title: string;
  description: string;
}

export interface WhyVoixData {
  sectionTitle: string;
  sectionSubtitle: string;
  cards: WhyVoixCard[];
}

export interface UseCaseCard {
  title: string;
  description: string;
}

export interface FooterData {
  copyrightText: string;
}

export interface ContactData {
  sectionTitle: string;
  sectionDescription: string;
  emailLabel: string;
  organizationLabel: string;
  countryLabel: string;
  messageLabel: string;
  buttonText: string;
  recipientEmail: string;
  autoReplySubject: string;
  autoReplyMessage: string;
}

interface LandingDataState {
  hero: HeroData;
  features: FeatureItem[];
  teamMembers: TeamMember[];
  teamSection: TeamSectionData;
  whyVoix: WhyVoixData;
  useCases: UseCaseCard[];
  footer: FooterData;
  contact: ContactData;
  setHero: (hero: HeroData) => void;
  setFeatures: (features: FeatureItem[]) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setTeamSection: (data: TeamSectionData) => void;
  setWhyVoix: (data: WhyVoixData) => void;
  setUseCases: (data: UseCaseCard[]) => void;
  setFooter: (data: FooterData) => void;
  setContact: (data: ContactData) => void;
}

const defaultHero: HeroData = {
  headline: "Unlock the Power of Voice AI",
  subheadline:
    "The objective in-person monitoring system. Capture interactions, audit performance, and uncover the unbiased truth.",
  buttonText: "Request Demo",
};

const defaultWhyVoixData: WhyVoixData = {
  sectionTitle: "Why VOIX?",
  sectionSubtitle: "Built for teams that demand objectivity, speed, and security.",
  cards: defaultWhyVoix.map((item) => ({
    iconName: item.icon.displayName || item.title,
    title: item.title,
    description: item.description,
  })),
};

const defaultUseCasesData: UseCaseCard[] = defaultUseCases.map((uc) => ({
  title: uc.title,
  description: uc.description,
}));

const defaultFooterData: FooterData = {
  copyrightText: "© 2026 VOIX. All rights reserved.",
};

const defaultContactData: ContactData = {
  sectionTitle: "Contact Us",
  sectionDescription: "",
  emailLabel: "Your Email",
  organizationLabel: "Organization Name",
  countryLabel: "Country",
  messageLabel: "What information you want to share with us?",
  buttonText: "Send",
  recipientEmail: "",
  autoReplySubject: "Thank you for contacting us!",
  autoReplyMessage: "We have received your message and will get back to you shortly.",
};

const LandingDataContext = createContext<LandingDataState | undefined>(undefined);

export const LandingDataProvider = ({ children }: { children: ReactNode }) => {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [features, setFeatures] = useState<FeatureItem[]>(
    defaultFeatures.map(({ title, description, imageLabel }) => ({ title, description, imageLabel }))
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [teamSection, setTeamSectionState] = useState<TeamSectionData>(defaultTeamSection);
  const [whyVoix, setWhyVoix] = useState<WhyVoixData>(defaultWhyVoixData);
  const [useCases, setUseCases] = useState<UseCaseCard[]>(defaultUseCasesData);
  const [footer, setFooter] = useState<FooterData>(defaultFooterData);
  const [contact, setContact] = useState<ContactData>(defaultContactData);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "hero",
          "team_banner_url",
          "team_description",
          "why_voix",
          "use_cases",
          "footer",
          "contact",
        ]);
      if (data) {
        const heroRow = data.find((r) => r.key === "hero");
        const bannerRow = data.find((r) => r.key === "team_banner_url");
        const descRow = data.find((r) => r.key === "team_description");
        const whyRow = data.find((r) => r.key === "why_voix");
        const ucRow = data.find((r) => r.key === "use_cases");
        const footerRow = data.find((r) => r.key === "footer");
        const contactRow = data.find((r) => r.key === "contact");

        if (heroRow?.value) {
          try { setHero(JSON.parse(heroRow.value)); } catch {}
        }

        setTeamSectionState((prev) => ({
          ...prev,
          bannerImageUrl: bannerRow?.value ?? prev.bannerImageUrl,
          barText: descRow?.value ?? prev.barText,
        }));

        if (whyRow?.value) {
          try { setWhyVoix(JSON.parse(whyRow.value)); } catch {}
        }
        if (ucRow?.value) {
          try { setUseCases(JSON.parse(ucRow.value)); } catch {}
        }
        if (footerRow?.value) {
          try { setFooter(JSON.parse(footerRow.value)); } catch {}
        }
        if (contactRow?.value) {
          try { setContact(JSON.parse(contactRow.value)); } catch {}
        }
      }
    };
    loadSettings();
  }, []);

  const setTeamSection = (data: TeamSectionData) => {
    setTeamSectionState(data);
  };

  return (
    <LandingDataContext.Provider
      value={{
        hero, features, teamMembers, teamSection, whyVoix, useCases, footer, contact,
        setHero, setFeatures, setTeamMembers, setTeamSection, setWhyVoix, setUseCases, setFooter, setContact,
      }}
    >
      {children}
    </LandingDataContext.Provider>
  );
};

export const useLandingData = (): LandingDataState => {
  const ctx = useContext(LandingDataContext);
  if (!ctx) throw new Error("useLandingData must be used within LandingDataProvider");
  return ctx;
};
