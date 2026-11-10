/* ===== Fallpfad · Praktisches Examen Übung · Inhalte =====
   Akutgeriatrie, Station 4B. Drei Prüfungspatienten (A Bildbefund, B Gespräch, C Pflegehandlung),
   Störfall mit Patient D. Alle Personen sind frei erfunden. */
window.PEX = {
  station: "Akutgeriatrie · Station 4B",
  haus: "Ev. Klinikum Nordpark",
  anleitung: "Jana Kemper",
  pruefer: "Herr Hollmann",

  briefing: [
    "Guten Morgen und willkommen auf der 4B. Ich bin Jana Kemper, deine Praxisanleiterin. Heute und morgen spielen wir dein praktisches Examen einmal komplett durch, mit drei Menschen, die du eigenverantwortlich versorgst. Herr Hollmann von der Pflegeschule ist morgen als zweiter Fachprüfer dabei.",
    "Heute (Tag 1) lernst du deine drei Patientinnen und Patienten kennen. Du bekommst die Akten und hörst dir an, was sie dir selbst erzählen. Das ist bewusst ungeordnet, so wie im echten Leben. Filtere heraus, was pflegerisch wichtig ist, und schreib danach für alle drei eine Pflegeplanung.",
    "Morgen (Tag 2) beginnt dein Frühdienst um 06:00 Uhr mit der Übergabe vom Nachtdienst. Danach stellst du uns deine drei Menschen im SBAR-Schema vor, planst deine Schicht und versorgst sie. Rechne damit, dass nicht alles nach Plan läuft. Am Ende dokumentierst du, übergibst an den Spätdienst und wir führen das Reflexionsgespräch.",
    "Ein Wort zu Fehlern: Wir bauen echte Praxisfallen ein. Wenn du bei der Pflegehandlung einen Schritt falsch wählst, korrigierst du ihn sofort. Manche Fehler sind kritisch, weil sie in der echten Prüfung zum Abbruch führen würden. Die siehst du rot markiert."
  ],
  regeln: [
    ["Rahmen nach § 16 PflAPrV", "Pflege von mindestens zwei Menschen, davon einer mit erhöhtem Pflegebedarf. Fallvorstellung höchstens 20 Minuten, Reflexionsgespräch höchstens 20 Minuten, Prüfung ohne Vorbereitungsteil höchstens 240 Minuten."],
    ["Vorbehaltene Tätigkeiten (§ 4 PflBG)", "Pflegebedarf erheben, Pflegeprozess steuern, Qualität sichern. Genau darauf schauen die Fachprüfenden bei jeder Phase."],
    ["Freitext und Selbsteinschätzung", "Du schreibst zuerst frei. Danach deckst du den Erwartungshorizont auf und hakst ehrlich ab, was du wirklich hattest. Begriffe aus deinem Text sind schon vorgemerkt, prüfe sie trotzdem."],
    ["Zeit", "Die Prüfungsuhr läuft ab der Übergabe an Tag 2 mit. Dein Fortschritt wird gespeichert, du kannst jederzeit unterbrechen."]
  ],

  /* ---------- Patienten ---------- */
  pat: {
    A: {
      key: "A", name: "Werner Kowalski", kurz: "Herr Kowalski", alter: 82, zimmer: "412", modus: "Bildbefund",
      farbe: "#0062FF",
      diagnose: "Ambulant erworbene Pneumonie rechts basal, Exsikkose; Tag 3 nach Aufnahme. Aufnahme nach Sturz zu Hause mit kurzer Bewusstlosigkeit, Telemetrie zur Synkopenabklärung.",
      daten: [
        ["Vorerkrankungen", "Herzinsuffizienz (HFrEF, NYHA II), arterielle Hypertonie, Diabetes mellitus Typ 2, leichte kognitive Störung, Schwerhörigkeit rechts (Hörgerät)"],
        ["Allergien", "keine bekannt"],
        ["Pflegegrad / Vollmacht", "kein Pflegegrad · keine Vorsorgevollmacht, Tochter (Hamburg) ist Ansprechpartnerin"],
        ["Medikation", "Bisoprolol 2,5 mg 1-0-0 · Ramipril 5 mg 1-0-0 · Torasemid 10 mg 1-0-0 (pausiert seit Aufnahme) · Metformin (pausiert) · Insulin normal nach Korrekturschema · Ampicillin/Sulbactam 3 g i.v. 08-16-24 Uhr · Enoxaparin 40 mg s.c. 18 Uhr · Paracetamol 1 g bei Fieber über 38,5 °C, max. 3 g/24 h"],
        ["Vitalwerte Tag 1, 16 Uhr", "RR 124/72 mmHg · HF 78/min (Monitor: Sinusrhythmus) · T 37,9 °C · SpO₂ 94 % (Raumluft) · AF 20/min · BZ 168 mg/dl"],
        ["Ein-/Ausfuhr gestern", "Einfuhr 1.150 ml (davon 500 ml i.v.) · Ausfuhr 900 ml"]
      ],
      anamnese: "Ach wissen Se, ich war ja eigentlich immer gesund, bis auf das Herz und den Zucker. Ich war Lokführer bei der Bahn, 41 Jahre, da wird man nicht krank. Meine Frau ist vor zwei Jahren gestorben, seitdem mach ich alles allein, zweiter Stock, kein Aufzug, aber das geht. Die Tabletten nehm ich, meistens jedenfalls. Die Wassertablette lass ich weg, wenn ich in die Stadt muss, sonst renn ich ja nur aufs Klo. Getrunken hab ich wohl zu wenig, die Tochter schimpft immer am Telefon. Und dann war mir so schwummrig, am Küchentisch, und auf einmal lag ich auf dem Boden. Wie lange, weiß ich gar nicht. Den Husten hab ich seit ner guten Woche, so gelblich kommt das. Was sagen Se? Ach, das rechte Hörgerät, da ist die Batterie leer, deshalb versteh ich Sie so schlecht. Nachts weiß ich manchmal nicht, wo ich bin, das ist mir unangenehm, ich such dann die Tür zum Bad und find sie nicht. Herzstolpern? Ja, manchmal so ein Flattern hier in der Brust, aber das geht wieder weg. Rauchen hab ich vor zwanzig Jahren aufgehört. Das Essen hier schmeckt nicht, ich ess sonst immer mittags warm und abends um sechs mein Brot.",
      kern: [
        { t: "Sturz mit Bewusstlosigkeit unklarer Dauer (Synkope, mögliches Liegetrauma)", kw: ["sturz", "boden", "synkope", "bewusst", "ohnmacht", "schwummrig", "gestürzt"] },
        { t: "Diuretikum wird zu Hause unregelmäßig genommen (Adhärenz, Einfluss auf Herzinsuffizienz)", kw: ["wassertablette", "diuret", "torasemid", "adhärenz", "compliance", "weglass", "lässt weg"] },
        { t: "Geringe Trinkmenge zu Hause, Exsikkose", kw: ["trink", "flüssigkeit", "exsikkose", "getrunken"] },
        { t: "Episodisches „Flattern“ in der Brust: Hinweis auf Herzrhythmusstörung", kw: ["flatter", "palpitation", "stolper", "rhythmus", "herzrhythm", "arrhythm"] },
        { t: "Hörgerät rechts ohne Batterie: Kommunikationsbarriere", kw: ["hörgerät", "batterie", "schwerhör", "hören"] },
        { t: "Nächtliche Desorientierung: Delir- und Sturzrisiko", kw: ["desorient", "delir", "nachts", "orientier", "verwirr"] },
        { t: "Lebt allein, 2. Stock ohne Aufzug: Entlassungsmanagement früh beginnen", kw: ["allein", "treppe", "aufzug", "entlass", "stock", "witwer", "verwitwet"] },
        { t: "Produktiver Husten mit gelblichem Auswurf seit etwa einer Woche", kw: ["husten", "auswurf", "sputum", "gelb"] }
      ]
    },
    B: {
      key: "B", name: "Gertrud Sommer", kurz: "Frau Sommer", alter: 86, zimmer: "414", modus: "Gespräch",
      farbe: "#7C3AED",
      diagnose: "Häuslicher Sturz nachts, Rippenfraktur 7. Rippe rechts (nicht disloziert), Platzwunde Stirn (genäht, Tag 5). Commotio ausgeschlossen.",
      daten: [
        ["Vorerkrankungen", "Osteoporose, Gonarthrose beidseits, arterielle Hypertonie, Herzinsuffizienz (NYHA I–II)"],
        ["Allergien", "Penicillin (Exanthem)"],
        ["Pflegegrad / Vollmacht", "Pflegegrad 1 · Vorsorgevollmacht für Gesundheitssorge an Tochter Sabine Sommer (Bielefeld)"],
        ["Medikation", "Furosemid 40 mg 1-0-0 · Amlodipin 5 mg 1-0-0 · Alendronsäure 70 mg montags · Colecalciferol 1.000 IE 1-0-0 · Paracetamol 500 mg 1-1-1-1 · bei Bedarf Metamizol 500 mg bei NRS ≥ 4, max. 4×/24 h"],
        ["Vitalwerte Tag 1, 16 Uhr", "RR 148/82 mmHg · HF 76/min · T 36,8 °C · SpO₂ 95 % · AF 18/min, flach · Schmerz NRS 2 (in Ruhe erhoben)"],
        ["Physiotherapie", "„Pat. lehnt Gangschule ab, Termin morgen 10:00 Uhr.“"]
      ],
      anamnese: "Ich will Ihnen keine Umstände machen, Schwester. Mir geht's gut, wirklich, ich bin halt alt. Zu Hause hab ich noch alles allein gemacht, einkaufen mit dem Rollator, und der Herr Yilmaz von unten trägt mir die Wasserkisten hoch. Die Tochter wohnt in Bielefeld, die kommt sonntags. Nachts muss ich halt drei-, viermal raus. Die Wassertablette nehm ich abends, der Hausarzt hat zwar was von morgens gesagt, aber morgens geh ich doch einkaufen. Da bin ich dann im Flur am Läufer hängen geblieben. Gelegen hab ich, bis die Nachbarin morgens geklingelt hat. Ach, reden wir nicht davon. Die Brille hab ich zu Hause, die für die Ferne. Laufen tu ich jetzt nicht, das muss ja auch nicht sein. Die junge Frau von der Krankengymnastik ist ja nett, aber ich hab gesagt, morgen. Schmerzen? Nee, es geht schon, man will ja nicht jammern. Beim Husten zieht's halt hier an der Seite. Schlafen tu ich schlecht, ich lieg immer wach und horch.",
      kern: [
        { t: "Nächtlicher Sturz mit stundenlanger Liegezeit bis zum Morgen (Liegetrauma, Risiko Post-Fall-Syndrom)", kw: ["gelegen", "liege", "morgens", "nachbarin", "liegetrauma", "post-fall", "stunden"] },
        { t: "Diuretikum zu Hause abends statt morgens: Nykturie 3–4× pro Nacht", kw: ["abends", "nykturie", "wassertablette", "diuret", "furosemid", "nachts", "toilette"] },
        { t: "Stolperfalle Läufer im Flur (Wohnumfeld)", kw: ["läufer", "teppich", "stolper", "flur", "wohnung"] },
        { t: "Fernbrille zu Hause: eingeschränktes Sehen", kw: ["brille", "sehen", "visus"] },
        { t: "Lehnt Mobilisation und Physiotherapie ab („muss ja nicht sein“): Rückzug, Hinweis auf Sturzangst", kw: ["angst", "physio", "krankengym", "mobilis", "laufen", "rückzug", "furcht", "lehnt"] },
        { t: "Bagatellisiert Schmerzen („nicht jammern“), Schmerz bei Husten an der rechten Seite", kw: ["schmerz", "jammern", "rippe", "nrs", "husten"] },
        { t: "Ressourcen: Rollator, Nachbar Herr Yilmaz, Tochter sonntags", kw: ["rollator", "nachbar", "yilmaz", "tochter", "ressource"] },
        { t: "Schlafstörung, liegt wach und lauscht", kw: ["schlaf", "wach", "horch"] }
      ]
    },
    C: {
      key: "C", name: "Hannelore Wiese", kurz: "Frau Wiese", alter: 79, zimmer: "415", modus: "Pflegehandlung",
      farbe: "#059669",
      diagnose: "Proximale Humerusfraktur links nach Sturz im Garten, konservativ im Gilchrist-Verband; Tag 2. Diabetes mellitus Typ 2, insulinpflichtig.",
      daten: [
        ["Vorerkrankungen", "Diabetes mellitus Typ 2 (insulinpflichtig), arterielle Hypertonie, rezidivierende Harnwegsinfekte"],
        ["Allergien", "keine bekannt"],
        ["Pflegegrad / Vollmacht", "kein Pflegegrad · keine Vollmacht · voll orientiert"],
        ["Medikation", "Insulin glargin 18 IE 22 Uhr · Insulin aspart nach Schema zu den Mahlzeiten · Ramipril 2,5 mg 1-0-0 · Metamizol 500 mg 1-1-1-1 · Amitriptylin 25 mg 0-0-0-1 (vom Hausarzt seit 14 Tagen, Schlafstörung)"],
        ["Vitalwerte Tag 1, 16 Uhr", "RR 152/88 mmHg · HF 92/min · T 37,2 °C · SpO₂ 97 % · BZ 214 mg/dl"],
        ["Ausscheidung", "letzte Miktion Tag 1, 15:40 Uhr, ca. 80 ml"]
      ],
      anamnese: "Das ist mir alles so peinlich. Ich war vierzig Jahre Grundschullehrerin, im Krankenhaus hab ich nur bei den Kindern gelegen. Den Arm hab ich mir im Garten gebrochen, über den Schlauch gestolpert, wie dumm. Der muss jetzt in dieser Schlinge bleiben. Seit heute Mittag muss ich ständig zur Toilette, aber es kommt nur so ein bisschen, und es drückt da unten. Mein Hausarzt hat mir vor zwei Wochen was zum Schlafen gegeben, Amitriptylin heißt das, glaub ich. Seitdem schlaf ich besser, aber der Mund ist immer so trocken. Gummihandschuhe vertrag ich übrigens nicht, da krieg ich Quaddeln, das weiß ich vom Abwaschen. Blasenentzündungen hatte ich früher oft, zweimal im Jahr bestimmt. Den Zucker spritz ich sonst selbst, aber jetzt mit dem Arm geht das ja nicht. Und waschen, na ja, unten rum, das möchte ich eigentlich lieber selbst. Meine Freundin aus dem Chor kommt morgen Nachmittag.",
      kern: [
        { t: "Häufiger Harndrang mit kleinen Mengen und Druckgefühl: Hinweis auf beginnende Harnretention", kw: ["harndrang", "toilette", "bisschen", "drück", "restharn", "harnverhalt", "retention", "miktion", "drang"] },
        { t: "Amitriptylin seit 14 Tagen (anticholinerg): Mundtrockenheit, mögliche Ursache der Harnretention", kw: ["amitriptylin", "anticholinerg", "mund", "schlafmittel"] },
        { t: "Latexallergie (Quaddeln), in der Akte nicht erfasst!", kw: ["latex", "gummi", "quaddel", "allergi"] },
        { t: "Rezidivierende Harnwegsinfekte", kw: ["blasenentz", "hwi", "harnwegsinf", "zystitis"] },
        { t: "Insulinpflichtiger Diabetes, Selbstmanagement durch Armfraktur eingeschränkt", kw: ["insulin", "zucker", "diabet", "spritz"] },
        { t: "Humerusfraktur links im Gilchrist-Verband: Hilfebedarf bei Körperpflege und Ankleiden", kw: ["arm", "humerus", "schlinge", "gilchrist", "fraktur"] },
        { t: "Ausgeprägtes Schamgefühl, möchte Intimpflege selbst übernehmen", kw: ["peinlich", "scham", "intim", "selbst waschen"] },
        { t: "Ressourcen: kognitiv orientiert, Besuch der Chorfreundin", kw: ["freundin", "chor", "besuch", "orientiert"] }
      ]
    }
  },

  /* ---------- Phase 1.3 Pflegeplanung: Erwartungshorizont ---------- */
  plan: {
    A: {
      diag: "Sturzgefahr (NANDA-I 00155) b/d Synkope in der Vorgeschichte, Exsikkose, Hinweisen auf Herzrhythmusstörung („Flattern“), nächtlicher Desorientierung und Hörminderung. Zusätzlich: Risiko für akute Verwirrtheit (00173) und Defizitäres Flüssigkeitsvolumen (00027).",
      ziel: "Herr Kowalski bleibt während des Aufenthalts sturzfrei. Er trinkt täglich die ärztlich festgelegte Menge (bei Herzinsuffizienz nie pauschal „2 Liter“). Er ist tagsüber zu Ort und Situation orientiert.",
      mass: [
        "Individuelle Sturzrisikoeinschätzung nach DNQP-Expertenstandard Sturzprophylaxe, bei jeder Zustandsänderung neu",
        "Vitalzeichen inkl. Puls manuell über 60 Sekunden; jeden Telemetrie-Alarm am Patienten abklären",
        "Umgebung: Bett in Niedrigposition, Klingel in Reichweite, Nachtlicht, feste Schuhe, Begleitung beim ersten Aufstehen, Kreislauf vorher prüfen",
        "Hörgerät funktionsfähig machen (Batterie), Orientierungshilfen (Uhr, Kalender), feste Bezugspersonen",
        "Ein- und Ausfuhrbilanz, tägliches Gewicht, Trinkplan nach Vorlieben in Absprache mit dem Arzt"
      ],
      chk: [
        { t: "Pflegediagnose Sturzgefahr mit konkreten Risikofaktoren", kw: ["sturz"] },
        { t: "Weitere Diagnose: Delir-/Verwirrtheitsrisiko oder Flüssigkeitsdefizit", kw: ["delir", "verwirr", "flüssigkeit", "exsikkose"] },
        { t: "Ziel konkret und überprüfbar, Trinkmenge ärztlich festgelegt (Herzinsuffizienz)", kw: ["sturzfrei", "ärztlich", "trinkmenge", "ml"] },
        { t: "Pulskontrolle manuell / Telemetrie-Alarme am Patienten abklären", kw: ["puls", "telemetrie", "monitor", "vital"] },
        { t: "Umgebungsanpassung: Niedrigbett, Klingel, Nachtlicht, Schuhe, Begleitung", kw: ["klingel", "niedrig", "nachtlicht", "schuh", "begleit"] },
        { t: "Hörgerät-Batterie, Orientierungshilfen", kw: ["hörgerät", "batterie", "orientier"] },
        { t: "Ein-/Ausfuhrbilanz oder Gewichtskontrolle", kw: ["bilanz", "gewicht", "ausfuhr"] }
      ]
    },
    B: {
      diag: "Beeinträchtigte körperliche Mobilität (00085) b/d Sturzangst nach Liegetrauma und unzureichend behandeltem Bewegungsschmerz, a/d Ablehnung der Mobilisation („muss ja nicht sein“). Zusätzlich: Akuter Schmerz (00132) und Gefahr einer Pneumonie durch Schonatmung bei Rippenfraktur.",
      ziel: "Frau Sommer benennt, was ihr beim Aufstehen Angst macht. Ihr Bewegungsschmerz liegt bei dem Wert, den sie selbst als erträglich angibt (z. B. NRS ≤ 3). Sie geht bis zur Entlassung mit Rollator und Begleitung 20 Meter auf dem Flur.",
      mass: [
        "Schmerzerfassung mit NRS in Ruhe UND bei Bewegung (DNQP Schmerzmanagement), Bedarfsanalgesie nach Anordnung ca. 30 Minuten vor der Mobilisation",
        "Pneumonieprophylaxe: Atemübungen, Husten mit Abstützen der rechten Thoraxseite",
        "Gespräch über die Sturzerfahrung, kleinschrittige Ziele gemeinsam mit der Physiotherapie, Erfolge sichtbar machen",
        "Nachts: Nachtlicht, Toilettenstuhl am Bett, Klingel; Tochter bringt die Fernbrille",
        "Entlassungsmanagement: Beratung zum Einnahmezeitpunkt des Diuretikums (morgens), Wohnraum (Läufer), Hausnotruf, Hüftprotektor anbieten",
        "Keine freiheitsentziehenden Maßnahmen ohne Rechtsgrundlage; Alternativen nach Werdenfelser Weg"
      ],
      chk: [
        { t: "Pflegediagnose Mobilität mit Ursache Sturzangst (nicht „Alter“, nicht „unkooperativ“)", kw: ["mobil", "angst", "furcht"] },
        { t: "Schmerz als eigene Diagnose oder Ursache benannt", kw: ["schmerz"] },
        { t: "Ziel mit NRS-Wert und/oder Gehstrecke", kw: ["nrs", "meter", "rollator", "gehstrecke"] },
        { t: "Analgesie vor der Mobilisation nach Anordnung", kw: ["analges", "schmerzmittel", "metamizol", "vor der mobil", "bedarf"] },
        { t: "Pneumonieprophylaxe trotz/wegen Rippenfraktur", kw: ["pneumonie", "atem"] },
        { t: "Nacht: Toilettenstuhl, Nachtlicht, Brille", kw: ["toilettenstuhl", "nachtstuhl", "nachtlicht", "brille"] },
        { t: "Entlassung: Diuretikum morgens, Wohnraum, Hausnotruf", kw: ["diuret", "wassertablette", "furosemid", "hausnotruf", "läufer", "entlass"] }
      ]
    },
    C: {
      diag: "Risiko eines Harnverhalts bzw. Beeinträchtigte Harnausscheidung (00016) b/d anticholinerger Nebenwirkung (Amitriptylin) und Immobilität, a/d häufigem Harndrang mit kleinen Mengen und Druckgefühl. Zusätzlich: Infektionsrisiko (00004) b/d rezidivierender HWI und Diabetes; Selbstversorgungsdefizit Körperpflege b/d Armfraktur links.",
      ziel: "Die Blase von Frau Wiese entleert sich vollständig (Restharn unter dem hausüblichen Grenzwert). Sie entwickelt keinen Harnwegsinfekt. Ihre Intimsphäre bleibt gewahrt; sie übernimmt die Intimpflege selbst, so weit es geht.",
      mass: [
        "Ein- und Ausfuhr, Miktionsprotokoll, Bladder-Scan nach Hausstandard; bei Retention sofort Arzt informieren",
        "Amitriptylin als mögliche Ursache bei der Visite ansprechen",
        "Allergie-Eintrag in der Akte korrigieren: Latexallergie! Nur latexfreies Material",
        "Falls ärztlich angeordnet: Katheter aseptisch nach KRINKO, Vollsilikon, geschlossenes System, Indikation täglich prüfen",
        "Unterstützung bei BZ-Messung, Insulingabe und Körperpflege; Intimpflege mit Anleitung selbst ermöglichen, gleichgeschlechtliche Pflegeperson anbieten"
      ],
      chk: [
        { t: "Pflegediagnose Harnretention / beeinträchtigte Harnausscheidung", kw: ["harnverhalt", "retention", "harnausscheid", "restharn", "miktion"] },
        { t: "Infektionsrisiko (HWI, Diabetes)", kw: ["infekt", "hwi"] },
        { t: "Ziel: vollständige Blasenentleerung, kein HWI", kw: ["entleer", "kein hwi", "infektfrei", "ziel"] },
        { t: "Latexallergie erkannt und Akte korrigiert", kw: ["latex"] },
        { t: "Amitriptylin als Ursache an den Arzt weitergeben", kw: ["amitriptylin", "anticholinerg"] },
        { t: "Bilanz / Bladder-Scan / Miktionsprotokoll", kw: ["bladder", "scan", "bilanz", "protokoll", "ausfuhr"] },
        { t: "Insulin, Körperpflege, Intimsphäre", kw: ["insulin", "körperpflege", "intim", "scham"] }
      ]
    }
  },

  /* ---------- Phase 2: Nachtdienst-Übergabe (Input) ---------- */
  nacht: [
    ["A", "Herr Kowalski: Ab etwa 03 Uhr hat die Telemetrie mehrfach „Arrhythmie“ gemeldet. Ich glaube, das sind Artefakte, er nestelt dauernd an den Elektroden. Ich hab zweimal neu geklebt. Er war um 04 Uhr kurz desorientiert, hat das Bad gesucht. Trinkmenge Nacht 200 ml. Antibiose um 24 Uhr gelaufen."],
    ["B", "Frau Sommer: Hat dreimal für die Toilette geklingelt, schlecht geschlafen. Sie sagt, es tut nicht weh. Die Tochter hat gestern Abend angerufen, sie kommt heute um 11:30 Uhr und will „was wegen Heim und Bettgittern besprechen“."],
    ["C", "Frau Wiese: Seit 22 Uhr kein Urin mehr, sie war sehr unruhig, Unterbauch gespannt. Bladder-Scan um 05:30 Uhr: 640 ml. Dr. Özdemir ist um 05:45 Uhr informiert, die Anordnung für einen transurethralen Dauerkatheter steht in der Kurve. BZ um 22 Uhr 188 mg/dl, Glargin gegeben."]
  ],

  /* ---------- Phase 2.1 SBAR: Erwartungshorizont ---------- */
  sbar: {
    A: {
      muster: {
        S: "Herr Kowalski, 82 Jahre, Zimmer 412, Tag 4 bei ambulant erworbener Pneumonie. Seit 03 Uhr meldet die Telemetrie wiederholt „Arrhythmie“; das ist noch nicht am Patienten abgeklärt.",
        B: "Aufnahme nach Sturz mit kurzer Bewusstlosigkeit und Exsikkose. Herzinsuffizienz, Hypertonie, Diabetes Typ 2. Bisoprolol, Ampicillin/Sulbactam i.v., Torasemid pausiert. Berichtet selbst über anfallsweises „Flattern“. Hörgerät rechts ohne Batterie, nachts desorientiert.",
        A: "Ich schätze die Alarme nicht als Artefakte ein, solange ich ihn nicht gesehen habe: Verdacht auf neu aufgetretene Herzrhythmusstörung. Hohes Sturz- und Delirrisiko, Flüssigkeitsbilanz negativ.",
        R: "Ich gehe als Erstes zu ihm: Befinden, Vitalzeichen, Puls manuell über 60 Sekunden, Monitorstreifen sichern und den Arzt informieren. Danach Hörgerät-Batterie und Bilanz."
      },
      chk: [
        { t: "S: Name, Alter, Zimmer, Grund des Aufenthalts und das aktuelle Problem (Alarme)", kw: ["alarm", "arrhythm", "telemetrie"] },
        { t: "B: Sturz mit Bewusstlosigkeit, Herzinsuffizienz, relevante Medikation", kw: ["sturz", "herzinsuff", "bisoprolol"] },
        { t: "A: Alarme nicht vorschnell als Artefakt abtun, Verdacht Rhythmusstörung", kw: ["artefakt", "rhythmus", "vorhofflimmern", "flimmern"] },
        { t: "R: zuerst zum Patienten, Puls manuell, Arzt informieren", kw: ["puls", "arzt", "zuerst", "als erstes"] },
        { t: "Hörgerät / Desorientierung erwähnt", kw: ["hörgerät", "desorient", "delir"] }
      ]
    },
    B: {
      muster: {
        S: "Frau Sommer, 86 Jahre, Zimmer 414, Tag 6 nach häuslichem Sturz mit Rippenfraktur rechts und genähter Platzwunde. Sie lehnt die Mobilisation seit Tagen ab.",
        B: "Sie lag nach dem Sturz nachts mehrere Stunden am Boden. Nimmt zu Hause das Diuretikum abends, Nykturie 3–4×. Osteoporose, Gonarthrose. Vorsorgevollmacht Gesundheitssorge an die Tochter, sie selbst ist aber voll entscheidungsfähig.",
        A: "Ich vermute Sturzangst nach Liegetrauma und einen unterschätzten Bewegungsschmerz: Sie bagatellisiert, der NRS-Wert wurde nur in Ruhe erhoben. Durch Schonatmung besteht Pneumoniegefahr.",
        R: "Schmerz in Ruhe und Bewegung erfassen, Bedarfsanalgesie 30 Minuten vor der Physio um 10 Uhr, ein Gespräch über ihre Angst. Für das Gespräch mit der Tochter um 11:30 Uhr: keine Bettgitter ohne Rechtsgrundlage, Alternativen anbieten."
      },
      chk: [
        { t: "S: Sturz, Rippenfraktur, Ablehnung der Mobilisation", kw: ["rippe", "mobilis", "lehnt"] },
        { t: "B: Liegetrauma (Stunden am Boden)", kw: ["lag", "liege", "stunden", "boden"] },
        { t: "A: Sturzangst und unterschätzter Schmerz", kw: ["angst", "schmerz"] },
        { t: "R: Schmerzerfassung in Bewegung + Analgesie vor Physio", kw: ["nrs", "bewegung", "analges", "bedarf", "metamizol"] },
        { t: "Tochter / Bettgitter rechtlich eingeordnet", kw: ["bettgitter", "freiheitsentz", "fem", "tochter", "vollmacht"] }
      ]
    },
    C: {
      muster: {
        S: "Frau Wiese, 79 Jahre, Zimmer 415, Tag 2 nach Humerusfraktur links. Seit 22 Uhr kein Urin, Bladder-Scan 05:30 Uhr 640 ml, Unterbauch gespannt, unruhig. Anordnung transurethraler Dauerkatheter liegt vor.",
        B: "Insulinpflichtiger Diabetes, rezidivierende Harnwegsinfekte, seit 14 Tagen Amitriptylin vom Hausarzt. Wichtig: Latexallergie laut Patientin, in der Akte steht „keine bekannt“.",
        A: "Akuter Harnverhalt, wahrscheinlich mitbedingt durch das anticholinerg wirkende Amitriptylin. Hohes Infektionsrisiko. Sie schämt sich sehr.",
        R: "Katheter jetzt zeitnah aseptisch und latexfrei legen, Allergie in der Akte korrigieren lassen, Amitriptylin bei der Visite ansprechen, BZ vor dem Frühstück und Insulin übernehmen."
      },
      chk: [
        { t: "S: Harnverhalt mit Bladder-Scan-Wert, Anordnung DK", kw: ["640", "bladder", "harnverhalt", "katheter"] },
        { t: "B: Latexallergie ausdrücklich genannt", kw: ["latex"] },
        { t: "B/A: Amitriptylin als mögliche Ursache", kw: ["amitriptylin", "anticholinerg"] },
        { t: "R: DK zeitnah, aseptisch, latexfrei", kw: ["aseptisch", "steril", "latexfrei", "silikon", "zeitnah"] },
        { t: "Diabetes / Insulin / Intimsphäre berücksichtigt", kw: ["insulin", "bz", "intim", "scham"] }
      ]
    }
  },

  /* ---------- Phase 2.2 Prioritätenplan ---------- */
  prio: [
    { id: "k1", t: "Herr Kowalski: Telemetrie-Alarme am Patienten abklären (Befinden, Vitalzeichen, Puls manuell, Streifen sichern)", zeit: "06:15", warum: "Mögliche akute Gefährdung (neue Rhythmusstörung, Synkope in der Vorgeschichte). Ein nicht abgeklärter Alarm hat immer Vorrang. Alarmmüdigkeit ist eine typische Prüfungsfalle." },
    { id: "w1", t: "Frau Wiese: Anordnung prüfen, Patientin informieren, Material für den Dauerkatheter richten", zeit: "06:35", warum: "Akuter Harnverhalt mit 640 ml ist schmerzhaft und gefährdet die Blase. Er folgt direkt nach der Abklärung des potenziell lebensbedrohlichen Problems." },
    { id: "w2", t: "Frau Wiese: transurethralen Dauerkatheter legen", zeit: "06:50", warum: "Zeitnah, aber geplant und aseptisch. Hektik erhöht das Risiko von Sterilitätsfehlern." },
    { id: "bz", t: "BZ-Messung bei Herrn Kowalski und Frau Wiese vor dem Frühstück", zeit: "07:20", warum: "Zeitgebunden an die Mahlzeit, Grundlage für das Korrekturschema." },
    { id: "fr", t: "Frühstück; Insulin nach Schema bei Frau Wiese verabreichen (Armfraktur)", zeit: "07:30", warum: "Insulin passend zur Mahlzeit. Frau Wiese kann sich wegen des Arms nicht selbst spritzen." },
    { id: "ab", t: "Herr Kowalski: Antibiose i.v. 08 Uhr", zeit: "08:00", warum: "Fester Zeitpunkt, das 8-Stunden-Intervall hält den Wirkspiegel." },
    { id: "s1", t: "Frau Sommer: Schmerzerfassung in Ruhe und Bewegung, Bedarfsanalgesie nach Anordnung", zeit: "09:20", warum: "Mit etwa 30 Minuten Vorlauf zur Physiotherapie um 10 Uhr, damit das Analgetikum wirkt." },
    { id: "s2", t: "Frau Sommer: Körperpflege und Mobilisation gemeinsam mit der Physiotherapie", zeit: "10:00", warum: "Fester Termin. Körperpflege und Mobilisation werden gebündelt, das spart Kraft." },
    { id: "vi", t: "Visite 10:30 vorbereiten: Kurven, Fragen zu Amitriptylin, Trinkmenge, Diuretikum-Zeitpunkt", zeit: "10:15", warum: "Wer mit klaren Fragen in die Visite geht, steuert den Pflegeprozess (vorbehaltene Tätigkeit)." },
    { id: "ag", t: "Angehörigengespräch mit Tochter Sommer", zeit: "11:30", warum: "Fester Termin. Vorbereitet mit den rechtlichen Grenzen freiheitsentziehender Maßnahmen." },
    { id: "do", t: "Dokumentation abschließen, Übergabe an den Spätdienst vorbereiten", zeit: "13:00", warum: "Dokumentiert wird fortlaufend und zeitnah. Hier wird es vervollständigt und die Übergabe strukturiert." }
  ],

  /* ---------- Phase 3.1 Patient A: Bildbefund ---------- */
  a: {
    situation: "06:12 Uhr. Noch während der Übergabe piept die Monitorzentrale: „Zi. 412 · ARRHYTHMIE“. Die Kollegin aus dem Nachtdienst winkt ab: „Das ist der Kowalski, der nestelt wieder.“ Du druckst den aktuellen Streifen aus und legst ihn neben den Streifen vom Aufnahmetag.",
    vitals: "06:16 Uhr am Patienten: Herr Kowalski ist wach, etwas blass, sagt: „Mir ist so schwummrig, und das Flattern ist wieder da.“ Kein Brustschmerz. RR 108/64 mmHg · SpO₂ 93 % bei Raumluft · AF 22/min · Haut kühl, trocken. Du tastest den Radialispuls 60 Sekunden lang: 104/min, unregelmäßig. Der Monitor zeigt im selben Zeitraum eine Herzfrequenz von 132/min.",
    q1: {
      text: "Wie beurteilst du den aktuellen Streifen von 06:12 Uhr?",
      opts: [
        { t: "Tachykardes Vorhofflimmern (Tachyarrhythmia absoluta)", ok: true, fb: "Richtig. Unregelmäßige RR-Abstände ohne jedes Muster, keine abgrenzbaren P-Wellen, unruhige Grundlinie mit Flimmerwellen, schmale QRS-Komplexe, Kammerfrequenz um 130/min." },
        { t: "Bewegungsartefakte, wie der Nachtdienst vermutet", ok: false, fb: "Praxisfalle Alarmmüdigkeit. Artefakte verändern die Grundlinie bizarr, die QRS-Komplexe darunter bleiben aber regelmäßig. Hier sind die QRS-Komplexe gut erkennbar, gleich geformt und unregelmäßig. Und: Ein Alarm wird am Patienten abgeklärt, nicht am Stationstresen." },
        { t: "Sinustachykardie bei Fieber und Exsikkose", ok: false, fb: "Bei einer Sinustachykardie steht vor jedem QRS-Komplex eine P-Welle und die Abstände sind regelmäßig. Beides fehlt hier." },
        { t: "AV-Block II. Grades Typ Mobitz", ok: false, fb: "Beim AV-Block II° gibt es P-Wellen, nach denen einzelne QRS-Komplexe ausfallen. Hier fehlen die P-Wellen ganz, und die Frequenz ist hoch statt niedrig." },
        { t: "Kammerflimmern: Reanimation einleiten", ok: false, fb: "Kammerflimmern zeigt keine QRS-Komplexe mehr, und der Patient wäre bewusstlos und pulslos. Herr Kowalski spricht mit dir. Wer hier reanimiert, gefährdet ihn." }
      ]
    },
    q2: {
      text: "Welche Merkmale erkennst du im Streifen von 06:12 Uhr? (Mehrfachauswahl)",
      opts: [
        { t: "Absolut unregelmäßige RR-Abstände", ok: true },
        { t: "Fehlende P-Wellen, flimmernde Grundlinie", ok: true },
        { t: "Schmale QRS-Komplexe", ok: true },
        { t: "Deutliche ST-Strecken-Hebung", ok: false, fb: "Die ST-Strecke liegt auf der Grundlinie. Eine Ischämie lässt sich übrigens nur im 12-Kanal-EKG beurteilen, nicht am Monitor." },
        { t: "Breite, deformierte QRS-Komplexe", ok: false, fb: "Die Komplexe sind schmal (unter 3 kleinen Kästchen = 0,12 s). Breite Komplexe würden auf einen Ursprung in der Kammer hindeuten." },
        { t: "Regelmäßige Sägezahnwellen", ok: false, fb: "Sägezahnwellen sprechen für Vorhofflattern. Hier ist die Grundlinie unregelmäßig." }
      ]
    },
    q3: {
      text: "Welche Maßnahmen ergreifst du jetzt? Wähle alle richtigen.",
      opts: [
        { t: "Bei ihm bleiben bzw. Bettruhe sichern, Klingel in Reichweite, er steht nicht allein auf", ok: true, fb: "Synkope in der Vorgeschichte plus Schwindel und Tachyarrhythmie bedeuten akute Sturzgefahr." },
        { t: "Arzt sofort informieren, strukturiert nach SBAR", ok: true, fb: "Ein neu aufgetretenes tachykardes Vorhofflimmern mit Schwindel und einem Blutdruck um 100 systolisch muss sofort ärztlich beurteilt werden." },
        { t: "12-Kanal-EKG vorbereiten bzw. nach Hausstandard schreiben", ok: true, fb: "Das Monitor-EKG reicht zur Diagnose nicht. Das 12-Kanal-EKG dokumentiert den Rhythmus beweissicher." },
        { t: "Vitalzeichen engmaschig kontrollieren, Bewusstsein und Befinden beobachten", ok: true, fb: "Achte vor allem auf RR-Abfall, Brustschmerz, Atemnot und Bewusstseinsänderung." },
        { t: "Elektroden neu kleben und den Alarm bis zur Visite leiser stellen", ok: false, fb: "Kritisch: Alarme stumm zu schalten ist ein klassischer Pflegefehler. Neu kleben ist nur sinnvoll, wenn wirklich Artefakte vorliegen, und das hast du gerade widerlegt." },
        { t: "Die morgendliche Bisoprolol-Dosis vorziehen, weil die Frequenz hoch ist", ok: false, fb: "Kritisch: Das ist eine eigenmächtige ärztliche Entscheidung. Bei einem RR von 108/64 kann ein Betablocker zusätzlich den Blutdruck senken." },
        { t: "Ihn zum Kreislauftraining an die Bettkante setzen", ok: false, fb: "Mobilisation bei Schwindel und unklarer Rhythmusstörung erhöht die Sturzgefahr." }
      ]
    },
    q5: {
      text: "Welche Beobachtung ergänzt du für die nächsten Stunden besonders?",
      opts: [
        { t: "Neurologische Beobachtung (z. B. BE-FAST): Gesicht, Arme, Sprache, Sehen, Gleichgewicht", ok: true, fb: "Richtig. Beim Vorhofflimmern können sich Gerinnsel im Vorhof bilden. Das Schlaganfallrisiko steigt, Enoxaparin in Prophylaxedosis schützt nicht ausreichend. Die Entscheidung über eine Antikoagulation trifft der Arzt." },
        { t: "Stündliche Temperaturmessung wegen der Pneumonie", ok: false, fb: "Fieber ist relevant, erklärt aber nicht die neue Gefahr durch das Vorhofflimmern." },
        { t: "Blutzucker alle 30 Minuten", ok: false, fb: "Nicht begründet. Der Blutzucker wird nach Schema gemessen." },
        { t: "Bis zur Visite keine weitere Beobachtung nötig, der Arzt ist ja informiert", ok: false, fb: "Die Beobachtung bleibt Aufgabe der Pflege, auch nach der Meldung." }
      ]
    },
    pd: 28
  },

  /* ---------- Phase 3.2 Patient B: Dialogbaum ---------- */
  b: {
    start: "n1",
    intro: "09:20 Uhr, Zimmer 414. Du willst die Schmerzerfassung machen und die Mobilisation um 10 Uhr vorbereiten. Frau Sommer liegt im Bett, die Decke bis zum Kinn gezogen.",
    infos: {
      angst: "Angst vor erneutem Sturz nach sieben Stunden am Boden",
      schmerz: "Bewegungsschmerz NRS 6 (Ruhe NRS 2), wird verschwiegen",
      nacht: "Nykturie: zu Hause Diuretikum abends",
      ziel: "Eigenes Ziel: wieder allein einkaufen gehen"
    },
    nodes: {
      n1: {
        who: "Frau Sommer", say: "Ach Schwester, lassen Sie mal. Heute nicht. Sagen Sie der Krankengymnastin, morgen vielleicht. Ich bin ja auch nicht mehr die Jüngste.",
        opts: [
          { t: "Du setzt dich auf Augenhöhe ans Bett: „Frau Sommer, ich merke, dass Ihnen das Aufstehen schwerfällt. Was geht Ihnen durch den Kopf, wenn Sie ans Aufstehen denken?“", p: 3, typ: "professionell-empathisch", re: "Sie schaut lange zum Fenster.", fb: "Offene Frage, Augenhöhe, Gefühl gespiegelt. So öffnet sich das Gespräch, ohne zu drängen.", next: "n2" },
          { t: "„Frau Sommer, Sie müssen aufstehen, sonst bekommen Sie eine Thrombose und eine Lungenentzündung. Das sagt der Arzt auch.“", p: 1, typ: "fachlich richtig, aber Druck", re: "„Na, dann sterb ich halt dran. Lieber als nochmal da liegen.“ Sie dreht sich weg.", fb: "Fachlich korrekt, aber Angst wird mit Angst beantwortet, und das Argument stützt sich auf Autorität. Achte auf den Hinweis in ihrer Antwort: „nochmal da liegen“.", next: "n2b" },
          { t: "„In Ordnung, das ist Ihr gutes Recht. Ich trage ein: Patientin lehnt Mobilisation ab.“ Du gehst.", p: 0, typ: "rechtlich/fachlich schlampig", re: "Die Tür fällt ins Schloss.", fb: "Selbstbestimmung ja, aber eine Ablehnung ohne Ursachenklärung und ohne Aufklärung über die Folgen ist keine informierte Entscheidung. „Lehnt ab“ ohne Gründe ist zudem keine verwertbare Dokumentation (DNQP Erhaltung und Förderung der Mobilität).", next: "r1", warn: true },
          { t: "„Wissen Sie was? Dann machen wir heute nur ein bisschen Bettgymnastik, das reicht auch.“", p: 1, typ: "deeskalierend, aber ausweichend", re: "„Ja, das ist gut.“ Sie wirkt erleichtert.", fb: "Der Konflikt ist entschärft, die Ursache bleibt aber unentdeckt. Deeskalation ersetzt keine Exploration.", next: "n2b" }
        ]
      },
      r1: {
        who: "Zehn Minuten später", say: "Die Klingel aus Zimmer 414. Frau Sommer liegt im nassen Bett und weint: „Ich hab mich nicht getraut, allein aufzustehen. Und Sie waren weg.“",
        opts: [
          { t: "„Das ist überhaupt nicht schlimm, ich helfe Ihnen jetzt. Und danach möchte ich verstehen, was Sie am Aufstehen hindert.“", p: 2, typ: "Beziehung reparieren", re: "Während du ihr hilfst, beruhigt sie sich.", fb: "Gut repariert: Würde wahren, ohne Vorwurf, und das Gespräch neu öffnen.", next: "n2" },
          { t: "„Dafür haben Sie doch die Klingel! Warum haben Sie nicht geklingelt?“", p: 0, typ: "vorwurfsvoll", re: "„Ich wollte nicht schon wieder stören.“ Sie schämt sich sichtlich.", fb: "Warum-Fragen klingen nach Vorwurf und verstärken die Scham.", next: "n2" },
          { t: "Du legst ihr zur Sicherheit eine Inkontinenzhose an.", p: 0, typ: "fachlich falsch", re: "Sie sagt nichts mehr.", fb: "Inkontinenzmaterial ohne Inkontinenz fördert Abhängigkeit und verletzt die Würde (DNQP Förderung der Harnkontinenz). Das Problem ist die Angst vor dem Aufstehen, nicht die Blase.", next: "n2", warn: true }
        ]
      },
      n2b: {
        who: "Frau Sommer", say: "(Sie setzt sich mühsam an die Bettkante, verzieht das Gesicht und hält sich die rechte Seite.) „Nein, nein, nicht hinstellen! Bitte nicht!“",
        opts: [
          { t: "„Ich sehe, dass Ihnen das gerade weh tut und Sie sich erschrecken. Wir bleiben sitzen. Was macht Ihnen im Moment am meisten Angst?“", p: 3, typ: "professionell-empathisch", re: "Sie atmet durch und fängt an zu erzählen.", fb: "Du nimmst Schmerz und Angst wahr, nimmst den Druck raus und fragst offen.", next: "n2" },
          { t: "„Halten Sie sich an mir fest, ich hab Sie.“ Du ziehst sie hoch.", p: 0, typ: "gefährlich", re: "Ihre Knie geben nach, sie sackt zurück auf die Bettkante. Beinahe-Sturz.", fb: "Kritisch: Hochziehen gegen den erkennbaren Willen und ohne Hilfsmittel. Das ist eine Sturzgefahr und für Rippenfraktur und Schulter ein Risiko. Bei Angst gilt: stoppen, nicht durchziehen.", next: "n2", warn: true },
          { t: "„Na gut, dann eben morgen.“", p: 0, typ: "ausweichend", re: "Sie legt sich wieder hin.", fb: "Damit endet die Chance, die Ursache zu klären.", next: "n4" }
        ]
      },
      n2: {
        who: "Frau Sommer", say: "„Wissen Sie … ich hab da sieben Stunden gelegen. Im Flur. Ich kam nicht mehr hoch. Ich hab gerufen, aber wer hört einen schon nachts.“", info: "angst",
        opts: [
          { t: "Du lässt die Stille kurz stehen. „Sieben Stunden allein auf dem Boden, das klingt furchtbar. Haben Sie Angst, dass Ihnen das wieder passiert?“", p: 3, typ: "professionell-empathisch", re: "Sie nickt, Tränen in den Augen. „Ja. Jedes Mal, wenn ich aufstehen soll.“", fb: "Aktives Zuhören, Stille aushalten, das Gefühl benennen. Damit ist die Sturzangst als Ursache benannt.", next: "n3" },
          { t: "„Das passiert hier nicht, hier sind wir ja immer da. Also, auf geht's!“", p: 1, typ: "beschwichtigend", re: "„Hm.“ Sie stemmt sich hoch und stöhnt auf, die Hand an der Seite.", fb: "Beschwichtigen übergeht das Gefühl. Immerhin wird jetzt der Schmerz sichtbar.", next: "n3" },
          { t: "„Warum sind Sie nachts überhaupt ohne Licht aufgestanden?“", p: 1, typ: "vorwurfsvoll", re: "„Weil ich musste! Die Wassertablette, die nehm ich abends, da muss ich dauernd.“", info: "nacht", fb: "Inhaltlich ergiebig (Nykturie, Diuretikum abends), aber die Warum-Frage klingt nach Schuld. Sie geht in die Verteidigung.", next: "n3" },
          { t: "„Vielleicht wäre ein Heim wirklich sicherer. Ihre Tochter denkt das ja auch.“", p: 0, typ: "grenzüberschreitend", re: "Sie fängt an zu weinen. „Ins Heim geh ich nicht! Hat sie das gesagt?“", fb: "Du gibst die Meinung der Tochter weiter und nimmst eine Entscheidung vorweg, die nicht deine ist. Das zerstört Vertrauen.", next: "r2", warn: true }
        ]
      },
      r2: {
        who: "Frau Sommer", say: "(weint) „Ich will nach Hause. Ich hab da alles. Den Herrn Yilmaz. Meinen Laden um die Ecke.“", info: "ziel",
        opts: [
          { t: "„Das tut mir leid, das stand mir nicht zu. Niemand entscheidet über Ihren Kopf hinweg. Was brauchen Sie, damit Sie sich zu Hause wieder sicher fühlen?“", p: 2, typ: "Beziehung reparieren", re: "„Ich müsste halt wieder richtig laufen können. Aber ich trau mich nicht.“", fb: "Gut: Fehler eingestanden, Selbstbestimmung betont, auf ihr eigenes Ziel gelenkt.", next: "n3" },
          { t: "„Das war doch nur ein Vorschlag, regen Sie sich nicht auf.“", p: 0, typ: "abwertend", re: "Sie schweigt und schaut weg.", fb: "Das entwertet ihre Gefühle. Das Gespräch ist für heute schwer belastet.", next: "n3" }
        ]
      },
      n3: {
        who: "Frau Sommer", say: "„Und dann tut's ja auch weh, hier an der Seite, wenn ich mich hochzieh. Aber man will ja nicht jammern.“",
        opts: [
          { t: "„Sie jammern nicht, Sie helfen mir, wenn Sie mir das sagen. Auf einer Skala von 0 bis 10: Wie stark ist der Schmerz im Liegen, und wie stark, wenn Sie sich aufsetzen?“", p: 3, typ: "professionell-empathisch", re: "„Im Liegen … zwei. Beim Aufsetzen … sechs, bestimmt.“", info: "schmerz", fb: "Schmerzerfassung in Ruhe und Bewegung, ihre Zurückhaltung wird umgedeutet. Genau das fordert der DNQP-Expertenstandard Schmerzmanagement.", next: "n3b" },
          { t: "„Ich bring Ihnen gleich ein Metamizol, dann geht das schon.“", p: 1, typ: "vorschnell", re: "„Na gut.“", fb: "Die Bedarfsanalgesie ist angeordnet, aber du gibst sie ohne Schmerzerfassung. Damit fehlt der Ausgangswert für die Wirkkontrolle.", next: "n4" },
          { t: "„Schmerzen gehören nach so einem Sturz leider dazu, das wird mit der Zeit besser.“", p: 0, typ: "bagatellisierend", re: "„Ja, wird schon.“", fb: "Damit bestätigst du ihr Muster, nicht zu klagen. Ein unbehandelter Bewegungsschmerz hält die Immobilität aufrecht.", next: "n4", warn: true },
          { t: "„Dann bleiben Sie heute lieber liegen, bis es nicht mehr weh tut.“", p: 0, typ: "fachlich falsch", re: "Sie lächelt erleichtert.", fb: "Bettruhe bei Rippenfraktur fördert Pneumonie, Thrombose und Muskelabbau. Das Gegenteil ist richtig: Analgesie, dann Bewegung.", next: "n4", warn: true }
        ]
      },
      n3b: {
        who: "Frau Sommer", say: "„Sechs ist doch nicht so schlimm, oder? Ich will ja keine Tabletten-Oma werden.“",
        opts: [
          { t: "„Mit sechs kann man sich schlecht bewegen. Der Arzt hat für Sie ein Schmerzmittel bei Bedarf angeordnet. Wenn Sie es jetzt nehmen, wirkt es, wenn um zehn die Krankengymnastin kommt. Danach frage ich Sie wieder nach dem Wert. Was wäre denn für Sie ein Wert, mit dem Sie gut aufstehen können?“", p: 3, typ: "professionell, partizipativ", re: "„Drei vielleicht. Und ich will wieder allein zum Bäcker.“", info: "ziel", fb: "Aufklärung, Zeitpunkt passend zur Physio, Wirkkontrolle angekündigt, ein Zielwert und ein Lebensziel gemeinsam vereinbart.", next: "n4" },
          { t: "„Stimmt, sechs ist noch im Rahmen. Wir schauen morgen nochmal.“", p: 0, typ: "fachlich falsch", re: "„Gut.“", fb: "Ob ein Schmerz akzeptabel ist, legt die Patientin fest, nicht die Pflegekraft. Und bei NRS 6 ist Mobilisation kaum möglich.", next: "n4" }
        ]
      },
      n4: {
        who: "Tochter Sabine Sommer", say: "(09:40 Uhr, sie kommt unangemeldet früher ins Zimmer) „Gut, dass Sie da sind. Mama fällt hier noch aus dem Bett. Ich will, dass nachts die Gitter hochgemacht werden. Und notfalls fixieren Sie sie. Ich unterschreibe das, ich hab eine Vorsorgevollmacht.“",
        opts: [
          { t: "„Ich verstehe Ihre Sorge, Frau Sommer. Bettgitter sind eine freiheitsentziehende Maßnahme. Ihre Mutter ist entscheidungsfähig, deshalb entscheidet sie selbst. Und wer über ein Gitter klettert, fällt tiefer. Lassen Sie uns zu dritt überlegen, was ihr nachts Sicherheit gibt: Niedrigbett, Nachtlicht, Toilettenstuhl am Bett, die Fernbrille von zu Hause. Den Zeitpunkt der Wassertablette spreche ich mit dem Arzt an.“", p: 3, typ: "professionell, rechtssicher, deeskalierend", re: "Die Tochter atmet aus. „Die Brille bring ich morgen mit.“ Frau Sommer nickt ihr zu.", fb: "Rechtlich korrekt: Bei einer einwilligungsfähigen Person zählt nur ihre eigene Einwilligung. Eine Bevollmächtigte bräuchte für regelmäßige oder länger dauernde FEM zusätzlich die Genehmigung des Betreuungsgerichts (§ 1831 BGB). Dazu fachlich begründete Alternativen (Werdenfelser Weg).", next: "end" },
          { t: "„Klar, mit Vollmacht geht das. Ich mache heute Nacht die Gitter hoch und trage es ein.“", p: 0, typ: "rechtswidrig", ko: true, re: "Frau Sommer schaut entsetzt zwischen euch hin und her.", fb: "Kritischer Fehler: Gegen den Willen einer einwilligungsfähigen Patientin wäre das Freiheitsberaubung (§ 239 StGB). Die Vollmacht greift nur, wenn sie selbst nicht einwilligungsfähig ist, und auch dann braucht es für regelmäßige oder länger dauernde FEM eine betreuungsgerichtliche Genehmigung (§ 1831 Abs. 4 und 5 BGB).", next: "end" },
          { t: "„Darüber kann ich nicht entscheiden, das muss der Arzt anordnen.“", p: 1, typ: "unvollständig", re: "„Dann holen Sie ihn!“ Die Tochter wird lauter.", fb: "Teilweise richtig: In der Klinik braucht es eine ärztliche Anordnung. Entscheidend sind aber Einwilligung oder Genehmigung, und die Alternativen fehlen. Der Konflikt eskaliert.", next: "end" },
          { t: "Du wendest dich an die Mutter: „Das wollen Sie doch sicher auch, oder, Frau Sommer?“", p: 0, typ: "suggestiv", re: "Frau Sommer nickt eingeschüchtert.", fb: "Eine Einwilligung unter Druck und ohne Aufklärung über Risiken und Alternativen ist nicht wirksam.", next: "end", warn: true }
        ]
      }
    },
    diag: {
      text: "Welche Pflegediagnose formulierst du nach dem Gespräch?",
      opts: [
        { t: "Beeinträchtigte körperliche Mobilität b/d Sturzangst nach Liegetrauma und unzureichend behandeltem Bewegungsschmerz, a/d Ablehnung der Mobilisation", ok: true, fb: "Richtig. Ursache (Angst, Schmerz) und Kennzeichen sind benannt, daraus lassen sich gezielte Maßnahmen ableiten." },
        { t: "Non-Compliance: mangelnde Kooperationsbereitschaft bei der Mobilisation", ok: false, fb: "Das stigmatisiert und benennt keine Ursache. Es führt zu Druck statt Hilfe." },
        { t: "Selbstversorgungsdefizit b/d hohes Alter", ok: false, fb: "Alter ist keine pflegerisch beeinflussbare Ursache." },
        { t: "Akute Verwirrtheit", ok: false, fb: "Frau Sommer ist orientiert. Dafür gibt es keine Hinweise." }
      ]
    }
  },

  /* ---------- Phase 3.3 Patient C: Schritt für Schritt ---------- */
  c: {
    intro: "06:50 Uhr, Zimmer 415 (Einzelzimmer). Anordnung in der Kurve: „Transurethraler DK, Vollsilikon Ch 12, Blockung 10 ml lt. Hersteller. Dr. Özdemir, 05:45 Uhr.“ Bladder-Scan 05:30 Uhr: 640 ml. Frau Wiese ist unruhig und schämt sich.",
    ko: [
      "Latexhaltiges Material bei bekannter Latexallergie",
      "Ohne gültige ärztliche Anordnung oder ohne Identitätsprüfung handeln",
      "Einen kontaminierten Katheter weiterverwenden (z. B. nach Fehllage in der Vagina)",
      "Blocken, bevor Urin fließt (Gefahr einer Harnröhrenverletzung)",
      "Bruch der Asepsis nicht bemerken oder nicht beheben"
    ],
    steps: [
      { t: "Vorbereitung am Stützpunkt", q: "Womit beginnst du?", opts: [
        { t: "Anordnung und Indikation in der Kurve prüfen, Identität (Name, Geburtsdatum) und Allergien bei der Patientin erfragen", ok: true, fb: "Richtig. Die Allergie-Frage deckt die Latexallergie auf, die in der Akte fehlt." },
        { t: "Material holen. Die Anordnung kenne ich aus der Übergabe.", ko: true, fb: "Kritisch: Eine mündlich weitergegebene Anordnung reicht nicht. Du prüfst sie schriftlich selbst." },
        { t: "Direkt ins Zimmer, die Patientin hat Schmerzen, Zeit ist wichtiger als Papier", fb: "Dringend heißt nicht kopflos. Die Prüfung dauert eine Minute und schützt vor Verwechslung und Allergie." }
      ]},
      { t: "Information und Intimsphäre", q: "Wie bereitest du Frau Wiese vor?", opts: [
        { t: "Ablauf in einfachen Worten erklären, Einverständnis einholen, Sichtschutz, Tür schließen, eine gleichgeschlechtliche Pflegeperson anbieten", ok: true, fb: "Richtig. Gerade bei ausgeprägter Scham ist das Angebot einer gleichgeschlechtlichen Pflegeperson wichtig." },
        { t: "Erst mal anfangen und während des Legens erklären, dann geht es schneller", fb: "Die Einwilligung muss vor dem Eingriff vorliegen. Unerwartete Berührung im Intimbereich verstärkt Scham und Abwehr." },
        { t: "Sagen, dass es nicht weh tut, damit sie sich entspannt", fb: "Das ist eine falsche Zusicherung. Ehrlich: kurz unangenehm, das Gleitmittel hilft." }
      ]},
      { t: "Material richten", q: "Welches Material legst du bereit?", opts: [
        { t: "Steriles Katheterset, Vollsilikon-Katheter Ch 12, latexfreie sterile Handschuhe, Schleimhautantiseptikum, steriles Gleitmittel, Spritze mit 10 ml Aqua dest. bzw. Glycerinlösung nach Hersteller, geschlossenes Ableitungssystem mit Rücklaufsperre", ok: true, fb: "Richtig und vollständig: latexfrei, Blockflüssigkeit nach Herstellerangabe, geschlossenes System." },
        { t: "Silikonbeschichteter Latex-Katheter, der ist ja beschichtet", ko: true, fb: "Kritisch: Beschichtetes Latex bleibt Latex. Bei Allergie droht eine allergische Reaktion bis zur Anaphylaxie. Nur Vollsilikon und latexfreie Handschuhe." },
        { t: "Vollsilikon-Katheter, Blockung mit NaCl 0,9 %", fb: "NaCl kann im Blockkanal auskristallisieren. Dann lässt sich der Ballon später nicht mehr entblocken. Blockflüssigkeit nach Herstellerangabe." },
        { t: "Vollsilikon-Katheter mit einfachem Urinbeutel ohne Rücklaufsperre", fb: "Ohne Rücklaufsperre kann Urin zurückfließen. Die KRINKO fordert ein geschlossenes Ableitungssystem mit Rücklaufsperre." }
      ]},
      { t: "Arbeitsplatz", q: "Wie bereitest du den Arbeitsplatz vor?", opts: [
        { t: "Arbeitsfläche wischdesinfizieren, Bett auf Arbeitshöhe, gute Beleuchtung, Abwurf in Reichweite", ok: true, fb: "Richtig. Eine freie, desinfizierte Fläche ist die Voraussetzung für aseptisches Arbeiten." },
        { t: "Set auf die Bettdecke legen, da ist es nah an der Patientin", fb: "Die Bettdecke ist keine geeignete, desinfizierbare Fläche, und das Set kann verrutschen." },
        { t: "Auf dem Nachttisch neben Wasserglas und Brille arbeiten", fb: "Zu wenig Platz, keine desinfizierte Fläche: hohes Risiko für Kontamination." }
      ]},
      { t: "Lagerung", q: "Wie lagerst du Frau Wiese?", opts: [
        { t: "Rückenlage, Beine angewinkelt und leicht gespreizt, saugfähige Unterlage; linken Arm im Gilchrist-Verband mit einem Kissen stützen", ok: true, fb: "Richtig. Du denkst die Humerusfraktur mit, das zeigt Patientenorientierung." },
        { t: "Linke Seitenlage, so sieht man die Harnröhrenöffnung besser", fb: "Seitenlage auf dem frakturierten Arm verursacht Schmerzen und ist für den weiblichen Katheterismus ungeeignet." },
        { t: "Sitzend an der Bettkante", fb: "So ist kein aseptisches Arbeiten möglich, und die Kreislaufsituation ist nach der Nacht unklar." }
      ]},
      { t: "Vorreinigung", q: "Was kommt vor der Desinfektion?", opts: [
        { t: "Hygienische Händedesinfektion, latexfreie unsterile Handschuhe, Intimpflege mit Wasser und Waschlotion von der Symphyse Richtung Anus", ok: true, fb: "Richtig. Die mechanische Reinigung entfernt Verschmutzungen, auf denen das Antiseptikum sonst nicht wirkt." },
        { t: "Direkt mit dem Antiseptikum desinfizieren, das reicht", fb: "Auf sichtbar verschmutzter Haut ist das Antiseptikum unwirksam. Erst reinigen, dann desinfizieren." },
        { t: "Intimpflege von hinten nach vorne, gründlich hin und her", fb: "So werden Darmkeime zur Harnröhre verschleppt. Immer von vorne nach hinten." }
      ]},
      { t: "Handschuhwechsel", q: "Nach der Intimpflege:", opts: [
        { t: "Handschuhe ausziehen, hygienische Händedesinfektion", ok: true, fb: "Richtig: Wechsel von unrein zu rein." },
        { t: "Handschuhe anbehalten und direkt das sterile Set öffnen", fb: "Mit den kontaminierten Handschuhen würdest du die Außenseite des Sets und das sterile Material gefährden." },
        { t: "Handschuhe ausziehen und gleich sterile anziehen", fb: "Die Händedesinfektion fehlt. Handschuhe sind nie keimfrei dicht, Händedesinfektion vor jeder aseptischen Tätigkeit." }
      ]},
      { t: "Steriles Feld", q: "Wie richtest du das sterile Feld?", opts: [
        { t: "Set aseptisch öffnen (Non-Touch), Katheter steril hineingleiten lassen, Antiseptikum über die Tupfer gießen, Ableitungssystem bereitlegen", ok: true, fb: "Richtig. Nur die Außenseite der Verpackung wird berührt." },
        { t: "Katheter aus der Verpackung nehmen und kurz ablegen, während du das Set öffnest", ko: true, fb: "Kritisch: Der Katheter ist unsteril, sobald er mit der unsterilen Hand berührt oder unsteril abgelegt wird." },
        { t: "Antiseptikum erst später auf die Tupfer geben, wenn die sterilen Handschuhe an sind", fb: "Mit sterilen Handschuhen fasst du keine unsterile Flasche an. Das Antiseptikum wird vorher steril aufgebracht." }
      ]},
      { t: "Sterile Handschuhe", q: "Wie geht es weiter?", opts: [
        { t: "Sterile latexfreie Handschuhe anziehen, Lochtuch steril auflegen. Ab dem Spreizen der Labien gilt die nicht dominante Hand als kontaminiert", ok: true, fb: "Richtig. Die Aufteilung in eine „unsterile“ und eine „sterile“ Hand ist die Grundlage für das Einführen." },
        { t: "Nur an der dominanten Hand einen sterilen Handschuh tragen, die andere bleibt frei", fb: "Die nicht dominante Hand berührt die Schleimhaut. Ein Handschuh ist dort Pflicht für Personalschutz und Hygiene." },
        { t: "Sterile Handschuhe anziehen und den Blockballon vorab mit Aqua testen", fb: "Silikonballons sollen nach den meisten Herstellerangaben nicht vorgetestet werden: Der Ballon kann sich verformen und die Einführung erschweren." }
      ]},
      { t: "Konnektieren", q: "Bevor du einführst:", opts: [
        { t: "Katheter steril mit dem Ableitungssystem verbinden, damit es von Anfang an geschlossen ist; Katheterspitze mit Gleitmittel versehen", ok: true, fb: "Richtig. Ein vorkonnektiertes System verhindert, dass es später geöffnet werden muss." },
        { t: "Katheter offen in eine Nierenschale ableiten und den Beutel erst danach anschließen", fb: "So wird das System nachträglich geöffnet. Das ist ein Infektionsweg, den die KRINKO vermeiden will." },
        { t: "Gleitmittel weglassen, Silikon gleitet von allein", fb: "Gleitmittel schützt die Harnröhrenschleimhaut vor Mikroverletzungen, die Eintrittspforten für Keime sind." }
      ]},
      { t: "Desinfektion", q: "Wie desinfizierst du?", opts: [
        { t: "Labien mit der nicht dominanten Hand spreizen und so halten. Große Labien, kleine Labien, Harnröhrenöffnung je mit neuem Tupfer von der Symphyse Richtung Anus wischen; Einwirkzeit des Antiseptikums abwarten", ok: true, fb: "Richtig. Jeder Tupfer nur einmal, eine Richtung, Einwirkzeit nach Herstellerangabe." },
        { t: "Mit einem Tupfer kreisend über den ganzen Bereich, dafür gründlich", ko: true, fb: "Kritisch: Mit einem kreisend geführten Tupfer verteilst du Keime aus dem Analbereich auf die Harnröhrenöffnung." },
        { t: "Desinfizieren und sofort einführen, die Patientin hat Schmerzen", fb: "Ohne Einwirkzeit wirkt das Antiseptikum nicht. Halte die Zeit nach Herstellerangabe ein." }
      ]},
      { t: "Ereignis beim Einführen", q: "Du führst den Katheter ein. Nach etwa 6 cm fließt kein Urin, Frau Wiese verspürt keinen Druck. Du vermutest, dass der Katheter in der Vagina liegt. Was tust du?", opts: [
        { t: "Katheter liegen lassen (als Orientierung), mit einem neuen sterilen Katheter und neuen sterilen Handschuhen neu ansetzen, oberhalb des ersten Katheters", ok: true, fb: "Richtig. Der erste Katheter ist kontaminiert. Liegen gelassen markiert er die Vagina und verhindert eine zweite Fehllage." },
        { t: "Katheter zurückziehen und noch einmal etwas höher ansetzen", ko: true, fb: "Kritisch: Der Katheter ist mit Vaginalflora kontaminiert. Wird er weiterverwendet, bringst du die Keime direkt in die Blase. Das ist ein klassischer K.o.-Fehler." },
        { t: "Einfach weiter vorschieben, irgendwann kommt Urin", fb: "In der Vagina kommt kein Urin. Weiterschieben verletzt und verzögert." },
        { t: "Blocken, damit er nicht rausrutscht, und den Arzt rufen", ko: true, fb: "Kritisch: Blocken ohne Urinfluss bei unklarer Lage kann verletzen. Ein Ballon wird nie ohne sicheren Urinfluss geblockt." }
      ]},
      { t: "Lagekontrolle", q: "Der neue Katheter liegt, nach 4–5 cm fließt Urin. Was jetzt?", opts: [
        { t: "Katheter noch 2–3 cm weiter vorschieben, damit der Ballon sicher in der Blase liegt", ok: true, fb: "Richtig. Die Augen des Katheters liegen vor dem Ballon. Urinfluss heißt noch nicht, dass der Ballon schon in der Blase ist." },
        { t: "Sofort blocken, sobald der erste Tropfen kommt", fb: "Der Ballon könnte noch in der Harnröhre liegen. Blocken dort verletzt sie." },
        { t: "Katheter bis zum Anschlag einführen", fb: "Unnötig und schmerzhaft. Bei Frauen reichen 2–3 cm über den Urinfluss hinaus." }
      ]},
      { t: "Blocken", q: "Womit blockst du?", opts: [
        { t: "Mit 10 ml Aqua dest. bzw. Glycerinlösung laut Hersteller langsam blocken, Frau Wiese nach Schmerzen fragen, dann den Katheter vorsichtig zurückziehen, bis ein federnder Widerstand spürbar ist", ok: true, fb: "Richtig. Schmerz beim Blocken ist ein Warnzeichen: dann sofort entblocken." },
        { t: "Mit 20 ml blocken, dann rutscht er sicher nicht raus", fb: "Überfüllung reizt die Blasenwand, verursacht Blasenkrämpfe und kann den Ballon schädigen. Volumen nach Herstellerangabe." },
        { t: "Mit Luft blocken", fb: "Luft diffundiert heraus, der Ballon verliert Volumen und der Katheter kann herausrutschen. Außerdem schwimmt der Ballon auf." }
      ]},
      { t: "Fixierung und Beutel", q: "Wie versorgst du Katheter und Beutel?", opts: [
        { t: "Katheter zugfrei am Oberschenkel fixieren, Beutel unter Blasenniveau ohne Bodenkontakt, Schlauch ohne Knick; Kreislauf und Befinden beim Ablaufen beobachten", ok: true, fb: "Richtig. Achte bei großen Mengen auf den Hausstandard zur Blasenentleerung und auf den Kreislauf." },
        { t: "Beutel aufs Bett legen, damit er nicht vergessen wird", fb: "Über Blasenniveau fließt Urin zurück in die Blase: Infektionsgefahr." },
        { t: "Beutel auf den Boden stellen, da hängt er sicher", fb: "Bodenkontakt kontaminiert das Ablasssystem. Der Beutel hängt frei am Bettgestell." }
      ]},
      { t: "Nachsorge", q: "Nach der Anlage:", opts: [
        { t: "Material entsorgen, Handschuhe aus, Händedesinfektion, Frau Wiese bequem lagern, Klingel geben, Urinmenge und Aussehen beurteilen", ok: true, fb: "Richtig. Und: Allergie-Eintrag in der Akte korrigieren lassen." },
        { t: "Erst die nächste Patientin versorgen und später aufräumen", fb: "Kontaminiertes Material am Bett und eine offene Lagerung gefährden Hygiene und Würde." },
        { t: "Die volle Urinmenge sofort für eine Probe aus dem Beutel abfüllen", fb: "Proben werden nur auf Anordnung und an der Probenentnahmestelle entnommen, nie aus dem Beutel." }
      ]},
      { t: "Dokumentation", q: "Was dokumentierst du?", opts: [
        { t: "Datum/Uhrzeit, Indikation/Anordnung, Kathetertyp und Material, Charrière, Chargennummer, Blockvolumen und Medium, Urinmenge und Aussehen, Besonderheiten (Fehllage, neuer Katheter), Durchführende; Latexallergie in der Akte", ok: true, fb: "Richtig. Die Fehllage gehört ehrlich in die Dokumentation. Und die Indikation wird ab jetzt täglich geprüft (KRINKO)." },
        { t: "„DK gelegt, o. B.“", fb: "Nicht rechtssicher: Material, Größe, Charge, Blockung, Urinmenge und die Fehllage fehlen." },
        { t: "Die Fehllage weglassen, weil am Ende ja alles gut ging", ko: true, fb: "Kritisch: Das verfälscht die Dokumentation. Die Fehllage erhöht das Infektionsrisiko und ist für die weitere Beobachtung relevant." }
      ]}
    ]
  },

  /* ---------- Phase 3.4 Störfall ---------- */
  st: {
    situation: "10:05 Uhr. Du bereitest die Visite vor. Gleichzeitig: Die Notrufklingel aus Zimmer 416 schrillt. Herr Brandt (88 Jahre, Patient deiner Kollegin, die gerade in der Pause ist) liegt neben seinem Bett auf dem Boden. Er ist ansprechbar, blutet aus einer Platzwunde an der Stirn und klagt über Schmerzen in der linken Hüfte, das Bein liegt außenrotiert. In seiner Kurve: Apixaban 2,5 mg 1-0-1. Dein Telefon klingelt: Dr. Özdemir (gerade in der Notaufnahme): „Der Kowalski ist ja immer noch bei 120. Geben Sie ihm jetzt 5 mg Bisoprolol zusätzlich, ich schreib's nachher in die Kurve.“ Herr Kowalskis letzter Blutdruck um 09:45 Uhr: 102/60 mmHg. Und um 10:00 Uhr steht die Physiotherapeutin bei Frau Sommer.",
    order: [
      { id: "d1", t: "Zu Herrn Brandt: Situation erfassen, ansprechen, Ersteinschätzung (ABCDE), über den Notruf Hilfe ins Zimmer holen", warum: "Akute Gefährdung vor allem anderen. Nie allein einen gestürzten Menschen hochheben." },
      { id: "d2", t: "Arzt sofort informieren: Sturz mit Kopfplatzwunde unter Apixaban, Verdacht auf hüftnahe Fraktur", warum: "Kopfverletzung unter Antikoagulation: Risiko für eine intrakranielle Blutung. Ärztliche Beurteilung und meist Bildgebung nötig." },
      { id: "d3", t: "Vitalzeichen, Bewusstsein und Pupillen, BZ; Wunde steril abdecken und komprimieren; Bein nicht bewegen, Transfer nur im Team mit Hilfsmittel", warum: "Überwachen bis der Arzt da ist. Bei Verdacht auf Schenkelhalsfraktur nicht mobilisieren." },
      { id: "d4", t: "Telefonische Anordnung für Herrn Kowalski: Rückfrage wegen RR 102/60, Anordnung wiederholen (Read-back), Praxisanleitung hinzuziehen", warum: "Wichtig, aber nicht vor einer akuten Notfallversorgung. Der Arzt kommt ohnehin wegen Herrn Brandt auf Station." },
      { id: "d5", t: "Physiotherapie und Praxisanleitung informieren: Die Mobilisation von Frau Sommer verschiebt sich", warum: "Organisation und Delegation: Niemand wartet unwissend. Frau Sommers Analgetikum wirkt etwa 2–4 Stunden, ein neuer Termin ist möglich." },
      { id: "d6", t: "Sturzprotokoll und Pflegebericht für Herrn Brandt, Sturzrisiko neu einschätzen, Übergabe an die zuständige Kollegin", warum: "Lückenlose, zeitnahe Dokumentation nach der Akutversorgung, nicht davor." }
    ],
    mc: {
      text: "Zur telefonischen Anordnung für Herrn Kowalski: Was ist richtig? (Mehrfachauswahl)",
      opts: [
        { t: "Ich nenne dem Arzt den aktuellen RR von 102/60 mmHg und frage, ob die Anordnung trotzdem gilt", ok: true, fb: "Remonstration: Du hast Bedenken, also teilst du sie mit. Ein zusätzlicher Betablocker kann den Blutdruck weiter senken." },
        { t: "Ich wiederhole die Anordnung vollständig (Read-back): Patient, Medikament, Dosis, Applikationsweg, Zeitpunkt", ok: true, fb: "Read-back verhindert Hörfehler, etwa 5 mg statt 2,5 mg." },
        { t: "Ich dokumentiere Uhrzeit, Arztname und Wortlaut und sorge für eine zeitnahe ärztliche Gegenzeichnung", ok: true, fb: "Telefonische Anordnungen sind die Ausnahme und müssen nachvollziehbar sein." },
        { t: "Als Auszubildende ziehe ich die Praxisanleitung oder eine Pflegefachperson hinzu", ok: true, fb: "Du handelst unter Anleitung. Bei Medikamentenanordnungen ist das Vier-Augen-Prinzip Standard." },
        { t: "Ich gebe das Medikament sofort, der Arzt schreibt es ja nachher rein", ok: false, fb: "Ohne Rückfrage trotz niedrigem RR, ohne Read-back und ohne Dokumentation: Das ist ein Haftungsrisiko für dich und eine Gefahr für den Patienten." },
        { t: "Ich lehne jede telefonische Anordnung grundsätzlich ab", ok: false, fb: "In begründeten Ausnahmen sind telefonische Anordnungen zulässig, wenn sie gesichert werden (Read-back, Dokumentation, Gegenzeichnung)." }
      ]
    }
  },

  /* ---------- Phase 3.5 Dokumentation ---------- */
  doku: {
    auftrag: "Schreibe den Pflegebericht zu Herrn Kowalski für das Ereignis ab 06:12 Uhr (Telemetrie-Alarm). Ergebnis der ärztlichen Beurteilung: Dr. Özdemir war um 06:35 Uhr am Bett, das 12-Kanal-EKG um 06:45 Uhr bestätigte ein Vorhofflimmern. Bettruhe, Vitalzeichen stündlich, Bisoprolol 2,5 mg wie gewohnt um 08 Uhr.",
    muster: "06:12 Telemetrie-Alarm „Arrhythmie“. 06:16 am Pat.: wach, zeitlich und örtlich orientiert, blass, Haut kühl/trocken. Pat. äußert: „Mir ist so schwummrig, und das Flattern ist wieder da.“ Kein Thoraxschmerz, keine Atemnot angegeben. Monitor-HF 132/min unregelmäßig, Radialispuls 104/min über 60 s unregelmäßig (Pulsdefizit 28), RR 108/64 mmHg, SpO₂ 93 % bei Raumluft, AF 22/min. Monitorstreifen gesichert. Pat. im Bett belassen, Klingel in Reichweite, über Bettruhe informiert. 06:20 Dr. Özdemir telefonisch nach SBAR informiert, 06:35 Arzt am Bett. 06:45 12-Kanal-EKG geschrieben (Befund lt. Arzt: Vorhofflimmern). AO: Bettruhe, Vitalzeichen stündlich, Bisoprolol wie gewohnt 08 Uhr. 07:10 RR 110/66 mmHg, HF 118/min, Schwindel lt. Pat. „etwas besser“. Neurologische Kontrolle (BE-FAST) o. B. Hörgerät-Batterie gewechselt. [Name, Handzeichen]",
    chk: [
      { t: "Uhrzeiten konkret für Ereignis, Information des Arztes und Maßnahmen", kw: ["06:", "06.", "uhr"] },
      { t: "Messwerte objektiv mit Einheit (HF Monitor, Radialispuls, RR, SpO₂)", kw: ["mmhg", "/min", "spo", "%"] },
      { t: "Pulsdefizit benannt", kw: ["pulsdefizit", "defizit", "28"] },
      { t: "Patientenaussage wörtlich in Anführungszeichen", kw: ["„", "\"", "äußert", "sagt"] },
      { t: "Arzt mit Name und Uhrzeit, Anordnung festgehalten", kw: ["özdemir", "dr.", "arzt", "ao", "anordnung"] },
      { t: "Durchgeführte Maßnahmen und deren Wirkung (Evaluation)", kw: ["bettruhe", "klingel", "kontroll", "besser", "evaluation", "ekg"] },
      { t: "Keine Wertungen und Vermutungen; Name/Handzeichen", kw: ["handzeichen", "hz", "name"] }
    ],
    fehler: {
      text: "Fehlersuche: Ein Kollege hat diesen Bericht geschrieben. Markiere alle Einträge, die NICHT rechtssicher sind.",
      items: [
        { t: "06:20 Telemetrie-Alarm „Arrhythmie“. Pat. im Bett, wach, orientiert. Monitor-HF 132/min, Puls peripher 104/min unregelmäßig, RR 108/64 mmHg, SpO₂ 93 % bei Raumluft.", bad: false, fb: "In Ordnung: objektiv, mit Uhrzeit und Einheiten." },
        { t: "Pat. war wie immer schwierig und hat an den Elektroden rumgespielt.", bad: true, fb: "Wertend („schwierig“, „wie immer“) und nicht beobachtungsbasiert. Beschreibe stattdessen, was du siehst: „zieht wiederholt an den Elektroden“." },
        { t: "Pat. äußert: „Mir ist etwas schwindelig, Brustschmerzen habe ich keine.“", bad: false, fb: "In Ordnung: wörtliches Zitat." },
        { t: "Arzt informiert.", bad: true, fb: "Unvollständig: Wer? Wann? Wie? Mit welchem Ergebnis? Ohne diese Angaben ist im Haftungsfall nichts belegt." },
        { t: "Werte so weit ok, Pat. stabil.", bad: true, fb: "Unbestimmt und interpretierend. Was heißt „ok“? Konkrete Werte nennen." },
        { t: "06:35 Dr. Özdemir am Bett; 06:45 12-Kanal-EKG geschrieben. AO: Bettruhe, VZ stündlich. Pat. informiert, Klingel in Reichweite.", bad: false, fb: "In Ordnung: Name, Zeit, Anordnung, Maßnahme." },
        { t: "Nachtrag 07:10 Uhr zu 06:25 Uhr: Hörgerät-Batterie gewechselt, Pat. versteht wieder gut. J. K.", bad: false, fb: "In Ordnung: Ein Nachtrag ist erlaubt, wenn er als Nachtrag mit beiden Zeiten und Handzeichen gekennzeichnet ist." },
        { t: "Pat. hat in der Nacht wahrscheinlich zu wenig getrunken.", bad: true, fb: "Vermutung statt Fakt. Richtig ist die Bilanz in Millilitern: „Trinkmenge 22–06 Uhr: 200 ml“." }
      ]
    }
  },

  /* ---------- Phase 4 ---------- */
  ueb: {
    auftrag: "13:30 Uhr. Übergib deine drei Patientinnen und Patienten an den Spätdienst (Pflegefachkraft Tobias Rehm). Kurz, strukturiert, mit offenen Aufgaben.",
    muster: "Herr Kowalski, 412: Seit heute 06 Uhr neu aufgetretenes Vorhofflimmern, im 12-Kanal-EKG bestätigt. HF zuletzt 112/min, RR 108/66 mmHg, kein Schwindel mehr, BE-FAST unauffällig. Bettruhe bis Neubeurteilung, Vitalzeichen stündlich. Der Arzt entscheidet heute noch über die Antikoagulation, bitte nachhalten. Bilanz bisher +450 ml, Hörgerät funktioniert. Antibiose um 16 Uhr.\n\nFrau Sommer, 414: Sturzangst nach sieben Stunden Liegezeit ist als Hauptursache für die Immobilität erkannt. Bewegungsschmerz NRS 6, nach Metamizol NRS 3. Die Mobilisation mit der Physio wurde wegen eines Notfalls auf 13 Uhr verlegt und hat geklappt: 8 m mit Rollator. Eigenes Ziel: wieder allein zum Bäcker. Die Tochter bringt morgen die Fernbrille. Keine Bettgitter, Frau Sommer ist entscheidungsfähig. Für die Nacht: Niedrigbett, Nachtlicht, Toilettenstuhl. Bei der Visite angesprochen: Diuretikum morgens, Hausarzt informieren.\n\nFrau Wiese, 415: 06:50 Uhr Vollsilikon-DK Ch 12 gelegt, erster Versuch Fehllage in der Vagina, mit neuem Katheter korrekt. 640 ml klarer Urin. LATEXALLERGIE, Akte ist korrigiert. Amitriptylin ist auf ärztliche Anordnung abgesetzt, die Indikation für den DK bitte täglich prüfen, Auslassversuch nach Arzt. Temperatur beobachten (HWI-Anamnese). BZ mittags 196 mg/dl, Insulin nach Schema gegeben.\n\nHerr Brandt, 416 (Kollegin): Sturz 10:05 Uhr unter Apixaban, CT Schädel ohne Blutung, Hüfte: Schenkelhalsfraktur links, OP morgen geplant, nüchtern ab 24 Uhr.",
    chk: [
      { t: "Alle Patienten mit Zimmer, Kernproblem und aktuellem Zustand", kw: ["412", "414", "415", "kowalski", "sommer", "wiese"] },
      { t: "Offene Aufgaben mit Uhrzeit (z. B. Antibiose 16 Uhr, Antikoagulation klären)", kw: ["16", "offen", "bitte", "klären", "nachhalten"] },
      { t: "Sicherheitsrelevantes: Latexallergie, Vorhofflimmern, Sturzrisiko", kw: ["latex", "vorhofflimmern", "sturz"] }
    ]
  },

  refl: [
    {
      q: "Warum hast du bei Herrn Kowalski den Puls zusätzlich 60 Sekunden lang manuell getastet, obwohl der Monitor eine Frequenz anzeigte?",
      muster: "Beim Vorhofflimmern werfen nicht alle Kammerkontraktionen genug Blut aus, weil die Füllungszeit unterschiedlich lang ist. Der Monitor zählt die elektrischen Aktionen, der Radialispuls zeigt die wirksamen. Die Differenz, das Pulsdefizit (hier 28/min), sagt etwas über die hämodynamische Wirksamkeit. 60 Sekunden, weil der Rhythmus unregelmäßig ist; mit 15 Sekunden mal vier rechnet man sich hier fehlerhaft. Und: Nur am Patienten kann ich Alarm und Artefakt sicher unterscheiden."
    },
    {
      q: "Wo sahst du bei Frau Wiese rückblickend das größte Hygiene- und Sicherheitsrisiko, und wie hast du es kontrolliert?",
      muster: "Zwei Risiken: Erstens die Latexallergie, die nur durch das Gespräch am Vortag und die erneute Allergiefrage auffiel. Die Akte war falsch. Ich habe nur latexfreies Material verwendet und die Akte korrigieren lassen. Zweitens die Fehllage in der Vagina: Der Katheter war kontaminiert, ich habe ihn als Orientierung liegen lassen und einen neuen sterilen genommen. Allgemein: Die nicht dominante Hand bleibt an den Labien, Tupfer nur einmal von vorn nach hinten, Einwirkzeit, geschlossenes System, Beutel unter Blasenniveau. Ich würde nächstes Mal schon in der Planung an Tag 1 den Katheter als mögliche Maßnahme vorbereiten."
    },
    {
      q: "Die Tochter von Frau Sommer forderte Bettgitter. Wie hast du Selbstbestimmung und Sicherheit abgewogen, und was würdest du heute anders machen?",
      muster: "Frau Sommer ist entscheidungsfähig, also entscheidet nur sie über freiheitsentziehende Maßnahmen. Die Vorsorgevollmacht der Tochter greift erst bei Einwilligungsunfähigkeit, und selbst dann bräuchte sie für regelmäßige Bettgitter eine Genehmigung des Betreuungsgerichts (§ 1831 BGB). Fachlich verringern Bettgitter Stürze nicht, sie erhöhen die Fallhöhe. Ich habe die Sorge der Tochter ernst genommen und Alternativen angeboten: Niedrigbett, Nachtlicht, Toilettenstuhl, Brille, Diuretikum morgens. Anders machen würde ich: Das Gespräch zu dritt hätte ich schon für 11:30 Uhr mit Arzt oder Stationsleitung vorbereitet, statt überrascht zu werden."
    }
  ],

  /* ---------- Auswertung ---------- */
  noten: [
    [92, 1, "sehr gut"], [81, 2, "gut"], [67, 3, "befriedigend"], [50, 4, "ausreichend"], [30, 5, "mangelhaft"], [0, 6, "ungenügend"]
  ],
  kb: [
    ["I", "Pflegeprozess verantwortlich planen, organisieren, gestalten, durchführen, steuern und bewerten", ["akten", "plan", "prio", "a", "c"]],
    ["II", "Kommunikation und Beratung personen- und situationsorientiert gestalten", ["b", "ueb"]],
    ["III", "Intra- und interprofessionelles Handeln verantwortlich gestalten", ["sbar", "st"]],
    ["IV", "Das eigene Handeln auf Grundlage von Gesetzen, Verordnungen und ethischen Leitlinien reflektieren und begründen", ["doku"]],
    ["V", "Das eigene Handeln auf Grundlage wissenschaftlicher Erkenntnisse und berufsethischer Werthaltungen reflektieren und begründen", ["refl"]]
  ]
};
