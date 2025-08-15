/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){e.preventDefault();document.querySelector(id)?.scrollIntoView({behavior:'smooth'});}
  });
});

/* Copy button */
document.querySelectorAll('.btn.copy').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const sel = btn.getAttribute('data-copy');
    const el = document.querySelector(sel);
    if(!el) return;
    navigator.clipboard.writeText(el.value||el.textContent||'');
    btn.textContent='Copied!';
    setTimeout(()=>btn.textContent='Copy',1200);
  });
});

/* NFT gallery placeholders */
const nftGrid = document.getElementById('nftGrid');
const sample = Array.from({length:12}).map((_,i)=>({
  src:`https://picsum.photos/seed/froggy${i+1}/600/600`,
  cap:`Froggy #${i+1}`
}));
sample.forEach(({src,cap},idx)=>{
  const t=document.createElement('div');
  t.className='tile pop';
  t.innerHTML=`<img src="${src}" alt="${cap}"><span class="shine"></span><span class="cap">${cap}</span>`;
  t.addEventListener('mousemove',e=>{
    const r=t.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width*100;
    t.style.setProperty('--mx',x+'%');
  });
  t.addEventListener('mouseleave',()=>t.style.removeProperty('--mx'));
  t.addEventListener('click',()=>openLightbox(idx));
  nftGrid.appendChild(t);
});

/* Lightbox */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let cur = 0;

function show(i){
  cur=(i+sample.length)%sample.length;
  lbImg.src = sample[cur].src;
  lbImg.alt = sample[cur].cap;
}
function openLightbox(i){ show(i); lb.classList.add('active'); lb.setAttribute('aria-hidden','false'); }
function closeLightbox(){ lb.classList.remove('active'); lb.setAttribute('aria-hidden','true'); }
lbClose.addEventListener('click',closeLightbox);
lb.addEventListener('click',e=>{ if(e.target===lb) closeLightbox(); });
lbPrev.addEventListener('click',()=>show(cur-1));
lbNext.addEventListener('click',()=>show(cur+1));
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('active')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowLeft') show(cur-1);
  if(e.key==='ArrowRight') show(cur+1);
});

/* Fun micro-interactions */
document.querySelectorAll('.token-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`rotateX(${y*-4}deg) rotateY(${x*6}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});

/* Favicon + logo fallbacks if missing files */
(function ensureAssets(){
  const logo = document.querySelectorAll('img.logo');
  logo.forEach(img=>{
    img.addEventListener('error',()=>{
      const c=document.createElement('canvas'); c.width=c.height=128;
      const ctx=c.getContext('2d');
      const g=ctx.createLinearGradient(0,0,128,128); g.addColorStop(0,'#67ff9c'); g.addColorStop(1,'#34b6ff');
      ctx.fillStyle=g; ctx.fillRect(0,0,128,128);
      ctx.fillStyle='#081018'; ctx.font='bold 64px Bangers, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('F',64,70);
      img.src=c.toDataURL();
    },{once:true});
  });

  const link=document.querySelector('link[rel="icon"]');
  const testImg=new Image();
  testImg.onerror=()=>{
    const c=document.createElement('canvas'); c.width=c.height=64;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#34b6ff'; ctx.beginPath(); ctx.arc(32,32,30,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#081018'; ctx.font='bold 36px Bangers, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('F',32,36);
    link.href=c.toDataURL('image/png');
  };
  testImg.src=link.href;
})();
