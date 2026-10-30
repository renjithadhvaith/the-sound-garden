/* Breezy + sound-match game for The Sound Garden. Needs tongue-studio.js (shape data) and index.html (VOWELS, bed, select, say). */
(function(){
const $=(s,r=document)=>r.querySelector(s),cl=(x,a,b)=>Math.max(a,Math.min(b,x));
const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
const FMT={i:[280,2250],I:[400,1900],e:[500,1900],ae:[700,1700],A:[640,1200],a:[730,1100],aw:[570,840],o:[450,800],U:[440,1020],u:[300,870],er:[490,1350],sh:[500,1500]};
const FEEL={i:'Smile wide, keep the tongue tip low and lift the middle of the tongue.',a:'Let your jaw drop, like the doctor saying “say ah”.',u:'Push your lips forward into a little “O”.',e:'Smile a little less than for “ee” and let the jaw open a bit.',o:'Round your lips and lift the back of the tongue.'};
const CONS={door:{l:'Door slam /p b m/',xo:30,t:'The front door (your lips) slams shut and traps Breezy. Then POP, it opens. Consonants are <b>blocked, bumped or squeezed</b>.'},
 tap:{l:'Roof tap /t d n/',xo:120,t:'A little bumper (the tongue tip) taps the roof and blocks Breezy for a split second. BAM!'},
 squeeze:{l:'Squeeze /s z ʃ/',xo:120,t:'The tunnel is pinched super tight and Breezy turns into a windy hiss. Sssss!'}};
const bz={mode:'vowel',k:'i',cons:'door',c:0,bx:420,hum:false,cur:{f:.3,b:.5,o:.5,r:0},tgt:{f:.3,b:.5,o:.5,r:0},wasC:0,vis:true};
let AC,osc,g,f1,f2;
const ac=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();return AC};
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function tone(fr,t0,d,type='sine',v=.1){const a=ac(),o=a.createOscillator(),q=a.createGain(),t=a.currentTime+t0;o.type=type;o.frequency.setValueAtTime(fr[0],t);if(fr[1])o.frequency.exponentialRampToValueAtTime(fr[1],t+d);q.gain.setValueAtTime(v,t);q.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(q);q.connect(a.destination);o.start(t);o.stop(t+d+.02)}
function hum(on){if(on&&!osc){const a=ac();osc=a.createOscillator();osc.type='sawtooth';osc.frequency.value=150;g=a.createGain();g.gain.value=0;f1=a.createBiquadFilter();f2=a.createBiquadFilter();[f1,f2].forEach(f=>{f.type='bandpass';f.Q.value=7;osc.connect(f);f.connect(g)});g.connect(a.destination);osc.start();formant()}
 if(AC){AC.resume();g.gain.setTargetAtTime(on?.5:0,AC.currentTime,.1)}}
function formant(){if(!f1)return;const [a,b]=FMT[bz.k],t=AC.currentTime;f1.frequency.setTargetAtTime(a,t,.12);f2.frequency.setTargetAtTime(b,t,.12)}
function burst(x,y,em,n){if(REDUCE)return;for(let i=0;i<n;i++){const p=document.createElement('span'),a=Math.random()*6.28,r=50+Math.random()*80;p.textContent=em[i%em.length];
 p.style.cssText=`position:fixed;left:${x}px;top:${y}px;font-size:${14+Math.random()*12}px;pointer-events:none;z-index:99`;document.body.appendChild(p);
 p.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r-40}px)) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.15,.8,.3,1)'}).onfinish=()=>p.remove()}}

/* ---------- tunnel geometry (same room sizes as the Cavity Lens) ---------- */
const cr=p=>{let d='M'+p[0];for(let i=0;i<p.length-1;i++){const a=p[Math.max(i-1,0)],b=p[i],c=p[i+1],e=p[Math.min(i+2,p.length-1)];d+=` C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6} ${c[0]} ${c[1]}`}return d};
function geom(d){const hb=6+d.b*50,hf=6+d.f*50,dr=4+d.o*16,xd=36-d.r*60;return[[430,6],[395,hb*.8],[330,hb],[260,hb*.85],[228,9],[196,hf*.9],[130,hf],[70,hf*.85],[xd+24,(hf+dr)/2],[xd,dr],[xd-8,dr]]}
function H(pts,x){for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];if(x<=a[0]&&x>=b[0])return a[1]+(b[1]-a[1])*(a[0]-x)/(a[0]-b[0]||1)}return 6}
function occ(){if(bz.mode!=='cons')return 0;if(bz.cons==='squeeze')return 1;const t=bz.c%3.2;return t<1.4?0:t<1.9?(t-1.4)/.5:t<2.4?1:t<2.6?1-(t-2.4)/.2:0}

function draw(){const d=bz.cur,pts=geom(d),top=pts.map(([x,h])=>[x,75-h]),bot=pts.map(([x,h])=>[x,75+h]).reverse(),shape=cr(top)+'L'+cr(bot).slice(1)+'Z',c=bz.c,oc=occ(),cons=bz.mode==='cons',xo=cons?CONS[bz.cons].xo:0,hf=H(pts,130);
 let s=`<defs><radialGradient id="bzg"><stop offset="0" stop-color="#fff6c8"/><stop offset=".45" stop-color="#ffd86b" stop-opacity=".95"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient><clipPath id="bzc"><path d="${shape}"/></clipPath></defs>
 <path d="${shape}" fill="#93b26a" fill-opacity=".22" stroke="#93b26a" stroke-width="2.5"/>`;
 const hh=H(pts,bz.bx),sy=cl(hh/15,.3,1),jit=cons&&bz.cons==='squeeze'?Math.sin(c*60)*2:0,y=75+Math.sin(c*5)*3*sy+jit;
 s+=`<g clip-path="url(#bzc)">`;for(let k=5;k>0;k--)s+=`<circle cx="${bz.bx+k*10}" cy="${75}" r="${10*sy*(1-k*.13)}" fill="#ffd86b" opacity="${.45-k*.07}"/>`;
 s+=`<g transform="translate(${bz.bx} ${y}) scale(${1+(1-sy)*.6} ${sy})"><circle r="26" fill="url(#bzg)"/><circle r="10" fill="#fff3b8"/><circle cx="-3.5" cy="-2" r="1.7" fill="#3a2a10"/><circle cx="3.5" cy="-2" r="1.7" fill="#3a2a10"/><path d="M-4 3Q0 7 4 3" stroke="#3a2a10" fill="none" stroke-width="1.4" stroke-linecap="round"/></g></g>`;
 if(oc<.7)for(let i=0;i<2;i++)s+=`<text x="${bz.bx-12-i*14}" y="${58-((c*28+i*11)%22)}" font-size="13" fill="#ffe08a" opacity=".85">♪</text>`;
 if(cons){const pink='#d98c9b';
  if(bz.cons==='door'){const gap=13.6*(1-oc);s+=`<ellipse cx="30" cy="${75-gap-7}" rx="13" ry="8" fill="${pink}"/><ellipse cx="30" cy="${75+gap+7}" rx="13" ry="8" fill="${pink}"/><text x="30" y="30" text-anchor="middle" font-size="10" fill="#c9d3ee">lips = door</text>`}
  if(bz.cons==='tap'){const hgt=oc*2*hf;s+=`<rect x="105" y="${75+hf-hgt}" width="30" height="${hgt}" rx="10" fill="${pink}"/><text x="120" y="20" text-anchor="middle" font-size="10" fill="#c9d3ee">tongue tip bumper</text>`}
  if(bz.cons==='squeeze')s+=`<rect x="105" y="${75-hf}" width="30" height="${hf-5}" rx="8" fill="${pink}"/><rect x="105" y="80" width="30" height="${hf-5}" rx="8" fill="${pink}"/><text x="40" y="${70+Math.sin(c*40)*3}" font-size="15" fill="#fff" opacity=".8">sssss</text>`;
  if(oc>.9&&bz.cons!=='squeeze')s+=`<text x="${xo+34}" y="${70}" font-size="18" font-weight="700" fill="#ffd86b">💥 BAM!</text>`}
 s+=`<g font-size="10" fill="#9fb0d8"><text x="-34" y="146">Lips (front door)</text><text x="440" y="146" text-anchor="end">Throat (kazoo)</text><text x="225" y="12" text-anchor="middle">air flows this way ←</text></g>`;
 $('#bz-svg').innerHTML=s}

function info(){const S=window.SoundStudio,v=S.V[bz.k],i=$('#bz-info');
 if(bz.mode==='vowel'){const d=S.dims(v);i.innerHTML=`<h3>/${v.sym}/ — free flow</h3><p><b>Tunnel:</b> front room is a ${S.rm(d.f)[0]}, back room is a ${S.rm(d.b)[0]}.</p><p><b>Feel:</b> ${FEEL[bz.k]||v.focus}</p><p>Breezy never stops humming. Only the tunnel changes shape. <b>Vowels are FREE</b>: the air flows smoothly, so you can sing them forever: Aaaaah, Eeeee, Ooooo.</p>`}
 else i.innerHTML=`<h3>${CONS[bz.cons].l}</h3><p>${CONS[bz.cons].t}</p><p><b>Consonants are BLOCKED, BUMPED or SQUEEZED.</b> They stop or chop the air, so you can’t sing a /p/ or a /t/ forever.</p><p><b>Try it:</b> say “p p p p p” without any vowel. The door keeps slamming. You need a vowel to open the door and let Breezy out!</p>`}
function chips(){const S=window.SoundStudio,p=$('#bz-pk');
 p.innerHTML=bz.mode==='vowel'?Object.keys(S.V).map(k=>`<button class="chip" data-k="${k}" aria-pressed="${k==bz.k}">/${S.V[k].sym}/ ${S.V[k].label}</button>`).join(''):Object.keys(CONS).map(k=>`<button class="chip" data-c="${k}" aria-pressed="${k==bz.cons}">${CONS[k].l}</button>`).join('');
 p.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.k)setV(b.dataset.k,true);else{bz.cons=b.dataset.c;bz.bx=420;chips();info();draw()}})}
function setV(k,fx){bz.k=k;const S=window.SoundStudio,v=S.V[k];bz.mode='vowel';bz.tgt={...S.dims(v),r:v.round};tabs();formant();chips();info();
 if(fx){buzz(10);tone([500,800],0,.08);const r=$('#bz-svg').getBoundingClientRect();burst(r.left+(bz.bx+40)/490*r.width,r.top+r.height/2,['✨','🎵'],8)}
 if(REDUCE)draw()}
function tabs(){document.querySelectorAll('#bz-tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.m===bz.mode))}

function build(){const S=window.SoundStudio,sec=document.createElement('section');sec.className='studio';sec.id='breezy';
 sec.innerHTML=`<h2>Breezy and the Magic Voice Tunnel</h2><p>Breezy is your voice: a little glowing breeze that never stops humming. Only the <b>shape of the tunnel</b> changes. Tap a vowel and watch the walls morph.</p>
 <div class="row" id="bz-tabs"><button class="chip" data-m="vowel" aria-selected="true">Vowels: free flow</button><button class="chip" data-m="cons" aria-selected="false">Consonants: obstacle course</button></div>
 <div class="row" id="bz-pk"></div><div class="grid"><div><svg id="bz-svg" viewBox="-40 0 490 150" style="background:#16203a" role="img" aria-label="Breezy flying through the vocal tunnel"></svg></div>
 <div><div class="info" id="bz-info"></div><button class="chip" id="bz-hum" aria-pressed="false">🔈 Let Breezy hum</button></div></div>`;
 $('#studio').after(sec);
 $('#bz-tabs').onclick=e=>{const m=e.target.dataset.m;if(!m)return;bz.mode=m;bz.bx=420;bz.tgt=m==='cons'?{f:.5,b:.5,o:.6,r:0}:{...S.dims(S.V[bz.k]),r:S.V[bz.k].round};tabs();chips();info();hum(bz.hum&&m==='vowel');if(REDUCE)draw()};
 $('#bz-hum').onclick=e=>{bz.hum=!bz.hum;e.target.setAttribute('aria-pressed',bz.hum);e.target.textContent=bz.hum?'🔊 Breezy is humming':'🔈 Let Breezy hum';hum(bz.hum&&bz.mode==='vowel')};
 document.addEventListener('sg-vowel',e=>setV(e.detail,false));
 new IntersectionObserver(en=>bz.vis=en[0].isIntersecting).observe(sec);
 setV('i',false);bz.cur={...bz.tgt};draw();
 let last=performance.now();(function tick(n){const dt=Math.min((n-last)/1000,.1);last=n;
  if(bz.vis&&!REDUCE){bz.c+=dt;for(const k in bz.cur)bz.cur[k]+=(bz.tgt[k]-bz.cur[k])*Math.min(1,dt*4);
   const pts=geom(bz.cur),oc=occ(),xo=bz.mode==='cons'?CONS[bz.cons].xo:-999;let nx=bz.bx-90*dt;
   if(bz.mode==='cons'&&oc>.7&&bz.bx>xo+16&&nx<=xo+16)nx=xo+16;
   if(nx<pts[pts.length-1][0]-20)nx=440;bz.bx=nx;
   if(oc>.95&&!bz.wasC&&bz.cons!=='squeeze'){buzz(14);if(AC)tone([300,120],0,.08,'square',.06)}bz.wasC=oc>.95;
   if(g&&bz.hum)g.gain.setTargetAtTime(bz.mode==='vowel'?.5:(oc>.7?0:.5),AC.currentTime,.05);
   draw()}requestAnimationFrame(tick)})(last);
 buildGame()}

/* ---------- sound-match game: hear a word, tap the flower that grew that sound ---------- */
function buildGame(){const G={on:false,i:-1,wrong:0,score:0,streak:0,word:''},p=document.createElement('div');p.className='studio';p.style.cssText='margin:18px 0;padding:12px 16px';
 p.innerHTML=`<div class="row" style="margin:0"><button class="chip" id="g-go">🎯 Play sound match</button><button class="chip" id="g-again" hidden>🔊 Hear it again</button><span id="g-msg" style="font-size:14px"></span><span id="g-score" style="font-size:14px;margin-left:auto"></span></div>`;
 $('.stage').before(p);const msg=t=>$('#g-msg').innerHTML=t,score=()=>$('#g-score').textContent=G.on?`⭐ ${G.score}  ${'🌸'.repeat(Math.min(G.streak,8))}`:'';
 function round(){if(!G.on)return;let i;do{i=Math.floor(Math.random()*VOWELS.length)}while(i===G.i);G.i=i;G.wrong=0;G.word=VOWELS[i].words[Math.floor(Math.random()*VOWELS[i].words.length)];say(G.word);msg('👂 Listen… which flower grew this sound? Tap it!');$('#g-again').hidden=false}
 $('#g-go').onclick=()=>{G.on=!G.on;$('#g-go').textContent=G.on?'⏹ Stop game':'🎯 Play sound match';if(G.on){G.score=G.streak=0;ac();round()}else{msg('');$('#g-again').hidden=true}score()};
 $('#g-again').onclick=()=>say(G.word);
 bed.addEventListener('click',e=>{if(!G.on)return;const el=e.target.closest('.bloom');if(!el)return;e.stopPropagation();const i=VOWELS.findIndex(v=>v._el===el),r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  if(i===G.i){G.score++;G.streak++;buzz([18,40,30]);[520,660,880].forEach((f,k)=>tone([f],k*.07,.16,'sine',.12));burst(x,y,['🌸','✨','🌼','💛'],18);
   if(!REDUCE)el.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.7)'},{transform:'translate(-50%,-50%) scale(1.18)'}],{duration:500,easing:'ease-out'});
   select(i,el);msg(`🎉 Yes! “${G.word}” has /${VOWELS[i].sym}/`);score();setTimeout(round,3600)}
  else{G.wrong++;G.streak=0;buzz(45);tone([220,160],0,.15,'triangle',.1);if(!REDUCE)el.animate([{transform:'translate(-50%,-50%) rotate(-8deg)'},{transform:'translate(-50%,-50%) rotate(8deg)'},{transform:'translate(-50%,-50%)'}],{duration:300});
   msg('Almost! Listen again 👂');score();setTimeout(()=>say(G.word),500);
   if(G.wrong>=2&&!REDUCE)VOWELS[G.i]._el.animate([{filter:'drop-shadow(0 0 0 #ffd86b)'},{filter:'drop-shadow(0 0 16px #ffd86b)'}],{duration:500,iterations:6,direction:'alternate'})}},true)}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',build):build();
})();
