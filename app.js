import './site-nav.js';
import {quoteDrawer} from './quote-drawer.js';
import {html} from './catalog-ui.js';

const intro=document.querySelector('#site-intro');
const introVideo=document.querySelector('#intro-video');
const introLaunch=document.querySelector('#play-intro');
const introClose=document.querySelector('#skip-intro');
let introTimer;
function closeIntro(){
  clearTimeout(introTimer);
  intro.hidden=true;
  introVideo.pause();
  document.body.classList.remove('intro-active');
  introLaunch.focus();
}
introLaunch.hidden=false;
introLaunch.onclick=()=>{
  const source=introVideo.querySelector('source');
  if(source.getAttribute('src')!==source.dataset.src){source.src=source.dataset.src;introVideo.load()}
  intro.hidden=false;
  document.body.classList.add('intro-active');
  introClose.focus();
  introTimer=setTimeout(closeIntro,4500);
  introVideo.play().catch(closeIntro);
};
introClose.onclick=closeIntro;
introVideo.addEventListener('ended',closeIntro);
document.addEventListener('keydown',event=>{
  if(intro.hidden)return;
  if(event.key==='Escape'){event.preventDefault();closeIntro()}
  if(event.key==='Tab'){event.preventDefault();introClose.focus()}
});
const heroVideo=document.querySelector('.hero-media video');
const desktopMotion=window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
function updateHeroVideo(){
  if(!desktopMotion.matches){heroVideo.pause();heroVideo.hidden=true;return}
  const source=heroVideo.querySelector('source');
  if(source.getAttribute('src')!==source.dataset.src){source.src=source.dataset.src;heroVideo.load()}
  heroVideo.play().then(()=>{heroVideo.hidden=!desktopMotion.matches;if(heroVideo.hidden)heroVideo.pause()}).catch(()=>{heroVideo.hidden=true});
}
heroVideo.addEventListener('error',()=>{heroVideo.hidden=true});
desktopMotion.addEventListener('change',updateHeroVideo);
if(document.readyState==='complete')updateHeroVideo();
else window.addEventListener('load',updateHeroVideo,{once:true});

const fallbackProducts = [
  {id:'soldadora',name:'Soldadora',category:'herramientas',image:'soldadora.jpg'},
  {id:'camara-inspeccion',name:'Cámara de inspección',category:'herramientas',image:'camara-inspeccion.jpg'},
  {id:'disco-diamantado',name:'Disco diamantado',category:'herramientas',image:'disco-diamantado.jpg'},
  {id:'sierra-copa',name:'Sierra copa',category:'herramientas',image:'sierra-copa-wello.jpg'},
  {id:'llave-pico-loro',name:'Llave pico de loro',category:'herramientas',image:'llave-pico-loro.jpg'},
  {id:'tijera-podar',name:'Tijera de podar',category:'herramientas',image:'tijera-podar.jpg'},
  {id:'escalera',name:'Escalera 8 peldaños',category:'herramientas',image:'escalera-8-peldanos.jpg'},
  {id:'serrucho-inglete',name:'Serrucho de inglete',category:'herramientas',image:'serruch-englete.jpg'},
  {id:'coplas-hdpe',name:'Coplas HDPE',category:'fitting',image:'coplas-hope.jpg'},
  {id:'tuberia-hdpe',name:'Tubería HDPE',category:'fitting',image:'tuberia-hope-3.jpg'},
  {id:'terminal-compresion',name:'Terminal de compresión',category:'fitting',image:'terminal-compresion.jpg'},
  {id:'tee-pvc',name:'Tee de PVC',category:'fitting',image:'t-de-pvc.jpg'},
  {id:'griferia',name:'Grifería Piazza',category:'fitting',image:'griferia-piazza.jpg'},
  {id:'pintura-3en1',name:'Pintura 3 en 1',category:'pinturas',image:'pintura-3-en-1.jpg'},
  {id:'membrana',name:'Membrana hidrófuga',category:'pinturas',image:'membrana-hidroguga.jpg'},
  {id:'siliconas',name:'Siliconas y selladores',category:'pinturas',image:'silicona-y-selladores.jpg'},
  {id:'tapagotera',name:'Tapagotera',category:'pinturas',image:'tapagotera.jpg'},
  {id:'bandeja-pintura',name:'Bandeja para pintura',category:'pinturas',image:'bandeja-para-pintura.jpg'},
  {id:'zinc',name:'Planchas de zinc',category:'construccion',image:'zinc.jpg'},
  {id:'malla-acero',name:'Malla de acero',category:'construccion',image:'malla-de-acero.jpg'},
  {id:'alambre-pua',name:'Alambre de púas',category:'construccion',image:'alambre-pua.jpg'},
  {id:'clavo-techo',name:'Clavo de techo 2 ½”',category:'construccion',image:'clavo-techo-212.jpg'},
  {id:'horqueta',name:'Horqueta',category:'construccion',image:'horqueta.jpg'},
  {id:'rastrillo',name:'Rastrillo de fierro',category:'construccion',image:'rastrillo-de-fierro.jpg'}
];
let products=[];
let cartProducts=[];
let adminSession=null;
const labels={herramientas:'Herramientas',fitting:'Fitting y conexiones',pinturas:'Pinturas y selladores',construccion:'Construcción'};
const grid=document.querySelector('#product-grid'),search=document.querySelector('#search-input'),count=document.querySelector('#result-count'),empty=document.querySelector('#empty-state');
let activeFilter='all';
let cart={};
try{cart=JSON.parse(localStorage.getItem('lacustre-quote'))||{}}catch{cart={}}
const asset=name=>name.includes('/')?name.split('/').map(encodeURIComponent).join('/'):`ferreterialacustre/${encodeURIComponent(name)}`;
const validPrice=value=>value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value));
const productPrice=p=>!validPrice(p.price)?'<div class="product-prices price-consult">Precio a consultar</div>':p.is_offer==1&&validPrice(p.old_price)?`<div class="product-prices"><del>$${Number(p.old_price).toLocaleString('es-CL')}</del><strong>$${Number(p.price).toLocaleString('es-CL')}</strong></div>`:`<div class="product-prices"><strong>$${Number(p.price).toLocaleString('es-CL')}</strong></div>`;
function renderProducts(){
  const term=search?search.value.trim().toLocaleLowerCase('es'):'';
  const visible=products.filter(p=>(activeFilter==='all'||p.category===activeFilter)&&p.name.toLocaleLowerCase('es').includes(term));
  grid.innerHTML=visible.map(p=>`<article class="product-card" data-product-id="${html(p.id)}"><a class="product-link" href="producto.php?id=${encodeURIComponent(p.id)}"><div class="product-image">${p.image?`<img src="${asset(p.image)}" alt="${html(p.name)}" width="640" height="853" loading="lazy">`:'<span class="no-image">Sin fotografía</span>'}<span class="tag">${p.is_offer==1?'Oferta':labels[p.category]||'Producto'}</span></div><div class="product-meta"><div><small>Ver detalles</small><h3>${html(p.name)}</h3>${productPrice(p)}</div></div></a><button class="add-product card-add ${cart[p.id]?'added':''}" data-id="${html(p.id)}" type="button" aria-label="Agregar ${html(p.name)} a cotización">${cart[p.id]?'✓':'+'}</button></article>`).join('');
  count.textContent=`${visible.length} ${visible.length===1?'producto':'productos'}`; empty.hidden=visible.length>0;
}
function selectFilter(value){activeFilter=value;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===value));renderProducts();document.querySelector('#productos').scrollIntoView({behavior:'smooth'});}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>selectFilter(b.dataset.filter)));
if(search)search.addEventListener('input',renderProducts);
grid.addEventListener('click',e=>{const edit=e.target.closest('[data-edit-id]');if(edit){openQuickEdit(edit.dataset.editId);return}const button=e.target.closest('.add-product');if(!button)return;cart[button.dataset.id]=(cart[button.dataset.id]||0)+1;const selected=products.find(p=>p.id===button.dataset.id);if(selected&&!cartProducts.some(p=>p.id===selected.id))cartProducts.push(selected);saveCart();renderProducts();renderCart();openQuote();});
function saveCart(){try{localStorage.setItem('lacustre-quote',JSON.stringify(cart))}catch{}updateCount();}
function updateCount(){const total=Object.values(cart).reduce((a,b)=>a+b,0);const el=document.querySelector('#cart-count');el.textContent=total;el.setAttribute('aria-label',`${total} productos`);}
const openQuote=quoteDrawer({
  panel:document.querySelector('#quote-panel'),
  backdrop:document.querySelector('#drawer-backdrop'),
  closeButton:document.querySelector('#close-quote'),
  triggers:document.querySelectorAll('.quote-trigger')
});
function renderCart(){const wrap=document.querySelector('#quote-items'),items=cartProducts.filter(p=>cart[p.id]);document.querySelector('#quote-empty').hidden=items.length>0;document.querySelector('.quote-footer').hidden=items.length===0;wrap.innerHTML=items.map(p=>`<div class="quote-item">${p.image?`<img src="${asset(p.image)}" alt="">`:''}<div><strong>${html(p.name)}</strong><div class="qty"><button data-action="minus" data-id="${html(p.id)}" aria-label="Quitar uno">−</button><span>${cart[p.id]}</span><button data-action="plus" data-id="${html(p.id)}" aria-label="Agregar uno">+</button></div></div><button class="remove-item" data-action="remove" data-id="${html(p.id)}">Quitar</button></div>`).join('');}
document.querySelector('#quote-items').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const id=b.dataset.id;if(b.dataset.action==='plus')cart[id]++;if(b.dataset.action==='minus')cart[id]--;if(b.dataset.action==='remove'||cart[id]<=0)delete cart[id];saveCart();renderCart();renderProducts();});
const customerInputs={name:document.querySelector('#customer-name'),phone:document.querySelector('#customer-phone')};try{const saved=JSON.parse(localStorage.getItem('lacustre-customer'))||{};customerInputs.name.value=saved.name||'';customerInputs.phone.value=saved.phone||''}catch{}
document.querySelector('#send-quote').addEventListener('click',()=>{const items=cartProducts.filter(p=>cart[p.id]);if(!items.length)return;const name=customerInputs.name.value.trim(),phone=customerInputs.phone.value.trim(),error=document.querySelector('#customer-error');if(name.length<2){error.textContent='Ingresa tu nombre para enviar la cotización.';customerInputs.name.focus();return}if(phone.replace(/\D/g,'').length<8){error.textContent='Ingresa un teléfono válido.';customerInputs.phone.focus();return}error.textContent='';try{localStorage.setItem('lacustre-customer',JSON.stringify({name,phone}))}catch{}const location=document.querySelector('#location-select').value;const lines=items.map(p=>`• ${p.name} — Cantidad: ${cart[p.id]}`);const message=[`Hola Ferretería Lacustre, quisiera cotizar:`,`Nombre: ${name}`,`Teléfono: ${phone}`,location?`Localidad preferida: ${location}`:'Localidad: por confirmar','',...lines,'','¿Me pueden confirmar precios y disponibilidad?'].join('\n');window.open(`https://wa.me/56972912278?text=${encodeURIComponent(message)}`,'_blank','noopener');});
async function loadSite(){
  const cartIds=Object.keys(cart).filter(id=>/^\d+$/.test(id));
  const fetchProducts=async url=>{
    const response=await fetch(url);
    if(!response.ok)throw Error('Catálogo no disponible');
    return (await response.json()).products.map(product=>({...product,id:String(product.id)}));
  };
  const [featured,saved]=await Promise.allSettled([
    fetchProducts('api/catalog.php?featured=1'),
    cartIds.length?fetchProducts(`api/catalog.php?ids=${cartIds.join(',')}`):Promise.resolve([])
  ]);
  products=featured.status==='fulfilled'?featured.value:[];
  cartProducts=[...new Map([...products,...(saved.status==='fulfilled'?saved.value:[])].map(p=>[p.id,p])).values()];
  renderProducts();
  renderCart();
  updateCount();
  if(saved.status==='rejected'&&cartIds.length){
    const box=document.querySelector('#quote-empty');
    box.hidden=false;
    box.querySelector('strong').textContent='No pudimos recuperar toda tu cotización.';
    box.querySelector('p').textContent='Tu lista sigue guardada. Recarga para reintentar o consulta por WhatsApp.';
    document.querySelector('.quote-footer').hidden=true;
  }
  if(featured.status==='rejected'){
    count.textContent='Catálogo temporalmente no disponible';
    empty.hidden=false;
    empty.querySelector('strong').textContent='No pudimos cargar el catálogo.';
    empty.querySelector('p').textContent='Puedes consultarnos directamente por WhatsApp.';
  }
}
async function openQuickEdit(id){
  const [productResponse,categoriesResponse]=await Promise.all([fetch(`api/admin-product.php?id=${id}`),fetch('api/categories.php')]);
  const {product}=await productResponse.json(),{categories}=await categoriesResponse.json();
  const modal=document.createElement('div');modal.className='quick-modal';modal.innerHTML=`<form><button type="button" class="quick-close" aria-label="Cerrar">×</button><p class="kicker">Edición rápida</p><h2>Editar producto</h2><label>Nombre<input name="name" required value="${html(product.name)}"></label><label>Categoría<select name="category_id"><option value="">Sin categoría</option>${categories.map(c=>`<option value="${c.id}" ${c.id==product.category_id?'selected':''}>${html(c.name)}</option>`).join('')}</select></label><label>Descripción corta<textarea name="short_description">${html(product.short_description)}</textarea></label><label>Descripción larga<textarea name="long_description">${html(product.long_description)}</textarea></label><div class="quick-two"><label>Precio<input name="price" type="number" min="0" value="${product.price??''}"></label><label>Stock<input name="stock" type="number" min="0" value="${product.stock??''}"></label></div><label class="quick-check"><input name="is_published" type="checkbox" ${product.is_published==1?'checked':''}> Producto publicado</label><button class="btn btn-primary">Guardar cambios</button><a href="admin/index.php?section=products">Gestionar fotos y ficha completa →</a></form>`;document.body.appendChild(modal);modal.querySelector('.quick-close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};modal.querySelector('form').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));d.id=id;d.mode='quick';d.is_published=e.target.is_published.checked?1:0;const r=await fetch('api/admin-product.php',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':adminSession.csrf},body:JSON.stringify(d)});const result=await r.json();if(!r.ok){alert(result.error);return}modal.remove();await loadSite();};
}
document.querySelector('#year').textContent=new Date().getFullYear();
window.refreshCatalog=loadSite;
loadSite();
