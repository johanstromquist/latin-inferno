/* ============================================================================
   SAXA CADENTIA — nivådata
   Tecken: #=vägg  .=jord(gräv)  (blank)=tomt  @=start  X=port
           r=sten(faller/rullar)  *=runa(diamant)  A=altare(lämna runa)  ~=vatten
   Standardgrotta = jordfylld med tre runa+altare-par per rad (gräv → knuffa rätt
   runa in i altaret bredvid). Varje krets har en egen latin-drill (engine DRILL).
   ========================================================================== */

// jordfylld standardgrotta med 6 runa+altare-par
var CAVE=[
  "################",
  "#@............X#",
  "#..............#",
  "#.*A..*A..*A...#",
  "#..............#",
  "#.*A..*A..*A...#",
  "#..............#",
  "#..............#",
  "################"
];

const LUDUS_LEVELS = [

  { id:"selva", name:"Silva Obscura", sub:"Tutorial — gräv, knuffa, nå porten", tint:"#2a2113",
    intro:"Vergilius: Lär dig stigen. Pilarna (eller svep) gräver genom jorden. Knuffa stenen i sidled. Gräv fram till porten ↑.",
    drill:{ type:"tutorial" },
    grid:[
      "################",
      "#@..........X..#",
      "#..............#",
      "#......r.......#",
      "#..............#",
      "#..............#",
      "################"
    ] },

  { id:"porta", name:"Porta Īnferī", sub:"Verb · presens · personändelser", tint:"#241a12",
    intro:"Vergilius: Porten lyder den som böjer verbet rätt. Bär runan med rätt personändelse till altaret.",
    drill:{ type:"verbpres", count:3, lives:3 }, grid:CAVE },

  { id:"limbo", name:"Cīrculus I — Limbus", sub:"1:a deklinationen · kasus", tint:"#1c2418",
    intro:"Vergilius: Gräv fram, läs runornas ändelser och knuffa RÄTT runa in i altaret (◊) bredvid den. Bilda tre former.",
    drill:{ type:"decline1", count:3, lives:3 }, grid:CAVE },

  { id:"lust", name:"Cīrculus II — Luxuria", sub:"2:a deklinationen · genus", tint:"#1d1822",
    intro:"Vergilius: -us eller -um? Akta neutrum. Bär rätt 2:a-deklinationsändelse till altaret.",
    drill:{ type:"decline2", count:3, lives:3 }, grid:CAVE },

  { id:"glutt", name:"Cīrculus III — Gula", sub:"Verb · presens (Cerberus)", tint:"#161c20",
    intro:"Vergilius: Cerberus tystas av rätt personform. Bär runan med rätt ändelse till altaret.",
    drill:{ type:"verbpres", count:3, lives:3 }, grid:CAVE },

  { id:"greed", name:"Cīrculus IV — Avāritia", sub:"Kasus · genitiv & dativ", tint:"#241d14",
    intro:"Vergilius: Vem äger, vem får? Bär rätt genitiv- eller dativändelse till altaret.",
    drill:{ type:"casegd", count:3, lives:3 }, grid:CAVE },

  { id:"wrath", name:"Cīrculus V — Īra", sub:"Prepositioner + ablativ · STIGANDE STYX", tint:"#10171a",
    intro:"Vergilius: Styx stiger! Bär rätt ABLATIV-runa till altaret tre gånger — innan vattnet sväljer dig. Fel kostar liv.",
    drill:{ type:"ablative", count:3, lives:3, rising:true, riseEvery:26 },
    grid:[
      "################",
      "#@.....X.......#",
      "#..............#",
      "#.*A..*A..*A...#",
      "#..............#",
      "#.*A..*A..*A...#",
      "#..............#",
      "#..............#",
      "#~~~~~~~~~~~~~~#",
      "################"
    ] },

  { id:"heresy", name:"Cīrculus VI — Haeresis", sub:"Adjektiv · kongruens", tint:"#2a160f",
    intro:"Vergilius: Adjektivet rättar sig efter substantivets genus. Bär 'stor' i rätt form (magn‑?) till altaret.",
    drill:{ type:"agreement", count:3, lives:3 }, grid:CAVE },

  { id:"violence", name:"Cīrculus VII — Violentia", sub:"Tempus · imperfekt & perfekt", tint:"#1a140f",
    intro:"Vergilius: Pågående eller avslutat? Bär runan med rätt tempusändelse till altaret.",
    drill:{ type:"tense", count:3, lives:3 }, grid:CAVE },

  { id:"fraud", name:"Cīrculus VIII — Fraus", sub:"Syntax · satsdelar", tint:"#231a12",
    intro:"Vergilius: Ändelsen avslöjar rollen. I 'poēta puellam amat' — bär det efterfrågade ordet till altaret.",
    drill:{ type:"order", count:3, lives:3 }, grid:CAVE },

  { id:"treachery", name:"Cīrculus IX — Prōditiō", sub:"BOSS · Vergilius rad", tint:"#16202a",
    intro:"Vergilius: Min rad, Aen. 6,95: tū nē cēde malīs. Bär ordet jag ber om till altaret.",
    drill:{ type:"boss", count:3, lives:3 }, grid:CAVE },

  { id:"stelle", name:"Ad Astra", sub:"Fri träning · 1:a deklinationen", tint:"#0e1530",
    intro:"Vergilius: Du ser stjärnorna. Träna fritt — bär rätt kasusändelse till altaret.",
    drill:{ type:"decline1", count:3, lives:3 }, grid:CAVE }

];

if (typeof module !== "undefined") module.exports = LUDUS_LEVELS;
