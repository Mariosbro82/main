import React from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { formatCurrency } from '../../../utils/onboardingValidation';
import { Banknote, TrendingUp, PiggyBank, Home, Calendar, Percent } from 'lucide-react';

const AssetsDataStep: React.FC = () => {
  const { data, updateData } = useOnboardingStore();
  
  const lifeInsurance = data.lifeInsurance || {
    sum: 0
  };
  
  const funds = data.funds || {
    balance: 0
  };
  
  const savings = data.savings || {
    balance: 0
  };
  
  const mortgage = data.mortgage || {
    has: false
  };
  
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && data.personal?.calcScope === 'beide_personen';

  const handleAssetChange = (section: string, field: string, value: number | boolean | string, person?: 'A' | 'B') => {
    const currentSection = (data as any)[section] || {};
    
    if (isMarriedBoth && person && section !== 'mortgage') {
      // Mortgage is household-level, not per person
      updateData({
        [section]: {
          ...currentSection,
          [`${field}_${person}`]: value
        }
      });
    } else {
      updateData({
        [section]: {
          ...currentSection,
          [field]: value
        }
      });
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 20; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  const renderAssetFields = (person?: 'A' | 'B') => {
    const suffix = person ? `_${person}` : '';
    const personLabel = person ? ` (Person ${person})` : '';
    
    const getCurrentValue = (section: string, field: string) => {
      const sectionData = (data as any)[section] || {};
      return person ? (sectionData[`${field}${suffix}`] || 0) : (sectionData[field] || 0);
    };

    return (
      <div className="space-y-8">
        {/* Life Insurance */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Banknote className="inline h-5 w-5 mr-2" />
            Lebensversicherung{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktueller Rückkaufswert
              <span className="text-xs text-gray-500 ml-1">(Summe heute)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('lifeInsurance', 'sum') || ''}
              onChange={(e) => handleAssetChange('lifeInsurance', 'sum', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 25000"
            />
            {getCurrentValue('lifeInsurance', 'sum') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('lifeInsurance', 'sum'))}
              </p>
            )}
          </div>
        </div>

        {/* Investment Funds */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <TrendingUp className="inline h-5 w-5 mr-2" />
            Investmentfonds{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktueller Depotwert
              <span className="text-xs text-gray-500 ml-1">(Summe heute)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('funds', 'balance') || ''}
              onChange={(e) => handleAssetChange('funds', 'balance', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 50000"
            />
            {getCurrentValue('funds', 'balance') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('funds', 'balance'))}
              </p>
            )}
          </div>
        </div>

        {/* Savings */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <PiggyBank className="inline h-5 w-5 mr-2" />
            Sparguthaben{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktuelles Sparguthaben
              <span className="text-xs text-gray-500 ml-1">(Summe heute)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('savings', 'balance') || ''}
              onChange={(e) => handleAssetChange('savings', 'balance', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 15000"
            />
            {getCurrentValue('savings', 'balance') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('savings', 'balance'))}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {isMarriedBoth ? (
        <div className="space-y-8">
          {/* Person A */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              Person A - Vermögenswerte
            </h3>
            {renderAssetFields('A')}
          </div>

          {/* Person B */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              Person B - Vermögenswerte
            </h3>
            {renderAssetFields('B')}
          </div>
        </div>
      ) : (
        renderAssetFields()
      )}

      {/* Mortgage - Household Level */}
      <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <h3 className="text-xl font-medium text-gray-900 mb-6">
          <Home className="inline h-5 w-5 mr-2" />
          Immobilienkredit (Haushalt)
        </h3>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={mortgage.has}
              onChange={(e) => handleAssetChange('mortgage', 'has', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Wir haben einen Immobilienkredit
            </span>
          </label>
        </div>

        {mortgage.has && (
          <div className="space-y-6">
            {/* Current Remaining Debt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aktuelle Restschuld
                <span className="text-xs text-gray-500 ml-1">(Summe heute)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={mortgage.remainingDebtNow || ''}
                onChange={(e) => handleAssetChange('mortgage', 'remainingDebtNow', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. 250000"
                required
              />
              {mortgage.remainingDebtNow && mortgage.remainingDebtNow > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(mortgage.remainingDebtNow)}
                </p>
              )}
            </div>

            {/* Fixation End Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Ende der Zinsbindung
              </label>
              <select
                value={mortgage.fixationEndYear || ''}
                onChange={(e) => handleAssetChange('mortgage', 'fixationEndYear', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Bitte wählen...</option>
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Remaining Debt at Fixation End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restschuld zum Ende der Zinsbindung
                <span className="text-xs text-gray-500 ml-1">(geschätzt)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={mortgage.remainingDebtAtFixationEnd || ''}
                onChange={(e) => handleAssetChange('mortgage', 'remainingDebtAtFixationEnd', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. 180000"
                required
              />
              {mortgage.remainingDebtAtFixationEnd && mortgage.remainingDebtAtFixationEnd > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(mortgage.remainingDebtAtFixationEnd)}
                </p>
              )}
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="inline h-4 w-4 mr-1" />
                Aktueller Zinssatz
                <span className="text-xs text-gray-500 ml-1">(% p.a.)</span>
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.01"
                value={mortgage.interestRate || ''}
                onChange={(e) => handleAssetChange('mortgage', 'interestRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. 3.5"
                required
              />
              {mortgage.interestRate && mortgage.interestRate > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {mortgage.interestRate.toFixed(2)}% pro Jahr
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Hinweise</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Alle Vermögenswerte werden mit dem heutigen Wert angegeben</li>
          <li>• Lebensversicherungen: Rückkaufswert, nicht die Versicherungssumme</li>
          <li>• Investmentfonds: aktueller Depotwert aller Fonds zusammen</li>
          <li>• Sparguthaben: Tagesgeld, Festgeld, Sparbücher etc.</li>
          <li>• Immobilienkredite betreffen den gesamten Haushalt</li>
          {isMarriedBoth && (
            <li>• Vermögenswerte werden für beide Partner separat erfasst</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AssetsDataStep;