import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import PremiumLayout from "@/components/PremiumLayout";
import { Suspense, lazy, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import OnboardingContainer from "@/components/onboarding/OnboardingContainer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { motion } from "framer-motion";

// Get base path from environment (matches vite.config.ts)
// For GitHub Pages, this will be "/german-pension-calculator/" in production, "/" in development
const base = import.meta.env.BASE_URL;

/**
 * Custom location hook for GitHub Pages subdirectory deployment.
 *
 * This hook enables clean URLs (without hash routing) for subdirectory deployments
 * by normalizing paths between the browser and Wouter router:
 * - Strips the base path (/app/) from browser URLs for route matching
 * - Adds the base path back when navigating to maintain correct URLs
 *
 * Example: Browser sees "/app/calculator" → Router matches "/calculator"
 */
const useGitHubPagesLocation = (): [string, (to: string, options?: any) => void] => {
  const [loc, setLoc] = useState(() => {
    const path = window.location.pathname;
    // Remove base path from pathname for route matching
    // Handle edge cases: "/app/" -> "/", "/app/calculator" -> "/calculator", "/app" -> "/"
    if (base === "/" || base === "") return path;
    const normalizedBase = base.replace(/\/$/, ""); // "/app"
    if (path === normalizedBase || path === normalizedBase + "/") return "/";
    if (path.startsWith(normalizedBase + "/")) return path.slice(normalizedBase.length);
    return path;
  });

  useEffect(() => {
    const handler = () => {
      const path = window.location.pathname;
      // Apply same normalization logic
      if (base === "/" || base === "") {
        setLoc(path);
        return;
      }
      const normalizedBase = base.replace(/\/$/, "");
      if (path === normalizedBase || path === normalizedBase + "/") {
        setLoc("/");
      } else if (path.startsWith(normalizedBase + "/")) {
        setLoc(path.slice(normalizedBase.length));
      } else {
        setLoc(path);
      }
    };

    // Listen to popstate events (browser back/forward)
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = (to: string, options?: any) => {
    // Add base path back when navigating
    const fullPath = base !== "/" && base !== "" ? `${base.replace(/\/$/, "")}${to}` : to;

    if (options?.replace) {
      window.history.replaceState(null, "", fullPath);
    } else {
      window.history.pushState(null, "", fullPath);
    }

    setLoc(to);
  };

  return [loc, navigate];
};

// Lazy load ALL pages for optimal performance and code splitting
const PremiumDashboard = lazy(() => import("@/pages/PremiumDashboard"));
const PremiumCalculator = lazy(() => import("@/pages/PremiumCalculator"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Home = lazy(() => import("@/pages/home"));
const Questions = lazy(() => import("@/pages/questions"));
const TaxCalculatorPage = lazy(() => import("@/pages/TaxCalculatorPage"));
const Impressum = lazy(() => import("@/pages/impressum"));
const Datenschutz = lazy(() => import("@/pages/datenschutz"));
const AGB = lazy(() => import("@/pages/agb"));

// Premium loading component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-4"
      >
        <Loader2 className="h-12 w-12 text-primary" />
      </motion.div>
      <p className="text-muted-foreground font-medium">Lädt...</p>
    </motion.div>
  </div>
);

function Router({ language }: { language: 'de' | 'en' }) {
  return (
    <WouterRouter hook={useGitHubPagesLocation}>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/">
            <ErrorBoundary>
              <PremiumDashboard language={language} />
            </ErrorBoundary>
          </Route>
          <Route path="/calculator">
            <ErrorBoundary>
              <PremiumCalculator language={language} />
            </ErrorBoundary>
          </Route>
          <Route path="/fonds">
            <ErrorBoundary>
              <Home initialTab="funds" />
            </ErrorBoundary>
          </Route>
          <Route path="/fund-performance">
            <ErrorBoundary>
              <Home initialTab="fund-performance" />
            </ErrorBoundary>
          </Route>
          <Route path="/vergleich">
            <ErrorBoundary>
              <Home initialTab="comparison" />
            </ErrorBoundary>
          </Route>
          <Route path="/custom-comparison">
            <ErrorBoundary>
              <Home initialTab="custom-comparison" />
            </ErrorBoundary>
          </Route>
          <Route path="/questions" component={Questions} />
          <Route path="/tax-calculator" component={TaxCalculatorPage} />
          <Route path="/impressum" component={Impressum} />
          <Route path="/datenschutz" component={Datenschutz} />
          <Route path="/agb" component={AGB} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </WouterRouter>
  );
}

function App() {
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OnboardingContainer>
            <PremiumLayout language={language} onLanguageChange={setLanguage}>
              <Toaster />
              <Router language={language} />
              <CookieBanner />
            </PremiumLayout>
          </OnboardingContainer>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App;
