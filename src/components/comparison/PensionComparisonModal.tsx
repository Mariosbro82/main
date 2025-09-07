import React, { useState, useEffect, useMemo } from 'react';
import { X, Calculator, TrendingUp, PiggyBank, Info, BarChart3, Euro } from 'lucide-react';
import { runPensionComparison, createDefaultSimulationParams, SimulationResult } from '../../utils/pensionSimulation';
import { DEFAULT_TAX_SETTINGS, TaxSettings } from '../../utils/germanTaxCalculations';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PensionComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FundSavingsData {
  expectedReturnPa: number;
  frontLoad: number;
  annualMgmtFee: number;
  churchTax: boolean;
  allowance: number;
  baseRatePa: number;
}

const PensionComparisonModal: React.FC<PensionComparisonModalProps> = ({ isOpen, onClose }) => {
  const { data } = useOnboardingStore();
  
  const [fundSavings, setFundSavings] = useState<FundSavingsData>({
    expectedReturnPa: 6.0,
    frontLoad: 0.0,
    annualMgmtFee: 0.5,
    churchTax: false,
    allowance: 1000,
    baseRatePa: 2.0
  });

  const [simulationSettings, setSimulationSettings] = useState({
    currentAge: data.personal?.age || 30,
    retirementAge: 67,
    finalAge: 85,
    monthlySavings: 300
  });

  const [simulationAge, setSimulationAge] = useState<67 | 85>(67);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  
  const pensionContribution = data.retirement?.privatePension?.contribution ||
    data.retirement?.privatePension?.contribution_A || 0;
  const pensionGuarantee = pensionContribution * 0.8;
  
  const taxSettings: TaxSettings = useMemo(() => ({
    ...DEFAULT_TAX_SETTINGS,
    hasChurchTax: fundSavings.churchTax,
    allowance: fundSavings.allowance,
    baseRate: fundSavings.baseRatePa,
    churchTaxRate: 8
  }), [fundSavings]);
  
  useEffect(() => {
    if (!isOpen) return;
    
    setIsCalculating(true);
    
    const params = createDefaultSimulationParams({
      currentAge: simulationSettings.currentAge,
      retirementAge: simulationSettings.retirementAge,
      finalAge: simulationSettings.finalAge,
      monthlySavings: simulationSettings.monthlySavings,
      expectedReturnPa: fundSavings.expectedReturnPa,
      frontLoad: fundSavings.frontLoad,
      annualMgmtFee: fundSavings.annualMgmtFee,
      taxSettings,
      pensionContribution,
      pensionGuarantee
    });
    
    setTimeout(() => {
      const result = runPensionComparison(params);
      setSimulationResult(result);
      setIsCalculating(false);
    }, 500);
  }, [isOpen, simulationSettings, fundSavings, taxSettings, pensionContribution, pensionGuarantee]);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  const chartData = useMemo(() => {
    if (!simulationResult) return [];
    
    return simulationResult.yearlyData.map(yearData => ({
      age: yearData.age,
      fundNetValue: yearData.fundNetValue,
      pensionValue: yearData.pensionValue,
      fundTotalTax: yearData.fundTotalTax,
      pensionTotalTax: yearData.pensionTotalTax
    }));
  }, [simulationResult]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Private Rente vs. Fonds-Sparplan</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fonds-Sparplan Einstellungen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Erwartete Rendite p.a. (%)
                </label>
                <input
                  type="number"
                  value={fundSavings.expectedReturnPa}
                  onChange={(e) => setFundSavings(prev => ({ ...prev, expectedReturnPa: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ausgabeaufschlag (%)
                </label>
                <input
                  type="number"
                  value={fundSavings.frontLoad}
                  onChange={(e) => setFundSavings(prev => ({ ...prev, frontLoad: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jährliche Verwaltungsgebühr (%)
                </label>
                <input
                  type="number"
                  value={fundSavings.annualMgmtFee}
                  onChange={(e) => setFundSavings(prev => ({ ...prev, annualMgmtFee: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sparer-Pauschbetrag (€)
                </label>
                <input
                  type="number"
                  value={fundSavings.allowance}
                  onChange={(e) => setFundSavings(prev => ({ ...prev, allowance: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="100"
                  min="0"
                  max="10000"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="churchTax"
                  checked={fundSavings.churchTax}
                  onChange={(e) => setFundSavings(prev => ({ ...prev, churchTax: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="churchTax" className="ml-2 block text-sm text-gray-700">
                  Kirchensteuer (8%)
                </label>
              </div>
            </div>
          </div>

          {isCalculating ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Berechnung läuft...</p>
            </div>
          ) : simulationResult ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Fonds-Sparplan</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Netto mit 67:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(simulationResult.fundResults.netValueAt67)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Netto mit 85:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(simulationResult.fundResults.netValueAt85)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Inkl. Kapitalertragssteuer und Vorabpauschale
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <PiggyBank className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Private Rente</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Netto mit 67:</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(simulationResult.pensionResults.netValueAt67)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Netto mit 85:</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(simulationResult.pensionResults.netValueAt85)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Inkl. Ertragsanteil-Besteuerung
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Vermögensentwicklung über Zeit</h4>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      chartType === 'area'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Flächendiagramm
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      chartType === 'line'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Liniendiagramm
                  </button>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'area' ? (
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="age" 
                          label={{ value: 'Alter', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                          label={{ value: 'Netto-Vermögen (€)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            formatCurrency(value), 
                            name === 'fundNetValue' ? 'Fonds-Sparplan' : 'Private Rente'
                          ]}
                          labelFormatter={(age) => `Alter: ${age}`}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="fundNetValue"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="Fonds-Sparplan"
                        />
                        <Area
                          type="monotone"
                          dataKey="pensionValue"
                          stackId="2"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Private Rente"
                        />
                      </AreaChart>
                    ) : (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="age" 
                          label={{ value: 'Alter', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                          label={{ value: 'Netto-Vermögen (€)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            formatCurrency(value), 
                            name === 'fundNetValue' ? 'Fonds-Sparplan' : 'Private Rente'
                          ]}
                          labelFormatter={(age) => `Alter: ${age}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="fundNetValue"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          name="Fonds-Sparplan"
                        />
                        <Line
                          type="monotone"
                          dataKey="pensionValue"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          name="Private Rente"
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Keine Simulationsdaten verfügbar
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Wichtige Hinweise:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Diese Berechnung ist eine vereinfachte Simulation und ersetzt keine professionelle Beratung</li>
              <li>• Renditen sind nicht garantiert und können schwanken</li>
              <li>• Steuerliche Regelungen können sich ändern</li>
              <li>• Inflationseffekte sind nicht berücksichtigt</li>
              <li>• Bei Fonds-Sparplänen besteht ein Verlustrisiko</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default PensionComparisonModal;