import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RangeSlider } from "@/components/ui/range-slider";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowRight, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

const questionsSchema = z.object({
  currentAge: z.number().min(18).max(80),
  startAge: z.number().min(16).max(80),
  termYears: z.number().min(5).max(45),
  monthlyContribution: z.number().min(0),
  startInvestment: z.number().min(0),
  targetMaturityValue: z.union([z.number().min(0), z.literal(0), z.null(), z.undefined()]).optional().nullable(),
  payoutStartAge: z.number().min(62).max(85),
  payoutEndAge: z.number().min(62).max(85),
  payoutMode: z.enum(["annuity", "flex"]),
  annuityRate: z.number().min(0).max(1),
  safeWithdrawalRate: z.number().min(0).max(1).optional(),
  monthlyStatutoryPension: z.number().min(0), // Neue Frage für gesetzliche Rente
});

type QuestionsFormData = z.infer<typeof questionsSchema>;

export default function Questions() {
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const totalSteps = 6;
  const [isStepValid, setIsStepValid] = useState(true);

  const form = useForm<QuestionsFormData>({
    resolver: zodResolver(questionsSchema),
    defaultValues: {
      currentAge: 30,
      startAge: 30,
      termYears: 30,
      monthlyContribution: 500,
      startInvestment: 10000,
      targetMaturityValue: null,
      payoutStartAge: 67,
      payoutEndAge: 85,
      payoutMode: "annuity",
      annuityRate: 0.025,
      safeWithdrawalRate: 0.035,
      monthlyStatutoryPension: 1200, // Standard gesetzliche Rente
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(value);
  };

  const validateCurrentStep = () => {
    const values = form.getValues();
    
    switch (currentStep) {
      case 1:
        return values.currentAge >= 18 && values.currentAge <= 80;
      case 2:
        return values.termYears >= 5 && values.termYears <= 45 && values.monthlyContribution >= 0;
      case 3:
        return values.startInvestment >= 0;
      case 4:
        return values.payoutStartAge >= 62 && values.payoutStartAge <= 85 && 
               values.payoutEndAge >= 62 && values.payoutEndAge <= 85 &&
               values.payoutEndAge > values.payoutStartAge;
      case 5:
        return values.payoutMode && (values.payoutMode === 'annuity' || values.payoutMode === 'flex');
      case 6:
        return values.monthlyStatutoryPension >= 0;
      default:
        return true;
    }
  };

  // Update validation state when form values or current step changes
  useEffect(() => {
    setIsStepValid(validateCurrentStep());
  }, [currentStep, form.watch()]);

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast({
        title: language === 'de' ? 'Ungültige Eingabe' : 'Invalid Input',
        description: language === 'de' ? 'Bitte überprüfen Sie Ihre Eingaben' : 'Please check your inputs',
        variant: 'destructive'
      });
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const formData = form.getValues();
    // Speichere die Daten im localStorage für die Hauptseite
    localStorage.setItem('pensionQuestions', JSON.stringify(formData));
    
    toast({
      title: language === 'de' ? 'Fragen abgeschlossen' : 'Questions completed',
      description: language === 'de' ? 'Ihre Angaben wurden gespeichert' : 'Your information has been saved'
    });
    
    // Weiterleitung zur Hauptseite
    setLocation('/');
  };

  const getStepTitle = (step: number) => {
    const titles = {
      1: language === 'de' ? 'Persönliche Angaben' : 'Personal Information',
      2: language === 'de' ? 'Anlagedauer & Beiträge' : 'Investment Duration & Contributions',
      3: language === 'de' ? 'Startkapital & Zielwert' : 'Initial Capital & Target Value',
      4: language === 'de' ? 'Auszahlungsphase' : 'Payout Phase',
      5: language === 'de' ? 'Auszahlungsmodus' : 'Payout Mode',
      6: language === 'de' ? 'Gesetzliche Rente' : 'Statutory Pension'
    };
    return titles[step as keyof typeof titles] || '';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="currentAge"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <span>{language === 'de' ? 'Aktuelles Alter' : 'Current Age'}</span>
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                        {field.value} {language === 'de' ? 'Jahre' : 'Years'}
                      </div>
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ihr aktuelles Lebensalter' : 'Your current age'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-primary z-10">👤</div>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 25 : Number(e.target.value);
                          if (!isNaN(value) && value >= 18 && value <= 80) {
                            field.onChange(value);
                          }
                        }}
                        className="text-2xl font-bold h-20 pl-14 pr-6 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="text-sm text-muted-foreground font-medium">
                          {language === 'de' ? 'Jahre' : 'years'}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {[25, 35, 45, 55].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => field.onChange(age)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          field.value === age
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="termYears"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <span>{language === 'de' ? 'Anlagedauer' : 'Investment Duration'}</span>
                      <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {field.value} {language === 'de' ? 'Jahre' : 'Years'}
                      </div>
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Wie lange möchten Sie einzahlen?' : 'How long do you want to contribute?'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl p-8 border border-border/30 hover:border-border/60 transition-all duration-300">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-muted-foreground">5 Jahre</span>
                          <span className="text-sm font-medium text-muted-foreground">45 Jahre</span>
                        </div>
                        <RangeSlider
                          min={5}
                          max={45}
                          value={field.value}
                          onValueChange={field.onChange}
                          suffix=" Jahre"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyContribution"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <span>{language === 'de' ? 'Monatlicher Beitrag' : 'Monthly Contribution'}</span>
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                        {formatCurrency(field.value * 12)}/Jahr
                      </div>
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ihr regelmäßiger monatlicher Sparbetrag' : 'Your regular monthly savings amount'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-primary z-10">€</div>
                      <Input
                        type="number"
                        placeholder="500"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            field.onChange(value);
                          }
                        }}
                        className="text-2xl font-bold h-20 pl-14 pr-6 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="startInvestment"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground">
                      {language === 'de' ? 'Startkapital' : 'Initial Capital'}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Einmaliger Betrag zu Beginn der Anlage' : 'One-time amount at the beginning of the investment'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-primary z-10">€</div>
                      <Input
                        type="number"
                        placeholder="10000"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            field.onChange(value);
                          }
                        }}
                        className="text-2xl font-bold h-20 pl-14 pr-6 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetMaturityValue"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground">
                      {language === 'de' ? 'Zielwert (optional)' : 'Target Value (optional)'}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Gewünschter Betrag am Ende der Ansparphase' : 'Desired amount at the end of the savings phase'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-primary z-10">€</div>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          if (value === null || (!isNaN(value) && value >= 0)) {
                            field.onChange(value);
                          }
                        }}
                        className="text-2xl font-bold h-20 pl-14 pr-6 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="payoutStartAge"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground">
                      {language === 'de' ? 'Rentenbeginn' : 'Retirement Start'}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ab welchem Alter möchten Sie Rente beziehen?' : 'From what age do you want to receive pension?'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        type="number"
                        placeholder="67"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value) && value >= 62 && value <= 85) {
                            field.onChange(value);
                          }
                        }}
                        className="text-2xl font-bold h-20 pl-6 pr-6 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payoutEndAge"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground">
                      {language === 'de' ? 'Rentenende' : 'Retirement End'}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Bis zu welchem Alter planen Sie Rentenbezug?' : 'Until what age do you plan to receive pension?'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        type="number"
                        placeholder="85"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (!isNaN(value) && value >= 62 && value <= 85) {
                            field.onChange(value);
                          }
                        }}
                        className="text-2xl font-bold h-20 pl-6 pr-6 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="payoutMode"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground">
                      {language === 'de' ? 'Auszahlungsmodus' : 'Payout Mode'}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Wie möchten Sie Ihre Rente erhalten?' : 'How do you want to receive your pension?'}
                    </p>
                  </div>
                  <FormControl>
                    <SegmentedControl
                      options={[
                        { value: "annuity", label: language === 'de' ? 'Rente' : 'Annuity' },
                        { value: "flex", label: language === 'de' ? 'Flexibel' : 'Flexible' },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("payoutMode") === "annuity" ? (
              <FormField
                control={form.control}
                name="annuityRate"
                render={({ field }) => (
                  <FormItem className="space-y-6">
                    <div className="space-y-2">
                      <FormLabel className="text-lg font-semibold text-foreground">
                        {language === 'de' ? 'Rentenfaktor' : 'Annuity Rate'}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Jährlicher Rentenfaktor in Prozent' : 'Annual annuity rate in percent'}
                      </p>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="2.5"
                          value={field.value * 100}
                          onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                          className="text-2xl font-bold h-20 pl-6 pr-12 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-muted-foreground font-medium">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="safeWithdrawalRate"
                render={({ field }) => (
                  <FormItem className="space-y-6">
                    <div className="space-y-2">
                      <FormLabel className="text-lg font-semibold text-foreground">
                        {language === 'de' ? 'Entnahmerate' : 'Withdrawal Rate'}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Sichere jährliche Entnahmerate in Prozent' : 'Safe annual withdrawal rate in percent'}
                      </p>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="3.5"
                          value={(field.value || 0) * 100}
                          onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                          className="text-2xl font-bold h-20 pl-6 pr-12 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-muted-foreground font-medium">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="monthlyStatutoryPension"
              render={({ field }) => (
                <FormItem className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <span>{language === 'de' ? 'Gesetzliche monatliche Rente' : 'Monthly Statutory Pension'}</span>
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                        {formatCurrency(field.value)}/Monat
                      </div>
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Ihre erwartete gesetzliche Rente pro Monat' : 'Your expected statutory pension per month'}
                    </p>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-primary z-10">🏛️</div>
                      <Input
                        type="number"
                        placeholder="1200"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            field.onChange(value);
                          }
                        }}
                        className="text-2xl font-bold h-20 pl-14 pr-6 bg-gradient-to-r from-background to-accent/20 border-2 border-border/30 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="text-sm text-muted-foreground font-medium">
                          €/Monat
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[800, 1200, 1600].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => field.onChange(amount)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          field.value === amount
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border/50 px-6 py-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <div className="text-primary-foreground font-bold text-lg">?</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {language === 'de' ? 'Zentrale Fragen' : 'Central Questions'}
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {language === 'de' ? 'Ihre Angaben für die Rentenplanung' : 'Your information for retirement planning'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-secondary/80 rounded-xl p-1">
              <button
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  language === 'de' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setLanguage('de')}
              >
                🇩🇪 DE
              </button>
              <button
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  language === 'en' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card/50 px-6 py-4 border-b border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {language === 'de' ? 'Schritt' : 'Step'} {currentStep} {language === 'de' ? 'von' : 'of'} {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-background py-8">
        <div className="max-w-4xl mx-auto px-6">
          <Form {...form}>
            <form className="space-y-8">
              <Card className="border-2 border-border/30 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {getStepTitle(currentStep)}
                    </h2>
                    <div className="w-16 h-1 bg-primary rounded-full"></div>
                  </div>
                  
                  {renderStep()}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-3 rounded-xl"
                >
                  {language === 'de' ? 'Zurück' : 'Previous'}
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid}
                    className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                      isStepValid 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {language === 'de' ? 'Weiter' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleComplete}
                    className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {language === 'de' ? 'Abschließen' : 'Complete'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}