// URL SCRIPT GOOGLE ANDA (deploy baru dari Code.gs)
const API='https://script.google.com/macros/s/AKfycby1qUJo86dv7iOeZTF5PckM9kWYx3bbEksLS3A9fAb_gDTjlrPFzX8_AVwXZqi6bts9dg/exec';
const $=i=>document.getElementById(i);
const post=b=>fetch(API,{method:'POST',body:JSON.stringify(b),headers:{'Content-Type':'text/plain;charset=utf-8'}}).then(r=>r.json());
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
let tt;
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3800)}
const thumbs=(id,w)=>[`https://lh3.googleusercontent.com/d/${id}=w${w}`,`https://drive.google.com/thumbnail?id=${id}&sz=w${w}`,`https://drive.google.com/uc?export=view&id=${id}`];
// coba beberapa alamat gambar Drive berurutan sampai ada yang berhasil
function setImg(img,list,fail){
  let i=0;img.referrerPolicy='no-referrer';
  const f=fail||(()=>{const d=document.createElement('div');d.className='broken';d.textContent='Pratinjau belum tersedia';img.replaceWith(d)});
  img.onerror=()=>{++i<list.length?img.src=list[i]:f()};
  img.src=list[0];
}
function applyCfg(c,root=document){
  root.querySelectorAll('[data-k]').forEach(e=>{e.textContent=c[e.dataset.k]||''});
  const h=root.querySelector('.hero'),b=root.querySelector('.hbg'),o=(c.bgX??50)+'% '+(c.bgY??50)+'%';
  h.style.minHeight=(c.hHeight||340)+'px';
  root.querySelector('.shade').style.opacity=(c.bgDark??55)/100;
  b.style.backgroundPosition=o;b.style.transformOrigin=o;b.style.transform='scale('+(c.bgZoom||100)/100+')';
  if(!c.bgId){b.classList.remove('on');b.dataset.id='';b.style.backgroundImage=''}
  else if(c.bgId!=='local'&&b.dataset.id!==c.bgId){
    b.dataset.id=c.bgId;const l=thumbs(c.bgId,1800),t=new Image();let i=0;
    t.onload=()=>{b.style.backgroundImage=`url(${t.src})`;b.classList.add('on')};
    t.onerror=()=>{++i<l.length&&(t.src=l[i])};t.src=l[0];
  }
  if(root===document&&c.title)document.title=c.title+' · Galeri Kenangan';
}
function lbOpen(id,cap){
  const i=$('li');i.removeAttribute('src');
  setImg(i,thumbs(id,1800),()=>toast('Foto tidak dapat dimuat'));
  $('lc').textContent=cap||'';$('lb').classList.add('on');
}
const lbClose=()=>$('lb').classList.remove('on');
$('lb').onclick=e=>{if(e.target.id!=='li')lbClose()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){lbClose();window.onEsc&&onEsc()}});
