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
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import Questions from "@/pages/questions";
import TaxCalculatorPage from "@/pages/TaxCalculatorPage";
import NotFound from "@/pages/not-found";
import OnboardingContainer from "@/components/onboarding/OnboardingContainer";

// Get base path from environment (matches vite.config.ts)
const base = import.meta.env.BASE_URL;

// Lazy load legal pages for better performance
const Impressum = lazy(() => import("@/pages/impressum"));
const Datenschutz = lazy(() => import("@/pages/datenschutz"));
const AGB = lazy(() => import("@/pages/agb"));

// Loading component for legal pages
const LegalPageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8">
    <div className="container mx-auto px-4 max-w-4xl">
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Seite wird geladen...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

function Router() {
  return (
    <WouterRouter base={base}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/calculator" component={Home} />
        <Route path="/questions" component={Questions} />
        <Route path="/tax-calculator" component={TaxCalculatorPage} />
        <Route path="/impressum">
          <Suspense fallback={<LegalPageLoader />}>
            <Impressum />
          </Suspense>
        </Route>
        <Route path="/datenschutz">
          <Suspense fallback={<LegalPageLoader />}>
            <Datenschutz />
          </Suspense>
        </Route>
        <Route path="/agb">
          <Suspense fallback={<LegalPageLoader />}>
            <AGB />
          </Suspense>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {

  return (
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
  )
}

export default App;
