import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Star,
  CheckCircle2,
  Info,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/dashboard/ThemeToggle';
import GuaranteeCalculator from '../components/insurance/GuaranteeCalculator';
import { usePensionStore } from '../stores/pensionStore';
import { GuaranteeLevel } from '../types/insurance';
import {
  ALLIANZ_PRODUCTS,
  AXA_PRODUCTS,
  GENERALI_PRODUCTS,
  ZURICH_PRODUCTS,
  CANADA_LIFE_PRODUCTS
} from '../data/insuranceProducts';
import type { InsuranceProduct } from '../types/insurance';

// Combine all products
const ALL_PRODUCTS: InsuranceProduct[] = [
  ...ALLIANZ_PRODUCTS,
  ...AXA_PRODUCTS,
  ...GENERALI_PRODUCTS,
  ...ZURICH_PRODUCTS,
  ...CANADA_LIFE_PRODUCTS
];

const PROVIDERS = ['Allianz', 'AXA', 'Generali', 'Zurich', 'Canada Life'];
const GUARANTEE_LEVELS: GuaranteeLevel[] = [0, 50, 80, 90, 100];

interface ProductSelectionPageProps {
  onSelectProduct?: (productId: string) => void;
}

export default function ProductSelectionPage({ onSelectProduct }: ProductSelectionPageProps = {}) {
  const { isDarkMode } = useTheme();
  const { selectInsuranceProduct } = usePensionStore();

  // Filter states
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedGuarantees, setSelectedGuarantees] = useState<GuaranteeLevel[]>([]);
  const [maxCostRatio, setMaxCostRatio] = useState<number>(3.0);
  const [showFilters, setShowFilters] = useState(true);

  // Comparison states
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Detail modal
  const [detailProduct, setDetailProduct] = useState<InsuranceProduct | null>(null);

  // Theme colors
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  // Filter products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product => {
      // Provider filter
      if (selectedProviders.length > 0 && !selectedProviders.includes(product.provider)) {
        return false;
      }

      // Guarantee filter
      if (selectedGuarantees.length > 0 && !selectedGuarantees.includes(product.guaranteeLevel)) {
        return false;
      }

      // Cost filter
      if (product.costs.effectiveCostRatio && product.costs.effectiveCostRatio > maxCostRatio) {
        return false;
      }

      return true;
    });
  }, [selectedProviders, selectedGuarantees, maxCostRatio]);

  // Toggle provider filter
  const toggleProvider = (provider: string) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  // Toggle guarantee filter
  const toggleGuarantee = (guarantee: GuaranteeLevel) => {
    setSelectedGuarantees(prev =>
      prev.includes(guarantee)
        ? prev.filter(g => g !== guarantee)
        : [...prev, guarantee]
    );
  };

  // Toggle comparison selection
  const toggleComparison = (productId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedProviders([]);
    setSelectedGuarantees([]);
    setMaxCostRatio(3.0);
  };

  // Get comparison products
  const comparisonProducts = ALL_PRODUCTS.filter(p => selectedForComparison.includes(p.id));

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
            <div>
              <h1 className={`text-2xl font-bold ${textColor}`}>
                Fondsgebundene Rentenversicherung
              </h1>
              <p className={`text-sm ${textSecondary} mt-1`}>
                {filteredProducts.length} Produkte verfügbar
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`${showFilters ? 'w-80' : 'w-12'} flex-shrink-0 transition-all duration-300`}
          >
            <div className={`${cardBg} rounded-lg shadow-lg border ${borderColor} sticky top-24`}>
              {/* Filter Header */}
              <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
                {showFilters && (
                  <>
                    <div className="flex items-center gap-2">
                      <Filter className={`w-5 h-5 ${textColor}`} />
                      <h2 className={`font-semibold ${textColor}`}>Filter</h2>
                    </div>
                    <button
                      onClick={resetFilters}
                      className={`text-sm ${textSecondary} ${hoverBg} px-2 py-1 rounded`}
                    >
                      Zurücksetzen
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`${hoverBg} p-1 rounded`}
                >
                  {showFilters ? (
                    <ChevronUp className={`w-5 h-5 ${textColor}`} />
                  ) : (
                    <Filter className={`w-5 h-5 ${textColor}`} />
                  )}
                </button>
              </div>

              {/* Filter Content */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-6">
                      {/* Provider Filter */}
                      <div>
                        <h3 className={`text-sm font-semibold ${textColor} mb-3`}>
                          Anbieter
                        </h3>
                        <div className="space-y-2">
                          {PROVIDERS.map(provider => (
                            <label key={provider} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedProviders.includes(provider)}
                                onChange={() => toggleProvider(provider)}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                              <span className={`text-sm ${textSecondary}`}>{provider}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Guarantee Filter */}
                      <div>
                        <h3 className={`text-sm font-semibold ${textColor} mb-3`}>
                          Garantieniveau
                        </h3>
                        <div className="space-y-2">
                          {GUARANTEE_LEVELS.map(level => (
                            <label key={level} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedGuarantees.includes(level)}
                                onChange={() => toggleGuarantee(level)}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                              <span className={`text-sm ${textSecondary}`}>
                                {level}% {level === 0 && '(Keine Garantie)'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Cost Filter */}
                      <div>
                        <h3 className={`text-sm font-semibold ${textColor} mb-3`}>
                          Max. Kostenquote
                        </h3>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.1"
                            value={maxCostRatio}
                            onChange={(e) => setMaxCostRatio(parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${textSecondary}`}>
                              {maxCostRatio.toFixed(1)}% p.a.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Comparison Bar */}
            <AnimatePresence>
              {selectedForComparison.length > 0 && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className={`${cardBg} rounded-lg shadow-lg border ${borderColor} p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${textColor}`}>
                        {selectedForComparison.length} Produkte ausgewählt
                      </h3>
                      <p className={`text-sm ${textSecondary}`}>
                        Wähle bis zu 3 Produkte zum Vergleichen
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowComparison(true)}
                        disabled={selectedForComparison.length < 2}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedForComparison.length >= 2
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Vergleichen
                      </button>
                      <button
                        onClick={() => setSelectedForComparison([])}
                        className={`p-2 ${hoverBg} rounded-lg`}
                      >
                        <X className={`w-5 h-5 ${textColor}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isDarkMode={isDarkMode}
                  isSelected={selectedForComparison.includes(product.id)}
                  onToggleComparison={() => toggleComparison(product.id)}
                  onShowDetails={() => setDetailProduct(product)}
                  canSelectMore={selectedForComparison.length < 3}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className={`${cardBg} rounded-lg shadow-lg border ${borderColor} p-12 text-center`}>
                <Filter className={`w-16 h-16 ${textSecondary} mx-auto mb-4`} />
                <h3 className={`text-xl font-semibold ${textColor} mb-2`}>
                  Keine Produkte gefunden
                </h3>
                <p className={`${textSecondary}`}>
                  Versuche, die Filter anzupassen
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Filter zurücksetzen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <ComparisonModal
            products={comparisonProducts}
            isDarkMode={isDarkMode}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailProduct && (
          <DetailModal
            product={detailProduct}
            isDarkMode={isDarkMode}
            onClose={() => setDetailProduct(null)}
            onSelectProduct={onSelectProduct}
            selectInsuranceProduct={selectInsuranceProduct}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: InsuranceProduct;
  index: number;
  isDarkMode: boolean;
  isSelected: boolean;
  onToggleComparison: () => void;
  onShowDetails: () => void;
  canSelectMore: boolean;
}

function ProductCard({
  product,
  index,
  isDarkMode,
  isSelected,
  onToggleComparison,
  onShowDetails,
  canSelectMore
}: ProductCardProps) {
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const guaranteeColor =
    product.guaranteeLevel >= 90 ? 'text-green-500' :
    product.guaranteeLevel >= 70 ? 'text-blue-500' :
    product.guaranteeLevel >= 50 ? 'text-yellow-500' : 'text-orange-500';

  const costColor =
    product.costs.effectiveCostRatio! <= 1.0 ? 'text-green-500' :
    product.costs.effectiveCostRatio! <= 1.5 ? 'text-blue-500' :
    product.costs.effectiveCostRatio! <= 2.0 ? 'text-yellow-500' : 'text-orange-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${cardBg} rounded-lg shadow-lg border-2 ${
        isSelected ? 'border-blue-500' : borderColor
      } overflow-hidden hover:shadow-xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className={`text-sm font-medium ${textSecondary}`}>
              {product.provider}
            </p>
            <h3 className={`text-xl font-bold ${textColor} mt-1`}>
              {product.productName}
            </h3>
          </div>
          <button
            onClick={onToggleComparison}
            disabled={!isSelected && !canSelectMore}
            className={`p-2 rounded-lg transition-all ${
              isSelected
                ? 'bg-blue-600 text-white'
                : canSelectMore
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        <p className={`text-sm ${textSecondary} line-clamp-2`}>
          {product.description}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="p-6 space-y-4">
        {/* Guarantee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${guaranteeColor}`} />
            <span className={`text-sm ${textSecondary}`}>Garantie</span>
          </div>
          <span className={`text-lg font-bold ${guaranteeColor}`}>
            {product.guaranteeLevel}%
          </span>
        </div>

        {/* Costs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className={`w-5 h-5 ${costColor}`} />
            <span className={`text-sm ${textSecondary}`}>Kostenquote</span>
          </div>
          <span className={`text-lg font-bold ${costColor}`}>
            {product.costs.effectiveCostRatio?.toFixed(2)}% p.a.
          </span>
        </div>

        {/* Rating */}
        {product.ratings.morningstar && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className={`text-sm ${textSecondary}`}>Morningstar</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < product.ratings.morningstar!
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {product.highlights.slice(0, 3).map((highlight, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <button
          onClick={onShowDetails}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <Info className="w-5 h-5" />
          Details anzeigen
        </button>
      </div>
    </motion.div>
  );
}

// Comparison Modal Component
interface ComparisonModalProps {
  products: InsuranceProduct[];
  isDarkMode: boolean;
  onClose: () => void;
}

function ComparisonModal({ products, isDarkMode, onClose }: ComparisonModalProps) {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${bgColor} rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto`}
      >
        {/* Header */}
        <div className={`sticky top-0 ${bgColor} border-b ${borderColor} p-6 flex items-center justify-between z-10`}>
          <h2 className={`text-2xl font-bold ${textColor}`}>
            Produktvergleich
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className={`w-6 h-6 ${textColor}`} />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b-2 ${borderColor}`}>
                  <th className={`text-left py-4 px-4 ${textColor} font-semibold`}>
                    Merkmal
                  </th>
                  {products.map(product => (
                    <th key={product.id} className={`text-center py-4 px-4 ${textColor}`}>
                      <div className="font-bold">{product.productName}</div>
                      <div className={`text-sm ${textSecondary} font-normal`}>
                        {product.provider}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Guarantee */}
                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Garantieniveau</td>
                  {products.map(product => (
                    <td key={product.id} className={`py-4 px-4 text-center ${textColor} font-semibold`}>
                      {product.guaranteeLevel}%
                    </td>
                  ))}
                </tr>

                {/* Costs */}
                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Effektive Kostenquote</td>
                  {products.map(product => (
                    <td key={product.id} className={`py-4 px-4 text-center ${textColor} font-semibold`}>
                      {product.costs.effectiveCostRatio?.toFixed(2)}% p.a.
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Abschlusskosten</td>
                  {products.map(product => (
                    <td key={product.id} className={`py-4 px-4 text-center ${textSecondary}`}>
                      {product.costs.abschlusskosten.toFixed(1)}%
                    </td>
                  ))}
                </tr>

                {/* Ratings */}
                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Morningstar Rating</td>
                  {products.map(product => (
                    <td key={product.id} className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (product.ratings.morningstar || 0)
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Zuzahlungen möglich</td>
                  {products.map(product => (
                    <td key={product.id} className="py-4 px-4 text-center">
                      {product.features.zuzahlungenMoeglich ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Fondswechsel (frei/Jahr)</td>
                  {products.map(product => (
                    <td key={product.id} className={`py-4 px-4 text-center ${textColor}`}>
                      {product.features.fondswechselFreiProJahr || 0}x
                    </td>
                  ))}
                </tr>

                {/* Min/Max */}
                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Min. Beitrag (monatlich)</td>
                  {products.map(product => (
                    <td key={product.id} className={`py-4 px-4 text-center ${textSecondary}`}>
                      {product.minContribution.toLocaleString('de-DE')} €
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className={`py-4 px-4 ${textSecondary}`}>Min. Laufzeit</td>
                  {products.map(product => (
                    <td key={product.id} className={`py-4 px-4 text-center ${textSecondary}`}>
                      {product.minContractDuration} Jahre
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Detail Modal Component
interface DetailModalProps {
  product: InsuranceProduct;
  isDarkMode: boolean;
  onClose: () => void;
  onSelectProduct?: (productId: string) => void;
  selectInsuranceProduct: (productId: string) => void;
}

function DetailModal({ product, isDarkMode, onClose, onSelectProduct, selectInsuranceProduct }: DetailModalProps) {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${bgColor} rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto`}
      >
        {/* Header */}
        <div className={`sticky top-0 ${bgColor} border-b ${borderColor} p-6 flex items-start justify-between z-10`}>
          <div>
            <p className={`text-sm font-medium ${textSecondary}`}>
              {product.provider}
            </p>
            <h2 className={`text-2xl font-bold ${textColor} mt-1`}>
              {product.productName}
            </h2>
            <p className={`text-sm ${textSecondary} mt-2`}>
              {product.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className={`w-6 h-6 ${textColor}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Features Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`${cardBg} p-4 rounded-lg`}>
              <Shield className="w-8 h-8 text-blue-500 mb-2" />
              <p className={`text-2xl font-bold ${textColor}`}>
                {product.guaranteeLevel}%
              </p>
              <p className={`text-sm ${textSecondary}`}>Garantie</p>
            </div>
            <div className={`${cardBg} p-4 rounded-lg`}>
              <DollarSign className="w-8 h-8 text-green-500 mb-2" />
              <p className={`text-2xl font-bold ${textColor}`}>
                {product.costs.effectiveCostRatio?.toFixed(2)}%
              </p>
              <p className={`text-sm ${textSecondary}`}>Kostenquote p.a.</p>
            </div>
            <div className={`${cardBg} p-4 rounded-lg`}>
              <Star className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (product.ratings.morningstar || 0)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-sm ${textSecondary}`}>Morningstar</p>
            </div>
          </div>

          {/* Detailed Costs */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-3`}>
              Kostenstruktur
            </h3>
            <div className={`${cardBg} rounded-lg p-4 space-y-2`}>
              <div className="flex justify-between">
                <span className={textSecondary}>Abschlusskosten</span>
                <span className={textColor}>{product.costs.abschlusskosten.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className={textSecondary}>Verwaltungskosten (jährlich)</span>
                <span className={textColor}>{product.costs.verwaltungskosten.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className={textSecondary}>Fondskosten (TER)</span>
                <span className={textColor}>{product.costs.fondskosten.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className={textSecondary}>Garantiekosten</span>
                <span className={textColor}>{product.costs.garantiekosten.toFixed(2)}%</span>
              </div>
              <div className={`flex justify-between pt-2 border-t ${borderColor} font-semibold`}>
                <span className={textColor}>Effektive Kostenquote</span>
                <span className={textColor}>{product.costs.effectiveCostRatio?.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-3`}>
              Produktmerkmale
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <FeatureItem
                label="Zuzahlungen möglich"
                value={product.features.zuzahlungenMoeglich}
                isDarkMode={isDarkMode}
              />
              <FeatureItem
                label="Entnahmen möglich"
                value={product.features.entnahmenMoeglich}
                isDarkMode={isDarkMode}
              />
              <FeatureItem
                label="Beitragsfreistellung möglich"
                value={product.features.beitragsfreistellungMoeglich}
                isDarkMode={isDarkMode}
              />
              <FeatureItem
                label="Dynamik möglich"
                value={product.features.dynamikMoeglich}
                isDarkMode={isDarkMode}
              />
            </div>
            {product.features.fondswechselFreiProJahr !== undefined && (
              <p className={`mt-3 text-sm ${textSecondary}`}>
                <TrendingUp className="w-4 h-4 inline mr-2" />
                {product.features.fondswechselFreiProJahr} kostenlose Fondswechsel pro Jahr
              </p>
            )}
          </div>

          {/* Highlights */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-3`}>
              Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.highlights.map((highlight, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* Available Funds */}
          <div>
            <h3 className={`text-lg font-semibold ${textColor} mb-3`}>
              Verfügbare Fonds ({product.availableFunds.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {product.availableFunds.slice(0, 5).map((fund, i) => (
                <div key={i} className={`${cardBg} p-3 rounded-lg`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-medium ${textColor}`}>{fund.name}</p>
                      <p className={`text-xs ${textSecondary}`}>
                        {fund.category} • {fund.region}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${textColor}`}>
                        {fund.historicalReturn.toFixed(1)}% p.a.
                      </p>
                      <p className={`text-xs ${textSecondary}`}>
                        TER: {fund.ter.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {product.availableFunds.length > 5 && (
                <p className={`text-sm ${textSecondary} text-center pt-2`}>
                  + {product.availableFunds.length - 5} weitere Fonds
                </p>
              )}
            </div>
          </div>

          {/* Guarantee Calculator */}
          <div className={`border-t ${borderColor} pt-6`}>
            <GuaranteeCalculator product={product} isDarkMode={isDarkMode} />
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={() => {
                selectInsuranceProduct(product.id);
                if (onSelectProduct) {
                  onSelectProduct(product.id);
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Produkt auswählen
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Feature Item Component
interface FeatureItemProps {
  label: string;
  value: boolean;
  isDarkMode: boolean;
}

function FeatureItem({ label, value, isDarkMode }: FeatureItemProps) {
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="flex items-center gap-2">
      {value ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      )}
      <span className={`text-sm ${textSecondary}`}>{label}</span>
    </div>
  );
}
