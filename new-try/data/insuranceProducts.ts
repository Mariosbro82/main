import { InsuranceProduct, Fund, InsuranceProvider } from '../types/insurance';

// Sample Funds commonly available in German insurance products
export const SAMPLE_FUNDS: Fund[] = [
  {
    isin: 'DE0008491051',
    name: 'DWS Top Dividende',
    category: 'Aktien',
    region: 'Global',
    ter: 1.45,
    historicalReturn: 6.8,
    volatility: 15.2,
    morningstarRating: 4,
    description: 'Dividendenstarke globale Aktien',
  },
  {
    isin: 'LU0274208692',
    name: 'Xtrackers MSCI World',
    category: 'Aktien',
    region: 'Global',
    ter: 0.19,
    historicalReturn: 8.2,
    volatility: 14.5,
    morningstarRating: 5,
    description: 'Passiver Indexfonds auf MSCI World',
  },
  {
    isin: 'DE0009769869',
    name: 'DJE - Dividende & Substanz',
    category: 'Mischfonds',
    region: 'Global',
    ter: 1.60,
    historicalReturn: 5.5,
    volatility: 8.3,
    morningstarRating: 4,
    description: 'Ausgewogener Mischfonds',
  },
  {
    isin: 'LU0348926287',
    name: 'Allianz Euro Bond',
    category: 'Renten',
    region: 'Europa',
    ter: 0.85,
    historicalReturn: 2.8,
    volatility: 3.5,
    morningstarRating: 3,
    description: 'Europäische Anleihen',
  },
  {
    isin: 'LU0565135745',
    name: 'AXA Rosenberg Pacific',
    category: 'Aktien',
    region: 'Asien',
    ter: 1.75,
    historicalReturn: 7.5,
    volatility: 18.5,
    morningstarRating: 3,
    description: 'Asiatische Aktienmärkte',
  },
  {
    isin: 'DE0009769901',
    name: 'DJE - Immobilien Global',
    category: 'Immobilien',
    region: 'Global',
    ter: 1.55,
    historicalReturn: 4.5,
    volatility: 10.2,
    morningstarRating: 4,
    description: 'Globale Immobilienfonds',
  },
];

// Allianz Products
export const ALLIANZ_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'allianz-fondsrente-plus',
    provider: 'Allianz',
    productName: 'FondsRente Plus',
    productCode: 'FRP-2024',
    description: 'Flexibles Vorsorgeprodukt mit hoher Fondsauswahl und optionaler Beitragsgarantie',

    guaranteeLevel: 80,
    guaranteeType: 'nominal',

    costs: {
      abschlusskosten: 4.0, // 4% der Summe aller Beiträge
      vertriebskosten: 2.5,
      verwaltungskosten: 0.85,
      fondskosten: 1.2,
      garantiekosten: 0.35,
      risikokosten: 0.15,
      effectiveCostRatio: 1.55,
    },

    availableFunds: SAMPLE_FUNDS,
    defaultFundAllocation: [
      { fund: SAMPLE_FUNDS[1], percentage: 60 }, // MSCI World
      { fund: SAMPLE_FUNDS[2], percentage: 30 }, // Mischfonds
      { fund: SAMPLE_FUNDS[3], percentage: 10 }, // Anleihen
    ],

    features: {
      zuzahlungenMoeglich: true,
      minZuzahlung: 500,
      maxZuzahlungProJahr: 10000,

      entnahmenMoeglich: true,
      minEntnahme: 1000,
      maxEntnahmePercent: 30,

      beitragsfreistellungMoeglich: true,
      minBeitragsfreistellungMonate: 1,

      dynamikMoeglich: true,
      dynamikProzent: 3,

      fondswechselMoeglich: true,
      fondswechselFreiProJahr: 4,
      fondswechselKosten: 25,
    },

    payoutOptions: {
      einmalkapital: true,
      teilverrentung: true,
      vollverrentung: true,
      auszahlplan: true,
      rentengarantiezeit: 10,
      hinterbliebenenabsicherung: true,
      hinterbliebenenProzent: 60,
    },

    deathBenefit: {
      duringAccumulation: 1.1,
      options: {
        basic: true,
        enhanced: true,
        premium: true,
      },
    },

    ratings: {
      morningstar: 5,
      mapReport: 'exzellent',
      finanzkraft: 'AA+',
      assekurataRating: 'A++',
    },

    minContribution: 50,
    maxContribution: 5000,
    minContractDuration: 12,
    minRetirementAge: 62,
    maxEntryAge: 65,

    highlights: [
      'Über 150 Fonds zur Auswahl',
      'Höchste Ratings',
      'Maximale Flexibilität',
      '80% Beitragsgarantie',
      '4 kostenlose Fondswechsel pro Jahr',
    ],

    bestFor: ['Flexibilität', 'Qualität', 'Sicherheit'],
  },
  {
    id: 'allianz-indexselect',
    provider: 'Allianz',
    productName: 'IndexSelect',
    productCode: 'IS-2024',
    description: 'Kostengünstige Index-Lösung mit ETF-Portfolio',

    guaranteeLevel: 50,
    guaranteeType: 'nominal',

    costs: {
      abschlusskosten: 3.0,
      vertriebskosten: 2.0,
      verwaltungskosten: 0.65,
      fondskosten: 0.5, // ETFs sind günstiger!
      garantiekosten: 0.25,
      risikokosten: 0.12,
      effectiveCostRatio: 0.95,
    },

    availableFunds: SAMPLE_FUNDS.filter(f => f.isin.includes('Xtrackers')),

    features: {
      zuzahlungenMoeglich: true,
      minZuzahlung: 500,
      maxZuzahlungProJahr: 15000,

      entnahmenMoeglich: true,
      minEntnahme: 1000,
      maxEntnahmePercent: 40,

      beitragsfreistellungMoeglich: true,
      minBeitragsfreistellungMonate: 1,

      dynamikMoeglich: true,
      dynamikProzent: 3,

      fondswechselMoeglich: true,
      fondswechselFreiProJahr: 6,
      fondswechselKosten: 0,
    },

    payoutOptions: {
      einmalkapital: true,
      teilverrentung: true,
      vollverrentung: true,
      auszahlplan: true,
      rentengarantiezeit: 10,
      hinterbliebenenabsicherung: true,
      hinterbliebenenProzent: 60,
    },

    deathBenefit: {
      duringAccumulation: 1.05,
      options: {
        basic: true,
        enhanced: true,
        premium: false,
      },
    },

    ratings: {
      morningstar: 5,
      mapReport: 'sehr gut',
      finanzkraft: 'AA+',
    },

    minContribution: 100,
    maxContribution: 5000,
    minContractDuration: 12,
    minRetirementAge: 62,
    maxEntryAge: 67,

    highlights: [
      'Niedrigste Kosten (0,95% effektiv)',
      'ETF-Portfolio',
      '6 kostenlose Fondswechsel pro Jahr',
      'Hohe Renditeerwartung',
    ],

    bestFor: ['Kostenoptimiert', 'Performance', 'ETF-Fans'],
  },
];

// AXA Products
export const AXA_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'axa-relax-rente',
    provider: 'AXA',
    productName: 'Relax Rente',
    productCode: 'RR-2024',
    description: 'Ausgewogenes Produkt mit guter Balance zwischen Kosten und Leistung',

    guaranteeLevel: 50,
    guaranteeType: 'nominal',

    costs: {
      abschlusskosten: 3.5,
      vertriebskosten: 2.0,
      verwaltungskosten: 0.75,
      fondskosten: 1.1,
      garantiekosten: 0.20,
      risikokosten: 0.14,
      effectiveCostRatio: 1.15,
    },

    availableFunds: SAMPLE_FUNDS,

    features: {
      zuzahlungenMoeglich: true,
      minZuzahlung: 500,
      maxZuzahlungProJahr: 12000,

      entnahmenMoeglich: true,
      minEntnahme: 1000,
      maxEntnahmePercent: 25,

      beitragsfreistellungMoeglich: true,
      minBeitragsfreistellungMonate: 3,

      dynamikMoeglich: true,
      dynamikProzent: 3,

      fondswechselMoeglich: true,
      fondswechselFreiProJahr: 3,
      fondswechselKosten: 30,
    },

    payoutOptions: {
      einmalkapital: true,
      teilverrentung: true,
      vollverrentung: true,
      auszahlplan: true,
      rentengarantiezeit: 10,
      hinterbliebenenabsicherung: true,
      hinterbliebenenProzent: 60,
    },

    deathBenefit: {
      duringAccumulation: 1.1,
      options: {
        basic: true,
        enhanced: true,
        premium: true,
      },
    },

    ratings: {
      morningstar: 4,
      mapReport: 'sehr gut',
      finanzkraft: 'AA',
    },

    minContribution: 50,
    maxContribution: 4000,
    minContractDuration: 12,
    minRetirementAge: 62,
    maxEntryAge: 65,

    highlights: [
      'Attraktives Preis-Leistungs-Verhältnis',
      'Gute Fondsauswahl (80+ Fonds)',
      'Solide Garantien',
      'Starke Ratings',
    ],

    bestFor: ['Preis-Leistung', 'Ausgeglichenheit', 'Verlässlichkeit'],
  },
];

// Generali Products
export const GENERALI_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'generali-investflex',
    provider: 'Generali',
    productName: 'InvestFlex',
    productCode: 'IF-2024',
    description: 'Sicherheitsorientiertes Produkt mit 100% Beitragsgarantie',

    guaranteeLevel: 100,
    guaranteeType: 'nominal',

    costs: {
      abschlusskosten: 4.5,
      vertriebskosten: 2.5,
      verwaltungskosten: 0.95,
      fondskosten: 1.3,
      garantiekosten: 0.55, // Höher wegen 100% Garantie
      risikokosten: 0.16,
      effectiveCostRatio: 1.75,
    },

    availableFunds: SAMPLE_FUNDS,

    features: {
      zuzahlungenMoeglich: false, // Bei 100% Garantie oft eingeschränkt

      entnahmenMoeglich: true,
      minEntnahme: 1500,
      maxEntnahmePercent: 20,

      beitragsfreistellungMoeglich: true,
      minBeitragsfreistellungMonate: 6,

      dynamikMoeglich: true,
      dynamikProzent: 2,

      fondswechselMoeglich: true,
      fondswechselFreiProJahr: 2,
      fondswechselKosten: 35,
    },

    payoutOptions: {
      einmalkapital: true,
      teilverrentung: true,
      vollverrentung: true,
      auszahlplan: true,
      rentengarantiezeit: 15,
      hinterbliebenenabsicherung: true,
      hinterbliebenenProzent: 70,
    },

    deathBenefit: {
      duringAccumulation: 1.15,
      options: {
        basic: true,
        enhanced: true,
        premium: true,
      },
    },

    ratings: {
      morningstar: 4,
      mapReport: 'sehr gut',
      finanzkraft: 'AA',
    },

    minContribution: 75,
    maxContribution: 3500,
    minContractDuration: 12,
    minRetirementAge: 62,
    maxEntryAge: 63,

    highlights: [
      '100% Beitragsgarantie - Höchste Sicherheit!',
      '200+ Fonds verfügbar',
      '15 Jahre Rentengarantiezeit',
      '70% Hinterbliebenenrente',
      'Erhöhter Todesfallschutz (115%)',
    ],

    bestFor: ['Sicherheit', 'Garantie', 'Absicherung'],
  },
];

// Zurich Products
export const ZURICH_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'zurich-varioselect',
    provider: 'Zurich',
    productName: 'VarioSelect',
    productCode: 'VS-2024',
    description: 'Ausgewogenes Produkt mit guter Flexibilität',

    guaranteeLevel: 80,
    guaranteeType: 'nominal',

    costs: {
      abschlusskosten: 3.8,
      vertriebskosten: 2.3,
      verwaltungskosten: 0.80,
      fondskosten: 1.15,
      garantiekosten: 0.32,
      risikokosten: 0.15,
      effectiveCostRatio: 1.35,
    },

    availableFunds: SAMPLE_FUNDS,

    features: {
      zuzahlungenMoeglich: true,
      minZuzahlung: 500,
      maxZuzahlungProJahr: 15000,

      entnahmenMoeglich: true,
      minEntnahme: 1000,
      maxEntnahmePercent: 35,

      beitragsfreistellungMoeglich: true,
      minBeitragsfreistellungMonate: 1,

      dynamikMoeglich: true,
      dynamikProzent: 3,

      fondswechselMoeglich: true,
      fondswechselFreiProJahr: 4,
      fondswechselKosten: 20,
    },

    payoutOptions: {
      einmalkapital: true,
      teilverrentung: true,
      vollverrentung: true,
      auszahlplan: true,
      rentengarantiezeit: 12,
      hinterbliebenenabsicherung: true,
      hinterbliebenenProzent: 60,
    },

    deathBenefit: {
      duringAccumulation: 1.1,
      options: {
        basic: true,
        enhanced: true,
        premium: true,
      },
    },

    ratings: {
      morningstar: 4,
      mapReport: 'sehr gut',
      finanzkraft: 'AA',
    },

    minContribution: 50,
    maxContribution: 4500,
    minContractDuration: 12,
    minRetirementAge: 62,
    maxEntryAge: 65,

    highlights: [
      '120+ Fonds zur Auswahl',
      'Gutes Preis-Leistungs-Verhältnis',
      'Flexible Handhabung',
      'Solide Ratings',
    ],

    bestFor: ['Flexibilität', 'Preis-Leistung', 'Ausgewogenheit'],
  },
];

// Canada Life Products
export const CANADA_LIFE_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'canada-life-generation-plus',
    provider: 'Canada Life',
    productName: 'Generation Plus',
    productCode: 'GP-2024',
    description: 'Keine Garantie, dafür niedrige Kosten und hohe Renditechancen',

    guaranteeLevel: 0,
    guaranteeType: 'nominal',

    costs: {
      abschlusskosten: 2.5,
      vertriebskosten: 1.5,
      verwaltungskosten: 0.55,
      fondskosten: 0.95,
      garantiekosten: 0, // Keine Garantie = keine Garantiekosten!
      risikokosten: 0.12,
      effectiveCostRatio: 0.75,
    },

    availableFunds: SAMPLE_FUNDS,

    features: {
      zuzahlungenMoeglich: true,
      minZuzahlung: 250,
      maxZuzahlungProJahr: 20000,

      entnahmenMoeglich: true,
      minEntnahme: 500,
      maxEntnahmePercent: 50,

      beitragsfreistellungMoeglich: true,
      minBeitragsfreistellungMonate: 1,

      dynamikMoeglich: true,
      dynamikProzent: 5,

      fondswechselMoeglich: true,
      fondswechselFreiProJahr: 12,
      fondswechselKosten: 0,
    },

    payoutOptions: {
      einmalkapital: true,
      teilverrentung: true,
      vollverrentung: true,
      auszahlplan: true,
      rentengarantiezeit: 10,
      hinterbliebenenabsicherung: true,
      hinterbliebenenProzent: 60,
    },

    deathBenefit: {
      duringAccumulation: 1.0,
      options: {
        basic: true,
        enhanced: false,
        premium: false,
      },
    },

    ratings: {
      morningstar: 3,
      mapReport: 'gut',
      finanzkraft: 'A+',
    },

    minContribution: 50,
    maxContribution: 10000,
    minContractDuration: 12,
    minRetirementAge: 62,
    maxEntryAge: 70,

    highlights: [
      'Niedrigste Kosten (0,75% effektiv)!',
      'Höchste Flexibilität',
      '12 kostenlose Fondswechsel pro Jahr',
      'Für renditeorientierte Anleger',
      'Keine Garantiekosten',
    ],

    bestFor: ['Performance', 'Kostenoptimiert', 'Flexibilität'],
  },
];

// All Products Combined
export const ALL_INSURANCE_PRODUCTS: InsuranceProduct[] = [
  ...ALLIANZ_PRODUCTS,
  ...AXA_PRODUCTS,
  ...GENERALI_PRODUCTS,
  ...ZURICH_PRODUCTS,
  ...CANADA_LIFE_PRODUCTS,
];

// Provider Information
export const INSURANCE_PROVIDERS: InsuranceProvider[] = [
  {
    id: 'allianz',
    name: 'Allianz',
    ratings: {
      finanzkraft: 'AA+',
      mapReport: 'exzellent',
      assekurataRating: 'A++',
    },
    products: ALLIANZ_PRODUCTS,
    uniqueFeatures: [
      'Marktführer in Deutschland',
      'Über 150 Fonds zur Auswahl',
      'Höchste Ratings',
      'Umfangreiche Online-Services',
    ],
    marketPosition: 'Premium-Anbieter mit höchsten Qualitätsstandards',
  },
  {
    id: 'axa',
    name: 'AXA',
    ratings: {
      finanzkraft: 'AA',
      mapReport: 'sehr gut',
    },
    products: AXA_PRODUCTS,
    uniqueFeatures: [
      'Attraktives Preis-Leistungs-Verhältnis',
      'Gute Fondsauswahl',
      'Ausgewogene Produktpalette',
    ],
    marketPosition: 'Solider Anbieter im mittleren Preissegment',
  },
  {
    id: 'generali',
    name: 'Generali',
    ratings: {
      finanzkraft: 'AA',
      mapReport: 'sehr gut',
    },
    products: GENERALI_PRODUCTS,
    uniqueFeatures: [
      '100% Beitragsgarantie verfügbar',
      'Sicherheitsorientiert',
      'Über 200 Fonds',
      'Hoher Todesfallschutz',
    ],
    marketPosition: 'Fokus auf Sicherheit und Garantien',
  },
  {
    id: 'zurich',
    name: 'Zurich',
    ratings: {
      finanzkraft: 'AA',
      mapReport: 'sehr gut',
    },
    products: ZURICH_PRODUCTS,
    uniqueFeatures: [
      'Ausgewogene Produktgestaltung',
      'Flexible Handhabung',
      'Gutes Preis-Leistungs-Verhältnis',
    ],
    marketPosition: 'Verlässlicher Partner mit gutem Gesamtpaket',
  },
  {
    id: 'canada-life',
    name: 'Canada Life',
    ratings: {
      finanzkraft: 'A+',
      mapReport: 'gut',
    },
    products: CANADA_LIFE_PRODUCTS,
    uniqueFeatures: [
      'Niedrigste Kosten am Markt',
      'Höchste Flexibilität',
      'Für renditeorientierte Kunden',
      'Keine Garantiekosten',
    ],
    marketPosition: 'Low-Cost-Anbieter für Performance-orientierte Anleger',
  },
];
