import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  features as defaultFeatures,
  teamMembers as defaultTeamMembers,
  teamSection as defaultTeamSection,
  whyVoix as defaultWhyVoix,
  useCases as defaultUseCases,
} from "@/data/landingData";
import { supabase } from "@/integrations/supabase/client";
import { BiText, bi } from "@/context/LanguageContext";

// --- Types ---

export interface HeroData {
  headline: BiText;
  subheadline: BiText;
  buttonText: BiText;
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
  heading: BiText;
  bannerLabel: string;
  barText: BiText;
  bannerImageUrl?: string;
}

export interface WhyVoixCard {
  iconName: string;
  title: BiText;
  description: BiText;
}

export interface WhyVoixData {
  sectionTitle: BiText;
  sectionSubtitle: BiText;
  cards: WhyVoixCard[];
}

export interface UseCaseCard {
  title: BiText;
  description: BiText;
}

export interface FooterData {
  copyrightText: BiText;
}

export interface ContactData {
  sectionTitle: BiText;
  sectionDescription: BiText;
  emailLabel: BiText;
  organizationLabel: BiText;
  countryLabel: BiText;
  messageLabel: BiText;
  buttonText: BiText;
  recipientEmail: string;
  autoReplySubject: BiText;
  autoReplyMessage: BiText;
}

export interface HowItWorksData {
  sectionTitle: BiText;
  sectionSubtitle: BiText;
  steps: { title: BiText; description: BiText }[];
}

export interface CTAData {
  headline: BiText;
  description: BiText;
  buttonText: BiText;
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
  howItWorks: HowItWorksData;
  cta: CTAData;
  setHero: (hero: HeroData) => void;
  setFeatures: (features: FeatureItem[]) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setTeamSection: (data: TeamSectionData) => void;
  setWhyVoix: (data: WhyVoixData) => void;
  setUseCases: (data: UseCaseCard[]) => void;
  setFooter: (data: FooterData) => void;
  setContact: (data: ContactData) => void;
  setHowItWorks: (data: HowItWorksData) => void;
  setCta: (data: CTAData) => void;
}

/** Helper to migrate plain strings to BiText on load */
const ensureBi = (val: any): BiText => {
  if (!val) return bi("");
  if (typeof val === "string") return bi(val);
  if (typeof val === "object" && ("en" in val || "ka" in val))
    return { en: val.en || "", ka: val.ka || "" };
  return bi(String(val));
};

const defaultHero: HeroData = {
  headline: bi("Unlock the Power of Voice AI"),
  subheadline: bi("The objective in-person monitoring system. Capture interactions, audit performance, and uncover the unbiased truth."),
  buttonText: bi("Request Demo"),
};

const defaultWhyVoixData: WhyVoixData = {
  sectionTitle: bi("Why VOIX?"),
  sectionSubtitle: bi("Built for teams that demand objectivity, speed, and security."),
  cards: defaultWhyVoix.map((item) => ({
    iconName: item.icon.displayName || item.title,
    title: bi(item.title),
    description: bi(item.description),
  })),
};

const defaultUseCasesData: UseCaseCard[] = defaultUseCases.map((uc) => ({
  title: bi(uc.title),
  description: bi(uc.description),
}));

const defaultFooterData: FooterData = {
  copyrightText: bi("© 2026 VOIX. All rights reserved."),
};

const defaultContactData: ContactData = {
  sectionTitle: bi("Contact Us"),
  sectionDescription: bi(""),
  emailLabel: bi("Your Email"),
  organizationLabel: bi("Organization Name"),
  countryLabel: bi("Country"),
  messageLabel: bi("What information you want to share with us?"),
  buttonText: bi("Send"),
  recipientEmail: "",
  autoReplySubject: bi("Thank you for contacting us!"),
  autoReplyMessage: bi("We have received your message and will get back to you shortly."),
};

const defaultHowItWorksData: HowItWorksData = {
  sectionTitle: bi("How It Works"),
  sectionSubtitle: bi("Get started in three simple steps."),
  steps: [
    { title: bi("Capture"), description: bi("Deploy VOIX in your environment to passively capture voice interactions.") },
    { title: bi("Analyze"), description: bi("Our AI engine transcribes, scores, and surfaces actionable insights automatically.") },
    { title: bi("Act"), description: bi("Review dashboards, coach your team, and drive measurable performance improvements.") },
  ],
};

const defaultCTAData: CTAData = {
  headline: bi("Ready to Transform Your Operations?"),
  description: bi("Join leading organizations using VOIX to unlock objective, data-driven insights from every interaction."),
  buttonText: bi("Request Demo"),
};

const defaultTeamSectionData: TeamSectionData = {
  heading: bi(defaultTeamSection.heading),
  bannerLabel: defaultTeamSection.bannerLabel,
  barText: bi(defaultTeamSection.barText),
};

const LandingDataContext = createContext<LandingDataState | undefined>(undefined);

export const LandingDataProvider = ({ children }: { children: ReactNode }) => {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [features, setFeatures] = useState<FeatureItem[]>(
    defaultFeatures.map(({ title, description, imageLabel }) => ({ title, description, imageLabel }))
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [teamSection, setTeamSectionState] = useState<TeamSectionData>(defaultTeamSectionData);
  const [whyVoix, setWhyVoix] = useState<WhyVoixData>(defaultWhyVoixData);
  const [useCases, setUseCases] = useState<UseCaseCard[]>(defaultUseCasesData);
  const [footer, setFooter] = useState<FooterData>(defaultFooterData);
  const [contact, setContact] = useState<ContactData>(defaultContactData);
  const [howItWorks, setHowItWorks] = useState<HowItWorksData>(defaultHowItWorksData);
  const [cta, setCta] = useState<CTAData>(defaultCTAData);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "hero", "team_banner_url", "team_description", "team_heading",
          "why_voix", "use_cases", "footer", "contact",
          "how_it_works", "cta",
        ]);
      if (data) {
        const get = (k: string) => data.find((r) => r.key === k);
        const heroRow = get("hero");
        const bannerRow = get("team_banner_url");
        const descRow = get("team_description");
        const headingRow = get("team_heading");
        const whyRow = get("why_voix");
        const ucRow = get("use_cases");
        const footerRow = get("footer");
        const contactRow = get("contact");
        const hiwRow = get("how_it_works");
        const ctaRow = get("cta");

        if (heroRow?.value) {
          try {
            const parsed = JSON.parse(heroRow.value);
            setHero({
              headline: ensureBi(parsed.headline),
              subheadline: ensureBi(parsed.subheadline),
              buttonText: ensureBi(parsed.buttonText),
            });
          } catch {}
        }

        setTeamSectionState((prev) => ({
          ...prev,
          bannerImageUrl: bannerRow?.value ?? prev.bannerImageUrl,
          barText: descRow?.value ? ensureBi((() => { try { return JSON.parse(descRow.value!); } catch { return descRow.value; } })()) : prev.barText,
          heading: headingRow?.value ? ensureBi((() => { try { return JSON.parse(headingRow.value!); } catch { return headingRow.value; } })()) : prev.heading,
        }));

        if (whyRow?.value) {
          try {
            const parsed = JSON.parse(whyRow.value);
            setWhyVoix({
              sectionTitle: ensureBi(parsed.sectionTitle),
              sectionSubtitle: ensureBi(parsed.sectionSubtitle),
              cards: (parsed.cards || []).map((c: any) => ({
                iconName: c.iconName,
                title: ensureBi(c.title),
                description: ensureBi(c.description),
              })),
            });
          } catch {}
        }
        if (ucRow?.value) {
          try {
            const parsed = JSON.parse(ucRow.value);
            setUseCases(parsed.map((uc: any) => ({
              title: ensureBi(uc.title),
              description: ensureBi(uc.description),
            })));
          } catch {}
        }
        if (footerRow?.value) {
          try {
            const parsed = JSON.parse(footerRow.value);
            setFooter({ copyrightText: ensureBi(parsed.copyrightText ?? parsed) });
          } catch {}
        }
        if (contactRow?.value) {
          try {
            const parsed = JSON.parse(contactRow.value);
            setContact({
              sectionTitle: ensureBi(parsed.sectionTitle),
              sectionDescription: ensureBi(parsed.sectionDescription),
              emailLabel: ensureBi(parsed.emailLabel),
              organizationLabel: ensureBi(parsed.organizationLabel),
              countryLabel: ensureBi(parsed.countryLabel),
              messageLabel: ensureBi(parsed.messageLabel),
              buttonText: ensureBi(parsed.buttonText),
              recipientEmail: parsed.recipientEmail || "",
              autoReplySubject: ensureBi(parsed.autoReplySubject),
              autoReplyMessage: ensureBi(parsed.autoReplyMessage),
            });
          } catch {}
        }
        if (hiwRow?.value) {
          try { setHowItWorks(JSON.parse(hiwRow.value)); } catch {}
        }
        if (ctaRow?.value) {
          try { setCta(JSON.parse(ctaRow.value)); } catch {}
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
        hero, features, teamMembers, teamSection, whyVoix, useCases, footer, contact, howItWorks, cta,
        setHero, setFeatures, setTeamMembers, setTeamSection, setWhyVoix, setUseCases, setFooter, setContact, setHowItWorks, setCta,
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
