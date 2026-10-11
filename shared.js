// URL SCRIPT GOOGLE ANDA (deploy dari Code.gs)
const API='https://script.google.com/macros/s/AKfycbwSZYK5JC5Xb4GVTUskvQxvJUA3h6tLWkwTvOPXoGpmFqEfVaGJYXA4fOUUgMUZhxpgdA/exec';
const $=i=>document.getElementById(i);
const post=b=>fetch(API,{method:'POST',body:JSON.stringify(b),headers:{'Content-Type':'text/plain;charset=utf-8'}}).then(r=>r.json());
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
let tt;
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3800)}
const thumbs=(id,w)=>[`https://lh3.googleusercontent.com/d/${id}=w${w}`,`https://drive.google.com/thumbnail?id=${id}&sz=w${w}`,`https://drive.google.com/uc?export=view&id=${id}`];
function setImg(img,list,fail){
  let i=0;img.referrerPolicy='no-referrer';
  const f=fail||(()=>{const d=document.createElement('div');d.className='broken';d.textContent='Pratinjau belum tersedia';img.replaceWith(d)});
  img.onerror=()=>{++i<list.length?img.src=list[i]:f()};
  img.src=list[0];
}

/* ===== Tema & pengaturan tampilan ===== */
// [aksen, gradasi judul 1, gradasi judul 2, aksen gelap (untuk latar putih)]
const T=[['#D4AF37','#f3dd8f','#c9a227','#8a6d12'],['#d9a38f','#f5cfc0','#b76e79','#8f4a55'],['#e6d3a3','#fff3d6','#c9b37e','#8a7440'],['#9caf88','#d6e2c8','#7a9a6b','#4d6b3f'],['#d98ca6','#f7c6d6','#b5607f','#8a3a58'],['#8ab6d6','#d3e8f7','#5b8db8','#2f6491'],['#b39ddb','#e4d9f7','#8c73c4','#5d46a0'],['#d98a63','#f7c9a8','#b4552f','#8a3a18'],['#4fb39a','#aee8d8','#2a7f6b','#17604f'],['#c0c4cc','#ffffff','#8e95a3','#5a6170'],
['#c25b6b','#f0b4bd','#9a2e45','#7a1f33'],['#7f9bd1','#c9d6f2','#4d6cae','#243f7a'],['#a3b565','#dfe8b8','#7d8f3f','#566626'],['#a77ab8','#e0c7ea','#7d4a92','#55296a'],['#f0a35e','#fbd3a8','#d17a2c','#9a5112'],['#5fb8c4','#b5e6ec','#2f8794','#1c6571'],['#d1625c','#f4b5b0','#a63a35','#7d211d'],['#b8896a','#e6cdb9','#8c5f42','#63402a'],['#7fd1ae','#c4f0de','#4fa987','#2c7a5c'],['#f0d36b','#fbeeb5','#d3b13a','#8f7410'],
['#f5f5f5','#ffffff','#d0d0d0','#0a0a0a','#2a2a2a'],['#c9ced6','#eef0f3','#9aa1ad','#36454f','#4a5a66']];
const TN=['Emas Klasik','Rose Gold','Champagne','Sage','Dusty Rose','Biru Langit','Lavender','Terracotta','Zamrud','Perak','Burgundy','Navy Lembut','Zaitun','Ungu Anggur','Oranye Senja','Teal Laut','Merah Marun','Mocha','Mint Segar','Kuning Mentega','Hitam Pekat (cocok bg putih)','Charcoal Grey (cocok bg putih)'];
// root = document (halaman tamu) atau elemen pembungkus pratinjau (admin)
function applyCfg(c,root=document){
  const r=root===document?document.documentElement:root,L=c.mode==='light',t=T[c.theme]||T[0];
  [['--bg',L?'#faf7f0':'#0a0a0a'],['--tx',L?'#2a2418':'#f5f0e6'],['--mut',L?'#7a7466':'#9a9486'],['--ln',L?'#e6dfcf':'#2e2a22'],['--hl',L?'#efe6cf':'#2a2210'],['--card',L?'#ffffff':'#171512'],
   ['--ac',t[0]],['--gold',L?t[3]:t[0]],['--g1',L?t[3]:t[1]],['--g2',L?(t[4]||t[0]):t[2]],['--ob',L?'#1a160d':'#f1ebdd'],['--g3',L?t[3]:'#ffffff']].forEach(a=>r.style.setProperty(a[0],a[1]));
  root.querySelectorAll('[data-k]').forEach(e=>{e.textContent=c[e.dataset.k]||'';e.style.setProperty('--f',(c['s_'+e.dataset.k]||100)/100)});
  const P=Math.min(100,Math.max(0,c.tPos??50)),s1=root.querySelector('#sp1'),s2=root.querySelector('#sp2'),ev=root.querySelector('.evt');
  if(s1&&s2){s1.style.flexGrow=P;s2.style.flexGrow=100-P}
  if(ev)ev.hidden=!(c.loc||c.date);
  const h=root.querySelector('.hero'),b=root.querySelector('.hbg'),o=(c.bgX??50)+'% '+(c.bgY??50)+'%';
  h.style.minHeight=(c.hHeight||340)+'px';
  root.querySelector('.shade').style.opacity=(c.bgDark??55)/100;
  b.style.backgroundPosition=o;b.style.transformOrigin=o;b.style.transform='scale('+(c.bgZoom||100)/100+')';
  if(!c.bgId){b.classList.remove('on');b.dataset.id='';b.style.backgroundImage=''}
  else if(c.bgId==='local'){
    if(c.bgData&&b.dataset.lb!==''+c.bgData.length){b.style.backgroundImage='url(data:image/jpeg;base64,'+c.bgData+')';b.dataset.lb=''+c.bgData.length;b.classList.add('on')}
    b.dataset.id='local';
  }
  else if(b.dataset.id!==c.bgId){
    b.dataset.id=c.bgId;const l=thumbs(c.bgId,1800),im=new Image();let i=0;
    im.onload=()=>{b.style.backgroundImage=`url(${im.src})`;b.classList.add('on')};
    im.onerror=()=>{++i<l.length&&(im.src=l[i])};im.src=l[0];
  }
  if(root===document&&c.title)document.title=c.title+' · Galeri Kenangan';
}

/* ===== Lightbox: swipe kiri-kanan, foto tetangga terlihat di belakang ===== */
const LB={l:[],i:0,S:[$('lp'),$('li'),$('ln')]};
const step=()=>Math.min(($('lb').clientWidth||innerWidth)*.62,380);
function put(img,p){
  if(!p){img.style.visibility='hidden';img.removeAttribute('src');img.dataset.id='';return}
  img.style.visibility='';
  if(img.dataset.id!==p.fileId){img.dataset.id=p.fileId;img.removeAttribute('src');setImg(img,thumbs(p.fileId,1600),()=>{})}
}
function cap(){const p=LB.l[LB.i]||{},c=$('lc').children;c[0].textContent=p.uploaderName||'Tamu';c[1].textContent=p.pesan||''}
function fillS(){const[a,b,c]=LB.S;put(a,LB.l[LB.i-1]);put(b,LB.l[LB.i]);put(c,LB.l[LB.i+1]);cap()}
// f: 0 = di tengah, 1 = posisi tetangga, 2 = sudah keluar layar. Di antara 1 dan 2 foto memudar halus.
function lay(dx,drag){
  const s=step();
  LB.S.forEach((e,k)=>{const x=(k-1)*s+dx,f=Math.min(2,Math.abs(x)/s),n=Math.min(1,f);
    e.style.transition=drag?'none':'';e.style.setProperty('--x',x+'px');e.style.setProperty('--s',1-.2*n);
    e.style.opacity=f<=1?1-.5*f:.5*(2-f);e.style.zIndex=3-Math.round(n*2)});
}
function lbOpen(list,i){if(i<0||!list[i])return;LB.l=list;LB.i=i;fillS();lay(0,false);$('lb').classList.add('on')}
const lbClose=()=>$('lb').classList.remove('on');
let lock=false;
const DUR=870; // sedikit lebih lama dari transisi CSS (.85s) agar gerak selesai sebelum slot didaur ulang
function go(d){
  if(lock)return;
  const n=LB.i+d;if(n<0||n>=LB.l.length)return lay(0,false);
  lock=true;lay(-d*step(),false);
  setTimeout(()=>{
    LB.i=n;d>0?LB.S.push(LB.S.shift()):LB.S.unshift(LB.S.pop());
    const[a,b,c]=LB.S,nb=d>0?c:a; // nb = slot yang baru didaur ulang jadi tetangga baru
    put(a,LB.l[n-1]);put(b,LB.l[n]);put(c,LB.l[n+1]);cap();
    lay(0,true);nb.style.opacity=0;void nb.offsetWidth; // tetangga baru mulai transparan lalu memudar masuk
    requestAnimationFrame(()=>{lay(0,false);lock=false});
  },DUR);
}
let sx=null,dx=0,t0=0;
const stg=$('stg');
stg.onpointerdown=e=>{if(lock)return;sx=e.clientX;dx=0;t0=performance.now();try{stg.setPointerCapture(e.pointerId)}catch(x){}};
stg.onpointermove=e=>{
  if(sx===null)return;dx=e.clientX-sx;
  const edge=(dx>0&&LB.i===0)||(dx<0&&LB.i===LB.l.length-1);lay(edge?dx*.3:dx,true);
};
function up(e){
  if(sx===null)return;const d=dx,v=Math.abs(d)/Math.max(1,performance.now()-t0);sx=null;
  if(Math.abs(d)>60||(Math.abs(d)>20&&v>.5))go(d<0?1:-1); // geser cukup jauh, atau lemparan cepat
  else{
    lay(0,false);
    if(Math.abs(d)<6){const el=document.elementFromPoint(e.clientX,e.clientY);
      if(el===LB.S[0])go(-1);else if(el===LB.S[2])go(1);else if(el!==LB.S[1])lbClose()}
  }
}
stg.onpointerup=up;stg.onpointercancel=()=>{sx=null;lay(0,false)};
$('lb').querySelector('.x').onclick=lbClose;
addEventListener('resize',()=>{if($('lb').classList.contains('on'))lay(0,true)});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){lbClose();window.onEsc&&onEsc()}
  if($('lb').classList.contains('on')){if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)}
});
