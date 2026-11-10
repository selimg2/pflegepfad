/* Fallpfad Training „Akutsimulationen“: Notfälle auf Station unter Zeitdruck mit Live-Monitor.
   Jede Entscheidung verändert Vitalwerte und Zeit. Am Ende: Auswertung nach ABCDE und eine Musterlösung.
   Inhalte sind Übungsfälle; maßgeblich sind Hausstandards und ärztliche Anordnungen. */
(function () {
  "use strict";
  var R = window.React;
  if (!R) return;
  var h = R.createElement, useState = R.useState, useEffect = R.useEffect;

  // ok: 2 = beste Wahl, 1 = vertretbar, 0 = falsch/gefährlich. d = Änderung der Vitalwerte, min = verstrichene Minuten
  var F = [
    {
      id: "hypo", titel: "Zittrig vor dem Mittagessen", bereich: "Diabetes", ort: "Innere, Zimmer 4, 11:40 Uhr", farbe: "#7c3aed",
      intro: "Herr Krüger (74), Typ-2-Diabetes, hat um 7:30 Uhr Mischinsulin bekommen und das Frühstück kaum gegessen. Jetzt klingelt er: Er schwitzt, zittert und wirkt verlangsamt.",
      v: { hf: 108, sys: 146, dia: 84, af: 18, spo2: 97, t: 36.6, bz: 48, gcs: 14 },
      schritte: [
        { frage: "Was tust du zuerst?", opts: [
          { t: "Blutzucker messen und Bewusstsein einschätzen", ok: 2, fb: "Richtig: Bei Zittern, Schwitzen und Verlangsamung unter Insulin ist die Blutzuckermessung der wichtigste erste Schritt.", d: {}, min: 2 },
          { t: "Ärztin anrufen und auf Rückruf warten", ok: 0, fb: "Die Meldung ist wichtig, aber erst messen und handeln: Eine Hypoglykämie kann in Minuten zur Bewusstlosigkeit führen.", d: { bz: -8, gcs: -2 }, min: 6 },
          { t: "Ihn beruhigen und das Mittagessen abwarten", ok: 0, fb: "Gefährlich: Das Essen kommt in 20 Minuten, der Zucker fällt weiter.", d: { bz: -12, gcs: -3 }, min: 10 } ] },
        { frage: "Der Wert ist 48 mg/dl. Herr Krüger ist wach und kann schlucken. Was gibst du?", opts: [
          { t: "Schnell wirksame Kohlenhydrate, z. B. 4 Traubenzucker-Plättchen oder 200 ml Saft", ok: 2, fb: "Genau: Bei wacher Person mit Schluckfähigkeit schnell wirksame Kohlenhydrate (etwa 15–20 g) oral.", d: { bz: 40, hf: -10, gcs: 1 }, min: 3 },
          { t: "Ein Stück Schokolade", ok: 1, fb: "Schokolade wirkt durch das Fett langsamer. Besser Traubenzucker oder Saft.", d: { bz: 18, hf: -4 }, min: 5 },
          { t: "Nichts oral, Glukose i. v. vorbereiten und auf die Ärztin warten", ok: 0, fb: "Solange er wach ist und schlucken kann, geht oral am schnellsten. i. v.-Glukose ist für Bewusstseinsgestörte.", d: { bz: -6, gcs: -1 }, min: 8 } ] },
        { frage: "15 Minuten später misst du 92 mg/dl, er fühlt sich besser. Was folgt?", opts: [
          { t: "Langsam wirksame Kohlenhydrate (Brot, Mittagessen), ärztlich informieren, Ursache und Werte dokumentieren", ok: 2, fb: "So verhinderst du einen erneuten Abfall und sorgst dafür, dass das Insulinschema überprüft wird.", d: { bz: 20, hf: -6 }, min: 4 },
          { t: "Erledigt, keine weitere Maßnahme", ok: 0, fb: "Mischinsulin wirkt weiter: Ohne Mahlzeit fällt der Zucker erneut. Und das Schema muss angepasst werden.", d: { bz: -25, hf: 8 }, min: 30 },
          { t: "Nachmittags-Insulin vorsorglich weglassen", ok: 0, fb: "Insulindosen ändert nicht die Pflege allein. Information an die Ärztin, dann Anordnung.", d: {}, min: 2 } ] }
      ],
      fazit: "Hypoglykämie: messen, bei wacher Person 15–20 g schnell wirksame Kohlenhydrate, nach 15 Minuten nachmessen, dann langsam wirksame Kohlenhydrate, ärztlich informieren, dokumentieren. Bei Bewusstlosigkeit nichts oral: Seitenlage, Notruf, Glukose i. v. oder Glukagon nach Anordnung."
    },
    {
      id: "anaph", titel: "Ausschlag unter der Antibiose", bereich: "Allergie", ort: "Chirurgie, Zimmer 12, 9:05 Uhr", farbe: "#dc2626",
      intro: "Frau Neumann (63) bekommt seit fünf Minuten die erste Dosis Cefuroxim i. v. Sie kratzt sich am Hals, sagt „mir ist so komisch“ und hat Quaddeln im Gesicht. Ihre Stimme klingt heiser.",
      v: { hf: 124, sys: 92, dia: 54, af: 26, spo2: 92, t: 36.9, bz: 112, gcs: 15 },
      schritte: [
        { frage: "Was ist dein erster Handgriff?", opts: [
          { t: "Infusion sofort stoppen, Zugang belassen, Hilfe/Notfallteam rufen", ok: 2, fb: "Richtig: Allergen stoppen, Zugang offen halten, sofort Hilfe holen.", d: { af: -1 }, min: 1 },
          { t: "Infusion langsamer stellen und beobachten", ok: 0, fb: "Gefährlich: Jede weitere Menge verstärkt die Reaktion.", d: { sys: -18, spo2: -4, af: 4 }, min: 4 },
          { t: "Kühlende Creme gegen den Juckreiz holen", ok: 0, fb: "Haut ist hier das kleinste Problem. Heiserkeit und Blutdruckabfall zeigen eine Anaphylaxie.", d: { sys: -20, spo2: -5 }, min: 5 } ] },
        { frage: "Sie wird kurzatmig, RR 84/48. Wie lagerst du sie?", opts: [
          { t: "Bei Atemnot halb sitzend; bei Kreislaufversagen flach mit Beinen hoch", ok: 2, fb: "Die Lagerung richtet sich nach dem führenden Problem: Atemnot oder Schock.", d: { sys: 4 }, min: 1 },
          { t: "Schnell aufsetzen und an die Bettkante stellen", ok: 0, fb: "Aufstehen bei Schock kann zum Kreislaufkollaps führen.", d: { sys: -14, gcs: -2 }, min: 2 },
          { t: "Kopf tief, Beine hoch, auch bei starker Atemnot", ok: 1, fb: "Bei starker Atemnot ist die Kopftieflage ungünstig. Abwägen nach Leitsymptom.", d: { spo2: -2 }, min: 1 } ] },
        { frage: "Die Ärztin ist da. Welches Medikament ist das wichtigste?", opts: [
          { t: "Adrenalin 0,5 mg i. m. in den Oberschenkel", ok: 2, fb: "Adrenalin i. m. ist das Mittel der ersten Wahl bei Anaphylaxie, Wiederholung nach 5 Minuten möglich.", d: { sys: 30, hf: -10, spo2: 4, af: -6 }, min: 2 },
          { t: "Antihistaminikum i. v. als Erstes", ok: 1, fb: "Antihistaminika und Kortison folgen, ersetzen aber Adrenalin nicht.", d: { sys: 4 }, min: 4 },
          { t: "Kortison in Tablettenform", ok: 0, fb: "Viel zu langsam für eine lebensbedrohliche Reaktion.", d: { sys: -10, spo2: -3 }, min: 6 } ] },
        { frage: "Nach Adrenalin und Volumen stabilisiert sie sich. Was gehört dazu?", opts: [
          { t: "Engmaschige Überwachung, Allergie in Akte und Kurve eintragen, Allergiepass, Patientin informieren", ok: 2, fb: "Spätreaktionen sind möglich, und die Allergie muss überall sichtbar sein.", d: { hf: -8 }, min: 5 },
          { t: "Weitergabe nur mündlich in der Übergabe", ok: 0, fb: "Mündlich geht verloren: Die Allergie gehört in die Dokumentation.", d: {}, min: 1 } ] }
      ],
      fazit: "Anaphylaxie: Allergen stoppen, Hilfe rufen, ABCDE, Lagerung nach Leitsymptom, Adrenalin 0,5 mg i. m. nach ärztlicher Anordnung bzw. Notfallstandard, Sauerstoff, Volumen, dann Antihistaminikum und Kortison. Mindestens mehrere Stunden überwachen, Allergie dokumentieren."
    },
    {
      id: "sturz", titel: "Sturz in der Nacht", bereich: "Neurologie", ort: "Geriatrie, Zimmer 7, 3:20 Uhr", farbe: "#ea580c",
      intro: "Frau Becker (82) liegt neben dem Bett auf dem Boden. Sie nimmt Apixaban gegen Vorhofflimmern. Sie sagt, sie sei „nur ausgerutscht“, hat eine Beule an der Stirn und will sofort wieder ins Bett.",
      v: { hf: 92, sys: 158, dia: 88, af: 18, spo2: 95, t: 36.4, bz: 128, gcs: 15 },
      schritte: [
        { frage: "Was tust du, bevor du ihr aufhilfst?", opts: [
          { t: "Ansprechen, auf Schmerzen, Fehlstellungen, Blutungen und Bewusstsein prüfen, Vitalzeichen messen", ok: 2, fb: "Erst einschätzen, dann bewegen: Eine Hüftfraktur oder Kopfverletzung darf nicht übersehen werden.", d: {}, min: 3 },
          { t: "Sofort mit einer Kollegin ins Bett heben", ok: 0, fb: "Ohne Einschätzung riskierst du, eine Fraktur zu verschlimmern.", d: { hf: 10 }, min: 2 } ] },
        { frage: "Keine Fehlstellung, sie bewegt alle Gliedmaßen. Was ist wegen Apixaban besonders wichtig?", opts: [
          { t: "Ärztlich melden: Kopfanprall unter Antikoagulation, meist CT nötig", ok: 2, fb: "Unter Gerinnungshemmern können Hirnblutungen verzögert auftreten.", d: {}, min: 3 },
          { t: "Nichts Besonderes, sie ist ja wach", ok: 0, fb: "Ein symptomfreies Intervall ist bei Hirnblutungen typisch.", d: {}, min: 1 } ] },
        { frage: "Zwei Stunden später ist sie schwer weckbar, die rechte Pupille ist weiter, RR 182/90, Puls 58. Was bedeutet das?", vChange: { gcs: -5, sys: 24, hf: -34 }, opts: [
          { t: "Zeichen steigenden Hirndrucks: sofort Notfall-Alarm", ok: 2, fb: "Bewusstseinsverschlechterung, Anisokorie, Blutdruckanstieg und Bradykardie (Cushing-Reflex) sind Alarmzeichen.", d: {}, min: 1 },
          { t: "Sie schläft nach der Aufregung tief, morgen früh nachsehen", ok: 0, fb: "Fehleinschätzung mit Lebensgefahr.", d: { gcs: -3 }, min: 30 } ] },
        { frage: "Bis das Team da ist:", opts: [
          { t: "Oberkörper 30 Grad, Kopf gerade, Atemwege sichern, Vitalzeichen und Pupillen engmaschig, Notfallwagen", ok: 2, fb: "Hochlagerung verbessert den venösen Abfluss, freie Atemwege sind entscheidend.", d: { spo2: 1 }, min: 3 },
          { t: "Flach lagern mit Beinen hoch", ok: 0, fb: "Kopftieflage erhöht den Hirndruck.", d: { gcs: -1 }, min: 2 } ] }
      ],
      fazit: "Nach jedem Sturz: erst einschätzen (Bewusstsein, Schmerz, Fehlstellung, Blutung, Vitalzeichen), dann helfen. Unter Antikoagulation bei Kopfanprall ärztliche Abklärung und neurologische Überwachung (GCS, Pupillen) über Stunden. Sturzereignis dokumentieren und Sturzrisiko neu einschätzen."
    },
    {
      id: "nachblutung", titel: "Der Verband färbt sich rot", bereich: "Chirurgie", ort: "Unfallchirurgie, 2 Stunden nach Hüft-TEP", farbe: "#b91c1c",
      intro: "Herr Wagner (71) ist vor zwei Stunden aus dem Aufwachraum gekommen. Beim Kontrollgang ist der Verband durchgeblutet, in der Redon-Flasche sind 350 ml. Er ist blass und unruhig.",
      v: { hf: 116, sys: 98, dia: 60, af: 22, spo2: 95, t: 36.1, bz: 140, gcs: 15 },
      schritte: [
        { frage: "Wie schätzt du die Lage ein?", opts: [
          { t: "Verdacht auf Nachblutung mit beginnendem Schock (Schockindex über 1)", ok: 2, fb: "Puls 116 durch RR 98 ergibt etwa 1,2. Zusammen mit Blässe und Unruhe ein Schockzeichen.", d: {}, min: 1 },
          { t: "Normale Wundsekretion nach Hüft-OP", ok: 0, fb: "350 ml in zwei Stunden mit Kreislaufreaktion ist nicht normal.", d: { hf: 10, sys: -10 }, min: 10 } ] },
        { frage: "Was tust du jetzt?", opts: [
          { t: "Ärztin sofort informieren (SBAR), Verband nicht entfernen, zusätzlich komprimierend abdecken, Vitalzeichen alle 5 Minuten", ok: 2, fb: "Schnell melden, Blutung begrenzen, Verlauf dokumentieren.", d: { hf: 2 }, min: 3 },
          { t: "Verband abnehmen und die Wunde genau anschauen", ok: 0, fb: "Unnötiges Öffnen fördert Blutung und Infektion. Zusätzlich verbinden, ärztlich beurteilen lassen.", d: { sys: -8, hf: 6 }, min: 5 },
          { t: "Redon-Flasche wechseln und Menge notieren", ok: 1, fb: "Dokumentieren ist wichtig, ersetzt aber nicht die sofortige Meldung.", d: { sys: -6, hf: 6 }, min: 4 } ] },
        { frage: "Die Ärztin ordnet Volumen und Blutabnahme an. Was bereitest du vor?", opts: [
          { t: "Zweiten großlumigen Zugang, Infusion, Blut für Blutbild, Gerinnung und Kreuzprobe, nüchtern lassen", ok: 2, fb: "So ist eine Transfusion oder Re-OP schnell möglich.", d: { sys: 14, hf: -12 }, min: 8 },
          { t: "Schmerzmittel geben und Ruhe verordnen", ok: 0, fb: "Analgesie ist wichtig, löst aber das Blutungsproblem nicht.", d: { sys: -8 }, min: 5 } ] },
        { frage: "Er bekommt zwei Erythrozytenkonzentrate. Was gilt dabei für dich?", opts: [
          { t: "Bedside-Test durch die Ärztin, Identität prüfen, in den ersten Minuten bei ihm bleiben, auf Transfusionsreaktion achten", ok: 2, fb: "Die ersten 15 Minuten sind für schwere Reaktionen am kritischsten.", d: { hf: -8, sys: 8 }, min: 10 },
          { t: "Anhängen und zur nächsten Patientin gehen", ok: 0, fb: "Eine Transfusionsreaktion würde unbemerkt bleiben.", d: {}, min: 2 } ] }
      ],
      fazit: "Nachblutung: Verband und Drainage gehören zum Kontrollgang. Schockzeichen (Puls ↑, RR ↓, Blässe, Unruhe) erkennen, sofort melden, Blutung komprimieren, Vitalzeichen engmaschig, Zugänge und Labor vorbereiten, nüchtern lassen. Bei Transfusion Identitätssicherung und Überwachung."
    },
    {
      id: "atemnot", titel: "Nachts keine Luft", bereich: "Herz", ort: "Kardiologie, Zimmer 3, 2:10 Uhr", farbe: "#0284c7",
      intro: "Herr Schulte (78), Herzinsuffizienz, sitzt aufrecht auf der Bettkante, ringt nach Luft und hustet schaumiges Sekret. Über der Lunge brodelt es hörbar.",
      v: { hf: 118, sys: 172, dia: 98, af: 32, spo2: 84, t: 36.8, bz: 134, gcs: 15 },
      schritte: [
        { frage: "Wie positionierst du ihn?", opts: [
          { t: "Herzbettlage: Oberkörper hoch, Beine tief", ok: 2, fb: "Das senkt den venösen Rückstrom (Vorlast) und erleichtert die Atmung.", d: { af: -3, spo2: 2 }, min: 1 },
          { t: "Flach hinlegen, damit er sich ausruht", ok: 0, fb: "Im Liegen strömt mehr Blut zum Herzen: Das Lungenödem nimmt zu.", d: { spo2: -5, af: 4 }, min: 2 },
          { t: "Beine hoch gegen die Ödeme", ok: 0, fb: "Verstärkt die Belastung des Herzens.", d: { spo2: -4 }, min: 2 } ] },
        { frage: "Welche Sofortmaßnahmen folgen?", opts: [
          { t: "Notfall melden, Sauerstoff nach Standard, Monitor, Zugang vorbereiten, beruhigend bei ihm bleiben", ok: 2, fb: "Akutes Lungenödem ist ein Notfall.", d: { spo2: 5, af: -2 }, min: 3 },
          { t: "Ihm viel zu trinken geben, damit sich der Schleim löst", ok: 0, fb: "Mehr Flüssigkeit verschlimmert die Stauung.", d: { spo2: -3 }, min: 3 } ] },
        { frage: "Die Ärztin gibt Furosemid i. v. und Nitro. Worauf achtest du?", opts: [
          { t: "Blutdruck (Nitro senkt ihn), Urinausscheidung, Bilanz, Atmung und Sättigung", ok: 2, fb: "So erkennst du Wirkung und Nebenwirkungen.", d: { sys: -30, af: -8, spo2: 6, hf: -12 }, min: 20 },
          { t: "Nur die Temperatur", ok: 0, fb: "Die entscheidenden Werte sind Kreislauf, Atmung und Ausscheidung.", d: {}, min: 5 } ] }
      ],
      fazit: "Akutes Lungenödem: Herzbettlage, Notfall melden, Sauerstoff, Monitor, Zugang, beruhigen. Nach Diuretikum und Nitro Blutdruck, Atmung, Sättigung und Urinmenge eng überwachen, Bilanz führen, am Folgetag wiegen."
    },
    {
      id: "krampf", titel: "Plötzlich krampft er", bereich: "Neurologie", ort: "Neurologie, Flur, 15:30 Uhr", farbe: "#16a34a",
      intro: "Herr Engel (45) bricht im Flur zusammen, streckt sich steif und beginnt rhythmisch zu zucken. Er ist nicht ansprechbar.",
      v: { hf: 132, sys: 162, dia: 92, af: 8, spo2: 86, t: 37.2, bz: 104, gcs: 3 },
      schritte: [
        { frage: "Was tust du während des Anfalls?", opts: [
          { t: "Uhrzeit merken, Hilfe rufen, Umgebung sichern, Kopf polstern, nichts in den Mund stecken", ok: 2, fb: "Schützen, Zeit messen, Hilfe holen.", d: {}, min: 2 },
          { t: "Ihn festhalten, damit er sich nicht verletzt", ok: 0, fb: "Festhalten kann zu Knochenbrüchen und Verletzungen führen.", d: {}, min: 2 },
          { t: "Beißkeil zwischen die Zähne schieben", ok: 0, fb: "Verletzungsgefahr für Zähne, Mund und deine Finger.", d: {}, min: 2 } ] },
        { frage: "Der Anfall dauert inzwischen über 5 Minuten. Was bedeutet das?", opts: [
          { t: "Status epilepticus: Notfallteam, Benzodiazepin nach Anordnung/Standard, Sauerstoff", ok: 2, fb: "Ab 5 Minuten Anfallsdauer wird medikamentös durchbrochen.", d: { af: 6, spo2: 6, hf: -20, gcs: 4 }, min: 4 },
          { t: "Abwarten, Anfälle hören immer von selbst auf", ok: 0, fb: "Ein Status epilepticus kann lebensbedrohlich sein.", d: { spo2: -4 }, min: 5 } ] },
        { frage: "Der Anfall hört auf, er atmet, ist aber noch nicht wach. Was jetzt?", opts: [
          { t: "Stabile Seitenlage, Atemwege frei, Vitalzeichen, Blutzucker messen, bei ihm bleiben, Anfall beschreiben und dokumentieren", ok: 2, fb: "Die Nachschlafphase braucht Überwachung. Die Anfallsbeschreibung hilft der Diagnostik.", d: { spo2: 5, gcs: 4, hf: -14 }, min: 10 },
          { t: "Ihn sofort aufsetzen und Wasser trinken lassen", ok: 0, fb: "Aspirationsgefahr: Er ist noch bewusstseinsgetrübt.", d: { spo2: -5 }, min: 3 } ] }
      ],
      fazit: "Krampfanfall: Zeit merken, schützen, nicht festhalten, nichts in den Mund. Ab 5 Minuten Notfall mit Benzodiazepin. Danach Seitenlage, Atemwege, Vitalzeichen, Blutzucker, Verletzungen prüfen, Ablauf genau dokumentieren."
    },
    {
      id: "opioid", titel: "Kaum zu wecken", bereich: "Schmerz", ort: "Chirurgie, Zimmer 9, 6:00 Uhr", farbe: "#64748b",
      intro: "Frau Klein (79) hat nachts zweimal Bedarfsopioid und zusätzlich ein Schlafmittel bekommen. Beim Wecken reagiert sie kaum, ihre Atmung ist langsam und flach.",
      v: { hf: 58, sys: 104, dia: 62, af: 7, spo2: 85, t: 36.0, bz: 118, gcs: 9 },
      schritte: [
        { frage: "Welche Befunde erhebst du gezielt?", opts: [
          { t: "Atemfrequenz eine Minute zählen, Sättigung, Pupillen, Bewusstsein, Blutzucker", ok: 2, fb: "Enge Pupillen, AF 7 und Somnolenz sprechen für eine Opioidüberdosierung.", d: {}, min: 2 },
          { t: "Nur den Blutdruck", ok: 0, fb: "Die Atmung ist hier das Hauptproblem.", d: { spo2: -3 }, min: 2 } ] },
        { frage: "Was tust du sofort?", opts: [
          { t: "Laut ansprechen und stimulieren, zum Atmen auffordern, Sauerstoff, Notfall melden, Opioidpumpe/-pflaster stoppen bzw. entfernen", ok: 2, fb: "Stimulation und Sauerstoff überbrücken bis zur ärztlichen Maßnahme.", d: { af: 3, spo2: 6, gcs: 2 }, min: 2 },
          { t: "Sie schlafen lassen, sie hatte eine schwere Nacht", ok: 0, fb: "Atemdepression kann zum Atemstillstand führen.", d: { af: -2, spo2: -6, gcs: -2 }, min: 15 } ] },
        { frage: "Die Ärztin gibt Naloxon fraktioniert. Was beachtest du danach?", opts: [
          { t: "Weiter engmaschig überwachen, weil Naloxon kürzer wirkt als viele Opioide; Schmerz neu einschätzen", ok: 2, fb: "Rebound-Atemdepression ist möglich, und die Schmerztherapie muss angepasst werden.", d: { af: 6, spo2: 7, gcs: 4, hf: 20 }, min: 15 },
          { t: "Problem gelöst, keine weitere Überwachung", ok: 0, fb: "Die Opioidwirkung kann zurückkehren.", d: { af: -2 }, min: 30 } ] }
      ],
      fazit: "Opioid-Atemdepression: Bewusstsein, Atemfrequenz (eine Minute), Sättigung und Pupillen erfassen. Stimulieren, Sauerstoff, Opioidzufuhr stoppen, Notfall melden, Naloxon nach Anordnung, danach weiter überwachen. Kombination mit Schlafmitteln im Alter besonders kritisch."
    },
    {
      id: "transfusion", titel: "Schüttelfrost bei der Transfusion", bereich: "Transfusion", ort: "Onkologie, Zimmer 2, 10:20 Uhr", farbe: "#9333ea",
      intro: "Frau Weber (58) bekommt seit 10 Minuten ein Erythrozytenkonzentrat. Sie klagt über Rückenschmerzen, ihr ist kalt, sie zittert.",
      v: { hf: 122, sys: 96, dia: 58, af: 24, spo2: 94, t: 38.6, bz: 120, gcs: 15 },
      schritte: [
        { frage: "Was tust du zuerst?", opts: [
          { t: "Transfusion sofort stoppen, Zugang mit NaCl offen halten, Ärztin rufen", ok: 2, fb: "Bei jedem Verdacht auf Transfusionsreaktion: sofort stoppen.", d: { hf: -4 }, min: 1 },
          { t: "Langsamer laufen lassen und eine Decke bringen", ok: 0, fb: "Rückenschmerz, Fieber und Blutdruckabfall können eine hämolytische Reaktion sein. Lebensgefahr.", d: { sys: -16, hf: 12 }, min: 5 } ] },
        { frage: "Was passiert mit dem Blutbeutel?", opts: [
          { t: "Beutel mit System aufbewahren und nach Hausstandard mit Blutproben an die Blutbank schicken", ok: 2, fb: "Nur so kann die Ursache geklärt werden.", d: {}, min: 3 },
          { t: "Sofort entsorgen, damit niemand ihn versehentlich wieder anhängt", ok: 0, fb: "Damit ist die Abklärung unmöglich.", d: {}, min: 1 } ] },
        { frage: "Welche Beobachtung ist jetzt besonders wichtig?", opts: [
          { t: "Vitalzeichen engmaschig, Urinmenge und -farbe (Hämoglobinurie), Atmung, Bewusstsein", ok: 2, fb: "Roter oder brauner Urin und abnehmende Menge weisen auf Hämolyse und Nierenschaden hin.", d: { sys: 10, hf: -10 }, min: 15 },
          { t: "Nur die Temperatur", ok: 0, fb: "Zu wenig: Kreislauf und Niere sind gefährdet.", d: { sys: -6 }, min: 10 } ] }
      ],
      fazit: "Transfusionsreaktion: sofort stoppen, Zugang offen halten, ärztlich melden, Vitalzeichen, Urin beobachten, Beutel und Proben an die Blutbank, dokumentieren und Meldeweg (Hämovigilanz) einhalten."
    }
  ];
  window.FP_AKUTSIM = F;

  var NORM = { hf: [60, 100], sys: [100, 160], af: [12, 20], spo2: [94, 100], t: [36, 38], bz: [70, 180], gcs: [15, 15] };
  function kl(k, v) { var n = NORM[k]; if (!n) return ""; if (v < n[0] - (k === "gcs" ? 2 : 0) * 0 || v > n[1]) return (k === "spo2" && v < 90) || (k === "af" && (v < 9 || v > 28)) || (k === "sys" && v < 90) || (k === "gcs" && v < 13) || (k === "bz" && v < 60) || (k === "hf" && (v < 45 || v > 130)) ? "crit" : "warn"; return "ok"; }
  function wende(v, d) {
    var n = Object.assign({}, v);
    Object.keys(d || {}).forEach(function (k) { n[k] = Math.round(((n[k] || 0) + d[k]) * 10) / 10; });
    n.spo2 = Math.max(50, Math.min(100, n.spo2)); n.gcs = Math.max(3, Math.min(15, n.gcs)); n.af = Math.max(0, n.af);
    return n;
  }
  var CSS = ".as-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px;margin-top:12px}.as-card{all:unset;cursor:pointer;box-sizing:border-box;padding:14px;border-radius:16px;background:var(--surface,#fff);box-shadow:0 0 0 1px var(--line,#e5e7eb);border-top:5px solid var(--c)}.as-card b{display:block;margin:4px 0}.as-card small{color:var(--muted,#64748b)}" +
    ".as-mon{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;background:#0b1220;border-radius:16px;padding:10px;color:#e5e7eb;margin-bottom:12px}.as-mon div{background:#111a2e;border-radius:10px;padding:8px}.as-mon small{display:block;font-size:11px;opacity:.7}.as-mon b{font-size:22px;font-variant-numeric:tabular-nums}" +
    ".as-mon .ok b{color:#4ade80}.as-mon .warn b{color:#facc15}.as-mon .crit b{color:#f87171;animation:asb 1s infinite}@keyframes asb{50%{opacity:.45}}@media (max-width:560px){.as-mon{grid-template-columns:repeat(2,1fr)}}" +
    ".as-opt{all:unset;cursor:pointer;box-sizing:border-box;display:block;width:100%;padding:12px 14px;border-radius:12px;background:var(--fill,#f1f5f9);margin-bottom:8px;line-height:1.4}.as-opt.g2{background:#dcfce7}.as-opt.g1{background:#fef9c3}.as-opt.g0{background:#fee2e2}" +
    ".as-fb{border-radius:12px;padding:12px;margin:8px 0;background:var(--surface,#fff);box-shadow:0 0 0 1px var(--line,#e5e7eb)}.as-log{font-size:13px;color:var(--muted,#64748b);margin:0;padding-left:18px}";
  function useCss() { useEffect(function () { if (document.getElementById("as-css")) return; var s = document.createElement("style"); s.id = "as-css"; s.textContent = CSS; document.head.appendChild(s); }, []); }
  function Monitor(p) {
    var v = p.v, f = [["hf", "Puls /min", v.hf], ["sys", "RR mmHg", v.sys + "/" + v.dia], ["af", "Atemfrequenz", v.af], ["spo2", "SpO₂ %", v.spo2], ["t", "Temp °C", String(v.t).replace(".", ",")], ["bz", "BZ mg/dl", v.bz], ["gcs", "GCS", v.gcs], ["zeit", "Minuten", p.min]];
    return h("div", { className: "as-mon", role: "group", "aria-label": "Monitor" }, f.map(function (x) { return h("div", { key: x[0], className: x[0] === "zeit" ? "" : kl(x[0], x[0] === "sys" ? v.sys : v[x[0]]) }, h("small", null, x[1]), h("b", null, x[2])); }));
  }
  var LS = "fp-akutsim";
  function Akut() {
    useCss();
    var a = useState(null), aktiv = a[0], setAktiv = a[1];
    var s = useState(null), st = s[0], setSt = s[1];
    var best = (function () { try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch (e) { return {}; } })();
    var start = function (f) { setAktiv(f); setSt({ i: 0, v: Object.assign({}, f.v), min: 0, pkt: 0, wahl: null, log: [] }); try { if (window.FP_ZAEHLE) window.FP_ZAEHLE("akutsim", f.id); } catch (e) {} window.scrollTo(0, 0); };
    if (!aktiv) return h("div", null,
      h("div", { className: "card" }, h("h2", { style: { marginTop: 0 } }, "Akutsimulationen"), h("p", { className: "muted" }, "Notfälle auf Station mit Live-Monitor: Jede Entscheidung verändert Puls, Blutdruck, Atmung und Zeit. Am Ende bekommst du eine Auswertung und die Musterlösung. Übungsfälle, maßgeblich sind Hausstandard und ärztliche Anordnung.")),
      h("div", { className: "as-list" }, F.map(function (f) { var b = best[f.id]; return h("button", { key: f.id, type: "button", className: "as-card", style: { "--c": f.farbe }, onClick: function () { start(f); } }, h("small", null, f.bereich + " · " + f.schritte.length + " Entscheidungen"), h("b", null, f.titel), h("small", null, b != null ? "Bestwert " + b + " %" : "noch nicht gespielt")); })));
    var f = aktiv, schritt = f.schritte[st.i];
    if (!schritt) {
      var max = f.schritte.length * 2, pct = Math.round(100 * st.pkt / max);
      try { var bb = best; if (!(bb[f.id] >= pct)) { bb[f.id] = pct; localStorage.setItem(LS, JSON.stringify(bb)); } } catch (e) {}
      return h("div", null, h(Monitor, { v: st.v, min: st.min }),
        h("div", { className: "card" }, h("h2", { style: { marginTop: 0 } }, pct >= 85 ? "Sicher gehandelt" : pct >= 60 ? "Gut, mit Lücken" : "Hier lohnt sich Wiederholung"),
          h("p", null, st.pkt + " von " + max + " Punkten (" + pct + " %) in " + st.min + " Minuten."),
          h("h3", null, "Dein Verlauf"), h("ol", { className: "as-log" }, st.log.map(function (l, i) { return h("li", { key: i }, l); })),
          h("h3", null, "Musterlösung"), h("p", null, f.fazit),
          h("div", { className: "row", style: { gap: 8 } }, h("button", { type: "button", className: "btn", onClick: function () { start(f); } }, "Noch einmal"), h("button", { type: "button", className: "btn ghost", onClick: function () { setAktiv(null); } }, "Alle Fälle"))));
    }
    var v = st.i > 0 && schritt.vChange && st.wahl === null && !st.vApplied ? wende(st.v, schritt.vChange) : st.v;
    if (v !== st.v) setTimeout(function () { setSt(function (x) { return Object.assign({}, x, { v: v, vApplied: true }); }); }, 0);
    var o = st.wahl !== null ? schritt.opts[st.wahl] : null;
    return h("div", null,
      h("div", { className: "row", style: { justifyContent: "space-between", marginBottom: 8 } }, h("button", { type: "button", className: "skip", onClick: function () { setAktiv(null); } }, "← Alle Fälle"), h("span", { className: "muted" }, f.ort)),
      h(Monitor, { v: v, min: st.min }),
      h("div", { className: "card" },
        st.i === 0 && h("p", null, f.intro),
        h("h3", { style: { marginTop: 0 } }, "Entscheidung " + (st.i + 1) + " von " + f.schritte.length + ": " + schritt.frage),
        schritt.opts.map(function (x, j) {
          var cls = st.wahl === null ? "" : j === st.wahl ? "g" + x.ok : x.ok === 2 ? "g2" : "";
          return h("button", { key: j, type: "button", className: "as-opt " + cls, disabled: st.wahl !== null, onClick: function () { setSt(Object.assign({}, st, { wahl: j, v: wende(v, x.d), min: st.min + (x.min || 1), pkt: st.pkt + x.ok, log: st.log.concat([(x.ok === 2 ? "✓ " : x.ok === 1 ? "≈ " : "✗ ") + x.t]) })); } }, x.t);
        }),
        o && h("div", { className: "as-fb" }, h("b", null, o.ok === 2 ? "Gute Entscheidung. " : o.ok === 1 ? "Vertretbar, aber nicht optimal. " : "Kritisch. "), o.fb),
        o && h("div", { style: { display: "flex", justifyContent: "flex-end" } }, h("button", { type: "button", className: "btn", onClick: function () { setSt(Object.assign({}, st, { i: st.i + 1, wahl: null, vApplied: false })); } }, st.i + 1 < f.schritte.length ? "Weiter" : "Auswertung"))));
  }
  window.FP_TRAINING_VIEWS = window.FP_TRAINING_VIEWS || {};
  window.FP_TRAINING_VIEWS.akutsim = Akut;
})();
