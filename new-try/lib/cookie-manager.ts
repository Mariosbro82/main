export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookieConsent {
  necessary: boolean | undefined;
  analytics: boolean;
  marketing: boolean;
  timestamp?: number;
}

export interface CookieSettings {
  consent: CookieConsent;
  bannerShown: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_BANNER_KEY = 'cookie-banner-shown';

export class CookieManager {
  private static instance: CookieManager;
  private listeners: Set<(consent: CookieConsent) => void> = new Set();
  private bannerVisible = true;
  private _consentCache: CookieConsent | null = null;

  private constructor() {
    // Check if consent has been given with caching
    const consent = this.getConsent();
    if (consent.necessary !== undefined) {
      this.bannerVisible = false;
    }
  }

  static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  // Consent-Status abrufen
  getConsent(): CookieConsent {
    // Return cached consent if available
    if (this._consentCache) {
      return this._consentCache;
    }

    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored) {
        this._consentCache = JSON.parse(stored);
        return this._consentCache;
      }
    } catch (error) {
      console.error('Fehler beim Laden der Cookie-Einstellungen:', error);
    }
    
    const defaultConsent = {
      necessary: undefined,
      analytics: false,
      marketing: false,
    };
    
    this._consentCache = defaultConsent;
    return defaultConsent;
  }

  // Consent speichern
  setConsent(consent: Partial<CookieConsent>): void {
    const currentConsent = this.getConsent() || {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    };

    const newConsent: CookieConsent = {
      ...currentConsent,
      ...consent,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
      // Update cache immediately
      this._consentCache = newConsent;
      this.setBannerShown(true);
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => this.notifyListeners(newConsent));
      this.applyCookieSettings(newConsent);
    } catch (error) {
      console.error('Fehler beim Speichern der Cookie-Einstellungen:', error);
    }
  }

  // Alle Cookies akzeptieren
  acceptAll(): void {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    this.setConsent(consent);
  }

  // Nur notwendige Cookies akzeptieren
  acceptNecessaryOnly(): void {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    this.setConsent(consent);
  }

  // Banner-Status prüfen
  isBannerShown(): boolean {
    try {
      return localStorage.getItem(COOKIE_BANNER_KEY) === 'true';
    } catch (error) {
      return false;
    }
  }

  // Banner als angezeigt markieren
  setBannerShown(shown: boolean): void {
    try {
      localStorage.setItem(COOKIE_BANNER_KEY, shown.toString());
    } catch (error) {
      console.error('Fehler beim Speichern des Banner-Status:', error);
    }
  }

  // Prüfen ob Kategorie erlaubt ist
  isAllowed(category: CookieCategory): boolean {
    const consent = this.getConsent();
    if (!consent) return category === 'necessary';
    return consent[category];
  }

  // Listener für Consent-Änderungen
  addConsentListener(listener: (consent: CookieConsent) => void): void {
    this.listeners.add(listener);
  }

  removeConsentListener(listener: (consent: CookieConsent) => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(consent: CookieConsent): void {
    this.listeners.forEach(listener => {
      try {
        listener(consent);
      } catch (error) {
        console.error('Fehler beim Benachrichtigen des Consent-Listeners:', error);
      }
    });
  }

  // Cookie-Einstellungen anwenden
  private applyCookieSettings(consent: CookieConsent): void {
    // Analytics Cookies
    if (!consent.analytics) {
      this.deleteCookiesByCategory('analytics');
    }

    // Marketing Cookies
    if (!consent.marketing) {
      this.deleteCookiesByCategory('marketing');
    }
  }

  // Cookies einer Kategorie löschen
  private deleteCookiesByCategory(category: CookieCategory): void {
    const cookiesToDelete = this.getCookiesByCategory(category);
    cookiesToDelete.forEach(cookieName => {
      this.deleteCookie(cookieName);
    });
  }

  // Cookie löschen
  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  }

  // Cookies nach Kategorie abrufen
  private getCookiesByCategory(category: CookieCategory): string[] {
    const categoryMap: Record<CookieCategory, string[]> = {
      necessary: ['cookie-consent', 'cookie-banner-shown'],
      analytics: ['_ga', '_gid', '_gat', '_gtag'],
      marketing: ['_fbp', '_fbc', 'fr']
    };
    return categoryMap[category] || [];
  }

  // Alle nicht-notwendigen Cookies löschen
  clearAllNonNecessaryCookies(): void {
    const consent = this.getConsent();
    
    // Batch cookie deletion for better performance
    const cookiesToDelete: string[] = [];
    
    // Delete analytics cookies if not consented
    if (!consent.analytics) {
      cookiesToDelete.push('_ga', '_ga_*', '_gid', '_gat');
    }
    
    // Delete marketing cookies if not consented
    if (!consent.marketing) {
      cookiesToDelete.push('_fbp', '_fbc', 'fr');
    }
    
    // Delete cookies in batch
    cookiesToDelete.forEach(cookie => this.deleteCookie(cookie));
  }

  // Consent zurücksetzen (für Entwicklung/Testing)
  resetConsent(): void {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      localStorage.removeItem(COOKIE_BANNER_KEY);
      this.clearAllNonNecessaryCookies();
    } catch (error) {
      console.error('Fehler beim Zurücksetzen der Cookie-Einstellungen:', error);
    }
  }
}

// Singleton-Instanz exportieren
export const cookieManager = CookieManager.getInstance();