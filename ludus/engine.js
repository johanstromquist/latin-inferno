/* ============================================================================
   SAXA CADENTIA — Boulder-Dash-motor (omarbetad)
   Grottor FYLLDA med jord som du gräver dig genom; stenar (r) faller OCH rullar;
   run-juveler (*) bär latinska ändelser och är "diamanterna" du samlar; bär rätt
   runa till ALTARET (A). Sprites laddas från sprites/ med tydlig procedurell
   reserv. Tydliga mål: stor måltavla, teckenförklaring, tutorial, lyktans ljus.
   Tiles: # vägg · . jord · (blank) tomt · r sten · * runa · A altare · X port · ~ vatten · @ start
   ========================================================================== */
(function(){
"use strict";

var TS=48;
var canvas, ctx, level, grid, W, H, px, py, levelIdx=0;
var labels={}, task=null, progress=0, needed=3, streak=0, cleared=false, settling=false, origGem=[];
var vitae=3, wmoves=0, facing=1;
var falling={}, tickTimer=null, wtick=0, dead=false;
var buildSlots=[], built=[], builtWord={};
var hover=null, hintOn=true;
var enemies=[], enemyCounter=0, icicleCounter=0;

/* ---------- sprites ---------- */
var SPRITE_FILES=["dirt","wall","boulder","rune","altar","water","gate-closed","gate-open","dante","shade","lucifer","icicle","minotaur","ice-dirt","ice-wall"];
var IMG={};
SPRITE_FILES.forEach(function(n){ var im=new Image();
  im.onload=function(){ IMG[n]=im; if(grid) render(); }; im.src="sprites/"+n+".png"; });

var C={ wall:"#241d17", wallEdge:"#3a2e22", dirt:"#3a2a18", dirtDot:"#2a1d10", air:"#0b0907",
  stone:"#5d564d", stoneHi:"#7a7068", rune:"#caa24a", runeCore:"#f0d68a", runeInk:"#241704",
  altar:"#b9892f", altarGlow:"rgba(231,200,120,.5)", water:"#16323f", waterHi:"#3b6a82",
  dante:"#9a2b2b", danteHood:"#c83b3b", exit:"#e7c878" };

function el(id){ return document.getElementById(id); }
function k(x,y){ return x+","+y; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;} return a; }
function inB(x,y){ return x>=0&&y>=0&&x<W&&y<H; }

/* ---------- ladda nivå ---------- */
function loadLevel(i){
  levelIdx=i; level=LUDUS_LEVELS[i];
  try{ localStorage.setItem("ludus_level", i); }catch(e){}   // kom ihåg nivå vid refresh
  grid=level.grid.map(function(r){ return r.split(""); });
  H=grid.length; W=Math.max.apply(null,grid.map(function(r){return r.length;}));
  grid.forEach(function(r){ while(r.length<W) r.push(r[r.length-1]); });
  labels={}; progress=0; streak=0; cleared=false; task=null; origGem=[];
  vitae=(level.drill&&level.drill.lives)||3; wmoves=0; facing=1;
  needed=(level.drill&&level.drill.count)||3;
  buildSlots=[]; built=[]; builtWord={}; enemies=[]; enemyCounter=0; icicleCounter=0;
  for(var y=0;y<H;y++) for(var x=0;x<W;x++){
    var ch=grid[y][x];
    if(ch==="O") grid[y][x]="r"; else if(ch==="S") grid[y][x]="A";   // alias gamla platshållarnivåer
    if(grid[y][x]==="@"){ px=x; py=y; grid[y][x]=" "; }
    if(grid[y][x]==="*") origGem.push([x,y]);
    if(grid[y][x]==="B") buildSlots.push([x,y]);
    if(grid[y][x]==="E") enemies.push({x:x,y:y,dir:1});
  }
  buildSlots.sort(function(a,b){ return (a[1]-b[1])||(a[0]-b[0]); });   // ordning: rad, sedan kolumn
  canvas.width=W*TS; canvas.height=H*TS;
  document.body.style.setProperty("--tint",level.tint);
  el("ludus-title").textContent=level.name;
  el("ludus-sub").textContent=level.sub;
  el("ludus-intro").textContent=level.intro;
  el("ludus-streak").textContent=streak; updateHearts();
  buildLegend(); setupBoss();
  assignGemEndings();                 // fasta ändelser, sätts en gång
  dead=false; settle();
  nextTask(); render(); startTick();
}

/* ---------- latin-drillregister ----------
   Varje runa bär en FAST token (ändelse eller ord), sätts en gång och FÖRSVINNER
   när den levereras. Uppgiften väljs bland tokens som fortfarande finns i grottan.
   Varje drill: pool (tokens), word (visa ord utan bindestreck), gen(living)→{tip,goal,full}. */
var DRILL={
  decline1:{ pool:["a","am","ae","ā","ō","um","ās","īs"],
    gen:function(L){ var c=[["nominativ","a"],["ackusativ","am"],["genitiv","ae"],["dativ","ae"],["ablativ","ā"]].filter(function(x){return L.indexOf(x[1])>=0;});
      if(!c.length)return null; var p=pick(c), n=pick(["rosa","via","puella","terra","aqua","stella","vīta"]), s=n.replace(/[aā]$/,"");
      return {tip:n+"‑ → "+p[0]+(p[1]==="ae"?" (gen=dat)":""), goal:p[1], full:s+p[1]}; } },
  decline2:{ pool:["us","um","ī","ō","ōrum","īs"],
    gen:function(L){ var ns=[{w:"dominus",g:"m"},{w:"servus",g:"m"},{w:"amīcus",g:"m"},{w:"templum",g:"n"},{w:"bellum",g:"n"},{w:"dōnum",g:"n"}];
      var cl=[["nom.",function(o){return o.g==="m"?"us":"um";}],["ack.",function(o){return "um";}],["gen.",function(){return "ī";}],["dat.",function(){return "ō";}],["abl.",function(){return "ō";}]];
      var opt=[]; ns.forEach(function(o){ cl.forEach(function(c){ var e=c[1](o); if(L.indexOf(e)>=0) opt.push({o:o,c:c[0],e:e}); }); });
      if(!opt.length)return null; var p=pick(opt), s=p.o.w.replace(/(us|um)$/,"");
      return {tip:p.o.w+" ("+(p.o.g)+".) → "+p.c, goal:p.e, full:s+p.e}; } },
  ablative:{ pool:["ā","ō","ā","ō","am","um"],   // minst 3 levererbara (ā/ō) för needed=3
    gen:function(L){ var ns=[{w:"aqua",e:"ā"},{w:"silva",e:"ā"},{w:"via",e:"ā"},{w:"umbra",e:"ā"},{w:"servus",e:"ō"},{w:"dominus",e:"ō"},{w:"templum",e:"ō"}].filter(function(o){return L.indexOf(o.e)>=0;});
      if(!ns.length)return null; var x=pick(ns), p=pick(["in","cum","sine","ē"]), s=x.w.replace(/(us|um|a)$/,"");
      return {tip:p+" "+x.w+" → ablativ", goal:x.e, full:p+" "+s+x.e}; } },
  verbpres:{ pool:["ō","ās","at","āmus","ātis","ant"],
    gen:function(L){ var per=[["jag","ō"],["du","ās"],["hon/han","at"],["vi","āmus"],["ni","ātis"],["de","ant"]].filter(function(p){return L.indexOf(p[1])>=0;});
      if(!per.length)return null; var v=pick(["amāre","mōnstrāre","cantāre","servāre"]), p=pick(per), s=v.replace(/āre$/,"");
      return {tip:v+" → "+p[0]+" (presens)", goal:p[1], full:s+p[1]}; } },
  casegd:{ pool:["ae","ī","ō","am","um"],
    gen:function(L){ var ns=[{w:"rēgīna",gen:"ae",dat:"ae",s:"rēgīn"},{w:"poēta",gen:"ae",dat:"ae",s:"poēt"},{w:"dominus",gen:"ī",dat:"ō",s:"domin"},{w:"servus",gen:"ī",dat:"ō",s:"serv"}];
      var opt=[]; ns.forEach(function(o){ if(L.indexOf(o.gen)>=0)opt.push({o:o,c:"genitiv",e:o.gen}); if(L.indexOf(o.dat)>=0)opt.push({o:o,c:"dativ",e:o.dat}); });
      if(!opt.length)return null; var p=pick(opt);
      return {tip:p.o.w+" → "+p.c, goal:p.e, full:p.o.s+p.e}; } },
  agreement:{ pool:["us","a","um","ae","ō"],
    gen:function(L){ var ns=[{w:"rēgīna",g:"a"},{w:"domina",g:"a"},{w:"dominus",g:"us"},{w:"servus",g:"us"},{w:"bellum",g:"um"},{w:"templum",g:"um"}].filter(function(o){return L.indexOf(o.g)>=0;});
      if(!ns.length)return null; var o=pick(ns), gl=o.g==="us"?"m":o.g==="a"?"f":"n";
      return {tip:o.w+" ("+gl+".) + 'stor' → magn‑?", goal:o.g, full:"magn"+o.g}; } },
  tense:{ pool:["at","ābat","āvit","ēbat","uit"],
    gen:function(L){ var ts=[["presens","at"],["imperfekt","ābat"],["perfekt","āvit"]].filter(function(t){return L.indexOf(t[1])>=0;});
      if(!ts.length)return null; var v=pick(["cantāre","amāre","servāre","mōnstrāre"]), t=pick(ts), s=v.replace(/āre$/,"");
      return {tip:v+" → "+t[0]+" (han)", goal:t[1], full:s+t[1]}; } },
  order:{ word:true, build:true, seq:["poēta","puellam","amat"], distract:["Amor","est"],
    gen:function(){ return null; } },          // BYGG-läge: bygg satsen i ordning
  boss:{ word:true, build:true, seq:["tū","nē","cēde","malīs"], distract:["sed","ferō"],
    gen:function(){ return null; } }
};
function isImplemented(ty){ return !!DRILL[ty]; }
function isWordDrill(){ return level.drill && DRILL[level.drill.type] && DRILL[level.drill.type].word; }
function drillTargets(d){   // vilka tokens kan gen faktiskt be om? (probning)
  var set={}; for(var i=0;i<60;i++){ var t=d.gen(d.pool.slice()); if(t) set[t.goal]=1; } return Object.keys(set);
}
function assignGemEndings(){
  if(!level.drill||!isImplemented(level.drill.type)) return;
  var d=DRILL[level.drill.type], n=origGem.length, list=[];
  if(d.build){ list=d.seq.slice(); var dd=d.distract||[], di=0;     // varje satsord finns + distraktorer
    while(list.length<n){ list.push(dd.length?dd[di%dd.length]:d.seq[di%d.seq.length]); di++; } }
  else { var tg=drillTargets(d), pool=d.pool;
    for(var i=0;i<Math.min(n,needed+1)&&tg.length;i++) list.push(tg[i%tg.length]);
    while(list.length<n) list.push(pool[list.length%pool.length]); }
  list=shuffle(list); var pos=shuffle(origGem.slice()); labels={};
  pos.forEach(function(p,i){ labels[k(p[0],p[1])]=list[i]; });   // token utan bindestreck
}
function livingEndings(){ var set={}; for(var y=0;y<H;y++)for(var x=0;x<W;x++) if(grid[y][x]==="*"){ var e=labels[k(x,y)]; if(e) set[e]=1; } return Object.keys(set); }
function genTask(d, living){ if(!d||!DRILL[d.type]) return null; return DRILL[d.type].gen(living); }
function bestBuildRun(){   // längsta rad av runor som matchar satsens början (var som helst)
  if(!task||!task.build) return 0; var seq=task.seq, best=0;
  for(var y=0;y<H;y++) for(var x=0;x<W;x++){
    var run=0; while(x+run<W && run<seq.length && grid[y][x+run]==="*" && labels[k(x+run,y)]===seq[run]) run++;
    if(run>best) best=run;
  }
  return best;
}
function checkBuild(){ if(cleared||!task||!task.build) return; if(bestBuildRun()===task.seq.length) levelClear(); }
function nextTask(){
  var d=level.drill;
  if(d && DRILL[d.type] && DRILL[d.type].build){      // BYGG-läge: lägg orden i RAD i ordning
    task = { build:true, seq:DRILL[d.type].seq };
    updateObjective(); return;
  }
  if(d && isImplemented(d.type)){
    task=genTask(d, livingEndings());
    if(!task && progress<needed){ HUD.flash("Inga rätta runor kvar — kammaren börjar om."); setTimeout(function(){ loadLevel(levelIdx); },1000); return; }
  } else task=null;
  updateObjective();
}
function updateObjective(){
  var o=el("ludus-task");
  if(!task){ o.innerHTML="<span class='obj-ph'>"+(level.drill&&level.drill.type==="tutorial"?"Lär dig stigen — gräv dig fram och nå porten ↑":(progress>=needed?"Klart! Gå till porten ↑":"Denna krets byggs härnäst — gå till porten ↑"))+"</span>"; return; }
  if(task.build){
    var best=bestBuildRun(), parts="";
    task.seq.forEach(function(w,i){ parts+=(i<best?"<b class='built'>"+w+"</b>":"<span class='unbuilt'>"+w+"</span>")+" "; });
    o.innerHTML="<span class='obj-lead'>Skjut ord-runorna intill varandra i RAD, i ordning:</span> <span class='obj-word'>"+parts+"</span> &nbsp;·&nbsp; <span class='obj-prog'>✦ "+best+"/"+task.seq.length+"</span>"; return;
  }
  // visa facit bara på intro-kretsar (reveal); annars måste man kunna formen själv
  var lead = (level.drill&&level.drill.reveal)
    ? "<span class='obj-lead'>Bär runan</span> <span class='obj-end'>"+(isWordDrill()?"":"-")+task.goal+"</span> <span class='obj-lead'>till altaret</span>"
    : "<span class='obj-lead'>Bär RÄTT runa till altaret</span>";
  o.innerHTML=lead+" &nbsp;·&nbsp; <span class='obj-word'>"+task.tip+"</span> &nbsp;·&nbsp; <span class='obj-prog'>✦ "+progress+"/"+needed+"</span>";
}

/* ---------- fysik (gräv · gravitation · rull · knuff) ---------- */
function moveLabel(x,y,nx,ny){ var kk=k(x,y); if(labels[kk]!==undefined){ labels[k(nx,ny)]=labels[kk]; delete labels[kk]; } }
function delLabel(x,y){ delete labels[k(x,y)]; }
function fall(x,y,nx,ny){ grid[ny][nx]=grid[y][x]; grid[y][x]=" "; moveLabel(x,y,nx,ny); }

// ETT gravitationssteg (en ruta per tick). En FALLANDE sten (i rörelse) krossar
// spelaren; en VILANDE sten på spelarens huvud hålls och krossar inte — kliv undan
// så faller den bakom dig. Rocks/gems rullar av andra rocks/gems (rundade ytor).
function gravityStep(){
  var nf={}, moved=false;
  for(var y=H-2;y>=0;y--) for(var x=0;x<W;x++){
    var t=grid[y][x]; if(t!=="r"&&t!=="*"&&t!=="i") continue;
    var below=grid[y+1][x], pBelow=(px===x&&py===y+1);
    if(pBelow){ if(falling[k(x,y)]&&!settling){ death(); return false; } if(t==="i"){ grid[y][x]=" "; moved=true; } continue; }
    if(below===" "){ fall(x,y,x,y+1); nf[k(x,y+1)]=1; moved=true; }
    else if(below==="E"&&!settling){ if(t==="r"||t==="*"){ squashEnemy(x,y+1); fall(x,y,x,y+1); nf[k(x,y+1)]=1; moved=true; }   // sten/runa krossar skuggan
      else if(t==="i"){ grid[y][x]=" "; moved=true; } }                                                              // istapp smälter, skadar ej skuggan
    else if(below==="A"&&t==="*"&&!settling){ consumeIntoAltar(x,y); moved=true; }
    else if(below==="B"&&t==="*"&&!settling&&falling[k(x,y)]){ buildPush(x,y,x,y+1); moved=true; }
    else if(t==="i"){ grid[y][x]=" "; moved=true; }                                                       // istapp landar → smälter
    else if(below==="r"||below==="*"){ // rulla av rundad yta
      if(inB(x-1,y)&&grid[y][x-1]===" "&&grid[y+1][x-1]===" "&&!(px===x-1&&py===y)){ fall(x,y,x-1,y); nf[k(x-1,y)]=1; moved=true; }
      else if(inB(x+1,y)&&grid[y][x+1]===" "&&grid[y+1][x+1]===" "&&!(px===x+1&&py===y)){ fall(x,y,x+1,y); nf[k(x+1,y)]=1; moved=true; }
    }
  }
  falling=nf; return moved;
}
function squashEnemy(x,y){ for(var i=0;i<enemies.length;i++) if(enemies[i].x===x&&enemies[i].y===y){ enemies.splice(i,1);
  HUD.flash((level.enemySprite==="minotaur"?"Minotauren":"Skuggan")+" krossas!"); return; } }
function bfsStep(sx,sy){   // nästa steg mot spelaren genom öppna gångar (jagar)
  var q=[[sx,sy]], par={}; par[sx+","+sy]=true; var D=[[0,-1],[0,1],[-1,0],[1,0]];
  while(q.length){ var c=q.shift();
    for(var d=0;d<4;d++){ var nx=c[0]+D[d][0], ny=c[1]+D[d][1]; if(!inB(nx,ny)) continue;
      var kk=nx+","+ny; if(par[kk]!==undefined) continue;
      var isP=(nx===px&&ny===py); if(grid[ny][nx]!==" " && !isP) continue;
      par[kk]=[c[0],c[1]];
      if(isP){ var cur=[nx,ny], p=par[kk]; while(p!==true && !(p[0]===sx&&p[1]===sy)){ cur=p; p=par[p[0]+","+p[1]]; } return cur; }
      q.push([nx,ny]);
    } }
  return null;
}
function enemyTick(){
  for(var i=0;i<enemies.length;i++){ var e=enemies[i]; if(grid[e.y][e.x]!=="E"){ enemies.splice(i,1); i--; continue; }
    var step=bfsStep(e.x,e.y);                    // jaga via öppna gångar
    if(step){ grid[e.y][e.x]=" "; e.x=step[0]; e.y=step[1]; grid[e.y][e.x]="E"; }
    else { var nx=e.x+e.dir; if(inB(nx,e.y)&&grid[e.y][nx]===" "){ grid[e.y][e.x]=" "; e.x=nx; grid[e.y][e.x]="E"; } else e.dir=-e.dir; }  // patrullera om ingen väg
    if(e.x===px && e.y===py){ death(); return; }
  }
}
function dropIcicle(){ var cols=level.shafts||[]; if(!cols.length) return;   // bara i schakten (aldrig på startrutan)
  for(var t=0;t<6;t++){ var x=cols[Math.floor(Math.random()*cols.length)]; if(grid[1][x]===" "){ grid[1][x]="i"; return; } } }
function settle(){ settling=true; var g=0; while(gravityStep()&&g++<500){} settling=false; falling={}; }
function raiseWater(){
  var top=-1; for(var y=0;y<H&&top<0;y++) for(var x=0;x<W;x++){ if(grid[y][x]==="~"){ top=y; break; } }
  if(top<0){ var b=H-2, seeded=false;                          // ingen flod än → så in den längst ner (extra frist)
    for(var x0=1;x0<W-1;x0++){ var c0=grid[b][x0]; if(c0===" "||c0==="."){ grid[b][x0]="~"; seeded=true; } }
    if(seeded && grid[py][px]==="~") death(); return; }
  if(top<=1) return; var r=top-1, rose=false;
  for(var x2=0;x2<W;x2++){ var c=grid[r][x2]; if(c===" "||c==="."){ grid[r][x2]="~"; rose=true; } }   // vattnet äter jord
  if(rose && grid[py][px]==="~") death();
}
function tick(){
  if(dead) return;
  gravityStep();
  if(level.drill&&level.drill.rising){ wtick++; if(wtick%(level.drill.riseEvery||22)===0) raiseWater(); }
  if(enemies.length){ enemyCounter++; if(enemyCounter%3===0) enemyTick(); }
  if(level.boss && !cleared){ icicleCounter++; if(icicleCounter%(level.icicleEvery||20)===0) dropIcicle(); }
  if(task&&task.build){ updateObjective(); checkBuild(); }
  render();
}
function startTick(){ if(tickTimer) clearInterval(tickTimer); wtick=0; tickTimer=setInterval(tick,110); }
function tryPush(x,y,dx){
  if(dx===0) return false;
  var bx=x+dx; if(!inB(bx,y)) return false;
  var b=grid[y][bx];
  if(b===" "){ grid[y][bx]=grid[y][x]; grid[y][x]=" "; moveLabel(x,y,bx,y); px=x; py=y; return true; }
  if(b==="A"){ px=x; py=y; consumeIntoAltar(x,y); return true; }
  if(b==="B"){ buildPush(x,y,bx,y); return true; }
  return false;
}
function buildPush(rx,ry,bx,by){   // bär ord till verstavlan (◳) i rätt ordning
  if(!task||!task.build) return;
  var pos=built.length, token=labels[k(rx,ry)];
  if(token===task.seq[pos]){
    grid[ry][rx]=" "; delLabel(rx,ry); px=rx; py=ry;
    built.push(token); builtWord[k(bx,by)]=built.join(" ");   // visa versen på tavlan
    streak++; el("ludus-streak").textContent=streak;
    HUD.flash("✦ "+token+"  ("+built.length+"/"+task.seq.length+")");
    if(built.length>=task.seq.length) levelClear();
    updateObjective();
  } else {
    streak=0; el("ludus-streak").textContent=streak; vitae--; updateHearts();
    if(vitae<=0){ HUD.flash("Fel ord. Kammaren börjar om."); setTimeout(function(){ loadLevel(levelIdx); },900); return; }
    HUD.flash("Fel ord — nästa är '"+task.seq[pos]+"'. ("+vitae+" liv kvar)"); updateObjective();
  }
}
function consumeIntoAltar(x,y){
  var ch=grid[y][x]; var end=(labels[k(x,y)]||"").replace(/^-/,"");
  grid[y][x]=" "; delLabel(x,y);
  if(ch==="*") deliver(end);
}
function deliver(end){
  if(!task){ HUD.flash("Fysik-platshållare."); return; }
  if(end&&end===task.goal){
    progress++; streak++; el("ludus-streak").textContent=streak;
    HUD.flash("✦ Rēctē! "+task.full+"  ("+progress+"/"+needed+")");
    if(progress>=needed) levelClear(); else nextTask();
  } else {
    streak=0; el("ludus-streak").textContent=streak; vitae--; updateHearts();
    if(vitae<=0){ HUD.flash("Fel runa (-"+end+"). Lyktan slocknar — kammaren börjar om."); setTimeout(function(){loadLevel(levelIdx);},900); return; }
    HUD.flash("Fel runa (-"+end+") — du behövde -"+task.goal+". ("+vitae+" liv kvar)"); nextTask();
  }
  updateObjective();
}
function updateHearts(){ var h=el("ludus-hearts"); if(h) h.textContent="✦".repeat(Math.max(0,vitae)); }

function levelClear(){ cleared=true;
  if(level.boss){ var bimg=el("boss-img"), bstage=el("ludus-stage");
    icicleCounter=-99999;                                   // sluta slunga istappar
    bimg.classList.add("crash"); bstage.classList.add("shake");
    setTimeout(function(){ bstage.classList.remove("shake"); },1100);
  }
  HUD.flash(level.boss ? ("✦ "+level.boss.toUpperCase()+" STÖRTAR! Du klättrar mot ljuset — gå till porten ↑.")
                       : "✦ Kammaren klarad! Porten är öppen — gå till ↑."); }
function death(){ if(dead) return; dead=true; if(tickTimer){ clearInterval(tickTimer); tickTimer=null; }
  HUD.flash("Du gick under — kammaren börjar om."); setTimeout(function(){ loadLevel(levelIdx); },900); }

/* ---------- rendering ---------- */
function render(){
  for(var y=0;y<H;y++) for(var x=0;x<W;x++) drawTile(x,y,grid[y][x]);
  drawPlayer(px,py);
  drawLantern();
  drawBoss();
  drawHint();
}
function setupBoss(){
  var stage=el("ludus-stage"), img=el("boss-img");
  img.classList.remove("crash"); stage.classList.remove("shake");   // nollställ bossens fall
  if(level.boss){ stage.classList.add("boss-stage"); if(img.getAttribute("src")!=="sprites/lucifer.png") img.src="sprites/lucifer.png"; img.hidden=false; }
  else { stage.classList.remove("boss-stage"); img.hidden=true; }
}
function drawBoss(){   // Lucifer ritas som HTML-bild ovanför fältet (setupBoss); här bara skuggat tak
  if(!level.boss) return;
  var g=ctx.createLinearGradient(0,0,0,TS*1.4); g.addColorStop(0,"rgba(10,6,16,.7)"); g.addColorStop(1,"rgba(10,6,16,0)");
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,TS*1.4);
}
function correctHover(){   // är runan man hovrar över den rätta?
  if(!hover||!task||!inB(hover[0],hover[1])) return false;
  if(grid[hover[1]][hover[0]]!=="*") return false;
  var tok=labels[k(hover[0],hover[1])];
  if(task.build){ var nx=bestBuildRun(); return nx<task.seq.length && tok===task.seq[nx]; }
  return tok===task.goal;
}
function drawHint(){
  if(!hintOn || !correctHover()) return;
  var X=hover[0]*TS, Y=hover[1]*TS, t=(Date.now()%1100)/1100, a=0.22+0.42*(0.5+0.5*Math.sin(t*Math.PI*2));
  ctx.save(); ctx.strokeStyle="rgba(255,226,150,"+a.toFixed(2)+")"; ctx.lineWidth=3;
  ctx.shadowColor="rgba(255,210,120,"+a.toFixed(2)+")"; ctx.shadowBlur=12;
  ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-3,0,7); ctx.stroke(); ctx.restore();
}
function spr(name,X,Y){ if(IMG[name]){ ctx.drawImage(IMG[name],X,Y,TS,TS); return true; } return false; }
function drawTile(x,y,t){
  var X=x*TS, Y=y*TS;
  if(t==="#"){ if(!spr(level.wallSprite||"wall",X,Y)){ ctx.fillStyle=C.wall; ctx.fillRect(X,Y,TS,TS);
      ctx.fillStyle=C.wallEdge; ctx.fillRect(X,Y,TS,3); ctx.fillRect(X,Y,3,TS); } return; }
  if(t==="."){ if(!spr(level.dirtSprite||"dirt",X,Y)){ ctx.fillStyle=C.dirt; ctx.fillRect(X,Y,TS,TS);
      ctx.fillStyle=C.dirtDot; for(var i=0;i<5;i++) ctx.fillRect(X+6+((i*13)%(TS-10)),Y+7+((i*17)%(TS-12)),3,3); } return; }
  // tom bakgrund för övriga
  ctx.fillStyle=C.air; ctx.fillRect(X,Y,TS,TS);
  if(t==="~"){ if(!spr("water",X,Y)){ ctx.fillStyle=C.water; ctx.fillRect(X,Y,TS,TS);
      ctx.fillStyle="rgba(120,180,210,.18)"; ctx.fillRect(X,Y,TS,4); } }
  else if(t==="r"){ if(!spr("boulder",X,Y)) shapeBoulder(X,Y); }
  else if(t==="*"){ if(!spr("rune",X,Y)) shapeRune(X,Y); drawEnding(X,Y,labels[k(x,y)]); }
  else if(t==="A"){ glow(X,Y); if(!spr("altar",X,Y)) shapeAltar(X,Y); }
  else if(t==="B"){ drawBuildSlot(X,Y,false,null); }
  else if(t==="b"){ drawBuildSlot(X,Y,true,builtWord[k(x,y)]); }
  else if(t==="E"){ var gt=(Date.now()%900)/900, ga=0.3+0.28*(0.5+0.5*Math.sin(gt*Math.PI*2));
    var gc=(level.enemySprite==="minotaur")?"255,150,70":"150,185,255";   // elektrisk gloria så skuggan syns
    ctx.save(); ctx.shadowColor="rgba("+gc+","+ga.toFixed(2)+")"; ctx.shadowBlur=16;
    if(!spr(level.enemySprite||"shade",X,Y)) shapeShade(X,Y);
    ctx.shadowBlur=0; ctx.restore(); }
  else if(t==="i"){ if(!spr("icicle",X,Y)) shapeIcicle(X,Y); }
  else if(t==="X"){ if(!spr(cleared?"gate-open":"gate-closed",X,Y)) shapeGate(X,Y,cleared); }
}
function shapeShade(X,Y){ ctx.fillStyle="rgba(60,40,70,.85)"; ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-4,Math.PI,0); ctx.lineTo(X+TS-5,Y+TS-5); ctx.lineTo(X+5,Y+TS-5); ctx.closePath(); ctx.fill();
  ctx.fillStyle="#d98aa0"; ctx.fillRect(X+TS/2-7,Y+TS/2-2,4,4); ctx.fillRect(X+TS/2+3,Y+TS/2-2,4,4); }
function shapeIcicle(X,Y){ ctx.fillStyle="#bfe0ee"; ctx.beginPath(); ctx.moveTo(X+TS/2,Y+TS-4); ctx.lineTo(X+TS/2-7,Y+6); ctx.lineTo(X+TS/2+7,Y+6); ctx.closePath(); ctx.fill();
  ctx.fillStyle="rgba(255,255,255,.6)"; ctx.beginPath(); ctx.moveTo(X+TS/2,Y+TS-8); ctx.lineTo(X+TS/2-3,Y+9); ctx.lineTo(X+TS/2+1,Y+9); ctx.closePath(); ctx.fill(); }
function drawBuildSlot(X,Y,filled,word){
  ctx.setLineDash(filled?[]:[5,4]); ctx.lineWidth=2;
  ctx.strokeStyle=filled?"#caa24a":"rgba(185,137,47,.6)"; ctx.strokeRect(X+4,Y+4,TS-8,TS-8); ctx.setLineDash([]);
  ctx.fillStyle=filled?"rgba(185,137,47,.16)":"rgba(30,22,10,.5)"; ctx.fillRect(X+5,Y+5,TS-10,TS-10);
  if(filled&&word) drawEnding(X,Y,word);
}
function shapeBoulder(X,Y){ ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-4,0,7); ctx.fillStyle=C.stone; ctx.fill();
  ctx.fillStyle=C.stoneHi; ctx.beginPath(); ctx.arc(X+TS/2-5,Y+TS/2-6,5,0,7); ctx.fill();
  ctx.strokeStyle="rgba(0,0,0,.5)"; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-4,0,7); ctx.stroke(); }
function shapeRune(X,Y){ ctx.save(); ctx.translate(X+TS/2,Y+TS/2); ctx.rotate(Math.PI/4);
  var s=TS*0.30; ctx.fillStyle=C.rune; ctx.fillRect(-s,-s,2*s,2*s);
  ctx.fillStyle=C.runeCore; ctx.fillRect(-s*0.6,-s*0.6,1.2*s,1.2*s); ctx.restore();
  ctx.strokeStyle="rgba(240,214,138,.5)"; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-3,0,7); ctx.stroke(); }
function drawEnding(X,Y,label){ if(!label) return; var txt=(""+label).replace(/^-/,"");
  var mac=/[āēīōū]/.test(txt); var base=txt.replace(/ā/g,"a").replace(/ē/g,"e").replace(/ī/g,"i").replace(/ō/g,"o").replace(/ū/g,"u");
  var cx=X+TS/2, cy=Y+TS/2+2;
  var fs=25; ctx.font="bold "+fs+"px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle";
  while(ctx.measureText(base).width>TS-7 && fs>9){ fs-=1; ctx.font="bold "+fs+"px Georgia"; }   // krymp för ord
  ctx.lineWidth=4; ctx.strokeStyle="rgba(255,246,214,.92)"; ctx.strokeText(base,cx,cy);
  ctx.fillStyle="#1a1206"; ctx.fillText(base,cx,cy);
  if(mac){ var w=ctx.measureText(base).width, by=cy-Math.round(fs*0.62);
    ctx.lineWidth=4; ctx.strokeStyle="rgba(255,246,214,.92)"; ctx.beginPath(); ctx.moveTo(cx-w/2,by); ctx.lineTo(cx+w/2,by); ctx.stroke();
    ctx.lineWidth=2.5; ctx.strokeStyle="#1a1206"; ctx.beginPath(); ctx.moveTo(cx-w/2,by); ctx.lineTo(cx+w/2,by); ctx.stroke(); } }
function shapeAltar(X,Y){ ctx.strokeStyle=C.altar; ctx.lineWidth=3; ctx.strokeRect(X+6,Y+6,TS-12,TS-12);
  ctx.fillStyle="rgba(185,137,47,.22)"; ctx.fillRect(X+6,Y+6,TS-12,TS-12);
  ctx.fillStyle=C.altar; ctx.font="bold 22px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("◊",X+TS/2,Y+TS/2); }
function glow(X,Y){ var g=ctx.createRadialGradient(X+TS/2,Y+TS/2,2,X+TS/2,Y+TS/2,TS); g.addColorStop(0,C.altarGlow); g.addColorStop(1,"rgba(0,0,0,0)"); ctx.fillStyle=g; ctx.fillRect(X-TS/2,Y-TS/2,TS*2,TS*2); }
function shapeGate(X,Y,open){ ctx.fillStyle=open?"#2a1d08":"#15100a"; ctx.fillRect(X+5,Y+3,TS-10,TS-3);
  ctx.strokeStyle=open?C.exit:"#5a4a2a"; ctx.lineWidth=3; ctx.strokeRect(X+5,Y+3,TS-10,TS-3);
  if(open){ ctx.fillStyle=C.exit; ctx.font="bold 26px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("↑",X+TS/2,Y+TS/2); } }
function drawPlayer(x,y){ var X=x*TS, Y=y*TS;
  if(spr("dante",X,Y)) return;
  ctx.fillStyle=C.dante; ctx.fillRect(X+13,Y+18,TS-26,TS-20);
  ctx.fillStyle=C.danteHood; ctx.beginPath(); ctx.arc(X+TS/2,Y+16,9,0,7); ctx.fill();
  ctx.fillStyle="#ffcf6b"; ctx.beginPath(); ctx.arc(X+(facing>0?TS-11:11),Y+TS/2,4,0,7); ctx.fill(); }
function drawLantern(){ var cx=px*TS+TS/2, cy=py*TS+TS/2, r=TS*8;
  var g=ctx.createRadialGradient(cx,cy,TS*2.2,cx,cy,r);
  g.addColorStop(0,"rgba(255,200,90,.10)"); g.addColorStop(.45,"rgba(6,5,3,0)"); g.addColorStop(1,"rgba(5,4,2,.5)");
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height); }

/* ---------- input ---------- */
function move(dx,dy){
  if(dead) return;
  if(dx) facing=dx>0?1:-1;
  var nx=px+dx, ny=py+dy; if(!inB(nx,ny)) return;
  var t=grid[ny][nx];
  if(t==="#"){ return; }
  if(t==="."){ grid[ny][nx]=" "; px=nx; py=ny; }       // gräv
  else if(t===" "||t==="A"||t==="B"||t==="b"){ px=nx; py=ny; }
  else if(t==="r"||t==="*"){ if(dy===0) tryPush(nx,ny,dx); }   // knuffa (bara sidled)
  else if(t==="X"){ onExit(); return; }
  else if(t==="~"||t==="E"||t==="i"){ death(); return; }
  if(task&&task.build){ updateObjective(); checkBuild(); }
  render();                                           // gravitation/vatten sköts av tick-loopen
}
function onExit(){
  if(task!==null && !cleared){ HUD.flash("Porten är låst — bär klart runorna till altaret först."); return; }
  if(levelIdx<LUDUS_LEVELS.length-1) loadLevel(levelIdx+1);
  else HUD.flash("Ad astra — du har nått stjärnorna.");
}

/* ---------- HUD ---------- */
var HUD={ _t:null, flash:function(m){ var f=el("ludus-flash"); f.textContent=m; f.classList.add("show");
  clearTimeout(HUD._t); HUD._t=setTimeout(function(){ f.classList.remove("show"); },2500); } };
function buildLegend(){
  var L=el("ludus-legend"); if(!L) return;
  var r=level.drill&&level.drill.rising;
  L.innerHTML="<span><b class='lg-dirt'>▦</b> gräv jord</span><span><b class='lg-stone'>●</b> sten faller/rullar</span>"+
    "<span><b class='lg-rune'>◆</b> runa = ändelse</span><span><b class='lg-altar'>◊</b> altare = lämna här</span>"+
    (r?"<span><b class='lg-water'>≈</b> vattnet STIGER</span>":"")+"<span>fel runa = −1 liv</span>";
}

/* ---------- level-väljare ---------- */
function buildSelect(){ var s=el("ludus-select"); s.innerHTML="";
  LUDUS_LEVELS.forEach(function(l,i){ var b=document.createElement("button"); b.className="lv-btn";
    b.textContent=i+". "+l.name.replace(/^Cīrculus\s+[IVX]+\s+—\s+/,""); b.onclick=function(){ loadLevel(i); }; s.appendChild(b); }); }

/* ---------- init ---------- */
function init(){
  canvas=el("ludus-canvas"); ctx=canvas.getContext("2d"); buildSelect();
  document.addEventListener("keydown",function(e){ var c=e.key;
    if(c==="ArrowUp"||c==="w"){ move(0,-1); e.preventDefault(); }
    else if(c==="ArrowDown"||c==="s"){ move(0,1); e.preventDefault(); }
    else if(c==="ArrowLeft"||c==="a"){ move(-1,0); e.preventDefault(); }
    else if(c==="ArrowRight"||c==="d"){ move(1,0); e.preventDefault(); } });
  ["up","down","left","right"].forEach(function(dir){ var b=el("dpad-"+dir); if(!b) return;
    var d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir]; b.addEventListener("click",function(){ move(d[0],d[1]); }); });
  // hover-ledtråd: rätt runa pulserar
  canvas.addEventListener("mousemove",function(e){ var r=canvas.getBoundingClientRect();
    var hx=Math.floor((e.clientX-r.left)*(canvas.width/r.width)/TS), hy=Math.floor((e.clientY-r.top)*(canvas.height/r.height)/TS);
    if(inB(hx,hy)){ if(!hover||hover[0]!==hx||hover[1]!==hy){ hover=[hx,hy]; render(); } } else if(hover){ hover=null; render(); } });
  canvas.addEventListener("mouseleave",function(){ if(hover){ hover=null; render(); } });
  var ht=el("hint-toggle"); if(ht) ht.onclick=function(){ hintOn=!hintOn; ht.textContent="Ledtråd: "+(hintOn?"på":"av"); ht.classList.toggle("off",!hintOn); render(); };
  var sx,sy; canvas.addEventListener("touchstart",function(e){ var t=e.touches[0]; sx=t.clientX; sy=t.clientY; },{passive:true});
  canvas.addEventListener("touchend",function(e){ var t=e.changedTouches[0]; var dx=t.clientX-sx, dy=t.clientY-sy;
    if(Math.abs(dx)<20&&Math.abs(dy)<20) return; if(Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1,0); else move(0,dy>0?1:-1); },{passive:true});
  var start=2; try{ var s=parseInt(localStorage.getItem("ludus_level"),10); if(s>=0&&s<LUDUS_LEVELS.length) start=s; }catch(e){}
  loadLevel(start);   // återuppta senaste nivå vid refresh
}
window.addEventListener("DOMContentLoaded",init);
window.LUDUS={ state:function(){ return {task:task,labels:labels,px:px,py:py,progress:progress,needed:needed,streak:streak,vitae:vitae,cleared:cleared,buildBest:(task&&task.build?bestBuildRun():null),grid:grid.map(function(r){return r.join("");})}; },
  move:function(dx,dy){ move(dx,dy); }, load:function(i){ loadLevel(i); } };
})();
