/* ============================================================================
   SAXA CADENTIA — motor (Steg 4: primitiv mekanik)
   Aktivt: rörelse, gräv, lykta, GRAVITATION, KROSSNING, KNUFF, LEVERANS +
   formkontroll för 1:a deklinationen (Limbo, vertikal skiva), säkerhetsmätare,
   nivåklart, reset. Övriga drilltyper är fysik-aktiva men poäng-platshållare
   (byggs i nästa pass). "Primitivast möjligt": omritning per drag, enkel regel.
   ========================================================================== */
(function(){
"use strict";

var TS=36;
var canvas, ctx, level, grid, W, H, px, py, levelIdx=0;
var labels={}, task=null, progress=0, needed=5, streak=0, cleared=false, settling=false, origFrag=[];

var COLORS={ wall:"#2b2622", wallTop:"#3a332b", dirt:"#3a2c1c", air:"#0a0907",
  stone:"#6b6258", fragFill:"#2e2716", fragInk:"#e7c878", shrine:"#b9892f",
  exit:"#e7c878", enemy:"#9d3b2f", water:"#1d3b4a", dante:"#9a2b2b", danteHood:"#c83b3b" };

function el(id){ return document.getElementById(id); }
function key(x,y){ return x+","+y; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;} return a; }

/* ---------- ladda nivå ---------- */
function loadLevel(i){
  levelIdx=i; level=LUDUS_LEVELS[i];
  grid=level.grid.map(function(r){ return r.split(""); });
  H=grid.length; W=Math.max.apply(null, grid.map(function(r){return r.length;}));
  grid.forEach(function(r){ while(r.length<W) r.push(r[r.length-1]); });  // normalisera bredd
  labels={}; progress=0; streak=0; cleared=false; task=null; origFrag=[];
  needed=(level.drill&&level.drill.count)||5;
  for(var y=0;y<H;y++) for(var x=0;x<W;x++){
    if(grid[y][x]==="@"){ px=x; py=y; grid[y][x]=" "; }
    if(grid[y][x]==="*") origFrag.push([x,y]);    // ursprungliga fragment-platser (för regen)
  }
  canvas.width=W*TS; canvas.height=H*TS;
  document.body.style.setProperty("--tint",level.tint);
  el("ludus-title").textContent=level.name;
  el("ludus-sub").textContent=level.sub;
  el("ludus-intro").textContent=level.intro;
  el("ludus-streak").textContent=streak;
  settling=true; applyGravity(); settling=false;   // sätt världen i vila
  nextTask();
  render();
}

/* ---------- latin: paradigm-generator ---------- */
function genTask(drill){
  if(drill && drill.type==="decline1"){
    var noun=pick(drill.pool);
    var stem=noun.replace(/[aā]$/,"");
    var cases=[["nominativ","a"],["ackusativ","am"],["genitiv","ae"],["dativ","ae"],["ablativ","ā"]];
    var c=pick(cases);
    var pool=["a","am","ae","ā","ās","īs","ārum","um","us","ō"].filter(function(e){return e!==c[1];});
    return { prompt:"<b>"+noun+"‑</b> &rarr; <b>"+c[0]+"</b>", answer:c[1],
             full:stem+c[1], distractors:shuffle(pool) };
  }
  return null; // övriga drilltyper: platshållare denna skiva
}
function nextTask(){
  task=genTask(level.drill);
  if(task){ el("ludus-task").innerHTML=task.prompt; regenStones(); labelStones(); }
  else el("ludus-task").innerHTML="<span class='task-ph'>[platshållare]</span> "+(level.drill?level.drill.type:"")+" — drillpoäng byggs i nästa pass (fysiken är spelbar).";
}
function fragPositions(){ var p=[]; for(var y=0;y<H;y++)for(var x=0;x<W;x++) if(grid[y][x]==="*") p.push([x,y]); return p; }
// regenerera fragmentstenarna på sina fasta platser (alltid spelbart, inget tomtjat)
function regenStones(){
  for(var y=0;y<H;y++) for(var x=0;x<W;x++) if(grid[y][x]==="*"){ grid[y][x]=" "; clearLabel(x,y); }
  origFrag.forEach(function(p){ grid[p[1]][p[0]]="*"; });  // alltid alla — spelaren får dela ruta ofarligt
}
function labelStones(){
  if(!task) return;
  var pos=shuffle(fragPositions()); labels={};
  if(!pos.length) return;
  labels[key(pos[0][0],pos[0][1])]="-"+task.answer;          // rätt ändelse, slumpad plats
  for(var i=1;i<pos.length;i++) labels[key(pos[i][0],pos[i][1])]="-"+task.distractors[(i-1)%task.distractors.length];
}

/* ---------- fysik ---------- */
function moveLabel(x,y,nx,ny){ var k=key(x,y); if(labels[k]!==undefined){ labels[key(nx,ny)]=labels[k]; delete labels[k]; } }
function clearLabel(x,y){ delete labels[key(x,y)]; }

function applyGravity(){
  var moved=true, guard=0;
  while(moved && guard<300){ moved=false; guard++;
    for(var y=H-2;y>=0;y--) for(var x=0;x<W;x++){
      var t=grid[y][x]; if(t!=="O"&&t!=="*") continue;
      var below=grid[y+1][x];
      if(below===" "){
        if(!settling && px===x && py===y+1){ death(); return; }
        grid[y+1][x]=t; grid[y][x]=" "; moveLabel(x,y,x,y+1); moved=true;
      } else if(below==="S" && !settling){
        consumeIntoSlot(x,y); moved=true;
      }
    }
  }
}

function tryPush(x,y,dx){
  if(dx===0) return;
  var bx=x+dx; if(bx<0||bx>=W) return;
  var beyond=grid[y][bx];
  if(beyond===" "){ grid[y][bx]=grid[y][x]; grid[y][x]=" "; moveLabel(x,y,bx,y); px=x; py=y; }
  else if(beyond==="S"){ px=x; py=y; consumeIntoSlot(x,y); }
}

// ta bort stenen ur rutan FÖRST (fånga ändelsen), poängsätt sedan (deliver kan regenerera)
function consumeIntoSlot(x,y){
  var ch=grid[y][x];
  var end=(labels[key(x,y)]||"").replace(/^-/,"");
  grid[y][x]=" "; clearLabel(x,y);
  if(ch==="*") deliver(end);
}
function deliver(end){
  if(!task){ HUD.flash("Fysik-platshållare — drill byggs senare (fysiken funkar)."); return; }
  if(end && end===task.answer){
    progress++; streak++; el("ludus-streak").textContent=streak;
    HUD.flash("✦ Rēctē! "+task.full+"  ("+progress+"/"+needed+")");
    if(progress>=needed){ levelClear(); } else nextTask();
  } else {
    streak=0; el("ludus-streak").textContent=streak;
    HUD.flash("Fel ändelse (-"+end+"). "+stripTags(task.prompt)+". Försök igen.");
    nextTask();
  }
}
function stripTags(s){ return s.replace(/<[^>]+>/g,"").replace(/‑/g,""); }

function levelClear(){
  cleared=true;
  HUD.flash("✦ Kammaren klarad! Gå till porten (↑) för nästa.");
  el("ludus-task").innerHTML="<b style='color:#e7c878'>Klarad!</b> Gå till porten ↑.";
}
function death(){
  HUD.flash("Krossad! Kammaren börjar om.");
  setTimeout(function(){ loadLevel(levelIdx); },700);
}

/* ---------- rendering ---------- */
function render(){
  ctx.fillStyle=COLORS.air; ctx.fillRect(0,0,canvas.width,canvas.height);
  for(var y=0;y<H;y++) for(var x=0;x<W;x++) drawTile(x,y,grid[y][x]);
  drawDante(px,py); drawLantern();
}
function drawTile(x,y,t){
  var X=x*TS, Y=y*TS;
  if(t==="#"){ ctx.fillStyle=COLORS.wall; ctx.fillRect(X,Y,TS,TS); ctx.fillStyle=COLORS.wallTop; ctx.fillRect(X,Y,TS,4); return; }
  ctx.fillStyle=COLORS.air; ctx.fillRect(X,Y,TS,TS);
  if(t==="."){ ctx.fillStyle=COLORS.dirt; ctx.fillRect(X+1,Y+1,TS-2,TS-2);
    ctx.fillStyle="rgba(0,0,0,.18)"; for(var i=0;i<3;i++) ctx.fillRect(X+5+i*10,Y+7+((i*7)%18),3,3); return; }
  if(t==="O"){ boulder(X,Y,COLORS.stone,null); }
  else if(t==="*"){ boulder(X,Y,COLORS.fragFill, labels[key(x,y)]||"·"); }
  else if(t==="S"){ ctx.strokeStyle=COLORS.shrine; ctx.lineWidth=2; ctx.strokeRect(X+5,Y+5,TS-10,TS-10);
    ctx.fillStyle="rgba(185,137,47,.18)"; ctx.fillRect(X+5,Y+5,TS-10,TS-10); }
  else if(t==="X"){ ctx.fillStyle="#1a1208"; ctx.fillRect(X+4,Y+2,TS-8,TS-2);
    ctx.strokeStyle=COLORS.exit; ctx.lineWidth=2; ctx.strokeRect(X+4,Y+2,TS-8,TS-2);
    ctx.fillStyle=COLORS.exit; ctx.font="bold 20px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("↑",X+TS/2,Y+TS/2); }
  else if(t==="E"){ ctx.fillStyle=COLORS.enemy; ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-5,0,7); ctx.fill();
    ctx.fillStyle="#e8c0b8"; ctx.fillRect(X+TS/2-6,Y+TS/2-3,3,3); ctx.fillRect(X+TS/2+3,Y+TS/2-3,3,3); }
  else if(t==="~"){ ctx.fillStyle=COLORS.water; ctx.fillRect(X,Y,TS,TS); ctx.fillStyle="rgba(120,180,210,.25)"; ctx.fillRect(X,Y,TS,3); }
}
function boulder(X,Y,fill,label){
  ctx.beginPath(); ctx.arc(X+TS/2,Y+TS/2,TS/2-3,0,7); ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle=label?"rgba(200,162,74,.7)":"rgba(0,0,0,.5)"; ctx.lineWidth=2; ctx.stroke();
  if(label){ ctx.fillStyle=COLORS.fragInk; ctx.font="bold 13px Georgia"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(label,X+TS/2,Y+TS/2); }
}
function drawDante(x,y){
  var X=x*TS, Y=y*TS;
  ctx.fillStyle=COLORS.dante; ctx.fillRect(X+9,Y+13,TS-18,TS-15);
  ctx.fillStyle=COLORS.danteHood; ctx.beginPath(); ctx.arc(X+TS/2,Y+12,7,0,7); ctx.fill();
  ctx.fillStyle="#ffcf6b"; ctx.beginPath(); ctx.arc(X+TS-9,Y+TS/2,3,0,7); ctx.fill();
}
function drawLantern(){
  var cx=px*TS+TS/2, cy=py*TS+TS/2, r=TS*4.2;
  var g=ctx.createRadialGradient(cx,cy,TS*1.0,cx,cy,r);
  g.addColorStop(0,"rgba(6,5,3,0)"); g.addColorStop(.72,"rgba(6,5,3,.4)"); g.addColorStop(1,"rgba(5,4,2,.9)");
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
}

/* ---------- input ---------- */
function move(dx,dy){
  var nx=px+dx, ny=py+dy;
  if(nx<0||ny<0||nx>=W||ny>=H) return;
  var t=grid[ny][nx];
  if(t==="#") return;
  if(t==="."){ grid[ny][nx]=" "; px=nx; py=ny; }
  else if(t===" "||t==="S"){ px=nx; py=ny; }
  else if(t==="O"||t==="*"){ tryPush(nx,ny,dx); }
  else if(t==="X"){ onExit(); return; }
  else if(t==="~"){ death(); return; }
  else if(t==="E"){ death(); return; }
  applyGravity();
  render();
}
function onExit(){
  if(levelIdx<LUDUS_LEVELS.length-1){ loadLevel(levelIdx+1); }
  else { HUD.flash("Ad astra — du har nått stjärnorna."); }
}

/* ---------- HUD ---------- */
var HUD={ _t:null, flash:function(msg){ var f=el("ludus-flash"); f.textContent=msg; f.classList.add("show");
  clearTimeout(HUD._t); HUD._t=setTimeout(function(){ f.classList.remove("show"); },2400); } };

/* ---------- level-väljare ---------- */
function buildSelect(){
  var sel=el("ludus-select"); sel.innerHTML="";
  LUDUS_LEVELS.forEach(function(l,i){
    var b=document.createElement("button"); b.className="lv-btn";
    b.textContent=i+". "+l.name.replace(/^Cīrculus\s+[IVX]+\s+—\s+/,"");
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
  ["up","down","left","right"].forEach(function(dir){
    var b=el("dpad-"+dir); if(!b) return;
    var d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];
    b.addEventListener("click",function(){ move(d[0],d[1]); });
  });
  var sx,sy;
  canvas.addEventListener("touchstart",function(e){ var t=e.touches[0]; sx=t.clientX; sy=t.clientY; },{passive:true});
  canvas.addEventListener("touchend",function(e){ var t=e.changedTouches[0]; var dx=t.clientX-sx, dy=t.clientY-sy;
    if(Math.abs(dx)<20&&Math.abs(dy)<20) return;
    if(Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1,0); else move(0,dy>0?1:-1);
  },{passive:true});
  loadLevel(2); // starta på Limbo (vertikal skiva)
}
window.addEventListener("DOMContentLoaded",init);
// liten felsöknings-/testkrok (ofarlig): inspektera tillstånd och driv ett drag
window.LUDUS={ state:function(){ return {task:task,labels:labels,px:px,py:py,progress:progress,needed:needed,streak:streak,grid:grid.map(function(r){return r.join("");})}; },
  move:function(dx,dy){ move(dx,dy); }, load:function(i){ loadLevel(i); } };
})();
