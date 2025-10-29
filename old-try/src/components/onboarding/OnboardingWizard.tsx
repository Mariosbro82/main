import React, { useEffect, useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Save, RotateCcw } from 'lucide-react';
import PersonalDataStep from './steps/PersonalDataStep';
import IncomeStep from './steps/IncomeStep';
import PensionsStep from './steps/PensionsStep';
import RetirementStep from './steps/RetirementStep';
import AssetsStep from './steps/AssetsStep';
import MortgageStep from './steps/MortgageStep';
import SummaryStep from './steps/SummaryStep';
import LoadingSpinner from '../ui/loading-spinner';
// Progress indicator removed - using custom progress bar instead
// import { ProgressIndicator } from '../ui/progress-indicator';

const OnboardingWizard: React.FC = () => {
  // Subscribe to specific store values to ensure re-renders
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const errors = useOnboardingStore((state) => state.errors);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const previousStep = useOnboardingStore((state) => state.previousStep);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const initializeOnboarding = useOnboardingStore((state) => state.initializeOnboarding);
  const getCurrentStep = useOnboardingStore((state) => state.getCurrentStep);
  const canProceed = useOnboardingStore((state) => state.canProceed);
  const getProgress = useOnboardingStore((state) => state.getProgress);
  const isLastStep = useOnboardingStore((state) => state.isLastStep);
  const isFirstStep = useOnboardingStore((state) => state.isFirstStep);
  const getTotalSteps = useOnboardingStore((state) => state.getTotalSteps);

  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  
  const totalSteps = getTotalSteps();
  
  // Define step data early so it can be used in calculations
  const stepData = [
    { id: 'personal', title: 'Persönlich', description: 'Grunddaten' },
    { id: 'income', title: 'Einkommen', description: 'Gehalt & Bonus' },
    { id: 'pensions', title: 'Renten', description: 'Bestehende Renten' },
    { id: 'retirement', title: 'Ruhestand', description: 'Rentenpläne' },
    { id: 'assets', title: 'Vermögen', description: 'Bestehende Assets' },
    { id: 'mortgage', title: 'Immobilien', description: 'Hypotheken' },
    { id: 'summary', title: 'Zusammenfassung', description: 'Übersicht' }
  ];

  useEffect(() => {
    initializeOnboarding();
  }, [initializeOnboarding]);

  // Recalculate these whenever currentStep changes
  const currentStepData = getCurrentStep();
  const progress = getProgress();
  
  // Calculate current step index from the step ID - this will update when currentStep changes
  const currentStepIndex = React.useMemo(() => {
    return stepData.findIndex(step => step.id === currentStepData.id);
  }, [currentStepData.id, stepData]);

  const handleNext = async () => {
    setIsTransitioning(true);
    setIsLoading(true);
    
    try {
      // Simulate validation/save delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (isLastStep()) {
        await completeOnboarding();
      } else {
        nextStep();
      }
      
      // Auto-save indication
      setAutoSaveStatus('saving');
      setTimeout(() => setAutoSaveStatus('saved'), 500);
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(null), 3000);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsTransitioning(false), 150);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Möchten Sie wirklich alle Daten zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        resetOnboarding();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = async () => {
    setIsTransitioning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      previousStep();
    } finally {
      setTimeout(() => setIsTransitioning(false), 150);
    }
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
        return <div>Unbekannter Schritt</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pension Calculator
              </h1>
              <p className="text-gray-600 mt-1">Ersteinrichtung Ihres Rentenplans</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Auto-save Status */}
              {autoSaveStatus && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  autoSaveStatus === 'saved' ? 'bg-green-100 text-green-700' :
                  autoSaveStatus === 'saving' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {autoSaveStatus === 'saving' && <LoadingSpinner size="sm" />}
                  {autoSaveStatus === 'saved' && <Save className="w-4 h-4" />}
                  {autoSaveStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                  <span>
                    {autoSaveStatus === 'saved' ? 'Gespeichert' :
                     autoSaveStatus === 'saving' ? 'Speichern...' :
                     'Fehler beim Speichern'}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                Zurücksetzen
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Step Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">
              Schritt {currentStepIndex + 1} von {totalSteps} • {stepData[currentStepIndex]?.title || 'Unbekannt'}
            </span>
            <span className="text-blue-600 font-semibold">
              {Math.round(progress)}% abgeschlossen
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 transition-all duration-300 ${
          isTransitioning ? 'opacity-75 scale-[0.98]' : 'opacity-100 scale-100'
        }`}>
          {/* Step Header */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            {currentStepData.description && (
              <p className="text-gray-600">
                {currentStepData.description}
              </p>
            )}
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Bitte korrigieren Sie folgende Fehler:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error: any, index: number) => (
                      <li key={index}>• {error.message || error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step Content with Loading Overlay */}
          <div className="mb-8 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <LoadingSpinner size="lg" text="Verarbeitung..." />
              </div>
            )}
            <div className={`transition-all duration-200 ${
              isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
            }`}>
              {renderStepContent()}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep() || isLoading}
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Zurück
            </button>

            <div className="flex items-center space-x-4">
              {/* Enhanced Step Dots */}
              <div className="flex space-x-3">
                {Array.from({ length: totalSteps }, (_, index) => {
                  return (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStepIndex
                        ? 'bg-blue-600 ring-4 ring-blue-200 scale-125'
                        : index < currentStepIndex
                        ? 'bg-green-500 scale-110'
                        : 'bg-gray-300'
                    }`}
                  />
                );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className={`flex items-center px-8 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105 disabled:transform-none ${
                  canProceed() && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200'
                    : 'bg-gray-400 cursor-not-allowed shadow-gray-200'
                }`}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : isLastStep() ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )}
                {isLoading ? 'Verarbeitung...' : isLastStep() ? 'Abschließen' : 'Weiter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>🔒 Ihre Daten werden lokal gespeichert</span>
              <span>💾 Automatisches Speichern aktiviert</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Benötigen Sie Hilfe?</span>
              <button className="text-blue-600 hover:text-blue-700 underline">
                Support kontaktieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;