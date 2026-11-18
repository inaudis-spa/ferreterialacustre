import './site-nav.js';
import './quote-cart.js';

const add=document.querySelector('#product-add');
if(add){
  const quantityControl=document.querySelector('.detail-qty');
  const quantityLabel=document.querySelector('#detail-quantity');
  let quantity=1;
  add.hidden=false;
  quantityControl.hidden=false;
  quantityControl.querySelectorAll('[data-qty]').forEach(button=>{
    button.onclick=()=>{
      quantity=Math.max(1,quantity+(button.dataset.qty==='plus'?1:-1));
      quantityLabel.textContent=quantity;
    };
  });
  add.onclick=()=>window.dispatchEvent(new CustomEvent('lacustre:add-cart',{detail:{id:add.dataset.id,quantity}}));
}
const image=document.querySelector('#main-product-image');
const thumbnails=document.querySelectorAll('[data-image]');
for(const button of thumbnails){
  button.onclick=()=>{
    if(!image)return;
    image.src=button.dataset.image;
    image.alt=button.dataset.alt;
    image.style.objectPosition=`${button.dataset.x}% ${button.dataset.y}%`;
    for(const item of thumbnails){
      item.classList.toggle('active',item===button);
      item.setAttribute('aria-pressed',String(item===button));
    }
  };
}
