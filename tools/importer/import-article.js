/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import stickyPatchParser from './parsers/sticky-patch.js';
import anchorListParser from './parsers/anchor-list.js';
import articleFooterParser from './parsers/article-footer.js';
import tagListParser from './parsers/tag-list.js';
import heroParser from './parsers/hero.js';
import imageGalleryTilesParser from './parsers/image-gallery-tiles.js';
import columnsSidebarParser from './parsers/columns-sidebar.js';
import ctaParser from './parsers/cta.js';
import sectionTitleParser from './parsers/section-title.js';
import fraportCleanupTransformer from './transformers/fraport-cleanup.js';
import fraportSectionsTransformer from './transformers/fraport-sections.js';

const PAGE_TEMPLATE = {
  "name": "article",
  "description": "Text article that opens straight into body paragraphs, without a hero stage",
  "urls": [
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/neue-interaktive-karte-fra-nom-in-betrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html",
    "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html",
    "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html",
    "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html",
    "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html",
    "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html",
    "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html",
    "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html",
    "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html",
    "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html",
    "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html",
    "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html",
    "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html",
    "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html",
    "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html",
    "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html",
    "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html",
    "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html",
    "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html",
    "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html",
    "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html",
    "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html",
    "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html",
    "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html",
    "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html",
    "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html",
    "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "frach-m-breadcrumb-navigation"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html": [
          "#press-872253aabd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html": [
          "#press-a582e7d41e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html": [
          "#press-dd223539ef > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html": [
          "#press-75d67fbb45 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html": [
          "#press-dd418076c4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html": [
          "#press-b92e6b8b99 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html": [
          "#press-78911db295 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html": [
          "#press-d3aa64ed79 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html": [
          "#press-9376031799 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html": [
          "#press-e3815e739e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html": [
          "#press-67767dbc0d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html": [
          "#press-71a3e8792e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html": [
          "#press-314d25ea5d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html": [
          "#press-03118447bb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html": [
          "#press-e853d2bf2c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html": [
          "#press-853db4ae2c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html": [
          "#press-ab5034c864 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html": [
          "#press-816ce31aa1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html": [
          "#press-433b7a337e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html": [
          "#press-7f14083bf1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html": [
          "#press-78e50c32fa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html": [
          "#press-80f657b6ee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html": [
          "#press-8426d1d78d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html": [
          "#press-6e936f1382 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html": [
          "#press-ca33337b05 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html": [
          "#press-367906b889 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html": [
          "#press-72cf970d61 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html": [
          "#press-cc62779b21 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html": [
          "#press-9526fe61ba > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html": [
          "#press-ea85b35b51 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html": [
          "#press-bd46bd77c7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html": [
          "#press-7521c37179 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html": [
          "#press-dff318372c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html": [
          "#press-8944d8402a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html": [
          "#press-bfff3f9185 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html": [
          "#press-f220617baa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html": [
          "#press-5e2a2b2ed5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html": [
          "#press-37995f0a35 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html": [
          "#press-0bc38cf2c9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html": [
          "#press-a458846838 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html": [
          "#press-ffa4be9fc1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html": [
          "#press-1e32b5bd01 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html": [
          "#press-02678784ec > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html": [
          "#press-154a7f8829 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html": [
          "#press-74f55e9852 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html": [
          "#press-57e276e1bb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html": [
          "#press-d57f27f0e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html": [
          "#press-4ffddf2936 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html": [
          "#press-905abd959c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html": [
          "#press-9dc7fb98bd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html": [
          "#press-1356312f32 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html": [
          "#press-173ac1354b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html": [
          "#press-16c4abccc0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html": [
          "#press-c55bacb500 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html": [
          "#press-945928e828 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html": [
          "#press-1448322f41 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html": [
          "#press-7ddfbb2940 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html": [
          "#press-0d72fd4e75 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html": [
          "#press-5c24cc8e70 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
          "#press-f00ab1757e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html": [
          "#press-f05fd37af9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html": [
          "#press-2acf089e51 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html": [
          "#press-08cece3d96 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html": [
          "#press-ce6ed51d2c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html": [
          "#press-8bb2d1327e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html": [
          "#press-e70c5ae7ed > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html": [
          "#press-171a67cbf0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html": [
          "#press-44d1d1d68f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html": [
          "#press-00d8ea0ea0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html": [
          "#press-9598cc7a5f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html": [
          "#press-bda6d67924 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html": [
          "#press-d351188a7e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html": [
          "#press-d3cd5bc9c4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html": [
          "#press-64c32d50b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html": [
          "#press-002c2ec746 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/neue-interaktive-karte-fra-nom-in-betrieb.html": [
          "#press-e958b61d70 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html": [
          "#press-20905f7784 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html": [
          "#press-f10bde0d70 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html": [
          "#press-c96f70501c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html": [
          "#press-cceb494f8d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html": [
          "#press-f77ac40f37 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html": [
          "#press-0cc3ebe1ce > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html": [
          "#press-8a296d43ed > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html": [
          "#press-5fb685a694 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html": [
          "#press-f0d5fa3f1f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html": [
          "#press-c79d2b6fcb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html": [
          "#press-27cc9a66b5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html": [
          "#press-12bb5b2179 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html": [
          "#press-8ecca00b92 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html": [
          "#press-417e244a2a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html": [
          "#press-3114427416 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html": [
          "#press-c564f92cd6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html": [
          "#press-6555b035c5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html": [
          "#press-17628f974e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html": [
          "#press-03fc988431 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html": [
          "#press-c4d24d3b77 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html": [
          "#press-7461484934 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html": [
          "#press-323ecae140 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html": [
          "#press-84b15b195e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html": [
          "#press-0fc68c135a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
          "#press-ac90d2d732 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
          "#press-59d414f04d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
          "#press-04c822cc0f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
          "#press-d4dc8f6605 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
          "#press-c8f6e8a6da > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
          "#press-6716a7c478 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
          "#press-3f064fe0b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
          "#press-cfe3dd41a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
          "#press-8caea52aae > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
          "#press-9f12edf309 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
          "#press-a1a97ed8ac > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
          "#press-e3fc651de5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
          "#press-21ef3718e4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
          "#press-a2e59c335e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
          "#press-2e689a2610 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
          "#press-09475654fb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
          "#press-a6805dfc13 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
          "#press-d261f088ae > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#press-4cfaac08f8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
          "#press-3f972c9514 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
          "#press-bd2faa268e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
          "#press-3e2dc8917f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
          "#press-60ed56bda1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
          "#press-47dcf3814b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
          "#press-1719ea91d9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
          "#press-02779a00d8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
          "#press-52db553aad > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
          "#press-5b087bd559 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
          "#press-f286f9b3c1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
          "#press-4209ad012f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
          "#press-5920072f95 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
          "#press-9f258f6b9f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
          "#press-922dd9bd05 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
          "#press-08d1012948 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
          "#press-62e7961f2a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
          "#press-8046f7c27c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
          "#press-baf05cc7ed > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
          "#press-41dd266e7f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
          "#press-cc1741f8c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
          "#press-587d6574b2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#press-930093a9f8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
          "#press-24ed047de8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
          "#press-249e0785d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
          "#press-60ebdbd7c6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
          "#press-18e6dccac0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
          "#press-1d87c32831 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
          "#press-7395337dbb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
          "#press-d37ecc1ab4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
          "#press-dd1b39cb49 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
          "#press-70eea48f3d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
          "#press-29c204b8b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
          "#press-45b2a8a919 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#press-23ae590397 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
          "#press-c216608751 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
          "#press-0e1729a1a9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
          "#press-44060b04e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
          "#press-1a1828f7f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
          "#press-349713b9ef > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
          "#press-4e396e1a2a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
          "#press-77d819f2e2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
          "#press-ac3abee500 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
          "#press-e6524b7ce0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
          "#press-2bee678549 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
          "#press-3565c324a0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
          "#press-45c8c14578 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
          "#press-66ea5c74c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#press-cae0af36c6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
          "#press-659991597d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
          "#press-975a382873 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
          "#press-8c79d1a632 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
          "#press-ea8af060b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
          "#press-39dab0431b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
          "#press-f07338a704 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
          "#press-083a4d986d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
          "#press-bc64ac95ad > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
          "#press-f65ea1a0e7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
          "#press-56910a7803 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
          "#press-dbf7f80230 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
          "#press-080300a7da > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
          "#press-82a9cb7868 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
          "#press-c6f7250562 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
          "#press-3e8c377ad1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
          "#press-d84d6e101d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
          "#press-2cbbac30f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
          "#press-970fa1b7a0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
          "#press-1c06043327 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
          "#press-3df610934c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
          "#press-a484e2055e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
          "#press-33214412ee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
          "#press-c306f2dbb2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
          "#press-2e1b85fa9f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
          "#press-45995ffac8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
          "#press-adc0bb519d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
          "#press-bccee917c6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
          "#press-449ed28313 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
          "#press-0553c43ab6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
          "#press-f1cc8f63d6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#press-06b75e5dcc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
          "#press-27b79a04b0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
          "#press-d6364a139f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
          "#press-66ecdef95f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
          "#press-2d06164dc1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
          "#press-b92b248959 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
          "#press-40c2dc7f89 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
          "#press-d9ff180088 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
          "#press-54a0a3c9ff > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
          "#press-fa4eeaa5e4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
          "#press-6f9ebaac7b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
          "#press-8e6dfa45b2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
          "#press-5b5c328907 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
          "#press-c77a5aab43 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
          "#press-803ff5d520 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
          "#press-b5bd8e1c5c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
          "#press-46673f9de9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
          "#press-088edd28ff > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
          "#press-0aea1e6c8a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
          "#press-2d2cd6e76b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
          "#press-034ba57d8d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
          "#press-e07fb4cf63 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
          "#press-129f7961a8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
          "#press-ced8c39597 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
          "#press-cf2a45a4c8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
          "#press-e83e2e7584 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
          "#press-339aef0f8f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
          "#press-af1c9eb64f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
          "#press-7032fd7fd1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
          "#press-f2ff569c97 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
          "#press-523a4d312f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
          "#press-4d3b397b0b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
          "#press-05ed6801ad > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
          "#press-df633da970 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
          "#press-81e160971c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
          "#press-d2ac7c38e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
          "#press-bed1563156 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
          "#press-b91e237b96 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
          "#press-2e67454b0e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
          "#press-fdb0fa3f24 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
          "#press-06dd252a3a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
          "#press-de0190ec08 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
          "#press-a3a2425785 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#press-77b3ebc692 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#press-73bab5d013 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#press-93ef4c375b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
          "#press-d93d2325f1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
          "#press-353fc16283 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
          "#press-6ac873939b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
          "#press-fe29d51ea6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#press-87c59df1a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
          "#press-e22a3a7e83 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
          "#press-7b3f18381a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
          "#press-7221570b29 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
          "#press-8c49f52bce > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
          "#press-c74abed4e3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
          "#press-b6274922ba > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
          "#press-412bf390a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
          "#press-11e232d86b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
          "#press-07b52303e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
          "#press-8e1864e8c0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
          "#press-1130df0a9b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
          "#press-7b854f6172 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
          "#press-191e0bde02 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
          "#press-9259fa4a24 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
          "#press-1ec2cb8cc2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
          "#press-37fc30ed90 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
          "#press-68af4ae479 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
          "#press-ecaf770212 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
          "#press-27a25942d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
          "#press-558e04e87d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
          "#press-b115f5bd1d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
          "#press-2fe48c6c45 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
          "#press-fcd9905d26 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
          "#press-eaa99cd21b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
          "#press-787dbd356b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
          "#press-2987cc1329 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
          "#press-b7c357acb4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
          "#press-6a0308bf18 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
          "#press-396977a125 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
          "#press-e714a91e72 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
          "#press-c370d10b1c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
          "#press-4b1b1676fe > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
          "#press-788b52a19b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
          "#press-9d054f883a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
          "#press-9ebbbc3443 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
          "#press-3ab03daff9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
          "#press-31823819f8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
          "#press-8252834c91 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
          "#press-c2be4cf4f6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
          "#press-5df1c89082 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
          "#press-504a5882f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
          "#press-d2986cec53 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
          "#press-02999958fa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
          "#press-9ee9b94302 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
          "#press-40f3ed3cf8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
          "#press-b0366b8fe5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
          "#press-6b6be61749 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
          "#press-4080291530 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
          "#press-254d4ae222 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
          "#press-eb2e41a16e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
          "#press-3d75ce5128 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
          "#press-244cd04ad9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
          "#press-9f9e6fd076 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
          "#press-0b617eb809 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
          "#press-e923d6a510 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
          "#press-c0bd641673 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
          "#press-f7715b0237 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
          "#press-b026caccc2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
          "#press-dada4ec549 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
          "#press-fbd0ef5fc9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
          "#press-3cfd2d5338 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
          "#press-d9cb8e886e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
          "#press-6a6a62f3cd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
          "#press-c37edf2276 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
          "#press-1ff652c632 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
          "#press-abc1a9e3a7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
          "#press-dff3035b96 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
          "#press-29eaa0616b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
          "#press-45961e2b6f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
          "#press-5b11cdf213 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
          "#press-7e1c9abda6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
          "#press-ffa681f47d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
          "#press-88bb515232 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
          "#press-8631d68893 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
          "#press-c37caad686 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
          "#press-28ad0a20ad > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
          "#press-3b6ea34a24 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
          "#press-79f1d0fa2a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
          "#press-ccc35f9218 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
          "#press-38ad9ce038 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
          "#press-0f4f280163 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
          "#press-5108efc389 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
          "#press-017cb9a21c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
          "#press-80d2dc7f1e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
          "#press-2e2b0e8054 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
          "#press-71da4aee93 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
          "#press-e363f7309c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
          "#press-0f1e7294fe > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
          "#press-a68abdeeda > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
          "#press-67913e67f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
          "#press-6108e7aebf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
          "#press-691458143e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
          "#press-64842047fd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
          "#press-38b5997a90 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
          "#press-4a2551f1f0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
          "#press-d35029bb5e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
          "#press-2ff294f055 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
          "#press-d8c2ebedc5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
          "#press-5ee062bf7a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#press-59c132a54a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
          "#press-ea77b07e28 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
          "#press-f6256584de > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
          "#press-0a0ee7ab4a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
          "#press-ce4871c245 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
          "#press-fdf89f6040 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
          "#press-50f9e21b96 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
          "#press-d12e764a7a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
          "#press-b62ee525c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
          "#press-32d3063eb1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
          "#press-11d702412a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
          "#press-6ea8fa3817 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
          "#press-595d203b44 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
          "#press-662753cce9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
          "#press-9056c483e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
          "#press-b88bec805d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
          "#press-9f90e95d13 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
          "#press-10fc6597c0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
          "#press-48260e4c54 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
          "#press-cfc7ee6f70 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
          "#press-beb531eaf6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
          "#press-681ee8722f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
          "#press-00160073fc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
          "#press-c729a4a3bf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
          "#press-270e34ef9d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
          "#press-110a0ca670 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
          "#press-771d224bc9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
          "#press-e52cad1eb4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
          "#press-f5c934cb67 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
          "#press-bf60741263 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
          "#press-81f7da0850 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
          "#press-f3c2191a41 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
          "#press-acdc3af55d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
          "#press-0fde614bc6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
          "#press-1c4d524dfb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
          "#press-607cb5239e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
          "#press-f1e75487f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
          "#press-ce20e35a71 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
          "#press-b1710d62e8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
          "#press-4b520fce9b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
          "#press-078001b8c8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
          "#press-24badaafbe > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
          "#press-f30d1517ef > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
          "#press-e9ae515fd2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
          "#press-931ae4ff06 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
          "#press-f05b1e0c80 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
          "#press-2fcbfa2f4e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
          "#press-b9203eff8b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
          "#press-4e10362fed > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
          "#press-3ed1754602 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
          "#press-39152a5f84 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
          "#press-a3242244a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
          "#press-b80d9abb9b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
          "#press-4d7882508e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
          "#press-a896a91869 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
          "#press-9d30287cb8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
          "#press-9ad0789086 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
          "#press-a390c0b48b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
          "#press-00f76e8bb6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
          "#press-1d9944d9c5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
          "#press-851d3fc541 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
          "#press-eed27c14eb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
          "#press-da411801d7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
          "#press-a9fa14bc41 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
          "#press-0b70fc1a85 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
          "#press-5bf728a5c9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
          "#press-d96a514a8a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
          "#press-345ccf94d3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
          "#press-3b02024351 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
          "#press-7248b3baee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
          "#press-26c0f64b5e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
          "#press-4f073b699f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
          "#press-33f252725a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
          "#press-cce2c8c7f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
          "#press-46a8836452 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
          "#press-a800a39a7b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
          "#press-b044b0d96a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
          "#press-60eb885a8a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
          "#press-5ac4ade682 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
          "#press-70650b480d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
          "#press-54feed8507 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
          "#press-e0b1391686 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
          "#press-5ca470d31d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
          "#press-c281d07b68 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
          "#press-e1e71723d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
          "#press-7b71db49fd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
          "#press-b80b448c23 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
          "#press-8a1a4bb2ab > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
          "#press-b72e9aa232 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
          "#press-e52f817d8a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
          "#press-4c9d50776f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
          "#press-c6408ca78b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
          "#press-e2a9aebb83 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
          "#press-2c0fa5e11a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
          "#press-9d9c006fdf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
          "#press-a34d61bff0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
          "#press-b4706cce3b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
          "#press-ad168230cf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
          "#press-bea3896155 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
          "#press-c5453bd67a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
          "#press-f42248b8e9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
          "#press-3ad5ddbd33 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
          "#press-230dee35f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
          "#press-b79838d0d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
          "#press-371b6ea75a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
          "#press-295ea1243c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
          "#press-7e0dc1f8fc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
          "#press-a90e208dee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
          "#press-f3d9dd8910 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
          "#press-b55da77d33 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
          "#press-92324ab86b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
          "#press-74e050d15c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
          "#press-6d86bd99af > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
          "#press-02d550d821 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
          "#press-8b6bb43d33 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
          "#press-292c2539c7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
          "#press-45dad09827 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
          "#press-5cd9b595ec > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
          "#press-161ad8d11d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
          "#press-c4b5eaf9a4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
          "#press-b9eacd3941 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
          "#press-a8486351ff > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
          "#press-72dc1a2db9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
          "#press-e03ce0f3fd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
          "#press-b254a08ef8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
          "#press-210945bf5a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
          "#press-3e98331af0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
          "#press-b7f51b11c1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
          "#press-d8e90a76ff > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
          "#press-b496f67b35 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
          "#press-743e7e5ba1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
          "#press-b71d07f821 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
          "#press-af643ad23a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
          "#press-6de2b9b942 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
          "#press-92248bc9d4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
          "#press-1e6fa053a8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
          "#press-5d4a3f3b4a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
          "#press-d47b522b2b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
          "#press-be4a8d6076 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
          "#press-ee1384f85e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
          "#press-a961459b5b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
          "#press-0465dbc2ac > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
          "#press-4de5951176 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
          "#press-9b6273785c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
          "#press-ddb49dcc04 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
          "#press-4d368a5e93 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
          "#press-9f5172b237 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
          "#press-e95b7eab2f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
          "#press-8dd7e79599 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
          "#press-94a5a1ad58 > div.frach-m-page > frach-m-breadcrumb-navigation"
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
      "name": "article-footer",
      "instances": [
        "#main-content frach-m-hero .frach-m-page-meta-data:has(.frach-m-page-meta-data__text a[href])"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
        ]
      }
    },
    {
      "name": "tag-list",
      "instances": [
        "#main-content frach-m-hero .frach-m-page-meta-data__tags:has(frach-e-tag)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
          "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
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
      "name": "image-gallery-tiles",
      "instances": [
        "#main-content frach-m-image-gallery-tiles"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
          "#gallery-cd706d6f40 > div > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
          "#gallery-3ae4d1c5a0 > div > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "columns-sidebar",
      "instances": [
        "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-8 + .frach-grid-col-mq3-4)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ]
      }
    },
    {
      "name": "cta",
      "instances": [
        "#main-content .frach-m-cta"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
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
        "article-footer",
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
        "cta",
        "image-gallery-tiles",
        "anchor-list",
        "section-title"
      ],
      "defaultContent": [
        "frach-m-text-media",
        ".frach-m-text",
        "frach-m-image",
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
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bdb0f75835-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6510fcd361-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7c24dc7102-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a728164526-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a59141c124-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-abf562a88b-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b2575e1414-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-063255736e-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ea4bf06283-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-57f94ffbed-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5cff495ea5-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-25c022abfb-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-952bdfbcea-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b3c9062866-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f9985a569d-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cd20e140d0-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9e35fad4c2-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9c889922ed-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-959d35b266-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aa43654498-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a21c29ac0b-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-27936a158d-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-56a6371aa5-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-31463e752c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8cc86b1d6b-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b0e126acc4-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a167896d40-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-95a6c9fb51-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0f24ca43be-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-28747f2537-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2717625c53-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5ec1088ead-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fac923dae4-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fad56e8110-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-97bd738dbb-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c11c59d758-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a65ca1c4c7-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b40812cb83-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4521181ffc-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3e7640334a-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a411b3ab52-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0c8766ecbc-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e243c30fde-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-22abb17e26-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f807ddda25-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3f1ab235d6-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0eea14a864-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-211f5d5b0f-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6988ba675e-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c11eb80e7e-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e7e29d89d0-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-79cf5e4757-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5e922d856d-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-86bc83c8cd-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aaf48f8728-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-accc3fdaaa-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-397802a686-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f891f7ae1c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0d1b741a89-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1d44dd8d8a-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-baa0af6327-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6b3683dbd4-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-10e8adb262-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-62435765ff-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-608cd62fb9-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-413a928c6f-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-948170df73-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7a89385a7c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1340ff173c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-de7da0ca9a-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c33b4ffb90-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e21e5e956e-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7dddabc3dc-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4f58fcca33-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2a6726822e-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/neue-interaktive-karte-fra-nom-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cfd9d341de-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6f21064b64-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ef5befdc74-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aed6dec395-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-20dee59a52-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-81314e4d8c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-39706945bf-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3ebfb59f85-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-456f0124cb-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-818e59351f-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-45aed3e3b9-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4adbe3f0a4-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-691862a5aa-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-951ef5af50-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5ca3da241c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c0defa75bb-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ec9d9f081a-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cd0d7037dc-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-27c2305f41-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-057b97a650-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d323eaa0cd-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-97afd7961c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-27a89e5a3a-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d209eb6c3d-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-84be74f736-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b7e5ec24f6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9a847b77cb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7d4265262d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8417a04111-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-99e22fcce4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3ecd447294-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-58388fe270-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-135fbb1930-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-98942afb41-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3e04cfb81e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7e00b9931d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-80b0eab1ae-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7b82d1cef3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-790641eb46-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-eb3a76be83-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2e34209053-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa0e50d72c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-61614c3849-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dc0702dae3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-47c326b467-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4d8253cd54-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dbb61e9081-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f5693e5a4e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c0c3b3cdee-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cb10206224-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bb571b27ce-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c41b0266aa-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-64a7c82f93-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-069a7f5a2d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-01d129f1b2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-031636cc06-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6c24fd711c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d9fe8eb57a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-177ae9c683-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d8db64e608-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b2b0f6cc59-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8c32ec0c2c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-71a3312351-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b88b149ff0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0b0961c40a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5aca1a51ae-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2ba52a4063-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-16ea020b47-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a77c61e121-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bdae114e8a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7e6543beaf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8df25e3f42-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-53c93ba0ab-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8095b6ddf1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-56ddc878ba-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9b85e8e077-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bd35a036ac-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6d92244b0c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e8e7df45be-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f62307bcbb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-52a2b64523-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-42cf5e5050-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d27066c541-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7ab62c69ef-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-41225bb63a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d234cdaffd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5f1c64b199-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-99c41a7c77-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9ee7b3ffee-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2c193c486e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bacd7ec1bd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a370fc7794-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e43f75028f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d6e3721404-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5b94eb4abf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-795d022e73-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9751089a91-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-450ad3cae4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0da741a9e0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2f7e8d7493-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0d8f6ddd9a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-431bfe8a3f-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2df4c3394e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e948956aa4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b49fec2e74-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8ea5ba38cb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6d77c60f65-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-611f4cf11b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bab636e21b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aed4e710ef-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4786d94810-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6a31c31558-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa38d2c55b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-16e00eff8e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a1026e516b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-86d407e21d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e6120fa016-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-474f7dd99f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-27152e9d35-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4c5c91c1a0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5a024bcd62-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-71393574da-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8f3deb6512-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b10e372a8a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a58f17757f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-74538c675e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3829d6da3a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e2c039b5d0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1040ee2bbb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e2e4bdf328-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4c608583ae-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f10d8175c9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ee08a641c7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-99bcb3d2b8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-68dd3b6a53-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b20d9e4308-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-715930a2a9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-09e791206a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bbd2c93439-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-295c47340b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0eaeb6af3b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7929797832-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a6b545485f-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4d84653a62-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "div.vjs-playback-rate.vjs-menu-button",
      "div.vjs-chapters-button.vjs-menu-button",
      "div.vjs-descriptions-button.vjs-menu-button",
      "div.vjs-subs-caps-button.vjs-menu-button",
      "div.vjs-audio-button.vjs-menu-button",
      "div.vjs-error-display.vjs-modal-dialog",
      "div.vjs-modal-dialog.vjs-hidden",
      "#metaNavigation-f7f126252f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b317043b01-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bf820b3bf0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6856a434b0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4f41549005-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aa33eaaff8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-28c4ac56b5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-08c8b94e34-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-86265504fe-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-620744eb49-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c2e5c0e5ae-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1fc2c26245-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f28250079d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-23672b6236-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-10247379c7-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f8f9724124-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-39ace4ddf1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b682582243-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d7e4d1a4e8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3c2a460d34-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-03ada678f8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-28bc3e0461-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5a82e5bbfb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8697586c8e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b1ff1a1ae4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3ae1fd1ee6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9ac02a9960-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6fd055db70-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e67b4c1bc3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a65e73eab1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0537a8f387-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3302b58a1a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b55ada6608-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ba3a7ff569-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-41739dc6ef-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-63cdf380c7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d399c8df88-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1bbf6a5e64-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f6cf4158ec-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ad59dd6ae6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-388456d3e4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4c4c2f4ca2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-45179d3ec4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-48460f735f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cb505f75e1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1115becad0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-189c803643-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7e489b38b4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-829d8b74bd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-00a64c807e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-24a01a1ebb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b455bc9fb5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4a27aaac65-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6c1c481bbd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2ac98515c5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9ced63858d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-325e115f65-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-81584130be-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8a5adba4c1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aebca9d5a9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b48f239dcd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bba31a54da-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-de02b90a7b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c4b6a6e7bf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9d01826da2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-94babe34cd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-07c62788d7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2b47644115-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d09fa5d512-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dd51ea1c49-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b39e2248d8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d48082683d-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9075042e4b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-be19305610-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-79ce0fcad1-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dfb80e1894-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3c081cfbbb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e15f861087-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cc715ff1ef-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-89b62d3b6b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-14ef611cce-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3b258736fd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5f1aad00eb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aefa024766-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b716a45d57-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-be9092305b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e630b54fc8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-29be6e3758-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2d95d7762a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cc02a7c261-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a68b3f6853-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-067aec28bc-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2cfa5b462e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3f80ac695b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-841054dc06-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f0d98cce8e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-85ef7c1b98-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2507468646-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-90d28c6844-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d228d7f32c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d1a0469e5e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-83f9cdab37-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1660d609b6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-130b37afd0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cc42c980a1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-91d47b8741-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa4bd5eb31-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-615eaa1886-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2e96b73c71-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-065448632f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aed191fe75-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ea66f9bab4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c10e18ba74-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-174c2b3962-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-be40a00f32-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d10903d44a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e94e5ccf47-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f9c7fc6903-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d4ae20088f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8671bd1781-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ac86067376-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a4e4e2bd4f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c74cd79c9e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-381d46d24e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-97ef172b22-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-50e2b3599a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d1778c9b03-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-75f8eb314f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2773069832-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e4ad81e928-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aa7c3fecd7-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-87d57d386e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa6701e7ca-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ff340f13b8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5793d0dd1e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-417fcc63c4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-03d643db80-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-63463d8b1e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f84cd1e2fe-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa26649530-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f9a1118dfd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3fc918d40b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d1d4e34d39-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a9a1c6bad6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ae616c580a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5ce9a5d7cf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c62bd1afa8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-275180a056-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0ff45a6f61-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0b8d4927f3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-10df69f7dd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c70938697f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e6a1d2d327-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7b68960802-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-09362db08a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a357bd8b5f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-61a2822fa8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1c428dc12a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-61b390825f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f59828221c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c9bc25564e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c615c3aa4f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-41238d8b31-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c4298fd4a5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-515ac46843-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9df77f4578-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-797b2a6977-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-db70a21f53-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-60b44fdb6e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-30095efa40-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8d2a793064-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-700e51dc65-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1b45f15c55-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3e9735ac43-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0031c1f7b5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d7e55f0c33-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5cbb1d802b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4e159cc294-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cd39c1601d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4b17e0fa87-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d43619ed59-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cea3305336-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c1e74cd75e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a8934a76e1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c41f00b6fe-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e7dce0ce75-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4fc2e850d2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b93295e447-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-28b4d77c22-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cf2adadb52-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d7c7fe4b36-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f59070f519-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-962cabcc12-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9010b71e60-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-35acb386bd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2ed10b3892-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-73c645df8a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4f82e1f6cf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9815df11dc-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-067081a3b5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bfd136cf1b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-79203ef178-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5ca1937aff-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5c57f3b444-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-149711d655-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9840908f9e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ae694ea743-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-51afa27ef5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7bcd7c9e10-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-10c76a9f57-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-018c695c33-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7ccc9a84dd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cf933758d5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-786e333fcf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d9de521016-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4e9b7e08bc-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f3d24f3423-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-72f35773fb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-557877d375-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-408390c39e-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-323a921e01-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e13d1916d0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-16bcc88af3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e62c70c9d4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0aaaf66a92-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-50d60bce14-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f7adcd524a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-426bacc1c2-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a6eb9e35f6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dc36c81259-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8feb0ce4b9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-077a1c7469-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e1548a99f0-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5d439f12f8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cd3fcc184f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f04b92f8c5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9f0d4738a8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-40e07d7226-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0eb43b90d1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d620787579-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b4571e5dbc-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3508812d16-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a3ac5a3e96-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c532970c3d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b68dd206fd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-324b7d7616-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f2ae27250a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-776ea69bf8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-272ab6c1d5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c4dcd1276d-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-85ac783f31-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-731bfa010f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bd50a3f406-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dc39ca7267-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b670c06dce-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f674dc40b3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b84519c884-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7941d89120-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7c40a9f597-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9a26377792-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-446aea975f-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6289bb36d9-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-18f63ad01b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-742307ee05-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-046489d8db-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6821a24ae4-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7c665c8eaa-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-be15d20730-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3f627a17ca-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6280f6a6a5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f17b310378-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7f104b0341-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-715362f9a6-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ffe33a1d7a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-24f7f1017c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b92eec9969-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1b4dcf840b-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-70ae215c9e-notification-overlay"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'sticky-patch': stickyPatchParser,
  'anchor-list': anchorListParser,
  'article-footer': articleFooterParser,
  'tag-list': tagListParser,
  'hero': heroParser,
  'image-gallery-tiles': imageGalleryTilesParser,
  'columns-sidebar': columnsSidebarParser,
  'cta': ctaParser,
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
