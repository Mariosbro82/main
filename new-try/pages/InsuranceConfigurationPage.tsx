import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ArrowLeft,
  Save,
  Info,
  DollarSign,
  TrendingUp,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/dashboard/ThemeToggle';
import GuaranteeCalculator from '../components/insurance/GuaranteeCalculator';
import CostTransparency from '../components/insurance/CostTransparency';
import InsuranceVsFundComparison from '../components/insurance/InsuranceVsFundComparison';
import { usePensionStore } from '../stores/pensionStore';
import {
  ALL_INSURANCE_PRODUCTS,
  ALLIANZ_PRODUCTS,
  AXA_PRODUCTS,
  GENERALI_PRODUCTS,
  ZURICH_PRODUCTS,
  CANADA_LIFE_PRODUCTS
} from '../data/insuranceProducts';
import type { InsuranceProduct } from '../types/insurance';

// Combine all products for lookup
const ALL_PRODUCTS: InsuranceProduct[] = [
  ...ALLIANZ_PRODUCTS,
  ...AXA_PRODUCTS,
  ...GENERALI_PRODUCTS,
  ...ZURICH_PRODUCTS,
  ...CANADA_LIFE_PRODUCTS
];

interface InsuranceConfigurationPageProps {
  productId?: string;
  onBack?: () => void;
}

export default function InsuranceConfigurationPage({ productId: propProductId, onBack }: InsuranceConfigurationPageProps) {
  const { isDarkMode } = useTheme();
  const {
    selectedInsuranceProductId,
    insuranceMonthlyContribution,
    insuranceContractDuration,
    updateInsuranceData,
    selectInsuranceProduct
  } = usePensionStore();

  // Use productId from props or store
  const activeProductId = propProductId || selectedInsuranceProductId;
  const product = ALL_PRODUCTS.find(p => p.id === activeProductId);

  // Local state for configuration
  const [monthlyContribution, setMonthlyContribution] = useState(insuranceMonthlyContribution);
  const [contractDuration, setContractDuration] = useState(insuranceContractDuration);

  // Section visibility toggles
  const [showCalculator, setShowCalculator] = useState(true);
  const [showCosts, setShowCosts] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Theme colors
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  // If no product selected, show selection prompt
  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen ${bgColor} transition-colors duration-300 p-8`}
      >
        <div className={`max-w-2xl mx-auto ${cardBg} rounded-lg shadow-lg border ${borderColor} p-12 text-center`}>
          <Shield className={`w-16 h-16 ${textSecondary} mx-auto mb-4`} />
          <h2 className={`text-2xl font-bold ${textColor} mb-2`}>
            Kein Produkt ausgewählt
          </h2>
          <p className={`${textSecondary} mb-6`}>
            Bitte wähle zunächst ein Versicherungsprodukt aus.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Zurück zur Produktauswahl
          </button>
        </div>
      </motion.div>
    );
  }

  // Handle save configuration
  const handleSaveConfiguration = () => {
    updateInsuranceData({
      selectedInsuranceProductId: product.id,
      insuranceMonthlyContribution: monthlyContribution,
      insuranceContractDuration: contractDuration,
    });

    alert('Konfiguration gespeichert!');
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${bgColor} transition-colors duration-300`}
    >
      {/* Header */}
      <div className={`${cardBg} border-b ${borderColor} sticky top-0 z-40 backdrop-blur-sm bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                >
                  <ArrowLeft className={`w-6 h-6 ${textColor}`} />
                </button>
              )}
              <div>
                <h1 className={`text-2xl font-bold ${textColor}`}>
                  Produktkonfiguration
                </h1>
                <p className={`text-sm ${textSecondary} mt-1`}>
                  {product.provider} • {product.productName}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Product Overview Card */}
          <div className={`${cardBg} rounded-lg shadow-lg border ${borderColor} p-6`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Product Info */}
              <div className="md:col-span-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textColor}`}>
                      {product.productName}
                    </h2>
                    <p className={`text-sm ${textSecondary}`}>
                      {product.provider}
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${textSecondary}`}>
                  {product.description}
                </p>
              </div>

              {/* Key Metrics */}
              <div>
                <p className={`text-xs ${textSecondary} mb-1`}>Garantieniveau</p>
                <p className={`text-2xl font-bold text-green-600 dark:text-green-400`}>
                  {product.guaranteeLevel}%
                </p>
                <p className={`text-xs ${textSecondary} mt-2`}>Kostenquote p.a.</p>
                <p className={`text-lg font-semibold ${textColor}`}>
                  {product.costs.effectiveCostRatio?.toFixed(2)}%
                </p>
              </div>

              <div>
                <p className={`text-xs ${textSecondary} mb-1`}>Min. Beitrag</p>
                <p className={`text-lg font-semibold ${textColor}`}>
                  {formatCurrency(product.minContribution)}
                </p>
                <p className={`text-xs ${textSecondary} mt-2`}>Max. Beitrag</p>
                <p className={`text-lg font-semibold ${textColor}`}>
                  {formatCurrency(product.maxContribution)}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className={`${cardBg} rounded-lg shadow-lg border ${borderColor} p-6`}>
            <div className="flex items-center gap-2 mb-6">
              <Calculator className={`w-5 h-5 ${textColor}`} />
              <h3 className={`text-lg font-semibold ${textColor}`}>
                Beitragseinstellungen
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Contribution */}
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Monatlicher Beitrag
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    min={product.minContribution}
                    max={product.maxContribution}
                    step={50}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <span className={`absolute right-4 top-3 ${textSecondary}`}>€</span>
                </div>
                <p className={`text-xs ${textSecondary} mt-1`}>
                  Min: {formatCurrency(product.minContribution)} • Max: {formatCurrency(product.maxContribution)}
                </p>

                {/* Slider */}
                <input
                  type="range"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  min={product.minContribution}
                  max={Math.min(product.maxContribution, 2000)}
                  step={50}
                  className="w-full mt-4"
                />
              </div>

              {/* Contract Duration */}
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Laufzeit
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={contractDuration}
                    onChange={(e) => setContractDuration(Number(e.target.value))}
                    min={product.minContractDuration}
                    max={50}
                    className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <span className={`absolute right-4 top-3 ${textSecondary}`}>Jahre</span>
                </div>
                <p className={`text-xs ${textSecondary} mt-1`}>
                  Mindestlaufzeit: {product.minContractDuration} Jahre
                </p>

                {/* Slider */}
                <input
                  type="range"
                  value={contractDuration}
                  onChange={(e) => setContractDuration(Number(e.target.value))}
                  min={product.minContractDuration}
                  max={50}
                  step={1}
                  className="w-full mt-4"
                />
              </div>
            </div>

            {/* Quick Summary */}
            <div className={`mt-6 pt-6 border-t ${borderColor} grid grid-cols-3 gap-4`}>
              <div>
                <p className={`text-xs ${textSecondary}`}>Gesamtbeiträge</p>
                <p className={`text-lg font-bold ${textColor}`}>
                  {formatCurrency(monthlyContribution * contractDuration * 12)}
                </p>
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Garantierte Leistung</p>
                <p className={`text-lg font-bold text-green-600 dark:text-green-400`}>
                  {formatCurrency(monthlyContribution * contractDuration * 12 * (product.guaranteeLevel / 100))}
                </p>
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Prognostizierter Wert (6%)</p>
                <p className={`text-lg font-bold text-blue-600 dark:text-blue-400`}>
                  ~{formatCurrency(monthlyContribution * contractDuration * 12 * 1.4)}
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                onClick={handleSaveConfiguration}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Konfiguration speichern
              </button>
            </div>
          </div>

          {/* Guarantee Calculator Section */}
          <CollapsibleSection
            title="Garantie-Rechner & Szenarien"
            icon={Calculator}
            isOpen={showCalculator}
            onToggle={() => setShowCalculator(!showCalculator)}
            isDarkMode={isDarkMode}
          >
            <GuaranteeCalculator
              product={product}
              isDarkMode={isDarkMode}
            />
          </CollapsibleSection>

          {/* Cost Transparency Section */}
          <CollapsibleSection
            title="Kosten-Analyse"
            icon={DollarSign}
            isOpen={showCosts}
            onToggle={() => setShowCosts(!showCosts)}
            isDarkMode={isDarkMode}
          >
            <CostTransparency
              product={product}
              monthlyContribution={monthlyContribution}
              years={contractDuration}
              isDarkMode={isDarkMode}
            />
          </CollapsibleSection>

          {/* Insurance vs Fund Comparison Section */}
          <CollapsibleSection
            title="Vergleich: Versicherung vs. ETF-Sparplan"
            icon={TrendingUp}
            isOpen={showComparison}
            onToggle={() => setShowComparison(!showComparison)}
            isDarkMode={isDarkMode}
          >
            <InsuranceVsFundComparison
              product={product}
              monthlyContribution={monthlyContribution}
              years={contractDuration}
              isDarkMode={isDarkMode}
            />
          </CollapsibleSection>

          {/* Info Banner */}
          <div className={`${cardBg} rounded-lg border-2 border-blue-500/30 p-6`}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className={`font-semibold ${textColor} mb-1`}>
                  Wichtige Hinweise
                </h4>
                <ul className={`text-sm ${textSecondary} space-y-1`}>
                  <li>• Alle Berechnungen sind Prognosen und keine Garantien für zukünftige Entwicklungen</li>
                  <li>• Garantierte Leistungen basieren auf dem angegebenen Garantieniveau ({product.guaranteeLevel}%)</li>
                  <li>• Steuerliche Vorteile gelten nur bei Einhaltung der 12-Jahres-Regel</li>
                  <li>• Fondswechsel sind {product.features.fondswechselFreiProJahr}x pro Jahr kostenfrei möglich</li>
                  <li>• Beitragsfreistellung und Zuzahlungen sind {product.features.beitragsfreistellungMoeglich ? 'möglich' : 'nicht möglich'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon: Icon, isOpen, onToggle, isDarkMode, children }: CollapsibleSectionProps) {
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  return (
    <div className={`${cardBg} rounded-lg shadow-lg border ${borderColor} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full p-6 flex items-center justify-between ${hoverBg} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${textColor}`} />
          <h3 className={`text-lg font-semibold ${textColor}`}>
            {title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className={`w-5 h-5 ${textColor}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${textColor}`} />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-6 border-t ${borderColor}`}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
