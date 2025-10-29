import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Euro, TrendingUp, Home, Settings } from 'lucide-react';
import { usePensionStore } from '../stores/pensionStore';

interface OnboardingQuestionsPageProps {
  onComplete: () => void;
}

export default function OnboardingQuestionsPage({ onComplete }: OnboardingQuestionsPageProps) {
  const {
    birthYear,
    maritalStatus,
    numberOfChildren,
    grossIncome,
    expectedStatutoryPension,
    vistaPensionMonthly,
    lifeInsuranceMonthly,
    fundSavingsPlanMonthly,
    hasMortgage,
    mortgageBalance,
    monthlyMortgagePayment,
    updatePersonalData,
    updateIncomeData,
    updatePensionData,
    updateAssetsData,
    completeOnboarding,
    isOnboardingComplete,
  } = usePensionStore();

  const [localBirthYear, setLocalBirthYear] = useState(birthYear || '');
  const [localMaritalStatus, setLocalMaritalStatus] = useState(maritalStatus || '');
  const [localChildren, setLocalChildren] = useState(numberOfChildren);
  const [localIncome, setLocalIncome] = useState(grossIncome);
  const [localStatutoryPension, setLocalStatutoryPension] = useState(expectedStatutoryPension);
  const [localVistaPension, setLocalVistaPension] = useState(vistaPensionMonthly);
  const [localLifeInsurance, setLocalLifeInsurance] = useState(lifeInsuranceMonthly);
  const [localFundSavings, setLocalFundSavings] = useState(fundSavingsPlanMonthly);
  const [localHasMortgage, setLocalHasMortgage] = useState(hasMortgage);
  const [localMortgageBalance, setLocalMortgageBalance] = useState(mortgageBalance);
  const [localMortgagePayment, setLocalMortgagePayment] = useState(monthlyMortgagePayment);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Auto-save on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localBirthYear) {
        updatePersonalData({ 
          birthYear: parseInt(localBirthYear.toString()), 
          maritalStatus: localMaritalStatus as any,
          numberOfChildren: localChildren 
        });
      }
      updateIncomeData({ grossIncome: localIncome });
      updatePensionData({ 
        expectedStatutoryPension: localStatutoryPension,
        vistaPensionMonthly: localVistaPension
      });
      updateAssetsData({ 
        lifeInsuranceMonthly: localLifeInsurance,
        fundSavingsPlanMonthly: localFundSavings,
        hasMortgage: localHasMortgage,
        mortgageBalance: localMortgageBalance,
        monthlyMortgagePayment: localMortgagePayment
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [
    localBirthYear,
    localMaritalStatus,
    localChildren,
    localIncome,
    localStatutoryPension,
    localVistaPension,
    localLifeInsurance,
    localFundSavings,
    localHasMortgage,
    localMortgageBalance,
    localMortgagePayment,
  ]);

  const validateAndSubmit = () => {
    const errors: string[] = [];
    
    const yearNum = typeof localBirthYear === 'string' ? parseInt(localBirthYear) : localBirthYear;
    if (!yearNum || yearNum < 1940 || yearNum > 2010) {
      errors.push('Bitte geben Sie ein gültiges Geburtsjahr ein (1940-2010)');
    }
    
    if (!localMaritalStatus) {
      errors.push('Bitte wählen Sie Ihren Familienstand');
    }

    if (localIncome <= 0) {
      errors.push('Bitte geben Sie Ihr Bruttoeinkommen ein');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    completeOnboarding();
    onComplete();
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6"
          >
            <Settings className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isOnboardingComplete ? 'Ihre Daten' : 'Willkommen'}
          </h1>
          <p className="text-gray-600">
            {isOnboardingComplete 
              ? 'Bearbeiten Sie Ihre Angaben für eine aktualisierte Analyse'
              : 'Beantworten Sie die folgenden Fragen für Ihre persönliche Rentenanalyse'}
          </p>
        </div>

        {/* Main Form - iPhone Style */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Personal Data Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Persönliche Daten</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geburtsjahr
                </label>
                <input
                  type="number"
                  value={localBirthYear}
                  onChange={(e) => setLocalBirthYear(e.target.value)}
                  placeholder="z.B. 1980"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Familienstand
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLocalMaritalStatus('single')}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      localMaritalStatus === 'single'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Ledig
                  </button>
                  <button
                    onClick={() => setLocalMaritalStatus('married')}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      localMaritalStatus === 'married'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Verheiratet
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anzahl Kinder
                </label>
                <input
                  type="number"
                  value={localChildren}
                  onChange={(e) => setLocalChildren(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Income Data Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Euro className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Einkommen</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bruttoeinkommen (jährlich)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={localIncome}
                  onChange={(e) => setLocalIncome(parseFloat(e.target.value) || 0)}
                  placeholder="z.B. 50000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
              </div>
            </div>
          </div>

          {/* Pension Data Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Rente & Versicherungen</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Erwartete gesetzliche Rente (monatlich)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={localStatutoryPension}
                    onChange={(e) => setLocalStatutoryPension(parseFloat(e.target.value) || 0)}
                    placeholder="z.B. 1500"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista Rente (monatlich)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={localVistaPension}
                    onChange={(e) => setLocalVistaPension(parseFloat(e.target.value) || 0)}
                    placeholder="z.B. 500"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lebensversicherung (monatlich)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={localLifeInsurance}
                    onChange={(e) => setLocalLifeInsurance(parseFloat(e.target.value) || 0)}
                    placeholder="z.B. 200"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fondssparplan (monatlich)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={localFundSavings}
                    onChange={(e) => setLocalFundSavings(parseFloat(e.target.value) || 0)}
                    placeholder="z.B. 300"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mortgage Section */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Immobilie & Hypothek</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localHasMortgage}
                    onChange={(e) => setLocalHasMortgage(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Ich habe eine laufende Hypothek
                  </span>
                </label>
              </div>

              {localHasMortgage && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restschuld
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={localMortgageBalance}
                        onChange={(e) => setLocalMortgageBalance(parseFloat(e.target.value) || 0)}
                        placeholder="z.B. 150000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monatliche Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={localMortgagePayment}
                        onChange={(e) => setLocalMortgagePayment(parseFloat(e.target.value) || 0)}
                        placeholder="z.B. 800"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-600">
                  • {error}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={validateAndSubmit}
          className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          {isOnboardingComplete ? 'Änderungen speichern' : 'Zur Analyse'}
        </motion.button>

        {/* Auto-save indicator */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Ihre Eingaben werden automatisch gespeichert
        </p>
      </motion.div>
    </div>
  );
}
