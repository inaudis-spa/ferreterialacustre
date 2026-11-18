(()=>{
  const videoSource=(video,path)=>{if(!video||!path)return;let source=video.querySelector('source');if(!source){source=document.createElement('source');video.appendChild(source)}source.dataset.src=path;if(video.hidden||video.closest('#site-intro')?.hidden||source.getAttribute('src')===path)return;source.src=path;video.load();if(video.autoplay)video.play().catch(()=>{})};
  function applySlot(slot){
    if(!slot)return;
    if(slot.slot_key==='brand_logo')document.querySelectorAll('.brand img,.footer-brand img,.intro-fallback img').forEach(img=>img.src=slot.path);
    if(slot.slot_key==='intro_video')videoSource(document.querySelector('#intro-video'),slot.path);
    if(slot.slot_key==='hero_video')videoSource(document.querySelector('.hero-media video'),slot.path);
    if(slot.slot_key==='hero_poster'){const image=document.querySelector('.hero-media img');if(image&&slot.path)image.src=slot.path}
    if(slot.slot_key==='catalog_video')videoSource(document.querySelector('.catalog-intro-video'),slot.path);
    if(slot.slot_key==='offers_cover'){const hero=document.querySelector('.offers-hero');if(hero){hero.style.backgroundImage=`linear-gradient(90deg,rgba(8,8,8,.92),rgba(8,8,8,.28)),url("${String(slot.path).replace(/"/g,'\\"')}")`;hero.style.backgroundPosition=`${slot.focal_x||50}% ${slot.focal_y||50}%`}}
  }
  async function reload(){try{const response=await fetch('api/site-media.php',{credentials:'same-origin'});if(!response.ok)return[];const data=await response.json();(data.slots||[]).forEach(applySlot);window.dispatchEvent(new CustomEvent('lacustre:site-media',{detail:data.slots||[]}));return data.slots||[]}catch{return []}}
  window.LacustreSiteMedia={reload,applySlot};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reload,{once:true});else reload();
})();
