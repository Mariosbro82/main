import React from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { Shield, Building, Briefcase, Users } from 'lucide-react';

const PensionsStep: React.FC = () => {
  const { data, updatePensionData } = useOnboardingStore();
  const pensions = data.pensions || {
    public67: 0,
    civil67: 0,
    profession67: 0,
    zvkVbl67: 0,
  };
  
  // Check if married and calculating for both persons
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && data.personal?.calcScope === 'beide_personen';

  const handlePensionChange = (field: string, value: number) => {
    updatePensionData({ [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gesetzliche und berufliche Renten</h2>
        <p className="text-gray-600">
          Geben Sie Ihre erwarteten Rentenbezüge ab dem 67. Lebensjahr an
        </p>
      </div>

      {!isMarriedBoth ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gesetzliche Rente */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Gesetzliche Rente</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gesetzliche Rente ab 67
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={pensions.public67 || 0}
              onChange={(e) => handlePensionChange('public67', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 1200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ihre voraussichtliche gesetzliche Rente finden Sie in Ihrer jährlichen Renteninformation
            </p>
          </div>
        </div>

        {/* Beamtenpension */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Building className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Beamtenpension</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beamtenpension ab 67
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={pensions.civil67 || 0}
              onChange={(e) => handlePensionChange('civil67', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 2500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nur für Beamte, Richter und Soldaten
            </p>
          </div>
        </div>

        {/* Versorgungswerk */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Briefcase className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Versorgungswerk</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versorgungswerk ab 67
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={pensions.profession67 || 0}
              onChange={(e) => handlePensionChange('profession67', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 1800"
            />
            <p className="text-xs text-gray-500 mt-1">
              Für Ärzte, Anwälte, Architekten, Ingenieure etc.
            </p>
          </div>
        </div>

        {/* ZVK/VBL */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">ZVK/VBL</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZVK/VBL ab 67
              <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={pensions.zvkVbl67 || 0}
              onChange={(e) => handlePensionChange('zvkVbl67', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Zusatzversorgung des öffentlichen Dienstes
            </p>
          </div>
        </div>
      </div>
        ) : (
          <div className="space-y-8">
            {/* Person A */}
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <h4 className="text-lg font-semibold text-blue-900 mb-6">Person A - Renten</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gesetzliche Rente (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.public67_A || 0}
                    onChange={(e) => handlePensionChange('public67_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 1200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beamtenpension (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.civil67_A || 0}
                    onChange={(e) => handlePensionChange('civil67_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 2000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Versorgungswerk (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.profession67_A || 0}
                    onChange={(e) => handlePensionChange('profession67_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 1500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZVK/VBL (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.zvkVbl67_A || 0}
                    onChange={(e) => handlePensionChange('zvkVbl67_A', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 300"
                  />
                </div>
              </div>
            </div>
            
            {/* Person B */}
            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
              <h4 className="text-lg font-semibold text-green-900 mb-6">Person B - Renten</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gesetzliche Rente (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.public67_B || 0}
                    onChange={(e) => handlePensionChange('public67_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beamtenpension (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.civil67_B || 0}
                    onChange={(e) => handlePensionChange('civil67_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 1800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Versorgungswerk (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.profession67_B || 0}
                    onChange={(e) => handlePensionChange('profession67_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 1200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZVK/VBL (mit 67)
                    <span className="text-gray-500 text-xs ml-1">(€/Monat)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pensions.zvkVbl67_B || 0}
                    onChange={(e) => handlePensionChange('zvkVbl67_B', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. 250"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">Wichtige Hinweise zu Rentenangaben</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Alle Angaben beziehen sich auf das Renteneintrittsalter von 67 Jahren</li>
              <li>• Die Beträge sollten als monatliche Bruttorente angegeben werden</li>
              <li>• Ihre Renteninformation erhalten Sie jährlich per Post</li>
              <li>• Bei Unsicherheit können Sie eine Rentenauskunft bei der Deutschen Rentenversicherung beantragen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PensionsStep;