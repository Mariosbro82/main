import React from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { Home, Calculator, Calendar, Percent } from 'lucide-react';

const MortgageStep: React.FC = () => {
  const { data, updateMortgageData } = useOnboardingStore();
  
  const mortgage = data.mortgage || {
    has: false,
    remainingDebtNow: 0,
    fixationEndYear: new Date().getFullYear(),
    remainingDebtAtFixationEnd: 0,
    interestRate: 0
  };

  const handleMortgageChange = (field: string, value: any) => {
    const currentMortgage = data.mortgage || {
      has: false,
      remainingDebtNow: 0,
      fixationEndYear: new Date().getFullYear(),
      remainingDebtAtFixationEnd: 0,
      interestRate: 0
    };
    
    updateMortgageData({
      ...currentMortgage,
      [field]: value
    });
  };

  // Generate years for dropdown (current year + 20 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Immobilienkredit</h2>
        <p className="text-gray-600">
          Angaben zu Ihrem bestehenden Immobilienkredit
        </p>
      </div>

      {/* Checkbox für Immobilienkredit */}
      <div className="flex items-center space-x-3 mb-6">
        <input
          type="checkbox"
          id="hasMortgage"
          checked={mortgage.has}
          onChange={(e) => handleMortgageChange('has', e.target.checked)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="hasMortgage" className="text-lg font-medium text-gray-700">
          Ich habe einen Immobilienkredit
        </label>
      </div>

      {mortgage.has && (
        <div className="space-y-6">
          {/* Aktuelle Restschuld */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Calculator className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Aktuelle Restschuld</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restschuld heute
                <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={mortgage.remainingDebtNow === 0 ? '' : mortgage.remainingDebtNow}
                onChange={(e) => handleMortgageChange('remainingDebtNow', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="Bitte eingeben (z.B. 250000)"
              />
              <p className="text-xs text-gray-600 mt-2">
                Aktuelle Restschuld laut Ihrem Kreditvertrag
              </p>
            </div>
          </div>

          {/* Zinsbindung Details */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Zinsbindung</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ende der Zinsbindung
                </label>
                <select
                  value={mortgage.fixationEndYear}
                  onChange={(e) => handleMortgageChange('fixationEndYear', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-2">
                  Jahr, in dem Ihre aktuelle Zinsbindung endet
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voraussichtliche Restschuld bei Zinsbindungsende
                  <span className="text-gray-500 text-xs ml-1">(Summe dann)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={mortgage.remainingDebtAtFixationEnd === 0 ? '' : mortgage.remainingDebtAtFixationEnd}
                  onChange={(e) => handleMortgageChange('remainingDebtAtFixationEnd', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  placeholder="Bitte eingeben (z.B. 180000)"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Erwartete Restschuld zum Ende der aktuellen Zinsbindung
                </p>
              </div>
            </div>
          </div>

          {/* Zinssatz - Clearly separated */}
          <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Percent className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Aktueller Zinssatz</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zinssatz (in %)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.01"
                  value={mortgage.interestRate === 0 ? '' : mortgage.interestRate}
                  onChange={(e) => handleMortgageChange('interestRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  placeholder="Bitte eingeben (z.B. 3.5)"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Ihr aktueller Sollzinssatz (z.B. 3,5 für 3,5% p.a.)
              </p>
            </div>
          </div>

          {/* Kreditübersicht */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Kreditübersicht</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mortgage.remainingDebtNow || 0)}
                </div>
                <div className="text-sm text-gray-600">Restschuld heute</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {mortgage.fixationEndYear}
                </div>
                <div className="text-sm text-gray-600">Zinsbindungsende</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(mortgage.remainingDebtAtFixationEnd || 0)}
                </div>
                <div className="text-sm text-gray-600">Restschuld dann</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(mortgage.interestRate || 0).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">Zinssatz</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Home className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">Hinweise zum Immobilienkredit</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Die Angaben finden Sie in Ihrem Kreditvertrag oder den jährlichen Kontoauszügen</li>
              <li>• Bei mehreren Krediten geben Sie bitte die Summe aller Immobilienkredite an</li>
              <li>• Die Restschuld bei Zinsbindungsende können Sie bei Ihrer Bank erfragen</li>
              <li>• Diese Daten helfen bei der Planung Ihrer Altersvorsorge unter Berücksichtigung der Kreditlaufzeit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageStep;