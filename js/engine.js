/* ============================================================================
   LATIN INFERNO — spelmotor
   Vanilla JS. Sparar i localStorage. Bilder laddas från assets/img/ med
   atmosfärisk gradient-fallback (fungerar även innan illustrationerna finns).
   ========================================================================== */
(function(){
"use strict";

var SAVE_KEY = "latininferno_v1";
var ORDER = { E:0, C:1, A:2 };
var TYPE_LABEL = {
  vocab:"Vocabularium", grammar:"Grammatica", concept:"Grammatica",
  translatio:"Translatio", hereditas:"Hereditas", sententia:"Sententia",
  lore:"Rōma", analysis:"Disputātiō"
};
/* tinted gradient per scen (fallback + ligger bakom bilden) */
var ART = {
  wood:"linear-gradient(160deg,#2a2113,#0c0a08)", gate:"linear-gradient(160deg,#241a12,#0a0706)",
  limbo:"linear-gradient(160deg,#1c2418,#0b0a07)", wind:"linear-gradient(160deg,#1d1822,#0a0809)",
  rain:"linear-gradient(160deg,#161c20,#08090a)", stones:"linear-gradient(160deg,#241d14,#0b0907)",
  styx:"linear-gradient(160deg,#10171a,#070908)", tombs:"linear-gradient(160deg,#2a160f,#0c0706)",
  forest:"linear-gradient(160deg,#1a140f,#080706)", bolge:"linear-gradient(160deg,#231a12,#0a0807)",
  ice:"linear-gradient(160deg,#16202a,#080a0c)", stars:"linear-gradient(160deg,#0e1530,#070611)"
};
function artBg(key, file){
  // bilden ovanpå gradienten; saknas filen visas gradienten
  return "url('assets/img/"+file+"'), "+(ART[key]||"linear-gradient(160deg,#241d14,#0b0907)");
}

/* ---------- state ---------- */
var S = load();
function load(){
  try{ var s=JSON.parse(localStorage.getItem(SAVE_KEY)); if(s&&s.v===1) return s; }catch(e){}
  return { v:1, unlocked:0, passed:{}, seenGrade:{E:0,C:0,A:0}, passGrade:{E:0,C:0,A:0} };
}
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
function cidKey(si,ci){ return si+"."+ci; }
function isPassed(si,ci){ return !!S.passed[cidKey(si,ci)]; }

/* totalt antal uppgifter per nivå i hela spelet (för kompassen) */
var TOTAL = {E:0,C:0,A:0};
INFERNO.stages.forEach(function(st){ st.challenges.forEach(function(c){ TOTAL[c.grade]++; }); });

/* lägsta nivå som finns i en krets -> avgör vad som krävs för att passera */
function requiredIdx(st){
  var min=null;
  st.challenges.forEach(function(c){ if(min===null||ORDER[c.grade]<ORDER[min]) min=c.grade; });
  var idxs=[];
  st.challenges.forEach(function(c,i){ if(c.grade===min) idxs.push(i); });
  return idxs;
}
function stageCleared(si){
  var st=INFERNO.stages[si]; return requiredIdx(st).every(function(ci){ return isPassed(si,ci); });
}

/* ---------- helpers ---------- */
function el(id){ return document.getElementById(id); }
function show(screen){
  ["screen-title","screen-map","screen-stage"].forEach(function(s){ el(s).classList.remove("active"); });
  el(screen).classList.add("active"); window.scrollTo(0,0);
}
function mk(tag,cls,html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

/* ---------- titel ---------- */
el("title-hero").style.backgroundImage = artBg("wood","wood.jpg");
function refreshTitle(){
  var has = S.unlocked>0 || Object.keys(S.passed).length>0;
  el("btn-continue").hidden = !has;
}
el("btn-start").onclick = function(){ openStage(0); };
el("btn-continue").onclick = function(){ show("screen-map"); renderMap(); };
el("btn-about").onclick = function(){ el("about-overlay").hidden=false; };
el("about-close").onclick = function(){ el("about-overlay").hidden=true; };
el("btn-to-title").onclick = function(){ show("screen-title"); refreshTitle(); };
el("btn-compass").onclick = openCompass;
el("compass-close").onclick = function(){ el("compass-overlay").hidden=true; };
el("btn-to-map").onclick = function(){ show("screen-map"); renderMap(); };

/* ---------- kartan ---------- */
function renderMap(){
  var list = el("map-list"); list.innerHTML="";
  INFERNO.stages.forEach(function(st,si){
    var locked = si>S.unlocked;
    var done = stageCleared(si);
    var node = mk("li","map-node"+(locked?" locked":"")+(done?" done":""));
    var art = mk("div","node-art"); art.style.backgroundImage = artBg(st.art, st.art+".jpg");
    var body = mk("div","node-body",
      '<div class="node-roman">'+st.roman+'</div>'+
      '<div class="node-title">'+st.sv+'</div>'+
      '<div class="node-focus">'+st.focus+'</div>');
    node.appendChild(art); node.appendChild(body);
    node.appendChild(mk("div", locked?"node-lock":("node-status"+(done?" cleared":"")),
      locked?"&#128274;":(done?"&#10039; avklarad":"&rarr;")));
    if(!locked) node.onclick = function(){ openStage(si); };
    list.appendChild(node);
  });
}

/* ---------- en krets ---------- */
function openStage(si){
  show("screen-stage");
  var st = INFERNO.stages[si];
  el("stage-bar-title").textContent = st.roman;
  var wrap = el("stage-body"); wrap.innerHTML="";

  // hero
  var hero = mk("div","stage-hero"); hero.style.backgroundImage = artBg(st.art, st.art+".jpg");
  hero.appendChild(mk("div","stage-hero-cap",
    '<div class="stage-roman">'+st.roman+'</div>'+
    '<div class="stage-h">'+st.sv+'</div>'+
    '<div class="stage-sub">'+st.subtitle+'</div>'+
    '<div class="stage-focus">'+st.focus+'</div>'));
  wrap.appendChild(hero);

  var body = mk("div","stage-wrap"); wrap.appendChild(body);

  // Dante
  body.appendChild(dialog("dante","dante.png","Dante", st.intro.dante));
  // Vergilius
  body.appendChild(dialog("virgil","virgil.png","Vergilius, magister", st.intro.virgil));
  // Aeneid-rad
  var v = st.intro.line;
  body.appendChild(mk("div","versus",
    '<div class="la">&ldquo;'+v.la+'&rdquo;</div>'+
    '<div class="sv">'+v.sv+'</div>'+
    '<div class="ref">— '+v.ref+'</div>'));

  // uppgifter
  st.challenges.forEach(function(c,ci){ body.appendChild(renderChallenge(st,si,c,ci)); });

  // fot
  var foot = mk("div","stage-foot");
  body.appendChild(foot);
  updateFoot(foot,si);
}

function dialog(who,img,label,text){
  var d = mk("div","dialog "+(who==="dante"?"dante":""));
  var av = mk("div","avatar"); av.style.backgroundImage = "url('assets/img/"+img+"')";
  d.appendChild(av);
  d.appendChild(mk("div",null,'<div class="who">'+label+'</div><p>'+text+'</p>'));
  return d;
}

/* ---------- uppgiftskort ---------- */
function renderChallenge(st,si,c,ci){
  var card = mk("div","card");
  var passed = isPassed(si,ci);
  // huvud
  card.appendChild(mk("div","card-head",
    '<span class="tag tag-type">'+(TYPE_LABEL[c.type]||c.type)+'</span>'+
    '<span class="tag tag-'+c.grade+'">Nivå '+c.grade+'</span>'+
    '<span class="card-title">'+(c.title||"")+'</span>'));

  // sententia-block
  if(c.type==="sententia"){
    card.appendChild(mk("div","sententia",
      '<div class="la">&ldquo;'+c.la+'&rdquo;</div>'+
      '<div class="sv">'+c.sv+'</div>'+
      '<div class="ref">— '+c.ref+'</div>'+
      (c.note?'<div class="note">'+c.note+'</div>':'')));
  }
  if(c.body) card.appendChild(mk("div","card-body",c.body));
  if(c.la && c.type!=="sententia")
    card.appendChild(mk("div",null,'<span class="latin-chip">'+c.la+'</span>'));
  if(c.latin) card.appendChild(mk("div","hint",c.latin));
  if(c.q) card.appendChild(mk("div","q",c.q));
  if(c.hint) card.appendChild(mk("div","hint","Ledtråd: "+c.hint));

  // feedback-element
  var fb = mk("div","feedback");

  if(c.options){
    var opts = mk("div","opts");
    c.options.forEach(function(o,oi){
      var b = mk("button","opt",o);
      b.onclick = function(){ answerMC(st,si,c,ci,oi,opts,fb,card); };
      opts.appendChild(b);
    });
    card.appendChild(opts);
    card.appendChild(fb);
    if(passed){ // markera tidigare rätt svar
      lockOpts(opts, c.answer, c.answer);
      reveal(fb,"good",feedbackText(c,true));
    }
  } else if(c.reveal){
    // självrättande (analys / öppen)
    var rb = mk("div","reveal-box", "<strong>Vergilius svar:</strong><br>"+c.reveal);
    var showBtn = mk("button","btn","Visa Vergilius svar");
    var sg = mk("div","selfgrade");
    showBtn.onclick = function(){
      rb.classList.add("show"); showBtn.style.display="none"; sg.style.display="flex";
    };
    ["Jag klarade det","Delvis","Inte än"].forEach(function(lbl,k){
      var b=mk("button","btn",lbl);
      b.onclick=function(){ selfGrade(si,ci,c,k===0,fb,sg); };
      sg.appendChild(b);
    });
    sg.style.display="none";
    card.appendChild(showBtn); card.appendChild(rb); card.appendChild(sg); card.appendChild(fb);
    if(passed){ rb.classList.add("show"); showBtn.style.display="none"; reveal(fb,"good","Avklarad. Bär raden med dig."); }
  }
  return card;
}

function lockOpts(opts, chosen, correct){
  var bs = opts.querySelectorAll(".opt");
  for(var i=0;i<bs.length;i++){
    bs[i].disabled=true;
    if(i===correct) bs[i].classList.add("correct");
    else if(i===chosen) bs[i].classList.add("wrong");
  }
}
function feedbackText(c, good){
  return (good?"<b>Rēctē!</b> ":"<b>Inte riktigt.</b> ")+(c.explain||"");
}
function reveal(fb,kind,html){ fb.className="feedback show "+kind; fb.innerHTML=html; }

function answerMC(st,si,c,ci,oi,opts,fb,card){
  if(opts.querySelector(".opt[disabled]")) return; // redan svarat
  var good = oi===c.answer;
  lockOpts(opts, oi, c.answer);
  reveal(fb, good?"good":"bad", feedbackText(c,good));
  S.seenGrade[c.grade] = (S.seenGrade[c.grade]||0); // räknas via TOTAL istf
  if(good && !isPassed(si,ci)){ markPassed(si,ci,c); }
  else if(!good){
    // tillåt nytt försök efter kort stund (no-punishment retry)
    setTimeout(function(){
      var bs=opts.querySelectorAll(".opt");
      for(var i=0;i<bs.length;i++){ bs[i].disabled=false; bs[i].classList.remove("wrong","correct"); }
      fb.classList.remove("show");
    }, 2600);
  }
  afterAnswer(si,card);
}
function selfGrade(si,ci,c,good,fb,sg){
  sg.querySelectorAll(".btn").forEach(function(b){ b.disabled=true; });
  if(good){ reveal(fb,"good","<b>Bene.</b> Avklarad — du bär raden vidare."); if(!isPassed(si,ci)) markPassed(si,ci,c); }
  else reveal(fb,"bad","Ingen brådska. Läs Vergilius svar igen och försök på nytt när du vill.");
  afterAnswer(si, fb.closest(".stage-wrap"));
}
function markPassed(si,ci,c){
  S.passed[cidKey(si,ci)] = true;
  S.passGrade[c.grade] = (S.passGrade[c.grade]||0)+1;
  save();
}
function afterAnswer(si, scope){
  // uppdatera fot om kretsen klarats
  var foot = (scope||document).querySelector ? (scope.querySelector?scope.querySelector(".stage-foot"):null) : null;
  if(!foot) foot = el("stage-body").querySelector(".stage-foot");
  if(foot) updateFoot(foot,si);
}

function updateFoot(foot,si){
  foot.innerHTML="";
  var cleared = stageCleared(si);
  if(cleared && si===S.unlocked && si<INFERNO.stages.length-1){
    S.unlocked = si+1; save();
  }
  if(cleared){
    var st=INFERNO.stages[si];
    var next = si<INFERNO.stages.length-1;
    foot.appendChild(mk("div","cleared-banner",
      "&#10039; "+(st.final?"Resan är fullbordad — du ser stjärnorna igen.":"Kretsen är besegrad. Vägen vidare öppnas.")));
    if(next){
      var b=mk("button","btn btn-primary","Stig vidare &rarr; "+INFERNO.stages[si+1].sv);
      b.onclick=function(){ openStage(si+1); };
      foot.appendChild(b);
    } else {
      var b2=mk("button","btn btn-primary","Se din betygskompass");
      b2.onclick=openCompass; foot.appendChild(b2);
    }
    foot.appendChild(document.createElement("br"));
  }
  var m=mk("button","btn-link","Till nedstigningen");
  m.onclick=function(){ show("screen-map"); renderMap(); };
  foot.appendChild(m);
}

/* ---------- betygskompass ---------- */
function openCompass(){
  var body = el("compass-body"); body.innerHTML="";
  var desc = {
    E:"Återge och känna igen — <em>översiktligt</em>. Grunden: huvudinnehåll, basformer, mycket vanliga ord.",
    C:"Förklara och tillämpa — <em>utförligt</em>. Detaljer, säkrare grammatik, vanliga arvord i moderna språk.",
    A:"Analysera med nyans — <em>utförligt och nyanserat</em>. Komplexare företeelser, välgrundade tolkningar."
  };
  ["E","C","A"].forEach(function(g){
    var pass=S.passGrade[g]||0, tot=TOTAL[g]||0, pct=tot?Math.round(pass/tot*100):0;
    var done = pass>=tot && tot>0;
    var bar = mk("div","cbar",
      '<div class="cbar-head"><span class="lv">Nivå '+g+(done?' <span class="cbadge">&#10039;</span>':'')+'</span>'+
        '<span>'+pass+' / '+tot+'</span></div>'+
      '<div class="cbar-track"><div class="cbar-fill" style="width:'+pct+'%"></div></div>'+
      '<div class="cbar-desc">'+desc[g]+'</div>');
    body.appendChild(bar);
  });
  var clearedCount=0; for(var i=0;i<INFERNO.stages.length;i++) if(stageCleared(i)) clearedCount++;
  body.appendChild(mk("p","muted","Kretsar avklarade: <strong>"+clearedCount+" / "+INFERNO.stages.length+"</strong>. "+
    "Du passerar en krets på dess grundnivå; lös även C- och A-uppgifterna för att visa högre kunskap. "+
    "Kompassen speglar betygskriterierna men sätter inga betyg — den visar var du står."));
  el("compass-overlay").hidden=false;
}

/* ---------- init ---------- */
refreshTitle();
show("screen-title");
})();
