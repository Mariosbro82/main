import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../../stores/onboardingStore';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  User,
  DollarSign,
  PieChart,
  Briefcase,
  TrendingUp,
  Home as HomeIcon,
  FileText,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';
import PersonalDataStep from './steps/PersonalDataStep';
import IncomeStep from './steps/IncomeStep';
import PensionsStep from './steps/PensionsStep';
import RetirementStep from './steps/RetirementStep';
import AssetsStep from './steps/AssetsStep';
import MortgageStep from './steps/MortgageStep';
import SummaryStep from './steps/SummaryStep';

interface PremiumOnboardingWizardProps {
  onClose?: () => void;
  language?: 'de' | 'en';
}

const PremiumOnboardingWizard: React.FC<PremiumOnboardingWizardProps> = ({
  onClose,
  language = 'de'
}) => {
  const {
    currentStep,
    nextStep,
    previousStep,
    completeOnboarding,
    initializeOnboarding,
    getCurrentStep,
    canProceed,
    getProgress,
    isLastStep,
    isFirstStep,
    getTotalSteps,
    isCompleted
  } = useOnboardingStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeOnboarding();
  }, [initializeOnboarding]);

  useEffect(() => {
    if (isCompleted && onClose) {
      setTimeout(() => onClose(), 1000);
    }
  }, [isCompleted, onClose]);

  const texts = {
    de: {
      title: 'Willkommen bei AltersvorsorgePlus',
      subtitle: 'Lassen Sie uns gemeinsam Ihre finanzielle Zukunft planen',
      next: 'Weiter',
      previous: 'Zurück',
      complete: 'Abschließen',
      skip: 'Überspringen',
      stepOf: 'Schritt',
      of: 'von',
    },
    en: {
      title: 'Welcome to RetirementPlus',
      subtitle: "Let's plan your financial future together",
      next: 'Next',
      previous: 'Back',
      complete: 'Complete',
      skip: 'Skip',
      stepOf: 'Step',
      of: 'of',
    },
  };

  const t = texts[language];

  const stepIcons = {
    personal: User,
    income: DollarSign,
    pensions: PieChart,
    retirement: Briefcase,
    assets: TrendingUp,
    mortgage: HomeIcon,
    summary: FileText,
  };

  const currentStepData = getCurrentStep();
  const progress = getProgress();
  const totalSteps = getTotalSteps();
  const StepIcon = stepIcons[currentStepData.id] || User;

  const handleNext = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      if (isLastStep()) {
        await completeOnboarding();
        onClose?.();
      } else {
        nextStep();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'personal':
        return <PersonalDataStep />;
      case 'income':
        return <IncomeStep />;
      case 'pensions':
        return <PensionsStep />;
      case 'retirement':
        return <RetirementStep />;
      case 'assets':
        return <AssetsStep />;
      case 'mortgage':
        return <MortgageStep />;
      case 'summary':
        return <SummaryStep />;
      default:
        return <PersonalDataStep />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-accent/20 shadow-soft-2xl border border-border/40"
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-border/30 bg-gradient-to-r from-primary/5 via-transparent to-success/5">
          <div className="p-8 pb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 rounded-2xl blur-lg opacity-50" />
                  <div className="relative bg-gradient-to-r from-primary to-primary-600 p-3 rounded-2xl shadow-soft-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground bg-clip-text text-transparent">
                    {t.title}
                  </h1>
                  <p className="text-muted-foreground mt-1">{t.subtitle}</p>
                </div>
              </div>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <StepIcon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{currentStepData.title}</span>
                </div>
                <span className="text-muted-foreground">
                  {t.stepOf} {steps.indexOf(currentStepData.id) + 1} {t.of} {totalSteps}
                </span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-2" />
                <motion.div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary via-primary-600 to-success rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.5)' }}
                />
              </div>
              {currentStepData.description && (
                <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-border/30 bg-card/80 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep() || isLoading}
              className="btn-premium-ghost"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t.previous}
            </Button>

            <div className="flex gap-2">
              {onClose && !isLastStep() && (
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t.skip}
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="btn-premium-primary min-w-[120px]"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : isLastStep() ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                {isLastStep() ? t.complete : t.next}
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-success/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      </motion.div>
    </div>
  );
};

const steps = ['personal', 'income', 'pensions', 'retirement', 'assets', 'mortgage', 'summary'];

export default PremiumOnboardingWizard;
