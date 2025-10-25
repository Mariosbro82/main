import React, { useEffect, useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import OnboardingWizard from './OnboardingWizard';
import { Loader2 } from 'lucide-react';

interface OnboardingContainerProps {
  children: React.ReactNode;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ children }) => {
  const { isCompleted, loadFromStorage, completeOnboarding } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const loadTimeout = setTimeout(() => {
      console.warn('Loading timeout - skipping onboarding');
      setIsLoading(false);
      setShowOnboarding(false);
    }, 5000);

    // Load saved onboarding data on mount
    const loadData = async () => {
      try {
        await loadFromStorage();
        setShowOnboarding(!isCompleted);
      } catch (error) {
        console.error('Failed to load onboarding data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        // On error, skip onboarding to show the app
        setShowOnboarding(false);
      } finally {
        clearTimeout(loadTimeout);
        setIsLoading(false);
      }
    };

    loadData();

    return () => clearTimeout(loadTimeout);
  }, [loadFromStorage, isCompleted]);

  // Skip onboarding function for debugging
  const handleSkipOnboarding = () => {
    try {
      completeOnboarding();
      setShowOnboarding(false);
    } catch (err) {
      console.error('Failed to skip onboarding:', err);
      // Force skip even if completion fails
      setShowOnboarding(false);
    }
  };

  // Show loading spinner while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Lade Anwendung...</p>
          <button
            onClick={() => setIsLoading(false)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Laden überspringen
          </button>
        </div>
      </div>
    );
  }

  // Show error state with option to continue
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">Fehler beim Laden: {error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setShowOnboarding(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Trotzdem fortfahren
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding wizard if not completed
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleSkipOnboarding}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Überspringen
          </button>
        </div>
        <OnboardingWizard />
      </div>
    );
  }

  // Show main application
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default OnboardingContainer;