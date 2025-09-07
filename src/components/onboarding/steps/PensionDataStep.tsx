import React from 'react';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { formatCurrency } from '../../../utils/onboardingValidation';
import { Shield, Building, Briefcase, Users, Heart, Piggy, Landmark } from 'lucide-react';

const PensionDataStep: React.FC = () => {
  const { data, updateData } = useOnboardingStore();
  
  const pensions = data.pensions || {
    public67: 0,
    civil67: 0,
    profession67: 0,
    zvkVbl67: 0
  };
  
  const privatePension = data.privatePension || {
    contribution: 0
  };
  
  const riester = data.riester || {
    amount: 0
  };
  
  const ruerup = data.ruerup || {
    amount: 0
  };
  
  const occupationalPension = data.occupationalPension || {
    amount: 0
  };
  
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && data.personal?.calcScope === 'beide_personen';

  const handlePensionChange = (section: string, field: string, value: number, person?: 'A' | 'B') => {
    const currentSection = (data as any)[section] || {};
    
    if (isMarriedBoth && person) {
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

  const renderPensionFields = (person?: 'A' | 'B') => {
    const suffix = person ? `_${person}` : '';
    const personLabel = person ? ` (Person ${person})` : '';
    
    const getCurrentValue = (section: string, field: string) => {
      const sectionData = (data as any)[section] || {};
      return person ? (sectionData[`${field}${suffix}`] || 0) : (sectionData[field] || 0);
    };

    return (
      <div className="space-y-8">
        {/* Gesetzliche Rente */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Shield className="inline h-5 w-5 mr-2" />
            Gesetzliche Rente{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Erwartete Rente mit 67
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('pensions', 'public67') || ''}
              onChange={(e) => handlePensionChange('pensions', 'public67', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 1200"
            />
            {getCurrentValue('pensions', 'public67') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('pensions', 'public67'))} pro Monat
              </p>
            )}
          </div>
        </div>

        {/* Beamtenpension */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Building className="inline h-5 w-5 mr-2" />
            Beamtenpension{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Erwartete Pension mit 67
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('pensions', 'civil67') || ''}
              onChange={(e) => handlePensionChange('pensions', 'civil67', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 2500"
            />
            {getCurrentValue('pensions', 'civil67') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('pensions', 'civil67'))} pro Monat
              </p>
            )}
          </div>
        </div>

        {/* Versorgungswerk */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Briefcase className="inline h-5 w-5 mr-2" />
            Versorgungswerk{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Erwartete Rente mit 67
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('pensions', 'profession67') || ''}
              onChange={(e) => handlePensionChange('pensions', 'profession67', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 1800"
            />
            {getCurrentValue('pensions', 'profession67') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('pensions', 'profession67'))} pro Monat
              </p>
            )}
          </div>
        </div>

        {/* ZVK/VBL */}
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Users className="inline h-5 w-5 mr-2" />
            ZVK/VBL{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Erwartete Rente mit 67
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('pensions', 'zvkVbl67') || ''}
              onChange={(e) => handlePensionChange('pensions', 'zvkVbl67', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 400"
            />
            {getCurrentValue('pensions', 'zvkVbl67') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('pensions', 'zvkVbl67'))} pro Monat
              </p>
            )}
          </div>
        </div>

        {/* Private Rente */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Heart className="inline h-5 w-5 mr-2" />
            Private Rentenversicherung{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('privatePension', 'contribution') || ''}
              onChange={(e) => handlePensionChange('privatePension', 'contribution', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 200"
            />
            {getCurrentValue('privatePension', 'contribution') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('privatePension', 'contribution'))} pro Monat
              </p>
            )}
          </div>
        </div>

        {/* Riester */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Piggy className="inline h-5 w-5 mr-2" />
            Riester-Rente{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('riester', 'amount') || ''}
              onChange={(e) => handlePensionChange('riester', 'amount', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 150"
            />
            {getCurrentValue('riester', 'amount') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('riester', 'amount'))} pro Monat
              </p>
            )}
          </div>
        </div>

        {/* Rürup */}
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Landmark className="inline h-5 w-5 mr-2" />
            Rürup-Rente{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('ruerup', 'amount') || ''}
              onChange={(e) => handlePensionChange('ruerup', 'amount', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 300"
            />
            {getCurrentValue('ruerup', 'amount') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('ruerup', 'amount'))} pro Monat
              </p>
            )}
          </div>
        </div>

        {/* Betriebsrente */}
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            <Building className="inline h-5 w-5 mr-2" />
            Betriebsrente{personLabel}
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatlicher Beitrag
              <span className="text-xs text-gray-500 ml-1">(€/Monat)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getCurrentValue('occupationalPension', 'amount') || ''}
              onChange={(e) => handlePensionChange('occupationalPension', 'amount', parseFloat(e.target.value) || 0, person)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 100"
            />
            {getCurrentValue('occupationalPension', 'amount') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(getCurrentValue('occupationalPension', 'amount'))} pro Monat
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
              Person A - Renten & Vorsorge
            </h3>
            {renderPensionFields('A')}
          </div>

          {/* Person B */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              Person B - Renten & Vorsorge
            </h3>
            {renderPensionFields('B')}
          </div>
        </div>
      ) : (
        renderPensionFields()
      )}

      {/* Info Box */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Hinweise</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Alle Rentenangaben beziehen sich auf das Alter 67</li>
          <li>• Beiträge werden monatlich angegeben</li>
          <li>• Lassen Sie Felder leer, wenn Sie keine entsprechende Vorsorge haben</li>
          <li>• Die Angaben dienen zur Berechnung Ihrer Versorgungslücke</li>
          <li>• Schätzungen sind ausreichend - Sie können die Werte später anpassen</li>
        </ul>
      </div>
    </div>
  );
};

export default PensionDataStep;