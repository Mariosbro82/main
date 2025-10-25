import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  TrendingUp,
  Shield,
  Wallet,
  PiggyBank,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  language?: 'de' | 'en';
}

type QuickActionConfig = {
  title: string;
  copy: string;
  actions: {
    title: string;
    description: string;
    iconColor: string;
    icon: LucideIcon;
    link: string;
  }[];
};

const QuickActionCTA: Record<'de' | 'en', QuickActionConfig> = {
  de: {
    title: 'Schnellzugriff',
    copy: 'Wählen Sie eine Aktion, um Ihre Altersvorsorge zu optimieren.',
    actions: [
      {
        title: 'Private Rente berechnen',
        description: 'Individuelle Simulation Ihrer Vorsorge',
        iconColor: 'text-primary',
        icon: Wallet,
        link: '/calculator',
      },
      {
        title: 'Optionen vergleichen',
        description: 'Vergleichen Sie unterschiedliche Produkte',
        iconColor: 'text-emerald-600',
        icon: TrendingUp,
        link: '/calculator',
      },
      {
        title: 'Alle Rentenarten ansehen',
        description: 'Überblick über gesetzliche & private Renten',
        iconColor: 'text-purple-600',
        icon: Shield,
        link: '/calculator',
      },
    ],
  },
  en: {
    title: 'Quick Actions',
    copy: 'Pick an action to optimise your retirement plan.',
    actions: [
      {
        title: 'Calculate private pension',
        description: 'Personal simulation for your portfolio',
        iconColor: 'text-primary',
        icon: Wallet,
        link: '/calculator',
      },
      {
        title: 'Compare options',
        description: 'See how different products stack up',
        iconColor: 'text-emerald-600',
        icon: TrendingUp,
        link: '/calculator',
      },
      {
        title: 'View all pensions',
        description: 'Overview of statutory & private pensions',
        iconColor: 'text-purple-600',
        icon: Shield,
        link: '/calculator',
      },
    ],
  },
} as const;

const formatMetricValue = (value: number, formatter: (v: number) => string) =>
  formatter(Number.isFinite(value) ? value : 0);

const MetricCard = ({
  title,
  icon,
  value,
  formatter,
  description,
  valueClassName,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  formatter: (value: number) => string;
  description?: string;
  valueClassName?: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
        {title}
        {icon}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-1">
      <p className={`text-2xl font-semibold ${valueClassName ?? 'text-foreground'}`}>
        {formatMetricValue(value, formatter)}
      </p>
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
    </CardContent>
  </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ language = 'de' }) => {
  const { data, isCompleted } = useOnboardingStore();
  const [, setLocation] = useLocation();

  const summary = useMemo(() => {
    const personal = data.personal || {};
    const income = data.income || {};
    const pensions = data.pensions || {};
    const riester = data.riester || {};
    const ruerup = data.ruerup || {};
    const occupational = data.occupationalPension || {};
    const privatePension = data.privatePension || {};
    const lifeInsurance = data.lifeInsurance || {};
    const funds = data.funds || {};
    const savings = data.savings || {};

    const isMarriedBoth =
      personal.maritalStatus === 'verheiratet' && personal.calcScope === 'beide_personen';

    const netMonthly = isMarriedBoth
      ? (income.netMonthly_A || 0) + (income.netMonthly_B || 0)
      : income.netMonthly || 0;

    const totalStatutoryPension = isMarriedBoth
      ? (pensions.public67_A || 0) +
        (pensions.public67_B || 0) +
        (pensions.civil67_A || 0) +
        (pensions.civil67_B || 0) +
        (pensions.profession67_A || 0) +
        (pensions.profession67_B || 0) +
        (pensions.zvkVbl67_A || 0) +
        (pensions.zvkVbl67_B || 0)
      : (pensions.public67 || 0) +
        (pensions.civil67 || 0) +
        (pensions.profession67 || 0) +
        (pensions.zvkVbl67 || 0);

    const riesterAmount = isMarriedBoth
      ? (riester.amount_A || 0) + (riester.amount_B || 0)
      : riester.amount || 0;
    const ruerupAmount = isMarriedBoth
      ? (ruerup.amount_A || 0) + (ruerup.amount_B || 0)
      : ruerup.amount || 0;
    const occupationalAmount = isMarriedBoth
      ? (occupational.amount_A || 0) + (occupational.amount_B || 0)
      : occupational.amount || 0;

    // Calculate estimated monthly payout from private pension contributions
    const privatePensionContribution = isMarriedBoth
      ? (privatePension.contribution_A || 0) + (privatePension.contribution_B || 0)
      : privatePension.contribution || 0;

    // Estimate monthly payout from private pension based on contributions
    // Assumptions: 5% return, accumulation from current age to 67, then 4% withdrawal rate
    const currentAge = personal.age || 30;
    const retirementAge = 67;
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const expectedReturn = 0.05; // 5% annual return
    const withdrawalRate = 0.04; // 4% annual withdrawal rate

    let privatePensionMonthlyPayout = 0;
    if (privatePensionContribution > 0 && yearsToRetirement > 0) {
      // Future value of monthly contributions (annuity)
      const monthlyRate = expectedReturn / 12;
      const totalMonths = yearsToRetirement * 12;
      const futureValue = privatePensionContribution *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);

      // Convert to monthly payout using withdrawal rate
      privatePensionMonthlyPayout = (futureValue * withdrawalRate) / 12;
    }

    const lifeInsuranceSum = isMarriedBoth
      ? (lifeInsurance.sum_A || 0) + (lifeInsurance.sum_B || 0)
      : lifeInsurance.sum || 0;
    const fundsBalance = isMarriedBoth
      ? (funds.balance_A || 0) + (funds.balance_B || 0)
      : funds.balance || 0;
    const savingsBalance = isMarriedBoth
      ? (savings.balance_A || 0) + (savings.balance_B || 0)
      : savings.balance || 0;

    const totalAssets = lifeInsuranceSum + fundsBalance + savingsBalance;
    const totalRetirementIncome =
      totalStatutoryPension + riesterAmount + ruerupAmount + occupationalAmount + privatePensionMonthlyPayout;
    const replacementRatio = netMonthly > 0 ? (totalRetirementIncome / netMonthly) * 100 : 0;
    // Coverage gap calculation per specification: Gap = (Net Income × 0.8) – (Statutory Pension + Private Pension)
    const pensionGap = Math.max(0, netMonthly * 0.8 - (totalStatutoryPension + privatePensionMonthlyPayout));

    return {
      age: personal.age || 0,
      maritalStatus: personal.maritalStatus || 'ledig',
      children: personal.children?.count ?? 0,
      netMonthly,
      totalStatutoryPension,
      riesterAmount,
      ruerupAmount,
      occupationalAmount,
      privatePensionMonthlyPayout,
      totalRetirementIncome,
      totalAssets,
      replacementRatio,
      pensionGap,
    };
  }, [data]);

  const incomeTimelineData = useMemo(() => {
    const timeline = [];
    const currentAge = summary.age || 30;
    const retirementAge = 67;

    for (let age = currentAge; age < retirementAge; age += 5) {
      timeline.push({
        age,
        aktuellesEinkommen: summary.netMonthly,
        rentenEinkommen: 0,
      });
    }
    for (let age = retirementAge; age <= 85; age += 5) {
      timeline.push({
        age,
        aktuellesEinkommen: 0,
        rentenEinkommen: summary.totalRetirementIncome,
      });
    }
    return timeline;
  }, [summary]);

  const pensionBreakdownData = useMemo(() => {
    const breakdown: { name: string; value: number; color: string }[] = [];

    if (summary.totalStatutoryPension > 0) {
      breakdown.push({
        name: language === 'de' ? 'Gesetzliche Rente' : 'Statutory pension',
        value: summary.totalStatutoryPension,
        color: '#0ea5e9',
      });
    }
    if (summary.riesterAmount > 0) {
      breakdown.push({
        name: 'Riester',
        value: summary.riesterAmount,
        color: '#f97316',
      });
    }
    if (summary.ruerupAmount > 0) {
      breakdown.push({
        name: 'Rürup',
        value: summary.ruerupAmount,
        color: '#8b5cf6',
      });
    }
    if (summary.occupationalAmount > 0) {
      breakdown.push({
        name: language === 'de' ? 'Betriebsrente' : 'Occupational pension',
        value: summary.occupationalAmount,
        color: '#22c55e',
      });
    }
    return breakdown;
  }, [language, summary]);

  const texts = {
    de: {
      welcome: 'Willkommen zurück',
      overview: 'Ihr persönliches Cockpit für die Altersvorsorge.',
      currentIncome: 'Aktuelles Netto-Einkommen',
      retirementIncome: 'Erwartetes Renteneinkommen',
      pensionGap: 'Versorgungslücke',
      replacementRatio: 'Versorgungsquote',
      totalAssets: 'Gesamtvermögen',
      perMonth: '/Monat',
      atAge: 'mit 67 Jahren',
      personalInfo: 'Persönliche Daten',
      age: 'Alter',
      maritalStatus: 'Familienstand',
      children: 'Kinder',
      quickActions: QuickActionCTA.de,
      incomeTimeline: 'Einkommensentwicklung',
      pensionBreakdown: 'Renten-Zusammensetzung',
      planNow: 'Jetzt vorsorgen',
      pensionGapHeadline: 'Versorgungslücke erkannt',
      ledig: 'Ledig',
      verheiratet: 'Verheiratet',
      geschieden: 'Geschieden',
      dauernd_getrennt: 'Dauernd getrennt',
      verwitwet: 'Verwitwet',
      emptyStateMessage: 'Bitte schließen Sie das Onboarding ab, um personalisierte Auswertungen zu sehen.',
      startOnboarding: 'Onboarding starten',
    },
    en: {
      welcome: 'Welcome back',
      overview: 'Your personalised retirement cockpit.',
      currentIncome: 'Current net income',
      retirementIncome: 'Expected retirement income',
      pensionGap: 'Pension gap',
      replacementRatio: 'Replacement ratio',
      totalAssets: 'Total assets',
      perMonth: '/month',
      atAge: 'at age 67',
      personalInfo: 'Personal information',
      age: 'Age',
      maritalStatus: 'Marital status',
      children: 'Children',
      quickActions: QuickActionCTA.en,
      incomeTimeline: 'Income timeline',
      pensionBreakdown: 'Pension breakdown',
      planNow: 'Plan now',
      pensionGapHeadline: 'Pension gap detected',
      ledig: 'Single',
      verheiratet: 'Married',
      geschieden: 'Divorced',
      dauernd_getrennt: 'Separated',
      verwitwet: 'Widowed',
      emptyStateMessage: 'Complete the onboarding to see personalised insights.',
      startOnboarding: 'Start onboarding',
    },
  } as const;

  const t = texts[language];

  const QuickActionsCard = QuickActionCTA[language];

  // Check if onboarding is completed OR has meaningful data
  const hasData = isCompleted || (summary.netMonthly > 0 && summary.age > 0);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.welcome}
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">{t.overview}</p>
        </header>

        {/* Empty State: Onboarding NOT completed */}
        {!hasData && (
          <div className="flex flex-col items-center justify-center py-20">
            <Card className="max-w-2xl w-full">
              <CardContent className="flex flex-col items-center text-center py-12 px-6">
                <div className="mb-6 rounded-full bg-primary/10 p-6">
                  <User className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-foreground">
                  {language === 'de' ? 'Willkommen!' : 'Welcome!'}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {t.emptyStateMessage}
                </p>
                <Button
                  size="lg"
                  onClick={() => setLocation('/calculator')}
                  className="gap-2"
                >
                  {t.startOnboarding}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions still visible in empty state */}
            <section className="mt-10 w-full max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col gap-1 text-base font-semibold">
                    <span>{QuickActionsCard.title}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {QuickActionsCard.copy}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-3">
                    {QuickActionsCard.actions.map((action) => (
                      <Button
                        key={action.title}
                        variant="outline"
                        className="h-auto justify-start gap-3 rounded-xl border-dashed p-4 text-left transition hover:border-primary hover:bg-primary/5"
                        onClick={() => setLocation(action.link)}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ${action.iconColor}`}
                        >
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-foreground">{action.title}</span>
                          <span className="text-xs text-muted-foreground">{action.description}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* Main Dashboard: Onboarding IS completed */}
        {hasData && (
          <>
            <section className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title={t.currentIncome}
            icon={<Wallet className="h-5 w-5 text-primary" />}
            value={summary.netMonthly}
            formatter={formatCurrency}
            description={t.perMonth}
          />
          <MetricCard
            title={t.retirementIncome}
            icon={<Shield className="h-5 w-5 text-primary" />}
            value={summary.totalRetirementIncome}
            formatter={formatCurrency}
            description={t.atAge}
          />
          <MetricCard
            title={t.pensionGap}
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            value={summary.pensionGap}
            formatter={formatCurrency}
            description={`${t.replacementRatio}: ${
              summary.replacementRatio > 0 ? `${summary.replacementRatio.toFixed(1)}%` : '–'
            }`}
            valueClassName={
              summary.pensionGap > 0 ? 'text-destructive' : 'text-emerald-600'
            }
          />
          <MetricCard
            title={t.totalAssets}
            icon={<PiggyBank className="h-5 w-5 text-primary" />}
            value={summary.totalAssets}
            formatter={formatCurrency}
            description={language === 'de' ? 'Aktueller Stand' : 'Current balance'}
          />
        </section>

        <section className="mb-10 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{t.incomeTimeline}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeTimelineData}>
                  <defs>
                    <linearGradient id="currentIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="retirementIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" tickLine={false} />
                  <YAxis tickLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(age) => `${language === 'de' ? 'Alter' : 'Age'}: ${age}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="aktuellesEinkommen"
                    stroke="#2563eb"
                    fill="url(#currentIncomeGradient)"
                    name={language === 'de' ? 'Netto-Einkommen' : 'Net income'}
                  />
                  <Area
                    type="monotone"
                    dataKey="rentenEinkommen"
                    stroke="#0ea5e9"
                    fill="url(#retirementIncomeGradient)"
                    name={language === 'de' ? 'Renten-Einkommen' : 'Retirement income'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>{t.pensionBreakdown}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pensionBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pensionBreakdownData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col gap-1 text-base font-semibold">
                <span>{QuickActionsCard.title}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {QuickActionsCard.copy}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {QuickActionsCard.actions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-auto justify-start gap-3 rounded-xl border-dashed p-4 text-left transition hover:border-primary hover:bg-primary/5"
                    onClick={() => setLocation(action.link)}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ${action.iconColor}`}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground">{action.title}</span>
                      <span className="text-xs text-muted-foreground">{action.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

            {summary.pensionGap > 0 && (
              <Card className="border border-amber-200 bg-amber-50">
                <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900">{t.pensionGapHeadline}</h3>
                    <p className="text-sm text-amber-800">
                      {language === 'de'
                        ? `Ihre erwartete Rente liegt ${formatCurrency(
                            summary.pensionGap,
                          )} unter dem Ziel von 80% Ihres aktuellen Einkommens.`
                        : `Your expected pension is ${formatCurrency(
                            summary.pensionGap,
                          )} below the target of 80% of your current income.`}
                    </p>
                  </div>
                  <Button
                    onClick={() => setLocation('/calculator')}
                    className="w-full shrink-0 bg-amber-600 text-white hover:bg-amber-700 md:w-auto"
                  >
                    {t.planNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
