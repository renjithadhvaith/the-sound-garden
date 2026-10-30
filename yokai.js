/* Kuu's Cave Games: "The Mochi Forge" (drag the tongue) and "Magic Hyotan Breath" (pour, tilt, blow).
   Needs tongue-studio.js (SoundStudio.V / dims). Runs fully on-device: the mic, if used, is only measured, never recorded. */
(function(){
const $=(s,r=document)=>r.querySelector(s),cl=(x,a,b)=>Math.max(a,Math.min(b,x)),RED=matchMedia('(prefers-reduced-motion:reduce)').matches;
const FM={i:[300,2250],e:[500,1900],a:[730,1100],o:[450,800],u:[300,870]};
const ANC={i:[.1,.12],e:[.22,.5],a:[.5,.95],o:[.78,.5],u:[.9,.12]}; /* where each vowel sits on the touch map: x front→back, y high→low */
const MIS=[['i','Make the spirit SQUEAK like a mouse! 🐭 (EE)'],['a','Make the spirit BOOM like a drum! 🥁 (AH)'],['u','Make the spirit HOOT like an owl! 🦉 (OO)'],['e','Make a friendly “eh” 🐑'],['o','Make a round “oh” 🎃']];
const HM=[['Make the gourd sing like a MOUSE 🐭 (high note)',l=>l>=.65,'a tiny air room'],['Make the gourd hoot like an OWL 🦉 (low note)',l=>l<=.25,'a huge air room'],['Make the gourd croak like a FROG 🐸 (middle note)',l=>l>.35&&l<.6,'a medium air room']];
let AC;const ac=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();return AC};
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function chirp(){[520,660,880].forEach((f,k)=>{const a=ac(),t=a.currentTime+k*.07,o=a.createOscillator(),g=a.createGain();o.frequency.value=f;g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+.18)})}
function vowel(k){const a=ac(),t=a.currentTime,g=a.createGain(),o=a.createOscillator();o.type='sawtooth';o.frequency.value=150;g.connect(a.destination);
 FM[k].forEach(f=>{const b=a.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=8;o.connect(b);b.connect(g)});
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1.2,t+.06);g.gain.setValueAtTime(1.2,t+1.2);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);o.start(t);o.stop(t+1.7)}
function burst(x,y,em,n){if(RED)return;for(let i=0;i<n;i++){const p=document.createElement('span'),a=Math.random()*6.28,r=50+Math.random()*90;p.textContent=em[i%em.length];
 p.style.cssText=`position:fixed;left:${x}px;top:${y}px;font-size:${14+Math.random()*12}px;pointer-events:none;z-index:99`;document.body.appendChild(p);
 p.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r-40}px))`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.15,.8,.3,1)'}).onfinish=()=>p.remove()}}
const cr=p=>{let d='M'+p[0];for(let i=0;i<p.length-1;i++){const a=p[Math.max(i-1,0)],b=p[i],c=p[i+1],e=p[Math.min(i+2,p.length-1)];d+=` C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6} ${c[0]} ${c[1]}`}return d};
const tri=u=>{u%=2;return u<1?u:2-u};

/* ---------- Game 1: The Mochi Forge ---------- */
const M={hx:.1,hy:.12,tx:.1,ty:.12,i:0,hold:0,done:false,score:0,hint:false,t:0,drag:false};
function pose(hx,hy){const V=window.SoundStudio.V,w={};let sum=0;for(const k in ANC){w[k]=1/(Math.hypot(hx-ANC[k][0],hy-ANC[k][1])**3+.002);sum+=w[k]}
 const m={pts:[[0,0],[0,0],[0,0],[0,0],[0,0]],jaw:0,round:0,spread:0,w};
 for(const k in ANC){const q=w[k]/sum,v=V[k];v.pts.forEach((p,i)=>{m.pts[i][0]+=p[0]*q;m.pts[i][1]+=p[1]*q});m.jaw+=v.jaw*q;m.round+=v.round*q;m.spread+=v.spread*q;w[k]=q}
 const press=cl((.12-hy)/.12,0,1);m.pts[2][1]-=press*34;m.pts[3][1]-=press*34;m.blocked=Math.min(m.pts[2][1],m.pts[3][1])<98;return m}
const body=m=>{const p=m.pts,yb=248+m.jaw*14;return cr(p)+` L${p[4][0]+4} ${yb+8} L128 ${yb} L${p[0][0]-6} ${p[0][1]+24} Z`};
function mfDraw(){const S=window.SoundStudio,m=pose(M.hx,M.hy),d=S.dims(m),ly=168+m.jaw*22,t=M.t,k=MIS[M.i][0];
 const Lf=60+d.f*130,Lb=60+d.b*130,x1=20,x2=x1+Lf+14,vv=240,hue=p=>`hsl(${220*(1-cl(p,.1,.95))},85%,55%)`;
 let s=`<path d="M92 112Q130 92 180 90T240 92Q292 96 300 130" fill="none" stroke="#8d8371" stroke-width="3"/><path d="M345 92C352 150 350 210 340 272" fill="none" stroke="#8d8371" stroke-width="3"/>`;
 if(M.hint){const g=pose(...ANC[k]);s+=`<path d="${body(g)}" fill="none" stroke="#6fbf6a" stroke-width="2.2" stroke-dasharray="6 4"/>`}
 s+=`<path d="${body(m)}" fill="#fff0f3" stroke="${m.blocked?'#d65a5a':'#e3a9b8'}" stroke-width="3"/><ellipse cx="50" cy="118" rx="12" ry="8" fill="#d98c9b"/><ellipse cx="50" cy="${ly-2}" rx="12" ry="8" fill="#d98c9b"/>
 <circle cx="${100+M.hx*200}" cy="${100+M.hy*120}" r="13" fill="#ffd86b" fill-opacity=".6" stroke="#e7ac5f" stroke-width="3"/><text x="${100+M.hx*200}" y="${105+M.hy*120}" text-anchor="middle" font-size="14">👆</text>`;
 const lane=(xa,xb,h,col,off)=>{let o=`<rect x="${xa}" y="${312-h}" width="${xb-xa}" height="${h*2}" rx="${h}" fill="${col}" fill-opacity=".25" stroke="${col}"/>`;
  for(let q=3;q>=0;q--)o+=`<circle cx="${xa+10+(xb-xa-20)*tri((t-q*.035)*vv/(xb-xa)+off)}" cy="312" r="${q?7-q:9}" fill="${col}" fill-opacity="${q?.4/q:1}" stroke="#fff" stroke-opacity="${q?0:.8}"/>`;return o};
 s+=lane(x1,x1+Lf,Math.min(16,6+d.f*20),hue(1-d.f),0)+lane(x2,x2+Lb,Math.min(16,6+d.b*20),hue(1-d.b),.3)
  +`<text x="20" y="338" font-size="10" class="lb">front room</text><text x="430" y="338" text-anchor="end" font-size="10" class="lb">back room</text><text x="220" y="288" text-anchor="middle" font-size="10" class="lb">sound spirit lanes: fast bounce = high note (red), slow = low note (blue)</text>`;
 $('#mf-svg').innerHTML=s;return m}
function mfNext(){M.i=(M.i+1)%MIS.length;M.hold=0;M.done=false;mfText()}
function mfText(){$('#mf-mission').textContent=MIS[M.i][1];$('#mf-score').textContent='⭐ '+M.score}
function mfStep(dt){M.t+=dt;M.hx+=(M.tx-M.hx)*Math.min(1,dt*10);M.hy+=(M.ty-M.hy)*Math.min(1,dt*10);const m=mfDraw(),k=MIS[M.i][0],w=m.w[k];
 if(!M.done){M.hold=w>.7&&!m.blocked?M.hold+dt:0;$('#mf-pg').value=Math.min(1,M.hold/.8);
  $('#mf-msg').textContent=m.blocked?'🚫 Blocked! The cave is closed, so the spirit is stuck. Leave a tiny gap for it to escape. (A closed cave makes a consonant!)':w>.7?'Hold it… ✨':w>.4?'Getting warmer! 🔥':'Drag the mochi to a new shape.';
  if(M.hold>.8){M.done=true;M.score++;vowel(k);chirp();buzz([18,40,30]);const r=$('#mf-svg').getBoundingClientRect();burst(r.left+r.width*.5,r.top+r.height*.4,['🌸','✨','🍡','💛'],18);mfText();$('#mf-msg').textContent='🎉 The spirit escaped!';setTimeout(mfNext,2600)}}}

/* ---------- Game 2: Magic Hyotan Breath ---------- */
const Hy={lvl:.5,blow:false,mic:false,tilt:false,i:0,hold:0,done:false,score:0,t:0};let osc,og,an,buf;
function hyDraw(){const l=Hy.lvl,cx=110,wt=184-l*138,air=1-l,f=196+l*440,on=Hy.blow;
 let s=`<clipPath id="hyc"><ellipse cx="${cx}" cy="70" rx="26" ry="24"/><rect x="${cx-9}" y="85" width="18" height="30"/><ellipse cx="${cx}" cy="140" rx="48" ry="44"/></clipPath>
 <g fill="#9fd0e8" fill-opacity=".15" stroke="#7fb4d0" stroke-width="3"><ellipse cx="${cx}" cy="70" rx="26" ry="24"/><ellipse cx="${cx}" cy="140" rx="48" ry="44"/></g>
 <rect x="${cx-70}" y="${wt}" width="140" height="${200-wt}" fill="#6aaed6" fill-opacity=".6" clip-path="url(#hyc)"/>`;
 if(on){const L=Math.max(wt-52,4),u=(Hy.t*f/60)%2;s+=`<circle cx="${cx}" cy="${48+L*tri(u)}" r="6" fill="#ffd86b" stroke="#e7ac5f"/><text x="${cx-70}" y="42" font-size="20" opacity="${.5+.5*Math.sin(Hy.t*20)}">💨</text>`}
 s+=`<rect x="0" y="186" width="440" height="8" fill="#a2753f"/><g class="tl" font-size="17"><text x="230" y="80">Air room: ${air<.35?'tiny':air<.65?'medium':'huge'}</text><text x="230" y="112">Note: ${l>.65?'HIGH 🐭':l<.25?'LOW 🦉':'MIDDLE 🐸'}</text></g><text x="230" y="150" font-size="11" class="lb">more water = less air = higher note</text>`;
 $('#hy-svg').innerHTML=s}
function hyTone(on,f){if(!on&&!osc)return;const a=ac();if(!osc){osc=a.createOscillator();osc.type='sine';og=a.createGain();og.gain.value=0;osc.connect(og);og.connect(a.destination);osc.start()}
 osc.frequency.setTargetAtTime(f,a.currentTime,.04);og.gain.setTargetAtTime(on?.25:0,a.currentTime,.05)}
function hyText(){$('#hy-mission').textContent=HM[Hy.i][0];$('#hy-score').textContent='⭐ '+Hy.score}
function hyStep(dt){Hy.t+=dt;if(Hy.mic&&an){an.getFloatTimeDomainData(buf);let e=0;for(const v of buf)e+=v*v;Hy.blow=Math.sqrt(e/buf.length)>.03}
 hyTone(Hy.blow,196+Hy.lvl*440);hyDraw();const ok=HM[Hy.i][1](Hy.lvl);
 if(!Hy.done){Hy.hold=Hy.blow&&ok?Hy.hold+dt:0;$('#hy-pg').value=Math.min(1,Hy.hold/.8);
  $('#hy-msg').textContent=!Hy.blow?'Pour the water, then blow across the top! 💨':ok?'That’s the right note… keep blowing! ✨':`Not yet! Try ${HM[Hy.i][2]}: ${Hy.i===1?'pour water out':Hy.i===0?'add more water':'a bit in the middle'}.`;
  if(Hy.hold>.8){Hy.done=true;Hy.score++;chirp();buzz([18,40,30]);const r=$('#hy-svg').getBoundingClientRect();burst(r.left+r.width*.25,r.top+r.height*.4,['🎃','✨','🌸','💛'],18);hyText();$('#hy-msg').textContent='🎉 Beautiful!';setTimeout(()=>{Hy.i=(Hy.i+1)%HM.length;Hy.hold=0;Hy.done=false;hyText()},2600)}}}

function build(){const sec=document.createElement('section');sec.className='studio';sec.id='cave';
 sec.innerHTML=`<h2>🥒 Kuu’s Cave Games</h2><p>Meet Kuu the Kappa. In his mountain cave the <b>sofa is a squishy mochi</b>, the <b>kazoo is a taiko drum</b>, and the <b>bottle is a magic gourd (hyotan)</b>. Same ideas as the rooms above, now as games.</p>
 <div class="row" id="cv-tabs"><button class="chip" data-g="mf" aria-selected="true">🍡 The Mochi Forge</button><button class="chip" data-g="hy" aria-selected="false">🎃 Magic Hyotan Breath</button></div>
 <div id="g-mf"><p id="mf-mission" style="font-weight:700;font-size:16px"></p><p>Drag your finger inside the cave to squish and stretch the mochi (the tongue). Watch the sound spirit bounce!</p>
  <svg id="mf-svg" viewBox="0 0 440 340" style="touch-action:none;cursor:grab" role="img" aria-label="Cave with a mochi tongue you can drag, and two lanes where a sound spirit bounces"></svg>
  <div class="row"><progress id="mf-pg" max="1" value="0" style="flex:1;min-width:120px"></progress><button class="chip" id="mf-hint" aria-pressed="false">💡 Hint</button><span id="mf-score"></span></div><p id="mf-msg"></p></div>
 <div id="g-hy" hidden><p id="hy-mission" style="font-weight:700;font-size:16px"></p><p>Pour water in or out, then blow across the top like a bottle. Tip: tilt your tablet to pour, and use the mic to blow for real.</p>
  <svg id="hy-svg" viewBox="0 0 440 210" role="img" aria-label="A magic gourd with adjustable water level"></svg>
  <label style="display:block;margin-top:8px">💧 Water level<input type="range" id="hy-lvl" min="0" max="100" value="50" style="width:100%"></label>
  <div class="row"><button class="chip" id="hy-blow">💨 Hold to blow</button><button class="chip" id="hy-mic" aria-pressed="false">🎤 Blow into the mic</button><button class="chip" id="hy-tilt" aria-pressed="false">📱 Tilt to pour</button><span id="hy-score"></span></div>
  <progress id="hy-pg" max="1" value="0" style="width:100%"></progress><p id="hy-msg"></p></div>
 <p style="font-size:12px">Privacy: the microphone is only used to measure how hard you blow. Nothing is recorded or sent anywhere.</p>`;
 $('#breezy').after(sec);
 $('#cv-tabs').onclick=e=>{const g=e.target.dataset.g;if(!g)return;document.querySelectorAll('#cv-tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.g===g));$('#g-mf').hidden=g!=='mf';$('#g-hy').hidden=g!=='hy'};
 const svg=$('#mf-svg'),mv=e=>{const r=svg.getBoundingClientRect();M.tx=cl(((e.clientX-r.left)/r.width*440-100)/200,0,1);M.ty=cl(((e.clientY-r.top)/r.height*340-100)/120,0,1)};
 svg.onpointerdown=e=>{M.drag=true;svg.setPointerCapture(e.pointerId);ac();mv(e)};svg.onpointermove=e=>M.drag&&mv(e);svg.onpointerup=()=>M.drag=false;
 $('#mf-hint').onclick=e=>{M.hint=!M.hint;e.target.setAttribute('aria-pressed',M.hint)};
 $('#hy-lvl').oninput=e=>Hy.lvl=e.target.value/100;
 const hb=$('#hy-blow'),on=v=>()=>{Hy.blow=v;if(v)ac()};['pointerdown'].forEach(n=>hb.addEventListener(n,on(true)));['pointerup','pointerleave','pointercancel'].forEach(n=>hb.addEventListener(n,on(false)));
 $('#hy-mic').onclick=async e=>{if(Hy.mic){Hy.mic=false;e.target.setAttribute('aria-pressed',false);return}
  try{const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false}}),a=ac(),src=a.createMediaStreamSource(st);an=a.createAnalyser();an.fftSize=1024;buf=new Float32Array(1024);src.connect(an);Hy.mic=true;e.target.setAttribute('aria-pressed',true)}catch(x){$('#hy-msg').textContent='The microphone is not available. Use the “Hold to blow” button instead.'}};
 $('#hy-tilt').onclick=async e=>{if(Hy.tilt){Hy.tilt=false;e.target.setAttribute('aria-pressed',false);return}
  try{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission&&await DeviceOrientationEvent.requestPermission()!=='granted')throw 0;
   if(!window.DeviceOrientationEvent)throw 0;Hy.tilt=true;e.target.setAttribute('aria-pressed',true)}catch(x){$('#hy-msg').textContent='Tilt is not available here. Use the water slider instead.'}};
 addEventListener('deviceorientation',e=>{if(Hy.tilt&&e.gamma!=null){Hy.lvl=cl((e.gamma+45)/90,0,1);$('#hy-lvl').value=Math.round(Hy.lvl*100)}});
 let vis=true;new IntersectionObserver(en=>vis=en[0].isIntersecting).observe(sec);
 mfText();hyText();mfDraw();hyDraw();
 let last=performance.now();(function tick(n){const dt=Math.min((n-last)/1000,.1);last=n;if(vis){if(!$('#g-mf').hidden)mfStep(dt);else hyStep(dt)}requestAnimationFrame(tick)})(last)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',build):build();
})();
