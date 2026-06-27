/* ============================================================================
   SAXA CADENTIA — nivådata
   Tecken: #=vägg  .=jord  (blank)=tomt  @=start  X=port
           r=sten  *=runa  A=altare  ~=vatten   B=byggruta (ordbygge)
   Par = [runaX, runaY, gap]: altaret står 'gap'+1 rutor till HÖGER om runan, med
   jord emellan — gräv tunneln och TRANSPORTERA runan dit (knuffa i sidled). gap=0
   ger granne (bara intro-/nya-koncept-kretsar). Större gap + stenar = svårare puss.
   ========================================================================== */
function buildCave(W,H,o){
  var fill=o.open?" ":".";   // open=öppen arena (boss); annars jordfylld
  var g=[]; for(var y=0;y<H;y++){ var row=[]; for(var x=0;x<W;x++){
    row.push((x===0||x===W-1||y===0||y===H-1)?"#":fill); } g.push(row); }
  function set(p,c){ g[p[1]][p[0]]=c; }
  (o.walls||[]).forEach(function(p){ set(p,"#"); });
  if(o.water!=null) for(var x=1;x<W-1;x++) g[o.water][x]="~";
  if(o.tunnel!=null) for(var tx=1;tx<W-1;tx++) g[o.tunnel][tx]=" ";       // skuggans tunnel (öppen rad)
  (o.shafts||[]).forEach(function(c){ for(var sy=1;sy<=(o.tunnel||1);sy++) g[sy][c]=" "; }); // istapps-schakt
  (o.pairs||[]).forEach(function(p){ var gx=p[0],gy=p[1],gap=p[2]||0; g[gy][gx]="*"; g[gy][gx+gap+1]="A"; });
  (o.builds||[]).forEach(function(p){ g[p[1]][p[0]]="B"; });   // byggrutor
  (o.runes||[]).forEach(function(p){ g[p[1]][p[0]]="*"; });    // lösa runor (bygge)
  (o.rocks||[]).forEach(function(p){ set(p,"r"); });
  (o.enemies||[]).forEach(function(p){ set(p,"E"); });         // skuggor
  set(o.start,"@"); set(o.exit,"X");
  return g.map(function(r){ return r.join(""); });
}

const LUDUS_LEVELS = [

  { id:"selva", name:"Silva Obscura", sub:"Tutorial — gräv, knuffa, nå porten", tint:"#2a2113",
    intro:"Vergilius: Lär dig stigen. Pilarna (eller svep) gräver genom jorden. Knuffa stenen i sidled. Gräv fram till porten ↑.",
    drill:{ type:"tutorial" },
    grid:buildCave(16,6,{ start:[1,1], exit:[12,1], rocks:[[7,3]] }) },

  { id:"porta", name:"Porta Īnferī", sub:"Verb · presens · personändelser", tint:"#241a12",
    intro:"Vergilius: Porten lyder den som böjer verbet rätt. Bär runan med rätt personändelse till altaret.",
    drill:{ type:"verbpres", count:3, lives:3, reveal:true },   // INTRO: korta knuffar (gap 1)
    grid:buildCave(16,8,{ start:[1,1], exit:[14,1],
      pairs:[[2,3,1],[8,3,1],[12,3,0],[2,5,1],[8,5,1],[12,5,0]] }) },

  { id:"limbo", name:"Cīrculus I — Limbus", sub:"1:a deklinationen · kasus", tint:"#1c2418",
    intro:"Vergilius: Gräv fram, läs runornas ändelser och TRANSPORTERA rätt runa till altaret (◊). Bilda tre former.",
    drill:{ type:"decline1", count:3, lives:3, reveal:true },   // INTRO-koncept: gap 1
    grid:buildCave(16,7,{ start:[1,1], exit:[14,1],
      pairs:[[2,3,1],[7,3,1],[11,3,1],[3,5,1],[8,5,1],[12,5,0]] }) },

  { id:"lust", name:"Cīrculus II — Luxuria", sub:"2:a deklinationen · genus", tint:"#1d1822",
    intro:"Vergilius: -us eller -um? Akta neutrum. Gräv tunneln och transportera rätt runa hela vägen till altaret.",
    drill:{ type:"decline2", count:3, lives:3 },   // längre knuffar
    grid:buildCave(16,9,{ start:[1,1], exit:[14,7],
      pairs:[[2,2,4],[2,4,4],[2,6,4],[9,3,3],[9,5,3],[9,7,3]] }) },

  { id:"glutt", name:"Cīrculus III — Gula", sub:"Verb · presens (Cerberus)", tint:"#161c20",
    intro:"Vergilius: Cerberus tre strupar. Knuffa rätt personformsruna genom gångarna till ett altare.",
    drill:{ type:"verbpres", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,1],
      walls:[[6,3],[6,4],[6,5],[10,3],[10,4],[10,5]],
      pairs:[[2,3,2],[12,3,1],[2,6,3],[7,6,3],[12,6,1],[7,2,1]] }) },

  { id:"greed", name:"Cīrculus IV — Avāritia", sub:"Kasus · genitiv & dativ", tint:"#241d14",
    intro:"Vergilius: Vem äger, vem får? Transportera rätt runa förbi de tunga stenarna till altaret.",
    drill:{ type:"casegd", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,1],
      rocks:[[5,2],[9,2],[12,2],[5,5],[9,5]],
      pairs:[[2,3,3],[9,3,4],[2,6,3],[8,6,4],[2,7,2],[12,7,1]] }) },

  { id:"wrath", name:"Cīrculus V — Īra", sub:"Prepositioner + ablativ · STIGANDE STYX", tint:"#10171a",
    intro:"Vergilius: Styx stiger! Transportera rätt ABLATIV-runa till ett altare tre gånger — innan vattnet sväljer dig. Fel kostar liv.",
    drill:{ type:"ablative", count:3, lives:3, rising:true, riseEvery:26, reveal:true },   // NYTT koncept + vatten: gap 1
    grid:buildCave(16,10,{ start:[1,1], exit:[6,1],
      pairs:[[2,3,1],[7,3,1],[11,3,1],[2,5,1],[7,5,1],[11,5,1]] }) },

  { id:"heresy", name:"Cīrculus VI — Haeresis", sub:"Adjektiv · kongruens", tint:"#2a160f",
    intro:"Vergilius: Adjektivet rättar sig efter genus. Transportera 'stor' i rätt form (magn‑?) genom pelarna till altaret.",
    drill:{ type:"agreement", count:3, lives:3 },   // långa knuffar + pelare
    grid:buildCave(16,9,{ start:[1,1], exit:[14,7],
      walls:[[8,2],[8,5],[8,6]],
      pairs:[[2,3,5],[2,6,5],[10,3,3],[10,6,3],[2,2,3],[9,7,2]] }) },

  { id:"violence", name:"Cīrculus VII — Violentia", sub:"Tempus · imperfekt & perfekt", tint:"#1a140f",
    intro:"Vergilius: Pågående eller avslutat? Transportera rätt tempusruna — men stenarna faller om du gräver under dem.",
    drill:{ type:"tense", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,1], enemies:[[8,5]],
      rocks:[[4,2],[8,2],[11,2],[6,4],[10,4]],
      pairs:[[2,4,3],[9,4,3],[2,6,3],[7,6,3],[12,6,1],[2,7,2]] }) },

  { id:"fraud", name:"Cīrculus VIII — Fraus", sub:"Syntax · BYGG satsen", tint:"#231a12",
    intro:"Vergilius: Bygg satsen 'poēta puellam amat' — knuffa ord-runorna så de står i RAD i rätt ordning.",
    drill:{ type:"order", count:3, lives:3, build:true },
    // BYGG: knuffa ord-runorna så de står i RAD i rätt ordning (var som helst).
    grid:buildCave(16,8,{ start:[1,1], exit:[14,1],
      runes:[[3,3],[6,3],[9,3],[12,3],[5,4],[10,4]] }) },

  { id:"treachery", name:"Cīrculus IX — Prōditiō", sub:"BOSS · Lucifer · bygg Vergilius rad", tint:"#16202a",
    intro:"Vergilius: Lucifer reser sig ur isen. Bygg min rad på golvet — tū nē cēde malīs — i RAD, medan han slungar istappar och en skugga jagar. Vik inte för olyckorna!",
    drill:{ type:"boss", count:4, lives:4, build:true },
    boss:"Lucifer", icicleEvery:16,
    // regelrätt jordkarta: gräv & bygg satsen; skuggan patrullerar tunneln (rad 5),
    // Lucifer slungar istappar ner i schakten (kol 4, 8, 11).
    grid:buildCave(16,10,{ start:[1,1], exit:[14,1],
      tunnel:5, shafts:[4,8,11], enemies:[[7,5]],
      runes:[[2,2],[6,2],[10,2],[13,2],[2,7],[6,7],[10,7],[13,7]] }) },

  { id:"stelle", name:"Ad Astra", sub:"Fri träning · 1:a deklinationen", tint:"#0e1530",
    intro:"Vergilius: Du ser stjärnorna. Träna fritt — transportera rätt kasusruna till altaret.",
    drill:{ type:"decline1", count:3, lives:3 },
    grid:buildCave(16,8,{ start:[1,1], exit:[14,6],
      pairs:[[3,2,2],[10,2,2],[2,4,3],[9,4,3],[3,6,2],[11,6,1]] }) }

];

if (typeof module !== "undefined") module.exports = LUDUS_LEVELS;
