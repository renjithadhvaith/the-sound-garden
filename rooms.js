/* "The Secret of the Rooms: Why Size Changes the Note" — needs tongue-studio.js (SoundStudio.V, dims, rm). */
(function(){
const $=(s,r=document)=>r.querySelector(s),cl=(x,a,b)=>Math.max(a,Math.min(b,x));
const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* back-room note (F1) and front-room note (F2), approximate adult values */
const FMT={i:[300,2250],I:[400,1900],e:[500,1900],ae:[700,1700],A:[640,1200],a:[730,1100],aw:[570,840],o:[450,800],U:[440,1020],u:[300,870],er:[490,1350],sh:[500,1500]};
const BOT=[{w:0,f:196,t:'Empty',s:'big room → low note'},{w:.45,f:330,t:'Half full',s:'medium room → mid note'},{w:.75,f:587,t:'Almost full',s:'tiny room → HIGH note'}];
const R={fc:[300,2250],k:'i',blow:-1,bt:9,t:0,vis:true,cur:{f:.3,b:.8},tgt:{f:.3,b:.8}};
let AC;const ac=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();return AC};
function env(g,t,d,pk){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.06);g.gain.setValueAtTime(pk,t+d-.3);g.gain.exponentialRampToValueAtTime(.0001,t+d)}
function play(kind){const a=ac(),t=a.currentTime,[F1,F2]=FMT[R.k],d=kind==='mix'?1.8:1.6,g=a.createGain();g.connect(a.destination);
 const osc=(type,fr)=>{const o=a.createOscillator();o.type=type;o.frequency.value=fr;o.start(t);o.stop(t+d+.05);return o};
 if(kind==='kazoo'){const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2500;osc('sawtooth',150).connect(lp);lp.connect(g);env(g,t,d,.2)}
 if(kind==='high'){osc('sine',F2).connect(g);env(g,t,d,.1)}
 if(kind==='low'){osc('sine',F1).connect(g);env(g,t,d,.3)}
 if(kind==='mix'){const o=osc('sawtooth',150);[F1,F2].forEach(fr=>{const b=a.createBiquadFilter();b.type='bandpass';b.frequency.value=fr;b.Q.value=8;o.connect(b);b.connect(g)});env(g,t,d,1.2)}
 const b=$(`[data-p="${kind}"]`);b.setAttribute('aria-pressed','true');setTimeout(()=>b.setAttribute('aria-pressed','false'),d*1000)}
function blow(i){const a=ac(),t=a.currentTime,f=BOT[i].f,d=1.6,g=a.createGain(),n=a.createBufferSource(),buf=a.createBuffer(1,a.sampleRate*d,a.sampleRate),q=a.createBiquadFilter(),ng=a.createGain(),o=a.createOscillator();
 buf.getChannelData(0).forEach((_,k,arr)=>arr[k]=Math.random()*2-1);n.buffer=buf;q.type='bandpass';q.frequency.value=f;q.Q.value=18;ng.gain.value=.6;n.connect(q);q.connect(ng);ng.connect(g);
 o.type='sine';o.frequency.value=f;o.connect(g);g.connect(a.destination);env(g,t,d,.22);n.start(t);o.start(t);o.stop(t+d);R.blow=i;R.bt=0;if(REDUCE)bottles()}

function bottles(){let s=`<rect x="0" y="140" width="440" height="8" fill="#a2753f"/>`;
 BOT.forEach((b,i)=>{const cx=73+147*i,wt=140-b.w*118,on=R.blow===i&&R.bt<1.6,
  path=`M${cx-9} 20V50Q${cx-26} 55 ${cx-26} 70V132Q${cx-26} 140 ${cx-18} 140H${cx+18}Q${cx+26} 140 ${cx+26} 132V70Q${cx+26} 55 ${cx+9} 50V20Z`;
  s+=`<clipPath id="bc${i}"><path d="${path}"/></clipPath><rect x="${cx-30}" y="${wt}" width="60" height="${140-wt}" fill="#6aaed6" fill-opacity=".55" clip-path="url(#bc${i})"/><path d="${path}" fill="#9fd0e8" fill-opacity=".15" stroke="#7fb4d0" stroke-width="2.5"/>`;
  if(on){const L=wt-28,u=(R.bt*b.f/60)%2,y=28+L*(u<1?u:2-u);s+=`<text x="${cx-40}" y="26" font-size="16" opacity="${.5+.5*Math.sin(R.bt*20)}">💨</text><circle cx="${cx}" cy="${y}" r="4.5" fill="#ffd86b" stroke="#e7ac5f"/><circle cx="${cx}" cy="${y}" r="${6+(u*8%8)}" fill="none" stroke="#ffd86b" stroke-opacity=".5"/>`}
  s+=`<text x="${cx}" y="160" text-anchor="middle" font-size="11" class="tl">${b.t}</text><text x="${cx}" y="173" text-anchor="middle" font-size="10" class="lb">${b.s}</text>`});
 $('#rm-bot').innerHTML=s}

function bounce(){const S=window.SoundStudio,c=R.cur,Lf=60+c.f*130,Lb=60+c.b*130,hf=8+c.f*50,hb=8+c.b*50,x1=20,x2=x1+Lf+14,V=S.V[R.k],t=R.t;
 const tri=u=>{u%=2;return u<1?u:2-u},vv=240;
 const dot=(xa,xb,col,off)=>{let o='';for(let k=3;k>=0;k--){const u=tri((t-k*.035)*vv/(xb-xa)+off);o+=`<circle cx="${xa+(xb-xa)*u}" cy="84" r="${k?5-k:6.5}" fill="${col}" fill-opacity="${k?.35/k:1}" stroke="#fff" stroke-opacity="${k?0:.8}"/>`}
  const u=((t*vv/(xb-xa)+off)%1);return o+`<circle cx="${tri(t*vv/(xb-xa)+off)<.5?xa:xb}" cy="84" r="${u*30}" fill="none" stroke="${col}" stroke-opacity="${1-u}"/>`};
 const rate=L=>(vv/(L-16)/2).toFixed(1);
 $('#rm-bnc').innerHTML=`<text x="220" y="14" text-anchor="middle" font-size="11" class="lb">Fast bouncing air = HIGH note · Slow bouncing air = LOW note</text>
 <rect x="${x1}" y="${84-hf}" width="${Lf}" height="${hf*2}" rx="18" fill="#93b26a" fill-opacity=".3" stroke="#93b26a"/><rect x="${x2}" y="${84-hb}" width="${Lb}" height="${hb*2}" rx="18" fill="#74a3d9" fill-opacity=".3" stroke="#74a3d9"/>
 <rect x="${x1+Lf}" y="${84-Math.max(hf,hb)}" width="14" height="${2*Math.max(hf,hb)}" rx="5" fill="#c0653a"/><path d="M${x1-8} ${84-8}v-10M${x1-8} ${84+8}v10" stroke="#d98c9b" stroke-width="6" stroke-linecap="round" transform="translate(0 0)"/>
 ${dot(x1+10,x1+Lf-8,'#5f9a35',0)}${dot(x2+8,x2+Lb-10,'#3f78b5',.3)}
 <text x="20" y="160" font-size="11" class="tl">Front room: ${rate(Lf)} bounces/s</text><text x="430" y="160" text-anchor="end" font-size="11" class="tl">Back room: ${rate(Lb)} bounces/s</text>
 <text x="220" y="180" text-anchor="middle" font-size="10" class="lb">left: pink = lips (door) · brown bar = sofa (tongue) · end of the blue room = throat wall</text>`}

function eq(){const fc=R.fc,X=hz=>30+hz/3000*390,g=(f,c,w)=>Math.exp(-(((f-c)/w)**2)),cv=f=>.12+.88*Math.max(g(f,fc[0],140),g(f,fc[1],230));
 let s='<g font-size="10" class="lb"><text x="6" y="11">1) Kazoo buzz: many notes at once</text><text x="6" y="71">2) Rooms: boost the notes they like</text><text x="6" y="131">3) What you hear: the vowel</text><text x="30" y="203">low notes</text><text x="434" y="203" text-anchor="end">high notes</text></g>';
 [62,122,186].forEach(y=>s+=`<line x1="30" y1="${y}" x2="420" y2="${y}" stroke="#8d8371" stroke-opacity=".5"/>`);
 for(let h=1;h<=20;h++){const hz=h*150,a=1/Math.pow(h,.7);s+=`<rect x="${X(hz)-3}" y="${62-44*a}" width="6" height="${44*a}" rx="2" fill="#e7ac5f"/><rect x="${X(hz)-3}" y="${186-Math.min(44,90*a*cv(hz))}" width="6" height="${Math.min(44,90*a*cv(hz))}" rx="2" fill="#e08a6a"/>`}
 const crv=(c,w,col)=>{let d='M'+X(0)+' 122';for(let f=0;f<=3000;f+=30)d+=`L${X(f)} ${122-44*(.12+.88*g(f,c,w))}`;return`<path d="${d}L${X(3000)} 122Z" fill="${col}" fill-opacity=".4" stroke="${col}"/>`};
 $('#rm-eq').innerHTML=s+crv(fc[0],140,'#3f78b5')+crv(fc[1],230,'#5f9a35')}
function setK(k){const S=window.SoundStudio,v=S.V[k];if(!v)return;R.k=k;R.tgt=S.dims(v);if(REDUCE)R.fc=[...FMT[k]];
 document.querySelectorAll('#rm-pk button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));
 $('#rm-hi').textContent=`(F2 · ${FMT[k][1]} Hz for /${v.sym}/)`;$('#rm-lo').textContent=`(F1 · ${FMT[k][0]} Hz for /${v.sym}/)`;$('#rm-vw').textContent=`/${v.sym}/ “${v.label}”`;if(REDUCE)bounce()}

function build(){const S=window.SoundStudio,sec=document.createElement('section');sec.className='studio';sec.id='secret';
 sec.innerHTML=`<h2>The Secret of the Rooms: Why Size Changes the Note</h2>
 <div class="info"><h3>Wait, why does a BIG room make a LOW note?</h3>
 <p>Imagine a skipping rope. A short rope swings incredibly fast. A very long, heavy rope swings back and forth slowly. Sound works the same way! A “note” is just <b>how fast the air is swinging back and forth</b>.</p>
 <p><b>Front room (small):</b> the air is trapped in a tiny space, so it swings very fast. Fast swinging = <b>high note</b>.<br><b>Back room (big):</b> the air has lots of space to travel, so it takes its time. Slow swinging = <b>low note</b>.</p>
 <p><b>Try it yourself:</b> blow across the top of a glass bottle with a little water in it. You get a high note, because there is only a bit of air inside (a small room). Pour the water out and the note drops low, because the air has a huge space to swing around in. When you speak, your tongue is moving the “water level” in your mouth to change the notes!</p><p><b>Why the bottle matters:</b> blow across an empty bottle (lots of air space) and you get a low, hollow hoot. Fill it halfway (less air space) and the note rises. Your tongue acts just like the water: by moving up and down, it changes the size of the room, and that changes the note!</p></div>
 <h4>1) The water-bottle band</h4><svg id="rm-bot" viewBox="0 0 440 178" role="img" aria-label="Three bottles with different water levels"></svg>
 <div class="row">${BOT.map((b,i)=>`<button class="chip" data-b="${i}">💨 Blow: ${b.t.toLowerCase()}</button>`).join('')}</div>
 <p><b>The lesson:</b> when you say “Eeee”, your tongue (the sofa) rises like the water in the bottle and leaves only a tiny room for the air. Tiny room = high note!</p>
 <h4>2) Bouncing air inside the rooms</h4><p>Pick a vowel and watch the air bounce between the door and the sofa (front room) and between the sofa and the throat wall (back room). Short trip, fast bounce. Long trip, lazy bounce.</p>
 <div class="row" id="rm-pk">${Object.keys(S.V).map(k=>`<button class="chip" data-k="${k}" aria-pressed="${k=='i'}">/${S.V[k].sym}/ ${S.V[k].label}</button>`).join('')}</div>
 <svg id="rm-bnc" viewBox="0 0 440 188" role="img" aria-label="Air bouncing in the front room and back room"></svg>
 <h4>3) Hear the notes</h4>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-top:8px">
 <div class="info"><button class="chip" data-p="kazoo">🐝 Kazoo buzz</button><p>This is your voice pitch. It never changes when you say “Eee” versus “Ahhh”.</p></div>
 <div class="info"><button class="chip" data-p="high">🔔 High room note</button><p>This is the note the front room rings at. <span id="rm-hi"></span></p></div>
 <div class="info"><button class="chip" data-p="low">🌊 Low room note</button><p>This is the note the back room rings at. <span id="rm-lo"></span></p></div>
 <div class="info"><button class="chip" data-p="mix">✨ The vowel (the mix)</button><p>The buzz is squeezed through both room notes at once and turns into <b id="rm-vw"></b>. Pick another vowel above and press it again.</p></div></div>
 <div class="info"><h3>What are F1 and F2?</h3><p>Phoneticians call the two room notes <b>F1</b> (roughly the back-room, throat note) and <b>F2</b> (roughly the front-room, mouth note). When people learn to “read” speech, they are mostly watching how F1 and F2 dance together as the tongue (the sofa) moves.</p></div>
 <h4>4) The mix: your rooms are an equalizer</h4>
 <p><b>How do the kazoo and the rooms work together?</b> The kazoo makes a raw, buzzy sound with lots of notes at once. The rooms act like the equalizer on a stereo: they boost the notes they like and muffle the rest. Your ear hears that filtered mix, and your brain instantly knows it as a vowel! Pick a vowel above and watch the rooms reshape the buzz.</p>
 <svg id="rm-eq" viewBox="0 0 440 206" role="img" aria-label="The kazoo buzz, the rooms' filter and the resulting vowel"></svg>
 <p style="margin-top:8px"><span style="color:#3f78b5;font-weight:700">Blue bump</span> = back-room note (F1) · <span style="color:#5f9a35;font-weight:700">green bump</span> = front-room note (F2) · bars further right = higher notes.</p>
 <p>Small print: bottles and rooms are a toy model. Real mouths are curvy tubes, and the note a room rings at depends on its shape as well as its size.</p>`;
 $('#studio').after(sec);
 sec.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>blow(+b.dataset.b));
 sec.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>play(b.dataset.p));
 $('#rm-pk').onclick=e=>e.target.dataset.k&&setK(e.target.dataset.k);
 document.addEventListener('sg-vowel',e=>setK(e.detail));
 new IntersectionObserver(en=>R.vis=en[0].isIntersecting).observe(sec);
 setK('i');R.cur={...R.tgt};bottles();bounce();eq();
 let last=performance.now();(function tick(n){const dt=Math.min((n-last)/1000,.1);last=n;
  if(R.vis&&!REDUCE){R.t+=dt;R.bt+=dt;for(const k in R.cur)R.cur[k]+=(R.tgt[k]-R.cur[k])*Math.min(1,dt*5);R.fc[0]+=(FMT[R.k][0]-R.fc[0])*Math.min(1,dt*5);R.fc[1]+=(FMT[R.k][1]-R.fc[1])*Math.min(1,dt*5);bounce();eq();if(R.bt<1.7)bottles()}requestAnimationFrame(tick)})(last)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',build):build();
})();
