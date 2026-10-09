// Suggested extras use the existing inquiry flow until a live cart is connected.
// Keep this independent of catalog fetch so local-file previews work too.
(() => {
 const suggestions = [
  {name:'Sound system',slug:'sound-system',image:'assets/catalog/sound-system.webp',price:35,description:'For music, announcements, and toasts.'},
  {name:'String Lighting',slug:'string-lighting',image:'assets/catalog/string-lighting.webp',price:12,description:'Add a little glow to your gathering.'},
  {name:'Flameless Candles',slug:'flameless-candles',image:'assets/catalog/flameless-candles.webp',price:1.5,description:'A finishing touch for your tables.'},
  {name:'White Plastic Folding Chair',slug:'white-plastic-folding-chair',image:'assets/catalog/white-plastic-folding-chair.webp',price:1.45,description:'Extra seating to match your Standard package.'},
  {name:'Brown Resin Folding Chair',slug:'brown-resin-folding-chair',image:'assets/catalog/brown-resin-folding-chair.webp',price:2.45,description:'Extra seating for Deluxe or Farmhouse gatherings.'},
  {name:'6 Foot Rectangle Table',slug:'6-foot-rectangle',image:'assets/catalog/6-foot-rectangle.png',price:8,description:'Extra space for gifts, food, or serving. Linen rented separately.'},
  {name:'5 Foot Round Table',slug:'5-foot-round-table',image:'assets/catalog/5-foot-round-table.webp',price:9,description:'Seats eight. Chairs and linen rented separately.'},
  {name:'6 Foot Round Table',slug:'6-foot-round-table',image:'assets/catalog/6-foot-round-table.webp',price:15,description:'Seats ten. Chairs and linen rented separately.'},
  {name:'Cocktail Table',slug:'cocktail-table-high-boy-foldable',image:'assets/catalog/cocktail-table-high-boy-foldable.webp',price:8,description:'A standing-height spot for drinks and conversation. Linen rented separately.'},
  {name:'Corn Hole',slug:'corn-hole',image:'assets/catalog/corn-hole.webp',price:25,description:'Add a lawn game to your celebration.'}
 ];
 const drafts=new Map();
 let selectedPackage,selectedStyle,quantities,bookingUrl;
 const dialog=document.createElement('dialog');
 dialog.id='extras-dialog';dialog.setAttribute('aria-labelledby','extras-title');
 dialog.innerHTML=`<button class="dialog-close" aria-label="Back to package details">×</button><div class="extras-inner"><div class="eyebrow">A FEW FINISHING TOUCHES</div><h2 id="extras-title" tabindex="-1">Complete your event.</h2><p id="extras-package"></p><p>Pair your package with audio, lighting, or décor. Choose any extras you’d like included in one quote.</p><form id="extras-form"><div class="extras-grid">${suggestions.map((item,i)=>`<article class="extras-card"><img src="${item.image}" alt="${item.name}" width="200" height="160"><h3>${item.name}</h3><p>${item.description}</p><div class="extras-price">${money(item.price)} <span>/ 1 day, per listed rental</span></div><label for="extra-quantity-${i}">Quantity <input id="extra-quantity-${i}" name="quantity-${i}" type="number" min="0" max="999" step="1" value="0" inputmode="numeric"></label></article>`).join('')}</div><p class="extras-summary" id="extras-summary" role="status" aria-live="polite"></p><p class="extras-note">These selections are a quote request. They are not added to the booking-store cart. Firefly will confirm availability, rental units, and final pricing, including delivery, setup, and tax.</p><button class="button button-dark full-width" id="extras-quote" type="submit" disabled>Request package + extras quote →</button></form><a class="extras-skip" id="extras-skip">Skip extras & book package ↗</a><button class="extras-back plain-button" type="button">← Back to package</button></div>`;
 document.body.append(dialog);
 dialog.querySelector('.extras-inner>p:nth-of-type(2)').textContent='Need a few more chairs, another table, or finishing touches? Choose extras to include with your package in one quote.';
 const category=document.createElement('label');category.className='extras-filter';
 category.innerHTML='Browse extras <select aria-label="Extra rental category"><option value="all">All extras</option><option value="chairs">Chairs</option><option value="tables">Tables</option><option value="lighting">Lighting & décor</option><option value="audio">Audio</option><option value="games">Games</option></select>';
 dialog.querySelector('.extras-grid').before(category);
 const categories=['audio','lighting','lighting','chairs','chairs','tables','tables','tables','tables','games'];
 category.querySelector('select').addEventListener('change',event=>{dialog.querySelectorAll('.extras-card').forEach((card,i)=>{card.hidden=event.target.value!=='all'&&categories[i]!==event.target.value;});});
 const fields=[...dialog.querySelectorAll('input')];
 const form=dialog.querySelector('form');
 function update(){
  const valid=fields.every(input=>input.validity.valid);
  quantities=fields.map(input=>input.value===''?0:Number(input.value));
  const count=valid?quantities.reduce((sum,q)=>sum+q,0):0;
  if(valid)drafts.set(selectedPackage.slug,[...quantities]);
  dialog.querySelector('#extras-quote').disabled=!valid||count===0;
  const extraTotal=valid?quantities.reduce((sum,q,i)=>sum+q*suggestions[i].price,0):0;
  dialog.querySelector('#extras-summary').textContent=valid?(count?`${count} extra rental${count===1?'':'s'} selected · Listed package + extras subtotal: ${money(selectedPackage.price+extraTotal)}`:'Extras are optional. Set a quantity to include an item in your quote.'):'Use whole-number quantities from 0 to 999.';
 }
 function returnToPackage(){
  dialog.close();
  document.querySelector('#package-dialog').showModal();syncDialogLock();
  document.querySelector('#package-detail a[href]')?.focus();
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest('#package-detail a[href]');
  if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const match=Object.entries(packages).flatMap(([key,p])=>p.variants.map(v=>({key,p,v}))).find(({v})=>link.href===`${shop}/products/${v.slug}`);
  if(!match)return;
  event.preventDefault();
  selectedPackage=match.v;selectedStyle=match.p;bookingUrl=link.href;
  quantities=drafts.get(selectedPackage.slug)||suggestions.map(()=>0);
  category.querySelector('select').value='all';dialog.querySelectorAll('.extras-card').forEach(card=>{card.hidden=false;});
  fields.forEach((field,i)=>{field.value=quantities[i];});
  dialog.querySelector('#extras-package').textContent=`${selectedPackage.guests}-guest ${selectedStyle.name.replace(/^The /,'')} package · ${money(selectedPackage.price)} / 1 day`;
  dialog.querySelector('#extras-skip').href=bookingUrl;
  update();closeDialog(document.querySelector('#package-dialog'));dialog.showModal();syncDialogLock();
  dialog.querySelector('#extras-title').focus();
 });
 fields.forEach(field=>field.addEventListener('input',update));
 dialog.querySelector('.dialog-close').addEventListener('click',returnToPackage);
 dialog.querySelector('.extras-back').addEventListener('click',returnToPackage);
 dialog.addEventListener('cancel',event=>{event.preventDefault();returnToPackage();});
 dialog.addEventListener('close',syncDialogLock);
 form.addEventListener('submit',event=>{
  event.preventDefault();update();
  if(!form.reportValidity()||!quantities.some(q=>q>0))return;
  openInquiry(`${selectedPackage.guests}-guest ${selectedStyle.name}`);
  const inquiry=document.querySelector('#inquiry-form');
  inquiry.elements.notes.value=[
   `Please quote these rentals together for my event:`,
   `1 × ${selectedPackage.guests}-guest ${selectedStyle.name.replace(/^The /,'')} package`,
   ...suggestions.flatMap((item,i)=>quantities[i]>0?[`${quantities[i]} × ${item.name}`]:[]),
   '', 'Please confirm rental units, availability, and the final total.'
  ].join('\n');
 });
})();
