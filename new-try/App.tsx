import { useState } from 'react';
import OnboardingQuestionsPage from './pages/OnboardingQuestionsPage';
import ComparisonPage from './pages/ComparisonPage';
import { usePensionStore } from './stores/pensionStore';

function App() {
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'comparison'>('onboarding');
  const { isOnboardingComplete } = usePensionStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      {isOnboardingComplete && (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Rentenrechner
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage('onboarding')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'onboarding'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Daten bearbeiten
                </button>
                <button
                  onClick={() => setCurrentPage('comparison')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'comparison'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Vergleich & Analyse
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Content */}
      <main>
        {currentPage === 'onboarding' ? (
          <OnboardingQuestionsPage onComplete={() => setCurrentPage('comparison')} />
        ) : (
          <ComparisonPage />
        )}
      </main>
    </div>
  );
}

export default App;
