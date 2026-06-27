/* ============================================================================
   SAXA CADENTIA — nivådata
   Tecken: #=vägg  .=jord(gräv)  (blank)=tomt  @=start  X=port
           r=sten(faller/rullar)  *=runa(diamant)  A=altare(lämna runa)  ~=vatten
   Varje krets har en EGEN grotta (buildCave) + en egen latin-drill (engine DRILL).
   Ett par = en runa (*) med ett altare (A) direkt till höger — gräv till runan,
   knuffa den ett steg höger in i altaret.
   ========================================================================== */

// Bygger en jordfylld grotta med exakt bredd. Placerar par, stenar, vatten.
function buildCave(W,H,o){
  var g=[]; for(var y=0;y<H;y++){ var row=[]; for(var x=0;x<W;x++){
    row.push((x===0||x===W-1||y===0||y===H-1)?"#":"."); } g.push(row); }
  function set(p,c){ g[p[1]][p[0]]=c; }
  (o.walls||[]).forEach(function(p){ set(p,"#"); });
  if(o.water!=null) for(var x=1;x<W-1;x++) g[o.water][x]="~";
  (o.pairs||[]).forEach(function(p){ g[p[1]][p[0]]="*"; g[p[1]][p[0]+1]="A"; });
  (o.rocks||[]).forEach(function(p){ set(p,"r"); });
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
    drill:{ type:"verbpres", count:3, lives:3 },
    grid:buildCave(16,8,{ start:[1,1], exit:[14,1],
      walls:[[5,3],[10,3],[5,5],[10,5]],
      pairs:[[2,3],[12,3],[2,5],[12,5],[7,2],[7,6]] }) },

  { id:"limbo", name:"Cīrculus I — Limbus", sub:"1:a deklinationen · kasus", tint:"#1c2418",
    intro:"Vergilius: Gräv fram, läs runornas ändelser och knuffa RÄTT runa in i altaret (◊). Bilda tre former.",
    drill:{ type:"decline1", count:3, lives:3 },
    grid:buildCave(16,7,{ start:[1,1], exit:[14,1],
      pairs:[[3,3],[8,3],[12,3],[3,5],[8,5],[12,5]] }) },

  { id:"lust", name:"Cīrculus II — Luxuria", sub:"2:a deklinationen · genus", tint:"#1d1822",
    intro:"Vergilius: -us eller -um? Akta neutrum. Bär rätt 2:a-deklinationsändelse till altaret.",
    drill:{ type:"decline2", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,7],
      pairs:[[2,2],[11,2],[6,4],[2,6],[11,6],[6,3]] }) },

  { id:"glutt", name:"Cīrculus III — Gula", sub:"Verb · presens (Cerberus)", tint:"#161c20",
    intro:"Vergilius: Cerberus tre strupar tystas av rätt personform. Bär runan med rätt ändelse till altaret.",
    drill:{ type:"verbpres", count:3, lives:3 },
    grid:buildCave(16,8,{ start:[1,1], exit:[14,6],
      walls:[[6,2],[9,2],[6,3],[9,3]],
      pairs:[[2,2],[12,2],[2,5],[7,5],[12,5],[4,6]] }) },

  { id:"greed", name:"Cīrculus IV — Avāritia", sub:"Kasus · genitiv & dativ", tint:"#241d14",
    intro:"Vergilius: Vem äger, vem får? Bär rätt genitiv- eller dativändelse till altaret. Akta de tunga stenarna.",
    drill:{ type:"casegd", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,1],
      rocks:[[4,2],[9,2],[12,2],[7,4],[3,4]],
      pairs:[[2,5],[6,5],[10,5],[3,7],[8,7],[12,7]] }) },

  { id:"wrath", name:"Cīrculus V — Īra", sub:"Prepositioner + ablativ · STIGANDE STYX", tint:"#10171a",
    intro:"Vergilius: Styx stiger! Bär rätt ABLATIV-runa till altaret tre gånger — innan vattnet sväljer dig. Fel kostar liv.",
    drill:{ type:"ablative", count:3, lives:3, rising:true, riseEvery:26 },
    grid:buildCave(16,10,{ start:[1,1], exit:[6,1],
      pairs:[[2,3],[7,3],[12,3],[2,5],[7,5],[12,5]] }) },

  { id:"heresy", name:"Cīrculus VI — Haeresis", sub:"Adjektiv · kongruens", tint:"#2a160f",
    intro:"Vergilius: Adjektivet rättar sig efter genus. Bär 'stor' i rätt form (magn‑?) till altaret.",
    drill:{ type:"agreement", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,7],
      walls:[[4,4],[7,4],[10,4]],
      pairs:[[2,3],[8,3],[12,3],[2,6],[6,6],[11,6]] }) },

  { id:"violence", name:"Cīrculus VII — Violentia", sub:"Tempus · imperfekt & perfekt", tint:"#1a140f",
    intro:"Vergilius: Pågående eller avslutat? Bär runan med rätt tempusändelse till altaret. Stenarna faller.",
    drill:{ type:"tense", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,1],
      rocks:[[3,2],[7,2],[11,2],[5,5],[9,5]],
      pairs:[[2,4],[7,4],[12,4],[3,7],[8,7],[12,7]] }) },

  { id:"fraud", name:"Cīrculus VIII — Fraus", sub:"Syntax · satsdelar", tint:"#231a12",
    intro:"Vergilius: Ändelsen avslöjar rollen. I 'poēta puellam amat' — bär det efterfrågade ordet till altaret.",
    drill:{ type:"order", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,7],
      walls:[[3,4],[12,4],[6,2],[9,6]],
      pairs:[[5,2],[10,2],[2,4],[7,4],[5,6],[11,6]] }) },

  { id:"treachery", name:"Cīrculus IX — Prōditiō", sub:"BOSS · Vergilius rad", tint:"#16202a",
    intro:"Vergilius: Min rad, Aen. 6,95: tū nē cēde malīs. Bär ordet jag ber om till altaret.",
    drill:{ type:"boss", count:3, lives:3 },
    grid:buildCave(16,9,{ start:[1,1], exit:[14,1],
      walls:[[7,3],[8,3],[7,4],[8,4],[7,5],[8,5]],
      pairs:[[2,3],[11,3],[4,6],[9,6],[2,7],[12,7]] }) },

  { id:"stelle", name:"Ad Astra", sub:"Fri träning · 1:a deklinationen", tint:"#0e1530",
    intro:"Vergilius: Du ser stjärnorna. Träna fritt — bär rätt kasusändelse till altaret.",
    drill:{ type:"decline1", count:3, lives:3 },
    grid:buildCave(16,8,{ start:[1,1], exit:[14,6],
      pairs:[[3,2],[10,2],[6,4],[12,4],[2,6],[8,6]] }) }

];

if (typeof module !== "undefined") module.exports = LUDUS_LEVELS;
