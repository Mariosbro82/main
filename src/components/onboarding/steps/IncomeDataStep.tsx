import React from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { OtherIncomeType } from '../../../types/onboarding';
import { formatCurrency } from '../../../utils/onboardingValidation';
import { Euro, TrendingUp, Building2 } from 'lucide-react';

const IncomeDataStep: React.FC = () => {
  const { data, updateData } = useOnboardingStore();
  
  const income = data.income || {
    netMonthly: 0,
    grossAnnual: 0
  };
  
  const otherIncome = data.otherIncome || {
    has: false
  };
  
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && data.personal?.calcScope === 'beide_personen';

  const handleIncomeChange = (field: string, value: number, person?: 'A' | 'B') => {
    if (isMarriedBoth && person) {
      updateData({
        income: {
          ...income,
          [`${field}_${person}`]: value
        }
      });
    } else {
      updateData({
        income: {
          ...income,
          [field]: value
        }
      });
    }
  };

  const handleOtherIncomeChange = (field: string, value: any, person?: 'A' | 'B') => {
    if (isMarriedBoth && person) {
      updateData({
        otherIncome: {
          ...otherIncome,
          [`${field}_${person}`]: value
        }
      });
    } else {
      updateData({
        otherIncome: {
          ...otherIncome,
          [field]: value
        }
      });
    }
  };

  const otherIncomeTypes: { value: OtherIncomeType; label: string }[] = [
    { value: 'Vermietung', label: 'Vermietung und Verpachtung' },
    { value: 'Verpachtung', label: 'Verpachtung' },
    { value: 'Landwirtschaft', label: 'Land- und Forstwirtschaft' },
    { value: 'Gewerbebetrieb', label: 'Gewerbebetrieb' },
    { value: 'Unterhalt', label: 'Unterhaltszahlungen' }
  ];

  const renderIncomeFields = (person?: 'A' | 'B') => {
    const suffix = person ? `_${person}` : '';
    const personLabel = person ? ` (Person ${person})` : '';
    const currentIncome = person ? (income as any)[`netMonthly${suffix}`] || 0 : income.netMonthly || 0;
    const currentGross = person ? (income as any)[`grossAnnual${suffix}`] || 0 : income.grossAnnual || 0;
    const currentOtherIncome = person ? (otherIncome as any)[`has${suffix}`] || false : otherIncome.has || false;
    const currentOtherType = person ? (otherIncome as any)[`type${suffix}`] : otherIncome.type;
    const currentOtherAmount = person ? (otherIncome as any)[`amountMonthly${suffix}`] || 0 : otherIncome.amountMonthly || 0;

    return (
      <div className="space-y-6">
        {/* Net Monthly Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Euro className="inline h-4 w-4 mr-1" />
            Nettoeinkommen{personLabel} *
            <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={currentIncome || 0}
            onChange={(e) => handleIncomeChange('netMonthly', parseFloat(e.target.value) || 0, person)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="z.B. 3500"
            required
          />
          {currentIncome > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(currentIncome)} pro Monat
            </p>
          )}
        </div>

        {/* Gross Annual Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="inline h-4 w-4 mr-1" />
            Bruttoeinkommen{personLabel}
            <span className="text-xs text-gray-500 ml-1">(€/Jahr, optional)</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={currentGross || 0}
            onChange={(e) => handleIncomeChange('grossAnnual', parseFloat(e.target.value) || 0, person)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="z.B. 60000"
          />
          {currentGross > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {formatCurrency(currentGross)} pro Jahr
            </p>
          )}
        </div>

        {/* Other Income */}
        <div className="border-t pt-6">
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentOtherIncome}
                onChange={(e) => handleOtherIncomeChange('has', e.target.checked, person)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-900">
                <Building2 className="inline h-4 w-4 mr-1" />
                Weitere Einkünfte{personLabel}
              </span>
            </label>
          </div>

          {currentOtherIncome && (
            <div className="ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Art der Einkünfte
                </label>
                <select
                  value={currentOtherType || ''}
                  onChange={(e) => handleOtherIncomeChange('type', e.target.value as OtherIncomeType, person)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Bitte wählen...</option>
                  {otherIncomeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Betrag
                  <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentOtherAmount || 0}
                  onChange={(e) => handleOtherIncomeChange('amountMonthly', parseFloat(e.target.value) || 0, person)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="z.B. 800"
                  required
                />
                {currentOtherAmount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(currentOtherAmount)} pro Monat
                  </p>
                )}
              </div>
            </div>
          )}
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Person A - Einkommen
            </h3>
            {renderIncomeFields('A')}
          </div>

          {/* Person B */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Person B - Einkommen
            </h3>
            {renderIncomeFields('B')}
          </div>
        </div>
      ) : (
        renderIncomeFields()
      )}

      {/* Info Box */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Hinweise</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Das Nettoeinkommen ist ein Pflichtfeld für die Berechnung</li>
          <li>• Das Bruttoeinkommen ist optional und dient zur Plausibilitätsprüfung</li>
          <li>• Weitere Einkünfte umfassen z.B. Mieteinnahmen oder selbständige Tätigkeiten</li>
          <li>• Alle Beträge werden monatlich angegeben</li>
          {isMarriedBoth && (
            <li>• Bei verheirateten Paaren werden die Einkommen beider Partner erfasst</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default IncomeDataStep;