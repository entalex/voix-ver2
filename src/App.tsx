import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { LandingDataProvider } from "@/context/LandingDataContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SmoothScroll from "@/components/motion/SmoothScroll";

const queryClient = new QueryClient();

/** Applies font-georgian class to <body> when Georgian is active */
const GlobalFontSync = () => {
  const { lang } = useLanguage();
  useEffect(() => {
    document.body.classList.toggle("font-georgian", lang === "ka");
  }, [lang]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <LandingDataProvider>
            <GlobalFontSync />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SmoothScroll>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </SmoothScroll>
            </BrowserRouter>
          </LandingDataProvider>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
