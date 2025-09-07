import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, CreditCard, RefreshCw, Scale, Clock, ArrowLeft, Home } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AGB() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-lg text-gray-600">
            Gültig ab {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Geltungsbereich */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                § 1 Geltungsbereich
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") der Finanzrechner Pro GmbH 
                  (nachfolgend "Anbieter") gelten für alle Verträge über die Lieferung von Waren, die ein 
                  Verbraucher oder Unternehmer (nachfolgend "Kunde") mit dem Anbieter hinsichtlich der vom 
                  Anbieter in seinem Online-Shop dargestellten Waren abschließt.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu 
                  Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen 
                  beruflichen Tätigkeit zugerechnet werden können.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (3) Unternehmer im Sinne dieser AGB ist eine natürliche oder juristische Person oder eine 
                  rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung 
                  ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vertragsschluss */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600" />
                § 2 Vertragsschluss
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  (1) Die im Online-Shop des Anbieters enthaltenen Leistungsbeschreibungen stellen keine 
                  verbindlichen Angebote seitens des Anbieters dar, sondern dienen zur Abgabe eines 
                  verbindlichen Angebots durch den Kunden.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (2) Der Kunde kann das Angebot über das in den Online-Shop des Anbieters integrierte 
                  Online-Bestellsystem abgeben. Dabei gibt der Kunde, nachdem er die ausgewählten Waren 
                  in den virtuellen Warenkorb gelegt und den elektronischen Bestellprozess durchlaufen hat, 
                  durch Klicken des den Bestellvorgang abschließenden Buttons ein rechtlich verbindliches 
                  Vertragsangebot in Bezug auf die im Warenkorb enthaltenen Waren ab.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (3) Der Anbieter kann das Angebot des Kunden innerhalb von fünf Tagen annehmen, indem er 
                  dem Kunden eine schriftliche Auftragsbestätigung oder eine Auftragsbestätigung in Textform 
                  (Fax oder E-Mail) übermittelt, wobei insoweit der Zugang der Auftragsbestätigung beim 
                  Kunden maßgeblich ist, oder indem er dem Kunden die bestellte Ware liefert.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preise und Zahlungsbedingungen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                § 3 Preise und Zahlungsbedingungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  (1) Die in den jeweiligen Angeboten des Anbieters angeführten Preise sowie die 
                  Versandkosten stellen Bruttopreise dar. Diese enthalten alle Preisbestandteile 
                  einschließlich aller anfallenden Steuern.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (2) Die Zahlungsmöglichkeit/en wird/werden dem Kunden im Online-Shop des Anbieters mitgeteilt.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (3) Bei Auswahl der Zahlungsart "PayPal" erfolgt die Zahlungsabwicklung über den 
                  Zahlungsdienstleister PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, 
                  L-2449 Luxembourg, unter Geltung der PayPal-Nutzungsbedingungen.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (4) Bei Auswahl einer über den Zahlungsdienst "Stripe" angebotenen Zahlungsart erfolgt 
                  die Zahlungsabwicklung über den Zahlungsdienstleister Stripe Payments Europe Ltd., 
                  1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lieferung */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                § 4 Lieferung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  (1) Sofern der Anbieter dies in der Produktbeschreibung nicht deutlich anders angegeben hat, 
                  sind alle vom Anbieter angebotenen Artikel sofort versandfertig. Die Lieferung erfolgt hier 
                  spätestens innerhalb von 5 Werktagen. Dabei beginnt die Frist für die Lieferung im Falle 
                  der Zahlung per Vorkasse am Tag nach Zahlungsauftrag an die mit der Überweisung beauftragte 
                  Bank und bei allen anderen Zahlungsarten am Tag nach Vertragsschluss zu laufen.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (2) Fällt das Fristende auf einen Samstag, Sonntag oder gesetzlichen Feiertag am 
                  Lieferort, so endet die Frist am nächsten Werktag.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (3) Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der 
                  verkauften Sache geht auch beim Versendungskauf erst mit der Übergabe der Sache an 
                  den Käufer auf diesen über.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Widerrufsrecht */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-600" />
                § 5 Widerrufsrecht für Verbraucher
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2 text-blue-900">Widerrufsbelehrung</h4>
                
                <div className="space-y-3 text-sm text-blue-800">
                  <div>
                    <strong>Widerrufsrecht</strong>
                    <p>
                      Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag 
                      zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder 
                      ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz 
                      genommen haben bzw. hat.
                    </p>
                  </div>
                  
                  <div>
                    <strong>Widerrufsfolgen</strong>
                    <p>
                      Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von 
                      Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen 
                      Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von 
                      uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und 
                      spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung 
                      über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
                    </p>
                  </div>
                  
                  <div>
                    <strong>Widerrufsformular</strong>
                    <p>
                      Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung 
                      (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, 
                      diesen Vertrag zu widerrufen, informieren.
                    </p>
                    <p className="mt-2">
                      <strong>Finanzrechner Pro GmbH</strong><br />
                      Musterstraße 123<br />
                      10115 Berlin, Deutschland<br />
                      E-Mail: widerruf@finanzrechner-pro.de
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gewährleistung */}
          <Card>
            <CardHeader>
              <CardTitle>§ 6 Gewährleistung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  (1) Soweit sich aus den nachfolgenden Regelungen nichts anderes ergibt, gelten die 
                  Vorschriften der gesetzlichen Mängelhaftung.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (2) Abweichend hiervon gilt bei Verträgen zur Lieferung von Waren: Der Anbieter leistet 
                  Gewähr dafür, dass die Ware bei Gefahrübergang frei von Sach- und Rechtsmängeln ist.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (3) Die vorstehenden Gewährleistungsregelungen gelten nicht für Schäden, die nach dem 
                  Gefahrübergang durch unsachgemäße Behandlung, übermäßige Beanspruchung oder äußere 
                  Einflüsse entstehen, sowie für Verschleißteile, soweit die Mängel hierauf beruhen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Haftungsbeschränkung */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-purple-600" />
                § 7 Haftungsbeschränkung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  (1) Der Anbieter haftet dem Kunden gegenüber ausschließlich nach Maßgabe der folgenden 
                  Bestimmungen:
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (2) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des 
                  Körpers oder der Gesundheit, die auf einer fahrlässigen oder vorsätzlichen 
                  Pflichtverletzung des Anbieters oder eines gesetzlichen Vertreters oder 
                  Erfüllungsgehilfen des Anbieters beruhen.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (3) Der Anbieter haftet unbeschränkt für sonstige Schäden, die auf einer vorsätzlichen 
                  oder grob fahrlässigen Pflichtverletzung des Anbieters oder eines gesetzlichen 
                  Vertreters oder Erfüllungsgehilfen des Anbieters beruhen.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (4) Im Übrigen haftet der Anbieter nur bei der Verletzung einer wesentlichen 
                  Vertragspflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags 
                  überhaupt erst ermöglicht und auf deren Einhaltung der Vertragspartner regelmäßig 
                  vertrauen darf (Kardinalspflicht), jedoch der Höhe nach begrenzt auf den bei 
                  Vertragsschluss vorhersehbaren Schaden, mit dessen Entstehung typischerweise 
                  gerechnet werden muss.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Datenschutz */}
          <Card>
            <CardHeader>
              <CardTitle>§ 8 Datenschutz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Der Anbieter erhebt, verarbeitet und nutzt die personenbezogenen Daten des Kunden nur 
                zur Erfüllung und Abwicklung der Bestellung. Die personenbezogenen Daten des Kunden 
                werden nur an Dritte weitergegeben, soweit dies zur Lieferung der Waren, zu 
                Zahlungszwecken oder zu Abrechnungszwecken erforderlich ist. Im Übrigen gelten die 
                Bestimmungen des Bundesdatenschutzgesetzes.
              </p>
            </CardContent>
          </Card>

          {/* Schlussbestimmungen */}
          <Card>
            <CardHeader>
              <CardTitle>§ 9 Schlussbestimmungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-700 text-sm">
                  (1) Auf Verträge zwischen dem Anbieter und dem Kunden findet das Recht der 
                  Bundesrepublik Deutschland Anwendung. Bei Verbrauchern gilt diese Rechtswahl nur, 
                  soweit hierdurch der durch zwingende Bestimmungen des Rechts des Staates des 
                  gewöhnlichen Aufenthaltes des Verbrauchers gewährte Schutz nicht entzogen wird.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (2) Sofern es sich beim Kunden um einen Kaufmann, eine juristische Person des 
                  öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen handelt, ist 
                  Gerichtsstand für alle Streitigkeiten aus Vertragsverhältnissen zwischen dem Kunden 
                  und dem Anbieter der Sitz des Anbieters.
                </p>
              </div>
              
              <div>
                <p className="text-gray-700 text-sm">
                  (3) Der Vertrag bleibt auch bei rechtlicher Unwirksamkeit einzelner Punkte in seinen 
                  übrigen Teilen verbindlich. Anstelle der unwirksamen Punkte treten, soweit vorhanden, 
                  die gesetzlichen Bestimmungen. Soweit dies für eine Vertragspartei eine unzumutbare 
                  Härte darstellen würde, wird der Vertrag jedoch im Ganzen unwirksam.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Letzte Aktualisierung */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-sm text-gray-500">
                Stand: {new Date().toLocaleDateString('de-DE', {
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