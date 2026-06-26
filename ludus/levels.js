/* ============================================================================
   SAXA CADENTIA — nivådata (Steg 2: visuella nivåer, platshållarmekanik)
   Tecken i grid:
     #=mur  .=grus(gräv)  (mellanslag)=luft  @=spelarstart  X=utgång
     O=lös sten (faller)  S=altarslott (leverera hit)  E=fiende  ~=vatten
     *=fragmentsten (bär en latinsk ändelse; etiketter sätts av drill-poolen)
   drill: vilken paradigm kammaren övar (formgenerator i engine, Steg 4).
   ========================================================================== */

const LUDUS_LEVELS = [

  { id:"selva", name:"Silva Obscura", sub:"Tutorial — rörelse, gräv, lykta", tint:"#2a2113",
    intro:"Vergilius: Lär dig stigen, viātor. Piltangenter (eller svep) rör dig; gräv genom gruset; min lykta lyser vägen. Nå porten.",
    drill:{ type:"tutorial" },
    grid:[
      "################",
      "#@.....#.......#",
      "#..###.#.###...#",
      "#..#...........#",
      "#..#.####.###..#",
      "#.....#.....#..#",
      "#.###.#.###.#..#",
      "#...........#.X#",
      "################"
    ]
  },

  { id:"porta", name:"Porta Īnferī", sub:"Subjekt + verb", tint:"#241a12",
    intro:"Vergilius: Leverera verbet till subjektet — bilda en mening.",
    drill:{ type:"sentence", count:3 },
    grid:[
      "################",
      "#@....O....*...#",
      "#..####..####..#",
      "#..............#",
      "#..*...O....O..#",
      "#..####..####..#",
      "#.........S...X#",
      "################"
    ]
  },

  { id:"limbo", name:"Cīrculus I — Limbus", sub:"1:a deklinationen · kasus", tint:"#1c2418",
    intro:"Vergilius: Altaret kräver en form. Läs ändelserna, knuffa RÄTT sten i slotten bredvid den. Bilda fem ord.",
    drill:{ type:"decline1", pool:["rosa","via","puella","terra","aqua","stella","vīta"], count:5 },
    // Tre sten+slott-par (*S). Övre korridoren är fri (gå runt). Knuffa rätt sten höger i slotten.
    grid:[
      "################",
      "#@            X#",
      "#              #",
      "#  *S   *S   *S#",
      "################"
    ]
  },

  { id:"lust", name:"Cīrculus II — Luxuria", sub:"2:a dekl. + genus · VIND", tint:"#1d1822",
    intro:"Vergilius: Stormen knuffar stenarna. Tajma leveransen; akta neutrum.",
    drill:{ type:"decline2", pool:["dominus","servus","amīcus","templum","bellum","dōnum"], count:5 },
    grid:[
      "################",
      "#@..*...*...*..#",
      "#..............#",
      "#.O..O..O..O..O#",
      "#..............#",
      "#..*....*...*..#",
      "#.....S......X.#",
      "################"
    ]
  },

  { id:"glutt", name:"Cīrculus III — Gula", sub:"Verb presens · CERBERUS (3 mål)", tint:"#161c20",
    intro:"Vergilius: Cerberus tre strupar kräver var sin personform. Mata alla tre innan han lungar.",
    drill:{ type:"verbpres", pool:["amāre","mōnstrāre","cantāre","servāre"], count:3 },
    grid:[
      "################",
      "#@..*..*..*..*.#",
      "#.####.##.####.#",
      "#...O......O...#",
      "#S####.##.####S#",
      "#......S.......#",
      "#..E....E....E.#",
      "#............#X#",
      "################"
    ]
  },

  { id:"greed", name:"Cīrculus IV — Avāritia", sub:"Genitiv & dativ · TUNG STEN", tint:"#241d14",
    intro:"Vergilius: Här är stenen hopad och tung. Röj väg utan att krossas.",
    drill:{ type:"casegd", pool:["rēgīna","poēta","domina"], count:6 },
    grid:[
      "################",
      "#@OOO.*.OOO.*..#",
      "#.OO.....OO....#",
      "#..*.OOO..*.OO.#",
      "#.OO..*..OO....#",
      "#.....S......X.#",
      "################"
    ]
  },

  { id:"wrath", name:"Cīrculus V — Īra", sub:"Prepositioner + ablativ · STIGANDE STYX", tint:"#10171a",
    intro:"Vergilius: Styx stiger. Knuffa rätt ablativ-sten i slotten — fyra gånger — innan det svarta vattnet når dig. Fel kostar liv.",
    drill:{ type:"ablative", count:3, lives:3, rising:true, riseEvery:9 },
    // stenarna vilar på pelare (raden under dem); vattnet stiger i luftspalterna mellan
    grid:[
      "############",
      "#@        X#",
      "# *S *S *S #",
      "# #  #  #  #",
      "#          #",
      "#~~~~~~~~~~#",
      "############"
    ]
  },

  { id:"heresy", name:"Cīrculus VI — Haeresis", sub:"Adjektiv + kongruens · 2 slots", tint:"#2a160f",
    intro:"Vergilius: Leverera substantiv OCH ett adjektiv som kongruerar i genus.",
    drill:{ type:"agreement", pool:["rēgīna","dominus","bellum"], count:4 },
    grid:[
      "################",
      "#@..*...*...*..#",
      "#.####.##.###.#",
      "#....O.....O..#",
      "#..*....*...*.#",
      "#.SS.........X#",
      "################"
    ]
  },

  { id:"violence", name:"Cīrculus VII — Violentia", sub:"Tempus · MINOTAUROS jagar", tint:"#1a140f",
    intro:"Vergilius: Minotauros patrullerar. Lura honom under en sten. Leverera rätt tempus.",
    drill:{ type:"tense", pool:["amāre","cantāre","servāre"], count:5 },
    grid:[
      "################",
      "#@..*...*...*..#",
      "#.####.##.####.#",
      "#...O.. ..O....#",
      "#..*..E....*...#",
      "#.####.##.####.#",
      "#......S.....X.#",
      "################"
    ]
  },

  { id:"fraud", name:"Cīrculus VIII — Fraus", sub:"Syntax · ORDNINGS-slots", tint:"#231a12",
    intro:"Vergilius: Lägg ord-stenarna i RÄTT ORDNING i raden av slots. Marken vränger sig.",
    drill:{ type:"order", count:2 },
    grid:[
      "################",
      "#@..*..*..*..*.#",
      "#..............#",
      "#..*..*..*..*..#",
      "#..............#",
      "#.SSSSSS......X#",
      "################"
    ]
  },

  { id:"treachery", name:"Cīrculus IX — Prōditiō", sub:"BOSS · SJUNKANDE ISTAK", tint:"#16202a",
    intro:"Vergilius: Återskapa min rad innan istaket pressar ner. Tū nē cēde malīs…",
    drill:{ type:"boss", line:["tū","nē","cēde","malīs,","sed","contrā","audentior","ītō"] },
    grid:[
      "################",
      "#@.*.*.*.*.*.*.#",
      "#..............#",
      "#.*.*.*.*.*.*..#",
      "#..............#",
      "#.SSSSSSSS....X#",
      "################"
    ]
  },

  { id:"stelle", name:"Ad Astra", sub:"Seger · fri träning", tint:"#0e1530",
    intro:"Vergilius: Du ser stjärnorna igen. Träna fritt, eller vila.",
    drill:{ type:"free" },
    grid:[
      "################",
      "#@............X#",
      "#....*....*....#",
      "#..............#",
      "#....*....*....#",
      "#......S.......#",
      "################"
    ]
  }

];

if (typeof module !== "undefined") module.exports = LUDUS_LEVELS;
