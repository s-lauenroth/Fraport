/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import stickyPatchParser from './parsers/sticky-patch.js';
import anchorListParser from './parsers/anchor-list.js';
import tagListParser from './parsers/tag-list.js';
import heroParser from './parsers/hero.js';
import columnsSidebarParser from './parsers/columns-sidebar.js';
import tableDataParser from './parsers/table-data.js';
import sectionTitleParser from './parsers/section-title.js';
import fraportCleanupTransformer from './transformers/fraport-cleanup.js';
import fraportSectionsTransformer from './transformers/fraport-sections.js';

const PAGE_TEMPLATE = {
  "name": "press-release",
  "description": "Article body in a wide main column with a narrow right sidebar for contacts and downloads",
  "urls": [
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html",
    "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "frach-m-breadcrumb-navigation"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html": [
          "#press-3cf4bd5c7b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#press-3130b4f5d6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html": [
          "#press-eccf190f21 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html": [
          "#press-47945717cc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html": [
          "#press-88ace86cd7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html": [
          "#press-5e0cd4ff19 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html": [
          "#press-0c876d84e1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html": [
          "#press-4cbd7e468f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html": [
          "#press-e93159b9a4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html": [
          "#press-8c47906f9b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html": [
          "#press-92d021c17e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html": [
          "#press-3e0985ea98 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html": [
          "#press-b2a4597734 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html": [
          "#press-aeafbcb935 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html": [
          "#press-33051a241f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html": [
          "#press-95170e0c76 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html": [
          "#press-af96efeb20 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html": [
          "#press-0d202a018e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
          "#press-c36edfb8e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html": [
          "#press-671939d42c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html": [
          "#press-53fa58bd4b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html": [
          "#press-ec598663fe > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
          "#press-2b3104e490 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
          "#press-f2ad4776c3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html": [
          "#press-dbd2863ee0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html": [
          "#press-18805b3e76 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html": [
          "#press-2e7c05a05a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html": [
          "#press-8d309f0459 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html": [
          "#press-5bc8955d98 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html": [
          "#press-ec94ab806c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html": [
          "#press-0e1a69761e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
          "#press-89936663c8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html": [
          "#press-6ce31f7c1f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html": [
          "#press-dfb4849989 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html": [
          "#press-1e82e46657 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
          "#press-f0474bf367 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html": [
          "#press-f5d526e3e8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html": [
          "#press-912f3e8e6f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html": [
          "#press-4db49e01ce > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html": [
          "#press-276275c7bc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html": [
          "#press-6ff01104f9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html": [
          "#press-967229aa3e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html": [
          "#press-799528e32f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html": [
          "#press-fd1955cc8f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html": [
          "#press-a1face5438 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html": [
          "#press-a023bd867a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html": [
          "#press-f47a41b04f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html": [
          "#press-7aabdd9a1b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html": [
          "#press-16e7867ab1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html": [
          "#press-0e3a043d2d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html": [
          "#press-2c7ef37c21 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html": [
          "#press-c521934d25 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html": [
          "#press-223250fb99 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html": [
          "#press-bbc89c3b27 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html": [
          "#press-2e9219509b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html": [
          "#press-00cfb6feb1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
          "#press-be07520d2c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html": [
          "#press-9b3a731d98 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
          "#press-9f9f2d6ca9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html": [
          "#press-cafaac4951 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html": [
          "#press-0d9b8e0f6d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html": [
          "#press-b278535722 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html": [
          "#press-9365b8d110 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html": [
          "#press-e24ecc385c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html": [
          "#press-9154cf6973 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
          "#press-9bce6558b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html": [
          "#press-7edff3d06d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
          "#press-9464def4fb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
          "#press-8298129bdc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html": [
          "#press-280273ecfe > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html": [
          "#press-079bfafd79 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html": [
          "#press-7c8c5e96dd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html": [
          "#press-a5255392e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html": [
          "#press-fe6648c638 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html": [
          "#press-a3968aa07a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html": [
          "#press-d6331d2e63 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html": [
          "#press-7d48692a05 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
          "#press-27d12d2aee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html": [
          "#press-d4a4b0f9a9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
          "#press-b3edf946cb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html": [
          "#press-acef37f883 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html": [
          "#press-dde22a83a7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html": [
          "#press-f3c1a38970 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
          "#press-7072773c36 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html": [
          "#press-624ba92605 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html": [
          "#press-0f82b0c349 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html": [
          "#press-b005ff090c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html": [
          "#press-4606a67aef > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html": [
          "#press-6e87b590eb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html": [
          "#press-445e8069a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html": [
          "#press-9e273d080f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
          "#press-61fc42d63e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html": [
          "#press-be060d5bd6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html": [
          "#press-dd46a9b53f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html": [
          "#press-0fa3c0db78 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html": [
          "#press-64e6c0a833 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html": [
          "#press-0f19d94924 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html": [
          "#press-c117c80c9e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html": [
          "#press-b950537ca4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html": [
          "#press-555aa46946 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html": [
          "#press-8c0e857b66 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html": [
          "#press-dd6d6483e7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html": [
          "#press-33fab8869f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html": [
          "#press-eaf1ab2bb9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
          "#press-38cfd9b992 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#press-454defdd9d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html": [
          "#press-aeaf3cf137 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
          "#press-1933a4fc08 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html": [
          "#press-eee0138776 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html": [
          "#press-69051ccdcd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
          "#press-4ce18950d7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
          "#press-7fcf69fe8f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
          "#press-9975c6c027 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html": [
          "#press-96b39bec90 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html": [
          "#press-f52f208beb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html": [
          "#press-9948043196 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html": [
          "#press-814f2e025f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
          "#press-774335e3ac > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
          "#press-17e577c551 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html": [
          "#press-e83dfca934 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html": [
          "#press-a51d7c1b4f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html": [
          "#press-e9ee463c0c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html": [
          "#press-126b78dc15 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html": [
          "#press-d0f1905d5f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html": [
          "#press-df9b37b0ce > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html": [
          "#press-0b5d5874b9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html": [
          "#press-36bad9bbc7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html": [
          "#press-8a66ac370f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
          "#press-5472bdaa7f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
          "#press-17703057e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
          "#press-087a9b396e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html": [
          "#press-cf18987c4d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html": [
          "#press-ba7312a893 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
          "#press-3dd76627e9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html": [
          "#press-0a78b896de > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html": [
          "#press-225b46eadc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html": [
          "#press-4ca7178535 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
          "#press-a01270f12c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html": [
          "#press-f4d87085db > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
          "#press-afc1f34d1f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
          "#press-1bfc662bef > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
          "#press-99e15705f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
          "#press-3ff661eb18 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
          "#press-4779c0f4c5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
          "#press-f245628a24 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
          "#press-7555e165a0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
          "#press-ba48dd05e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
          "#press-ede96020fe > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
          "#press-407dbb04aa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
          "#press-e3679f585a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
          "#press-5e2416a6db > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
          "#press-9401ff430e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
          "#press-eea32307e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html": [
          "#press-f2efa67d29 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html": [
          "#press-21d49dca4f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html": [
          "#press-177a185f01 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html": [
          "#press-8e858513e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#press-0880df27fb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
          "#press-d1196ff38a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html": [
          "#press-48ede90c84 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html": [
          "#press-b615b1564a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html": [
          "#press-641a8e6bfa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html": [
          "#press-3643858669 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#press-d314919191 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html": [
          "#press-1f55b9bb55 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html": [
          "#press-052e8ac03d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html": [
          "#press-4e0bae3534 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html": [
          "#press-2cef6ae71d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
          "#press-d20e1a4fa2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
          "#press-73909b9774 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
          "#press-9c86744160 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
          "#press-adc9c1d325 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
          "#press-f48517bd21 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
          "#press-9692d1a20c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
          "#press-37fb4ca99c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
          "#press-feb0ddaffb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
          "#press-9c1feb6e68 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
          "#press-2d886634e3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
          "#press-8eb487337f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
          "#press-ee0b4ef210 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html": [
          "#press-843e496303 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html": [
          "#press-f9c15438b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
          "#press-217b78067f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html": [
          "#press-77f06219d9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html": [
          "#press-ddde720bbc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#press-d08ed7f1b4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#press-a9e68b7a08 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html": [
          "#press-22f50755ab > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html": [
          "#press-a83b37d0ae > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html": [
          "#press-fee7684d21 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html": [
          "#press-a8f973e913 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html": [
          "#press-3c75db983e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html": [
          "#press-9570b00459 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html": [
          "#press-b04eb91d48 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html": [
          "#press-4231398823 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html": [
          "#press-3617492bb7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html": [
          "#press-37885dcc49 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html": [
          "#press-d09e62e85b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html": [
          "#press-796a73bba7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html": [
          "#press-98c87660cd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html": [
          "#press-ebb912c984 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html": [
          "#press-0441059466 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html": [
          "#press-fedc5d132e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html": [
          "#press-08934e0288 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html": [
          "#press-085015e227 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html": [
          "#press-8f501339d0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ]
      }
    },
    {
      "name": "sticky-patch",
      "instances": [
        "#main-content frach-e-sticky-patch"
      ]
    },
    {
      "name": "anchor-list",
      "instances": [
        "#main-content frach-m-anchor-list"
      ]
    },
    {
      "name": "tag-list",
      "instances": [
        "#main-content frach-m-hero .frach-m-page-meta-data__tags:has(frach-e-tag)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ]
      }
    },
    {
      "name": "hero",
      "instances": [
        "#main-content frach-m-hero > .frach-grid:has(.frach-m-hero__media)"
      ]
    },
    {
      "name": "columns-sidebar",
      "instances": [
        "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-8 + .frach-grid-col-mq3-4)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "#main-content frach-e-table"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > div > div > div.frach-grid-col-mq1-12.frach-grid-col-mq3-8 > div > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "section-title",
      "instances": [
        "#main-content .frach-m-section-title"
      ]
    }
  ],
  "sections": [
    {
      "id": "breadcrumb",
      "name": "Breadcrumb",
      "selector": [
        "frach-m-breadcrumb-navigation"
      ],
      "style": null,
      "blocks": [
        "breadcrumb"
      ],
      "defaultContent": []
    },
    {
      "id": "page-header-bar",
      "name": "Sticky page header bar",
      "selector": [
        "frach-m-sticky-page-header-container"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    },
    {
      "id": "stage",
      "name": "Stage",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > section.frach-h-component-margin"
      ],
      "style": null,
      "blocks": [
        "hero",
        "tag-list"
      ],
      "defaultContent": [
        ".frach-m-page-meta-data__date"
      ]
    },
    {
      "id": "sticky-patch",
      "name": "Sticky patch",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > div.stickyPatch"
      ],
      "style": null,
      "blocks": [
        "sticky-patch"
      ],
      "defaultContent": [
        "a"
      ]
    },
    {
      "id": "main",
      "name": "Main content",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > div.responsivegrid"
      ],
      "style": null,
      "blocks": [
        "columns-sidebar",
        "table-data",
        "anchor-list",
        "section-title"
      ],
      "defaultContent": [
        ".frach-m-text",
        "frach-m-embed"
      ]
    },
    {
      "id": "chat-widget",
      "name": "Chat widget",
      "selector": [
        "#moin-ai-container"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    },
    {
      "id": "page-end",
      "name": "Trailing section after main",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > div.responsivegrid ~ section.frach-h-component-margin"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    }
  ],
  "pageCleanup": {
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-df81eb3ea5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3ec21e0fc1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9bc91379ca-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-836c5246eb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-27786d2b5d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1644c6b3f6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-38a0bb3cdf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-88893ec685-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2db2204ff7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2f21c0311a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cea7f137d3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2d122b729a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8222c3b276-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-083a03390d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5ca5f853d2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cb3e4f28e1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a74e3db75b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1caf2cdbb2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-67dda6d516-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cb296896e8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-62367362f8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dd0116d688-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4b66a77da8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-951b8a9afc-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-62d961e8b3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cea706c140-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6a5667766d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-556d48f6cd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4df9827c25-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6c0d09e28b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1789e9f6af-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9a972d7a5e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0a1e5f4922-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7bed3f33a4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6d1f98e440-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cd3ed41347-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2280b42fb6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0bbb872249-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-231df919a3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b0df0e419a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a49d899adf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7355ab22ee-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e8d6159ecd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d9bf26d195-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-75a7731d16-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c86f3a0722-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3eebe68d0a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9b200793e7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-45bc766d84-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5213e2e445-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f3adfeba74-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3d2c414a6f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bf464c11fa-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c9d4a7966a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-df7ea014dd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-493ce78be3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa6dd36bf5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-11d9648937-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-18c595e916-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7e85b8be45-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a273179e13-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c760e9d2d6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5c28d4e5b8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3fe7c60c18-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2cbc01ae4e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2b5544d9e5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6331b2844e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-59cc9135db-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0f906db6d8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b9340fedf6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8005181dbe-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e7e96cc7f9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-932c1eeed8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-328a4f4b82-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4ab6dbc83b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-07995aef86-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4143bb5286-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cd2f46b576-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-861550aba4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0898643724-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-69dce91b88-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c84e779382-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b1787a82f0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-85542ddf76-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7b3ed5c38f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-20c1bdf6a3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-286203fe90-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3b90130441-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b3c63a236a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7a97489dc2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7f79ff0309-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f38f9ddae0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-22338be974-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1c8107a2c1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-54559e1458-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d8ceec536a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4c21c1d475-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bf3e4019bf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bf973fecc1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-21e6075e49-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2d6a922371-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2580115ae8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3309a61aed-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-71ab6ca30f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6187de74a0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b6bdc91e8b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-da02188a05-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-de04943407-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dc0ddfa445-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a8dbcf885b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-25cefa9a88-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b5ef420645-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3b82922fbc-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7dcda8b3e2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9a43f13fe4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b0022e883d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3f459c9bf7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2e3643e676-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f3e42348ab-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3a1300f7a2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-06c0410b5a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-15f08db238-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f80f31853a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-73b617415b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-40d54e2867-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-da942c958c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-af76ac0b0f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4d5792979a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-39bd985db6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b130847c30-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e6752eca73-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d7a4dabc5e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f2f3b09dd9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c2b9af1f29-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-599fbff4f9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-476352d5ac-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9bee072ace-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3692939ec9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3624415e70-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ed76bf7bcf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2657f9e552-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c5b88dc0b3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f6116d998c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ef6b90d047-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-debbc69c82-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9c8c7d8fa1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f7a45c69ff-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2a8d5fbc6f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-63cec7c5a8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0862047577-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d5a75373fd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-55d05e7d86-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-eec13d82f6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c0463a7c90-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a989c8cc99-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cb270d8e62-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-25809cea5b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c1a7ff660a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f71964a13d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa2ca6fec0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fbd9c59d06-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fe6cd7ebea-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5cba0b102a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-980c1402f3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-537ea9d1f3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-963258ce0a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-80f9bbc306-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e947926e63-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ff03646069-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9e3db9bdab-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a39443afaa-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b229e325f9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b6340f4dfe-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e584fea99c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-83866288c2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e6ae42baa8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-71e8687bdb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cc8e96ce08-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4efbb06fcc-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-164e5f2713-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ed8c633e38-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-753e34fc3c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-580ba6893c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-df6c0b4e77-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ee560f980a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cd113277d2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bf307e87e3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-026bab3d61-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d18896f655-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5b251d16d0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9d5d75c949-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4a05b78dc4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a8d4d5bf3e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4da5b87231-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1d990a9443-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-46c456c21b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4bc9c836b3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-743472d4f9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0117bb2f88-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-695be469b7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fcfdda5c8d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e5b985c003-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f9df4795eb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-53b37d8e59-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d82920a2f9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5fd8156d30-notification-overlay"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'sticky-patch': stickyPatchParser,
  'anchor-list': anchorListParser,
  'tag-list': tagListParser,
  'hero': heroParser,
  'columns-sidebar': columnsSidebarParser,
  'table-data': tableDataParser,
  'section-title': sectionTitleParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [fraportSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
// Page corrections ({sitename}-page-corrections.js, when it exists) run last.
const correctionTransformers = [];
const transformers = [fraportCleanupTransformer, ...lateTransformers, ...correctionTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
