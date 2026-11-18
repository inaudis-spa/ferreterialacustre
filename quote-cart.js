import {quoteDrawer} from './quote-drawer.js';
import {html} from './catalog-ui.js';
(()=>{
  if(document.querySelector('[data-global-quote-cart]'))return;
  let cart={},products=[];
  try{cart=JSON.parse(localStorage.getItem('lacustre-quote'))||{}}catch{}
  const asset=path=>path.split('/').map(encodeURIComponent).join('/');
  const shell=document.createElement('div');shell.dataset.globalQuoteCart='';
  shell.innerHTML=`<button class="global-cart-trigger" type="button">Mi cotización <b>0</b></button><div class="drawer-backdrop global-cart-backdrop" hidden></div><aside id="global-quote-panel" class="quote-panel global-cart-panel" role="dialog" aria-modal="true" aria-label="Solicitar cotización" aria-hidden="true" inert><div class="quote-head"><div><p class="kicker">Tu lista</p><h2>Solicitar cotización</h2></div><button class="global-cart-close" type="button" aria-label="Cerrar cotización">×</button></div><p class="quote-intro">Completa tus datos y revisa las cantidades.</p><div class="quote-items global-cart-items"></div><div class="quote-empty global-cart-empty"><span>+</span><strong role="status">Tu lista está vacía</strong></div><div class="quote-footer global-cart-footer"><div class="customer-fields"><label>Nombre<input class="global-customer-name" autocomplete="name" placeholder="Tu nombre"></label><label>Teléfono<input class="global-customer-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+56 9…"></label></div><label>Localidad<select class="global-cart-location"><option value="">Seleccionar</option><option>Villarrica</option><option>Labranza</option><option>Cunco</option></select></label><p class="customer-error" role="alert"></p><button class="btn btn-primary global-cart-send">Cotizar por WhatsApp ↗</button><small>No reserva stock ni genera una compra.</small></div></aside>`;
  document.body.appendChild(shell);
  const trigger=shell.querySelector('.global-cart-trigger'),panel=shell.querySelector('.global-cart-panel'),backdrop=shell.querySelector('.global-cart-backdrop'),nameInput=shell.querySelector('.global-customer-name'),phoneInput=shell.querySelector('.global-customer-phone');
  try{const customer=JSON.parse(localStorage.getItem('lacustre-customer'))||{};nameInput.value=customer.name||'';phoneInput.value=customer.phone||''}catch{}
  function save(){try{localStorage.setItem('lacustre-quote',JSON.stringify(cart))}catch{}load()}
  let requestVersion=0;
  async function load(){
    const version=++requestVersion;
    const ids=Object.keys(cart).filter(id=>/^\d+$/.test(id)&&cart[id]>0);
    trigger.querySelector('b').textContent=Object.values(cart).reduce((a,b)=>a+b,0);
    if(!ids.length){products=[];render();return}
    try{
      const response=await fetch(`api/catalog.php?ids=${ids.join(',')}`);
      if(!response.ok)throw Error('Catálogo no disponible');
      const data=await response.json();
      if(version!==requestVersion)return;
      products=data.products.map(p=>({...p,id:String(p.id)}));
      render();
    }catch{
      if(version!==requestVersion)return;
      products=[];
      render('No pudimos cargar tu lista. Sigue guardada. Recarga para reintentar.');
    }
  }
  function render(message){const items=products.filter(p=>cart[p.id]);shell.querySelector('.global-cart-empty strong').textContent=message||(Object.keys(cart).length?'Los productos de tu lista ya no están disponibles.':'Tu lista está vacía');shell.querySelector('.global-cart-empty').hidden=!!items.length;shell.querySelector('.global-cart-footer').hidden=!items.length;shell.querySelector('.global-cart-items').innerHTML=items.map(p=>`<div class="quote-item">${p.image?`<img src="${asset(p.image)}" alt="">`: ''}<div><strong>${html(p.name)}</strong><div class="qty"><button data-action="minus" data-id="${html(p.id)}">−</button><span>${cart[p.id]}</span><button data-action="plus" data-id="${html(p.id)}">+</button></div></div><button class="remove-item" data-action="remove" data-id="${html(p.id)}">Quitar</button></div>`).join('')}
  const open=quoteDrawer({panel,backdrop,closeButton:shell.querySelector('.global-cart-close'),triggers:[trigger]});
  shell.querySelector('.global-cart-items').onclick=event=>{const button=event.target.closest('[data-action]');if(!button)return;if(button.dataset.action==='plus')cart[button.dataset.id]++;if(button.dataset.action==='minus')cart[button.dataset.id]--;if(button.dataset.action==='remove'||cart[button.dataset.id]<=0)delete cart[button.dataset.id];save()};
  shell.querySelector('.global-cart-send').onclick=()=>{const items=products.filter(p=>cart[p.id]),name=nameInput.value.trim(),phone=phoneInput.value.trim(),error=shell.querySelector('.customer-error');if(!items.length)return;if(name.length<2){error.textContent='Ingresa tu nombre para enviar la cotización.';nameInput.focus();return}if(phone.replace(/\D/g,'').length<8){error.textContent='Ingresa un teléfono válido.';phoneInput.focus();return}error.textContent='';try{localStorage.setItem('lacustre-customer',JSON.stringify({name,phone}))}catch{}const location=shell.querySelector('.global-cart-location').value;const message=['Hola Ferretería Lacustre, quisiera cotizar:',`Nombre: ${name}`,`Teléfono: ${phone}`,location?`Localidad preferida: ${location}`:'Localidad: por confirmar','',...items.map(p=>`• ${p.name} — Cantidad: ${cart[p.id]}`),'','¿Me pueden confirmar precios y disponibilidad?'].join('\n');window.open(`https://wa.me/56972912278?text=${encodeURIComponent(message)}`,'_blank','noopener')};
  window.addEventListener('lacustre:add-cart',event=>{const id=String(event.detail.id),quantity=Math.max(1,Number(event.detail.quantity)||1);cart[id]=(cart[id]||0)+quantity;save();open()});load();
})();
