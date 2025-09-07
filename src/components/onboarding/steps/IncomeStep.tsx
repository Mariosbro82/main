import React from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { formatCurrency } from '../../../utils/onboardingValidation';
import { Euro, TrendingUp, Building2 } from 'lucide-react';

const IncomeStep: React.FC = () => {
  const { data, updateIncomeData } = useOnboardingStore();
  
  const income = data.income || {
    netMonthly: 0,
    grossAnnual: 0
  };
  
  const otherIncome = data.otherIncome || {
    has: false,
    type: '',
    amountMonthly: 0
  };
  
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && data.personal?.calcScope === 'beide_personen';

  const handleIncomeChange = (field: string, value: number) => {
    updateIncomeData({ [field]: value });
  };

  const handleOtherIncomeChange = (field: string, value: any) => {
    const currentOtherIncome = data.otherIncome || { has: false, type: '', amountMonthly: 0 };
    updateIncomeData({ 
      otherIncome: { 
        ...currentOtherIncome, 
        [field]: value 
      } 
    });
  };

  return (
    <div className="space-y-8">
      {/* Main Income */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <Euro className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Haupteinkommen</h3>
        </div>
        
        {!isMarriedBoth ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nettoeinkommen <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={income.netMonthly || 0}
                onChange={(e) => handleIncomeChange('netMonthly', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. 3500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bruttoeinkommen (optional)
                <span className="text-gray-500 text-xs ml-1">(€/Jahr)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={income.grossAnnual || 0}
                onChange={(e) => handleIncomeChange('grossAnnual', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. 60000"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Person A */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="text-md font-semibold text-blue-900 mb-4">Person A</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nettoeinkommen <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={income.netMonthly_A || 0}
                    onChange={(e) => handleIncomeChange('netMonthly_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 3500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bruttoeinkommen (optional)
                    <span className="text-gray-500 text-xs ml-1">(€/Jahr)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={income.grossAnnual_A || 0}
                    onChange={(e) => handleIncomeChange('grossAnnual_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 60000"
                  />
                </div>
              </div>
            </div>
            
            {/* Person B */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="text-md font-semibold text-green-900 mb-4">Person B</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nettoeinkommen <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={income.netMonthly_B || 0}
                    onChange={(e) => handleIncomeChange('netMonthly_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 2800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bruttoeinkommen (optional)
                    <span className="text-gray-500 text-xs ml-1">(€/Jahr)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={income.grossAnnual_B || 0}
                    onChange={(e) => handleIncomeChange('grossAnnual_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 45000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Other Income */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Weitere Einkünfte</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hasOtherIncome"
            checked={otherIncome.has}
            onChange={(e) => handleOtherIncomeChange('has', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasOtherIncome" className="text-sm font-medium text-gray-700">
            Ich habe weitere Einkünfte
          </label>
        </div>
        
        {otherIncome.has && (
          !isMarriedBoth ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Art der Einkünfte
                </label>
                <select
                  value={otherIncome.type || ''}
                  onChange={(e) => handleOtherIncomeChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Vermietung">Vermietung</option>
                  <option value="Verpachtung">Verpachtung</option>
                  <option value="Landwirtschaft">Landwirtschaft</option>
                  <option value="Gewerbebetrieb">Gewerbebetrieb</option>
                  <option value="Unterhalt">Unterhalt</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Betrag
                  <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={otherIncome.amountMonthly || 0}
                  onChange={(e) => handleOtherIncomeChange('amountMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="z.B. 800"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Person A */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="text-md font-semibold text-blue-900 mb-4">Person A - Sonstige Einkünfte</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Art der Einkünfte
                    </label>
                    <select
                      value={otherIncome.type_A || ''}
                      onChange={(e) => handleOtherIncomeChange('type_A', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="Vermietung">Vermietung</option>
                      <option value="Verpachtung">Verpachtung</option>
                      <option value="Landwirtschaft">Landwirtschaft</option>
                      <option value="Gewerbebetrieb">Gewerbebetrieb</option>
                      <option value="Unterhalt">Unterhalt</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Betrag
                      <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={otherIncome.amountMonthly_A || 0}
                      onChange={(e) => handleOtherIncomeChange('amountMonthly_A', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="z.B. 800"
                    />
                  </div>
                </div>
              </div>
              
              {/* Person B */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h4 className="text-md font-semibold text-green-900 mb-4">Person B - Sonstige Einkünfte</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Art der Einkünfte
                    </label>
                    <select
                      value={otherIncome.type_B || ''}
                      onChange={(e) => handleOtherIncomeChange('type_B', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="Vermietung">Vermietung</option>
                      <option value="Verpachtung">Verpachtung</option>
                      <option value="Landwirtschaft">Landwirtschaft</option>
                      <option value="Gewerbebetrieb">Gewerbebetrieb</option>
                      <option value="Unterhalt">Unterhalt</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Betrag
                      <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={otherIncome.amountMonthly_B || 0}
                      onChange={(e) => handleOtherIncomeChange('amountMonthly_B', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="z.B. 600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Building2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Hinweis zu Einkommensangaben</h4>
            <p className="text-sm text-blue-800">
              Alle Beträge werden standardmäßig als monatliche Werte erfasst. Das Bruttoeinkommen kann optional als Jahreswert angegeben werden.
              Weitere Einkünfte wie Mieteinnahmen oder Gewerbeerträge helfen bei einer genaueren Berechnung Ihrer Altersvorsorge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStep;