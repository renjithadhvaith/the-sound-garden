/* Tongue Studio — whole-tongue vowel model for The Sound Garden.
   Coordinates are an illustrative midsagittal schematic (viewBox 440x290, lips left, pharynx right),
   not measured data. Edit VOWELS to add or tune vowels. */
(function(){
const $=(s,r=document)=>r.querySelector(s), cl=(x,a,b)=>Math.max(a,Math.min(b,x)), lp=(a,b,t)=>a+(b-a)*t;
const COL={y:'#f2c94c',o:'#e7873f',b:'#5d8fcf'};
const RN=['tip','blade','front','dorsum','root'];
const RL={tip:'Tip',blade:'Blade',front:'Front body',dorsum:'Dorsum',root:'Root'};
const REST={pts:[[100,200],[135,198],[180,194],[235,194],[300,222]],jaw:.05,round:0,spread:.3}; /* resting tongue: where every animation starts */
/* pts = tip, blade, front body, dorsum, root. zones: y primary, o supporting, b relaxed.
   arrows = [anchor, dx, dy, label]. jaw/round/spread are 0..1. */
const VOWELS={
 i:{sym:'i',say:'see',label:'ee',pts:[[100,186],[135,150],[180,118],[235,128],[284,205]],jaw:.2,round:0,spread:1,
  zones:{tip:'b',blade:'o',front:'y',dorsum:'o',root:'y'},
  arrows:[['front',0,-24,'front body rises'],['root',-22,0,'root advances'],['lips',0,0,'lips spread']],
  cav:'Front cavity small and slit-like; back (pharyngeal) cavity wide.',
  focus:'Keep the tip low; lift and forward-shift the front body.',
  err:{pts:[[104,132],[140,158],[180,160],[235,172],[305,214]],jaw:.2,round:0,spread:1,name:'Lifting the tip toward the ridge',fix:'Rest the tip behind the lower teeth and raise the front body instead.'}},
 e:{sym:'e',say:'bed',label:'eh',pts:[[100,188],[135,160],[180,135],[235,145],[292,208]],jaw:.4,round:0,spread:.6,
  zones:{tip:'b',blade:'o',front:'y',dorsum:'o',root:'b'},
  arrows:[['front',0,-14,'front body moderately high'],['jaw',0,10,'jaw opens a little more']],
  cav:'Front cavity a little larger than for /i/; pharynx still fairly open.',
  focus:'Aim the front body a little lower than for “ee”; let the jaw open slightly.',
  err:{pts:[[104,150],[138,165],[180,168],[235,162],[296,210]],jaw:.4,round:0,spread:.6,name:'Pointing the tip up',fix:'Keep the tip down and raise only the front body, a little.'}},
 a:{sym:'a',say:'father',label:'ah',pts:[[100,200],[135,200],[180,205],[240,210],[318,225]],jaw:1,round:0,spread:.2,
  zones:{tip:'b',blade:'b',front:'o',dorsum:'y',root:'o'},
  arrows:[['dorsum',0,22,'tongue body lowers'],['jaw',0,24,'jaw lowers'],['root',14,6,'root retracts']],
  cav:'Front cavity wide open; back (pharyngeal) cavity narrow.',
  focus:'Let the tongue body lower; open the jaw rather than pulling the tip back.',
  err:{pts:[[135,172],[152,192],[185,205],[240,210],[318,225]],jaw:.45,round:0,spread:.2,name:'Pulling the tip back',fix:'Open the jaw and let the whole body sink; leave the tip where it is.'}},
 o:{sym:'o',say:'go',label:'oh',pts:[[100,195],[135,185],[180,170],[250,128],[308,205]],jaw:.45,round:.8,spread:0,
  zones:{tip:'b',blade:'b',front:'o',dorsum:'y',root:'o'},
  arrows:[['dorsum',16,-22,'dorsum raises and retracts'],['lips',-14,0,'lips round']],
  cav:'Front cavity lengthened by rounded lips; back cavity moderate.',
  focus:'Raise the back of the tongue and round the lips; keep the tip flat.',
  err:{pts:[[112,140],[145,165],[190,172],[250,130],[308,205]],jaw:.45,round:.4,spread:0,name:'Curling the tip up',fix:'Let the tip rest low; the lift comes from the dorsum.'}},
 u:{sym:'u',say:'food',label:'oo',pts:[[100,195],[135,190],[180,172],[255,112],[302,198]],jaw:.2,round:1,spread:0,
  zones:{tip:'b',blade:'b',front:'o',dorsum:'y',root:'o'},
  arrows:[['dorsum',16,-24,'dorsum gathers up and back'],['lips',-18,0,'lips strongly rounded']],
  cav:'Narrow outlet at the rounded lips; front cavity long, back cavity small.',
  focus:'Gather the back/dorsum upward and round the lips; do not curl the tip.',
  err:{pts:[[110,125],[145,150],[185,165],[255,128],[305,205]],jaw:.2,round:1,spread:0,name:'Curling the tip',fix:'Keep the tip low and flat; raise the dorsum and push the lips forward.'}},
 I:{sym:'ɪ',say:'sit',label:'sit',pts:[[100,188],[135,156],[180,128],[235,136],[288,206]],jaw:.28,round:0,spread:.6,
  zones:{tip:'b',blade:'b',front:'y',dorsum:'o',root:'o'},
  arrows:[['front',0,-16,'front body high, a little lower than /iː/'],['jaw',0,6,'jaw slightly more open']],
  cav:'Front cavity small but a little roomier than for /iː/; pharynx fairly wide.',
  focus:'Relax and keep it short: aim just below “ee”, lips only lightly spread.',
  err:{pts:[[100,186],[135,150],[180,118],[235,128],[284,205]],jaw:.2,round:0,spread:1,name:'Drifting up to a tense “ee”',fix:'Let the front body sink a touch and relax the lips; keep it short.'}},
 ae:{sym:'æ',say:'cat',label:'cat',pts:[[100,196],[135,184],[180,172],[238,186],[308,218]],jaw:.85,round:0,spread:.8,
  zones:{tip:'b',blade:'o',front:'y',dorsum:'o',root:'b'},
  arrows:[['front',0,16,'front body low but forward'],['jaw',0,20,'jaw drops'],['lips',0,0,'lips spread wide']],
  cav:'Front cavity large; back cavity medium, narrower than for /e/.',
  focus:'Drop the jaw and keep the front of the tongue forward and low. Not あ (too far back) and not え (too high).',
  err:{pts:[[102,200],[137,200],[182,205],[240,210],[318,225]],jaw:.85,round:0,spread:.8,name:'Sliding back to “ah”',fix:'Keep the front body forward and spread the lips; do not retract.'}},
 A:{sym:'ʌ',say:'cup',label:'cup',pts:[[100,194],[135,186],[180,176],[238,174],[304,216]],jaw:.6,round:0,spread:.3,
  zones:{tip:'b',blade:'b',front:'o',dorsum:'y',root:'o'},
  arrows:[['dorsum',0,12,'central body lowers'],['jaw',0,14,'jaw half open']],
  cav:'Front cavity medium-large; back cavity medium.',
  focus:'Short and relaxed: jaw half open, tongue body low in the middle, not far back.',
  err:{pts:[[102,200],[137,200],[182,206],[240,212],[318,226]],jaw:.85,round:0,spread:.2,name:'Sliding far back, wide and long',fix:'Keep it short and central: less jaw opening, less retraction.'}},
 er:{sym:'ɜ',say:'bird',label:'bird',pts:[[100,190],[135,176],[180,156],[240,152],[298,208]],jaw:.4,round:0,spread:.2,
  zones:{tip:'b',blade:'b',front:'o',dorsum:'y',root:'o'},
  arrows:[['lips',0,0,'lips neutral'],['dorsum',0,-6,'body centred, mid height']],
  cav:'Front and back cavities both medium: an even, open tube.',
  focus:'Centre the tongue body, jaw about half open, lips neutral. US “bird” adds r-colouring by bunching the body and drawing the root back; the tip stays out of the way.',
  err:{pts:[[100,200],[135,200],[180,205],[240,210],[318,225]],jaw:.9,round:0,spread:.2,name:'Opening to a full “ah” (アー)',fix:'Stay half open with the body central, not low and back.'}},
 sh:{sym:'ə',say:'about',label:'about',pts:[[100,192],[135,180],[180,165],[236,162],[300,208]],jaw:.4,round:0,spread:.3,
  zones:{tip:'b',blade:'b',front:'b',dorsum:'o',root:'b'},
  arrows:[['lips',0,0,'lips neutral'],['jaw',0,0,'jaw barely moves']],
  cav:'An even, medium tube: nothing is pushed to an extreme.',
  focus:'Do almost nothing: a relaxed, short, quiet tongue in mid position.',
  err:{pts:[[100,200],[135,200],[180,205],[240,210],[318,225]],jaw:.9,round:0,spread:.2,name:'Giving it a full vowel',fix:'Keep it weak and quick; do not aim at any target.'}},
 U:{sym:'ʊ',say:'foot',label:'foot',pts:[[100,194],[135,188],[180,170],[252,122],[300,200]],jaw:.3,round:.55,spread:0,
  zones:{tip:'b',blade:'b',front:'o',dorsum:'y',root:'o'},
  arrows:[['dorsum',12,-16,'dorsum up and back, a bit lower than /uː/'],['lips',-8,0,'lips lightly rounded']],
  cav:'Front cavity long with a moderate lip opening; back cavity small to medium.',
  focus:'Short and relaxed: dorsum up and back, lips only lightly rounded, less tense than “oo”.',
  err:{pts:[[100,195],[135,190],[180,172],[255,112],[302,198]],jaw:.2,round:1,spread:0,name:'Tensing into a long “oo”',fix:'Relax the lips and let the dorsum drop a little; keep it short.'}},
 aw:{sym:'ɔ',say:'law',label:'law',pts:[[100,197],[135,190],[182,180],[252,150],[312,215]],jaw:.7,round:.6,spread:0,
  zones:{tip:'b',blade:'b',front:'o',dorsum:'y',root:'o'},
  arrows:[['dorsum',14,-10,'dorsum back, moderately raised'],['jaw',0,14,'jaw more open than /o/'],['lips',-10,0,'lips rounded']],
  cav:'Front cavity fairly large, lengthened by rounding; back cavity small to medium.',
  focus:'Open the jaw more than for “oh”, round the lips, and hold it long.',
  err:{pts:[[100,190],[135,182],[180,168],[250,140],[308,208]],jaw:.6,round:.15,spread:0,name:'Not rounding enough (オ)',fix:'Open the jaw and round the lips; keep it long.'}}
};
const PAIRS=[['i','a'],['i','u'],['e','o'],['u','a'],['i','I'],['ae','e']];
const KEY={'iː':'i','ɪ':'I','e':'e','æ':'ae','ʌ':'A','ɑː':'a','ɔː':'aw','ʊ':'U','uː':'u','ɜː':'er','ə':'sh'}; /* chart vowels that map to a studio vowel */
const st={mode:'vowel',v:'i',pair:0,t:0,dir:1,play:!matchMedia('(prefers-reduced-motion:reduce)').matches,slow:false};

const css=`.studio{margin-top:40px;background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--border);border-radius:18px;padding:20px}
.studio h2{font-family:var(--font-display);font-weight:600;font-size:24px;margin:0 0 6px}.studio p{color:var(--parchment-dim);font-size:14px;line-height:1.55;margin:0 0 12px;max-width:68ch}
.studio .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0}
.studio .chip{font-size:13px;font-weight:600;color:var(--parchment-dim);background:var(--ink-1);border:1px solid var(--border-soft);border-radius:10px;padding:7px 12px}
.studio .chip[aria-pressed=true],.studio .chip[aria-selected=true]{background:var(--bud-amber);color:var(--soil-900);border-color:var(--bud-amber)}
.studio .grid{display:grid;grid-template-columns:1.5fr 1fr;gap:18px}@media(max-width:820px){.studio .grid{grid-template-columns:1fr}}
.studio svg{width:100%;height:auto;display:block;background:var(--ink-0);border:1px solid var(--border-soft);border-radius:14px}
.studio .info{background:var(--ink-1);border:1px solid var(--border-soft);border-left:3px solid var(--bud-amber);border-radius:10px;padding:13px 15px;margin-bottom:14px}
.studio .info h3{margin:0 0 6px;font-family:var(--font-display);font-size:19px}.studio .info p{margin:0 0 6px;font-size:13.5px}
.studio .ctl{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:12px;font-size:13px;color:var(--parchment-dim)}
.studio input[type=range]{flex:1;min-width:140px;accent-color:var(--bud-amber)}
.studio .key{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--parchment-dim)}.studio .key i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px}
.studio .hl{stroke:var(--ink-0);stroke-width:3;paint-order:stroke}.studio .tl{fill:var(--parchment)}.studio .ar{fill:var(--arrow)}.studio .lb{fill:var(--parchment-dim)}.studio .al{stroke:var(--parchment)}.studio .am{fill:var(--parchment)}
.studio .guide{margin-top:18px;background:var(--ink-1);border:1px solid var(--border-soft);border-radius:12px;padding:14px 16px}.studio .guide summary{cursor:pointer;font-weight:700;font-size:15px}.studio .guide h4{margin:14px 0 4px}.studio .guide ul{margin:0 0 10px;padding-left:20px;color:var(--parchment-dim);font-size:14px;line-height:1.6}
.studio a{color:var(--root-blue)}.studio h4{margin:0 0 6px;font-size:14px}`;

function mix(A,B,t){return{pts:A.pts.map((p,i)=>[lp(p[0],B.pts[i][0],t),lp(p[1],B.pts[i][1],t)]),jaw:lp(A.jaw,B.jaw,t),round:lp(A.round,B.round,t),spread:lp(A.spread,B.spread,t)}}
function spline(p){let d='M'+p[0];for(let i=0;i<p.length-1;i++){const a=p[Math.max(i-1,0)],b=p[i],c=p[i+1],e=p[Math.min(i+2,p.length-1)];
 d+=` C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6} ${c[0]} ${c[1]}`}return d}
function body(m){const p=m.pts,yb=248+m.jaw*14;return spline(p)+` L${p[4][0]+4} ${yb+8} L128 ${yb} L${p[0][0]-6} ${p[0][1]+24} Z`}

function setup(){const A=st.mode==='contrast'?VOWELS[PAIRS[st.pair][0]]:null;
 if(st.mode==='vowel'){st.from=REST;st.to=VOWELS[st.v];st.zones=st.to.zones;st.ghost=null}
 else if(st.mode==='mistake'){st.to=VOWELS[st.v];st.from=st.to.err;st.zones=st.to.zones;st.ghost=st.from}
 else if(st.mode==='contrast'){const B=VOWELS[PAIRS[st.pair][1]];st.from=A;st.to=B;st.ghost=null;
  const d=RN.map((r,i)=>[r,Math.hypot(A.pts[i][0]-B.pts[i][0],A.pts[i][1]-B.pts[i][1])]).sort((a,b)=>b[1]-a[1]);
  st.zones={};d.forEach(([r,v],k)=>st.zones[r]=k<2?'y':(k==2&&v>12?'o':'b'));st.big=d.slice(0,2).map(x=>RL[x[0]]);}
 st.t=0;st.dir=1;info();draw()}

function info(){const v=VOWELS[st.v],i=$('#st-info');let h='';
 if(st.mode==='vowel')h=`<h3>/${v.sym}/ as in “${v.label}” <button class="chip" id="st-hear">Hear “${v.say}”</button></h3><p><b>What to focus on:</b> ${v.focus}</p><p>${v.cav}</p>`;
 if(st.mode==='mistake')h=`<h3>Habit: ${v.err.name}</h3><p>The red ghost is the habit; the live tongue moves to the target.</p><p><b>Correction:</b> ${v.err.fix}</p>`;
 if(st.mode==='contrast'){const [a,b]=PAIRS[st.pair],A=VOWELS[a],B=VOWELS[b],x=[];
  if(Math.abs(A.jaw-B.jaw)>.3)x.push('jaw '+(B.jaw>A.jaw?'opens':'closes'));if(Math.abs(A.round-B.round)>.4)x.push('lips '+(B.round>A.round?'round':'unround'));
  h=`<h3>/${A.sym}/ ↔ /${B.sym}/</h3><p>Yellow marks what changes most: <b>${st.big.join(' and ')}</b>${x.length?'; also '+x.join(', '):''}. Blue regions barely move.</p>`}
 i.innerHTML=h;const hb=$('#st-hear');if(hb)hb.onclick=()=>window.say&&window.say(v.say)}

function lens(m){const p=m.pts,f=cl(((p[2][1]+p[3][1])/2-94)/120,.06,1),b=cl((343-p[4][0]-8)/60,.06,1),o=cl(.3+.5*m.jaw+.25*m.spread-.55*m.round,.1,1),w=s=>s<.3?'narrow':s<.62?'medium':'wide',hf=6+f*50,hb=6+b*50;
 $('#st-lens').innerHTML=`<rect x="50" y="${62-hf}" width="165" height="${hf*2}" rx="22" fill="#93b26a" fill-opacity=".35" stroke="#93b26a"/><rect x="215" y="55" width="20" height="14" fill="#8aa9c9" fill-opacity=".4"/>
 <rect x="235" y="${62-hb}" width="150" height="${hb*2}" rx="22" fill="#74a3d9" fill-opacity=".35" stroke="#74a3d9"/>
 <path d="M40 ${62-4-o*16}H52M40 ${62+4+o*16}H52" stroke="#d98c9b" stroke-width="6" stroke-linecap="round"/>
 <text x="132" y="122" text-anchor="middle" class="lb" font-size="11">Front oral cavity: ${w(f)}</text><text x="310" y="122" text-anchor="middle" class="lb" font-size="11">Back / pharyngeal cavity: ${w(b)}</text>`}

function draw(){const e=st.t*st.t*(3-2*st.t),m=mix(st.from,st.to,e),P=m.pts,jy=m.jaw*22,ly=168+jy,d=body(m),V=st.to,
 z=r=>COL[st.zones[r]]||COL.b;
 let s=`<defs><clipPath id="tc"><path d="${d}"/></clipPath><marker id="ar" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7z" class="am"/></marker></defs>
 <path d="M92 112Q130 92 180 90T240 92Q292 96 300 130" fill="none" stroke="#8d8371" stroke-width="3"/><path d="M345 92C352 150 350 210 340 272" fill="none" stroke="#8d8371" stroke-width="3"/>
 <path d="M60 ${ly+14}Q70 262 200 266" fill="none" stroke="#8d8371" stroke-opacity=".6" stroke-width="3"/><rect x="70" y="112" width="10" height="16" rx="3" fill="#e9dfc9" stroke="#8d8371"/><rect x="70" y="${ly}" width="10" height="16" rx="3" fill="#e9dfc9" stroke="#8d8371"/>`;
 if(st.ghost)s+=`<path d="${body(st.ghost)}" fill="#d65a5a" fill-opacity=".28" stroke="#d65a5a" stroke-dasharray="5 4"/>`;
 s+=`<path d="${d}" fill="#b9776f"/><g clip-path="url(#tc)">${RN.map((r,i)=>`<circle cx="${P[i][0]}" cy="${P[i][1]+8}" r="40" fill="${z(r)}" fill-opacity=".62"/>`).join('')}</g>
 <path d="${spline(P)}" fill="none" stroke="#f1b7a8" stroke-width="4" stroke-linecap="round"/><path d="${d}" fill="none" class="al" stroke-opacity=".5"/>`;
 RN.forEach((r,i)=>{const [x,y]=P[i];s+=`<circle cx="${x}" cy="${y}" r="4.5" fill="#fff" stroke="#241a10"/><text x="${r=='root'?x-8:x}" y="${y+17}" text-anchor="${r=='root'?'end':'middle'}" font-size="10" class="hl tl">${RL[r]}</text>`});
 const lx=50-m.round*14+m.spread*4,ry=8+m.round*4-m.spread*2;
 s+=`<ellipse cx="${lx}" cy="118" rx="${11+m.spread*5}" ry="${ry}" fill="#d98c9b"/><ellipse cx="${lx}" cy="${ly-2}" rx="${11+m.spread*5}" ry="${ry}" fill="#d98c9b"/>`;
 const anc={jaw:[66,ly+8],lips:[44,142]};
 if(st.mode==='vowel')(V.arrows||[]).forEach(([r,dx,dy,t])=>{const a=anc[r]||P[RN.indexOf(r)],x2=a[0]+dx*e,y2=a[1]+dy*e;
  if(dx||dy)s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${x2}" y2="${y2}"  class="al" stroke-width="2.2" marker-end="url(#ar)" opacity="${e}"/>`;
  s+=`<text x="${x2+(dx<0?-6:6)}" y="${y2+(dy<0?-6:12)}" text-anchor="${dx<0?'end':'start'}" font-size="10" class="hl ar" opacity="${e}">${t}</text>`});
 s+=`<g font-size="10" class="lb"><text x="6" y="100">Lips</text><text x="60" y="84">Alveolar ridge</text><text x="130" y="76">Hard palate</text><text x="250" y="76">Soft palate / velum</text><text x="352" y="190">Pharyngeal</text><text x="352" y="203">back wall</text><text x="6" y="${ly+36}">Lower teeth</text></g>`;
 $('#st-main').innerHTML=s;lens(m);$('#st-sc').value=Math.round(st.t*1000)}

function pickers(){const p=$('#st-pk');
 p.innerHTML=st.mode==='contrast'?PAIRS.map((x,i)=>`<button class="chip" data-i="${i}" aria-pressed="${i==st.pair}">/${VOWELS[x[0]].sym}/ ↔ /${VOWELS[x[1]].sym}/</button>`).join(''):
  Object.keys(VOWELS).map(k=>`<button class="chip" data-k="${k}" aria-pressed="${k==st.v}">/${VOWELS[k].sym}/ ${VOWELS[k].label}</button>`).join('');
 p.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.k)st.v=b.dataset.k;else st.pair=+b.dataset.i;pickers();setup()})}

function mode(m){st.mode=m;document.querySelectorAll('#st-tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.m===m));
 const ev=m==='evidence';$('#st-ev').hidden=!ev;$('#st-grid').hidden=ev;$('#st-ctl').hidden=ev;$('#st-pk').hidden=ev;if(!ev){pickers();setup()}}

function build(){const sec=document.createElement('section');sec.className='studio';sec.id='studio';
 sec.innerHTML=`<style>${css}</style><h2>Tongue Studio: the whole tongue shapes a vowel</h2>
 <p>Vowels are not made by a tongue tip. The tip, blade, front body, dorsum and root move together with the jaw and lips, and the shape they give the vocal tract is what you hear.</p>
 <div class="row" id="st-tabs" role="tablist">${[['vowel','Vowels'],['contrast','Contrast Lab'],['mistake','Common Mistakes'],['evidence','Evidence']].map(([k,l])=>`<button class="chip" role="tab" data-m="${k}" aria-selected="${k=='vowel'}">${l}</button>`).join('')}</div>
 <div class="row" id="st-pk"></div>
 <div class="grid" id="st-grid"><div><svg id="st-main" viewBox="0 0 440 290" role="img" aria-label="Side view of the mouth with a flexible tongue"></svg>
  <div class="key" style="margin-top:10px"><span><i style="background:${COL.y}"></i>Primary shaping</span><span><i style="background:${COL.o}"></i>Supporting</span><span><i style="background:${COL.b}"></i>Relaxed</span></div></div>
  <div><div class="info" id="st-info"></div><h4>Cavity Lens</h4><svg id="st-lens" viewBox="0 0 440 130" role="img" aria-label="Front and back vocal tract cavities"></svg>
  <p style="margin-top:8px">Vowel quality comes from the shape of the whole vocal tract, two linked spaces whose sizes change as the tongue moves, not from any single tongue point.</p></div></div>
 <div class="ctl" id="st-ctl"><button class="chip" id="st-pp">Pause</button><input type="range" id="st-sc" min="0" max="1000" aria-label="Animation position"><label><input type="checkbox" id="st-slow"> Slow motion</label></div>

 <details class="guide" open><summary>Cavity Lens: how to read it, with simple examples</summary>
 <h4>The idea: two bottles joined by a neck</h4>
 <p>Picture your mouth and throat as two bottles joined by a short neck. The <b>front bottle</b> is the space between your tongue and your lips (green). The <b>back bottle</b> is the throat space behind the tongue (blue). The tongue squeezes or opens the neck and changes how big each bottle is.</p>
 <p>Blow across the top of a bottle and it hums: a big bottle gives a low note, a small one a high note. Your voice works the same way. The buzz from your vocal folds makes both spaces ring, and each shape strengthens certain pitches. Your ear reads that pattern of strong pitches as the vowel. That is why one buzz can sound like “ee” or “ah”: only the bottle shapes changed.</p>
 <h4>Three things to try</h4>
 <ul><li><b>Whisper “ee … ah … oo”.</b> Nothing buzzes, yet you still hear three different vowels, with “ee” bright and “oo” dark and hollow. What you hear is only the shape of the spaces.</li>
 <li><b>Say “ee” then “ah” with a finger under your chin.</b> The jaw drops and the tongue sinks, so the front bottle grows. The tongue root moves back, so the throat bottle shrinks. Watch the green shape grow and the blue one shrink.</li>
 <li><b>Say “ee” then “oo” with a finger in front of your lips.</b> The lips push forward and make a small opening. The front space becomes a long pipe with a tiny outlet, and the sound turns from bright to dark.</li></ul>
 <h4>Reading the screen</h4>
 <p>Green is the front oral cavity, blue is the back (pharyngeal) cavity, the pink bars on the left are the lip opening, and the grey neck is where the tongue narrows the tract. “Narrow, medium, wide” are rough size labels worked out from the tongue shape.</p>
 <h4>Cheat sheet</h4>
 <ul><li><b>/i/ “ee”:</b> small front space, wide throat, so a bright, high sound.</li>
 <li><b>/a/ “ah”:</b> wide front space, narrow throat, so an open, ringing sound.</li>
 <li><b>/u/ “oo”:</b> long front space with a tiny lip opening, so a dark, hollow sound.</li></ul>
 <p>Phoneticians call the strongest pitches F1 and F2. As a rough rule, an open jaw with a narrow throat raises F1 (/a/), a high front tongue raises F2 (/i/), and rounded lips lower both (/u/). Two bottles is a teaching simplification: the real tract is one continuous tube, and many other details matter.</p></details>
 <div id="st-ev" hidden><p>Ultrasound imaging shows the midsagittal tongue surface as a moving line, which is what the ribbon above imitates. MRI-based animations show the whole vocal tract at once: tongue, velum, pharynx and lips.</p>
 <p><a href="https://www.seeingspeech.ac.uk/" target="_blank" rel="noopener">Seeing Speech (University of Glasgow)</a> pairs ultrasound, MRI and animations for each sound. Compare its images with this schematic: the drawing here is a simplified teaching model with illustrative coordinates, not measured data.</p></div>`;
 const f=$('footer.foot');f.parentNode.insertBefore(sec,f);
 $('#st-tabs').onclick=e=>{if(e.target.dataset.m)mode(e.target.dataset.m)};
 const pp=$('#st-pp');pp.textContent=st.play?'Pause':'Play';pp.onclick=()=>{st.play=!st.play;pp.textContent=st.play?'Pause':'Play'};
 $('#st-sc').oninput=e=>{st.t=e.target.value/1000;st.play=false;pp.textContent='Play';draw()};
 $('#st-slow').onchange=e=>st.slow=e.target.checked;
 mode('vowel');let last=performance.now();
 (function loop(n){const dt=(n-last)/1000;last=n;if(st.play&&!sec.querySelector('#st-grid').hidden){st.t+=st.dir*dt/(st.slow?10:4);
  if(st.t>=1){st.t=1;st.dir=-1}if(st.t<=0){st.t=0;st.dir=1}draw()}requestAnimationFrame(loop)})(last)}

window.SoundStudio={showSym(sym){const k=KEY[sym];if(!k)return;st.v=k;mode('vowel')}};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',build):build();
})();
