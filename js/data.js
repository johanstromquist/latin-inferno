/* ============================================================================
   LATIN INFERNO — innehåll / content data  (v2)
   Kurs: Latin – språk och kultur 1 (LATLAT01, Gy11)
   Allt latin, alla citat och allt klassiskt stoff är autentiskt och hänvisat.
   Dantes Inferno (italienska) = berättelsens ram; latinet är äkta kurslatin +
   verkliga rader ur Vergilius diktning (främst Aeneiden) + andra antika källor.
   Interaktion: mc (välja), cloze (skriva formen), assemble (bygga raden),
   self (analys). E/C/A speglar Skolverkets betygsmatris; allt utom A krävs
   för att passera en krets (A = sann 100 %). must:true = obligatorisk.
   ========================================================================== */

const INFERNO = {

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

  stages: [

  /* ---------------------------------------------------------------- 0 selva */
  {
    id:"selva", roman:"Silva Obscura", sv:"Den mörka skogen",
    subtitle:"Prologen — du möter Vergilius", focus:"Latinets uttal · alfabetet", art:"wood",
    intro:{
      dante:"Mitt i vandringen genom vårt liv fann du dig vilse i en mörk skog, där den rätta vägen var borta. Ur skuggorna stiger en gestalt — en skald, död i tusen år.",
      virgil:"Salvē, viātor. Jag är Publius Vergilius Maro, som en gång sjöng om Aeneas och Roms öde. Vill du nå stjärnorna måste du först stiga ner. Jag skall lära dig mitt språk — latinet — medan vi går. Lyssna först på hur det klingar.",
      line:{ la:"Arma virumque canō", ref:"Aeneiden 1,1", sv:"Om vapnen och mannen sjunger jag" }
    },
    challenges:[
      { type:"lore", crit:"history", grade:"E", title:"Latinets uttal",
        body:"Klassiskt latin (det restaurerade uttalet) följer fasta regler. <b>c</b> uttalas alltid [k], <b>v</b> som [w], <b>ae</b> som [aj] och vokaler med streck (ā, ē…) är långa. Så <i>Caesar</i> lät ungefär <i>[KAJ-sar]</i> — därför tyska <i>Kaiser</i> och ryska <i>tsar</i>.",
        q:"Hur uttalades <i>Caesar</i> på klassiskt latin?",
        options:["[SEE-sar]","[KAJ-sar]","[TJEE-sar]"], answer:1,
        explain:"[KAJ-sar]. c=[k], ae=[aj]. Att namnet blev <i>Kaiser</i> och <i>tsar</i> bevisar uttalet." },
      { type:"vocab", crit:"vocab", grade:"E", title:"Första ordet",
        q:"<b>via</b> betyder:", latin:"via, viae (f.)",
        options:["väg","liv","vatten"], answer:0,
        explain:"<b>via</b> = väg. Lever kvar i svenskans <i>via</i> och i <i>trivial</i> (tre vägars korsning, <i>trivium</i>)." },
      { type:"sententia", crit:"text", grade:"E", title:"Sententia: descensus",
        la:"facilis dēscēnsus Avernō", ref:"Aeneiden 6,126",
        sv:"Lätt är nedstigandet till underjorden",
        note:"Vergilius egna ord om resan ner i dödsriket — samma resa du nu påbörjar.",
        q:"Vilket svenskt/engelskt ord kommer av <b>dēscēnsus</b>?",
        options:["descent / descendent","decimal","design"], answer:0,
        explain:"dēscēnsus → eng. <i>descent</i>, sv. <i>descendent</i> (ättling, 'nedstigande')." }
    ]
  },

  /* ---------------------------------------------------------------- gate */
  {
    id:"porta", roman:"Porta Īnferī", sv:"Helvetets port",
    subtitle:"Inskriften över porten", focus:"Sentenser · enkel meningsbyggnad", art:"gate",
    intro:{
      dante:"Porten framför dig leder till de fördömdas stad. Över den brinner Dantes ord: Lasciate ogne speranza — Låt allt hopp fara, ni som träder in.",
      virgil:"Dantes port talar italienska. Men latinet bygger meningar på en fast grund: ett subjekt, ett verb. Se de delarna, så öppnas porten.",
      line:{ la:"noctēs atque diēs patet ātrī iānua Dītis", ref:"Aeneiden 6,127",
             sv:"natt och dag står den svarte Dis' port öppen" }
    },
    challenges:[
      { type:"grammar", crit:"grammar", grade:"E", title:"Subjekt och verb",
        act:"Porten öppnas bara för den som ser meningens delar.",
        body:"En enkel latinsk mening: <b>poēta cantat</b> = skalden sjunger. <b>poēta</b> (subjekt, nominativ), <b>cantat</b> (verb, 3:e person).",
        q:"Vad är verbet i <b>Vergilius viam mōnstrat</b> (Vergilius visar vägen)?",
        options:["Vergilius","viam","mōnstrat"], answer:2,
        explain:"<b>mōnstrat</b> = (han) visar. Av samma rot kommer <i>demonstrera</i>." },
      { type:"sententia", crit:"text", grade:"E", title:"Sententia: spero",
        la:"dum spīrō, spērō", ref:"romerskt ordspråk", sv:"så länge jag andas, hoppas jag",
        note:"Ett motgift mot portens 'låt hoppet fara'. Notera ljudlikheten spīrō/spērō.",
        q:"<b>spērō</b> ('jag hoppas') lever kvar i vilket ord?",
        options:["desperat (utan hopp)","spegel","sparris"], answer:0,
        explain:"dē-spērō = 'hoppas bort' → <i>desperat</i>. spīrō ('andas') → <i>inspirera</i>." },
      { type:"hereditas", crit:"modern", grade:"C", title:"Arvet i två språk",
        body:"Latinets <b>cīvitās, cīvis</b> (medborgare/stat) har gett ord i både svenska och engelska.",
        q:"Vilket par är båda äkta arvingar till <b>cīvitās/cīvis</b>?",
        options:["sv. civil – eng. city/civic","sv. kista – eng. kiss","sv. svit – eng. sweet"], answer:0,
        explain:"cīvitās → eng. <i>city, civic</i>; cīvis → sv. <i>civil</i>. Att förklara båda språken utförligt är C–A." }
    ]
  },

  /* ---------------------------------------------------------------- 1 limbo */
  {
    id:"limbo", roman:"Cīrculus I — Limbus", sv:"Första kretsen — Limbo",
    subtitle:"De rättfärdiga hedningarna",
    focus:"Substantiv · 1:a deklinationen · nominativ & ackusativ", art:"limbo",
    intro:{
      dante:"Här, utan plåga men utan hopp, vilar de som levde väl men före tron: Homeros, Horatius, Ovidius — och Vergilius själv hör hemma här.",
      virgil:"Bland mina likar lär du dig namnens former. Latinets substantiv böjs efter sin roll i satsen. Ett ord på <b>-a</b> hör oftast till första deklinationen: <b>poēta</b> som subjekt, <b>poētam</b> som objekt.",
      line:{ la:"Mūsa, mihī causās memorā", ref:"Aeneiden 1,8", sv:"Musa, nämn för mig orsakerna" }
    },
    challenges:[
      { type:"grammar", crit:"grammar", grade:"E", title:"Första deklinationen — skriv formen",
        body:"<b>rosa</b> (ros), 1:a dekl.: Nom. <i>rosa</i> · Ack. <i>rosam</i> · Gen. <i>rosae</i> · Dat. <i>rosae</i> · Abl. <i>rosā</i>.",
        q:"Skriv <b>ackusativ singular</b> (objektsform) av <b>rosa</b>:",
        accept:["rosam"], answerLabel:"rosam",
        explain:"Ackusativ sg. i 1:a dekl. slutar på <b>-am</b>: <i>rosam</i> (rosen, som objekt)." },
      { type:"grammar", crit:"grammar", grade:"E", title:"En form till",
        q:"Skriv <b>genitiv singular</b> (rosens) av <b>rosa</b>:",
        accept:["rosae"], answerLabel:"rosae",
        explain:"Genitiv sg. = <b>-ae</b>: <i>rosae</i> (rosens). Samma form är också dativ." },
      { type:"translatio", crit:"text", grade:"C", title:"Bygg översättningen",
        act:"Översätt skaldernas rad — ordet, inte ordföljden, avgör rollen.",
        la:"poēta puellam amat.",
        hint:"poēta = skald · puella = flicka · amat = älskar · -m markerar objektet",
        assemblePrompt:"Bygg den svenska översättningen i rätt ordning:",
        solution:["Skalden","älskar","flickan"],
        explain:"<b>poēta</b> (nom) är subjekt, <b>puellam</b> (-m, ack) är objekt — alltså 'Skalden älskar flickan'." },
      { type:"lore", crit:"culture", grade:"E", title:"Skaldernas krets",
        body:"De fyra skalderna som hälsar Dante i Limbo är <b>Homerus</b>, <b>Horātius</b>, <b>Ovidius</b> och <b>Lūcānus</b>. Vergilius är den femte.",
        q:"Vilken romersk skald skrev <i>Metamorfoser</i> (om förvandlingar)?",
        options:["Ovidius","Horatius","Lucanus"], answer:0,
        explain:"<b>Ovidius</b> skrev <i>Metamorphōsēs</i>. Horatius gav oss <i>carpe diem</i>." },
      { type:"analysis", crit:"influence", grade:"A", title:"Fördjupning (A)",
        body:"Dante placerar hedniska skalder i Limbo — straffria men hopplösa.",
        q:"Reflektera: vad säger det om medeltidens syn på antiken att Dante både hyllar Vergilius som sin mästare och ändå dömer honom till helvetet?",
        reveal:"Ett nyanserat svar (A) väger två ting: medeltiden ärvde och vördade Roms litteratur (Vergilius som 'lo mio maestro'), men det kristna systemet kunde inte frälsa den som levde före Kristus. Den romerska kulturen lever vidare som ideal samtidigt som den underordnas en ny världsbild — just det kulturbärar-perspektiv kursen efterfrågar." }
    ]
  },

  /* ---------------------------------------------------------------- 2 lust */
  {
    id:"lust", roman:"Cīrculus II — Luxuria", sv:"Andra kretsen — Vällusten",
    subtitle:"Francesca da Rimini", focus:"2:a deklinationen · genus (m/f/n)", art:"wind",
    intro:{
      dante:"En evig storm sliter de älskande hit och dit. Francesca berättar hur en bok förförde henne och Paolo: 'den dagen läste vi inte mer.'",
      virgil:"Kärlek — <b>amor</b> — ord ur andra deklinationen. Ord på <b>-us</b> är oftast maskulina, ord på <b>-um</b> neutrum.",
      line:{ la:"omnia vincit Amor", ref:"Eklogerna 10,69", sv:"Allt besegrar Kärleken" }
    },
    challenges:[
      { type:"grammar", crit:"concept", grade:"E", title:"Genus",
        body:"2:a dekl.: <b>dominus</b> (herre, m.), <b>templum</b> (tempel, n.). Neutrum har samma nom. och ack.",
        q:"Vilket genus har <b>bellum</b> (krig)?",
        options:["maskulinum","femininum","neutrum"], answer:2,
        explain:"<b>-um</b> → neutrum. <i>bellum</i> ger <i>rebell</i> (re-bellāre) och <i>casus belli</i>." },
      { type:"vocab", crit:"vocab", grade:"E", title:"Basord",
        q:"<b>liber, librī</b> (m.) betyder:", latin:"liber, librī",
        options:["fri","bok","barn"], answer:1,
        explain:"<b>liber</b> = bok → <i>ex libris</i>, <i>libretto</i>; eng. <i>library</i> (av <i>librārium</i>). Förväxla ej med adj. <i>līber</i> = fri → <i>liberal</i>." },
      { type:"translatio", crit:"text", grade:"C", title:"Bygg Francescas rad",
        la:"Amor mē vincit.",
        hint:"Amor = kärlek (subjekt) · mē = mig · vincit = besegrar",
        assemblePrompt:"Bygg den svenska översättningen i rätt ordning:",
        solution:["Kärleken","besegrar","mig"],
        explain:"<b>Amor</b> är subjekt (nom), <b>mē</b> objekt. <b>vincit</b> → eng. <i>invincible</i> (invincibilis)." }
    ]
  },

  /* ---------------------------------------------------------------- 3 glutt */
  {
    id:"glutt", roman:"Cīrculus III — Gula", sv:"Tredje kretsen — Frosseriet",
    subtitle:"Cerberus i det eviga regnet", focus:"Verb · presens · 1:a konjugationen + esse", art:"rain",
    intro:{
      dante:"Den trehövdade hunden Cerberus skäller över frossarna i kallt, evigt regn. Vergilius kastar jord i dess tre gap för att tysta det.",
      virgil:"Nu till verben. Latinets verb bär personen i ändelsen: <b>amō</b> (jag älskar), <b>amās</b> (du), <b>amat</b> (han/hon). Det vanligaste verbet är <b>esse</b>, att vara.",
      line:{ la:"Cerberus haec ingēns lātrātū regna trifaucī personat", ref:"Aeneiden 6,417",
             sv:"Cerberus fyller dessa riken med skall ur sina tre strupar" }
    },
    challenges:[
      { type:"grammar", crit:"grammar", grade:"E", title:"Presens — tysta Cerberus",
        act:"Tysta Cerberus tre strupar — böj verbet rätt.",
        actMiss:"Cerberus ryter. Försök igen.",
        body:"<b>amāre</b> (älska): amō, amās, amat, amāmus, amātis, amant. Stam <b>amā-</b> + ändelse.",
        q:"Skriv presens <b>'vi älskar'</b> av <b>amāre</b>:",
        accept:["amamus"], answerLabel:"amāmus",
        explain:"<b>-mus</b> = 'vi': <i>amāmus</i> = vi älskar." },
      { type:"grammar", crit:"grammar", grade:"C", title:"Verbet esse",
        body:"Oregelbundet: <b>sum, es, est, sumus, estis, sunt</b>.",
        q:"Skriv rätt form av <i>esse</i>: <b>Rōma et Carthāgō urbēs ___</b> (Rom och Karthago är städer).",
        accept:["sunt"], answerLabel:"sunt",
        explain:"Subjektet är pluralt (Rom OCH Karthago) → <b>sunt</b> (de är)." },
      { type:"hereditas", crit:"modern", grade:"E", title:"Tre huvuden",
        q:"Cerberus har tre huvuden. <b>caput</b> = huvud. Vilket ord är släkt?",
        options:["kapital / kapitel","kappa","kapsyl"], answer:0,
        explain:"<b>caput, capitis</b> → <i>kapital</i> (huvudtillgång), <i>kapitel</i>, <i>kapten</i> (eng. <i>captain</i>)." },
      { type:"lore", crit:"culture", grade:"C", title:"Romersk vardag: maten",
        body:"Det romerska gästabudet (<b>convīvium</b>) kunde vara i timmar. Man låg till bords på soffor och åt med fingrarna. Frosseri sågs som brist på <b>moderātiō</b> (måtta).",
        q:"Vad kallades matsalen där man låg till bords?",
        options:["forum","triclīnium","thermae"], answer:1,
        explain:"<b>triclīnium</b> (tre soffor). <i>thermae</i> var baden, <i>forum</i> torget." }
    ]
  },

  /* ---------------------------------------------------------------- 4 greed */
  {
    id:"greed", roman:"Cīrculus IV — Avāritia", sv:"Fjärde kretsen — Girigheten",
    subtitle:"Plutus och de tunga stenarna", focus:"Kasussystemet · genitiv & dativ", art:"stones",
    intro:{
      dante:"De giriga och slösaktiga rullar tunga klippblock mot varandra och ropar 'Varför hålla?' mot 'Varför slösa?'. Rikedomen blev deras börda.",
      virgil:"För att läsa latin måste du behärska de sex kasusen. Du kan nominativ och ackusativ. Lär nu <b>genitiv</b> (ägande: 'X:s') och <b>dativ</b> ('åt/till X').",
      line:{ la:"quid nōn mortālia pectora cōgis, aurī sacra famēs", ref:"Aeneiden 3,56",
             sv:"vartill driver du ej människors hjärtan, du fördömda guldhunger" }
    },
    challenges:[
      { type:"concept", crit:"concept", grade:"E", title:"De sex kasusen",
        body:"<b>Nominativ</b>=subjekt · <b>Genitiv</b>=ägande · <b>Dativ</b>=åt/till · <b>Ackusativ</b>=objekt · <b>Ablativ</b>=med/från/i · <b>Vokativ</b>=tilltal.",
        q:"I 'skaldens bok' — vilket kasus står 'skaldens' i?",
        options:["nominativ","genitiv","dativ"], answer:1,
        explain:"Ägande = <b>genitiv</b>: <i>liber poētae</i> = skaldens bok." },
      { type:"grammar", crit:"grammar", grade:"C", title:"Skriv genitiven",
        body:"1:a dekl.: gen. sg. <b>-ae</b>. <i>rēgīna</i> (drottning).",
        q:"Skriv <b>genitiv singular</b> av <b>rēgīna</b> (drottningens):",
        accept:["reginae"], answerLabel:"rēgīnae",
        explain:"<b>rēgīnae</b> = drottningens. <i>corōna rēgīnae</i> = drottningens krona." },
      { type:"hereditas", crit:"modern", grade:"C", title:"Guldhungern",
        body:"Vergilius 'aurī sacra famēs' (guldets fördömda hunger) lever i kemins grundämnen.",
        q:"<b>aurum</b> = guld. Vilken kemisk förkortning minns det?",
        options:["Au (aurum)","Ag (argentum)","Fe (ferrum)"], answer:0,
        explain:"Guld = <b>Au</b> (aurum); silver = Ag (argentum); järn = Fe (ferrum)." }
    ]
  },

  /* ---------------------------------------------------------------- 5 wrath */
  {
    id:"wrath", roman:"Cīrculus V — Īra", sv:"Femte kretsen — Vreden",
    subtitle:"Floden Styx", focus:"Prepositioner + ablativ", art:"styx",
    intro:{
      dante:"I det leriga träsket Styx slåss de vredgade medan de tröga sjunker under ytan. Färjkarlen Flegyas för dig motvilligt över det svarta vattnet.",
      virgil:"Många prepositioner styr ablativ: <b>in aquā</b> (i vattnet), <b>cum amīcō</b> (med vännen), <b>ē tenebrīs</b> (ur mörkret). Känn igen ablativen, så bär båten dig.",
      line:{ la:"flectere sī nequeō superōs, Acheronta movēbō", ref:"Aeneiden 7,312",
             sv:"kan jag ej böja himlen, skall jag sätta underjorden i rörelse" }
    },
    challenges:[
      { type:"grammar", crit:"grammar", grade:"E", title:"Korsa Styx — skriv ablativen",
        act:"Stig i Flegyas båt — lös ablativen för att korsa Styx.",
        actMiss:"Båten gungar i dyn. Försök igen.",
        body:"<b>in, cum, sine, ē/ex, ā/ab, dē</b> styr ablativ. Abl. sg. 1:a dekl. = <b>-ā</b>.",
        q:"Skriv <b>'i vattnet'</b> (in + aqua i ablativ):",
        accept:["in aqua"], answerLabel:"in aquā",
        explain:"<b>in</b> + ablativ för befintlighet: <b>in aquā</b>. (in + ackusativ = riktning.)" },
      { type:"sententia", crit:"text", grade:"C", title:"Sententia: Acheron",
        la:"Acheronta movēbō", ref:"Aeneiden 7,312", sv:"Jag skall sätta underjorden i rörelse",
        note:"Junos hot. Freud satte orden som motto för Drömtydningen — antiken lever vidare.",
        q:"<b>Acheron</b> är i myten:",
        options:["en flod i dödsriket","en romersk kejsare","krigets gud"], answer:0,
        explain:"Acheron — en av underjordens floder. Dantes Styx och Acheron kommer rakt ur myten." },
      { type:"translatio", crit:"text", grade:"A", title:"Översätt (A): tre prepositioner",
        la:"cum Vergiliō trāns flūmen sine timōre eō.",
        hint:"cum = med · trāns = över · sine = utan · timor = rädsla · eō = jag går",
        assemblePrompt:"Bygg den svenska översättningen i rätt ordning:",
        solution:["Med Vergilius","går","jag","över floden","utan rädsla"],
        explain:"cum + abl., sine + abl., trāns + ack. <i>sine timōre</i> = utan rädsla → eng. <i>timid</i>." }
    ]
  },

  /* ---------------------------------------------------------------- 6 heresy */
  {
    id:"heresy", roman:"Cīrculus VI — Haeresis", sv:"Sjätte kretsen — Kätteriet",
    subtitle:"De brinnande gravarna", focus:"Adjektiv · kongruens (överensstämmelse)", art:"tombs",
    intro:{
      dante:"På en slätt av öppna, glödande gravar reser sig kättarna. Farinata, den store ghibellinen, höjer sig stolt ur sin eldkista och talar om Florens framtid.",
      virgil:"Adjektiv måste <b>kongruera</b> med sitt substantiv i genus, numerus och kasus. <b>poēta bonus</b>, <b>vīta bona</b>, <b>bellum malum</b>.",
      line:{ la:"sunt geminae Somnī portae", ref:"Aeneiden 6,893", sv:"två är Sömnens portar" }
    },
    challenges:[
      { type:"grammar", crit:"grammar", grade:"C", title:"Kongruens — skriv formen",
        body:"Adjektivet rättar sig efter substantivet. <b>magnus</b> (stor): magnus (m.), magna (f.), magnum (n.).",
        q:"<b>rēgīna</b> är feminin. Skriv <b>'stor'</b> (magnus) i rätt form:",
        accept:["magna"], answerLabel:"magna",
        explain:"Feminint substantiv → feminint adjektiv: <i>rēgīna magna</i>." },
      { type:"hereditas", crit:"modern", grade:"C", title:"Stort arv",
        q:"<b>magnus</b> = stor. Vilken grupp är släkt?",
        options:["magnifik, magnitud, magnat","magnet, magi, mango","mager, mage, magasin"], answer:0,
        explain:"magnus → <i>magnifik, magnitud, magnat</i>. Karl den Store = Carolus <b>Magnus</b>." },
      { type:"lore", crit:"influence", grade:"E", title:"Florens och Rom",
        body:"Farinata grälar om Florens partistrider. Hela renässansens Italien såg sig som Roms arvtagare — stadsstaterna härmade romersk arkitektur, latin och republikanska ideal.",
        q:"Vilket språk skrev Dante sitt Inferno på?",
        options:["latin","italienska (folkspråket)","grekiska"], answer:1,
        explain:"Italienska — ett djärvt val. Men latinet var bildningens språk, och guiden Vergilius förkroppsligar arvet." }
    ]
  },

  /* ---------------------------------------------------------------- 7 violence */
  {
    id:"violence", roman:"Cīrculus VII — Violentia", sv:"Sjunde kretsen — Våldet",
    subtitle:"Minotauros och självmördarnas skog", focus:"Tempus · imperfekt & perfekt", art:"forest",
    intro:{
      dante:"Minotauros vaktar ingången. Nedanför kokar en flod av blod, och längre in viskar självmördarnas förvridna träd. Här straffas våldet.",
      virgil:"Nu till det förflutna. <b>Imperfekt</b> beskriver pågående/upprepad dåtid: <b>amābam</b> (jag älskade). <b>Perfekt</b> en avslutad handling: <b>amāvī</b> (jag har älskat).",
      line:{ la:"ubīque pavor et plūrima mortis imāgō", ref:"Aeneiden 2,369",
             sv:"överallt skräck och dödens mångfaldiga ansikte" }
    },
    challenges:[
      { type:"grammar", crit:"grammar", grade:"C", title:"Imperfekt — skriv formen",
        body:"Kännetecknet för imperfekt är <b>-bā-</b>: amā<b>ba</b>m, cantā<b>ba</b>t…",
        q:"Skriv imperfekt <b>'han sjöng'</b> av <b>cantāre</b>:",
        accept:["cantabat"], answerLabel:"cantābat",
        explain:"<b>-bā-</b> + <b>-t</b> = 3:e pers. imperfekt: <i>cantābat</i> = han sjöng / höll på att sjunga." },
      { type:"sententia", crit:"text", grade:"E", title:"Sententia: tre perfekt",
        la:"vēnī, vīdī, vīcī", ref:"Julius Caesar, 47 f.Kr.", sv:"jag kom, jag såg, jag segrade",
        note:"Caesars lakoniska segerrapport efter slaget vid Zela. Tre verb i perfekt.",
        q:"Vad uttrycker perfekt i <b>vīcī</b>?",
        options:["en avslutad handling (jag har segrat)","en pågående handling","framtid"], answer:0,
        explain:"Perfekt = avslutad handling: <i>vīcī</i> = jag har segrat. vincō → <i>vīcī</i> (oregelb.)." },
      { type:"translatio", crit:"text", grade:"A", title:"Översätt (A): tempusväxling",
        la:"silva clāmābat, sed Vergilius mē servāvit.",
        hint:"silva = skogen · clāmābat = ropade (impf.) · sed = men · servāvit = räddade (perf.)",
        assemblePrompt:"Bygg den svenska översättningen i rätt ordning:",
        solution:["Skogen","ropade,","men","Vergilius","räddade","mig"],
        explain:"<b>clāmābat</b> (impf, pågående) mot <b>servāvit</b> (perf, avslutad). servāre → <i>konservera, bevara</i>." }
    ]
  },

  /* ---------------------------------------------------------------- 8 fraud */
  {
    id:"fraud", roman:"Cīrculus VIII — Fraus", sv:"Åttonde kretsen — Bedrägeriet",
    subtitle:"Malebolge — de tio gravarna", focus:"Syntax · ordföljd & bisatser", art:"bolge",
    intro:{
      dante:"Malebolge: tio ringgravar av sten där bedragarna pinas — kopplare, smickrare, falska rådgivare, tjuvar. Ulysses brinner här, dömd för det trojanska sveket.",
      virgil:"Latinet är fritt i ordföljd eftersom <i>ändelserna</i> bär betydelsen. En bisats inleds ofta av <b>quī/quae/quod</b> (som) eller <b>cum</b> (när).",
      line:{ la:"timeō Danaōs et dōna ferentēs", ref:"Aeneiden 2,49",
             sv:"jag fruktar grekerna, även när de bär gåvor" }
    },
    challenges:[
      { type:"concept", crit:"concept", grade:"C", title:"Fri ordföljd",
        body:"Kasusändelsen visar rollen, så orden kan flyttas för betoning. <b>poēta puellam amat</b> och <b>puellam poēta amat</b> betyder båda 'skalden älskar flickan'. Verbet står ofta sist.",
        q:"I <b>puellam poēta amat</b>, vilket ord är objektet?",
        options:["poēta","puellam","amat"], answer:1,
        explain:"<b>puellam</b> (-m, ackusativ) är objektet oavsett att det står först. Ändelsen, inte platsen, bestämmer." },
      { type:"sententia", crit:"culture", grade:"C", title:"Sententia: den trojanska hästen",
        la:"timeō Danaōs et dōna ferentēs", ref:"Aeneiden 2,49",
        sv:"jag fruktar grekerna, även när de bär gåvor",
        note:"Prästen Laocoöns varning för trähästen — urbilden av en 'gåva' som är ett bedrägeri.",
        q:"Vad är sensmoralen?",
        options:["misstänk en alltför generös gåva","ge alltid gåvor","lita på grekerna"], answer:0,
        explain:"En 'danaergåva' = en gåva med baktanke. Ulysses, hästens upphovsman, straffas i denna krets." },
      { type:"translatio", crit:"text", grade:"C", title:"Red ut bisatsen",
        act:"Red ut bedragarnas vrängda ordföljd.",
        la:"Vergilius, quī Aenēam cecinit, viam mōnstrat.",
        hint:"quī = som · Aenēam = Aeneas (objekt) · cecinit = besjöng (perf.) · viam = vägen · mōnstrat = visar",
        assemblePrompt:"Bygg den svenska översättningen i rätt ordning:",
        solution:["Vergilius,","som","besjöng","Aeneas,","visar","vägen"],
        explain:"<b>quī...cecinit</b> är en relativsats som beskriver Vergilius: 'han som besjöng Aeneas' — dvs. Aeneiden." }
    ]
  },

  /* ---------------------------------------------------------------- 9 treachery */
  {
    id:"treachery", roman:"Cīrculus IX — Prōditiō", sv:"Nionde kretsen — Förräderiet",
    subtitle:"Cocytus, den frusna sjön — och Lucifer",
    focus:"BOSS · obligatorisk översättning av en äkta Aeneid-rad", art:"ice",
    intro:{
      dante:"Längst ner är inget eld, utan is. I den frusna sjön Cocytus sitter förrädarna instängda. I mitten maler Lucifer de tre värsta i sina tre gap. För att komma ut måste ni klättra nedför hans kropp.",
      virgil:"Detta är provet, discipule. Allt du lärt möter en enda rad ur min dikt. Återskapa den, så bär jag dig förbi Lucifer mot ljuset.",
      line:{ la:"tū nē cēde malīs, sed contrā audentior ītō", ref:"Aeneiden 6,95",
             sv:"vik inte för olyckorna, gå djärvare emot dem" }
    },
    challenges:[
      { type:"vocab", crit:"vocab", grade:"E", title:"Boss steg 1 — ord",
        q:"I <b>tū nē cēde malīs</b>: vad betyder <b>malīs</b>?",
        latin:"malum, malī (n.) = ont, olycka — här ablativ pluralis",
        options:["för olyckorna/det onda","för kungarna","för havet"], answer:0,
        explain:"<b>malīs</b> (abl. pl. av <i>malum</i>) — 'vik inte för olyckorna'. malum → <i>malis, malign</i>." },
      { type:"grammar", crit:"grammar", grade:"C", title:"Boss steg 2 — form",
        body:"<b>cēde</b> är imperativ ('vik!'). Med <b>nē</b> blir det en förbjudande uppmaning.",
        q:"<b>nē cēde</b> uttrycker:",
        options:["en fråga","ett förbud/en maning ('gör inte')","dåtid"], answer:1,
        explain:"<b>nē</b> + imperativ = negerad uppmaning: 'vik inte'. <b>ītō</b> (gå!) är högtidlig framtidsimperativ." },
      { type:"translatio", crit:"text", grade:"A", must:true, title:"BOSS — återskapa Vergilius rad",
        act:"Återskapa raden ord för ord, så som Vergilius skrev den — så bär han dig förbi Lucifer.",
        la:"tū nē cēde malīs, sed contrā audentior ītō.",
        hint:"tū=du · nē cēde=vik inte · malīs=för olyckorna · sed=men · contrā=emot · audentior=djärvare · ītō=gå!",
        assemblePrompt:"Lägg de latinska orden i Vergilius ordning:",
        solution:["tū","nē","cēde","malīs,","sed","contrā","audentior","ītō"],
        explain:"'Du, vik inte för olyckorna, utan gå djärvare emot dem.' — Aen. 6,95. Anchises ord till Aeneas i dödsriket: precis din egen resa. <i>audentior</i> hör ihop med <i>audentēs fortūna iuvat</i>." }
    ]
  },

  /* ---------------------------------------------------------------- exit */
  {
    id:"stelle", roman:"Ad Astra", sv:"Upp till stjärnorna",
    subtitle:"E quindi uscimmo a riveder le stelle", focus:"Avslutning · betygskompass", art:"stars", final:true,
    intro:{
      dante:"Ni klättrar nedför Lucifers sida, passerar jordens mittpunkt och börjar stiga. Genom en dold gång når ni till sist ut — och får återse himlen.",
      virgil:"Du har stigit ner och rest dig igen, discipule. Du läser nu enkel latin, känner kasusen, ser mina ord leva kvar i dina egna språk. Bär det vidare.",
      line:{ la:"forsan et haec ōlim meminisse iuvābit", ref:"Aeneiden 1,203",
             sv:"kanske skall det en dag glädja oss att minnas även detta" }
    },
    challenges:[
      { type:"sententia", crit:"influence", grade:"E", title:"Sista sententian",
        la:"per aspera ad astra", ref:"romerskt valspråk", sv:"genom svårigheter mot stjärnorna",
        note:"Dante slutar varje del av Komedin med ordet 'stelle' (stjärnor). Här slutar din nedstigning — och latinets <b>astra</b> lyser i många ord.",
        q:"<b>astrum/astra</b> = stjärna. Vilket ord bär verkligen stjärnan?",
        options:["disaster (dis-astrum, 'olycksstjärna')","katastrof (grek. kata+strophē, 'omvälvning')","asfalt"], answer:0,
        explain:"<i>disaster</i> = dis + astrum, 'olycksstjärna'. Katastrof är grekiska (omvälvning), INTE stjärna. astra lever i <i>astronom, astronaut, aster</i>." }
    ]
  }

  ]
};

if (typeof module !== "undefined") module.exports = INFERNO;
