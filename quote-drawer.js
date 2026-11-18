export function quoteDrawer({panel,backdrop,closeButton,triggers}){
  let previousFocus=null;
  function open(){
    if(panel.classList.contains('open'))return;
    previousFocus=document.activeElement;
    panel.inert=false;
    panel.setAttribute('aria-hidden','false');
    panel.classList.add('open');
    backdrop.hidden=false;
    document.body.classList.add('drawer-open');
    for(const button of triggers)button.setAttribute('aria-expanded','true');
    closeButton.focus();
  }
  function close(){
    if(!panel.classList.contains('open'))return;
    for(const button of triggers)button.setAttribute('aria-expanded','false');
    const fallback=triggers[0];
    const target=previousFocus?.isConnected&&previousFocus!==document.body?previousFocus:fallback;
    target?.focus();
    panel.inert=true;
    panel.setAttribute('aria-hidden','true');
    panel.classList.remove('open');
    backdrop.hidden=true;
    document.body.classList.remove('drawer-open');
  }
  panel.inert=true;
  for(const button of triggers){
    button.setAttribute('aria-controls',panel.id);
    button.setAttribute('aria-expanded','false');
    button.addEventListener('click',open);
  }
  closeButton.addEventListener('click',close);
  backdrop.addEventListener('click',close);
  document.addEventListener('keydown',event=>{
    if(!panel.classList.contains('open'))return;
    if(event.key==='Escape'){event.preventDefault();close()}
    if(event.key!=='Tab')return;
    const controls=[...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled])')]
      .filter(control=>control.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  });
  return open;
}
