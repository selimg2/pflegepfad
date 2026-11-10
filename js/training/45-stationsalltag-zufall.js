/* Fallpfad "Stationsalltag": Zufalls-Engine.
   Macht aus einem Szenario bei jedem Schichtbeginn eine eigene, einmalige Schicht. Gilt für alle Stationen.

   Was variiert (alles reproduzierbar über eine Zufallszahl "seed", die mit der Schicht gespeichert wird,
   damit eine unterbrochene Schicht genau so weitergeht):
   1. Verläufe ("dramen"): Ein Szenario kann mehrere kritische Verläufe anbieten (z. B. Nachblutung ODER
      Kompartmentsyndrom). Je Schicht werden einige davon gezogen, mit eigenen Aufgaben, Ereignissen und Vitalwerten.
   2. Varianten: Patientinnen, Aufgaben und Ereignisse können "varianten" haben (anderer Text, andere Werte,
      andere Uhrzeit). Je Schicht wird eine Fassung gewählt.
   3. Wahrscheinlichkeit: Einträge mit "chance" (0 bis 1) kommen nur manchmal vor.
   4. Zeitstreuung: Ereignisse kommen nicht immer zur gleichen Minute (Standard ± 8 Minuten). Was zusammengehört
      (gleiche Zeitgruppe "zg", Neuaufnahme und ihre Aufgaben), verschiebt sich gemeinsam. "fest: true" verhindert das.
   5. Zufallsereignisse: aus einem Pool je Station ("zufall") und einem allgemeinen Pool (unten) werden einige
      Alltagsereignisse gezogen: Klingel, Telefon, Angehörige, Apotheke, Gerätealarm, Hygiene … oft mit kleiner Aufgabe.
      Platzhalter im Text: {name} {kurz} {zimmer} {anrede}.
   Neue Inhalte werden nur als Daten ergänzt. Ohne KI, ohne Server. */
(function () {
  function tm(s) { if (typeof s === "number") return s; var p = String(s || "0:0").split(":"); return (+p[0]) * 60 + (+p[1] || 0); }
  function ft(m) { m = Math.round(m); var hh = Math.floor(m / 60) % 24, mm = ((m % 60) + 60) % 60; return ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2); }
  function arr(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
  function hash(s) { var x = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function rng(seed) { var a = seed >>> 0 || 1; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pickW(r, list) { var sum = list.reduce(function (n, x) { return n + (x.gewicht || 1); }, 0), v = r() * sum; for (var i = 0; i < list.length; i++) { v -= list[i].gewicht || 1; if (v <= 0) return i; } return list.length - 1; }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function between(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }

  /* Varianten auflösen: item.varianten = [ {…Abweichungen} ]. "basis: false" heißt: die Grundfassung nie verwenden. */
  function variante(r, item) {
    if (!item || !item.varianten || !item.varianten.length) return item;
    var opts = item.basis === false ? item.varianten : [{}].concat(item.varianten);
    var v = opts[pickW(r, opts)], o = Object.assign({}, item);
    delete o.varianten; delete o.basis;
    Object.keys(v).forEach(function (k) { if (k !== "gewicht") o[k] = v[k]; });
    return o;
  }

  /* ---------- Allgemeiner Pool: passt auf jede Station ----------
     braucht: Flags, die die Person haben muss (eine davon genügt). setting: "krankenhaus" | "langzeit" | beide (leer).
     ohnePat: kein Bezug zu einer Person. aufgabe: kleine Aufgabe, die durch das Ereignis entsteht. */
  var ALLGEMEIN = [
    { id: "schweigepflicht", art: "telefon", titel: "Anruf: Wie geht es {anrede}?", text: "Eine Frau ruft an und sagt, sie sei die Nichte von {name}. Sie möchte wissen, welche Befunde es gibt und wann {kurz} entlassen wird.", wichtig: 1,
      aufgabe: { t: "Telefonat mit der „Nichte“", kat: "kommunikation", dauer: 4, punkte: 8, icon: "phone",
        inhalt: { typ: "quiz", q: "Du weißt nicht, ob die Anruferin wirklich die Nichte ist, und in der Akte steht keine Schweigepflichtentbindung für sie. Was sagst du?",
          opts: [
            { t: "„Am Telefon darf ich leider keine Auskunft geben. Ich richte gern aus, dass Sie angerufen haben, und frage, ob wir Ihnen Auskunft geben dürfen. Sie können auch gern vorbeikommen.“", ok: true, fb: "Richtig. Schweigepflicht (§ 203 StGB) gilt auch gegenüber Angehörigen. Ohne Einverständnis der Person keine Auskünfte, schon gar nicht am Telefon." },
            { t: "„Es geht ihr gut, die Werte sind besser, Entlassung ist wohl Freitag.“", ok: false, fb: "Das sind Gesundheitsdaten. Ohne Einverständnis darfst du sie nicht weitergeben, auch nicht scheinbar harmlose." },
            { t: "„Geben Sie mir Ihr Geburtsdatum, dann darf ich es Ihnen sagen.“", ok: false, fb: "Ein Geburtsdatum belegt keine Berechtigung. Entscheidend ist das Einverständnis der Person selbst." }
          ] } } },
    { id: "kuehlschrank", ohnePat: true, art: "info", titel: "Lieferung der Apotheke", text: "Die Apothekenkiste ist da. Obenauf liegen Insulinpens und ein Impfstoff mit dem Hinweis „Kühl lagern“.", wichtig: 1,
      aufgabe: { t: "Apothekenlieferung einräumen", kat: "organisation", dauer: 5, punkte: 6, icon: "box",
        inhalt: { typ: "quiz", multi: true, q: "Was ist beim Einräumen richtig?",
          opts: [
            { t: "Kühlpflichtige Arzneimittel sofort in den Medikamentenkühlschrank (2 bis 8 °C)", ok: true },
            { t: "Neue Packungen nach hinten, ältere nach vorn (first expired, first out)", ok: true },
            { t: "Temperatur des Kühlschranks ablesen und im Protokoll dokumentieren", ok: true },
            { t: "Insulin, das gerade benutzt wird, gehört ebenfalls in den Kühlschrank", ok: false, fb: "Angebrochene Pens lagern meist bei Raumtemperatur (Herstellerangabe, oft bis 4 Wochen). Vorrat kühl, Anbruch nicht." },
            { t: "Die Kiste erst nach der Übergabe auspacken, sonst stört es den Ablauf", ok: false, fb: "Kühlware darf nicht stundenlang ungekühlt stehen. Die Kühlkette geht vor." }
          ] } } },
    { id: "verweigert", art: "klingel", braucht: ["med", "diabetes", "o2", "allergie", "schmerz", "sturz", "demenz", "herz"], titel: "Tabletten abgelehnt", text: "{anrede} schiebt den Becher mit den Tabletten weg: „Die nehm ich heute nicht. Von den kleinen weißen wird mir immer schwindelig.“", wichtig: 1,
      aufgabe: { t: "Medikament abgelehnt: reagieren", kat: "kommunikation", dauer: 5, punkte: 8, icon: "pill",
        inhalt: { typ: "quiz", q: "Was ist der richtige Umgang?",
          opts: [
            { t: "Nachfragen, was genau passiert, Schwindel ernst nehmen (RR messen), nicht drängen, Ablehnung dokumentieren und die Ärztin bzw. den Hausarzt informieren", ok: true, fb: "Richtig. Selbstbestimmung gilt, und die Beschwerde kann eine Nebenwirkung sein (z. B. Blutdrucksenker). Informieren und dokumentieren." },
            { t: "Die Tablette heimlich in den Joghurt mischen", ok: false, fb: "Verdeckte Gabe ohne rechtliche Grundlage ist eine Körperverletzung. Nie heimlich." },
            { t: "Tabletten auf dem Nachttisch stehen lassen, vielleicht nimmt sie sie später", ok: false, fb: "Unbeaufsichtigte Medikamente sind unsicher: Verwechslung, Verlust, Einnahme durch Mitpatienten. Und die Ablehnung bleibt unbemerkt." }
          ] } } },
    { id: "spender", ohnePat: true, art: "info", titel: "Desinfektionsmittel leer", text: "Am Eingang von Zimmer {zimmer} ist der Spender für Händedesinfektionsmittel leer. Eine Kollegin geht trotzdem ins Zimmer zur Blutentnahme.", wichtig: 1,
      aufgabe: { t: "Hygiene: leerer Spender", kat: "sicherheit", dauer: 3, punkte: 6, icon: "drop",
        inhalt: { typ: "quiz", q: "Was tust du?",
          opts: [
            { t: "Kollegin freundlich ansprechen und eine Kittelflasche anbieten, Spender sofort auffüllen bzw. tauschen", ok: true, fb: "Gut. Ein Spender in Reichweite ist Voraussetzung für die 5 Momente der Händedesinfektion. Kollegiales Ansprechen gehört zur Patientensicherheit." },
            { t: "Nichts sagen, sie ist examiniert und weiß, was sie tut", ok: false, fb: "Händehygiene ist die wichtigste Maßnahme gegen Krankenhausinfektionen. Freundlich ansprechen ist richtig, auch als Auszubildende." },
            { t: "Hände stattdessen kurz mit Wasser abspülen, das reicht vor der Blutentnahme", ok: false, fb: "Vor aseptischen Tätigkeiten ist Händedesinfektion vorgeschrieben, Waschen ersetzt sie nicht." }
          ] } } },
    { id: "stich", ohnePat: true, art: "alarm", titel: "Nadelstich!", text: "Beim Entsorgen einer gebrauchten Insulinkanüle sticht sich deine Kollegin in den Finger. Sie ist blass und schaut dich an: „Was mach ich jetzt?“", wichtig: 2,
      aufgabe: { t: "Nadelstichverletzung: Sofortmaßnahmen", kat: "sicherheit", dauer: 6, punkte: 10, icon: "alert",
        inhalt: { typ: "reihe", q: "Bring die Schritte nach einer Nadelstichverletzung in die richtige Reihenfolge.",
          items: [
            "Blutung fördern (nicht quetschen), Wunde mit Wasser spülen",
            "Großzügig mit einem viruziden Hautantiseptikum desinfizieren",
            "Stationsleitung informieren und sofort zur Durchgangsärztin bzw. zum Betriebsarzt",
            "Unfall dokumentieren (Unfallanzeige), Indexpatient benennen, Serologie veranlassen"
          ] } } },
    { id: "brille", braucht: ["demenz", "sturz", "seh"], art: "klingel", titel: "Klingel Zimmer {zimmer}", text: "{anrede} ist aufgeregt: „Meine Brille ist weg! Die hat mir bestimmt jemand weggenommen.“", wichtig: 1,
      aufgabe: { t: "Brille suchen und beruhigen", kat: "kommunikation", dauer: 6, punkte: 6, icon: "eye",
        inhalt: { typ: "quiz", q: "Wie gehst du vor?",
          opts: [
            { t: "Ruhig bleiben, Vorwurf nicht persönlich nehmen, gemeinsam suchen (Nachttisch, Bettdecke, Kittel) und danach einen festen Platz für die Brille vereinbaren", ok: true, fb: "Gut. Ohne Brille steigen Sturz- und Verwirrtheitsrisiko. Hilfsmittel gehören in Reichweite und an einen festen Platz." },
            { t: "„Hier klaut niemand. Die liegt bestimmt irgendwo, ich schau später.“", ok: false, fb: "Das beruhigt nicht und lässt die Person ohne Sehhilfe zurück: erhöhtes Sturzrisiko." },
            { t: "Eine Brille aus der Fundkiste geben, Hauptsache sie hat eine", ok: false, fb: "Eine falsche Brille kann Schwindel und Stürze verursachen." }
          ] } } },
    { id: "schmerz", braucht: ["schmerz", "op", "wunde", "sturz", "palliativ"], art: "klingel", titel: "Klingel Zimmer {zimmer}", text: "{anrede} hält sich die Seite: „Es tut wieder richtig weh. So ungefähr eine Sieben.“", wichtig: 2,
      aufgabe: { t: "Schmerzen einschätzen", kat: "fachlich", dauer: 6, punkte: 10, icon: "pulse",
        inhalt: { typ: "quiz", multi: true, q: "NRS 7 von 10. Was gehört jetzt dazu?",
          opts: [
            { t: "Lokalisation, Charakter, Beginn und Auslöser erfragen", ok: true },
            { t: "Bedarfsmedikation laut Anordnung prüfen und anbieten", ok: true },
            { t: "Wirkung nach 30 bis 60 Minuten erneut einschätzen und dokumentieren", ok: true },
            { t: "Nichtmedikamentöse Hilfen anbieten (Lagerung, Wärme oder Kälte, wenn erlaubt)", ok: true },
            { t: "Bis zur Visite warten, die Ärztin soll es selbst sehen", ok: false, fb: "Schmerzen werden sofort behandelt, wenn eine Bedarfsanordnung besteht. Ohne Anordnung informierst du die Ärztin jetzt, nicht erst zur Visite." },
            { t: "Erst etwas geben, wenn sie mindestens 8 von 10 angibt", ok: false, fb: "Nach DNQP-Expertenstandard gilt ein individuelles Behandlungsziel, meist ab NRS > 3 in Ruhe bzw. > 5 bei Belastung wird gehandelt." }
          ] } } },
    { id: "toilette", braucht: ["sturz", "demenz", "op", "mobil"], art: "klingel", titel: "Klingel Zimmer {zimmer}", text: "{anrede}: „Ich muss ganz dringend auf die Toilette! Schnell bitte!“", wichtig: 2, malusWennOffen: true,
      aufgabe: { t: "Begleitung zur Toilette", kat: "sicherheit", dauer: 7, punkte: 8, icon: "walk", frist: 10,
        inhalt: { typ: "quiz", q: "Du hast gerade die Hände voll mit einer anderen Aufgabe, die nicht zeitkritisch ist. Was ist richtig?",
          opts: [
            { t: "Sofort hingehen: Stopp und Ankündigung („Ich bin gleich da, bitte warten Sie im Bett“), dann Begleitung mit Hilfsmittel, Bremsen fest, rutschfeste Schuhe", ok: true, fb: "Richtig. Dringender Harndrang ist eine der häufigsten Sturzursachen: Wer zu lange wartet, steht allein auf." },
            { t: "„Ich komme in zehn Minuten“ rufen und erst die andere Aufgabe fertig machen", ok: false, fb: "Wer dringend muss, wartet selten zehn Minuten. Sturzgefahr." },
            { t: "Eine Inkontinenzvorlage anbieten, dann muss sie nicht aufstehen", ok: false, fb: "Das verletzt Würde und fördert Inkontinenz. Kontinenzförderung heißt: zeitnah zur Toilette begleiten." }
          ] } } },
    { id: "infusion-alarm", setting: "krankenhaus", braucht: ["infusion", "op", "o2", "allergie"], art: "alarm", titel: "Infusomat piept, Zimmer {zimmer}", text: "Die Infusionspumpe bei {anrede} meldet: „Okklusion distal“. Die Infusion steht.", wichtig: 2,
      aufgabe: { t: "Pumpenalarm „Okklusion“", kat: "fachlich", dauer: 5, punkte: 8, icon: "drip",
        inhalt: { typ: "reihe", q: "In welcher Reihenfolge prüfst du?",
          items: [
            "Alarm quittieren, zur Person schauen: Wie geht es ihr?",
            "System von der Pumpe bis zum Zugang ablaufen: Klemme offen, Leitung abgeknickt, Dreiwegehahn richtig?",
            "Zugang prüfen: Schwellung, Rötung, Schmerz? Bei Paravasat stoppen, nicht weiter spülen",
            "Infusion fortsetzen bzw. neuen Zugang veranlassen, dokumentieren"
          ] } } },
    { id: "essen-nuechtern", setting: "krankenhaus", braucht: ["nuechtern"], art: "info", titel: "Essenwagen", text: "Der Servicedienst stellt {anrede} ein Tablett mit Kaffee und Brötchen hin. In der Kurve steht: nüchtern.", wichtig: 2,
      aufgabe: { t: "Tablett trotz Nüchternheit", kat: "sicherheit", dauer: 3, punkte: 8, icon: "alert", frist: 8,
        inhalt: { typ: "quiz", q: "Was tust du?",
          opts: [
            { t: "Tablett freundlich wieder mitnehmen, Grund erklären, Schild „nüchtern“ am Bett prüfen und den Servicedienst informieren", ok: true, fb: "Richtig. Essen vor einer Narkose erhöht das Aspirationsrisiko. Hat die Person schon etwas gegessen, sofort Anästhesie informieren." },
            { t: "Nur den Kaffee dalassen, schwarzer Kaffee ist ja keine Mahlzeit", ok: false, fb: "Kaffee mit Milch oder Zucker zählt nicht als klare Flüssigkeit. Ob überhaupt getrunken werden darf, regelt die Anästhesie." },
            { t: "Nichts tun, das Tablett ist Sache des Servicedienstes", ok: false, fb: "Patientensicherheit ist Teamaufgabe. Du siehst das Risiko, also handelst du." }
          ] } } },
    { id: "kollege-lagern", ohnePat: true, art: "info", titel: "Kollegin bittet um Hilfe", text: "Eine Kollegin aus dem Nachbarbereich fragt, ob du kurz beim Höherlagern einer schweren Patientin helfen kannst. Es dauert etwa fünf Minuten.", wichtig: 1,
      aufgabe: { t: "Beim Lagern helfen", kat: "organisation", dauer: 5, punkte: 5, icon: "walk",
        inhalt: { typ: "quiz", q: "Wie gehst du vor?",
          opts: [
            { t: "Kurz prüfen, ob gerade etwas Dringendes ansteht. Wenn nicht: helfen, Bett auf Arbeitshöhe, Gleittuch nutzen, gemeinsam auf Kommando", ok: true, fb: "Gut. Teamarbeit spart Zeit und Rücken. Hilfsmittel (Gleittuch, Bettleiter) und Arbeitshöhe sind Pflicht." },
            { t: "Ablehnen, du hast genug eigene Arbeit", ok: false, fb: "Wenn nichts Dringendes ansteht, gehört Hilfe zum Team. Beim nächsten Mal hilft sie dir." },
            { t: "Zusammen schnell an den Armen hochziehen, das geht am schnellsten", ok: false, fb: "Ziehen an den Armen kann Schultern verletzen (Subluxation) und schadet deinem Rücken. Gleittuch nutzen." }
          ] } } },
    { id: "dokuluecke", ohnePat: true, art: "info", titel: "Hinweis der Stationsleitung", text: "Die Stationsleitung erinnert: Bei zwei Personen fehlen in der Kurve die Vitalwerte von heute früh. Sie wurden gemessen, aber nicht eingetragen.", wichtig: 1,
      aufgabe: { t: "Dokumentation nachtragen", kat: "doku", dauer: 4, punkte: 6, icon: "file",
        inhalt: { typ: "quiz", q: "Wie trägst du nach?",
          opts: [
            { t: "Mit der tatsächlichen Messzeit eintragen, als Nachtrag mit aktueller Uhrzeit und Kürzel kennzeichnen", ok: true, fb: "Richtig. Dokumentation muss wahr und nachvollziehbar sein. Nachträge werden als solche gekennzeichnet." },
            { t: "Die Werte so eintragen, als wären sie gerade gemessen", ok: false, fb: "Falsche Zeitangaben machen die Dokumentation unbrauchbar und können rechtliche Folgen haben." },
            { t: "Weglassen, gemessen ist gemessen", ok: false, fb: "Was nicht dokumentiert ist, gilt als nicht gemacht. Und die Kolleginnen brauchen die Werte für den Verlauf." }
          ] } } },
    { id: "angehoerige-frage", braucht: ["demenz", "palliativ", "sturz", "op"], art: "info", titel: "Besuch für {anrede}", text: "Ein Angehöriger von {name} steht am Stützpunkt: „Ich hab das Gefühl, hier kümmert sich keiner. Mein Vater lag heute früh ganz nass im Bett!“", wichtig: 2,
      aufgabe: { t: "Beschwerde eines Angehörigen", kat: "kommunikation", dauer: 7, punkte: 10, icon: "chat",
        inhalt: { typ: "quiz", q: "Wie reagierst du?",
          opts: [
            { t: "In Ruhe zuhören, Ärger anerkennen („Das ist wirklich unangenehm“), Sachverhalt klären, konkrete Lösung anbieten und die Pflegefachkraft bzw. Leitung einbeziehen", ok: true, fb: "Gut. Zuhören, anerkennen, klären, lösen. Rechtfertigung oder Gegenvorwürfe eskalieren das Gespräch." },
            { t: "„Wir sind heute nur zu zweit, mehr geht einfach nicht.“", ok: false, fb: "Personalmangel ist real, aber als erste Antwort wirkt es wie eine Ausrede. Erst anerkennen, dann lösen." },
            { t: "„Ihr Vater hat sich die Vorlage selbst rausgezogen.“", ok: false, fb: "Schuldzuweisung macht Angehörige noch wütender und hilft dem Vater nicht." }
          ] } } },
    { id: "hypo-zeichen", braucht: ["diabetes"], art: "klingel", titel: "Klingel Zimmer {zimmer}", text: "{anrede} ist verschwitzt und zittrig: „Mir ist so komisch, ich hab Heißhunger.“", wichtig: 3,
      aufgabe: { t: "Verdacht auf Unterzuckerung", kat: "sicherheit", dauer: 6, punkte: 12, icon: "drop", frist: 8,
        inhalt: { typ: "quiz", q: "BZ 54 mg/dl, wach und schluckt sicher. Was ist richtig?",
          opts: [
            { t: "15 bis 20 g schnell wirksame Kohlenhydrate (z. B. Traubenzucker oder 200 ml Saft), nach 15 Minuten BZ kontrollieren, danach langsame Kohlenhydrate, Ursache klären und informieren", ok: true, fb: "Richtig: die 15-15-Regel. Bei Bewusstseinsstörung nichts in den Mund, Notfall, Glukose i. v. bzw. Glukagon." },
            { t: "Ein Stück Schokolade geben, das wirkt am besten", ok: false, fb: "Fett in Schokolade verzögert die Aufnahme des Zuckers. Erst schnelle Kohlenhydrate." },
            { t: "Erst in einer Stunde nachmessen, damit der Wert aussagekräftig ist", ok: false, fb: "Nach 15 Minuten kontrollieren. Ist der Wert noch niedrig, wiederholen." }
          ] } } },
    { id: "stuhlgang", braucht: ["op", "schmerz", "mobil", "sturz"], setting: "", art: "klingel", titel: "Frage von {anrede}", text: "{anrede} fragt leise: „Ich war seit vier Tagen nicht mehr auf Toilette. Ist das schlimm?“", wichtig: 1,
      aufgabe: { t: "Obstipation ansprechen", kat: "fachlich", dauer: 5, punkte: 8, icon: "chat",
        inhalt: { typ: "quiz", multi: true, q: "Was passt?",
          opts: [
            { t: "Ausscheidung in der Kurve prüfen und nachfragen (Beschwerden, Bauch, Übelkeit)", ok: true },
            { t: "Medikamente auf Ursachen prüfen (z. B. Opioide, Eisen)", ok: true },
            { t: "Trinken, Bewegung und ballaststoffreiche Kost fördern, sofern erlaubt", ok: true },
            { t: "Ärztin informieren, ob ein Abführmittel angeordnet wird", ok: true },
            { t: "Sofort einen Einlauf machen", ok: false, fb: "Ein Einlauf braucht eine Anordnung und kommt erst nach anderen Maßnahmen." }
          ] } } },
    { id: "wlan", ohnePat: false, braucht: [], art: "klingel", titel: "Klingel Zimmer {zimmer}", text: "{anrede}: „Entschuldigung, wie komm ich denn ins WLAN? Und der Fernseher geht auch nicht.“", wichtig: 0,
      aufgabe: { t: "Frage nach WLAN und Fernseher", kat: "organisation", dauer: 3, punkte: 3, icon: "chat", frist: 45,
        inhalt: { typ: "quiz", q: "Es ist gerade viel los. Was ist sinnvoll?",
          opts: [
            { t: "Kurz hingehen, freundlich sagen, wann du Zeit hast, oder das Infoblatt mit dem Zugang geben. Dringendes geht vor", ok: true, fb: "Gut priorisiert. Auch kleine Wünsche verdienen eine Antwort, aber nicht vor dringenden Aufgaben." },
            { t: "Alles stehen und liegen lassen und den Fernseher reparieren", ok: false, fb: "Freundlich, aber falsch priorisiert. Dringende Aufgaben warten nicht." },
            { t: "Gar nicht reagieren, das ist keine Pflegeaufgabe", ok: false, fb: "Jedes Klingeln bekommt eine Antwort. Sonst klingelt die Person beim nächsten Mal nicht, wenn es wirklich wichtig ist." }
          ] } } }
  ];

  /* ---------- Bau einer konkreten Schicht ---------- */
  var CACHE = {};
  function build(base, seed, nameOf) {
    if (!base) return base;
    if (seed == null) return base; // alte gespeicherte Schicht ohne Zufall
    var key = base.id + ":" + seed;
    if (CACHE[key]) return CACHE[key];
    var r = rng((seed >>> 0) ^ hash(base.id));
    var sc = clone(base), V = sc.variation || {};
    var START = tm(sc.start), ENDE = tm(sc.ende), STREU = V.streu == null ? 8 : V.streu;
    sc._seed = seed; sc._key = key; sc._var = { dramen: [], zufall: [] };

    /* 1. Verläufe */
    var dramen = sc.dramen || [];
    if (dramen.length) {
      var w = V.dramen || [1, 1], n = Math.min(dramen.length, between(r, w[0], w[1])), pool = dramen.slice(), chosen = [];
      // Pflicht-Verläufe zuerst
      pool.filter(function (d) { return d.immer; }).forEach(function (d) { chosen.push(d); });
      pool = pool.filter(function (d) { return !d.immer; });
      while (chosen.length < n && pool.length) {
        var i = pickW(r, pool), d = pool[i];
        pool.splice(i, 1);
        if (d.schliesstAus && chosen.some(function (c) { return arr(d.schliesstAus).indexOf(c.id) >= 0; })) continue;
        chosen.push(d);
      }
      chosen.forEach(function (d) {
        sc._var.dramen.push(d.titel || d.id);
        (d.aufgaben || []).forEach(function (t) { sc.aufgaben.push(t); });
        (d.ereignisse || []).forEach(function (e) { sc.ereignisse.push(e); });
        Object.keys(d.patienten || {}).forEach(function (pid) { if (sc.patienten[pid]) Object.assign(sc.patienten[pid], d.patienten[pid]); });
        if (d.neuerFall) sc.neuerFall = d.neuerFall;
      });
      delete sc.dramen;
    }

    /* 2. Varianten und Wahrscheinlichkeiten */
    Object.keys(sc.patienten).forEach(function (pid) {
      var p = variante(r, sc.patienten[pid]);
      p.verlauf = (p.verlauf || []).map(function (x) { return variante(r, x); });
      sc.patienten[pid] = p;
    });
    sc.aufgaben = sc.aufgaben.filter(function (t) { return t.chance == null || r() < t.chance; }).map(function (t) { return variante(r, t); });
    sc.ereignisse = sc.ereignisse.filter(function (e) { return e.chance == null || r() < e.chance; }).map(function (e) { return variante(r, e); });

    /* 3. Zeitstreuung (gemeinsam je Zeitgruppe) */
    var off = {};
    function offset(g) { if (off[g] == null) off[g] = STREU ? between(r, -STREU, STREU) : 0; return off[g]; }
    function clamp(m) { return Math.max(START + 3, Math.min(ENDE - 8, m)); }
    var kommt = {};
    Object.keys(sc.patienten).forEach(function (pid) {
      var p = sc.patienten[pid];
      if (p.kommt && !p.fest) { var o = offset("kommt:" + pid); kommt[pid] = { alt: tm(p.kommt), neu: clamp(tm(p.kommt) + o) }; p.kommt = ft(kommt[pid].neu); p.verlauf.forEach(function (x) { if (x.ab && tm(x.ab) === kommt[pid].alt) x.ab = p.kommt; }); }
    });
    function gruppe(x, zeit) {
      if (x.zg) return x.zg;
      if (x.pat && kommt[x.pat] && tm(zeit) === kommt[x.pat].alt) return "kommt:" + x.pat;
      if (x.pat && evG[x.pat + "|" + tm(zeit)]) return evG[x.pat + "|" + tm(zeit)];
      return null;
    }
    /* Ereignisse einer Person zur gleichen Minute bilden eine Gruppe; Vitalverlauf und Aufgaben dieser Minute wandern mit */
    var evG = {};
    sc.ereignisse.forEach(function (e) { if (e.um && e.pat && !e.fest && !e.zg) { var k = e.pat + "|" + tm(e.um); if (!evG[k]) evG[k] = "ev:" + e.id; } });
    sc.ereignisse.forEach(function (e) {
      if (!e.um || e.fest || tm(e.um) <= START) return;
      var g = gruppe(e, e.um) || ("ev:" + e.id);
      e.um = ft(clamp(tm(e.um) + offset(g)));
    });
    Object.keys(sc.patienten).forEach(function (pid) {
      (sc.patienten[pid].verlauf || []).forEach(function (x) {
        if (!x.ab || x.fest || tm(x.ab) <= START) return;
        var g = x.zg || evG[pid + "|" + tm(x.ab)];
        if (g && off[g] != null) x.ab = ft(clamp(tm(x.ab) + off[g]));
      });
    });
    sc.aufgaben.forEach(function (t) {
      if (t.fest || !t.ab) return;
      var g = gruppe(t, t.ab);
      if (!g) return; // Routinezeiten (Medikamente 08 Uhr) bleiben fest
      var o = offset(g), ab = tm(t.ab);
      if (ab <= START) return;
      t.ab = ft(clamp(ab + o));
      if (t.faellig) t.faellig = ft(Math.max(tm(t.ab) + 5, tm(t.faellig) + o));
    });

    /* 4. Zufallsereignisse */
    var z = V.zufall || [3, 5], anzahl = between(r, z[0], z[1]);
    var setting = sc.setting || "krankenhaus";
    var tpl = (sc.zufall || []).concat(ALLGEMEIN).filter(function (x) { return !x.setting || x.setting === setting; });
    if (V.ohneAllgemein) tpl = sc.zufall || [];
    var belegt = sc.ereignisse.filter(function (e) { return e.um; }).map(function (e) { return tm(e.um); });
    var pids = [];
    sc.zimmer.forEach(function (zz) { zz.betten.forEach(function (pid) { if (pid && sc.patienten[pid]) pids.push(pid); }); });
    function roomOf(pid) { for (var i = 0; i < sc.zimmer.length; i++) if (sc.zimmer[i].betten.indexOf(pid) >= 0) return sc.zimmer[i].nr; return ""; }
    function freieZeit(ab) {
      for (var k = 0; k < 30; k++) {
        var m = between(r, Math.max(START + 15, ab || 0), ENDE - 25);
        if (belegt.every(function (b) { return Math.abs(b - m) >= 7; })) return m;
      }
      return null;
    }
    shuffle(r, tpl).forEach(function (x) {
      if (sc._var.zufall.length >= anzahl) return;
      var pid = null;
      if (!x.ohnePat) {
        var cand = pids.filter(function (id) {
          var p = sc.patienten[id], fl = (p.flags || []).concat(p.zflags || []);
          if (p.keinZufall) return false;
          return !x.braucht || !x.braucht.length || x.braucht.some(function (f) { return fl.indexOf(f) >= 0; });
        });
        if (!cand.length) return;
        pid = cand[Math.floor(r() * cand.length)];
      }
      var ab = pid && sc.patienten[pid].kommt ? tm(sc.patienten[pid].kommt) + 10 : 0;
      var m = freieZeit(ab); if (m == null) return;
      belegt.push(m);
      var I = pid && nameOf ? nameOf(sc, pid) : null, zim = pid ? roomOf(pid) : (sc.zimmer[Math.floor(r() * sc.zimmer.length)] || {}).nr;
      function fill(s) {
        return String(s || "").replace(/\{name\}/g, I ? I.name : "").replace(/\{kurz\}/g, I ? I.kurz : "").replace(/\{anrede\}/g, I ? (I.anrede || I.name) : "").replace(/\{zimmer\}/g, zim || "");
      }
      var eid = "z-" + x.id;
      var ev = { id: eid, um: ft(m), art: x.art || "info", pat: pid, titel: fill(x.titel), text: fill(x.text), wichtig: x.wichtig || 1, zufall: true };
      sc.ereignisse.push(ev);
      if (x.aufgabe) {
        var a = clone(x.aufgabe);
        var task = { id: eid + "-a", pat: pid, zimmer: pid ? undefined : zim, t: fill(a.t), kat: a.kat || "fachlich", ab: ft(m), faellig: ft(m + (a.frist || 20)), dauer: a.dauer || 5, punkte: a.punkte || 6, icon: a.icon || "bell", wenn: { gefeuert: eid }, zufall: true, inhalt: a.inhalt };
        if (task.inhalt && task.inhalt.q) task.inhalt.q = fill(task.inhalt.q);
        sc.aufgaben.push(task);
        if (x.malusWennOffen) sc.ereignisse.push({ id: eid + "-folge", um: ft(m + (a.frist || 20) + 10), wenn: { nichtErledigt: task.id }, art: "alarm", pat: pid, titel: "Folge: " + fill(x.folgeTitel || "Niemand kam"), text: fill(x.folgeText || "{anrede} ist allein aufgestanden und wäre fast gestürzt. Eine Kollegin konnte gerade noch helfen."), wichtig: 2, malus: { kat: "sicherheit", pts: 5, t: fill("Auf die Klingel von {anrede} wurde zu spät reagiert.") } });
      }
      sc._var.zufall.push(x.id);
    });
    sc.ereignisse.sort(function (a, b) { return (a.um ? tm(a.um) : 9999) - (b.um ? tm(b.um) : 9999); });
    CACHE[key] = sc;
    return sc;
  }
  function neuerSeed() {
    try { var a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] || 1; } catch (e) { return (Math.random() * 4294967295) >>> 0 || 1; }
  }
  window.FP_STATION_VAR = { build: build, seed: neuerSeed, allgemein: ALLGEMEIN, version: 1 };
})();
