import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Lock, Users, Database, FileText, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Datenschutz() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
          <p className="text-lg text-gray-600">
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO
          </p>
        </div>

        <div className="grid gap-6">
          {/* Verantwortlicher */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Verantwortlicher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Finanzrechner Pro GmbH</strong><br />
                  Musterstraße 123<br />
                  10115 Berlin, Deutschland<br />
                  E-Mail: datenschutz@finanzrechner-pro.de<br />
                  Telefon: +49 (0) 30 12345678
                </p>
                <p className="text-sm text-gray-600">
                  Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer 
                  nationaler Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher 
                  Bestimmungen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Datenschutzbeauftragter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Datenschutzbeauftragter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Dr. Maria Datenschutz</strong><br />
                  Datenschutz & Compliance GmbH<br />
                  Datenschutzstraße 456<br />
                  10117 Berlin, Deutschland<br />
                  E-Mail: dsb@finanzrechner-pro.de<br />
                  Telefon: +49 (0) 30 87654321
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Allgemeine Hinweise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Allgemeine Hinweise zur Datenverarbeitung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Umfang der Verarbeitung personenbezogener Daten</h4>
                <p className="text-gray-700 text-sm">
                  Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies 
                  zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen 
                  erforderlich ist. Die Verarbeitung personenbezogener Daten unserer Nutzer erfolgt 
                  regelmäßig nur nach Einwilligung des Nutzers.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Rechtsgrundlage für die Verarbeitung</h4>
                <p className="text-gray-700 text-sm">
                  Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der 
                  betroffenen Person einholen, dient Art. 6 Abs. 1 lit. a EU-Datenschutzgrundverordnung 
                  (DSGVO) als Rechtsgrundlage. Bei der Verarbeitung von personenbezogenen Daten, die zur 
                  Erfüllung eines Vertrages erforderlich ist, dient Art. 6 Abs. 1 lit. b DSGVO als 
                  Rechtsgrundlage.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Website-Nutzung */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Datenverarbeitung bei Website-Nutzung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Server-Log-Dateien</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in 
                  so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt:
                </p>
                <ul className="text-gray-700 text-sm space-y-1 ml-4">
                  <li>• Browsertyp und Browserversion</li>
                  <li>• Verwendetes Betriebssystem</li>
                  <li>• Referrer URL</li>
                  <li>• Hostname des zugreifenden Rechners</li>
                  <li>• Uhrzeit der Serveranfrage</li>
                  <li>• IP-Adresse (anonymisiert)</li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)<br />
                  <strong>Speicherdauer:</strong> 7 Tage
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Kontaktformular</h4>
                <p className="text-gray-700 text-sm">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                  dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                  Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)<br />
                  <strong>Speicherdauer:</strong> Bis zur vollständigen Bearbeitung Ihrer Anfrage
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Cookies und Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Notwendige Cookies</h4>
                <p className="text-gray-700 text-sm">
                  Diese Cookies sind für die Grundfunktionen der Website erforderlich und können 
                  nicht deaktiviert werden. Sie speichern keine persönlich identifizierbaren Informationen.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Analytische Cookies</h4>
                <p className="text-gray-700 text-sm">
                  Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                  indem sie Informationen anonym sammeln und melden.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)<br />
                  <strong>Speicherdauer:</strong> 24 Monate
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Marketing Cookies</h4>
                <p className="text-gray-700 text-sm">
                  Diese Cookies werden verwendet, um Besuchern auf Webseiten zu folgen. 
                  Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen 
                  Benutzer sind.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)<br />
                  <strong>Speicherdauer:</strong> 12 Monate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Drittanbieter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Drittanbieter-Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Google Analytics</h4>
                <p className="text-gray-700 text-sm">
                  Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. 
                  Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  Google Analytics verwendet Cookies, die eine Analyse der Benutzung der Website 
                  durch Sie ermöglichen. Wir haben Google Analytics so konfiguriert, dass die 
                  IP-Adressen der Besucher anonymisiert werden.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Content Delivery Network (CDN)</h4>
                <p className="text-gray-700 text-sm">
                  Wir setzen ein Content Delivery Network (CDN) ein. Ein CDN ist ein Dienst, 
                  mit dessen Hilfe Inhalte unseres Onlineangebotes, insbesondere große Mediendateien, 
                  wie Grafiken oder Programm-Skripte, mit Hilfe regional verteilter Server schneller 
                  ausgeliefert werden können.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Betroffenenrechte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                Ihre Rechte als betroffene Person
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Auskunftsrecht (Art. 15 DSGVO)</h4>
                  <p className="text-gray-700 text-sm">
                    Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen 
                    Daten zu verlangen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Berichtigungsrecht (Art. 16 DSGVO)</h4>
                  <p className="text-gray-700 text-sm">
                    Sie haben das Recht, unverzüglich die Berichtigung unrichtiger oder 
                    Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Löschungsrecht (Art. 17 DSGVO)</h4>
                  <p className="text-gray-700 text-sm">
                    Sie haben das Recht, die Löschung Ihrer bei uns gespeicherten personenbezogenen 
                    Daten zu verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf 
                    freie Meinungsäußerung erforderlich ist.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Einschränkungsrecht (Art. 18 DSGVO)</h4>
                  <p className="text-gray-700 text-sm">
                    Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen 
                    Daten zu verlangen.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Datenübertragbarkeit (Art. 20 DSGVO)</h4>
                  <p className="text-gray-700 text-sm">
                    Sie haben das Recht, Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, 
                    in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Widerspruchsrecht (Art. 21 DSGVO)</h4>
                  <p className="text-gray-700 text-sm">
                    Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, 
                    jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten Widerspruch 
                    einzulegen.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Widerruf der Einwilligung</h4>
                <p className="text-gray-700 text-sm">
                  Sie haben das Recht, erteilte Einwilligungen gemäß Art. 7 Abs. 3 DSGVO mit Wirkung 
                  für die Zukunft zu widerrufen. Dies können Sie jederzeit über unsere Cookie-Einstellungen 
                  oder per E-Mail an datenschutz@finanzrechner-pro.de tun.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Beschwerderecht</h4>
                <p className="text-gray-700 text-sm">
                  Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Zuständig ist die 
                  Aufsichtsbehörde Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder unseres 
                  Firmensitzes.
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  <strong>Berliner Beauftragte für Datenschutz und Informationsfreiheit</strong><br />
                  Friedrichstr. 219, 10969 Berlin<br />
                  Telefon: +49 (0) 30 13889-0<br />
                  E-Mail: mailbox@datenschutz-berlin.de
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Datensicherheit */}
          <Card>
            <CardHeader>
              <CardTitle>Datensicherheit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) 
                in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. 
                In der Regel handelt es sich dabei um eine 256 Bit Verschlüsselung.
              </p>
              
              <p className="text-gray-700 text-sm">
                Wir bedienen uns geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, 
                um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen 
                Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
              </p>
            </CardContent>
          </Card>

          {/* Änderungen */}
          <Card>
            <CardHeader>
              <CardTitle>Änderungen der Datenschutzerklärung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
                aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen 
                in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue 
                Datenschutzerklärung.
              </p>
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