/* ============================================================================
   LATIN INFERNO — innehåll / content data
   Kurs: Latin – språk och kultur 1 (LATLAT01, Gy11)
   Allt latin, alla Vergilius-citat och allt klassiskt stoff är autentiskt.
   Dantes Inferno (italienska) används som ram; latinet är äkta kurslatin +
   verkliga rader ur Aeneiden. E/C/A-taggar speglar Skolverkets betygsmatris.
   ========================================================================== */

const INFERNO = {

  /* De nio kunskapskriterierna i LATLAT01, kort form (för betygskompassen). */
  criteria: {
    text:    "Läsa, återge och tolka enkla latinska texter",
    grammar: "Använda grammatikens grunder (formlära, kasus)",
    concept: "Beskriva språkliga företeelser med begrepp",
    vocab:   "Använda ett latinskt basordförråd",
    modern:  "Se sambandet latin – svenska/engelska",
    history: "Latinets historia och inflytande",
    culture: "Romersk historia, kultur och samhällsliv",
    influence:"Romersk kulturs påverkan på senare tider"
  },

  /* Genomgående Vergilius-tema. Verkliga rader ur Aeneiden (bok.rad). */

  stages: [

  /* ---------------------------------------------------------------- 0 */
  {
    id: "selva",
    roman: "Silva Obscura",
    sv: "Den mörka skogen",
    subtitle: "Prologen — du möter Vergilius",
    focus: "Latinets uttal · alfabetet",
    art: "wood",
    intro: {
      dante: "Mitt i vandringen genom vårt liv fann du dig vilse i en mörk skog, där den rätta vägen var borta. Ur skuggorna stiger en gestalt — en skald, död i tusen år.",
      virgil: "Salvē, viātor. Jag är Publius Vergilius Maro, som en gång sjöng om Aeneas och Roms öde. Vill du nå stjärnorna måste du först stiga ner. Jag skall lära dig mitt språk — latinet — medan vi går. Lyssna först på hur det klingar.",
      line: { la: "Arma virumque canō", ref: "Aeneiden 1,1", sv: "Om vapnen och mannen sjunger jag" }
    },
    challenges: [
      { type:"lore", crit:"history", grade:"E",
        title:"Latinets uttal",
        body:"Klassiskt latin (det uttal man lär sig i skolan) följer några fasta regler. <b>c</b> uttalas alltid som [k], <b>v</b> som [w], <b>ae</b> som [aj] och <b>ē</b> är långt. Så <i>Caesar</i> lät ungefär <i>[KAJ-sar]</i> — därför tyska <i>Kaiser</i> och ryska <i>tsar</i>.",
        q:"Hur uttalades <i>Caesar</i> på klassiskt latin?",
        options:["[SEE-sar]","[KAJ-sar]","[TJEE-sar]"], answer:1,
        explain:"[KAJ-sar]. c=[k], ae=[aj]. Att namnet blev <i>Kaiser</i> och <i>tsar</i> visar uttalet." },

      { type:"vocab", crit:"vocab", grade:"E",
        title:"Första ordet",
        q:"<b>via</b> betyder:",
        latin:"via, viae (f.)",
        options:["väg","liv","vatten"], answer:0,
        explain:"<b>via</b> = väg. Lever kvar i svenskans <i>via</i> och i <i>triviell</i> (tre vägars korsning)." },

      { type:"sententia", crit:"text", grade:"E",
        title:"Sententia: descensus",
        la:"facilis dēscēnsus Avernō", ref:"Aeneiden 6,126",
        sv:"Lätt är nedstigandet till underjorden",
        note:"Vergilius egna ord om resan ner i dödsriket — samma resa Dante (och du) nu påbörjar.",
        q:"Vilket svenskt/engelskt ord kommer av <b>dēscēnsus</b>?",
        options:["descent / descendent","decimal","design"], answer:0,
        explain:"dēscēnsus → eng. <i>descent</i>, sv. <i>descendent</i> (ättling, 'nedstigande')." }
    ]
  },

  /* ---------------------------------------------------------------- gate */
  {
    id: "porta",
    roman: "Porta Īnferī",
    sv: "Helvetets port",
    subtitle: "Inskriften över porten",
    focus: "Sentenser · enkel meningsbyggnad",
    art: "gate",
    intro: {
      dante: "Ni framför mig leder till de fördömdas stad. Över porten brinner orden: Lasciate ogne speranza, voi ch'intrate — Låt allt hopp fara, ni som träder in.",
      virgil: "Dantes port talar italienska. Men latinet bygger meningar på samma grund: ett subjekt, ett verb. <i>Rōma est urbs</i> — Rom är en stad. Lär dig se de delarna, så öppnas porten.",
      line: { la:"per mē iter in cīvitātem dolentem", ref:"jfr Inferno 3,1", sv:"genom mig går vägen till den lidande staden" }
    },
    challenges: [
      { type:"grammar", crit:"grammar", grade:"E",
        title:"Subjekt och verb",
        body:"En enkel latinsk mening: <b>poēta cantat</b> = skalden sjunger. <b>poēta</b> (subjekt, nominativ), <b>cantat</b> (verb, 3:e person singular).",
        q:"Vad är verbet i <b>Vergilius viam mōnstrat</b> (Vergilius visar vägen)?",
        options:["Vergilius","viam","mōnstrat"], answer:2,
        explain:"<b>mōnstrat</b> = (han) visar. Av samma rot kommer <i>demonstrera</i>." },

      { type:"sententia", crit:"text", grade:"E",
        title:"Sententia: spero",
        la:"dum spīrō, spērō", ref:"romerskt ordspråk",
        sv:"så länge jag andas, hoppas jag",
        note:"Ett motgift mot portens 'låt hoppet fara'. Notera ljudlikheten spīrō/spērō.",
        q:"<b>spērō</b> ('jag hoppas') lever kvar i vilket ord?",
        options:["desperat (utan hopp)","spegel","sparris"], answer:0,
        explain:"dē-spērō = 'hoppas bort' → <i>desperat</i>. spīrō ('andas') → <i>inspirera, andas in</i>." },

      { type:"hereditas", crit:"modern", grade:"C",
        title:"Arvet i två språk",
        q:"<b>cīvitās</b> betyder 'medborgarskap/stat'. Para ihop arvingarna.",
        body:"Latinets <b>cīvitās, cīvis</b> (medborgare) har gett ord i både svenska och engelska.",
        options:["sv. civil – eng. city/civic","sv. kista – eng. kiss","sv. svit – eng. sweet"], answer:0,
        explain:"cīvitās → eng. <i>city</i>, <i>civic</i>; cīvis → sv. <i>civil</i>. Att förklara <i>båda</i> språken utförligt är C–A-nivå." }
    ]
  },

  /* ---------------------------------------------------------------- 1 */
  {
    id: "limbo",
    roman: "Cīrculus I — Limbus",
    sv: "Första kretsen — Limbo",
    subtitle: "De rättfärdiga hedningarna",
    focus: "Substantiv · 1:a deklinationen · nominativ & ackusativ",
    art: "limbo",
    intro: {
      dante: "Här, utan plåga men utan hopp, vilar de som levde väl men före tron: filosofer och skalder. Homeros, Horatius, Ovidius — och Vergilius själv hör hemma här.",
      virgil: "Bland mina likar lär du dig namnens former. Latinets substantiv böjs efter sin roll i satsen. Ett ord på <b>-a</b> hör oftast till första deklinationen: <b>poēta</b> som subjekt, <b>poētam</b> som objekt.",
      line: { la:"Mūsa, mihī causās memorā", ref:"Aeneiden 1,8", sv:"Musa, nämn för mig orsakerna" }
    },
    challenges: [
      { type:"grammar", crit:"grammar", grade:"E",
        title:"Första deklinationen",
        body:"<b>poēta</b> (skald), 1:a deklinationen.<br>Nom. (subjekt) <b>poēta</b> · Ack. (objekt) <b>poētam</b> · Gen. (av) <b>poētae</b> · Dat. (åt) <b>poētae</b> · Abl. (med/från) <b>poētā</b>.",
        q:"Vilken form är objekt (ackusativ) av <b>rosa</b>?",
        options:["rosa","rosam","rosae"], answer:1,
        explain:"Ackusativ singular i 1:a deklinationen slutar på <b>-am</b>: <i>rosam</i> (rosen, som objekt)." },

      { type:"translatio", crit:"text", grade:"C",
        title:"Översätt",
        la:"poēta puellam amat.",
        hint:"poēta = skald · puella = flicka · amat = älskar · -m markerar objektet",
        reveal:"Skalden älskar flickan. (poēta = subjekt i nominativ, puellam = objekt i ackusativ.)",
        q:"Vem älskar vem?",
        options:["Skalden älskar flickan","Flickan älskar skalden","De älskar varandra"], answer:0,
        explain:"Ändelsen avgör rollen, inte ordföljden: <b>poēta</b> (nom) är subjekt, <b>puellam</b> (ack, -m) är objekt." },

      { type:"lore", crit:"culture", grade:"E",
        title:"Skaldernas krets",
        body:"De fyra stora skalderna som hälsar Dante i Limbo är <b>Homerus</b> (grekiskan), <b>Horātius</b>, <b>Ovidius</b> och <b>Lūcānus</b> — alla utom Homeros skrev på latin. Vergilius är den femte.",
        q:"Vilken romersk skald skrev <i>Metamorfoser</i> (om förvandlingar)?",
        options:["Ovidius","Horatius","Lucanus"], answer:0,
        explain:"<b>Ovidius</b> (Ovid) skrev <i>Metamorphōsēs</i>. Horatius gav oss <i>carpe diem</i>." },

      { type:"analysis", crit:"influence", grade:"A",
        title:"Fördjupning (A)",
        body:"Dante placerar hedniska skalder i Limbo — straffria men hopplösa.",
        q:"Reflektera: vad säger det om medeltidens syn på den antika kulturen att Dante både hyllar Vergilius som sin mästare och ändå dömer honom till helvetet?",
        reveal:"Ett nyanserat svar (A) väger två ting mot varandra: medeltiden ärvde och vördade Roms litteratur och lärdom (Vergilius som 'lo mio maestro'), men det kristna systemet kunde inte frälsa den som levde före Kristus. Spänningen visar hur den romerska kulturen levde vidare som ideal samtidigt som den underordnades en ny världsbild — precis det 'kulturbärar'-perspektiv kursen efterfrågar." }
    ]
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: "lust",
    roman: "Cīrculus II — Luxuria",
    sv: "Andra kretsen — Vällusten",
    subtitle: "Francesca da Rimini",
    focus: "2:a deklinationen · genus (m/f/n)",
    art: "wind",
    intro: {
      dante: "En evig storm sliter de älskande hit och dit. Francesca berättar hur en bok förförde henne och Paolo: 'den dagen läste vi inte mer.'",
      virgil: "Kärlek — <b>amor</b> — är ett ord ur andra deklinationen. Här lär du dig genus. Ord på <b>-us</b> är oftast maskulina, ord på <b>-um</b> neutrum. <b>amīcus</b> (vän, m.), <b>bellum</b> (krig, n.).",
      line: { la:"omnia vincit Amor", ref:"Eklogerna 10,69", sv:"Allt besegrar Kärleken" }
    },
    challenges: [
      { type:"grammar", crit:"concept", grade:"E",
        title:"Genus",
        body:"2:a deklinationen: <b>dominus</b> (herre, m.) böjs <i>dominus, dominum, dominī...</i> — <b>templum</b> (tempel, n.) böjs <i>templum, templum, templī...</i> (neutrum har samma nom. och ack.).",
        q:"Vilket genus har <b>bellum</b> (krig)?",
        options:["maskulinum","femininum","neutrum"], answer:2,
        explain:"<b>-um</b> → neutrum. <i>bellum</i> ger oss <i>rebell</i> (re-bellāre, kriga på nytt) och <i>casus belli</i>." },

      { type:"vocab", crit:"vocab", grade:"E",
        title:"Basord",
        q:"<b>liber, librī</b> (m.) betyder:",
        latin:"liber, librī",
        options:["fri","bok","barn"], answer:1,
        explain:"<b>liber</b> = bok → <i>bibliotek, libretto</i>. (Förväxla ej med adj. <i>līber</i> = fri, → <i>liberal</i>.)" },

      { type:"translatio", crit:"text", grade:"C",
        title:"Översätt Francescas rad",
        la:"Amor mē vincit.",
        hint:"Amor = kärlek (subjekt) · mē = mig · vincit = besegrar",
        reveal:"Kärleken besegrar mig. (Jfr Vergilius 'omnia vincit Amor'.)",
        q:"Översättningen är:",
        options:["Jag besegrar kärleken","Kärleken besegrar mig","Kärleken är besegrad"], answer:1,
        explain:"<b>Amor</b> är subjekt (nom.), <b>mē</b> objekt. <b>vincit</b> → <i>invincible, Vinci</i>." }
    ]
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: "glutt",
    roman: "Cīrculus III — Gula",
    sv: "Tredje kretsen — Frosseriet",
    subtitle: "Cerberus i det eviga regnet",
    focus: "Verb · presens · 1:a konjugationen + esse",
    art: "rain",
    intro: {
      dante: "Den trehövdade hunden Cerberus skäller över frossarna som ligger i kallt, evigt regn. Vergilius kastar jord i dess tre gap för att tysta det.",
      virgil: "Nu till verben. Latinets verb bär personen i ändelsen. <b>amō</b> = jag älskar, <b>amās</b> = du älskar, <b>amat</b> = han/hon älskar. Det vanligaste verbet av alla är <b>esse</b>, 'att vara'.",
      line: { la:"flūctūs et fulmina poscunt", ref:"jfr Aeneiden", sv:"de kräver vågor och blixtar" }
    },
    challenges: [
      { type:"grammar", crit:"grammar", grade:"E",
        title:"Presens, 1:a konjugationen",
        body:"<b>amāre</b> (älska): amō, amās, amat, amāmus, amātis, amant.<br>Stammen är <b>amā-</b>, personändelserna <b>-ō, -s, -t, -mus, -tis, -nt</b>.",
        q:"Vad betyder <b>amāmus</b>?",
        options:["jag älskar","vi älskar","de älskar"], answer:1,
        explain:"<b>-mus</b> = 'vi'. amāmus = vi älskar." },

      { type:"grammar", crit:"grammar", grade:"C",
        title:"Verbet esse (vara)",
        body:"Oregelbundet men oumbärligt: <b>sum, es, est, sumus, estis, sunt</b> (jag är, du är, han är, vi är, ni är, de är).",
        q:"<b>Rōma et Carthāgō urbēs ___.</b> (Rom och Karthago är städer.)",
        options:["est","sunt","sumus"], answer:1,
        explain:"Subjektet är pluralt (Rom OCH Karthago) → <b>sunt</b> (de är)." },

      { type:"hereditas", crit:"modern", grade:"E",
        title:"Tre huvuden",
        q:"Cerberus har tre huvuden. <b>caput</b> = huvud. Vilket ord är släkt?",
        options:["kapital / kapitel","kappa","kapsyl"], answer:0,
        explain:"<b>caput, capitis</b> → <i>kapital</i> (huvudtillgång), <i>kapitel</i>, <i>kapten</i> (eng. <i>captain</i>)." },

      { type:"lore", crit:"culture", grade:"C",
        title:"Romersk vardag: maten",
        body:"Det romerska gästabudet (<b>convīvium</b>) kunde vara i timmar. Man låg till bords på soffor (<b>triclīnium</b>) och åt med fingrarna. Frosseri sågs som ett tecken på bristande <b>moderātiō</b> (måtta) — en dygd romarna höll högt.",
        q:"Vad kallades matsalen där man låg till bords?",
        options:["forum","triclīnium","thermae"], answer:1,
        explain:"<b>triclīnium</b> (tre soffor). <i>thermae</i> var baden, <i>forum</i> torget." }
    ]
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: "greed",
    roman: "Cīrculus IV — Avāritia",
    sv: "Fjärde kretsen — Girigheten",
    subtitle: "Plutus och de tunga stenarna",
    focus: "Kasussystemet · genitiv & dativ",
    art: "stones",
    intro: {
      dante: "De giriga och de slösaktiga rullar tunga klippblock mot varandra och ropar 'Varför hålla?' mot 'Varför slösa?'. Rikedomen blev deras börda.",
      virgil: "För att läsa latin måste du behärska de sex kasusen — ett ords 'roller'. Du kan nominativ (subjekt) och ackusativ (objekt). Lär nu <b>genitiv</b> (ägande: 'X:s') och <b>dativ</b> ('åt/till X').",
      line: { la:"quid nōn mortālia pectora cōgis, aurī sacra famēs", ref:"Aeneiden 3,56", sv:"vartill driver du ej människors hjärtan, du fördömda guldhunger" }
    },
    challenges: [
      { type:"concept", crit:"concept", grade:"E",
        title:"De sex kasusen",
        body:"<b>Nominativ</b> = subjekt · <b>Genitiv</b> = ägande (-s) · <b>Dativ</b> = åt/till · <b>Ackusativ</b> = objekt · <b>Ablativ</b> = med/från/i · <b>Vokativ</b> = tilltal.",
        q:"I 'skaldens bok' (boken som tillhör skalden) — vilket kasus står 'skaldens' i?",
        options:["nominativ","genitiv","dativ"], answer:1,
        explain:"Ägande uttrycks med <b>genitiv</b>: <i>liber poētae</i> = skaldens bok." },

      { type:"grammar", crit:"grammar", grade:"C",
        title:"Genitiv och dativ",
        body:"1:a dekl.: gen. sg. <b>-ae</b>, dat. sg. <b>-ae</b>. <i>rēgīna</i> (drottning) → <i>rēgīnae</i> (drottningens / åt drottningen).",
        q:"<b>corōna rēgīnae</b> betyder:",
        options:["drottningen är en krona","drottningens krona","åt kronan, drottning"], answer:1,
        explain:"<b>rēgīnae</b> är här genitiv: 'drottningens krona'." },

      { type:"hereditas", crit:"modern", grade:"C",
        title:"Guldhungern",
        q:"<b>aurum</b> = guld. Vilken förkortning i kemin minns det?",
        body:"Vergilius 'aurī sacra famēs' (guldets fördömda hunger) lever i grundämnenas namn.",
        options:["Au (aurum)","Ag (guld)","Fe (guld)"], answer:0,
        explain:"Guld = <b>Au</b> av <i>aurum</i>; silver = Ag av <i>argentum</i>; järn = Fe av <i>ferrum</i>." }
    ]
  },

  /* ---------------------------------------------------------------- 5 */
  {
    id: "wrath",
    roman: "Cīrculus V — Īra",
    sv: "Femte kretsen — Vreden",
    subtitle: "Floden Styx",
    focus: "Prepositioner + ablativ",
    art: "styx",
    intro: {
      dante: "I det leriga träsket Styx slåss de vredgade, medan de tröga sjunker under ytan. Färjkarlen Flegyas för dig motvilligt över det svarta vattnet.",
      virgil: "Över floden — <b>trāns flūmen</b>. Många prepositioner styr ablativ: <b>in aquā</b> (i vattnet), <b>cum amīcō</b> (med vännen), <b>ē tenebrīs</b> (ur mörkret). Lär dig känna igen ablativen.",
      line: { la:"flectere sī nequeō superōs, Acheronta movēbō", ref:"Aeneiden 7,312", sv:"kan jag ej böja himlen, skall jag sätta underjorden i rörelse" }
    },
    challenges: [
      { type:"grammar", crit:"grammar", grade:"E",
        title:"Prepositioner med ablativ",
        body:"<b>in</b> (i), <b>cum</b> (med), <b>sine</b> (utan), <b>ē/ex</b> (ur), <b>ā/ab</b> (från), <b>dē</b> (ned från / om) — alla med ablativ. Abl. sg. 1:a dekl. = <b>-ā</b>.",
        q:"'i vattnet' (aqua) heter:",
        options:["in aquam","in aquā","in aquae"], answer:1,
        explain:"<b>in</b> + ablativ för befintlighet: <b>in aquā</b>. (in + ackusativ = riktning, 'in i vattnet'.)" },

      { type:"sententia", crit:"text", grade:"C",
        title:"Sententia: Acheron",
        la:"Acheronta movēbō", ref:"Aeneiden 7,312",
        sv:"Jag skall sätta underjorden i rörelse",
        note:"Junos hotfulla ord. Freud satte dem som motto för Drömtydningen — antiken lever vidare.",
        q:"<b>Acheron</b> är i myten en:",
        options:["flod i dödsriket","romersk kejsare","gud för krig"], answer:0,
        explain:"Acheron — en av underjordens floder. Dantes Styx och Acheron kommer rakt ur den grekisk-romerska myten." },

      { type:"translatio", crit:"text", grade:"A",
        title:"Översätt (A): två prepositioner",
        la:"cum Vergiliō trāns flūmen sine timōre eō.",
        hint:"cum = med · trāns = över (+ack) · sine = utan · timor = rädsla · eō = jag går",
        reveal:"Med Vergilius går jag över floden utan rädsla. (cum + abl., sine + abl., trāns + ack.)",
        q:"Vilken känsla saknas under färden?",
        options:["rädsla (timor)","glädje","hunger"], answer:0,
        explain:"<b>sine timōre</b> = utan rädsla. timor → eng. <i>timid</i>. Att reda ut tre prepositionsfraser i en mening är A-nivå." }
    ]
  },

  /* ---------------------------------------------------------------- 6 */
  {
    id: "heresy",
    roman: "Cīrculus VI — Haeresis",
    sv: "Sjätte kretsen — Kätteriet",
    subtitle: "De brinnande gravarna",
    focus: "Adjektiv · kongruens (överensstämmelse)",
    art: "tombs",
    intro: {
      dante: "På en slätt av öppna, glödande gravar reser sig kättarna. Farinata, den store ghibellinen, höjer sig stolt ur sin eldkista och talar om Florens framtid.",
      virgil: "Adjektiv måste <b>kongruera</b> med sitt substantiv i genus, numerus och kasus. <b>poēta bonus</b> (en god skald), <b>vīta bona</b> (ett gott liv), <b>bellum malum</b> (ett ont krig). Formen följer ordet det beskriver.",
      line: { la:"sunt geminae Somnī portae", ref:"Aeneiden 6,893", sv:"två är Sömnens portar" }
    },
    challenges: [
      { type:"grammar", crit:"grammar", grade:"C",
        title:"Kongruens",
        body:"Adjektivet rättar sig efter substantivet. <b>magnus</b> (stor): magnus (m.), magna (f.), magnum (n.).",
        q:"'en stor drottning' — <i>rēgīna</i> är feminin. Rätt form?",
        options:["rēgīna magnus","rēgīna magna","rēgīna magnum"], answer:1,
        explain:"Feminint substantiv → feminint adjektiv: <b>rēgīna magna</b>." },

      { type:"hereditas", crit:"modern", grade:"C",
        title:"Stort arv",
        q:"<b>magnus</b> = stor. Vilken grupp är släkt?",
        options:["magnifik, magnitud, magnat","magnet, magi, mango","mager, mage, magasin"], answer:0,
        explain:"magnus → <i>magnifik, magnitud, magnat</i> (lat. <i>magnās</i>). Karl den Store = Carolus <b>Magnus</b>." },

      { type:"lore", crit:"influence", grade:"E",
        title:"Florens och Rom",
        body:"Dantes Farinata grälar om Florens partistrider (guelfer mot ghibelliner). Hela renässansens Italien såg sig som Roms arvtagare — stadsstaterna härmade romersk arkitektur, latin och republikanska ideal.",
        q:"Vilket språk skrev Dante sitt Inferno på?",
        options:["latin","italienska (folkspråket)","grekiska"], answer:1,
        explain:"Italienska — ett djärvt val. Men latinet var bildningens språk, och Dantes guide Vergilius förkroppsligar det arvet." }
    ]
  },

  /* ---------------------------------------------------------------- 7 */
  {
    id: "violence",
    roman: "Cīrculus VII — Violentia",
    sv: "Sjunde kretsen — Våldet",
    subtitle: "Minotauros och självmördarnas skog",
    focus: "Tempus · imperfekt & perfekt",
    art: "forest",
    intro: {
      dante: "Minotauros vaktar ingången. Nedanför kokar en flod av blod, och längre in viskar självmördarnas förvridna träd. Här straffas våld mot nästan, mot sig själv, mot Gud.",
      virgil: "Du kan presens. Nu till det förflutna. <b>Imperfekt</b> beskriver pågående/upprepad dåtid: <b>amābam</b> (jag älskade, brukade älska). <b>Perfekt</b> en avslutad handling: <b>amāvī</b> (jag har älskat / jag älskade).",
      line: { la:"vēnī, vīdī, vīcī", ref:"Caesar, hos Suetonius", sv:"jag kom, jag såg, jag segrade" }
    },
    challenges: [
      { type:"grammar", crit:"grammar", grade:"C",
        title:"Imperfekt",
        body:"Kännetecknet för imperfekt är <b>-bā-</b>: amā<b>ba</b>m, amā<b>bā</b>s, amā<b>ba</b>t... 'Skogen viskade' = <i>silva susurrābat</i>.",
        q:"Vad betyder <b>cantābat</b>?",
        options:["han sjunger","han sjöng (brukade sjunga)","han kommer att sjunga"], answer:1,
        explain:"<b>-bā-</b> = imperfekt: <i>cantābat</i> = han sjöng / höll på att sjunga." },

      { type:"sententia", crit:"text", grade:"E",
        title:"Sententia: tre perfekt",
        la:"vēnī, vīdī, vīcī", ref:"Julius Caesar, 47 f.Kr.",
        sv:"jag kom, jag såg, jag segrade",
        note:"Caesars lakoniska seger­rapport efter slaget vid Zela. Tre verb i perfekt.",
        q:"Vilken handling är <b>avslutad</b> i 'vīcī'?",
        options:["att segra (jag har segrat)","att se","att komma i framtiden"], answer:0,
        explain:"Perfekt = avslutad handling: <i>vīcī</i> = jag har segrat. vincō → <i>vīcī</i> (oregelb.)." },

      { type:"translatio", crit:"text", grade:"A",
        title:"Översätt (A): tempusväxling",
        la:"silva clāmābat, sed Vergilius mē servāvit.",
        hint:"silva = skogen · clāmābat = ropade (impf.) · sed = men · servāvit = räddade (perf.)",
        reveal:"Skogen ropade, men Vergilius räddade mig. — Impf. (pågående 'ropade') mot perf. (avslutad 'räddade').",
        q:"Vilket verb beskriver en avslutad handling?",
        options:["clāmābat","servāvit","båda"], answer:1,
        explain:"<b>servāvit</b> (perfekt, -v-) = räddade/har räddat, avslutat. <b>clāmābat</b> (imperfekt) = pågående. servāre → <i>konservera, bevara</i>." }
    ]
  },

  /* ---------------------------------------------------------------- 8 */
  {
    id: "fraud",
    roman: "Cīrculus VIII — Fraus",
    sv: "Åttonde kretsen — Bedrägeriet",
    subtitle: "Malebolge — de tio gravarna",
    focus: "Syntax · ordföljd & bisatser",
    art: "bolge",
    intro: {
      dante: "Malebolge: tio ringgravar av sten där bedragarna pinas — kopplare, smickrare, simonister, falska rådgivare, tjuvar. Ulysses brinner här, dömd för det trojanska sveket.",
      virgil: "Bedrägeri vränger sanningen; latinsk syntax kan vränga ordföljden. Latinet är fritt i ordföljd eftersom <i>ändelserna</i> bär betydelsen. En bisats inleds ofta av <b>quod</b> (att/eftersom), <b>quī/quae/quod</b> (som) eller <b>cum</b> (när/då).",
      line: { la:"timeō Danaōs et dōna ferentēs", ref:"Aeneiden 2,49", sv:"jag fruktar grekerna, även när de bär gåvor" }
    },
    challenges: [
      { type:"concept", crit:"concept", grade:"C",
        title:"Fri ordföljd",
        body:"Eftersom kasusändelsen visar rollen kan latinet flytta orden för betoning. <b>poēta puellam amat</b> och <b>puellam poēta amat</b> betyder båda 'skalden älskar flickan'. Verbet står ofta sist.",
        q:"I <b>puellam poēta amat</b>, vem är objektet?",
        options:["poēta","puellam","amat"], answer:1,
        explain:"<b>puellam</b> (-m, ackusativ) är objektet oavsett att det står först. Ändelsen, inte platsen, bestämmer." },

      { type:"sententia", crit:"culture", grade:"C",
        title:"Sententia: den trojanska hästen",
        la:"timeō Danaōs et dōna ferentēs", ref:"Aeneiden 2,49",
        sv:"jag fruktar grekerna, även när de bär gåvor",
        note:"Prästen Laocoöns varning för trähästen — urbilden av en 'gåva' som är ett bedrägeri.",
        q:"Vad är sensmoralen romarna drog av detta?",
        options:["misstänk en alltför generös gåva","ge alltid gåvor","lita på grekerna"], answer:0,
        explain:"En 'danaergåva' = en gåva med baktanke. Ulysses (Odysseus), hästens upphovsman, straffas i denna krets." },

      { type:"translatio", crit:"text", grade:"A",
        title:"Översätt (A): en bisats",
        la:"Vergilius, quī Aenēam cecinit, viam mōnstrat.",
        hint:"quī = som (relativpron.) · Aenēam = Aeneas (objekt) · cecinit = besjöng (perf. av canō) · viam = vägen · mōnstrat = visar",
        reveal:"Vergilius, som besjöng Aeneas, visar vägen. — Relativsatsen 'quī...cecinit' beskriver Vergilius.",
        q:"Vad gör relativsatsen <i>quī Aenēam cecinit</i>?",
        options:["beskriver Vergilius (vem han är)","är huvudsats","är ett tilltal"], answer:0,
        explain:"<b>quī</b> syftar tillbaka på Vergilius och inleder en bisats: 'han som besjöng Aeneas' — dvs. Aeneiden själv." }
    ]
  },

  /* ---------------------------------------------------------------- 9 */
  {
    id: "treachery",
    roman: "Cīrculus IX — Prōditiō",
    sv: "Nionde kretsen — Förräderiet",
    subtitle: "Cocytus, den frusna sjön — och Lucifer",
    focus: "BOSS · sammanfattande översättning av en äkta Aeneid-rad",
    art: "ice",
    intro: {
      dante: "Längst ner är inget eld, utan is. I den frusna sjön Cocytus sitter förrädarna instängda. I mitten maler Lucifer själv de tre värsta i sina tre gap. För att komma ut måste ni klättra nedför hans kropp — och vända.",
      virgil: "Detta är provet, discipule. Allt du lärt — kasus, verb, ordförråd — möter en enda rad ur min dikt. Översätt den, så bär jag dig förbi Lucifer mot ljuset.",
      line: { la:"tū nē cēde malīs, sed contrā audentior ītō", ref:"Aeneiden 6,95", sv:"vik inte för olyckorna, gå djärvare emot dem" }
    },
    challenges: [
      { type:"vocab", crit:"vocab", grade:"E",
        title:"Boss steg 1 — ord",
        q:"I <b>tū nē cēde malīs</b>: vad betyder <b>malīs</b>?",
        latin:"malum, malī (n.) = ont, olycka — här ablativ pluralis",
        options:["för olyckorna/det onda","för kungarna","för havet"], answer:0,
        explain:"<b>malīs</b> (abl. pl. av <i>malum</i>) — 'vik inte för olyckorna'. malum → <i>malis, malign</i>." },

      { type:"grammar", crit:"grammar", grade:"C",
        title:"Boss steg 2 — form",
        body:"<b>cēde</b> är imperativ (befallning): 'vik!'. Med <b>nē</b> blir det en förbjudande uppmaning: 'vik inte!'",
        q:"<b>nē cēde</b> uttrycker:",
        options:["en fråga","ett förbud/en maning ('gör inte')","dåtid"], answer:1,
        explain:"<b>nē</b> + imperativ = negerad uppmaning: 'vik inte'. <b>ītō</b> (gå!) är en högtidlig framtidsimperativ." },

      { type:"translatio", crit:"text", grade:"A",
        title:"BOSS — översätt hela raden",
        la:"tū nē cēde malīs, sed contrā audentior ītō.",
        hint:"tū = du · nē cēde = vik inte · malīs = för olyckorna · sed = men · contrā = emot · audentior = djärvare · ītō = gå!",
        reveal:"Du, vik inte för olyckorna, utan gå djärvare emot dem. — Vergilius, Aeneiden 6,95. Den anchisiska uppmaningen till Aeneas i dödsriket: precis din egen resa.",
        q:"Vad uppmanar raden till?",
        options:["att fly från svårigheter","att möta svårigheter med större mod","att ge upp"], answer:1,
        explain:"Mod i motgång. Att Vergilius säger detta i UNDERJORDEN, mitt i din egen nedstigning, är poängen. <i>audentior</i> ('djärvare') hör ihop med 'audentēs fortūna iuvat'." }
    ]
  },

  /* ---------------------------------------------------------------- exit */
  {
    id: "stelle",
    roman: "Ad Astra",
    sv: "Upp till stjärnorna",
    subtitle: "E quindi uscimmo a riveder le stelle",
    focus: "Avslutning · betygskompass",
    art: "stars",
    final: true,
    intro: {
      dante: "Ni klättrar nedför Lucifers sida, passerar jordens mittpunkt, och börjar stiga. Genom en dold gång når ni till sist ut — och får återse himlen.",
      virgil: "Du har stigit ner och rest dig igen, discipule. Du läser nu enkel latin, känner kasusen, ser mina ord leva kvar i dina egna språk. Minns vad Aeneas fick höra — och bär det vidare.",
      line: { la:"forsan et haec ōlim meminisse iuvābit", ref:"Aeneiden 1,203", sv:"kanske skall det en dag glädja oss att minnas även detta" }
    },
    challenges: [
      { type:"sententia", crit:"influence", grade:"E",
        title:"Sista sententian",
        la:"per aspera ad astra", ref:"romerskt valspråk",
        sv:"genom svårigheter mot stjärnorna",
        note:"Dante slutar varje del av Komedin med ordet 'stelle' (stjärnor). Här slutar din nedstigning — och latinets <b>astra</b> lyser i ord som <i>astronomi, astronaut, katastrof</i>.",
        q:"<b>astrum/astra</b> = stjärna(or). Vilket ord hör INTE hit?",
        options:["astronaut","katastrof (kata-astēr, 'olycksstjärna')","aster (blomman)","asfalt"], answer:3,
        explain:"<i>asfalt</i> är grekiskt men oberoende. De andra bär stjärnan: astra → astronom, astronaut, katastrof, aster." }
    ]
  }

  ]
};

if (typeof module !== "undefined") module.exports = INFERNO;
