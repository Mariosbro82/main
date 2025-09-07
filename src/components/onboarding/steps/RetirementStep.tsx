import React, { useState } from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { PiggyBank, TrendingUp, Shield, Building2, Calculator } from 'lucide-react';
import PensionComparisonModal from '../../comparison/PensionComparisonModal';

const RetirementStep: React.FC = () => {
  const { data, updateRetirementData } = useOnboardingStore();
  const [showComparison, setShowComparison] = useState(false);
  
  const retirement = data.retirement || {
    privatePension: { contribution: 0 },
    riester: { amount: 0 },
    ruerup: { amount: 0 },
    occupationalPension: { amount: 0 }
  };
  
  // Check if married and calculating for both persons
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && data.personal?.calcScope === 'beide_personen';

  const handleRetirementChange = (category: string, field: string, value: number) => {
    const currentRetirement = data.retirement || {
      privatePension: { contribution: 0 },
      riester: { amount: 0 },
      ruerup: { amount: 0 },
      occupationalPension: { amount: 0 }
    };
    
    updateRetirementData({
      ...currentRetirement,
      [category]: {
        ...currentRetirement[category as keyof typeof currentRetirement],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <PiggyBank className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Private Altersvorsorge</h2>
        <p className="text-gray-600">
          Geben Sie Ihre monatlichen Beiträge zur privaten Altersvorsorge an
        </p>
      </div>

      {!isMarriedBoth ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Private Rentenversicherung */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Private Rentenversicherung</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={retirement.privatePension?.contribution || 0}
              onChange={(e) => handleRetirementChange('privatePension', 'contribution', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Klassische oder fondsgebundene Rentenversicherung
            </p>
          </div>
        </div>

        {/* Riester-Rente */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Riester-Rente</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={retirement.riester?.amount || 0}
              onChange={(e) => handleRetirementChange('riester', 'amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 150"
            />
            <p className="text-xs text-gray-500 mt-1">
              Staatlich geförderte Altersvorsorge mit Zulagen
            </p>
          </div>
        </div>

        {/* Rürup-Rente */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Rürup-Rente</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={retirement.ruerup?.amount || 0}
              onChange={(e) => handleRetirementChange('ruerup', 'amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 300"
            />
            <p className="text-xs text-gray-500 mt-1">
              Basisrente mit Steuervorteilen, besonders für Selbstständige
            </p>
          </div>
        </div>

        {/* Betriebliche Altersvorsorge */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Betriebliche Altersvorsorge</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={retirement.occupationalPension?.amount || 0}
              onChange={(e) => handleRetirementChange('occupationalPension', 'amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Direktversicherung, Pensionskasse oder Pensionsfonds
            </p>
          </div>
        </div>
      </div>
        ) : (
          <div className="space-y-8">
            {/* Person A */}
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <h4 className="text-lg font-semibold text-blue-900 mb-6">Person A - Private Altersvorsorge</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Private Rentenversicherung
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.privatePension?.contribution_A || 0}
                    onChange={(e) => handleRetirementChange('privatePension', 'contribution_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Riester-Rente
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.riester?.amount_A || 0}
                    onChange={(e) => handleRetirementChange('riester', 'amount_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 150"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rürup-Rente
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.ruerup?.amount_A || 0}
                    onChange={(e) => handleRetirementChange('ruerup', 'amount_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Betriebliche Altersvorsorge
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.occupationalPension?.amount_A || 0}
                    onChange={(e) => handleRetirementChange('occupationalPension', 'amount_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 100"
                  />
                </div>
              </div>
            </div>
            
            {/* Person B */}
            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
              <h4 className="text-lg font-semibold text-green-900 mb-6">Person B - Private Altersvorsorge</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Private Rentenversicherung
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.privatePension?.contribution_B || 0}
                    onChange={(e) => handleRetirementChange('privatePension', 'contribution_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 150"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Riester-Rente
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.riester?.amount_B || 0}
                    onChange={(e) => handleRetirementChange('riester', 'amount_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rürup-Rente
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.ruerup?.amount_B || 0}
                    onChange={(e) => handleRetirementChange('ruerup', 'amount_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Betriebliche Altersvorsorge
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={retirement.occupationalPension?.amount_B || 0}
                    onChange={(e) => handleRetirementChange('occupationalPension', 'amount_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 80"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Comparison Button */}
      {(retirement?.privatePension?.contribution || 
        (retirement?.privatePension?.contribution_A && retirement?.privatePension?.contribution_B)) && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vergleich mit Fonds-Sparplan</h3>
                <p className="text-sm text-gray-600">
                  Vergleichen Sie Ihre Private Rente mit einem Fonds-Sparplan
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowComparison(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Private Rente vergleichen</span>
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <PiggyBank className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-green-900 mb-2">Tipps zur privaten Altersvorsorge</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Riester-Rente:</strong> Staatliche Zulagen von bis zu 175€ pro Jahr plus Kinderzulagen</li>
              <li>• <strong>Rürup-Rente:</strong> Steuerlich absetzbar, besonders vorteilhaft bei hohem Einkommen</li>
              <li>• <strong>Betriebliche Altersvorsorge:</strong> Steuer- und sozialversicherungsfrei bis 584€/Monat (2024)</li>
              <li>• <strong>Private Rentenversicherung:</strong> Flexible Gestaltung, aber ohne staatliche Förderung</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <PensionComparisonModal 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
      />
    </div>
  );
};

export default RetirementStep;