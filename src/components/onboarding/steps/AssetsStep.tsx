import React from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { Wallet, TrendingUp, PiggyBank, Shield } from 'lucide-react';

const AssetsStep: React.FC = () => {
  const { data, updateAssetsData } = useOnboardingStore();

  const assets = {
    lifeInsurance: data.lifeInsurance || { sum: 0 },
    funds: data.funds || { balance: 0 },
    savings: data.savings || { balance: 0 }
  };

  // Check if married and calculating for both persons
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && data.personal?.calcScope === 'beide_personen';

  const handleAssetChange = (category: string, field: string, value: number) => {
    const currentAssets = {
      lifeInsurance: data.lifeInsurance || { sum: 0 },
      funds: data.funds || { balance: 0 },
      savings: data.savings || { balance: 0 }
    };

    updateAssetsData({
      ...currentAssets,
      [category]: {
        ...currentAssets[category as keyof typeof currentAssets],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vermögenswerte</h2>
        <p className="text-gray-600">
          Geben Sie Ihre aktuellen Vermögenswerte an (heutige Summen)
        </p>
      </div>

      {!isMarriedBoth ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Lebensversicherung */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Lebensversicherung</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktueller Rückkaufswert
              <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={assets.lifeInsurance?.sum || 0}
              onChange={(e) => handleAssetChange('lifeInsurance', 'sum', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 25000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kapitallebensversicherung, Rentenversicherung etc.
            </p>
          </div>
        </div>

        {/* Fonds/ETFs */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Fonds & ETFs</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktueller Depotwert
              <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={assets.funds?.balance || 0}
              onChange={(e) => handleAssetChange('funds', 'balance', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 15000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Investmentfonds, ETFs, Aktien, Anleihen
            </p>
          </div>
        </div>

        {/* Sparguthaben */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <PiggyBank className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sparguthaben</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktuelles Guthaben
              <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={assets.savings?.balance || 0}
              onChange={(e) => handleAssetChange('savings', 'balance', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 10000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sparbuch, Tagesgeld, Festgeld, Girokonto
            </p>
          </div>
        </div>
      </div>
        ) : (
          <div className="space-y-8">
            {/* Person A */}
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <h4 className="text-lg font-semibold text-blue-900 mb-6">Person A - Vermögenswerte</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <h5 className="text-md font-semibold text-gray-900">Lebensversicherung</h5>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktueller Rückkaufswert
                    <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assets.lifeInsurance?.sum_A || 0}
                    onChange={(e) => handleAssetChange('lifeInsurance', 'sum_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 25000"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h5 className="text-md font-semibold text-gray-900">Fonds & ETFs</h5>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktueller Depotwert
                    <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assets.funds?.balance_A || 0}
                    onChange={(e) => handleAssetChange('funds', 'balance_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 15000"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <PiggyBank className="h-6 w-6 text-purple-600" />
                    <h5 className="text-md font-semibold text-gray-900">Sparguthaben</h5>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktuelles Guthaben
                    <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assets.savings?.balance_A || 0}
                    onChange={(e) => handleAssetChange('savings', 'balance_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 10000"
                  />
                </div>
              </div>
            </div>
            
            {/* Person B */}
            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
              <h4 className="text-lg font-semibold text-green-900 mb-6">Person B - Vermögenswerte</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h5 className="text-md font-semibold text-gray-900">Lebensversicherung</h5>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktueller Rückkaufswert
                    <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assets.lifeInsurance?.sum_B || 0}
                    onChange={(e) => handleAssetChange('lifeInsurance', 'sum_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="z.B. 25000"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h5 className="text-md font-semibold text-gray-900">Fonds & ETFs</h5>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktueller Depotwert
                    <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assets.funds?.balance_B || 0}
                    onChange={(e) => handleAssetChange('funds', 'balance_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="z.B. 15000"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <PiggyBank className="h-6 w-6 text-green-600" />
                    <h5 className="text-md font-semibold text-gray-900">Sparguthaben</h5>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktuelles Guthaben
                    <span className="text-gray-500 text-xs ml-1">(Summe heute)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={assets.savings?.balance_B || 0}
                    onChange={(e) => handleAssetChange('savings', 'balance_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="z.B. 10000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Vermögensübersicht */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Vermögensübersicht</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(assets.lifeInsurance?.sum || 0)}
            </div>
            <div className="text-sm text-gray-600">Lebensversicherung</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(assets.funds?.balance || 0)}
            </div>
            <div className="text-sm text-gray-600">Fonds & ETFs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(assets.savings?.balance || 0)}
            </div>
            <div className="text-sm text-gray-600">Sparguthaben</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                (assets.lifeInsurance?.sum || 0) + (assets.funds?.balance || 0) + (assets.savings?.balance || 0)
              )}
            </div>
            <div className="text-sm text-gray-600">Gesamtvermögen</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Wallet className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">Hinweise zu Vermögensangaben</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Geben Sie die aktuellen Marktwerte bzw. Rückkaufswerte an</li>
              <li>• Bei Lebensversicherungen finden Sie den Rückkaufswert in Ihrem Jahresauszug</li>
              <li>• Depot- und Kontostände können Sie Ihren aktuellen Auszügen entnehmen</li>
              <li>• Diese Angaben helfen bei der Berechnung Ihrer Gesamtversorgung im Alter</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsStep;