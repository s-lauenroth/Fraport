/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import stickyPatchParser from './parsers/sticky-patch.js';
import anchorListParser from './parsers/anchor-list.js';
import teaserMosaicParser from './parsers/teaser-mosaic.js';
import heroParser from './parsers/hero.js';
import videoPlayerParser from './parsers/video-player.js';
import teaserFeatureParser from './parsers/teaser-feature.js';
import accordionParser from './parsers/accordion.js';
import tabsTopicParser from './parsers/tabs-topic.js';
import carouselTextMediaParser from './parsers/carousel-text-media.js';
import imageGalleryTilesParser from './parsers/image-gallery-tiles.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import newsroomFeedParser from './parsers/newsroom-feed.js';
import linkBoxParser from './parsers/link-box.js';
import testimonialParser from './parsers/testimonial.js';
import sharePriceParser from './parsers/share-price.js';
import keyFiguresParser from './parsers/key-figures.js';
import timelineParser from './parsers/timeline.js';
import formParser from './parsers/form.js';
import tableDataParser from './parsers/table-data.js';
import operatingDirectionParser from './parsers/operating-direction.js';
import embedParser from './parsers/embed.js';
import columnsSidebarParser from './parsers/columns-sidebar.js';
import downloadsParser from './parsers/downloads.js';
import ctaParser from './parsers/cta.js';
import cardsParser from './parsers/cards.js';
import tilesParser from './parsers/tiles.js';
import columnsParser from './parsers/columns.js';
import textMediaParser from './parsers/text-media.js';
import sectionTitleParser from './parsers/section-title.js';
import fraportCleanupTransformer from './transformers/fraport-cleanup.js';
import fraportSectionsTransformer from './transformers/fraport-sections.js';

const PAGE_TEMPLATE = {
  "name": "content-page-2",
  "description": "Content and landing page led by a full-width hero with a white headline over a photo, followed by mixed blocks",
  "urls": [
    "https://www.fraport.com/",
    "https://www.fraport.com/de.html",
    "https://www.fraport.com/de/geschaeftsfelder.html",
    "https://www.fraport.com/de/geschaeftsfelder/bau.html",
    "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html",
    "https://www.fraport.com/de/geschaeftsfelder/bau/hessens-tor-zur-welt.html",
    "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte/flughafenentgelte.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/ground-services-equipment.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html",
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html",
    "https://www.fraport.com/de/geschaeftsfelder/international-activities.html",
    "https://www.fraport.com/de/geschaeftsfelder/service.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen/antrag-auf-registrierung-einer-firma.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/Bekanntmachungen.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/elektronischer-rechnungsversand.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/richtlinien-und-zahlungsbedingungen.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/unser-track-record.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html",
    "https://www.fraport.com/de/investoren.html",
    "https://www.fraport.com/de/investoren/ansprechpartner.html",
    "https://www.fraport.com/de/investoren/corporate-governance.html",
    "https://www.fraport.com/de/investoren/creditor-relations.html",
    "https://www.fraport.com/de/investoren/fraport-aktie.html",
    "https://www.fraport.com/de/investoren/hauptversammlung.html",
    "https://www.fraport.com/de/investoren/indizes-und-ratings.html",
    "https://www.fraport.com/de/investoren/publikationen-termine.html",
    "https://www.fraport.com/de/investoren/verkehrszahlen.html",
    "https://www.fraport.com/de/konzern.html",
    "https://www.fraport.com/de/konzern/digitalisierung.html",
    "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html",
    "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html",
    "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html",
    "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html",
    "https://www.fraport.com/de/konzern/konzernstrategie.html",
    "https://www.fraport.com/de/konzern/managementsysteme.html",
    "https://www.fraport.com/de/konzern/managementsysteme/arbeitsschutzmanagement.html",
    "https://www.fraport.com/de/konzern/managementsysteme/qualitaetsmanagement.html",
    "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html",
    "https://www.fraport.com/de/konzern/regionales-engagement.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/internationales-festhallen-reitturnier.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/loewen-frankfurt-nachwuchs.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html",
    "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html",
    "https://www.fraport.com/de/konzern/ueber-uns.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html",
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html",
    "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html",
    "https://www.fraport.com/de/konzern/ueber-uns/compliance.html",
    "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html",
    "https://www.fraport.com/de/konzern/ueber-uns/diversity.html",
    "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html",
    "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html",
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html",
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html",
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html",
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html",
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html",
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html",
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html",
    "https://www.fraport.com/de/nachhaltigkeit.html",
    "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html",
    "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html",
    "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html",
    "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/prognosen.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messergebnisse-und-routennutzung.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html",
    "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html",
    "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html",
    "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html",
    "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html",
    "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html",
    "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html",
    "https://www.fraport.com/de/newsroom.html",
    "https://www.fraport.com/de/newsroom/bilddatenbank.html",
    "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html",
    "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html",
    "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html",
    "https://www.fraport.com/de/newsroom/frafacts.html",
    "https://www.fraport.com/de/newsroom/infofilme.html",
    "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html",
    "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html",
    "https://www.fraport.com/de/newsroom/pressemappe.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html",
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html",
    "https://www.fraport.com/de/newsroom/videomaterial.html",
    "https://www.fraport.com/de/newsroom/videomaterial/nutzungsbedingungen.html",
    "https://www.fraport.com/de/tools/disclaimer.html",
    "https://www.fraport.com/de/tools/impressum.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "frach-m-breadcrumb-navigation"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder.html": [
          "#content-537a527afa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
          "#content-ace63d60b2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html": [
          "#content-ccbb392298 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau/hessens-tor-zur-welt.html": [
          "#content-518fb98448 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
          "#content-0462726a7b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
          "#content-fe4c12892b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
          "#content-ef6c7ecdfa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
          "#content-5014c9a271 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
          "#content-daa2dc5031 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
          "#content-cf034a9857 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
          "#content-8392e91ba0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
          "#content-b318ef23c7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
          "#content-27dbc99965 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
          "#content-54dd34baab > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
          "#content-7e0c5d0d7f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
          "#content-fbfc19b9d9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html": [
          "#content-7ec8ab8f1b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
          "#content-94e0b2a1ae > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte/flughafenentgelte.html": [
          "#content-574ee445ae > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
          "#content-febaaa2880 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
          "#content-a29c22d8b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
          "#content-2d18e100ac > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html": [
          "#content-c00f2db2e8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html": [
          "#content-1cb7c055fd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
          "#content-eee860178e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
          "#content-5a643d8d09 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
          "#content-faf1100710 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html": [
          "#content-cbef42f44d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/ground-services-equipment.html": [
          "#content-3d8d2c4b04 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
          "#content-a394cc3644 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html": [
          "#content-bc830b6498 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
          "#content-a709b40d79 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html": [
          "#content-2f6f21b53f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html": [
          "#content-a496411e0a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
          "#content-a788a16760 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
          "#content-77e73e5284 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
          "#content-8e432c4fa6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
          "#content-c957a268d4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
          "#content-586c8daec9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
          "#content-96b9ad1a1e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
          "#content-84eb5a0b10 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
          "#content-f741251b48 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
          "#content-f286af4148 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
          "#content-4ecc9eaa94 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service.html": [
          "#content-96ffffb1cb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#content-ea837bb978 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html": [
          "#content-3c46506438 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#content-1093455a65 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html": [
          "#content-10945cadef > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
          "#content-7c03d327a8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html": [
          "#content-56ad5aaa9a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
          "#content-2a3e832410 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html": [
          "#content-eae3622639 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
          "#content-e19c643cda > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html": [
          "#content-4930928583 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html": [
          "#content-6588f4bf1e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html": [
          "#content-482d124de1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
          "#content-d57e1f4867 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
          "#content-4b6df3191c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
          "#content-f6b19f2990 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen/antrag-auf-registrierung-einer-firma.html": [
          "#content-ad31dff7e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
          "#content-8fd426e1d7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/Bekanntmachungen.html": [
          "#content-22fc7c4e3b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
          "#content-c5bb3d1ef0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/elektronischer-rechnungsversand.html": [
          "#content-44264f4283 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
          "#content-6628355d8a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html": [
          "#content-8a48eb5aaf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html": [
          "#content-60e540cec5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/richtlinien-und-zahlungsbedingungen.html": [
          "#content-92d1cb51d0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
          "#content-e61602a658 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
          "#content-b9b11fde3a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
          "#content-905f01d722 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
          "#content-cc3e256d7a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html": [
          "#content-4743629020 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
          "#content-7995012322 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html": [
          "#content-6c7ef98615 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
          "#content-0800e5e937 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html": [
          "#content-b1b1bc255e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/unser-track-record.html": [
          "#content-d3c2bc6984 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html": [
          "#content-565614a084 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
          "#content-e7476edd10 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
          "#content-a9bf8de399 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
          "#content-14674bdbee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html": [
          "#content-f0fb5cbf2c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren.html": [
          "#content-eb8d513184 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/ansprechpartner.html": [
          "#content-5806f05e7e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/corporate-governance.html": [
          "#content-86ac2115e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/creditor-relations.html": [
          "#content-d465f79875 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/fraport-aktie.html": [
          "#content-6d559b231d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/hauptversammlung.html": [
          "#content-1fa124a7b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/indizes-und-ratings.html": [
          "#content-a9399e14b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/publikationen-termine.html": [
          "#content-d05a755001 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
          "#content-1e764166e2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern.html": [
          "#content-adf976c480 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung.html": [
          "#content-329bc02e5a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html": [
          "#content-af92300507 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
          "#content-2b14b02452 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
          "#content-c215903c75 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html": [
          "#content-a34da67ddc > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/konzernstrategie.html": [
          "#content-ae71da4608 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme.html": [
          "#content-d37599113e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme/arbeitsschutzmanagement.html": [
          "#content-f1d5840375 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme/qualitaetsmanagement.html": [
          "#content-81c0c41334 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
          "#content-f02853d396 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement.html": [
          "#content-0dab5acfe5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
          "#content-feaba3fcbf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
          "#content-573230ac52 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
          "#content-bde4031039 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html": [
          "#content-877d6235fa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html": [
          "#content-af9360fb6d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
          "#content-244319f842 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html": [
          "#content-35ef1df7b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/internationales-festhallen-reitturnier.html": [
          "#content-1b8399d43a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/loewen-frankfurt-nachwuchs.html": [
          "#content-0c67f34b58 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
          "#content-0dcbf3c985 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html": [
          "#content-2445ad7d37 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns.html": [
          "#content-cf6d975969 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
          "#content-fa84549bee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
          "#content-8829230c0e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
          "#content-f39cf93cbf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
          "#content-390a89426f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html": [
          "#content-fc89e9e9d6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
          "#content-f17e821128 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
          "#content-022cdfbd62 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
          "#content-594358c803 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
          "#content-9646d046b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
          "#content-544b915ad4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
          "#content-42426a7da8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
          "#content-e8584c5a08 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
          "#content-9722329fd2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
          "#content-94be5da969 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
          "#content-17594f514c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
          "#content-be988cd6ea > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
          "#content-7a1026f0a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html": [
          "#content-ebaecae6b0 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html": [
          "#content-7a09b53fc8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
          "#content-5c1ce5e09a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
          "#content-6e9876c116 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
          "#content-e01a5db645 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
          "#content-f2d9236084 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
          "#content-c8d6e91b51 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html": [
          "#content-4ca4e3fa39 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
          "#content-f01411c254 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
          "#content-259bd428aa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
          "#content-41f435b897 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
          "#content-a41e98a1ca > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html": [
          "#content-fec0f63e61 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
          "#event-f3a08748f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html": [
          "#content-a3b2185c5c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html": [
          "#content-d535d288ce > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
          "#content-76e8fed943 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
          "#content-55bb545fdf > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
          "#content-15a43168ca > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
          "#content-a65475f97f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html": [
          "#content-f14f715982 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
          "#content-b45573e17b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
          "#content-92cd7cccd5 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html": [
          "#content-42b695e38c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
          "#content-ef09cdc863 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
          "#content-78706e354b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
          "#content-a783909c7e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
          "#content-669ae30600 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html": [
          "#content-5650a6fd78 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html": [
          "#content-0111a8fb0c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html": [
          "#content-7e4b2aa0e3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html": [
          "#content-d89d6944b4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html": [
          "#content-7aace7fde1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html": [
          "#content-0d51f8de4a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit.html": [
          "#content-af1e933ca8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
          "#content-4f08566e96 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
          "#content-645db6a464 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
          "#content-3fb39ad0f4 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
          "#content-bf682d45b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
          "#content-5ea1f21053 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
          "#content-b031ff6578 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html": [
          "#content-ed6d760055 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html": [
          "#content-2fea9c1ff2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/prognosen.html": [
          "#content-9398833c89 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
          "#content-7504aaf10d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
          "#content-b46c90df40 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
          "#content-d2448094b9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html": [
          "#content-18a49b9403 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html": [
          "#content-0a61858a06 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html": [
          "#content-ccc2805911 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html": [
          "#content-894eef1059 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html": [
          "#content-e45a29af95 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html": [
          "#content-15ce188db6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html": [
          "#content-3ec33f01fa > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messergebnisse-und-routennutzung.html": [
          "#content-64dc147c2d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html": [
          "#content-47fa45ed15 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html": [
          "#content-9d581db8f6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html": [
          "#content-524fef9be9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
          "#content-9096343582 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
          "#content-16a9eefbeb > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html": [
          "#content-7cf9202907 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
          "#content-73c24e7119 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
          "#content-e661253371 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
          "#content-bdfb9cc8ef > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
          "#content-693e2b1a7d > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html": [
          "#content-618cb431d1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
          "#content-0afaea7ee3 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
          "#content-cebeb9c9e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
          "#content-c49ebda468 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
          "#content-1dcf20904b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
          "#content-c18357f7c1 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
          "#content-e05b379806 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#content-63328224af > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank.html": [
          "#content-fcf22dbb1a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html": [
          "#content-f16fe935b9 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html": [
          "#content-2bdb284799 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html": [
          "#content-cc97152d75 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/frafacts.html": [
          "#content-47c579053f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/infofilme.html": [
          "#content-1b15d24104 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
          "#content-1bcc4c9bb8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
          "#content-6ad3ead47e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe.html": [
          "#content-b1d39f1e2e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
          "#content-05c26bdf3a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html": [
          "#content-9b5c75be03 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
          "#content-7390ac7dc7 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
          "#content-ca39736fc8 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
          "#content-a670d00f72 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
          "#content-7f855b5c03 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
          "#content-a80a6716dd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
          "#content-c131753e8a > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
          "#content-a5746708ae > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
          "#content-9604d6ea0b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
          "#content-be046d4316 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
          "#content-62b3739282 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html": [
          "#content-cda35881ee > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
          "#content-dd66719220 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
          "#content-39043c6fdd > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
          "#content-50501bc440 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/videomaterial.html": [
          "#content-52145325df > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/videomaterial/nutzungsbedingungen.html": [
          "#content-8350aa06c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/tools/disclaimer.html": [
          "#content-2e67356288 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/tools/impressum.html": [
          "#content-61d950ba2e > div.frach-m-page > frach-m-breadcrumb-navigation"
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
      "name": "teaser-mosaic",
      "instances": [
        "#main-content frach-m-topicwall-first-row"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(1)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2) > div.firstRow.section",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div.firstRow.section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
          "#main-content > div > div > div > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div:nth-child(4)"
        ]
      }
    },
    {
      "name": "hero",
      "instances": [
        "#main-content frach-m-hero",
        "#main-content frach-m-topicwall-1-by-4.frach-m-topicwall-1-by-4__white"
      ],
      "pageInstances": {
        "https://www.fraport.com/": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/investoren.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/konzernstrategie.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
          "#main-content > div > div > section",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(3) > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(7) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(9) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-third-row__1-4--1.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_3.oneByFour.frach-m-topicwall-third-row__1-4--3.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(13) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(13) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(15) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_4.oneByFour.frach-m-topicwall-third-row__1-4--4.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_5.oneByFour.frach-m-topicwall-third-row__1-4--5.frach-m-topicwall-third-row__1-4"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
          "#main-content > div > div > div > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div:nth-child(1) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#main-content > div > div > section"
        ],
        "https://www.fraport.com/de/newsroom/videomaterial.html": [
          "#main-content > div > div > section"
        ]
      }
    },
    {
      "name": "video-player",
      "instances": [
        "#main-content frach-m-topicwall-16-by-9"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(2) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(5) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(7) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(9) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(11) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(15) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(17) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(19) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div:nth-child(1) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
          "#lazy-video-7814"
        ]
      }
    },
    {
      "name": "teaser-feature",
      "instances": [
        "#main-content frach-m-topicwall-1-by-2",
        "#main-content frach-m-topicwall-1-by-4.frach-m-topicwall-1-by-4__blue"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(2) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(3) > frach-m-topicwall-third-row > div.onebyfourtile_5.oneByFour.frach-m-topicwall-third-row__1-4--5.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(4) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(5) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(6) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(8) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(10) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(10) > frach-m-topicwall-second-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-second-row__1-4--1.frach-m-topicwall-second-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(11) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_4.oneByFour.frach-m-topicwall-third-row__1-4--4.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(14) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(16) > frach-m-topicwall-third-row > div.onebyfourtile_3.oneByFour.frach-m-topicwall-third-row__1-4--3.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(16) > frach-m-topicwall-third-row > div.onebyfourtile_4.oneByFour.frach-m-topicwall-third-row__1-4--4.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(18) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-third-row__1-4--1.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2) > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div:nth-child(1) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.secondRow.section > frach-m-topicwall-second-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-second-row__1-4--1.frach-m-topicwall-second-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.secondRow.section > frach-m-topicwall-second-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-second-row__1-4--2.frach-m-topicwall-second-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.thirdRow.section > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.thirdRow.section > frach-m-topicwall-third-row > div.onebyfourtile_3.oneByFour.frach-m-topicwall-third-row__1-4--3.frach-m-topicwall-third-row__1-4"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
          "#main-content > div > div > div > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2"
        ]
      }
    },
    {
      "name": "accordion",
      "instances": [
        "#main-content frach-m-accordion"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
          "#accordion-5dd77cf4f2 > div:nth-child(1)",
          "#accordion-5dd77cf4f2 > div:nth-child(2)",
          "#accordion-5dd77cf4f2 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
          "#accordion-c6f2e3fc77 > div:nth-child(1)",
          "#accordion-c6f2e3fc77 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
          "#accordion-9c805a5281 > div:nth-child(1)",
          "#accordion-9c805a5281 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
          "#accordion-4195c89d7b > div:nth-child(1)",
          "#accordion-4195c89d7b > div:nth-child(2)",
          "#accordion-4195c89d7b > div:nth-child(3)",
          "#accordion-4195c89d7b > div:nth-child(4)",
          "#accordion-4195c89d7b > div:nth-child(5)",
          "#accordion-4195c89d7b > div:nth-child(6)",
          "#accordion-4195c89d7b > div:nth-child(7)",
          "#accordion-4195c89d7b > div:nth-child(8)",
          "#accordion-4195c89d7b > div:nth-child(9)",
          "#accordion-4195c89d7b > div:nth-child(10)",
          "#accordion-4195c89d7b > div:nth-child(11)",
          "#accordion-4195c89d7b > div:nth-child(12)",
          "#accordion-4195c89d7b > div:nth-child(13)",
          "#accordion-4195c89d7b > div:nth-child(14)",
          "#accordion-4195c89d7b > div:nth-child(15)",
          "#accordion-4195c89d7b > div:nth-child(16)",
          "#accordion-4195c89d7b > div:nth-child(17)",
          "#accordion-4195c89d7b > div:nth-child(18)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
          "#accordion-9939d8cf2f > div:nth-child(1)",
          "#accordion-9939d8cf2f > div:nth-child(2)",
          "#accordion-9939d8cf2f > div:nth-child(3)",
          "#accordion-c306ce2300 > div:nth-child(1)",
          "#accordion-c306ce2300 > div:nth-child(2)",
          "#accordion-c306ce2300 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
          "#accordion-c1d889ff61 > div:nth-child(1)",
          "#accordion-c1d889ff61 > div:nth-child(2)",
          "#accordion-c1d889ff61 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
          "#accordion-0cd6eb06da > div:nth-child(1)",
          "#accordion-0cd6eb06da > div:nth-child(2)",
          "#accordion-0cd6eb06da > div:nth-child(3)",
          "#accordion-0cd6eb06da > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
          "#accordion-1b88c375dd > div:nth-child(1)",
          "#accordion-1b88c375dd > div:nth-child(2)",
          "#accordion-1b88c375dd > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
          "#accordion-1636345e69 > div:nth-child(1)",
          "#accordion-1636345e69 > div:nth-child(2)",
          "#accordion-1636345e69 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
          "#accordion-7f3f3a3fba > div:nth-child(1)",
          "#accordion-7f3f3a3fba > div:nth-child(2)",
          "#accordion-7f3f3a3fba > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
          "#accordion-551b100a2d > div:nth-child(1)",
          "#accordion-551b100a2d > div:nth-child(2)",
          "#accordion-551b100a2d > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
          "#accordion-7472ece460 > div:nth-child(1)",
          "#accordion-7472ece460 > div:nth-child(2)",
          "#accordion-7472ece460 > div:nth-child(3)",
          "#accordion-7472ece460 > div:nth-child(4)",
          "#accordion-7472ece460 > div:nth-child(5)",
          "#accordion-7472ece460 > div:nth-child(6)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
          "#accordion-a7ecaed9f6 > div:nth-child(1)",
          "#accordion-a7ecaed9f6 > div:nth-child(2)",
          "#accordion-a7ecaed9f6 > div:nth-child(3)",
          "#accordion-a7ecaed9f6 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
          "#accordion-c01971c214 > div:nth-child(1)",
          "#accordion-c01971c214 > div:nth-child(2)",
          "#accordion-c01971c214 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
          "#accordion-0432b6a395 > div:nth-child(1)",
          "#accordion-0432b6a395 > div:nth-child(2)",
          "#accordion-0432b6a395 > div:nth-child(3)",
          "#accordion-0432b6a395 > div:nth-child(4)",
          "#accordion-0432b6a395 > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
          "#accordion-4dba61b984 > div:nth-child(1)",
          "#accordion-4dba61b984 > div:nth-child(2)",
          "#accordion-4dba61b984 > div:nth-child(3)",
          "#accordion-4dba61b984 > div:nth-child(4)",
          "#accordion-4dba61b984 > div:nth-child(5)",
          "#accordion-4dba61b984 > div:nth-child(6)",
          "#accordion-4dba61b984 > div:nth-child(7)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
          "#accordion-70102d4a46 > div:nth-child(1)",
          "#accordion-70102d4a46 > div:nth-child(2)",
          "#accordion-70102d4a46 > div:nth-child(3)",
          "#accordion-70102d4a46 > div:nth-child(4)",
          "#accordion-70102d4a46 > div:nth-child(5)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#accordion-1f4bf33aeb > div:nth-child(1)",
          "#accordion-1f4bf33aeb > div:nth-child(2)",
          "#accordion-1f4bf33aeb > div:nth-child(3)",
          "#accordion-1f4bf33aeb > div:nth-child(4)",
          "#accordion-1f4bf33aeb > div:nth-child(5)",
          "#accordion-1f4bf33aeb > div:nth-child(6)",
          "#accordion-1f4bf33aeb > div:nth-child(7)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html": [
          "#accordion-350f943bb1 > div:nth-child(1)",
          "#accordion-350f943bb1 > div:nth-child(2)",
          "#accordion-350f943bb1 > div:nth-child(3)",
          "#accordion-350f943bb1 > div:nth-child(4)",
          "#accordion-350f943bb1 > div:nth-child(5)",
          "#accordion-350f943bb1 > div:nth-child(6)",
          "#accordion-350f943bb1 > div:nth-child(7)",
          "#accordion-350f943bb1 > div:nth-child(8)",
          "#accordion-350f943bb1 > div:nth-child(9)",
          "#accordion-350f943bb1 > div:nth-child(10)",
          "#accordion-350f943bb1 > div:nth-child(11)",
          "#accordion-350f943bb1 > div:nth-child(12)",
          "#accordion-b2a7264009 > div:nth-child(1)",
          "#accordion-b2a7264009 > div:nth-child(2)",
          "#accordion-b2a7264009 > div:nth-child(3)",
          "#accordion-b2a7264009 > div:nth-child(4)",
          "#accordion-b2a7264009 > div:nth-child(5)",
          "#accordion-b2a7264009 > div:nth-child(6)",
          "#accordion-b2a7264009 > div:nth-child(7)",
          "#accordion-b2a7264009 > div:nth-child(8)",
          "#accordion-b2a7264009 > div:nth-child(9)",
          "#accordion-b2a7264009 > div:nth-child(10)",
          "#accordion-b2a7264009 > div:nth-child(11)",
          "#accordion-b2a7264009 > div:nth-child(12)",
          "#accordion-80a1e67a94 > div:nth-child(1)",
          "#accordion-80a1e67a94 > div:nth-child(2)",
          "#accordion-80a1e67a94 > div:nth-child(3)",
          "#accordion-80a1e67a94 > div:nth-child(4)",
          "#accordion-80a1e67a94 > div:nth-child(5)",
          "#accordion-80a1e67a94 > div:nth-child(6)",
          "#accordion-80a1e67a94 > div:nth-child(7)",
          "#accordion-80a1e67a94 > div:nth-child(8)",
          "#accordion-80a1e67a94 > div:nth-child(9)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(12)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html": [
          "#accordion-a26cbf591b > div:nth-child(1)",
          "#accordion-a26cbf591b > div:nth-child(2)",
          "#accordion-a26cbf591b > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html": [
          "#accordion-7caaa6cca5 > div:nth-child(1)",
          "#accordion-7caaa6cca5 > div:nth-child(2)",
          "#accordion-7caaa6cca5 > div:nth-child(3)",
          "#accordion-7caaa6cca5 > div:nth-child(4)",
          "#accordion-7caaa6cca5 > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
          "#accordion-0c43f04b72 > div:nth-child(1)",
          "#accordion-0c43f04b72 > div:nth-child(2)",
          "#accordion-0c43f04b72 > div:nth-child(3)",
          "#accordion-0c43f04b72 > div:nth-child(4)",
          "#accordion-0c43f04b72 > div:nth-child(5)",
          "#accordion-0c43f04b72 > div:nth-child(6)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html": [
          "#accordion-026dc7ae24 > div:nth-child(1)",
          "#accordion-026dc7ae24 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html": [
          "#accordion-f3ecb9f122 > div:nth-child(1)",
          "#accordion-f3ecb9f122 > div:nth-child(2)",
          "#accordion-f3ecb9f122 > div:nth-child(3)",
          "#accordion-f3ecb9f122 > div:nth-child(4)",
          "#accordion-f3ecb9f122 > div:nth-child(5)",
          "#accordion-ffa9f5b42d > div:nth-child(1)",
          "#accordion-ffa9f5b42d > div:nth-child(2)",
          "#accordion-ffa9f5b42d > div:nth-child(3)",
          "#accordion-ffa9f5b42d > div:nth-child(4)",
          "#accordion-ffa9f5b42d > div:nth-child(5)",
          "#accordion-38303dd51e > div:nth-child(1)",
          "#accordion-38303dd51e > div:nth-child(2)",
          "#accordion-38303dd51e > div:nth-child(3)",
          "#accordion-38303dd51e > div:nth-child(4)",
          "#accordion-38303dd51e > div:nth-child(5)",
          "#accordion-38303dd51e > div:nth-child(6)",
          "#accordion-38303dd51e > div:nth-child(7)",
          "#accordion-38303dd51e > div:nth-child(8)",
          "#accordion-38303dd51e > div:nth-child(9)",
          "#accordion-38303dd51e > div:nth-child(10)",
          "#accordion-38303dd51e > div:nth-child(11)",
          "#accordion-38303dd51e > div:nth-child(12)",
          "#accordion-38303dd51e > div:nth-child(13)",
          "#accordion-38303dd51e > div:nth-child(14)",
          "#accordion-38303dd51e > div:nth-child(15)",
          "#accordion-f3dff4e15d > div:nth-child(1)",
          "#accordion-f3dff4e15d > div:nth-child(2)",
          "#accordion-f3dff4e15d > div:nth-child(3)",
          "#accordion-bf9e4cacc7 > div:nth-child(1)",
          "#accordion-bf9e4cacc7 > div:nth-child(2)",
          "#accordion-3630d719aa > div:nth-child(1)",
          "#accordion-3630d719aa > div:nth-child(2)",
          "#accordion-3630d719aa > div:nth-child(3)",
          "#accordion-3630d719aa > div:nth-child(4)",
          "#accordion-9186a09869 > div:nth-child(1)",
          "#accordion-9186a09869 > div:nth-child(2)",
          "#accordion-9186a09869 > div:nth-child(3)",
          "#accordion-9186a09869 > div:nth-child(4)",
          "#accordion-9186a09869 > div:nth-child(5)",
          "#accordion-9186a09869 > div:nth-child(6)",
          "#accordion-9186a09869 > div:nth-child(7)",
          "#accordion-baf9644a05 > div:nth-child(1)",
          "#accordion-baf9644a05 > div:nth-child(2)",
          "#accordion-baf9644a05 > div:nth-child(3)",
          "#accordion-baf9644a05 > div:nth-child(4)",
          "#accordion-baf9644a05 > div:nth-child(5)",
          "#accordion-baf9644a05 > div:nth-child(6)",
          "#accordion-baf9644a05 > div:nth-child(7)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
          "#accordion-b7918c27d1 > div:nth-child(1)",
          "#accordion-b7918c27d1 > div:nth-child(2)",
          "#accordion-b7918c27d1 > div:nth-child(3)",
          "#accordion-b7918c27d1 > div:nth-child(4)",
          "#accordion-b7918c27d1 > div:nth-child(5)",
          "#accordion-b7918c27d1 > div:nth-child(6)",
          "#accordion-b7918c27d1 > div:nth-child(7)",
          "#accordion-b7918c27d1 > div:nth-child(8)",
          "#accordion-b7918c27d1 > div:nth-child(9)",
          "#accordion-b7918c27d1 > div:nth-child(10)",
          "#accordion-b7918c27d1 > div:nth-child(11)",
          "#accordion-b7918c27d1 > div:nth-child(12)",
          "#accordion-b7918c27d1 > div:nth-child(13)",
          "#accordion-b7918c27d1 > div:nth-child(14)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
          "#accordion-87ce58c4c2 > div:nth-child(1)",
          "#accordion-87ce58c4c2 > div:nth-child(2)",
          "#accordion-87ce58c4c2 > div:nth-child(3)",
          "#accordion-87ce58c4c2 > div:nth-child(4)",
          "#accordion-56bb506dec > div:nth-child(1)",
          "#accordion-56bb506dec > div:nth-child(2)",
          "#accordion-56bb506dec > div:nth-child(3)",
          "#CAD_bearbeitung > div:nth-child(7)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
          "#accordion-09fed2b42a > div:nth-child(1)",
          "#accordion-09fed2b42a > div:nth-child(2)",
          "#accordion-09fed2b42a > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
          "#accordion-ad42c7da4b > div:nth-child(1)",
          "#accordion-ad42c7da4b > div:nth-child(2)",
          "#accordion-ad42c7da4b > div:nth-child(3)",
          "#accordion-ad42c7da4b > div:nth-child(4)",
          "#accordion-ad42c7da4b > div:nth-child(5)",
          "#accordion-ad42c7da4b > div:nth-child(6)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
          "#accordion-e6f0c54070 > div:nth-child(1)",
          "#accordion-e6f0c54070 > div:nth-child(2)",
          "#accordion-e6f0c54070 > div:nth-child(3)",
          "#accordion-e6f0c54070 > div:nth-child(4)",
          "#accordion-e6f0c54070 > div:nth-child(5)",
          "#accordion-e6f0c54070 > div:nth-child(6)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(9)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
          "#accordion-cb69b7442d > div:nth-child(1)",
          "#accordion-cb69b7442d > div:nth-child(2)",
          "#accordion-cb69b7442d > div:nth-child(3)",
          "#accordion-cb69b7442d > div:nth-child(4)",
          "#accordion-cb69b7442d > div:nth-child(5)",
          "#accordion-cb69b7442d > div:nth-child(6)",
          "#accordion-cb69b7442d > div:nth-child(7)",
          "#accordion-cb69b7442d > div:nth-child(8)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
          "#accordion-081d82da94 > div:nth-child(1)",
          "#accordion-081d82da94 > div:nth-child(2)",
          "#accordion-081d82da94 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html": [
          "#accordion-3c02704772 > div:nth-child(1)",
          "#accordion-3c02704772 > div:nth-child(2)",
          "#accordion-3c02704772 > div:nth-child(3)",
          "#accordion-3c02704772 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
          "#accordion-d65db34026 > div:nth-child(1)",
          "#accordion-d65db34026 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
          "#accordion-02e9fd94dd > div:nth-child(1)",
          "#accordion-02e9fd94dd > div:nth-child(2)",
          "#accordion-02e9fd94dd > div:nth-child(3)",
          "#accordion-02e9fd94dd > div:nth-child(4)",
          "#accordion-02e9fd94dd > div:nth-child(5)",
          "#accordion-02e9fd94dd > div:nth-child(6)"
        ],
        "https://www.fraport.com/de/investoren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(10)"
        ],
        "https://www.fraport.com/de/investoren/corporate-governance.html": [
          "#accordion-21d93404ce > div:nth-child(1)",
          "#accordion-21d93404ce > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/investoren/fraport-aktie.html": [
          "#accordion-87a984c8ef > div:nth-child(1)",
          "#accordion-87a984c8ef > div:nth-child(2)",
          "#accordion-87a984c8ef > div:nth-child(3)",
          "#accordion-87a984c8ef > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/investoren/hauptversammlung.html": [
          "#accordion-c2023bc3b7 > div:nth-child(1)",
          "#accordion-c2023bc3b7 > div:nth-child(2)",
          "#accordion-c2023bc3b7 > div:nth-child(3)",
          "#accordion-c2023bc3b7 > div:nth-child(4)",
          "#accordion-c2023bc3b7 > div:nth-child(5)",
          "#accordion-c2023bc3b7 > div:nth-child(6)",
          "#accordion-21e78adb8f > div:nth-child(1)",
          "#accordion-21e78adb8f > div:nth-child(3)",
          "#accordion-21e78adb8f > div:nth-child(4)",
          "#accordion-21e78adb8f > div:nth-child(5)",
          "#accordion-21e78adb8f > div:nth-child(6)",
          "#accordion-21e78adb8f > div:nth-child(7)",
          "#accordion-21e78adb8f > div:nth-child(8)",
          "#accordion-21e78adb8f > div:nth-child(9)",
          "#accordion-21e78adb8f > div:nth-child(10)",
          "#accordion-21e78adb8f > div:nth-child(11)",
          "#accordion-21e78adb8f > div:nth-child(12)",
          "#accordion-21e78adb8f > div:nth-child(13)"
        ],
        "https://www.fraport.com/de/investoren/indizes-und-ratings.html": [
          "#accordion-0bd8ad4224 > div:nth-child(1)",
          "#accordion-0bd8ad4224 > div:nth-child(2)",
          "#accordion-0bd8ad4224 > div:nth-child(3)",
          "#accordion-0bd8ad4224 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/investoren/publikationen-termine.html": [
          "#accordion-4bb3bd9112 > div:nth-child(1)",
          "#accordion-4bb3bd9112 > div:nth-child(2)",
          "#accordion-4bb3bd9112 > div:nth-child(3)",
          "#accordion-4bb3bd9112 > div:nth-child(4)",
          "#accordion-4bb3bd9112 > div:nth-child(5)",
          "#accordion-4bb3bd9112 > div:nth-child(6)",
          "#accordion-4bb3bd9112 > div:nth-child(7)",
          "#accordion-4bb3bd9112 > div:nth-child(8)",
          "#accordion-4bb3bd9112 > div:nth-child(9)",
          "#accordion-4bb3bd9112 > div:nth-child(10)",
          "#accordion-4bb3bd9112 > div:nth-child(11)",
          "#accordion-4bb3bd9112 > div:nth-child(12)",
          "#accordion-4bb3bd9112 > div:nth-child(13)",
          "#accordion-4bb3bd9112 > div:nth-child(14)",
          "#accordion-4bb3bd9112 > div:nth-child(15)"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html": [
          "#accordion-439f5e8881 > div:nth-child(1)",
          "#accordion-439f5e8881 > div:nth-child(2)",
          "#accordion-439f5e8881 > div:nth-child(3)",
          "#accordion-439f5e8881 > div:nth-child(4)",
          "#accordion-439f5e8881 > div:nth-child(5)",
          "#accordion-439f5e8881 > div:nth-child(6)",
          "#accordion-439f5e8881 > div:nth-child(7)",
          "#accordion-439f5e8881 > div:nth-child(8)"
        ],
        "https://www.fraport.com/de/konzern/konzernstrategie.html": [
          "#accordion-cc6978df97 > div:nth-child(1)",
          "#accordion-cc6978df97 > div:nth-child(2)",
          "#accordion-cc6978df97 > div:nth-child(3)",
          "#accordion-cc6978df97 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement.html": [
          "#accordion-b58a2d6469 > div:nth-child(1)",
          "#accordion-b58a2d6469 > div:nth-child(2)",
          "#accordion-b58a2d6469 > div:nth-child(3)",
          "#accordion-b58a2d6469 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
          "#accordion-47ca75172b > div:nth-child(1)",
          "#accordion-47ca75172b > div:nth-child(2)",
          "#accordion-47ca75172b > div:nth-child(3)",
          "#accordion-47ca75172b > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html": [
          "#accordion-9706f25e94 > div:nth-child(1)",
          "#accordion-9706f25e94 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
          "#accordion-ce3268b4e4 > div:nth-child(1)",
          "#accordion-ce3268b4e4 > div:nth-child(2)",
          "#accordion-ce3268b4e4 > div:nth-child(3)",
          "#accordion-ce3268b4e4 > div:nth-child(4)",
          "#accordion-ce3268b4e4 > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
          "#container-2cd4e3017c > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
          "#accordion-0920334c0c > div:nth-child(1)",
          "#accordion-0920334c0c > div:nth-child(2)",
          "#accordion-0920334c0c > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
          "#accordion-a1dddffe96 > div:nth-child(1)",
          "#accordion-a1dddffe96 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
          "#accordion-8238b30fdc > div:nth-child(1)",
          "#accordion-8238b30fdc > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
          "#main-content > div > div > div > div > div:nth-child(6)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
          "#accordion-b520ba6660 > div:nth-child(1)",
          "#accordion-b520ba6660 > div:nth-child(2)",
          "#accordion-b520ba6660 > div:nth-child(3)",
          "#accordion-b520ba6660 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html": [
          "#accordion-7cf706d4b5 > div:nth-child(1)",
          "#accordion-7cf706d4b5 > div:nth-child(2)",
          "#accordion-7cf706d4b5 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
          "#accordion-bcf2f4d5d1 > div:nth-child(1)",
          "#accordion-bcf2f4d5d1 > div:nth-child(2)",
          "#accordion-bcf2f4d5d1 > div:nth-child(3)",
          "#accordion-bcf2f4d5d1 > div:nth-child(4)",
          "#accordion-bcf2f4d5d1 > div:nth-child(5)",
          "#accordion-bcf2f4d5d1 > div:nth-child(6)",
          "#accordion-bcf2f4d5d1 > div:nth-child(7)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
          "#accordion-de994c9278 > div:nth-child(1)",
          "#accordion-de994c9278 > div:nth-child(2)",
          "#accordion-de994c9278 > div:nth-child(3)",
          "#accordion-de994c9278 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit.html": [
          "#accordion-6fea86d668 > div:nth-child(1)",
          "#accordion-6fea86d668 > div:nth-child(2)",
          "#accordion-6fea86d668 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
          "#accordion-efd10d1836 > div:nth-child(1)",
          "#accordion-efd10d1836 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
          "#accordion-d803bd08a7 > div:nth-child(1)",
          "#accordion-d803bd08a7 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html": [
          "#accordion-ae89d898c8 > div:nth-child(1)",
          "#accordion-ae89d898c8 > div:nth-child(2)",
          "#accordion-ae89d898c8 > div:nth-child(3)",
          "#accordion-ae89d898c8 > div:nth-child(4)",
          "#accordion-ae89d898c8 > div:nth-child(5)",
          "#accordion-ae89d898c8 > div:nth-child(6)",
          "#accordion-ae89d898c8 > div:nth-child(7)",
          "#accordion-ae89d898c8 > div:nth-child(8)",
          "#accordion-ae89d898c8 > div:nth-child(9)",
          "#accordion-ae89d898c8 > div:nth-child(10)",
          "#accordion-ae89d898c8 > div:nth-child(11)",
          "#accordion-ae89d898c8 > div:nth-child(12)",
          "#accordion-ae89d898c8 > div:nth-child(13)",
          "#accordion-ae89d898c8 > div:nth-child(14)",
          "#accordion-ae89d898c8 > div:nth-child(15)",
          "#accordion-ae89d898c8 > div:nth-child(16)",
          "#accordion-ae89d898c8 > div:nth-child(17)",
          "#accordion-ae89d898c8 > div:nth-child(18)",
          "#accordion-ae89d898c8 > div:nth-child(19)",
          "#accordion-ae89d898c8 > div:nth-child(20)",
          "#accordion-ae89d898c8 > div:nth-child(21)",
          "#accordion-ae89d898c8 > div:nth-child(22)",
          "#accordion-ae89d898c8 > div:nth-child(23)",
          "#accordion-ae89d898c8 > div:nth-child(24)",
          "#accordion-ae89d898c8 > div:nth-child(25)",
          "#accordion-ae89d898c8 > div:nth-child(26)",
          "#accordion-ae89d898c8 > div:nth-child(27)",
          "#accordion-ae89d898c8 > div:nth-child(28)",
          "#accordion-ae89d898c8 > div:nth-child(29)",
          "#accordion-ae89d898c8 > div:nth-child(30)",
          "#accordion-ae89d898c8 > div:nth-child(31)",
          "#accordion-ae89d898c8 > div:nth-child(32)",
          "#accordion-ae89d898c8 > div:nth-child(33)",
          "#accordion-ae89d898c8 > div:nth-child(34)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
          "#accordion-4aebcf09f8 > div:nth-child(1)",
          "#accordion-4aebcf09f8 > div:nth-child(2)",
          "#accordion-4aebcf09f8 > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
          "#accordion-d44be35026 > div:nth-child(1)",
          "#accordion-d44be35026 > div:nth-child(2)",
          "#accordion-d44be35026 > div:nth-child(3)",
          "#accordion-d44be35026 > div:nth-child(4)",
          "#accordion-d44be35026 > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
          "#accordion-4493420cce > div:nth-child(1)",
          "#accordion-4493420cce > div:nth-child(2)",
          "#accordion-4493420cce > div:nth-child(3)",
          "#accordion-4493420cce > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
          "#accordion-9d2f26886a > div:nth-child(1)",
          "#accordion-9d2f26886a > div:nth-child(2)",
          "#accordion-9d2f26886a > div:nth-child(3)",
          "#accordion-9d2f26886a > div:nth-child(4)",
          "#accordion-9d2f26886a > div:nth-child(5)",
          "#accordion-9d2f26886a > div:nth-child(6)",
          "#accordion-9d2f26886a > div:nth-child(7)",
          "#accordion-02e5fe4dd6 > div:nth-child(1)",
          "#accordion-02e5fe4dd6 > div:nth-child(2)",
          "#accordion-02e5fe4dd6 > div:nth-child(3)",
          "#accordion-02e5fe4dd6 > div:nth-child(4)",
          "#accordion-6b39f54eee > div:nth-child(1)",
          "#accordion-6b39f54eee > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
          "#accordion-b639bdfbf6 > div:nth-child(1)",
          "#accordion-b639bdfbf6 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#container-cf6a893b8a > div:nth-child(2) > frach-e-audio-player > div > div > div.frach-e-audio-player__content-container > div.frach-e-audio-player__player"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank.html": [
          "#accordion-edc72e27ab > div:nth-child(1)",
          "#accordion-edc72e27ab > div:nth-child(2)",
          "#accordion-edc72e27ab > div:nth-child(3)",
          "#accordion-edc72e27ab > div:nth-child(4)",
          "#accordion-edc72e27ab > div:nth-child(5)",
          "#accordion-edc72e27ab > div:nth-child(6)",
          "#accordion-edc72e27ab > div:nth-child(7)",
          "#accordion-edc72e27ab > div:nth-child(8)"
        ],
        "https://www.fraport.com/de/newsroom/frafacts.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
          "#accordion-e6c4a3919f > div:nth-child(1)",
          "#accordion-e6c4a3919f > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
          "#Pressemitteilung"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
          "#accordion-472a5eeb77 > div:nth-child(1)",
          "#accordion-472a5eeb77 > div:nth-child(2)",
          "#accordion-472a5eeb77 > div:nth-child(3)",
          "#accordion-472a5eeb77 > div:nth-child(4)",
          "#accordion-472a5eeb77 > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
          "#accordion-6fdb3a551e > div:nth-child(1)",
          "#accordion-6fdb3a551e > div:nth-child(2)",
          "#accordion-6fdb3a551e > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
          "#Pressemeldung"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
          "#Pressefoto"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
          "#accordion-c1ba728c53 > div:nth-child(1)",
          "#accordion-c1ba728c53 > div:nth-child(2)",
          "#accordion-c1ba728c53 > div:nth-child(3)",
          "#accordion-c1ba728c53 > div:nth-child(4)",
          "#accordion-c1ba728c53 > div:nth-child(5)",
          "#accordion-c1ba728c53 > div:nth-child(6)",
          "#accordion-c1ba728c53 > div:nth-child(7)",
          "#accordion-c1ba728c53 > div:nth-child(8)",
          "#accordion-c1ba728c53 > div:nth-child(9)",
          "#accordion-c1ba728c53 > div:nth-child(10)",
          "#accordion-c1ba728c53 > div:nth-child(11)",
          "#accordion-c1ba728c53 > div:nth-child(12)",
          "#accordion-c1ba728c53 > div:nth-child(13)",
          "#accordion-c1ba728c53 > div:nth-child(14)",
          "#accordion-c1ba728c53 > div:nth-child(15)",
          "#accordion-c1ba728c53 > div:nth-child(16)",
          "#accordion-c1ba728c53 > div:nth-child(17)",
          "#accordion-c1ba728c53 > div:nth-child(18)",
          "#accordion-c1ba728c53 > div:nth-child(19)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
          "#accordion-10cab334c3 > div:nth-child(1)",
          "#accordion-10cab334c3 > div:nth-child(2)",
          "#accordion-10cab334c3 > div:nth-child(3)",
          "#accordion-10cab334c3 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
          "#Pressemeldungen"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
          "#accordion-d180a260b2 > div:nth-child(1)",
          "#accordion-d180a260b2 > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
          "#accordion-4d00361d9f > div:nth-child(1)",
          "#accordion-4d00361d9f > div:nth-child(2)",
          "#accordion-4d00361d9f > div:nth-child(3)",
          "#accordion-4d00361d9f > div:nth-child(4)",
          "#accordion-4d00361d9f > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
          "#accordion-6a916d32c4 > div:nth-child(1)",
          "#accordion-6a916d32c4 > div:nth-child(2)",
          "#accordion-6a916d32c4 > div:nth-child(3)",
          "#accordion-6a916d32c4 > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
          "#Pressemeldung"
        ],
        "https://www.fraport.com/de/newsroom/videomaterial.html": [
          "#accordion-66f0c6102f > div:nth-child(1)",
          "#accordion-66f0c6102f > div:nth-child(2)",
          "#accordion-66f0c6102f > div:nth-child(3)",
          "#accordion-66f0c6102f > div:nth-child(4)",
          "#accordion-66f0c6102f > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/tools/disclaimer.html": [
          "#accordion-123b8b06f8 > div:nth-child(1)",
          "#accordion-123b8b06f8 > div:nth-child(2)",
          "#accordion-123b8b06f8 > div:nth-child(3)",
          "#accordion-123b8b06f8 > div:nth-child(4)",
          "#accordion-123b8b06f8 > div:nth-child(5)",
          "#accordion-123b8b06f8 > div:nth-child(6)",
          "#accordion-123b8b06f8 > div:nth-child(7)",
          "#accordion-123b8b06f8 > div:nth-child(8)"
        ]
      }
    },
    {
      "name": "tabs-topic",
      "instances": [
        "#main-content frach-m-tab-navigation"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
          "#container-79d7b0cbb0 > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/investoren/creditor-relations.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ],
        "https://www.fraport.com/de/newsroom/videomaterial.html": [
          "#container-f18ab7741a > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
        ]
      }
    },
    {
      "name": "carousel-text-media",
      "instances": [
        "#main-content frach-m-milestones > .frach-m-slider"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
          "#container-bc4106a222 > section:nth-child(2) > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-milestones > div.frach-m-slider.frach-state-animating"
        ]
      }
    },
    {
      "name": "image-gallery-tiles",
      "instances": [
        "#main-content frach-m-image-gallery-tiles"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern.html": [
          "#gallery-3697d97832 > div > div > div"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(15)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(16)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
          "#container-98f8858bd3 > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-text-media > div > div > div.frach-m-text-media__media"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-text-media > div > div > div.frach-m-text-media__media"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#container-81952826d3 > section > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.experiencefragment.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.experiencefragment.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
        ],
        "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe.html": [
          "#t3Mappen > section > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls",
          "#weitereMappen > section > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
        ]
      }
    },
    {
      "name": "cards-teaser",
      "instances": [
        "#main-content frach-m-teaser-slider.frach-m-related-content"
      ],
      "pageInstances": {
        "https://www.fraport.com/": [
          "#relatedContent-2d918be24b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport",
          "#container-dca7058f21 > section:nth-child(2)",
          "#relatedContent-65d6072f7b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de.html": [
          "#relatedContent-2d918be24b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport",
          "#container-dca7058f21 > section:nth-child(2)",
          "#relatedContent-65d6072f7b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder.html": [
          "#relatedContent-8e80dc7fd5 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
          "#container-2bb442baf8 > div",
          "#relatedContent-5325d33afc > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
          "#relatedContent-941ca400c8 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
          "#container-b93ac1825e > section > div > div:nth-child(2)",
          "#relatedContent-55b277bf35 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
          "#relatedContent-a5304d802c"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
          "#relatedContent-545400785d"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
          "#relatedContent-cee0a78f78"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
          "#relatedContent-0eabcdac1d"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
          "#relatedContent-1f711bb10e"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
          "#relatedContent-6ebd3e0afd"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
          "#relatedContent-1efe578779"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
          "#relatedContent-f3223ca778"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
          "#relatedContent-5f309d781a > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
          "#relatedContent-f7d8503726 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
          "#relatedContent-2d769645b4",
          "#relatedContent-56ae7cf858 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
          "#relatedContent-b8646c9c74",
          "#relatedContent-b17b9a62dd > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html": [
          "#relatedContent-60d9e67f98",
          "#relatedContent-a917c8b086 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
          "#relatedContent-b612df14ed",
          "#relatedContent-f7a3dd6183 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
          "#relatedContent-a00056af74",
          "#relatedContent-7caeefd29e > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
          "#relatedContent-a4feabbcd4 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
          "#relatedContent-d38ab42019 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
          "#relatedContent-e41ca29688 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
          "#relatedContent-dc7f279ae4"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)",
          "#relatedContent-ceb6178d7d > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#relatedContent-5dfb7bbaaf > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
          "#relatedContent-a2b82cec46 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
          "#relatedContent-a150bdcb10 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
          "#relatedContent-51a4ba4da9 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
          "#relatedContent-77e5f054be > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
          "#relatedContent-f2697462dd"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html": [
          "#relatedContent-38798eb72f"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
          "#relatedContent-20b80e015d"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html": [
          "#relatedContent-8625c6f6c9"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
          "#relatedContent-871fae8574"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
          "#relatedContent-300a0a151d > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/investoren.html": [
          "#relatedContent-6b7d864c84 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern.html": [
          "#relatedContent-e8473650be > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung.html": [
          "#relatedContent-7ff47f136a > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
          "#relatedContent-a766a7c66d > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern/konzernstrategie.html": [
          "#relatedContent-2f14279776 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme.html": [
          "#relatedContent-c3c9674ebd",
          "#relatedContent-ed10da8cc2 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement.html": [
          "#relatedContent-0b59ee2ecd > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns.html": [
          "#relatedContent-e7185ba16c > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
          "#relatedContent-ef764ea68f"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
          "#relatedContent-47549dd997 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit.html": [
          "#relatedContent-eccc96d23f > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
          "#relatedContent-ee4fc47af1 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
          "#relatedContent-7b0bbe65ab > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
          "#relatedContent-efc9743796 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
          "#relatedContent-0e9e15ec69 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
          "#relatedContent-e6a31b4e29 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
          "#relatedContent-521f042a36 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
          "#relatedContent-c2fb351fe6 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
          "#relatedContent-2bc8adf142 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#relatedContent-1271ff6cee > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
        ]
      }
    },
    {
      "name": "newsroom-feed",
      "instances": [
        "#main-content .frach-m-teaser-collection.frach-m-teaser-collection--card-view"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
          "#container-02968a7e6b > section > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#container-384a21e6fc > section.frach-h-component-margin.frach-js-refresh-root > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view"
        ]
      }
    },
    {
      "name": "link-box",
      "instances": [
        "#main-content .frach-m-link-box"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-padding.frach-js-refresh-root.frach-h-bg--grey.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-padding.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "testimonial",
      "instances": [
        "#main-content .frach-m-testimonial"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
          "#container-b1bab638ae > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
          "#Wer_sind_wir > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "share-price",
      "instances": [
        "#main-content frach-m-key-figures:has(.frach-m-key-figures__exchange-data-wrapper)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/investoren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
        ]
      }
    },
    {
      "name": "key-figures",
      "instances": [
        "#main-content frach-m-key-figures",
        "#main-content frach-m-pictogram-key-figures"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
          "#Allgemeines > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung.html": [
          "#container-1fde3a4200 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12 > frach-m-pictogram-key-figures > div > div > div"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12 > frach-m-pictogram-key-figures > div > div > div"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
          "#container-ffe2bb936b > section",
          "#container-e461f0469d > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
          "#container-edaee3466d > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
          "#\\32 4-stunden"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "timeline",
      "instances": [
        "#main-content .frach-m-timeline__items"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
          "#container-d384fe8197 > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(1)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(3)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(4)"
        ]
      }
    },
    {
      "name": "form",
      "instances": [
        "#main-content .fraformsform"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
          "#anmeldung"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
          "#fluglaerm-formular"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
          "#dachsicherung"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "#main-content frach-e-table"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
          "#Vorsitz"
        ]
      }
    },
    {
      "name": "operating-direction",
      "instances": [
        "#main-content section.frach-h-component-margin:has(> .frach-grid > .frach-grid-row > .frach-grid-col-mq3-8 > .aem-Grid > section > frach-m-embed)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ]
      }
    },
    {
      "name": "embed",
      "instances": [
        "#main-content frach-m-embed",
        "#main-content iframe.moin-ai-teaser"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
          "#Allgemeines_Testangebot > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#moin-ai-teaser"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
          "#moin-ai-teaser"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
          "#moin-ai-teaser"
        ],
        "https://www.fraport.com/de/investoren/fraport-aktie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
          "#Verkehrszahlen_Konzern"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#container-ab3335afdb > section",
          "#container-036ebf24d9 > section:nth-child(4)"
        ]
      }
    },
    {
      "name": "columns-sidebar",
      "instances": [
        "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-8 + .frach-grid-col-mq3-4 .frach-m-download-list)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8) > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/investoren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(9)"
        ],
        "https://www.fraport.com/de/investoren/ansprechpartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/investoren/publikationen-termine.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "downloads",
      "instances": [
        "#main-content .frach-m-tabbed-content__panel .frach-m-download-list"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
          "#Downloads_\\&_Links"
        ]
      }
    },
    {
      "name": "cta",
      "instances": [
        "#main-content .frach-m-cta"
      ],
      "pageInstances": {
        "https://www.fraport.com/": [
          "#container-f66b6c683d > div:nth-child(2)"
        ],
        "https://www.fraport.com/de.html": [
          "#container-f66b6c683d > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(6)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/investoren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(7)"
        ],
        "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)",
          "#container-1fde3a4200 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(8)"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/konzernstrategie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn--default--none.aem-GridColumn.aem-GridColumn--default--12.aem-GridColumn--offset--default--0"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#container-384a21e6fc > div:nth-child(2)",
          "#container-cf6a893b8a > div:nth-child(3)",
          "#container-036ebf24d9 > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/newsroom/videomaterial.html": [
          "#container-f18ab7741a > div:nth-child(4)"
        ]
      }
    },
    {
      "name": "cards",
      "instances": [
        "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-4 + .frach-grid-col-mq3-4 + .frach-grid-col-mq3-4 frach-m-image)"
      ],
      "pageInstances": {
        "https://www.fraport.com/": [
          "#container-dca7058f21 > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de.html": [
          "#container-dca7058f21 > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
          "#container-2bb442baf8 > section > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > div > div:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(12)"
        ],
        "https://www.fraport.com/de/investoren/ansprechpartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung.html": [
          "#container-1fde3a4200 > div > section:nth-child(6) > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
          "#Spenden > section:nth-child(2) > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(9)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(10)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(11)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(12)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(13)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(14)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(17)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(13)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7) > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ]
      }
    },
    {
      "name": "tiles",
      "instances": [
        "#main-content section.frach-h-bg--grey > .frach-grid > .frach-grid-row:has(> .frach-grid-col-mq3-6 + .frach-grid-col-mq3-6 frach-m-image)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/infofilme.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ]
      }
    },
    {
      "name": "columns",
      "instances": [
        "#main-content section.frach-h-bg--grey > .frach-grid > .frach-grid-row:has(> .frach-grid-col-mq3-4 frach-m-text-media)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
        ]
      }
    },
    {
      "name": "text-media",
      "instances": [
        "#main-content section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding:has(frach-m-image):has(.frach-m-text)",
        "#main-content frach-m-text-media:has(.frach-m-slider)"
      ],
      "pageInstances": {
        "https://www.fraport.com/": [
          "#container-f83a543818 > section > div > div:nth-child(2)",
          "#container-f66b6c683d > section"
        ],
        "https://www.fraport.com/de.html": [
          "#container-f83a543818 > section > div > div:nth-child(2)",
          "#container-f66b6c683d > section"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
          "#container-9c85b3a3a1 > section > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/investoren.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/investoren/hauptversammlung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung.html": [
          "#container-eb709c208e > section > div > div:nth-child(2)",
          "#container-1fde3a4200 > div > section:nth-child(4)",
          "#container-f123e1d106 > section > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view > div > div > div > div.frach-m-teaser-collection__list-wrapper > a:nth-child(1)",
          "#container-f123e1d106 > section > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view > div > div > div > div.frach-m-teaser-collection__list-wrapper > a:nth-child(2)",
          "#container-f123e1d106 > section > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view > div > div > div > div.frach-m-teaser-collection__list-wrapper > a:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8)"
        ],
        "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)",
          "#container-4ef6c0cda1 > section:nth-child(1)",
          "#container-4ef6c0cda1 > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
          "#container-6ca87e43f8 > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(11)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(15)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
          "#container-f6f31b707a > section",
          "#container-2cd4e3017c > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
          "#container-edaee3466d > section:nth-child(1)",
          "#container-98f8858bd3 > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
          "#container-53286bb005 > section:nth-child(1)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(9)"
        ],
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
        ],
        "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom.html": [
          "#container-384a21e6fc > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding",
          "#container-036ebf24d9 > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding",
          "#container-ba4fbaabc1 > section > div > div:nth-child(2)"
        ],
        "https://www.fraport.com/de/newsroom/pressemappe.html": [
          "#aktuelleMappe > section > div > div:nth-child(2)",
          "#KlimaMappe > section > div > div:nth-child(2)"
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
        "hero"
      ],
      "defaultContent": [
        ".frach-m-text"
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
        "teaser-mosaic",
        "video-player",
        "teaser-feature",
        "accordion",
        "tabs-topic",
        "carousel-text-media",
        "image-gallery-tiles",
        "cards-teaser",
        "newsroom-feed",
        "link-box",
        "testimonial",
        "share-price",
        "key-figures",
        "timeline",
        "form",
        "table-data",
        "operating-direction",
        "embed",
        "columns-sidebar",
        "downloads",
        "cta",
        "cards",
        "tiles",
        "columns",
        "text-media",
        "hero",
        "anchor-list",
        "section-title"
      ],
      "defaultContent": [
        "frach-m-text-media.frach-m-text-media--100",
        ".frach-m-text",
        "frach-m-image"
      ]
    },
    {
      "id": "chat-widget",
      "name": "Chat widget",
      "selector": [
        "#moin-ai-container"
      ],
      "style": null,
      "blocks": [
        "embed"
      ],
      "defaultContent": []
    }
  ],
  "pageCleanup": {
    "https://www.fraport.com/": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1fb21bd210-notification-overlay"
    ],
    "https://www.fraport.com/de.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1fb21bd210-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6144969bdd-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-032b55076c-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4c59bfb3d6-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/bau/hessens-tor-zur-welt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-18917c339d-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-be8ec3b1e7-notification-overlay",
      "#content-0462726a7b > frach-m-media-lightbox:nth-child(9)",
      "#content-0462726a7b > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay",
      "#item-ea426ddb61-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-8c0ce5ebf8-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-cecefa4e28-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-82cf67068a-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-bad90dbc62-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-fd36b9abbb-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-88ff857efe-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-4f644d8776-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-64a56c663b-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-0e937da507-hotspot > frach-e-tooltip:nth-child(2)",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2e74e277fd-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-202a8f52f8-notification-overlay",
      "#item-8605ff2e66-hotspot > frach-e-tooltip:nth-child(2)",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right",
      "#item-3a88404ce8-hotspot > frach-e-tooltip:nth-child(2)",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-70daa33e18-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8d71b752a6-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-03809f08ac-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f0f44b62f1-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c3adb57547-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5209dc45a9-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-92c700ebad-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ed241e4466-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-23b873472d-notification-overlay",
      "#content-fbfc19b9d9 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c0f98e25a9-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b31e672804-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte/flughafenentgelte.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-78804c46ca-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3184f23a5c-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f4e297c36a-notification-overlay",
      "#content-a29c22d8b8 > frach-m-media-lightbox:nth-child(9)",
      "#content-a29c22d8b8 > frach-m-media-lightbox:nth-child(9)",
      "#content-a29c22d8b8 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-87e0db773a-notification-overlay",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a466864c24-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cfb07ead2f-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-db45a856e9-notification-overlay",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
      "#content-eee860178e > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8b64878d3b-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b44871c69c-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-13058f0065-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/ground-services-equipment.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4120035f0e-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a58a5ed39a-notification-overlay",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
      "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-32069a7f2d-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-03ed21ca0f-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e7e05153ac-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-11556fcaf3-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8eb96956f0-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c4c95a667d-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-627cad71c1-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bcdc8780ee-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-94b957b5d9-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a5005d2a40-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f343bec64c-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-120634c4fc-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0ced201b68-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-068d8aa829-notification-overlay",
      "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
      "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
      "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
      "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
      "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0f8afca1e9-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-36f71c763a-notification-overlay",
      "#content-ea837bb978 > frach-m-media-lightbox:nth-child(9)",
      "#content-ea837bb978 > frach-m-media-lightbox:nth-child(9)",
      "#content-ea837bb978 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b1a29f2ec8-notification-overlay",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4e19adfcef-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6a1a85c506-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d0f1e5182a-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fad257c964-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fab4d97e43-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4f2311f5ba-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dad46a3382-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0e3265e4f2-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-901571aacd-notification-overlay",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-71e4f4ea60-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5ae7a8af73-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2e03af87a3-notification-overlay",
      "#content-4b6df3191c > frach-m-media-lightbox:nth-child(9)",
      "#content-4b6df3191c > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-25bfd4ab59-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen/antrag-auf-registrierung-einer-firma.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6423f2f1a8-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-317c4289ae-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/Bekanntmachungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-784be111d3-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-800acc67a4-notification-overlay",
      "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
      "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
      "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
      "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/elektronischer-rechnungsversand.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d352e8235c-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7ba52fd672-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7fcc774540-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3ba8ea5765-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/richtlinien-und-zahlungsbedingungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e3e45d8b6b-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ffa5da45f3-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6c0046d82a-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-69c4ca700e-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bfa60f8e14-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c836883184-notification-overlay",
      "#content-4743629020 > frach-m-media-lightbox:nth-child(9)",
      "#content-4743629020 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-03aec086a0-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4377243dd3-notification-overlay",
      "#content-6c7ef98615 > frach-m-media-lightbox:nth-child(9)",
      "#content-6c7ef98615 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a4974eeb59-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-94ec219c47-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/unser-track-record.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-220f2d688d-notification-overlay",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e25586f1e1-notification-overlay",
      "#content-565614a084 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-452d34328b-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c9b815ab5c-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ee32789b95-notification-overlay",
      "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)",
      "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)",
      "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)",
      "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7aad609ac0-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-65ffd9f155-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren/ansprechpartner.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-376d462a5b-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren/corporate-governance.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8a1be2c195-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren/creditor-relations.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-529095cce3-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/investoren/fraport-aktie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d2197fa26d-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren/hauptversammlung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-06ed620bf5-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren/indizes-und-ratings.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c62fb92861-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren/publikationen-termine.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cb5efa6840-notification-overlay"
    ],
    "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-eb317b1105-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-90bde30043-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/digitalisierung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-15bb827f20-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-237cab5809-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-32ba324781-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e9af0b8b61-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3f2048bac8-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/konzernstrategie.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-998ad955ae-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/managementsysteme.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f0397d382c-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/managementsysteme/arbeitsschutzmanagement.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c30dfe14a0-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/managementsysteme/qualitaetsmanagement.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-218075ee27-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c3ff015389-notification-overlay",
      "#content-f02853d396 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-88746e6af4-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-610f4afc73-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8a9cbfb8b1-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2430b7b78e-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-97aea4675f-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-228d29b918-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-56647e6973-notification-overlay",
      "#content-244319f842 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c04c5ff611-notification-overlay",
      "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/internationales-festhallen-reitturnier.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4a4679a949-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/profisport/loewen-frankfurt-nachwuchs.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b94917349c-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a4ee128714-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aec2da85ff-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-efbf28ecef-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-63a8598c47-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-66b4c7a570-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-32eeeaf49a-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c5f01d8d36-notification-overlay",
      "#content-390a89426f > frach-m-media-lightbox:nth-child(9)",
      "#content-390a89426f > frach-m-media-lightbox:nth-child(9)",
      "#content-390a89426f > frach-m-media-lightbox:nth-child(9)",
      "#content-390a89426f > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3782a87a0a-notification-overlay",
      "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
      "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
      "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
      "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
      "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9bdfbb98f8-notification-overlay",
      "#content-f17e821128 > frach-m-media-lightbox:nth-child(10)"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a5510b5de6-notification-overlay",
      "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
      "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
      "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
      "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2e6304584d-notification-overlay",
      "#content-594358c803 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fbdb9e75b4-notification-overlay",
      "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
      "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8690bd76fe-notification-overlay",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1769036832-notification-overlay",
      "#content-42426a7da8 > frach-m-media-lightbox:nth-child(9)",
      "#content-42426a7da8 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f6208507f9-notification-overlay",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5bd8e581d5-notification-overlay",
      "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
      "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
      "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
      "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-56abe9b5f8-notification-overlay",
      "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
      "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
      "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
      "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
      "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
      "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
      "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7bdf990433-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3d7dbb4da4-notification-overlay",
      "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
      "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
      "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
      "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0d17d2ae83-notification-overlay",
      "#content-7a1026f0a2 > frach-m-media-lightbox:nth-child(9)",
      "#content-7a1026f0a2 > frach-m-media-lightbox:nth-child(9)",
      "#content-7a1026f0a2 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-37311ca604-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cc2d261b27-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e306fae64d-notification-overlay",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
      "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-96e6b5778d-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b14b90e7ed-notification-overlay",
      "#content-e01a5db645 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c4aaacb1cf-notification-overlay",
      "#content-f2d9236084 > frach-m-media-lightbox:nth-child(9)",
      "#content-f2d9236084 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8dbeafab7e-notification-overlay",
      "#content-c8d6e91b51 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-473c590b58-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9739e6bdc6-notification-overlay",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-12991c6bff-notification-overlay",
      "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
      "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
      "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
      "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-14274bd108-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d7cd5d7123-notification-overlay",
      "#content-a41e98a1ca > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5a7c7e3cc9-notification-overlay",
      "#content-fec0f63e61 > frach-m-media-lightbox:nth-child(9)",
      "#content-fec0f63e61 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-445c11c737-notification-overlay",
      "#event-f3a08748f7 > frach-m-media-lightbox:nth-child(9)",
      "#event-f3a08748f7 > frach-m-media-lightbox:nth-child(9)",
      "#event-f3a08748f7 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-247fdfe7a6-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-214bb3630f-notification-overlay",
      "#content-d535d288ce > frach-m-media-lightbox:nth-child(9)",
      "#content-d535d288ce > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8bb15c60ef-notification-overlay",
      "#content-76e8fed943 > frach-m-media-lightbox:nth-child(10)",
      "#content-76e8fed943 > frach-m-media-lightbox:nth-child(10)",
      "#content-76e8fed943 > frach-m-media-lightbox:nth-child(10)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a584930da8-notification-overlay",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
      "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f61f5d94fa-notification-overlay",
      "#content-15a43168ca > frach-m-media-lightbox:nth-child(9)",
      "#content-15a43168ca > frach-m-media-lightbox:nth-child(9)",
      "#content-15a43168ca > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-10dc035623-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9c0046134a-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3345acfc0e-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-822575e35e-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-38b50b23c9-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-48f71160ee-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5d7634cd04-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dd25206c20-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay",
      "#item-5d2a8734b8-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-14176e00ca-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-0c2352a3d9-hotspot > frach-e-tooltip:nth-child(2)",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
      "#item-756ce8d382-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-b38334e63b-hotspot > frach-e-tooltip:nth-child(2)",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
    ],
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dcfa81979f-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-2b9eb26c6b-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bf960160e9-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-615a05be68-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a464d140c2-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c93515aed9-notification-overlay"
    ],
    "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-587f545949-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-11ac05ea99-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a1d8bd022c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-956108a3d0-notification-overlay",
      "#content-645db6a464 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d25dfeb5a2-notification-overlay",
      "#content-3fb39ad0f4 > frach-m-media-lightbox:nth-child(9)",
      "#content-3fb39ad0f4 > frach-m-media-lightbox:nth-child(9)",
      "#content-3fb39ad0f4 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-e66b8c7c55-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0dcb440f1a-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1e1243631e-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-da711a24c1-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8f6ceefd59-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/prognosen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dfa990764d-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7b647dbc26-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-cbb06d8431-notification-overlay",
      "#content-b46c90df40 > frach-m-media-lightbox:nth-child(9)",
      "#content-b46c90df40 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b9ba6ce086-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-54bfba5130-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-20f8483fe0-notification-overlay",
      "#content-0a61858a06 > frach-m-media-lightbox:nth-child(9)",
      "#content-0a61858a06 > frach-m-media-lightbox:nth-child(9)",
      "#content-0a61858a06 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aa2949f6cf-notification-overlay",
      "#content-ccc2805911 > frach-m-media-lightbox:nth-child(10)",
      "#content-ccc2805911 > frach-m-media-lightbox:nth-child(10)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c5427ae27b-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9ebc8f5b9f-notification-overlay",
      "#item-23fdce7adc-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-29f1c3ceea-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-b6ae21b72f-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-f3ef6ffdf2-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-dfffd7074f-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-8e8a1412ef-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-9fd650b59d-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-0ed9f29c56-hotspot > frach-e-tooltip:nth-child(2)",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-041ee8e29c-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bce7870e38-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messergebnisse-und-routennutzung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a50278b59f-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-df46581784-notification-overlay",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4a977a86ff-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0472aee3f1-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d1353e5e29-notification-overlay",
      "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
      "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
      "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
      "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
      "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
      "#content-9096343582 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f92f622a7c-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-18c716d196-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5c38991daf-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6d27bd4bf8-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-61c5a576d3-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-52ba596aaf-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-87f81ca9fb-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-a4e037c03e-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-03f7ac6a95-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-aeff0d7e2a-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-600c72308a-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-c784613572-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-80eb71800c-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6ed2a18c36-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/bilddatenbank.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-f46ddc2877-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-897f36f4bf-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-42b38d7308-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b7b354bc57-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/frafacts.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-929f4ed303-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/infofilme.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6fc5ad8ce8-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-600d862dbd-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7779c83d69-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-911ad1b115-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-466b9e4dbd-notification-overlay",
      "#content-05c26bdf3a > frach-m-media-lightbox:nth-child(9)",
      "#content-05c26bdf3a > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7b51e12b37-notification-overlay",
      "#content-9b5c75be03 > frach-m-media-lightbox:nth-child(9)",
      "#content-9b5c75be03 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-6771473084-notification-overlay",
      "#content-7390ac7dc7 > frach-m-media-lightbox:nth-child(9)",
      "#content-7390ac7dc7 > frach-m-media-lightbox:nth-child(9)",
      "#item-3a04c111e2-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-14475aac1b-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-c810877ab7-hotspot > frach-e-tooltip:nth-child(2)",
      "#item-5ed4e1d7ab-hotspot > frach-e-tooltip:nth-child(2)",
      "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-ca109b2932-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-eb2531916c-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-affb0a446d-notification-overlay",
      "#content-7f855b5c03 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8547a8dd7f-notification-overlay",
      "#content-a80a6716dd > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bdb5014f5a-notification-overlay",
      "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
      "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
      "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
      "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
      "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
      "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fafd109c23-notification-overlay",
      "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
      "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
      "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
      "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
      "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9614a80a7f-notification-overlay",
      "#content-9604d6ea0b > frach-m-media-lightbox:nth-child(10)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-bbafd9bace-notification-overlay",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
      "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3e49837d2d-notification-overlay",
      "#content-62b3739282 > frach-m-media-lightbox:nth-child(10)",
      "#content-62b3739282 > frach-m-media-lightbox:nth-child(10)",
      "#content-62b3739282 > frach-m-media-lightbox:nth-child(10)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7f1aca62ab-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d7d21f249f-notification-overlay",
      "#content-dd66719220 > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5fd167fba6-notification-overlay",
      "#content-39043c6fdd > frach-m-media-lightbox:nth-child(9)",
      "#content-39043c6fdd > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0316a9efcb-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/videomaterial.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4c79ed8483-notification-overlay",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/videomaterial/nutzungsbedingungen.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3cf769f1d0-notification-overlay"
    ],
    "https://www.fraport.com/de/tools/disclaimer.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-4f03c83f24-notification-overlay"
    ],
    "https://www.fraport.com/de/tools/impressum.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-189a1b5aa9-notification-overlay"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'sticky-patch': stickyPatchParser,
  'anchor-list': anchorListParser,
  'teaser-mosaic': teaserMosaicParser,
  'hero': heroParser,
  'video-player': videoPlayerParser,
  'teaser-feature': teaserFeatureParser,
  'accordion': accordionParser,
  'tabs-topic': tabsTopicParser,
  'carousel-text-media': carouselTextMediaParser,
  'image-gallery-tiles': imageGalleryTilesParser,
  'cards-teaser': cardsTeaserParser,
  'newsroom-feed': newsroomFeedParser,
  'link-box': linkBoxParser,
  'testimonial': testimonialParser,
  'share-price': sharePriceParser,
  'key-figures': keyFiguresParser,
  'timeline': timelineParser,
  'form': formParser,
  'table-data': tableDataParser,
  'operating-direction': operatingDirectionParser,
  'embed': embedParser,
  'columns-sidebar': columnsSidebarParser,
  'downloads': downloadsParser,
  'cta': ctaParser,
  'cards': cardsParser,
  'tiles': tilesParser,
  'columns': columnsParser,
  'text-media': textMediaParser,
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
