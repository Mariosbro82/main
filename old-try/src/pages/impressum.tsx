import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Building, Scale, ArrowLeft, Home } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Impressum() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            Startseite
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Impressum</h1>
          <p className="text-lg text-gray-600">
            Angaben gemäß § 5 TMG (Telemediengesetz)
          </p>
        </div>

        <div className="grid gap-6">
          {/* Anbieter-Informationen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Anbieter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Finanzrechner Pro GmbH</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Musterstraße 123, 10115 Berlin, Deutschland</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Geschäftsführung</h4>
                  <p className="text-gray-700">Max Mustermann</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Handelsregister</h4>
                  <p className="text-gray-700">HRB 12345 B</p>
                  <p className="text-gray-700">Amtsgericht Berlin-Charlottenburg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontaktdaten */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Kontakt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">+49 (0) 30 12345678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href="mailto:info@finanzrechner-pro.de" className="text-blue-600 hover:underline">
                      info@finanzrechner-pro.de
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Geschäftszeiten</h4>
                  <div className="text-gray-700 text-sm space-y-1">
                    <p>Montag - Freitag: 9:00 - 18:00 Uhr</p>
                    <p>Samstag: 10:00 - 14:00 Uhr</p>
                    <p>Sonntag: Geschlossen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steuerliche Angaben */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Steuerliche Angaben
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Umsatzsteuer-ID</h4>
                  <p className="text-gray-700">DE123456789</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Gemäß § 27a Umsatzsteuergesetz
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Wirtschafts-ID</h4>
                  <p className="text-gray-700">DE123456789</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verantwortlicher für den Inhalt */}
          <Card>
            <CardHeader>
              <CardTitle>Verantwortlicher für den Inhalt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Verantwortlich nach § 55 Abs. 2 RStV:</strong>
                </p>
                <p className="text-gray-700">Max Mustermann</p>
                <p className="text-gray-700">Musterstraße 123</p>
                <p className="text-gray-700">10115 Berlin, Deutschland</p>
              </div>
            </CardContent>
          </Card>

          {/* Berufsrechtliche Regelungen */}
          <Card>
            <CardHeader>
              <CardTitle>Berufsrechtliche Regelungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Aufsichtsbehörde</h4>
                <p className="text-gray-700">Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)</p>
                <p className="text-gray-700">Graurheindorfer Straße 108</p>
                <p className="text-gray-700">53117 Bonn</p>
                <a href="https://www.bafin.de" className="text-blue-600 hover:underline">
                  www.bafin.de
                </a>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Berufsbezeichnung</h4>
                <p className="text-gray-700">Finanzdienstleistungen (verliehen in Deutschland)</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Berufsrechtliche Regelungen</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Kreditwesengesetz (KWG)</li>
                  <li>• Wertpapierhandelsgesetz (WpHG)</li>
                  <li>• Versicherungsaufsichtsgesetz (VAG)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* EU-Streitschlichtung */}
          <Card>
            <CardHeader>
              <CardTitle>EU-Streitschlichtung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              <p className="text-gray-700">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </CardContent>
          </Card>

          {/* Verbraucherstreitbeilegung */}
          <Card>
            <CardHeader>
              <CardTitle>Verbraucherstreitbeilegung/Universalschlichtungsstelle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </CardContent>
          </Card>

          {/* Haftungsausschluss */}
          <Card>
            <CardHeader>
              <CardTitle>Haftungsausschluss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Haftung für Inhalte</h4>
                <p className="text-gray-700 text-sm">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                  nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                  Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                  fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                  rechtswidrige Tätigkeit hinweisen.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Haftung für Links</h4>
                <p className="text-gray-700 text-sm">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
                  der Seiten verantwortlich.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Urheberrecht</h4>
                <p className="text-gray-700 text-sm">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                  dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                  der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                  Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Letzte Aktualisierung */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-sm text-gray-500">
                Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}