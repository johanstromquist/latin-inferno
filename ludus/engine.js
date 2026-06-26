/* ============================================================================
   SAXA CADENTIA — motor
   STEG 2: rendering av nivåer + rörelse/gräv. Övriga mekaniker är STUBBAR
   (markerade STEG 4) så nivåerna syns och kan gås runt i, men gravitation,
   knuff, leverans, fiender och formkontroll är ännu inte aktiva.
   ========================================================================== */
(function(){
"use strict";

var TS=36;                 // tile size px
var canvas, ctx, HUD, level, grid, W, H, px, py, levelIdx=0;
var COLORS={
  wall:"#2b2622", wallTop:"#3a332b", dirt:"#3a2c1c", dirtTop:"#4a3a24",
  air:"#0a0907", stone:"#6b6258", frag:"#caa24a", fragInk:"#1a140a",
  shrine:"#b9892f", exit:"#e7c878", enemy:"#9d3b2f", water:"#1d3b4a",
  dante:"#9a2b2b", danteHood:"#c83b3b"
};

function el(id){ return document.getElementById(id); }

/* ---------- ladda nivå ---------- */
function loadLevel(i){
  levelIdx=i; level=LUDUS_LEVELS[i];
  grid = level.grid.map(function(r){ return r.split(""); });
  H=grid.length; W=grid[0].length;
  // hitta spelarstart
  for(var y=0;y<H;y++) for(var x=0;x<W;x++){ if(grid[y][x]==="@"){ px=x; py=y; grid[y][x]=" "; } }
  canvas.width=W*TS; canvas.height=H*TS;
  document.body.style.setProperty("--tint", level.tint);
  el("ludus-title").textContent=level.name;
  el("ludus-sub").textContent=level.sub;
  el("ludus-task").innerHTML = taskPlaceholder(level.drill);
  el("ludus-intro").textContent=level.intro;
  render();
}
function taskPlaceholder(d){
  // STEG 4 ersätter detta med en riktig genererad uppgift ur paradigmen
  var m={ tutorial:"Nå porten (X).", sentence:"Bilda: poēta ___ (verb)",
    decline1:"Forma: <b>puella‑</b> → (ackusativ)", decline2:"Forma: <b>templum</b> (neutrum!)",
    verbpres:"Mata Cerberus: 'ni älskar' = ___", casegd:"Forma: genitiv av <b>rēgīna</b>",
    ablative:"Forma: <b>in ___</b> (ablativ)", agreement:"Para: <b>rēgīna</b> + (stor, fem.)",
    tense:"Forma: imperfekt av <b>cantāre</b>", order:"Ordna satsen i rätt följd",
    boss:"Återskapa: tū nē cēde malīs…", free:"Fri träning" };
  return "<span class='task-ph'>[platshållare]</span> "+(m[d.type]||d.type);
}

/* ---------- rendering ---------- */
function render(){
  ctx.fillStyle=COLORS.air; ctx.fillRect(0,0,canvas.width,canvas.height);
  for(var y=0;y<H;y++) for(var x=0;x<W;x++) drawTile(x,y,grid[y][x]);
  drawDante(px,py);
  drawLantern();
  drawMini();
}
function cell(x,y){ return x*TS+TS/2, y*TS; }
function drawTile(x,y,t){
  var X=x*TS, Y=y*TS;
  if(t==="#"){ ctx.fillStyle=COLORS.wall; ctx.fillRect(X,Y,TS,TS);
    ctx.fillStyle=COLORS.wallTop; ctx.fillRect(X,Y,TS,4); return; }
  if(t==="."){ ctx.fillStyle=COLORS.dirt; ctx.fillRect(X,Y,TS,TS);
    ctx.fillStyle="rgba(0,0,0,.18)"; for(var i=0;i<3;i++) ctx.fillRect(X+4+i*11,Y+6+((i*7)%20),3,3); return; }
  if(t===" "){ ctx.fillStyle=COLORS.air; ctx.fillRect(X,Y,TS,TS); return; }
  ctx.fillStyle=COLORS.air; ctx.fillRect(X,Y,TS,TS);
  if(t==="O"){ boulder(X,Y,COLORS.stone,null); }
  else if(t==="*"){ boulder(X,Y,"#3a2f1c","??"); }      // fragmentsten (etikett i Steg 4)
  else if(t==="S"){ socket(X,Y); }
  else if(t==="X"){ exitArch(X,Y); }
  else if(t==="E"){ enemy(X,Y); }
  else if(t==="~"){ ctx.fillStyle=COLORS.water; ctx.fillRect(X,Y,TS,TS);
    ctx.fillStyle="rgba(120,180,210,.25)"; ctx.fillRect(X,Y,TS,3); }
}
function boulder(X,Y,fill,label){
  ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-3,0,7); ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle="rgba(0,0,0,.5)"; ctx.lineWidth=2; ctx.stroke();
  if(label){ ctx.fillStyle=COLORS.frag; ctx.font="bold 12px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(label,X+TS/2,Y+TS/2); }
}
function socket(X,Y){
  ctx.strokeStyle=COLORS.shrine; ctx.lineWidth=2;
  ctx.strokeRect(X+5,Y+5,TS-10,TS-10);
  ctx.fillStyle="rgba(185,137,47,.18)"; ctx.fillRect(X+5,Y+5,TS-10,TS-10);
}
function exitArch(X,Y){
  ctx.fillStyle="#1a1208"; ctx.fillRect(X+4,Y+2,TS-8,TS-2);
  ctx.fillStyle=COLORS.exit; ctx.font="bold 20px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillText("↑",X+TS/2,Y+TS/2);
  ctx.strokeStyle=COLORS.exit; ctx.lineWidth=2; ctx.strokeRect(X+4,Y+2,TS-8,TS-2);
}
function enemy(X,Y){
  ctx.fillStyle=COLORS.enemy; ctx.beginPath();
  ctx.arc(X+TS/2,Y+TS/2,TS/2-5,0,7); ctx.fill();
  ctx.fillStyle="#e8c0b8"; ctx.fillRect(X+TS/2-6,Y+TS/2-3,3,3); ctx.fillRect(X+TS/2+3,Y+TS/2-3,3,3);
}
function drawDante(x,y){
  var X=x*TS, Y=y*TS;
  ctx.fillStyle=COLORS.dante; ctx.fillRect(X+9,Y+13,TS-18,TS-15);
  ctx.fillStyle=COLORS.danteHood; ctx.beginPath(); ctx.arc(X+TS/2,Y+12,7,0,7); ctx.fill();
  // lykta
  ctx.fillStyle="#ffcf6b"; ctx.beginPath(); ctx.arc(X+TS-9,Y+TS/2,3,0,7); ctx.fill();
}
function drawLantern(){
  var cx=px*TS+TS/2, cy=py*TS+TS/2, r=TS*3.4;
  var g=ctx.createRadialGradient(cx,cy,TS*0.8,cx,cy,r);
  g.addColorStop(0,"rgba(6,5,3,0)"); g.addColorStop(0.7,"rgba(6,5,3,.45)"); g.addColorStop(1,"rgba(5,4,2,.92)");
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
}
function drawMini(){ /* STEG 4: ev. minikarta/mätare-overlay */ }

/* ---------- input: rörelse + gräv (STEG 2 aktivt) ---------- */
function move(dx,dy){
  var nx=px+dx, ny=py+dy;
  if(nx<0||ny<0||nx>=W||ny>=H) return;
  var t=grid[ny][nx];
  if(t==="#"){ return; }                       // mur
  if(t==="."){ grid[ny][nx]=" "; px=nx; py=ny; }  // gräv + flytta in
  else if(t===" "||t==="S"){ px=nx; py=ny; }    // luft / slott (gå in)
  else if(t==="O"||t==="*"){ tryPush(nx,ny,dx,dy); } // STEG 4: knuff
  else if(t==="X"){ px=nx; py=ny; onExit(); }
  else if(t==="~"){ /* STEG 4: vatten/drunkning */ px=nx; py=ny; }
  else if(t==="E"){ /* STEG 4: fiendekontakt */ }
  applyGravity();   // STEG 4 (stub nu)
  render();
}

/* ---------- STUBBAR (implementeras i STEG 4) ---------- */
function tryPush(x,y,dx,dy){ /* STEG 4: knuffa sten om rutan bortom är ledig */ }
function applyGravity(){ /* STEG 4: lösa stenar faller, krossar */ }
function tryDeliver(){ /* STEG 4: rätt fragment i slott → formkontroll */ }
function updateEnemies(){ /* STEG 4: fiende-AI (jaga/patrullera) */ }
function hazardTick(){ /* STEG 4: vind/vatten/istak/timer */ }
function onExit(){ HUD.flash("Kammaren klarad (platshållare) — nästa nivå öppnas i Steg 4."); }

/* ---------- HUD ---------- */
HUD={ flash:function(msg){ var f=el("ludus-flash"); f.textContent=msg; f.classList.add("show");
  clearTimeout(HUD._t); HUD._t=setTimeout(function(){ f.classList.remove("show"); },2200); } };

/* ---------- level-väljare ---------- */
function buildSelect(){
  var sel=el("ludus-select"); sel.innerHTML="";
  LUDUS_LEVELS.forEach(function(l,i){
    var b=document.createElement("button"); b.className="lv-btn"; b.textContent=(i)+". "+l.name.replace(/^C.*— /,"");
    if(i===0) b.textContent="0. "+l.name;
    b.onclick=function(){ loadLevel(i); };
    sel.appendChild(b);
  });
}

/* ---------- init ---------- */
function init(){
  canvas=el("ludus-canvas"); ctx=canvas.getContext("2d");
  buildSelect();
  document.addEventListener("keydown",function(e){
    var k=e.key;
    if(k==="ArrowUp"||k==="w"){ move(0,-1); e.preventDefault(); }
    else if(k==="ArrowDown"||k==="s"){ move(0,1); e.preventDefault(); }
    else if(k==="ArrowLeft"||k==="a"){ move(-1,0); e.preventDefault(); }
    else if(k==="ArrowRight"||k==="d"){ move(1,0); e.preventDefault(); }
  });
  // d-pad (mobil)
  ["up","down","left","right"].forEach(function(dir){
    var b=el("dpad-"+dir); if(!b) return;
    var d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];
    b.addEventListener("click",function(){ move(d[0],d[1]); });
  });
  // svep
  var sx,sy;
  canvas.addEventListener("touchstart",function(e){ var t=e.touches[0]; sx=t.clientX; sy=t.clientY; },{passive:true});
  canvas.addEventListener("touchend",function(e){ var t=e.changedTouches[0]; var dx=t.clientX-sx, dy=t.clientY-sy;
    if(Math.abs(dx)<20&&Math.abs(dy)<20) return;
    if(Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1,0); else move(0,dy>0?1:-1);
  },{passive:true});
  loadLevel(0);
}
window.addEventListener("DOMContentLoaded",init);
})();
