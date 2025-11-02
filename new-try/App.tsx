import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingQuestionsPage from './pages/OnboardingQuestionsPage';
import ComparisonPage from './pages/ComparisonPage';
import DashboardPage from './pages/DashboardPage';
import ProductSelectionPage from './pages/ProductSelectionPage';
import InsuranceConfigurationPage from './pages/InsuranceConfigurationPage';
import { usePensionStore } from './stores/pensionStore';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

type Page = 'onboarding' | 'dashboard' | 'comparison' | 'insurance' | 'insuranceConfig';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('onboarding');
  const { isOnboardingComplete } = usePensionStore();
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode
    ? 'bg-gray-900'
    : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50';

  const navBg = isDarkMode
    ? 'bg-gray-800/95 border-gray-700'
    : 'bg-white/80 border-blue-100';

  const navText = isDarkMode ? 'text-gray-200' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {/* Navigation */}
      {isOnboardingComplete && (
        <nav className={`${navBg} backdrop-blur-sm border-b sticky top-0 z-50 transition-colors`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Rentenrechner Premium
              </motion.h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('comparison')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'comparison'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Vergleich & Analyse
                </button>
                <button
                  onClick={() => setCurrentPage('insurance')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'insurance'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Versicherungsprodukte
                </button>
                <button
                  onClick={() => setCurrentPage('onboarding')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'onboarding'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Daten bearbeiten
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Content with Page Transitions */}
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'onboarding' ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <OnboardingQuestionsPage onComplete={() => setCurrentPage('dashboard')} />
            </motion.div>
          ) : currentPage === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardPage />
            </motion.div>
          ) : currentPage === 'comparison' ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ComparisonPage />
            </motion.div>
          ) : currentPage === 'insurance' ? (
            <motion.div
              key="insurance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductSelectionPage
                onSelectProduct={() => setCurrentPage('insuranceConfig')}
              />
            </motion.div>
          ) : currentPage === 'insuranceConfig' ? (
            <motion.div
              key="insuranceConfig"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <InsuranceConfigurationPage
                onBack={() => setCurrentPage('insurance')}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
