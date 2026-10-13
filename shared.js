// URL SCRIPT GOOGLE ANDA (deploy dari Code.gs)
const API='https://script.google.com/macros/s/AKfycbz8D-1eJ_jzkyxNc9BtmtUiv0DYgJvflk3TRwQYpI5xhvPQa2KhmCDyo_jkuvpKuAK6vA/exec';
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
  if(ev){ev.hidden=!(c.loc||c.date);ev.style.setProperty('--ep',Math.min(100,Math.max(0,c.ePos??100)))} // grup lokasi & tanggal: 0 = atas header, 100 = bawah
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

/* ===== Lightbox: foto mengambang di tengah, tetangga di belakang kiri-kanan, geser manual + slideshow otomatis ===== */
// LB.loop: putar terus dari foto terakhir ke foto pertama. LB.auto: geser otomatis ke kiri tiap LB.hold ms (diatur halaman tamu; admin tetap manual).
const LB={l:[],i:0,S:[],loop:false,auto:false,hold:4000};
const stg=$('stg');
// 3 slide: kiri = foto sebelumnya, tengah = foto yang dibuka, kanan = foto berikutnya. Tiap slide = nama (atas) + foto + pesan (bawah).
LB.S=[0,1,2].map(()=>{const e=document.createElement('div'),im=document.createElement('img');e.className='sl';im.alt='';im.draggable=false;e.append(document.createElement('b'),im,document.createElement('span'));stg.appendChild(e);return e});
const step=()=>Math.min(($('lb').clientWidth||innerWidth)*.62,380);
const DUR=1040; // = --dur di shared.css (1s) + sedikit jeda, supaya gerak selesai dulu baru slot didaur ulang
const isOpen=()=>$('lb').classList.contains('on');
// foto pada posisi i+d; saat loop, melingkar (setelah foto terakhir kembali ke foto pertama)
function nbr(d){const N=LB.l.length,j=LB.i+d;return LB.loop&&N>1?LB.l[((j%N)+N)%N]:LB.l[j]}
function put(e,p){
  const[b,im,s]=e.children;
  if(!p){e.style.visibility='hidden';return}
  e.style.visibility='';b.textContent=p.uploaderName||'Tamu';s.textContent=p.pesan||'';
  if(im.dataset.id!==p.fileId){im.dataset.id=p.fileId;im.removeAttribute('src');setImg(im,thumbs(p.fileId,1600),()=>{})}
}
function fillS(){put(LB.S[0],nbr(-1));put(LB.S[1],nbr(0));put(LB.S[2],nbr(1))}
// f: 0 = di tengah, 1 = posisi tetangga, 2 = sudah keluar layar. Di antara 1 dan 2 foto memudar halus.
function lay(dx,drag){
  const s=step();
  LB.S.forEach((e,k)=>{const x=(k-1)*s+dx,f=Math.min(2,Math.abs(x)/s),n=Math.min(1,f);
    e.style.transition=drag?'none':'';e.style.setProperty('--x',x+'px');e.style.setProperty('--s',1-.2*n);
    e.style.opacity=f<=1?1-.5*f:.5*(2-f);e.style.zIndex=3-Math.round(n*2)});
}
// muat lebih awal foto yang sebentar lagi jadi tetangga baru, agar saat slideshow berjalan tidak "muncul tiba-tiba"
function pre(){[-2,2].forEach(d=>{const p=nbr(d);if(p)new Image().src=thumbs(p.fileId,1600)[0]})}
let ap=0,lock=false;
function arm(){ // jadwalkan geser otomatis berikutnya; foto diam selama LB.hold
  clearTimeout(ap);
  if(!LB.auto||!isOpen()||document.hidden||LB.l.length<2)return;
  ap=setTimeout(()=>{if(sx!==null||lock)return arm();go(1)},LB.hold);
}
function lbOpen(list,i){if(i<0||!list[i])return;LB.l=list;LB.i=i;fillS();lay(0,false);$('lb').classList.add('on');arm();pre()}
const lbClose=()=>{$('lb').classList.remove('on');clearTimeout(ap)};
function go(d){
  if(lock)return;
  const N=LB.l.length,n=LB.loop?((LB.i+d)%N+N)%N:LB.i+d;
  if(N<2||n<0||n>=N||n===LB.i){lay(0,false);return arm()}
  lock=true;clearTimeout(ap);lay(-d*step(),false); // semua slide (foto + nama + pesan) bergeser bersama dengan transisi yang sama
  setTimeout(()=>{
    LB.i=n;d>0?LB.S.push(LB.S.shift()):LB.S.unshift(LB.S.pop());
    const nb=d>0?LB.S[2]:LB.S[0]; // slot yang baru didaur ulang jadi tetangga baru
    fillS();lay(0,true);nb.style.opacity=0;void nb.offsetWidth; // tetangga baru mulai transparan lalu memudar masuk
    requestAnimationFrame(()=>{lay(0,false);lock=false;arm();pre()});
  },DUR);
}
let sx=null,dx=0,t0=0;
stg.onpointerdown=e=>{if(lock)return;sx=e.clientX;dx=0;t0=performance.now();clearTimeout(ap);try{stg.setPointerCapture(e.pointerId)}catch(x){}};
stg.onpointermove=e=>{
  if(sx===null)return;dx=e.clientX-sx;
  const edge=!LB.loop&&((dx>0&&LB.i===0)||(dx<0&&LB.i===LB.l.length-1));lay(edge?dx*.3:dx,true);
};
function up(e){
  if(sx===null)return;const d=dx,v=Math.abs(d)/Math.max(1,performance.now()-t0);sx=null;
  if(Math.abs(d)>60||(Math.abs(d)>20&&v>.5))go(d<0?1:-1); // geser cukup jauh, atau lemparan cepat
  else{
    lay(0,false);
    if(Math.abs(d)<6){const el=document.elementFromPoint(e.clientX,e.clientY),sl=el&&el.closest?el.closest('.sl'):null;
      if(sl===LB.S[0])go(-1);else if(sl===LB.S[2])go(1);else if(sl!==LB.S[1])lbClose()}
    arm();
  }
}
stg.onpointerup=up;stg.onpointercancel=()=>{sx=null;lay(0,false);arm()};
$('lb').querySelector('.x').onclick=lbClose;
addEventListener('resize',()=>{if(isOpen())lay(0,true)});
document.addEventListener('visibilitychange',()=>document.hidden?clearTimeout(ap):arm());
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){lbClose();window.onEsc&&onEsc()}
  if(isOpen()){if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)}
});
