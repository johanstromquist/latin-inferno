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

/* ---------- sprites ---------- */
var SPRITE_FILES=["dirt","wall","boulder","rune","altar","water","gate-closed","gate-open","dante"];
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
  grid=level.grid.map(function(r){ return r.split(""); });
  H=grid.length; W=Math.max.apply(null,grid.map(function(r){return r.length;}));
  grid.forEach(function(r){ while(r.length<W) r.push(r[r.length-1]); });
  labels={}; progress=0; streak=0; cleared=false; task=null; origGem=[];
  vitae=(level.drill&&level.drill.lives)||3; wmoves=0; facing=1;
  needed=(level.drill&&level.drill.count)||3;
  for(var y=0;y<H;y++) for(var x=0;x<W;x++){
    var ch=grid[y][x];
    if(ch==="O") grid[y][x]="r"; else if(ch==="S") grid[y][x]="A";   // alias gamla platshållarnivåer
    if(grid[y][x]==="@"){ px=x; py=y; grid[y][x]=" "; }
    if(grid[y][x]==="*") origGem.push([x,y]);
  }
  canvas.width=W*TS; canvas.height=H*TS;
  document.body.style.setProperty("--tint",level.tint);
  el("ludus-title").textContent=level.name;
  el("ludus-sub").textContent=level.sub;
  el("ludus-intro").textContent=level.intro;
  el("ludus-streak").textContent=streak; updateHearts();
  buildLegend();
  settling=true; applyGravity(); settling=false;
  nextTask(); render();
}

/* ---------- latin-generatorer ---------- */
function twin(e){ return e==="ā"?"a":e==="a"?"ā":e==="ō"?"o":e==="o"?"ō":null; }
function nearMiss(ans,pool){ pool=shuffle(pool.filter(function(e){return e!==ans;}));
  var t=twin(ans); if(t) pool=[t].concat(pool.filter(function(e){return e!==t;})); return pool; }
function genTask(d){
  if(d&&d.type==="decline1"){
    var n=pick(d.pool), st=n.replace(/[aā]$/,"");
    var c=pick([["nominativ","a"],["ackusativ","am"],["genitiv","ae"],["dativ","ae"],["ablativ","ā"]]);
    return { tip:n+"‑ → "+c[0]+(c[1]==="ae"?" (gen=dat)":""), goal:c[1], full:st+c[1],
      distr:nearMiss(c[1],["a","am","ae","ā","ās","īs","ārum","um","us","ō"]) };
  }
  if(d&&d.type==="ablative"){
    var nn=[{w:"aqua",e:"ā"},{w:"silva",e:"ā"},{w:"via",e:"ā"},{w:"umbra",e:"ā"},
            {w:"servus",e:"ō"},{w:"dominus",e:"ō"},{w:"templum",e:"ō"}];
    var x=pick(nn), p=pick(["in","cum","sine","ē"]), s=x.w.replace(/(us|um|a)$/,"");
    return { tip:p+" "+x.w+" → ablativ", goal:x.e, full:p+" "+s+x.e,
      distr:nearMiss(x.e,["ā","ō","am","um","ae","īs","ārum"]) };
  }
  return null;
}
function nextTask(){
  task=genTask(level.drill);
  if(task){ regenGems(); labelGems(); }
  updateObjective();
}
function updateObjective(){
  var o=el("ludus-task");
  if(!task){ o.innerHTML="<span class='obj-ph'>"+(level.drill&&level.drill.type==="tutorial"?"Lär dig stigen — gräv dig fram och nå porten ↑":"Drill byggs i nästa pass — fysiken är spelbar")+"</span>"; return; }
  o.innerHTML="<span class='obj-lead'>Bär runan</span> <span class='obj-end'>-"+task.goal+"</span> "+
    "<span class='obj-lead'>till altaret</span> &nbsp;·&nbsp; <span class='obj-word'>"+task.tip+"</span> "+
    "&nbsp;·&nbsp; <span class='obj-prog'>✦ "+progress+"/"+needed+"</span>";
}
function gemPositions(){ var p=[]; for(var y=0;y<H;y++)for(var x=0;x<W;x++) if(grid[y][x]==="*") p.push([x,y]); return p; }
function regenGems(){
  for(var y=0;y<H;y++) for(var x=0;x<W;x++) if(grid[y][x]==="*"){ grid[y][x]=" "; delLabel(x,y); }
  origGem.forEach(function(p){ grid[p[1]][p[0]]="*"; });
}
function labelGems(){
  if(!task) return; var pos=shuffle(gemPositions()); labels={}; if(!pos.length) return;
  labels[k(pos[0][0],pos[0][1])]="-"+task.goal;
  for(var i=1;i<pos.length;i++) labels[k(pos[i][0],pos[i][1])]="-"+task.distr[(i-1)%task.distr.length];
}

/* ---------- fysik (gräv · gravitation · rull · knuff) ---------- */
function moveLabel(x,y,nx,ny){ var kk=k(x,y); if(labels[kk]!==undefined){ labels[k(nx,ny)]=labels[kk]; delete labels[kk]; } }
function delLabel(x,y){ delete labels[k(x,y)]; }
function fall(x,y,nx,ny){ grid[ny][nx]=grid[y][x]; grid[y][x]=" "; moveLabel(x,y,nx,ny); }

function applyGravity(){
  var moved=true, guard=0;
  while(moved && guard<500){ moved=false; guard++;
    for(var y=H-2;y>=0;y--) for(var x=0;x<W;x++){
      var t=grid[y][x]; if(t!=="r"&&t!=="*") continue;
      var bz=grid[y+1][x];
      if(bz===" "){ if(!settling&&px===x&&py===y+1){ death(); return; } fall(x,y,x,y+1); moved=true; }
      else if(bz==="A"&&t==="*"&&!settling){ consumeIntoAltar(x,y); moved=true; }
      else if(bz==="r"||bz==="*"||bz==="#"){ // rulla av rundade ytor
        if(inB(x-1,y)&&grid[y][x-1]===" "&&grid[y+1][x-1]===" "){ fall(x,y,x-1,y); moved=true; }
        else if(inB(x+1,y)&&grid[y][x+1]===" "&&grid[y+1][x+1]===" "){ fall(x,y,x+1,y); moved=true; }
      }
    }
  }
}
function tryPush(x,y,dx){
  if(dx===0) return false;
  var bx=x+dx; if(!inB(bx,y)) return false;
  var b=grid[y][bx];
  if(b===" "){ grid[y][bx]=grid[y][x]; grid[y][x]=" "; moveLabel(x,y,bx,y); px=x; py=y; return true; }
  if(b==="A"){ px=x; py=y; consumeIntoAltar(x,y); return true; }
  return false;
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

function levelClear(){ cleared=true; HUD.flash("✦ Kammaren klarad! Porten är öppen — gå till ↑."); }
function death(){ HUD.flash("Du gick under — kammaren börjar om."); setTimeout(function(){ loadLevel(levelIdx); },800); }

/* ---------- rendering ---------- */
function render(){
  for(var y=0;y<H;y++) for(var x=0;x<W;x++) drawTile(x,y,grid[y][x]);
  drawPlayer(px,py);
  drawLantern();
}
function spr(name,X,Y){ if(IMG[name]){ ctx.drawImage(IMG[name],X,Y,TS,TS); return true; } return false; }
function drawTile(x,y,t){
  var X=x*TS, Y=y*TS;
  if(t==="#"){ if(!spr("wall",X,Y)){ ctx.fillStyle=C.wall; ctx.fillRect(X,Y,TS,TS);
      ctx.fillStyle=C.wallEdge; ctx.fillRect(X,Y,TS,3); ctx.fillRect(X,Y,3,TS); } return; }
  if(t==="."){ if(!spr("dirt",X,Y)){ ctx.fillStyle=C.dirt; ctx.fillRect(X,Y,TS,TS);
      ctx.fillStyle=C.dirtDot; for(var i=0;i<5;i++) ctx.fillRect(X+6+((i*13)%(TS-10)),Y+7+((i*17)%(TS-12)),3,3); } return; }
  // tom bakgrund för övriga
  ctx.fillStyle=C.air; ctx.fillRect(X,Y,TS,TS);
  if(t==="~"){ if(!spr("water",X,Y)){ ctx.fillStyle=C.water; ctx.fillRect(X,Y,TS,TS);
      ctx.fillStyle="rgba(120,180,210,.18)"; ctx.fillRect(X,Y,TS,4); } }
  else if(t==="r"){ if(!spr("boulder",X,Y)) shapeBoulder(X,Y); }
  else if(t==="*"){ if(!spr("rune",X,Y)) shapeRune(X,Y); drawEnding(X,Y,labels[k(x,y)]); }
  else if(t==="A"){ glow(X,Y); if(!spr("altar",X,Y)) shapeAltar(X,Y); }
  else if(t==="X"){ if(!spr(cleared?"gate-open":"gate-closed",X,Y)) shapeGate(X,Y,cleared); }
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
  ctx.fillStyle=C.runeInk; ctx.font="bold 20px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillText(base,X+TS/2,Y+TS/2+1);
  if(mac){ var w=ctx.measureText(base).width; ctx.strokeStyle=C.runeInk; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(X+TS/2-w/2,Y+TS/2-11); ctx.lineTo(X+TS/2+w/2,Y+TS/2-11); ctx.stroke(); } }
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
  if(dx) facing=dx>0?1:-1;
  var nx=px+dx, ny=py+dy; if(!inB(nx,ny)) return;
  var t=grid[ny][nx];
  if(t==="#"){ return; }
  if(t==="."){ grid[ny][nx]=" "; px=nx; py=ny; }       // gräv
  else if(t===" "){ px=nx; py=ny; }
  else if(t==="A"){ px=nx; py=ny; }
  else if(t==="r"||t==="*"){ if(dy===0) tryPush(nx,ny,dx); }   // knuffa (bara sidled)
  else if(t==="X"){ onExit(); return; }
  else if(t==="~"){ death(); return; }
  applyGravity();
  if(level.drill&&level.drill.rising) waterTick();
  render();
}
function waterTick(){ wmoves++; if(wmoves%(level.drill.riseEvery||9)!==0) return;
  var top=-1; for(var y=0;y<H&&top<0;y++) for(var x=0;x<W;x++){ if(grid[y][x]==="~"){ top=y; break; } }
  if(top<=1) return; var r=top-1, rose=false;
  for(var x2=0;x2<W;x2++){ var c=grid[r][x2]; if(c===" "||c==="."){ grid[r][x2]="~"; rose=true; } }  // vattnet äter jord
  if(rose&&grid[py][px]==="~") death();
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
  var sx,sy; canvas.addEventListener("touchstart",function(e){ var t=e.touches[0]; sx=t.clientX; sy=t.clientY; },{passive:true});
  canvas.addEventListener("touchend",function(e){ var t=e.changedTouches[0]; var dx=t.clientX-sx, dy=t.clientY-sy;
    if(Math.abs(dx)<20&&Math.abs(dy)<20) return; if(Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1,0); else move(0,dy>0?1:-1); },{passive:true});
  loadLevel(2);
}
window.addEventListener("DOMContentLoaded",init);
window.LUDUS={ state:function(){ return {task:task,labels:labels,px:px,py:py,progress:progress,needed:needed,streak:streak,vitae:vitae,cleared:cleared,grid:grid.map(function(r){return r.join("");})}; },
  move:function(dx,dy){ move(dx,dy); }, load:function(i){ loadLevel(i); } };
})();
