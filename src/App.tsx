import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Suspense, lazy } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import OnboardingContainer from "@/components/onboarding/OnboardingContainer";
import ErrorBoundary from "@/components/ErrorBoundary";

// Get base path from environment (matches vite.config.ts)
const base = import.meta.env.BASE_URL;

// Lazy load ALL pages for optimal performance and code splitting
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Home = lazy(() => import("@/pages/home"));
const Questions = lazy(() => import("@/pages/questions"));
const TaxCalculatorPage = lazy(() => import("@/pages/TaxCalculatorPage"));
const Impressum = lazy(() => import("@/pages/impressum"));
const Datenschutz = lazy(() => import("@/pages/datenschutz"));
const AGB = lazy(() => import("@/pages/agb"));

// Professional loading component for all pages
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 font-medium">Lädt...</p>
    </div>
  </div>
);

function Router() {
  return (
    <WouterRouter base={base}>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/calculator" component={Dashboard} />
          <Route path="/fonds">
            <Home initialTab="funds" />
          </Route>
          <Route path="/vergleich">
            <Home initialTab="comparison" />
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

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OnboardingContainer>
            <div className="min-h-screen flex flex-col">
              <Toaster />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <CookieBanner />
          </OnboardingContainer>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App;
