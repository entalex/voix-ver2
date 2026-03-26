import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ka";

export interface BiText {
  en: string;
  ka: string;
}

/** Create a bilingual text object, defaulting ka to en if not provided */
export const bi = (en: string, ka?: string): BiText => ({ en, ka: ka ?? en });

/** Extract text for a given language from a BiText or plain string */
export const t = (text: BiText | string | undefined, lang: Lang): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem("voix-lang");
    if (saved === "ka" || saved === "en") return saved;
  } catch {}
  return "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("voix-lang", l); } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "ka" : "en");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
