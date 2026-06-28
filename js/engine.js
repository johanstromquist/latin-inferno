/* ============================================================================
   LATIN INFERNO — spelmotor (v2)
   Interaktion: mc · cloze (skriv formen) · assemble (bygg raden) · self (analys).
   Klarvillkor: alla uppgifter UTOM A krävs (A = sann 100 %); must:true alltid.
   Ljud: Web Speech (ungefärligt) + alltid synlig klassisk uttalshjälp.
   ========================================================================== */
(function(){
"use strict";

var SAVE_KEY="latininferno_v2";
var ORDER={E:0,C:1,A:2};
var TYPE_LABEL={vocab:"Vocabularium",grammar:"Grammatica",concept:"Grammatica",
  translatio:"Translatio",hereditas:"Hereditas",sententia:"Sententia",lore:"Rōma",analysis:"Disputātiō"};
var ART={
  wood:"linear-gradient(160deg,#2a2113,#0c0a08)",gate:"linear-gradient(160deg,#241a12,#0a0706)",
  limbo:"linear-gradient(160deg,#1c2418,#0b0a07)",wind:"linear-gradient(160deg,#1d1822,#0a0809)",
  rain:"linear-gradient(160deg,#161c20,#08090a)",stones:"linear-gradient(160deg,#241d14,#0b0907)",
  styx:"linear-gradient(160deg,#10171a,#070908)",tombs:"linear-gradient(160deg,#2a160f,#0c0706)",
  forest:"linear-gradient(160deg,#1a140f,#080706)",bolge:"linear-gradient(160deg,#231a12,#0a0807)",
  ice:"linear-gradient(160deg,#16202a,#080a0c)",stars:"linear-gradient(160deg,#0e1530,#070611)"};
function artBg(k,f){ return "url('assets/img/"+f+"'), "+(ART[k]||"linear-gradient(160deg,#241d14,#0b0907)"); }

/* ---------- final-filmsekvens (cutscene): uppstigningen ur helvetet ---------- */
var CUTSCENE=[
  { id:1, frames:4, bg:"#0a0d16", frameMs:620, dur:6200, la:"",
    sv:"Längst ner i världen, fastfrusen i evig is, väntade Lucifer. Härifrån fanns blott en väg — uppåt.", ref:"" },
  { id:2, frames:4, bg:"#181410", frameMs:260, dur:5600, la:"",
    sv:"Vergilius gick före. Vi klättrade genom den dolda klyftan, ledda av en enda låga.", ref:"" },
  { id:3, frames:4, bg:"#0f1418", frameMs:520, dur:5200, la:"",
    sv:"Och i mörkret, långt fram — en glimt av dagsljus.", ref:"" },
  { id:4, frames:4, bg:"#16202a", frameMs:600, dur:5600, la:"",
    sv:"Vi steg ut på stranden vid gryningens berg. Luften var ren och full av ljus.", ref:"" },
  { id:5, frames:4, bg:"#0e1530", frameMs:560, dur:9500,
    la:"E quindi uscimmo a riveder le stelle", sv:"Och så kom vi ut, för att åter se stjärnorna. — Vale, discipule.",
    ref:"Dante, Inferno XXXIV, 139 · Vergilius tar farväl" }
];
var csState={timer:null,frameTimer:null};
function playCutscene(){ var ov=el("cutscene"); if(!ov) return; ov.hidden=false;
  el("cutscene-stage").classList.add("fading"); el("cutscene-cap").classList.add("cap-hidden");   // börja svart → fade in
  playScene(0); }
function playScene(i){
  var stage=el("cutscene-stage"), cap=el("cutscene-cap"), img=el("cutscene-frame");
  if(i>=CUTSCENE.length){ endCutscene(); return; }
  var sc=CUTSCENE[i], f=0, frame=function(n){ return "assets/cutscene/s"+sc.id+"f"+n+".jpg"; };
  el("cs-la").textContent=sc.la||""; el("cs-sv").textContent=sc.sv||""; el("cs-ref").textContent=sc.ref||"";
  stage.style.background=sc.bg;
  // ladda inkommande bild MEDAN scenen är svart; fade in FÖRST när den är klar (annars blinkar förra scenen)
  function begin(){
    requestAnimationFrame(function(){ stage.classList.remove("fading"); cap.classList.remove("cap-hidden"); });
    if(i+1<CUTSCENE.length){ var ns=CUTSCENE[i+1]; for(var k=1;k<=ns.frames;k++){ var pi=new Image(); pi.src="assets/cutscene/s"+ns.id+"f"+k+".jpg"; } }   // förladda nästa scen
    clearInterval(csState.frameTimer);
    csState.frameTimer=setInterval(function(){ f=(f+1)%sc.frames; img.src=frame(f+1); }, sc.frameMs);
    clearTimeout(csState.timer);
    csState.timer=setTimeout(function(){
      stage.classList.add("fading"); cap.classList.add("cap-hidden");
      setTimeout(function(){ clearInterval(csState.frameTimer); playScene(i+1); }, 1000);   // fade-out hinner klart
    }, sc.dur);
  }
  img.onload=function(){ img.onload=null; img.onerror=null; img.style.visibility="visible"; begin(); };
  img.onerror=function(){ img.onload=null; img.onerror=null; img.style.visibility="hidden"; begin(); };   // saknad bild → kör ändå (bg+text)
  img.src=frame(1);
}
function endCutscene(){ clearInterval(csState.frameTimer); clearTimeout(csState.timer);
  var ov=el("cutscene"); if(ov) ov.hidden=true; openCompass(); }

/* ---------- uttal (klassiskt) ---------- */
function toPhonetic(s){
  s=s.toLowerCase();
  // digit-token platshållare (inga bokstäver -> inga regler kan återprocessa dem)
  var rules=[
    ["qu","{10}"],["ph","{11}"],["th","{12}"],["ch","{13}"],["gn","{14}"],["x","{15}"],
    ["ae","{16}"],["oe","{17}"],["au","{18}"],
    ["ā","{20}"],["ē","{21}"],["ī","{22}"],["ō","{23}"],["ū","{24}"],
    ["ă","{20}"],["ĕ","{21}"],["ĭ","{22}"],["ŏ","{23}"],["ŭ","{24}"],
    ["a","{20}"],["e","{21}"],["i","{22}"],["o","{23}"],["u","{24}"],
    ["c","{30}"],["v","{31}"],["j","{32}"]
  ];
  for(var i=0;i<rules.length;i++) s=s.split(rules[i][0]).join(rules[i][1]);
  var exp={"{10}":"kw","{11}":"f","{12}":"t","{13}":"k","{14}":"ngn","{15}":"ks",
    "{16}":"eye","{17}":"oy","{18}":"ow",
    "{20}":"ah","{21}":"eh","{22}":"ee","{23}":"oh","{24}":"oo",
    "{30}":"k","{31}":"w","{32}":"y"};
  return s.replace(/\{\d+\}/g,function(t){return exp[t]||"";});
}
var canSpeak=("speechSynthesis" in window);
function speak(la){
  if(!canSpeak) return;
  try{
    window.speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(toPhonetic(la));
    u.lang="en-US"; u.rate=0.8; u.pitch=0.95;
    var vs=window.speechSynthesis.getVoices();
    for(var i=0;i<vs.length;i++){ if(/en[-_]/i.test(vs[i].lang)){ u.voice=vs[i]; break; } }
    window.speechSynthesis.speak(u);
  }catch(e){}
}
if(canSpeak && window.speechSynthesis.getVoices().length===0){ window.speechSynthesis.onvoiceschanged=function(){}; }

function pronEl(la){
  var wrap=mk("div","pron");
  wrap.appendChild(mk("span","pron-key","klass. uttal: "+toPhonetic(la)));
  if(canSpeak){
    var b=mk("button","pron-btn","&#9658; Lyssna");
    b.title="Ungefärligt — webbläsarens röst återger inte klassiskt latin exakt";
    b.onclick=function(){ speak(la); };
    wrap.appendChild(b);
  }
  return wrap;
}

/* ---------- state ---------- */
var S=load();
function load(){ try{var s=JSON.parse(localStorage.getItem(SAVE_KEY)); if(s&&s.v===2)return s;}catch(e){}
  return {v:2,unlocked:0,passed:{},passGrade:{E:0,C:0,A:0}}; }
function save(){ try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){} }
function cid(si,ci){ return si+"."+ci; }
function isPassed(si,ci){ return !!S.passed[cid(si,ci)]; }
// delad framgång från arkaden (Saxa Cadentia), samma origin
function ludusProgress(){ try{ return JSON.parse(localStorage.getItem("latininferno_ludus"))||{}; }catch(e){ return {}; } }
function ludusFmt(ms){ return ms?(ms/1000).toFixed(1)+"s":"–"; }

var TOTAL={E:0,C:0,A:0};
INFERNO.stages.forEach(function(st){ st.challenges.forEach(function(c){ TOTAL[c.grade]++; }); });

function requiredIdx(st){ var r=[]; st.challenges.forEach(function(c,i){ if(c.grade!=="A"||c.must) r.push(i); }); return r; }
function stageCleared(si){ var st=INFERNO.stages[si]; return requiredIdx(st).every(function(ci){return isPassed(si,ci);}); }
function stagePerfect(si){ var st=INFERNO.stages[si]; return st.challenges.every(function(c,ci){return isPassed(si,ci);}); }

/* ---------- dom helpers ---------- */
function el(id){return document.getElementById(id);}
function mk(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;}
function show(scr){ ["screen-title","screen-map","screen-stage"].forEach(function(s){el(s).classList.remove("active");});
  el(scr).classList.add("active"); window.scrollTo(0,0); }
function norm(s){ return (s||"").toLowerCase().trim().replace(/\s+/g," ")
  .replace(/ā/g,"a").replace(/ē/g,"e").replace(/ī/g,"i").replace(/ō/g,"o").replace(/ū/g,"u")
  .replace(/[.,;:!?]/g,""); }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)); var t=a[i];a[i]=a[j];a[j]=t;} return a; }

function firstMissHint(c){
  var k=c.crit;
  if(k==="grammar"||k==="concept") return "Tänk på kasus, genus och ändelsen — vilken form kräver satsen? Försök igen.";
  if(k==="vocab") return "Dra dig till minnes ordet och dess rot. Försök igen.";
  if(k==="modern") return "Vilket latinskt ord lever kvar i arvordet? Försök igen.";
  if(k==="text") return "Läs raden igen, ord för ord. Försök igen.";
  return "Tänk efter och försök igen.";
}

/* ---------- titel ---------- */
el("title-hero").style.backgroundImage=artBg("wood","wood.jpg");
function refreshTitle(){ el("btn-continue").hidden = !(S.unlocked>0||Object.keys(S.passed).length>0); }
el("btn-start").onclick=function(){ openStage(0); };
el("btn-continue").onclick=function(){ show("screen-map"); renderMap(); };
el("btn-about").onclick=function(){ el("about-overlay").hidden=false; };
el("about-close").onclick=function(){ el("about-overlay").hidden=true; };
el("btn-to-title").onclick=function(){ show("screen-title"); refreshTitle(); };
el("btn-compass").onclick=openCompass;
el("compass-close").onclick=function(){ el("compass-overlay").hidden=true; };
el("btn-to-map").onclick=function(){ show("screen-map"); renderMap(); };
el("cutscene-skip").onclick=endCutscene;

/* ---------- kartan (nedstigningen) ---------- */
function renderMap(){
  var list=el("map-list"); list.innerHTML=""; var n=INFERNO.stages.length;
  INFERNO.stages.forEach(function(st,si){
    var locked=si>S.unlocked, done=stageCleared(si), perfect=stagePerfect(si);
    var depth=n>1?si/(n-1):0;
    var node=mk("li","map-node"+(locked?" locked":"")+(done?" done":""));
    node.style.setProperty("--d",depth.toFixed(3));
    node.style.marginLeft=(depth*7).toFixed(1)+"%";
    node.style.marginRight=(depth*7).toFixed(1)+"%";
    var art=mk("div","node-art"); art.style.backgroundImage=artBg(st.art,st.art+".jpg");
    var lp=ludusProgress()[st.id], trained=lp&&lp.cleared;
    var body=mk("div","node-body",
      '<div class="node-roman">'+st.roman+'</div>'+
      '<div class="node-title">'+st.sv+'</div>'+
      '<div class="node-focus">'+st.focus+'</div>'+
      (trained?'<div class="node-train ludus-trained">&#9876; tränad · '+ludusFmt(lp.bestTime)+' · '+(lp.bestMoves||'–')+' drag</div>':''));
    node.appendChild(art); node.appendChild(body);
    node.appendChild(mk("div", locked?"node-lock":("node-status"+(done?" cleared":"")),
      locked?"&#128274;":(perfect?"&#10039; 100%":(done?"&#10003; klar":"&rarr;"))));
    if(!locked) node.onclick=function(){ openStage(si); };
    list.appendChild(node);
  });
}

/* ---------- en krets ---------- */
function openStage(si){
  show("screen-stage");
  var st=INFERNO.stages[si];
  el("stage-bar-title").textContent=st.roman;
  var wrap=el("stage-body"); wrap.innerHTML="";
  var hero=mk("div","stage-hero"); hero.style.backgroundImage=artBg(st.art,st.art+".jpg");
  hero.appendChild(mk("div","stage-hero-cap",
    '<div class="stage-roman">'+st.roman+'</div>'+
    '<div class="stage-h">'+st.sv+'</div>'+
    '<div class="stage-sub">'+st.subtitle+'</div>'+
    '<div class="stage-focus">'+st.focus+'</div>'));
  wrap.appendChild(hero);
  var body=mk("div","stage-wrap"); wrap.appendChild(body);

  body.appendChild(dialog("dante","dante.png","Dante",st.intro.dante,true));
  body.appendChild(dialog("virgil","virgil.png","Vergilius, magister",st.intro.virgil,false));

  var v=st.intro.line;
  var versus=mk("div","versus",
    '<div class="la">&ldquo;'+v.la+'&rdquo;</div>'+
    '<div class="sv">'+v.sv+'</div>'+
    '<div class="ref">— '+v.ref+'</div>');
  versus.appendChild(pronEl(v.la));
  body.appendChild(versus);

  var lp=ludusProgress()[st.id];
  var train=mk("a","ludus-banner"); train.href="ludus/index.html?level="+st.id;
  train.innerHTML='<span class="lb-icon">&#9876;</span>'+
    '<span class="lb-text"><b>Träna denna paradigm</b> i Saxa Cadentia'+
    '<small>'+st.focus+(lp&&lp.cleared?' · <span class="ludus-trained">&#10003; tränad ('+ludusFmt(lp.bestTime)+' · '+(lp.bestMoves||'–')+' drag)</span>':'')+'</small></span>'+
    '<span class="lb-go">&rarr;</span>';
  body.appendChild(train);

  st.challenges.forEach(function(c,ci){ body.appendChild(renderChallenge(st,si,c,ci)); });

  var foot=mk("div","stage-foot"); body.appendChild(foot); updateFoot(foot,si);
}

function dialog(who,img,label,text,drop){
  var d=mk("div","dialog "+(who==="dante"?"dante":""));
  var av=mk("div","avatar"); av.style.backgroundImage="url('assets/img/"+img+"')";
  d.appendChild(av);
  var p=drop?('<p class="dropcap">'+text+'</p>'):('<p>'+text+'</p>');
  d.appendChild(mk("div",null,'<div class="who">'+label+'</div>'+p));
  return d;
}

/* ---------- uppgiftskort ---------- */
function renderChallenge(st,si,c,ci){
  var card=mk("div","card"); var passed=isPassed(si,ci);
  card.appendChild(mk("div","card-head",
    '<span class="tag tag-type">'+(TYPE_LABEL[c.type]||c.type)+'</span>'+
    '<span class="tag tag-'+c.grade+'">Nivå '+c.grade+(c.must?' · obligatorisk':'')+'</span>'+
    '<span class="card-title">'+(c.title||"")+'</span>'));
  if(c.act) card.appendChild(mk("div","act","&#10148; "+c.act));

  if(c.type==="sententia"){
    var sen=mk("div","sententia",
      '<div class="la">&ldquo;'+c.la+'&rdquo;</div>'+
      '<div class="sv">'+c.sv+'</div>'+
      '<div class="ref">— '+c.ref+'</div>'+(c.note?'<div class="note">'+c.note+'</div>':''));
    sen.appendChild(pronEl(c.la)); card.appendChild(sen);
  }
  if(c.body) card.appendChild(mk("div","card-body",c.body));
  if(c.la && c.type!=="sententia"){
    card.appendChild(mk("div",null,'<span class="latin-chip">'+c.la+'</span>'));
    card.appendChild(pronEl(c.la));
  }
  if(c.latin) card.appendChild(mk("div","hint",c.latin));
  if(c.q) card.appendChild(mk("div","q",c.q));
  if(c.hint) card.appendChild(mk("div","hint","Ledtråd: "+c.hint));

  var fb=mk("div","feedback");

  if(c.options) buildMC(card,fb,st,si,c,ci,passed);
  else if(c.accept) buildCloze(card,fb,si,c,ci,passed);
  else if(c.solution) buildAssemble(card,fb,si,c,ci,passed);
  else if(c.reveal) buildSelf(card,fb,si,c,ci,passed);

  card.appendChild(fb);
  return card;
}

function reveal(fb,kind,html){ fb.className="feedback show "+kind; fb.innerHTML=html; }
function pass(si,ci,c,fb,msg){ if(!isPassed(si,ci)){ S.passed[cid(si,ci)]=true; S.passGrade[c.grade]=(S.passGrade[c.grade]||0)+1; save(); }
  reveal(fb,"good",msg||("<b>Rēctē!</b> "+(c.explain||""))); refreshFoot(si); }

/* MC: första miss = regelhint utan att avslöja rätt; andra miss = avslöja */
function buildMC(card,fb,st,si,c,ci,passed){
  var opts=mk("div","opts"); var attempts=0; var locked=false;
  c.options.forEach(function(o,oi){
    var b=mk("button","opt",o);
    b.onclick=function(){
      if(locked) return;
      if(oi===c.answer){ for(var k=0;k<opts.children.length;k++){opts.children[k].disabled=true;} b.classList.add("correct"); locked=true; pass(si,ci,c,fb); }
      else{
        attempts++;
        if(attempts>=2){
          b.classList.add("wrong");
          for(var k=0;k<opts.children.length;k++){ if(k===c.answer) opts.children[k].classList.add("correct"); opts.children[k].disabled=true; }
          locked=true; reveal(fb,"bad","<b>Inte riktigt.</b> "+(c.explain||""));
        } else {
          // första miss: visa regelhint, men avslöja inte rätt — rensa valet och låt alla vara klickbara
          b.classList.add("wrong");
          reveal(fb,"bad",(c.actMiss?("<i>"+c.actMiss+"</i> "):"")+firstMissHint(c));
          (function(btn){ setTimeout(function(){ btn.classList.remove("wrong"); fb.classList.remove("show"); },1400); })(b);
        }
      }
    };
    opts.appendChild(b);
  });
  card.appendChild(opts);
  if(passed){ for(var k=0;k<opts.children.length;k++){ opts.children[k].disabled=true; if(k===c.answer)opts.children[k].classList.add("correct"); } reveal(fb,"good","<b>Avklarad.</b> "+(c.explain||"")); }
}

/* CLOZE: skriv formen */
function buildCloze(card,fb,si,c,ci,passed){
  var row=mk("div","cloze");
  var inp=document.createElement("input"); inp.type="text"; inp.className="cloze-input";
  inp.placeholder=c.placeholder||"skriv på latin…"; inp.autocapitalize="off"; inp.autocomplete="off"; inp.spellcheck=false;
  var btn=mk("button","btn","Svara"); var attempts=0;
  function submit(){
    if(isPassed(si,ci)) return;
    var ok=c.accept.some(function(a){ return norm(a)===norm(inp.value); });
    if(ok){ inp.disabled=true; btn.disabled=true; inp.classList.add("ok"); pass(si,ci,c,fb,"<b>Rēctē! </b><span class='ans'>"+c.answerLabel+"</span> — "+(c.explain||"")); }
    else{ attempts++; inp.classList.add("bad");
      if(attempts>=2) reveal(fb,"bad","<b>Rätt form:</b> <span class='ans'>"+c.answerLabel+"</span>. "+(c.explain||""));
      else reveal(fb,"bad",(c.actMiss?("<i>"+c.actMiss+"</i> "):"")+firstMissHint(c));
      setTimeout(function(){ inp.classList.remove("bad"); },1200);
    }
  }
  btn.onclick=submit;
  inp.addEventListener("keydown",function(e){ if(e.key==="Enter") submit(); });
  row.appendChild(inp); row.appendChild(btn); card.appendChild(row);
  if(passed){ inp.value=c.answerLabel; inp.disabled=true; btn.disabled=true; inp.classList.add("ok"); reveal(fb,"good","<b>Avklarad.</b> "+(c.explain||"")); }
}

/* ASSEMBLE: bygg raden i fast ordning, positionsfeedback */
function buildAssemble(card,fb,si,c,ci,passed){
  var sol=c.solution; var placed=[];
  card.appendChild(mk("div","assemble-prompt",c.assemblePrompt||"Bygg raden i rätt ordning:"));
  var answer=mk("div","assemble-answer");
  var bank=mk("div","assemble-bank");
  var ctl=mk("div","assemble-ctl");
  var check=mk("button","btn","Kontrollera"); var clear=mk("button","btn-link","Rensa");
  ctl.appendChild(check); ctl.appendChild(clear);
  var shuffled=shuffle(sol);
  function tile(word){ var t=mk("button","tile",word); return t; }
  function redraw(){
    answer.innerHTML=""; bank.innerHTML="";
    placed.forEach(function(w,idx){ var t=tile(w); t.classList.add("placed"); t.onclick=function(){ placed.splice(idx,1); redraw(); }; answer.appendChild(t); });
    var used={}; placed.forEach(function(w){ used[w]=(used[w]||0)+1; });
    var seen={};
    shuffled.forEach(function(w){ seen[w]=(seen[w]||0)+1; if(seen[w]>(used[w]||0)){ var t=tile(w); t.onclick=function(){ placed.push(w); redraw(); }; bank.appendChild(t); } });
  }
  function sameMulti(a,b){ if(a.length!==b.length) return false; var x=a.slice().sort(),y=b.slice().sort(); for(var i=0;i<x.length;i++) if(x[i]!==y[i]) return false; return true; }
  check.onclick=function(){
    if(placed.length<sol.length){ reveal(fb,"bad","Det fattas ord — placera alla "+sol.length+" orden först."); return; }
    if(c.freeOrder){ // valfri ordföljd (ev. med verbet sist) — accepterar alla giltiga latinska ordföljder
      var multiOk=sameMulti(placed,sol);
      var lastOk=!c.pinLast || placed[placed.length-1]===sol[sol.length-1];
      if(multiOk && lastOk){ lock(); pass(si,ci,c,fb,"<b>Rēctē!</b> &ldquo;"+placed.join(" ")+"&rdquo; — "+(c.explain||"")); }
      else if(!multiOk) reveal(fb,"bad","Använd exakt de givna orden — något är fel eller saknas.");
      else reveal(fb,"bad",(c.pinHint||"Verbet ska stå sist i latinet.")+" Flytta och försök igen.");
      return;
    }
    var right=0; for(var i=0;i<sol.length;i++) if(placed[i]===sol[i]) right++;
    if(right===sol.length){ lock(); pass(si,ci,c,fb,"<b>Rēctē!</b> &ldquo;"+sol.join(" ")+"&rdquo; — "+(c.explain||"")); }
    else reveal(fb,"bad",(c.actMiss?("<i>"+c.actMiss+"</i> "):"")+"<b>"+right+" av "+sol.length+"</b> på rätt plats. Flytta orden och försök igen.");
  };
  clear.onclick=function(){ placed=[]; redraw(); fb.classList.remove("show"); };
  function lock(){ check.disabled=true; clear.style.display="none";
    var bs=answer.querySelectorAll(".tile"); for(var i=0;i<bs.length;i++) bs[i].disabled=true; bank.innerHTML=""; }
  card.appendChild(answer); card.appendChild(bank); card.appendChild(ctl);
  if(passed){ placed=sol.slice(); redraw(); lock(); reveal(fb,"good","<b>Avklarad.</b> &ldquo;"+sol.join(" ")+"&rdquo;"); }
  else redraw();
}

/* SELF: analys (A) */
function buildSelf(card,fb,si,c,ci,passed){
  var rb=mk("div","reveal-box","<strong>Vergilius svar:</strong><br>"+c.reveal);
  var showBtn=mk("button","btn","Visa Vergilius svar");
  var sg=mk("div","selfgrade");
  showBtn.onclick=function(){ rb.classList.add("show"); showBtn.style.display="none"; sg.style.display="flex"; };
  ["Jag resonerade så här / klarade det","Inte än"].forEach(function(lbl,k){
    var b=mk("button","btn",lbl);
    b.onclick=function(){ sg.querySelectorAll(".btn").forEach(function(x){x.disabled=true;});
      if(k===0) pass(si,ci,c,fb,"<b>Bene.</b> Avklarad — du bär raden vidare.");
      else reveal(fb,"bad","Ingen brådska. Läs svaret igen och försök på nytt när du vill.");
    };
    sg.appendChild(b);
  });
  sg.style.display="none";
  card.appendChild(showBtn); card.appendChild(rb); card.appendChild(sg);
  if(passed){ rb.classList.add("show"); showBtn.style.display="none"; reveal(fb,"good","Avklarad."); }
}

/* ---------- fot ---------- */
function refreshFoot(si){ var foot=el("stage-body").querySelector(".stage-foot"); if(foot) updateFoot(foot,si); }
function updateFoot(foot,si){
  foot.innerHTML="";
  var cleared=stageCleared(si);
  if(cleared && si===S.unlocked && si<INFERNO.stages.length-1){ S.unlocked=si+1; save(); }
  if(cleared){
    var st=INFERNO.stages[si]; var next=si<INFERNO.stages.length-1;
    foot.appendChild(mk("div","cleared-banner",
      "&#10039; "+(st.final?"Resan är fullbordad — du ser stjärnorna igen."
        :"Kretsen är besegrad. Vägen vidare öppnas.")+
      (stagePerfect(si)?" <span class='perfect'>(100 % — även A-uppgifterna)</span>":"")));
    if(next){ var b=mk("button","btn btn-primary","Stig vidare &rarr; "+INFERNO.stages[si+1].sv);
      b.onclick=function(){ openStage(si+1); }; foot.appendChild(b); }
    else {
      var cb=mk("button","btn btn-primary","&#9656; Se finalen"); cb.onclick=function(){ playCutscene(); }; foot.appendChild(cb);
      var b2=mk("button","btn","Se din betygskompass"); b2.onclick=openCompass; foot.appendChild(b2);
      if(!S.sawFinale){ S.sawFinale=true; save(); setTimeout(playCutscene,700); }   // spela en gång automatiskt
    }
    foot.appendChild(document.createElement("br"));
  } else {
    var req=requiredIdx(INFERNO.stages[si]).filter(function(ci){return !isPassed(si,ci);}).length;
    foot.appendChild(mk("div","muted small","Lös kretsens uppgifter (utom A) för att stiga vidare — "+req+" kvar."));
  }
  var m=mk("button","btn-link","Till nedstigningen"); m.onclick=function(){ show("screen-map"); renderMap(); }; foot.appendChild(m);
}

/* ---------- betygskompass ---------- */
function openCompass(){
  var body=el("compass-body"); body.innerHTML="";
  var desc={E:"Återge och känna igen — <em>översiktligt</em>.",
    C:"Förklara och tillämpa — <em>utförligt</em>.",
    A:"Analysera med nyans — <em>utförligt och nyanserat</em>."};
  ["E","C","A"].forEach(function(g){
    var p=S.passGrade[g]||0,t=TOTAL[g]||0,pct=t?Math.round(p/t*100):0,done=p>=t&&t>0;
    body.appendChild(mk("div","cbar",
      '<div class="cbar-head"><span class="lv">Nivå '+g+(done?' <span class="cbadge">&#10039;</span>':'')+'</span><span>'+p+' / '+t+'</span></div>'+
      '<div class="cbar-track"><div class="cbar-fill" style="width:'+pct+'%"></div></div>'+
      '<div class="cbar-desc">'+desc[g]+'</div>'));
  });
  var cc=0; for(var i=0;i<INFERNO.stages.length;i++) if(stageCleared(i)) cc++;
  body.appendChild(mk("p","muted","Kretsar avklarade: <strong>"+cc+" / "+INFERNO.stages.length+"</strong>. "+
    "Du passerar en krets genom att lösa allt utom A-uppgifterna; ta även A för sann 100 %. "+
    "Kompassen speglar betygskriterierna men sätter inga betyg."));
  el("compass-overlay").hidden=false;
}

/* ---------- init ---------- */
refreshTitle(); show("screen-title");
// djuplänk från arkadens final (Saxa Cadentia → Ad Astra) → spela finalfilmen
try{ if(new URLSearchParams(location.search).get("cutscene")){ setTimeout(playCutscene,350); } }catch(e){}
})();
