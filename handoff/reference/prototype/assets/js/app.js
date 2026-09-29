/* =====================================================================
   TAHDIG — application: router, views, interactions
   Views read from the commerce layer and render with UI components.
   ===================================================================== */
(function(){
const {Catalog,Cart,Recurring,Customer,onChange,normFa}=window.Tahdig;
const U=window.UI,{icon,esc,faNum,amount,price}=U;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const SHOP_PAGE=12;

/* ---------- view state (UI only; commerce state lives in commerce.js) ---------- */
const shopUI={c:'all',q:'',sort:'popular',limit:SHOP_PAGE};
const recipesUI={cat:'همه',q:''};
const pdUI={};          // per product handle: {vid, qty, img}
const bundleUI={};      // per bundle handle: {qty}
const recipeUI={};      // per recipe handle: {serv, off:Set, have:Set, added}
const coUI={step:1,errors:{},window:'morning',payment:'card',order:null};
const recUI={picker:false,q:''};
let current=null;       // {name, args, params}

/* ---------- small helpers ---------- */
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1900)}
function announce(msg){const a=$('#tAnnounce');a.textContent='';setTimeout(()=>a.textContent=msg,30)}
function bumpBadge(){const b=$('#navBadge');if(reduced()||!b.animate)return;b.animate([{transform:'scale(1)'},{transform:'scale(1.3)'},{transform:'scale(1)'}],{duration:280,easing:'cubic-bezier(.23,1,.32,1)'})}
function updateBadge(){const n=Cart.count(),b=$('#navBadge');b.style.display=n?'flex':'none';b.textContent=faNum(n);$('.t-cart-btn').setAttribute('aria-label',n?`سبد خرید، ${faNum(n)} محصول`:'سبد خرید')}
const collectionTitle=h=>h==='all'?'همه محصولات':(Catalog.collection(h)?.title||'همه محصولات');

/* ---------- router ---------- */
const ROUTES=[
 [/^\/$/,'home'],[/^\/products$/,'shop'],[/^\/product\/([\w-]+)$/,'product'],
 [/^\/recipes$/,'recipes'],[/^\/recipe\/([\w-]+)$/,'recipe'],
 [/^\/bundles$/,'bundles'],[/^\/bundle\/([\w-]+)$/,'bundle'],[/^\/recurring$/,'recurring'],
 [/^\/cart$/,'cart'],[/^\/checkout$/,'checkout'],
 [/^\/account$/,'account'],[/^\/account\/(orders|addresses|favorites)$/,'accountSub'],
 [/^\/page\/([\w-]+)$/,'page']];
function parse(){const h=decodeURIComponent(location.hash.replace(/^#/,''))||'/',[path,qs]=h.split('?');return{path:path||'/',params:new URLSearchParams(qs||'')}}
function saveScroll(){try{history.replaceState({...(history.state||{}),y:scrollY},'')}catch(e){}}
function navigate(href){saveScroll();if(location.hash===href||(href==='#/'&&!location.hash))route();else location.hash=href}
function setQuery(href){try{history.replaceState(history.state,'',href)}catch(e){}}
function route(restoreY){
  const {path,params}=parse();let name='notFound',args=[];
  for(const [re,n] of ROUTES){const m=path.match(re);if(m){name=n;args=m.slice(1);break}}
  if(name!=='checkout'&&coUI.step===5){coUI.step=1;coUI.order=null}
  current={name,args,params};
  const out=VIEWS[name](...args,params)||VIEWS.notFound();
  const screen=out.screen||'view';
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id===screen));
  document.body.dataset.screen=name;document.body.dataset.footer=out.footer||'full';
  document.body.classList.toggle('has-buybar',!!out.buybar);document.body.classList.remove('buybar-on');buybar=null;
  if(screen==='view')$('#view').innerHTML=out.html;
  out.mount?.();
  document.title=(out.title?out.title+' | ':'')+'ته‌دیگ';
  markFooter();closeDrawer(true);
  requestAnimationFrame(()=>{window.scrollTo(0,restoreY??0);checkBuybar()});
  if(out.title)announce(out.title);
}
/* re-render the current view in place, keeping scroll and focused control */
function refresh(){if(!current)return;const key=focusKey(document.activeElement),y=scrollY;const out=VIEWS[current.name](...current.args,current.params);if((out.screen||'view')==='view'){$('#view').innerHTML=out.html;out.mount?.()}window.scrollTo(0,y);restoreFocus(key)}
const KEY_ATTRS=['data-action','data-v','data-d','data-scope','data-k','id'];
function focusKey(el){if(!el||el===document.body||!$('#view').contains(el)&&!$('#shop').contains(el))return null;return KEY_ATTRS.map(a=>el.getAttribute(a)||'').join('|')}
function restoreFocus(key){if(!key)return;const el=$$('#view [data-action],#view input,#view button').find(e=>focusKey(e)===key);(el&&!el.disabled?el:null)?.focus({preventScroll:true})}
window.addEventListener('hashchange',()=>route(history.state?.y));
let scrollT=null;addEventListener('scroll',()=>{clearTimeout(scrollT);scrollT=setTimeout(saveScroll,400)},{passive:true});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&!e.defaultPrevented&&!e.metaKey&&!e.ctrlKey)saveScroll()},true);
if('scrollRestoration' in history)history.scrollRestoration='manual';

/* ---------- live refresh of cart-dependent UI ---------- */
function refreshControls(vid){$$(`[data-qty-for="${CSS.escape(vid)}"]`).forEach(el=>{const e=Catalog.variant(vid);if(!e)return;const had=!!$('.t-stepper',el),f=el.contains(document.activeElement),q=Cart.qty(vid);el.innerHTML=U.addControl(e.product,e.variant,q,!had&&q>0);if(f)($('button:not([disabled])',el))?.focus({preventScroll:true})})}
onChange(topic=>{
  if(topic==='cart'){updateBadge();if(['cart','checkout'].includes(current?.name)&&!(current.name==='checkout'&&coUI.step===5))refresh();if(['product','bundle','recipe'].includes(current?.name))VIEWS[current.name].update?.()}
  if(topic==='recurring'){if(current?.name==='recurring')refresh();if(current?.name==='product')VIEWS.product.update?.()}
  if(topic==='favorites'&&current?.name==='accountSub')refresh();
});

/* =====================================================================
   VIEWS
   ===================================================================== */
const VIEWS={};

/* ---------- Home (static approved markup, data-filled) ---------- */
const QUICK=[['بـرنج ایرانی','برنج'],['مواد قرمه سبزی','قورمه'],['روغـن زیتون','روغن زیتون'],['زعفـــران','زعفران']];
VIEWS.home=()=>({screen:'home',title:'',mount(){
  $('#tQuick').innerHTML=QUICK.map(([l,q])=>`<button type="button" class="t-chip" aria-label="${l.replace(/ـ/g,'')}" data-action="search" data-q="${q}">${l}</button>`).join('');
  $('#tCats').innerHTML=Catalog.collections.map(c=>`<button type="button" class="t-cat" data-action="go" data-href="#/products?c=${c.handle}"><span class="t-cat-disc" aria-hidden="true"><span class="t-ph">${icon('image')}</span></span><span>${esc(c.title)}</span></button>`).join('');
  $('#tPicks').innerHTML=Catalog.products.slice(0,6).map(p=>U.productCard(p,Cart.qty(p.defaultVariant.id))).join('');
}});

/* ---------- Products (collection) ---------- */
VIEWS.shop=(params)=>{
  const c=params.get('c');shopUI.c=c&&Catalog.collection(c)?c:'all';
  shopUI.q=params.get('q')||'';shopUI.sort=['popular','new','cheap','expensive'].includes(params.get('s'))?params.get('s'):'popular';shopUI.limit=SHOP_PAGE;
  return{screen:'shop',title:collectionTitle(shopUI.c),mount:renderShop};
};
function shopHref(){const p=new URLSearchParams();if(shopUI.c!=='all')p.set('c',shopUI.c);if(shopUI.q)p.set('q',shopUI.q);if(shopUI.sort!=='popular')p.set('s',shopUI.sort);return '#/products'+(p.toString()?'?'+p:'')}
function renderShop(){
  const input=$('#shopSearchInput');if(input.value!==shopUI.q)input.value=shopUI.q;
  const title=collectionTitle(shopUI.c),count=h=>Catalog.inCollection(h).length;
  $('#tCrumbCur').textContent=title;$('#tCatTitle').textContent=title;
  $('#tCatDesc').textContent=shopUI.c==='all'?Catalog.allDescription:Catalog.collection(shopUI.c).description;
  $('#shopCats').innerHTML=['all',...Catalog.collections.map(c=>c.handle)].map(h=>`<button type="button" class="t-tab" data-action="shop-cat" data-k="${h}" aria-pressed="${shopUI.c===h}"><span>${esc(collectionTitle(h))}</span><span class="n">${faNum(count(h))}</span></button>`).join('');
  $('#tSort').value=shopUI.sort;
  const list=Catalog.sort(Catalog.search(shopUI.q,Catalog.inCollection(shopUI.c)),shopUI.sort);
  $('#resultCount').textContent=`${faNum(list.length)} محصول`;
  $('#productGrid').innerHTML=list.slice(0,shopUI.limit).map(p=>U.productCard(p,Cart.qty(p.defaultVariant.id))).join('');
  $('#tMore').hidden=list.length<=shopUI.limit;
  $('#shopEmpty').innerHTML=list.length?'':U.empty({ic:'search',title:shopUI.q?`برای «${shopUI.q}» محصولی پیدا نشد`:'محصولی پیدا نشد',text:'نام محصول را کوتاه‌تر بنویس؛ جستجو به فارسی، انگلیسی و فنلاندی کار می‌کند.',action:`<div class="t-suggest" aria-label="جستجوهای پیشنهادی">${['برنج','زعفران','ادویه','Rice','Sahrami'].map(q=>`<button type="button" class="t-tab no-n" data-action="suggest" data-q="${q}">${q}</button>`).join('')}</div><button type="button" class="t-btn is-primary is-sm" data-action="shop-reset">مشاهده همه محصولات</button>`});
}

/* ---------- Product detail ---------- */
VIEWS.product=(handle,params)=>{
  const p=Catalog.product(handle);if(!p)return null;
  const st=pdUI[handle]||(pdUI[handle]={vid:p.defaultVariant.id,qty:1,img:0});
  const vp=params.get('variant');if(vp){const m=p.variants.find(x=>x.id.endsWith('/'+vp));if(m)st.vid=m.id}
  const col=Catalog.collection(p.collection),fav=Customer.isFav(handle);
  const html=`<div class="t-wrap">${U.crumbs([['دسته‌بندی‌ها','#/products'],[col.title,'#/products?c='+col.handle],[p.title]],'is-cream')}
  <div class="t-pd"><div class="t-pd-gallery">
   <div class="t-gallery-main t-ph" role="img" id="pdMain" aria-label="تصویر ${faNum(st.img+1)} از ۴: ${esc(p.title)}">${icon('image')}<div class="t-gallery-tools">
    <button type="button" data-action="fav" data-k="${p.handle}" aria-pressed="${fav}" aria-label="${fav?'حذف از علاقه‌مندی‌ها':'افزودن به علاقه‌مندی‌ها'}">${icon('heart')}</button>
    <button type="button" data-action="toast" data-msg="بزرگ‌نمایی تصویر با عکس‌های نهایی محصول فعال می‌شود" aria-label="بزرگ‌نمایی تصویر">${icon('zoom')}</button></div></div>
   <div class="t-thumbs" role="group" aria-label="تصاویر محصول">${[0,1,2,3].map(i=>`<button type="button" class="t-thumb" data-action="thumb" data-k="${i}" aria-label="تصویر ${faNum(i+1)}" aria-current="${st.img===i}">${icon('image')}</button>`).join('')}</div>
  </div><div class="t-pd-info" id="pdBuy">${pdBuy(p,st)}</div></div></div>
  <section class="t-sec" aria-labelledby="pdRelT"><h2 class="t-title" id="pdRelT">${p.available?'همراه این محصول':'محصولات مشابه'}</h2><div class="t-rail">${Catalog.related(p,4).map(x=>U.productCard(x,Cart.qty(x.defaultVariant.id))).join('')}</div></section>
  <div class="t-buybar" id="pdBar" aria-hidden="true" inert>${pdBar(p,st)}</div>`;
  return{title:p.title,html,buybar:true,mount(){watchBuybar('#pdCta','#pdBar');if(params.get('notify'))setTimeout(()=>$('#notifyEmail')?.focus({preventScroll:false}),120)}};
};
function pdBuy(p,st){
  const v=p.variants.find(x=>x.id===st.vid),inCart=Cart.qty(v.id),inRec=Recurring.qty(v.id);
  const acc=[U.accItem({ic:'spec',title:'مشخصات محصول',open:true,body:U.specList([['برند',p.vendor],...p.specs])}),
    U.accItem({ic:'list',title:'ترکیبات و اطلاعات تغذیه‌ای',body:'<p>اطلاعات ترکیبات و ارزش غذایی این محصول به‌زودی در این بخش نمایش داده می‌شود.</p>'}),
    p.storage&&U.accItem({ic:'box',title:'شرایط نگهداری',body:`<p>${esc(p.storage)}</p>`}),
    p.cooking&&U.accItem({ic:'pot',title:'روش پخت',body:`<p>${esc(p.cooking)}</p>`}),
    U.accItem({ic:'truck',title:'روش ارسال',body:`<p>${esc(Catalog.shop.shippingText)}</p>`})].filter(Boolean).join('');
  const notified=Customer.notifyEmail(v.id);
  const notify=notified?`<p class="t-note is-ok">${icon('check')}<span>وقتی «${esc(p.title)}» دوباره موجود شد، به <b dir="ltr">${esc(notified)}</b> خبر می‌دهیم.</span></p>`
    :`<form class="t-notify" data-form="notify" data-v="${esc(v.id)}" novalidate><p><b>فعلاً ناموجود است.</b> ایمیلت را بگذار تا به محض موجود شدن خبرت کنیم.</p><div class="t-inline-form"><input id="notifyEmail" type="email" inputmode="email" autocomplete="email" enterkeyhint="send" placeholder="ایمیل شما" aria-label="ایمیل برای اطلاع از موجود شدن" aria-describedby="notifyErr"><button class="t-btn is-primary">${icon('bell')}خبرم کن</button></div><p class="t-err" id="notifyErr" role="alert"></p></form>`;
  return `<h1>${esc(p.title)}</h1>${p.latinTitle?`<p class="t-latin" lang="en" dir="ltr">${esc(p.latinTitle)}</p>`:''}
  <div class="t-pd-meta"><span><span class="k">کد محصول:</span> <span class="sku">${esc(v.sku)}</span></span><span class="t-stock${v.available?'':' is-out'}">${v.available?esc(p.stockNote||'موجود'):'ناموجود'}</span></div>
  ${p.tags.length?`<p class="t-pd-tags">${p.tags.map(esc).join('، ')}</p>`:''}
  <div class="t-pd-desc">${esc(p.description||'توضیحات کامل این محصول به‌زودی اضافه می‌شود.')}</div>
  ${p.variants.length>1?`<div class="t-pd-opt"><h2 id="pdOptT">انتخاب ${esc(p.optionName)}</h2><div class="t-choices" role="radiogroup" aria-labelledby="pdOptT">${p.variants.map(x=>`<button type="button" class="t-choice" role="radio" data-action="variant" data-v="${esc(x.id)}" aria-checked="${x.id===v.id}"${x.available?'':' data-unavailable'}>${esc(x.title)}</button>`).join('')}</div></div>`:''}
  <div class="t-pd-buy"><div class="t-pd-price">${U.unitPrice(v,'t-pd-unit')}${price(v)}</div>${v.available?U.stepper({scope:'pd',vid:v.id,qty:st.qty,name:p.title,min:1,tone:'on-beige'}):''}</div>
  <div class="t-pd-cta" id="pdCta">${v.available?`<button type="button" class="t-btn is-primary is-block" data-action="pd-add" data-v="${esc(v.id)}">${icon('cart')}<span>افزودن به سبد</span><span class="sep" aria-hidden="true">—</span><span>${amount(v.price*st.qty)} €</span></button>`:notify}</div>
  ${v.available?`<ul class="t-assure" aria-label="اطمینان خرید"><li>${icon('lock')}پرداخت امن</li><li>${icon('truck')}ارسال قابل پیگیری</li><li>${icon('help')}پشتیبانی به زبان خودت</li></ul>`:''}
  ${inCart?`<p class="t-note is-ok" style="margin-top:12px">${icon('check')}<span>${faNum(inCart)} عدد از این محصول در سبد توست · <a href="#/cart" style="font-weight:700;text-decoration:underline;text-underline-offset:4px">مشاهده سبد</a></span></p>`:''}
  ${p.recurringEligible&&v.available?`<div class="t-pd-recur">${inRec?`<a class="t-link" href="#/recurring">${icon('repeat')}در فهرست خرید دوره‌ای توست (${faNum(inRec)} عدد)</a>`:`<button type="button" class="t-link" data-action="rec-add" data-v="${esc(v.id)}">${icon('repeat')}افزودن به خرید دوره‌ای</button>`}</div>`:''}
  <div class="t-acc">${acc}</div>`;
}
const pdBar=(p,st)=>{const v=p.variants.find(x=>x.id===st.vid);return v.available?`<div>${price(v,{qty:st.qty,noCompare:true})}</div><button type="button" class="t-btn is-primary" data-action="pd-add" data-v="${esc(v.id)}" tabindex="-1">${icon('cart')}افزودن به سبد</button>`:`<span class="name">${esc(p.title)}</span><button type="button" class="t-btn is-ghost" data-action="notify" tabindex="-1">${icon('bell')}خبرم کن</button>`};
VIEWS.product.update=()=>{const p=Catalog.product(current.args[0]),st=pdUI[p.handle],key=focusKey(document.activeElement);$('#pdBuy').innerHTML=pdBuy(p,st);$('#pdBar').innerHTML=pdBar(p,st);$$('#view .t-rail [data-qty-for]').forEach(el=>refreshControls(el.dataset.qtyFor));restoreFocus(key);watchBuybar('#pdCta','#pdBar')};
/* Sticky buy bar: shown once the main CTA has scrolled above the viewport */
let buybar=null;
function watchBuybar(ctaSel,barSel){buybar={cta:ctaSel,bar:barSel};checkBuybar()}
function checkBuybar(){if(!buybar)return;const cta=$(buybar.cta),bar=$(buybar.bar);if(!cta||!bar){buybar=null;return}
  const on=cta.getBoundingClientRect().bottom<0;if(bar.classList.contains('show')===on)return;
  bar.classList.toggle('show',on);bar.toggleAttribute('inert',!on);bar.setAttribute('aria-hidden',String(!on));document.body.classList.toggle('buybar-on',on&&matchMedia('(max-width:1023px)').matches)}
let bbRaf=0;addEventListener('scroll',()=>{if(!bbRaf)bbRaf=requestAnimationFrame(()=>{bbRaf=0;checkBuybar()})},{passive:true});addEventListener('resize',checkBuybar);

/* ---------- Recipes ---------- */
const RECIPE_CATS=['همه','برنجی','خورشت‌ها'];
VIEWS.recipes=()=>{
  const html=`<div class="t-wrap">${U.crumbs([['غذاها و دستورپخت‌ها']])}
   <form class="t-search" role="search" data-form="recipe-search"><input id="recipeQ" type="search" enterkeyhint="search" autocomplete="off" aria-label="جستجوی غذا" placeholder="مثلاً قورمه‌سبزی، زرشک‌پلو..." value="${esc(recipesUI.q)}"><button type="button" class="t-search-ic" data-action="soon" data-msg="جستجو با تصویر به‌زودی فعال می‌شود" aria-label="جستجو با تصویر (به‌زودی)">${icon('camera')}</button><button type="button" class="t-search-ic" data-action="soon" data-msg="جستجوی صوتی به‌زودی فعال می‌شود" aria-label="جستجوی صوتی (به‌زودی)">${icon('mic')}</button><button class="t-search-go" aria-label="جستجو">${icon('search')}</button></form></div>
   <section class="t-cat-head" aria-labelledby="rcT"><div class="t-wrap"><h1 id="rcT">غذاها و دستورپخت‌ها</h1><p>غذایتان را انتخاب کنید؛ مواد لازم را یکجا بخرید و با دستور پخت ته‌دیگ آماده کنید</p></div><div class="t-tabs" role="group" aria-label="نوع غذا">${RECIPE_CATS.map(c=>`<button type="button" class="t-tab" data-action="recipe-cat" data-k="${c}" aria-pressed="${recipesUI.cat===c}"><span>${c==='همه'?'همه غذاها':c}</span><span class="n">${faNum(c==='همه'?Catalog.recipes.length:Catalog.recipes.filter(r=>r.category===c).length)}</span></button>`).join('')}</div></section>
   <div class="t-wrap t-page-end"><h2 class="t-title" style="margin-top:40px">چه غذایی می‌خواهی درست کنی؟</h2><div id="recipeGrid">${recipeGrid()}</div></div>`;
  return{title:'غذاها و دستورپخت‌ها',html};
};
function recipeGrid(){const q=normFa(recipesUI.q);const list=Catalog.recipes.filter(r=>(recipesUI.cat==='همه'||r.category===recipesUI.cat)&&(!q||normFa(r.title).includes(q)||r.ingredients.some(i=>normFa(i.product.title).includes(q))));
  return list.length?`<div class="t-recipes">${list.map(r=>U.recipeCard(r)).join('')}</div>`:U.empty({ic:'bowl',title:'دستورپختی پیدا نشد',text:'نام غذا را کوتاه‌تر بنویس یا همه غذاها را ببین.',action:`<button type="button" class="t-btn is-primary is-sm" data-action="recipe-reset">مشاهده همه غذاها</button>`})}

/* ---------- Recipe detail ---------- */
VIEWS.recipe=(handle)=>{
  const r=Catalog.recipe(handle);if(!r)return null;
  const html=`<div class="t-wrap t-page-end">${U.crumbs([['غذاها و دستورپخت‌ها','#/recipes'],[r.title]])}
  <div class="t-rd"><div class="t-rd-hero t-ph" role="img" aria-label="تصویر ${esc(r.title)}">${icon('bowl')}</div>
   <header class="t-rd-head"><h1>${esc(r.title)}</h1>${U.recipeMeta(r)}</header>
   <div class="t-rd-shop" id="rdShop">${recipeShop(r)}</div>
   <section class="t-rd-sec t-rd-method" aria-labelledby="rdMT"><h2 id="rdMT">طرز تهیه</h2><ol class="t-method">${r.steps.map(s=>`<li><p>${esc(s)}</p></li>`).join('')}</ol></section>
  </div></div>`;
  return{title:r.title,html};
};
function recipeState(r){return recipeUI[r.handle]||(recipeUI[r.handle]={serv:r.servings,off:new Set(),have:new Set()})}
function recipeShop(r){
  const st=recipeState(r);let n=0,packs=0,total=0;st.have=st.have||new Set();
  const rows=r.ingredients.map(ing=>{const p=ing.product,v=p.defaultVariant,{need,packs:k}=Catalog.packsFor(ing,st.serv,r.servings),on=v.available&&!st.off.has(p.handle);
    if(on&&k){n++;packs+=k;total+=v.price*k}
    return `<div class="t-ing-row${v.available?'':' is-oos'}${on?'':' is-off'}"><button type="button" class="t-check" role="checkbox" data-action="ing" data-k="${p.handle}" aria-checked="${on}" aria-label="خرید ${esc(p.title)}"${v.available?'':' disabled'}>${icon('check')}</button>${U.ph('thumb')}<div><div class="name"><a href="#/product/${p.handle}">${esc(p.title)}</a></div><div class="need">نیاز: ${faNum(need)} ${ing.unit==='g'?'گرم':esc(ing.unit)} · ${k===null?'بسته قابل محاسبه نیست':`${faNum(k)} بسته ${esc(v.title)}`}</div></div><div class="amt">${v.available?`${amount(v.price*(k||0))} €`:'ناموجود'}</div></div>`}).join('');
  const oos=r.ingredients.filter(i=>!i.product.available).length;
  return `<section class="t-rd-sec" aria-labelledby="rdST"><h2 id="rdST">برای چند نفر می‌پزی؟</h2><div class="t-choices" role="radiogroup" aria-labelledby="rdST">${[2,4,6,8].map(s=>`<button type="button" class="t-choice" role="radio" data-action="serv" data-k="${s}" aria-checked="${st.serv===s}">${faNum(s)} نفر</button>`).join('')}</div></section>
  <section class="t-rd-sec" aria-labelledby="rdIT"><h2 id="rdIT">مواد قابل خرید از ته‌دیگ</h2><p class="t-sub">تعداد بسته‌ها بر اساس تعداد نفرات حساب شده است. هر مورد را که نمی‌خواهی بردار.</p>
   <div class="t-ing">${rows}</div>${oos?`<p class="t-note is-warn" style="margin-top:12px">${icon('info')}<span>${faNum(oos)} ماده فعلاً ناموجود است و به سبد اضافه نمی‌شود.</span></p>`:''}
   <div class="t-ing-sum"><div class="line"><span>${faNum(n)} محصول · ${faNum(packs)} بسته</span><b>${amount(total)} €</b></div><button type="button" class="t-btn is-primary is-block" data-action="recipe-add" data-k="${r.handle}"${n?'':' aria-disabled="true"'}>${icon('cart')}افزودن مواد به سبد</button></div></section>
  ${st.added?`<p class="t-note is-ok" style="margin-top:12px">${icon('check')}<span>${faNum(st.added)} محصول به سبد اضافه شد · <a href="#/cart" style="font-weight:700;text-decoration:underline;text-underline-offset:4px">مشاهده سبد</a></span></p>`:''}</section>
  <section class="t-rd-sec" aria-labelledby="rdHT"><h2 id="rdHT">مواد دیگر این غذا</h2><p class="t-sub">این مواد را ته‌دیگ نمی‌فروشد و باید جداگانه تهیه شود؛ آنچه در خانه داری را علامت بزن.</p><div class="t-have">${r.pantry.map(x=>{const has=st.have.has(x.name),sold=x.product?.available;return `<div class="t-have-row"><span>${esc(x.name)}${sold?'<small>در ته‌دیگ موجود است</small>':''}</span>${sold&&!has?`<button type="button" class="t-btn is-ghost is-sm" data-action="pantry-buy" data-k="${x.product.handle}">${icon('plus')}خرید</button>`:''}<button type="button" class="t-choice" role="checkbox" data-action="have" data-k="${esc(x.name)}" aria-checked="${has}" aria-label="${esc(x.name)} را دارم">${has?icon('check'):''}دارم</button></div>`}).join('')}</div></section>`;
}
VIEWS.recipe.update=()=>{};

/* ---------- Bundles (fixed, curated) ---------- */
VIEWS.bundles=()=>({title:'پکیج‌های آماده',html:`<div class="t-wrap t-page-end">${U.crumbs([['پکیج‌های آماده']])}
  <header class="t-page-head"><h1>پکیج‌های آماده</h1><p>مجموعه‌های آماده برای خرید سریع‌تر و انتخاب راحت‌تر. محتوای هر پکیج از پیش انتخاب شده و با یک قیمت خریده می‌شود.</p></header>
  <div class="t-concept">${icon('repeat')}<div><b>می‌خواهی محصولات همیشگی‌ات خودکار برسد؟</b><p>برای فهرست شخصی و قابل‌ویرایش، از <a href="#/recurring">خرید دوره‌ای</a> استفاده کن.</p></div></div>
  <div class="t-bundles">${Catalog.bundles.map(U.bundleCard).join('')}</div></div>`});

VIEWS.bundle=(handle)=>{
  const b=Catalog.bundle(handle);if(!b)return null;bundleUI[handle]=bundleUI[handle]||{qty:1};
  const html=`<div class="t-wrap t-page-end">${U.crumbs([['پکیج‌های آماده','#/bundles'],[b.title]],'is-cream')}
  <div class="t-pd"><div class="t-pd-gallery"><div class="t-gallery-main t-ph" role="img" aria-label="تصویر ${esc(b.title)}">${icon('gift')}</div></div>
  <div class="t-pd-info" id="bdBuy">${bundleBuy(b)}</div></div></div>
  <div class="t-buybar" id="bdBar" aria-hidden="true" inert>${bundleBar(b)}</div>`;
  return{title:b.title,html,buybar:true,mount(){watchBuybar('#bdCta','#bdBar')}};
};
function bundleBuy(b){
  const st=bundleUI[b.handle],v=b.variant,inCart=Cart.qty(v.id),oos=b.components.filter(c=>!c.product.available);
  return `<h1>${esc(b.title)}</h1><p class="t-pd-tags">${esc(b.description)}</p>
  ${b.saving?`<p style="margin-top:12px"><span class="t-badge is-gold">${faNum(Math.round(b.saving/b.separatePrice*100))}٪ صرفه‌جویی نسبت به خرید جداگانه</span></p>`:''}
  <h2 class="t-h3" style="margin-top:24px">شامل این محصولات</h2>
  <div class="t-panel t-bitems">${b.components.map(c=>`<div class="t-bitem">${U.ph('thumb')}<div><a class="name" href="#/product/${c.product.handle}">${esc(c.product.title)}</a><small>${esc(c.product.defaultVariant.title)}${c.product.available?'':' · ناموجود'}</small></div><span class="x">${faNum(c.qty)} عدد</span></div>`).join('')}</div>
  <div class="t-econ t-sumrows"><div class="t-sumrow"><span>قیمت جداگانه</span><b><s style="font-weight:500;color:var(--t-slate)">${amount(b.separatePrice)} €</s></b></div><div class="t-sumrow"><span>قیمت پکیج</span><b>${amount(v.price)} €</b></div>${b.saving?`<div class="t-sumrow"><span>صرفه‌جویی تو</span><b style="color:var(--t-ok)">${amount(b.saving)} €</b></div>`:''}</div>
  ${oos.length?`<p class="t-note is-warn" style="margin-top:16px">${icon('info')}<span>«${esc(oos[0].product.title)}» فعلاً ناموجود است؛ این پکیج پس از تأمین دوباره قابل خرید می‌شود.</span></p>`:''}
  <div class="t-pd-buy"><div class="t-pd-price">${price(v)}</div>${v.available?U.stepper({scope:'bundle',vid:v.id,qty:st.qty,name:b.title,min:1,tone:'on-beige'}):''}</div>
  <div class="t-pd-cta" id="bdCta">${v.available?`<button type="button" class="t-btn is-primary is-block" data-action="bundle-add" data-k="${b.handle}">${icon('cart')}<span>افزودن پکیج به سبد</span><span class="sep" aria-hidden="true">—</span><span>${amount(v.price*st.qty)} €</span></button>`:`<button type="button" class="t-btn is-ghost is-block" data-action="notify">${icon('bell')}وقتی موجود شد خبرم کن</button>`}</div>
  ${inCart?`<p class="t-note is-ok" style="margin-top:12px">${icon('check')}<span>${faNum(inCart)} پکیج در سبد توست · <a href="#/cart" style="font-weight:700;text-decoration:underline;text-underline-offset:4px">مشاهده سبد</a></span></p>`:''}`;
}
const bundleBar=b=>b.variant.available?`<div>${price(b.variant,{qty:bundleUI[b.handle].qty,noCompare:true})}</div><button type="button" class="t-btn is-primary" data-action="bundle-add" data-k="${b.handle}" tabindex="-1">${icon('cart')}افزودن پکیج</button>`:`<span class="name">${esc(b.title)}</span>`;
VIEWS.bundle.update=()=>{const b=Catalog.bundle(current.args[0]),key=focusKey(document.activeElement);$('#bdBuy').innerHTML=bundleBuy(b);$('#bdBar').innerHTML=bundleBar(b);restoreFocus(key);watchBuybar('#bdCta','#bdBar')};

/* ---------- Recurring list (خرید دوره‌ای) ---------- */
const REC_STATUS={draft:['هنوز فعال نشده','is-muted'],active:['فعال','is-ok'],paused:['متوقف موقت','is-gold'],cancelled:['لغو شده','is-muted']};
VIEWS.recurring=()=>{
  const s=Recurring.state(),items=Recurring.items(),est=Recurring.estimate(),[label,cls]=REC_STATUS[s.status];
  const rows=items.map(l=>`<div class="t-rec-row">${U.ph('thumb')}<div class="info"><a class="name" href="#/product/${l.product.handle}">${esc(l.product.title)}</a><small>${esc(l.variant.title)}${l.variant.available?'':' · فعلاً ناموجود'}</small></div>${price(l.variant,{qty:l.qty,noCompare:true})}<div class="ctl">${U.stepper({scope:'rec',vid:l.id,qty:l.qty,name:l.product.title,size:'sm'})}<button type="button" class="t-trash" data-action="rec-remove" data-v="${esc(l.id)}" aria-label="حذف ${esc(l.product.title)} از فهرست">${icon('trash')}</button></div></div>`).join('');
  const picker=recUI.picker||!items.length;
  const acts={draft:`<button type="button" class="t-btn is-primary is-block" data-action="rec-activate"${items.length?'':' aria-disabled="true"'}>${icon('repeat')}فعال‌سازی خرید دوره‌ای</button>`,
    active:`<div class="t-rec-acts"><button type="button" class="t-btn is-ghost is-sm" data-action="rec-skip">${s.skipNext?'برگرداندن ارسال بعدی':'رد کردن ارسال بعدی'}</button><button type="button" class="t-btn is-ghost is-sm" data-action="rec-pause">توقف موقت</button></div><button type="button" class="t-btn is-outline is-sm is-block danger" data-action="rec-cancel" style="color:var(--t-danger)">لغو خرید دوره‌ای</button>`,
    paused:`<button type="button" class="t-btn is-primary is-block" data-action="rec-resume">ادامه ارسال‌ها</button><button type="button" class="t-btn is-outline is-sm is-block" data-action="rec-cancel" style="color:var(--t-danger)">لغو خرید دوره‌ای</button>`,
    cancelled:`<button type="button" class="t-btn is-primary is-block" data-action="rec-activate"${items.length?'':' aria-disabled="true"'}>فعال‌سازی دوباره</button>`}[s.status];
  const html=`<div class="t-wrap t-page-end">${U.crumbs([['خرید دوره‌ای']])}
  <header class="t-page-head"><h1>خرید دوره‌ای</h1><p>محصولات همیشگی‌ات را یک‌بار انتخاب کن و در زمان دلخواه دوباره تحویل بگیر. فهرست مال خودت است و هر زمان می‌توانی آن را تغییر دهی.</p></header>
  ${!items.length&&s.status==='draft'?`<ol class="t-rsteps"><li><span class="n">۱</span>محصولات همیشگی‌ات را به فهرست اضافه کن${icon('list')}</li><li><span class="n">۲</span>فاصله ارسال را انتخاب کن${icon('calendar')}</li><li><span class="n">۳</span>هر بار بدون سفارش دوباره تحویل بگیر${icon('truck')}</li></ol>`:''}
  <div class="t-rec">
   <section class="t-panel t-rec-list" aria-labelledby="recLT"><header><h2 id="recLT">فهرست من</h2><span class="t-sub">${faNum(est.count)} محصول</span></header>
    ${items.length?`<div class="t-rec-rows">${rows}</div>`:`<p class="t-sub" style="margin-top:8px">فهرستت هنوز خالی است. از فهرست زیر محصول اضافه کن.</p>`}
    ${items.length?`<button type="button" class="t-link" data-action="rec-picker" aria-expanded="${picker}" style="margin-top:8px">${icon(picker?'minus':'plus')}${picker?'بستن فهرست محصولات':'افزودن محصول'}</button>`:''}
    ${picker?`<div class="t-picker"><form class="t-inline-form" role="search" data-form="rec-search"><input id="recQ" type="search" autocomplete="off" enterkeyhint="search" placeholder="جستجوی محصول..." aria-label="جستجوی محصول برای خرید دوره‌ای" value="${esc(recUI.q)}"></form><div class="t-picker-list" id="recPick">${recPick()}</div></div>`:''}
   </section>
   <aside class="t-panel t-rec-set" aria-label="تنظیمات ارسال">
    <div class="t-status"><h3 style="margin:0">وضعیت</h3><span class="t-badge ${cls}">${label}</span></div>
    <div><h3 id="recFT">فاصله ارسال</h3><div class="t-choices" role="radiogroup" aria-labelledby="recFT">${Recurring.FREQS.map(([k,l])=>`<button type="button" class="t-choice" role="radio" data-action="rec-freq" data-k="${k}" aria-checked="${s.frequency===k}">${l}</button>`).join('')}</div></div>
    ${s.status==='cancelled'?'':`<div class="t-next">${icon('calendar')}<div><small>${s.status==='paused'?'ارسال‌ها متوقف است':s.status==='draft'?'اولین ارسال (پس از فعال‌سازی)':'ارسال بعدی'}${s.skipNext&&s.status==='active'?' · یک ارسال رد شد':''}</small><b>${s.status==='paused'?'—':U.date(Recurring.nextDelivery(),{weekday:'long',day:'numeric',month:'long'})}</b></div></div>`}
    <div class="t-sumrows" style="margin-top:0"><div class="t-sumrow"><span>مبلغ هر ارسال (تقریبی)</span><b>${amount(est.subtotal)} €</b></div><div class="t-sumrow"><span>هزینه ارسال</span><b class="muted">هنگام ثبت محاسبه می‌شود</b></div></div>
    ${acts}
    <p class="t-sub" style="font-size:13px">مبلغ نهایی هر ارسال بر اساس قیمت روز محصولات محاسبه می‌شود. هر زمان می‌توانی فهرست، فاصله ارسال یا وضعیت را تغییر دهی.</p>
   </aside></div>
  <div class="t-concept">${icon('gift')}<div><b>دنبال مجموعه‌های آماده هستی؟</b><p><a href="#/bundles">پکیج‌های آماده</a> مجموعه‌های ثابت و از پیش انتخاب‌شده‌اند و یک‌بار خریده می‌شوند.</p></div></div></div>`;
  return{title:'خرید دوره‌ای',html};
};

function recPick(){return Catalog.search(recUI.q,Catalog.products.filter(p=>p.recurringEligible)).map(p=>{const v=p.defaultVariant,q=Recurring.qty(v.id);return `<div class="t-pick-row">${U.ph('thumb')}<div>${esc(p.title)}<small>${esc(v.title)} · ${v.available?amount(v.price)+' €':'فعلاً ناموجود'}</small></div>${q?`<span class="t-badge is-ok">${faNum(q)} در فهرست</span>`:`<button type="button" class="t-btn is-ghost" data-action="rec-pick" data-v="${esc(v.id)}" aria-label="افزودن ${esc(p.title)} به فهرست">${icon('plus')}افزودن</button>`}</div>`}).join('')||`<p class="t-sub" style="padding:12px 0">محصولی پیدا نشد.</p>`}

/* ---------- Cart ---------- */
VIEWS.cart=()=>{
  const lines=Cart.lines(),t=Cart.totals(),codes=Cart.codes();
  if(!lines.length)return{title:'سبد خرید',html:`<div class="t-wrap">${U.crumbs([['سبد خرید']])}<section class="t-panel" style="padding:8px 20px">${U.empty({ic:'cart',title:'سبد خریدت خالی است',text:'محصولات را از فروشگاه یا از مواد لازم یک غذا اضافه کن.',action:`<a class="t-btn is-primary" href="#/products">شروع خرید ${icon('arrow-left')}</a>`})}</section></div><section class="t-sec" aria-labelledby="cartSugT"><h2 class="t-title" id="cartSugT">انتخاب‌های ته دیگ</h2><div class="t-rail">${Catalog.products.slice(0,4).map(p=>U.productCard(p,0)).join('')}</div></section>`};
  const row=l=>{const href=l.product.kind==='bundle'?`#/bundle/${l.product.handle}`:`#/product/${l.product.handle}`;return `<article class="t-cline"><a class="t-cline-img t-ph" href="${href}" tabindex="-1" aria-hidden="true">${icon(l.product.kind==='bundle'?'gift':'image')}</a><div class="t-cline-info"><h3 class="t-cline-name"><a href="${href}">${esc(l.product.title)}</a></h3><div class="t-cline-var">${l.product.kind==='bundle'?`${faNum(l.product.components.length)} محصول<span class="t-badge">پکیج</span>`:esc(l.variant.title)}${l.qty>1?` · هر عدد ${amount(l.variant.price)} €`:''}</div>${price(l.variant,{qty:l.qty,noCompare:true})}</div><div class="t-cline-ctl">${U.stepper({scope:'cart',vid:l.id,qty:l.qty,name:l.product.title,size:'sm',min:1,tone:'on-beige'})}<button type="button" class="t-trash" data-action="remove" data-v="${esc(l.id)}" aria-label="حذف ${esc(l.product.title)} از سبد">${icon('trash')}</button></div></article>`};
  const html=`<div class="t-wrap t-page-end">${U.crumbs([['سبد خرید']])}<h1 class="t-sr">سبد خرید</h1>
  <div class="t-cart"><section class="t-panel t-lines" aria-label="محصولات سبد">${lines.map(row).join('')}</section>
  <div class="t-cart-side">
   <section class="t-panel t-code" aria-labelledby="codeT"><h2 id="codeT">کد تخفیف داری؟</h2><p>کد را وارد کن تا تخفیف روی سفارشت اعمال شود.</p>
    <form class="t-inline-form" data-form="code" novalidate><input id="codeIn" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="done" placeholder="کد تخفیف" aria-label="کد تخفیف" aria-describedby="codeErr"><button class="t-btn is-primary">اعمال کد</button></form><p class="t-err" id="codeErr" role="alert"></p></section>
   ${summary(t,codes,true)}
  </div>${complements(lines)}</div></div>`;
  return{title:'سبد خرید',html};
};
/* restrained complements: at most 3 related in-stock products, compact rows, one-tap add */
function complements(lines){const list=Catalog.complements(lines,3);if(!list.length)return '';
  return `<section class="t-panel t-comp" aria-labelledby="compT"><h2 id="compT">شاید این‌ها را هم لازم داشته باشی</h2><div class="t-comp-rows">${list.map(p=>{const v=p.defaultVariant;return `<div class="t-pick-row">${U.ph('thumb')}<div><a href="#/product/${p.handle}">${esc(p.title)}</a><small>${esc(v.title)} · ${amount(v.price)} €</small></div><button type="button" class="t-btn is-ghost" data-action="qty" data-d="1" data-scope="cart" data-v="${esc(v.id)}" aria-label="افزودن ${esc(p.title)} به سبد">${icon('plus')}افزودن</button></div>`}).join('')}</div></section>`}
function shipRow(t,withMeter){
  if(!t.shippingKnown)return `<div class="t-sumrow"><span>هزینه ارسال</span><b class="muted">در مرحله بعد</b><span class="full">هزینه ارسال پس از وارد کردن نشانی محاسبه می‌شود</span></div>`;
  return `<div class="t-sumrow"><span>هزینه ارسال</span><b>${t.shipping?amount(t.shipping)+' €':'رایگان'}</b>${withMeter&&t.freeThreshold!=null?`<span class="full">${t.freeRemaining?`${amount(t.freeRemaining)} € تا ارسال رایگان`:'ارسال رایگان برای این سفارش فعال است'}</span>${t.freeRemaining?`<div class="t-ship-meter" style="flex-basis:100%;margin-top:0"><div class="bar"><i style="width:${Math.min(100,(1-t.freeRemaining/t.freeThreshold)*100)}%"></i></div></div>`:''}`:''}</div>`}
function summary(t,codes,withCta){
  return `<section class="t-panel t-summary" aria-labelledby="sumT"><h2 id="sumT">سبد خرید شما</h2><p class="t-sub">${faNum(t.count)} محصول در سبد خرید</p>
  <div class="t-sumrows"><div class="t-sumrow"><span>جمع محصولات</span><b>${amount(t.subtotal)} €</b></div>
   ${shipRow(t,true)}
   ${t.discount?`<div class="t-sumrow is-disc"><span>تخفیف</span><b>−${amount(t.discount)} €</b>${codes.map(c=>`<span class="code"><span>${esc(c)}</span>${withCta?`<button type="button" data-action="code-remove" data-k="${esc(c)}" aria-label="حذف کد تخفیف ${esc(c)}">${icon('x-circle')}</button>`:''}</span>`).join('')}</div>`:''}</div>
  <div class="t-total"><span>${t.shippingKnown?'جمع کل':'جمع کل (بدون ارسال)'}</span><b>${amount(t.total)}<span class="cur">€</span></b></div><p class="t-tax">مالیات در قیمت محصولات لحاظ شده است</p>
  ${withCta?`<a class="t-btn is-primary is-block" href="#/checkout">ادامه و انتخاب روش ارسال</a><div class="t-sum-pay">${U.payLogos()}<p>${icon('lock')}پرداخت از مسیرهای امن و معتبر</p></div>`:''}</section>`;
}

/* ---------- Checkout (prototype of Shopify Checkout) ----------
   Production: redirect to cart.checkoutUrl (Shopify Checkout, branded with
   Checkout Extensibility). These steps only demonstrate the flow. */
const CO_STEPS=['اطلاعات تماس','ارسال','پرداخت','بررسی'];
const PAYMENTS=[['card','کارت بانکی','Visa، Mastercard'],['apple','Apple Pay',''],['google','Google Pay','']];
VIEWS.checkout=()=>{
  if(coUI.step===5&&coUI.order)return doneView();
  if(!Cart.count())return{title:'تکمیل سفارش',footer:'lite',html:`<div class="t-wrap">${U.crumbs([['سبد خرید','#/cart'],['تکمیل سفارش']])}<section class="t-panel" style="padding:8px 20px">${U.empty({ic:'cart',title:'سبد خریدت خالی است',text:'برای تکمیل سفارش، ابتدا محصولی به سبد اضافه کن.',action:`<a class="t-btn is-primary" href="#/products">مشاهده محصولات</a>`})}</section></div>`};
  const a=Customer.address(),e=coUI.errors,t=Cart.totals();
  const field=(id,label,val,o={})=>`<label class="t-field"><span>${label}</span><input class="t-input${o.ltr?' ltr':''}" id="${id}" name="${id}" value="${esc(val)}" ${U.attr({autocomplete:o.ac,inputmode:o.im,maxlength:o.max,type:o.type||'text','aria-invalid':e[id]?'true':null,'aria-describedby':e[id]?id+'E':null,enterkeyhint:o.ek||'next'})}>${e[id]?`<span class="t-err" id="${id}E">${e[id]}</span>`:''}</label>`;
  const body={
   1:()=>`<h2>اطلاعات تماس و نشانی</h2><p class="t-sub">سفارش به این نشانی ارسال می‌شود.</p><form class="t-co-form" data-form="co-address" novalidate>
     ${field('name','نام و نام خانوادگی',a.name,{ac:'name'})}${field('contact','ایمیل یا شماره تماس',a.contact,{ac:'email',ltr:true})}${field('street','نشانی',a.street,{ac:'street-address'})}
     <div class="t-row2">${field('postal','کد پستی',a.postal,{ac:'postal-code',im:'numeric',max:5,ltr:true})}${field('city','شهر',a.city,{ac:'address-level2',ek:'done'})}</div>
     <button class="t-btn is-primary is-block">ادامه به روش ارسال ${icon('arrow-left')}</button></form>`,
   2:()=>`<h2>روش ارسال</h2><p class="t-sub">ارسال به ${esc(a.street)}، ${esc(a.postal)} ${esc(a.city)}</p><div class="t-options" role="radiogroup" aria-label="روش ارسال"><button type="button" class="t-option" role="radio" aria-checked="true"><span class="t-radio"></span><span><b>ارسال به نشانی ثبت‌شده</b><small>هزینه و زمان تقریبی تحویل در این مرحله نمایش داده می‌شود</small></span></button></div><p class="t-note">${icon('info')}<span>روش‌ها، هزینه و زمان تحویل در نسخه نهایی بر اساس نشانی تو از سامانه ارسال خوانده می‌شود. پس از ارسال، کد پیگیری سفارش را دریافت می‌کنی.</span></p><button type="button" class="t-btn is-primary is-block" data-action="co-step" data-k="3">ادامه به پرداخت ${icon('arrow-left')}</button>`,
   3:()=>`<h2>روش پرداخت</h2><p class="t-sub">پرداخت از مسیرهای امن و معتبر.</p><div class="t-options" role="radiogroup" aria-label="روش پرداخت">${PAYMENTS.map(([k,n,d])=>`<button type="button" class="t-option" role="radio" data-action="co-pay" data-k="${k}" aria-checked="${coUI.payment===k}"><span class="t-radio"></span><span><b>${n}</b>${d?`<small>${d}</small>`:''}</span></button>`).join('')}</div><p class="t-note">${icon('lock')}<span>این نسخه پیش‌نمایش است و هیچ مبلغی دریافت نمی‌شود.</span></p><button type="button" class="t-btn is-primary is-block" data-action="co-step" data-k="4">بررسی سفارش ${icon('arrow-left')}</button>`,
   4:()=>`<h2>بررسی و ثبت سفارش</h2><p class="t-sub">اطلاعات را یک بار دیگر بررسی کن.</p><div class="t-review">
     <div class="t-review-row"><div><small>گیرنده و نشانی</small><b>${esc(a.name)} · ${esc(a.street)}، ${esc(a.postal)} ${esc(a.city)}</b></div><button type="button" class="t-link" data-action="co-step" data-k="1">ویرایش</button></div>
     <div class="t-review-row"><div><small>ارسال</small><b>ارسال به نشانی ثبت‌شده · قابل پیگیری</b></div><button type="button" class="t-link" data-action="co-step" data-k="2">ویرایش</button></div>
     <div class="t-review-row"><div><small>پرداخت</small><b>${PAYMENTS.find(p=>p[0]===coUI.payment)[1]}</b></div><button type="button" class="t-link" data-action="co-step" data-k="3">ویرایش</button></div></div>
     <button type="button" class="t-btn is-primary is-block" data-action="co-place">ثبت سفارش — ${amount(t.total)} €</button>`}[coUI.step]();
  const mini=Cart.lines().map(l=>`<li><span class="img t-ph">${icon(l.product.kind==='bundle'?'gift':'image')}<em>${faNum(l.qty)}</em></span><span class="nm">${esc(l.product.title)}<small>${l.product.kind==='bundle'?'پکیج':esc(l.variant.title)}</small></span><b>${amount(l.total)} €</b></li>`).join('');
  const html=`<div class="t-wrap t-page-end">${U.crumbs([['سبد خرید','#/cart'],['تکمیل سفارش']])}
  <header class="t-page-head"><h1>تکمیل سفارش</h1></header>
  <ol class="t-co-steps" aria-label="مراحل سفارش">${CO_STEPS.map((s,i)=>`<li class="${i+1<coUI.step?'done':''}"${i+1===coUI.step?' aria-current="step"':''}><span class="n">${i+1<coUI.step?icon('check'):faNum(i+1)}</span>${s}</li>`).join('')}</ol>
  <div class="t-co"><section class="t-panel t-co-main" aria-live="polite">${body}</section>
   <aside class="t-panel t-co-side" aria-label="خلاصه سفارش"><details id="coSum"${matchMedia('(min-width:768px)').matches?' open':''}><summary>خلاصه سفارش<b>${amount(t.total)} €</b>${icon('down')}</summary><div class="inner"><ul class="t-mini">${mini}</ul>
    <div class="t-sumrows" style="margin-top:12px"><div class="t-sumrow"><span>جمع محصولات</span><b>${amount(t.subtotal)} €</b></div>${t.discount?`<div class="t-sumrow is-disc"><span>تخفیف (${esc(Cart.codes().join('، '))})</span><b>−${amount(t.discount)} €</b></div>`:''}${shipRow(t,false)}</div>
    <div class="t-total"><span>${t.shippingKnown?'جمع کل':'جمع کل (بدون ارسال)'}</span><b>${amount(t.total)}<span class="cur">€</span></b></div><p class="t-tax">مالیات در قیمت محصولات لحاظ شده است</p></div></details></aside></div></div>`;
  return{title:'تکمیل سفارش — '+CO_STEPS[coUI.step-1],footer:'lite',html,mount(){if(coUI.step===1&&Object.keys(coUI.errors).length)$('#view [aria-invalid="true"]')?.focus()}};
};
function doneView(){const o=coUI.order;return{title:'سفارش ثبت شد',footer:'lite',html:`<div class="t-wrap t-page-end" style="padding-top:24px"><section class="t-panel t-done"><div class="ok">${icon('check')}</div><h1>سفارشت با موفقیت ثبت شد</h1><p>از خریدت ممنونیم. وضعیت سفارش را در «سفارش‌های من» دنبال کن.</p><div class="no">شماره سفارش: <b>${esc(o.id)}</b></div><p>مبلغ کل: ${amount(o.total)} €</p><div class="acts"><a class="t-btn is-primary is-block" href="#/account/orders">مشاهده سفارش‌های من</a><a class="t-btn is-ghost is-block" href="#/">بازگشت به صفحه اصلی</a></div></section></div>`}}

/* ---------- Account ---------- */
/* Account: profile + navigation column | content column (side-by-side from tablet up) */
function accountShell(active,title,main){
  const rs=Recurring.state(),orders=Customer.orders().length,favs=Customer.favorites().length;
  const row=(key,href,ic,label,note)=>`<a href="${href}"${key&&key===active?' aria-current="page"':''}>${icon(ic)}<span>${label}${note?`<br><small>${esc(note)}</small>`:''}</span>${icon('chev-left','chev')}</a>`;
  const side=`<section class="t-panel t-acct-card"><span class="t-avatar">${icon('user')}</span><div><b>کاربر مهمان</b><small>برای پیگیری آسان‌تر سفارش‌ها وارد حساب شو.</small></div></section>
  <button type="button" class="t-btn is-primary is-block" data-action="toast" data-msg="ورود به حساب در نسخه نهایی فعال می‌شود">ورود یا ساخت حساب</button>
  <nav class="t-panel t-menu" aria-label="حساب من">${row('orders','#/account/orders','doc','سفارش‌های من',orders?`${faNum(orders)} سفارش`:'')}${row('addresses','#/account/addresses','pin','آدرس‌های من',Customer.hasAddress()?Customer.address().city:'')}${row('','#/recurring','repeat','خرید دوره‌ای من',REC_STATUS[rs.status][0])}${row('favorites','#/account/favorites','heart','علاقه‌مندی‌ها',favs?`${faNum(favs)} محصول`:'')}</nav>
  <nav class="t-panel t-menu" aria-label="راهنما">${row('','#/page/support','help','پشتیبانی')}${row('','#/page/payment','card','روش‌های پرداخت')}${row('','#/page/shipping','truck','ارسال و تحویل')}${row('','#/page/returns','undo','مرجوعی و بازپرداخت')}</nav>`;
  const crumbs=active?[['حساب کاربری','#/account'],[title]]:[['حساب کاربری']];
  return `<div class="t-wrap t-page-end">${U.crumbs(crumbs)}<header class="t-page-head"><h1>${title}</h1></header><div class="t-acct${active?' is-sub':''}"><aside class="t-acct-side" aria-label="حساب من">${side}</aside><div class="t-acct-main">${main}</div></div></div>`;
}
VIEWS.account=()=>{
  const last=Customer.orders()[0],rs=Recurring.state(),ri=Recurring.items(),a=Customer.address(),favs=Customer.favorites();
  const card=(ic,t,href,link,body)=>`<section class="t-panel t-ov-card"><header>${icon(ic)}<h2>${t}</h2><a class="t-link" href="${href}">${link}${icon('chev-left')}</a></header>${body}</section>`;
  const main=`<div class="t-ov">
   ${card('doc','سفارش اخیر','#/account/orders','همه سفارش‌ها',last?`<p><b class="ltr">${esc(last.id)}</b> <span class="t-badge is-gold">${esc(last.status)}</span></p><p class="t-sub">${U.date(new Date(last.placedAt),{day:'numeric',month:'long'})} · ${faNum(last.lines.reduce((s,l)=>s+l.qty,0))} قلم · ${amount(last.total)} €</p>`:`<p class="t-sub">هنوز سفارشی ثبت نکرده‌ای.</p>`)}
   ${card('repeat','خرید دوره‌ای','#/recurring','مدیریت',`<p><span class="t-badge ${REC_STATUS[rs.status][1]}">${REC_STATUS[rs.status][0]}</span></p><p class="t-sub">${ri.length?`${faNum(ri.length)} محصول در فهرست`+(rs.status==='active'?` · ارسال بعدی ${U.date(Recurring.nextDelivery())}`:''):'فهرستت هنوز خالی است.'}</p>`)}
   ${card('pin','نشانی تحویل','#/account/addresses',Customer.hasAddress()?'ویرایش':'افزودن',Customer.hasAddress()?`<p class="t-sub"><b>${esc(a.name)}</b><br>${esc(a.street)}، ${esc(a.postal)} ${esc(a.city)}</p>`:`<p class="t-sub">هنوز نشانی ثبت نشده است.</p>`)}
   ${card('heart','علاقه‌مندی‌ها','#/account/favorites','مشاهده',`<p class="t-sub">${favs.length?`${faNum(favs.length)} محصول: ${favs.slice(0,3).map(p=>esc(p.title)).join('، ')}`:'هنوز محصولی ذخیره نکرده‌ای.'}</p>`)}
  </div>`;
  return{title:'حساب کاربری',html:accountShell('','حساب کاربری',main)};
};
VIEWS.accountSub=(which)=>{
  const T={orders:'سفارش‌های من',addresses:'آدرس‌های من',favorites:'علاقه‌مندی‌ها'}[which];let body='';
  const emptyPanel=o=>`<section class="t-panel" style="padding:8px 20px">${U.empty(o)}</section>`;
  if(which==='orders'){const os=Customer.orders();body=os.length?`<div class="t-orders">${os.map(o=>`<article class="t-panel t-order"><header><b>${esc(o.id)}</b><span class="t-badge is-gold">${esc(o.status)}</span></header><p>${U.date(new Date(o.placedAt),{day:'numeric',month:'long',year:'numeric'})} · ${faNum(o.lines.reduce((s,l)=>s+l.qty,0))} قلم</p><p>${o.lines.map(l=>esc(l.title)).join('، ')}</p><div class="t-price"><span>${amount(o.total)}</span><span class="cur">€</span></div></article>`).join('')}</div>`:emptyPanel({ic:'doc',title:'هنوز سفارشی ثبت نکرده‌ای',action:`<a class="t-btn is-primary is-sm" href="#/products">شروع خرید</a>`})}
  if(which==='addresses'){const a=Customer.address(),e=coUI.errors;body=`<section class="t-panel t-co-main"><h2>نشانی تحویل</h2><p class="t-sub">این نشانی در تکمیل سفارش استفاده می‌شود.</p><form class="t-co-form t-addr-form" data-form="addr" novalidate>${[['name','نام و نام خانوادگی','name'],['contact','ایمیل یا شماره تماس','email'],['street','نشانی','street-address'],['postal','کد پستی','postal-code'],['city','شهر','address-level2']].map(([id,l,ac])=>`<label class="t-field f-${id}"><span>${l}</span><input class="t-input${id==='postal'||id==='contact'?' ltr':''}" id="${id}" value="${esc(a[id])}" autocomplete="${ac}"${id==='postal'?' inputmode="numeric" maxlength="5"':''}${e[id]?` aria-invalid="true" aria-describedby="${id}E"`:''}>${e[id]?`<span class="t-err" id="${id}E">${e[id]}</span>`:''}</label>`).join('')}<button class="t-btn is-primary is-block">ذخیره نشانی</button></form></section>`}
  if(which==='favorites'){const f=Customer.favorites();body=f.length?`<div class="t-list">${f.map(p=>U.productCard(p,Cart.qty(p.defaultVariant.id))).join('')}</div>`:emptyPanel({ic:'heart',title:'هنوز محصولی ذخیره نکرده‌ای',text:'در صفحه هر محصول با علامت قلب، آن را ذخیره کن.',action:`<a class="t-btn is-primary is-sm" href="#/products">مشاهده محصولات</a>`})}
  return{title:T,html:accountShell(which,T,body)};
};

/* ---------- Online Store pages ---------- */
VIEWS.page=(slug)=>{
  const pg=Catalog.pages[slug];if(!pg)return null;
  const content=pg.sections?`<article class="t-panel t-info">${pg.sections.map(s=>`<section><h2>${esc(s.title)}</h2>${s.logos?U.payLogos():`<p>${esc(s.body)}</p>`}</section>`).join('')}</article>`:`<article class="t-panel t-info"><section><p>محتوای این صفحه به‌زودی اضافه می‌شود. تا آن زمان اگر سؤالی داری، از بخش پشتیبانی با ما در ارتباط باش.</p></section></article>`;
  const others=Object.entries(Catalog.pages).map(([k,v])=>`<a href="#/page/${k}"${k===slug?' aria-current="page"':''}>${esc(v.title)}${icon('chev-left','chev')}</a>`).join('');
  return{title:pg.title,footer:'info',html:`<div class="t-wrap t-page-end">${U.crumbs([[pg.title]])}<header class="t-page-head"><h1>${esc(pg.title)}</h1>${pg.updated?`<p class="t-meta">ویرایش در ${esc(pg.updated)}</p>`:''}${pg.intro?`<p>${esc(pg.intro)}</p>`:''}</header>
  <div class="t-doc">${content}<aside class="t-doc-side">${slug==='support'||slug==='contact'?'':U.helpPanel()}<nav class="t-panel t-menu t-doc-nav" aria-label="صفحه‌های راهنما"><h2>صفحه‌های راهنما</h2>${others}</nav></aside></div></div>`};
};
VIEWS.notFound=()=>({title:'صفحه پیدا نشد',html:`<div class="t-wrap"><section class="t-panel" style="margin-top:32px;padding:8px 20px">${U.empty({ic:'search',title:'این صفحه پیدا نشد',text:'ممکن است نشانی تغییر کرده باشد.',action:`<a class="t-btn is-primary" href="#/">بازگشت به صفحه اصلی</a>`})}</section></div>`});

/* =====================================================================
   INTERACTIONS (delegated)
   ===================================================================== */
const ACTIONS={
  go:el=>navigate(el.dataset.href),
  search:el=>{shopUI.q=el.dataset.q||'';shopUI.c='all';shopUI.limit=SHOP_PAGE;navigate(shopHref())},
  soon:el=>toast(el.dataset.msg),
  toast:el=>toast(el.dataset.msg),
  notify:()=>{const i=$('#notifyEmail');if(i){i.scrollIntoView({block:'center',behavior:reduced()?'auto':'smooth'});i.focus({preventScroll:true})}else toast('وقتی موجود شد به تو خبر می‌دهیم (در نسخه نهایی)')},
  qty(el){const vid=el.dataset.v,d=+el.dataset.d,scope=el.dataset.scope;
    if(scope==='cart'){const q=Cart.qty(vid);if(d>0){if(!Cart.add(vid,1))return toast('این محصول فعلاً موجود نیست');if(!q)toast('به سبد اضافه شد');bumpBadge()}else Cart.set(vid,q-1);refreshControls(vid)}
    if(scope==='pd'){const st=pdUI[current.args[0]];st.qty=Math.max(1,st.qty+d);VIEWS.product.update()}
    if(scope==='bundle'){const st=bundleUI[current.args[0]];st.qty=Math.max(1,st.qty+d);VIEWS.bundle.update()}
    if(scope==='rec'){Recurring.set(vid,Recurring.qty(vid)+d)}},
  remove(el){const e=Catalog.variant(el.dataset.v);Cart.remove(el.dataset.v);toast(`«${e.product.title}» از سبد حذف شد`)},
  'pd-add'(el){const st=pdUI[current.args[0]];if(Cart.add(el.dataset.v,st.qty)){toast(`${faNum(st.qty)} عدد به سبد اضافه شد`);bumpBadge();st.qty=1;VIEWS.product.update()}},
  'bundle-add'(el){const b=Catalog.bundle(el.dataset.k),st=bundleUI[b.handle];if(Cart.add(b.variant.id,st.qty)){toast('پکیج به سبد اضافه شد');bumpBadge();st.qty=1;VIEWS.bundle.update()}},
  variant(el){const p=Catalog.product(current.args[0]);pdUI[p.handle].vid=el.dataset.v;setQuery(`#/product/${p.handle}?variant=${el.dataset.v.split('/').pop()}`);VIEWS.product.update()},
  thumb(el){const st=pdUI[current.args[0]];st.img=+el.dataset.k;$$('#view .t-thumb').forEach((t,i)=>t.setAttribute('aria-current',String(i===st.img)));$('#pdMain').setAttribute('aria-label',`تصویر ${faNum(st.img+1)} از ۴: ${Catalog.product(current.args[0]).title}`)},
  fav(el){const on=Customer.toggleFav(el.dataset.k);el.setAttribute('aria-pressed',String(on));el.setAttribute('aria-label',on?'حذف از علاقه‌مندی‌ها':'افزودن به علاقه‌مندی‌ها');toast(on?'به علاقه‌مندی‌ها اضافه شد':'از علاقه‌مندی‌ها حذف شد')},
  'rec-add'(el){Recurring.add(el.dataset.v,1);toast('به فهرست خرید دوره‌ای اضافه شد')},
  'rec-pick'(el){Recurring.add(el.dataset.v,1);toast('به فهرست اضافه شد')},
  'rec-remove'(el){Recurring.set(el.dataset.v,0)},
  'rec-picker'(){recUI.picker=!recUI.picker;refresh();if(recUI.picker)$('#recQ')?.focus({preventScroll:true})},
  'rec-freq'(el){Recurring.setFrequency(el.dataset.k)},
  'rec-activate'(){if(Recurring.activate())toast('خرید دوره‌ای فعال شد')},
  'rec-pause'(){Recurring.pause();toast('ارسال‌ها موقتاً متوقف شد')},
  'rec-resume'(){Recurring.resume();toast('ارسال‌ها دوباره فعال شد')},
  'rec-skip'(){Recurring.toggleSkip();toast(Recurring.state().skipNext?'ارسال بعدی رد شد':'ارسال بعدی برگشت')},
  'rec-cancel'(){confirmSheet('لغو خرید دوره‌ای','با لغو، ارسال‌های بعدی انجام نمی‌شود. فهرستت می‌ماند و هر زمان بخواهی می‌توانی دوباره فعالش کنی.','لغو خرید دوره‌ای',()=>{Recurring.cancel();toast('خرید دوره‌ای لغو شد')})},
  serv(el){recipeState(Catalog.recipe(current.args[0])).serv=+el.dataset.k;updateRecipe()},
  ing(el){const st=recipeState(Catalog.recipe(current.args[0])),h=el.dataset.k;st.off.has(h)?st.off.delete(h):st.off.add(h);updateRecipe()},
  have(el){const st=recipeState(Catalog.recipe(current.args[0])),n=el.dataset.k;st.have=st.have||new Set();st.have.has(n)?st.have.delete(n):st.have.add(n);updateRecipe()},
  'pantry-buy'(el){const p=Catalog.product(el.dataset.k);if(Cart.add(p.defaultVariant.id,1)){toast(`«${p.title}» به سبد اضافه شد`);bumpBadge()}},
  'recipe-add'(el){const r=Catalog.recipe(el.dataset.k),st=recipeState(r);let n=0;r.ingredients.forEach(ing=>{const v=ing.product.defaultVariant;if(!v.available||st.off.has(ing.product.handle))return;const {packs}=Catalog.packsFor(ing,st.serv,r.servings);if(packs&&Cart.add(v.id,packs))n++});if(n){st.added=n;toast(`${faNum(n)} محصول به سبد اضافه شد`);bumpBadge();updateRecipe()}},
  'recipe-cat'(el){recipesUI.cat=el.dataset.k;$$('#view .t-tab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===recipesUI.cat)));$('#recipeGrid').innerHTML=recipeGrid()},
  'recipe-reset'(){recipesUI.cat='همه';recipesUI.q='';refresh()},
  'shop-cat'(el){const had=$('#shopCats').contains(document.activeElement);shopUI.c=el.dataset.k;shopUI.limit=SHOP_PAGE;setQuery(shopHref());renderShop();document.title=collectionTitle(shopUI.c)+' | ته‌دیگ';const b=$(`#shopCats [data-k="${shopUI.c}"]`);if(had)b?.focus({preventScroll:true});b?.scrollIntoView({block:'nearest',inline:'nearest',behavior:reduced()?'auto':'smooth'})},
  'shop-reset'(){shopUI.c='all';shopUI.q='';shopUI.sort='popular';shopUI.limit=SHOP_PAGE;setQuery('#/products');renderShop()},
  more(){shopUI.limit+=SHOP_PAGE;renderShop()},
  suggest(el){shopUI.q=el.dataset.q;shopUI.c='all';shopUI.limit=SHOP_PAGE;setQuery(shopHref());renderShop()},
  'code-remove'(el){Cart.removeCode(el.dataset.k);toast('کد تخفیف حذف شد')},
  'co-pay'(el){coUI.payment=el.dataset.k;refresh()},
  'co-step'(el){coUI.step=+el.dataset.k;coUI.errors={};refresh();$('.t-co-steps')?.scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'})},
  'co-place'(el){if(el.dataset.busy)return;el.dataset.busy='1';coUI.step=5;coUI.order=Customer.placeOrder({payment:coUI.payment});refresh();window.scrollTo(0,0);announce('سفارش ثبت شد')},
  'drawer-open':()=>openDrawer(),'drawer-close':()=>closeDrawer(),
  'sheet-close':()=>closeSheet()
};
function updateRecipe(){const r=Catalog.recipe(current.args[0]),key=focusKey(document.activeElement);$('#rdShop').innerHTML=recipeShop(r);restoreFocus(key)}
document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el||el.getAttribute('aria-disabled')==='true')return;const fn=ACTIONS[el.dataset.action];if(fn){e.preventDefault();fn(el,e)}});

const FORMS={
  'home-search'(f){const q=$('#homeSearch').value.trim();shopUI.q=q;shopUI.c='all';shopUI.limit=SHOP_PAGE;navigate(shopHref())},
  'shop-search'(){$('#shopSearchInput').blur()},
  'recipe-search'(){$('#recipeQ').blur()},
  'rec-search'(){$('#recQ').blur()},
  code(){const inp=$('#codeIn'),v=inp.value.trim();if(!v){$('#codeErr').textContent='کد تخفیف را وارد کن';inp.focus();return}if(Cart.applyCode(v))toast('کد تخفیف اعمال شد');else{$('#codeErr').textContent='این کد معتبر نیست؛ حروف و اعداد را دوباره بررسی کن.';inp.setAttribute('aria-invalid','true');inp.focus()}},
  notify(f){const inp=$('#notifyEmail'),v=inp.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){$('#notifyErr').textContent='یک ایمیل معتبر وارد کن';inp.setAttribute('aria-invalid','true');inp.focus();return}Customer.requestNotify(f.dataset.v,v);toast('ثبت شد؛ به محض موجود شدن خبرت می‌کنیم');if(current?.name==='product')VIEWS.product.update()},
  newsletter(){const inp=$('#tNewsEmail'),v=inp.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){toast('ایمیل معتبر وارد کن');inp.focus();return}inp.value='';inp.blur();toast('عضویت ثبت شد')},
  'co-address'(){const a=readAddress();if(!a)return;Customer.saveAddress(a);coUI.step=2;refresh();$('.t-co-steps')?.scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'})},
  addr(){const a=readAddress();if(!a)return;Customer.saveAddress(a);toast('نشانی ذخیره شد');refresh()}
};
function readAddress(){const a={};['name','contact','street','postal','city'].forEach(k=>a[k]=($('#'+k)?.value||'').trim());a.postal=U.toEn(a.postal);
  const e={};if(!a.name)e.name='نام گیرنده را وارد کن';if(!a.contact)e.contact='ایمیل یا شماره تماس را وارد کن';if(!a.street)e.street='نشانی را وارد کن';if(!/^\d{5}$/.test(a.postal))e.postal='کد پستی باید ۵ رقم باشد';if(!a.city)e.city='شهر را وارد کن';
  coUI.errors=e;if(Object.keys(e).length){Customer.saveAddress(a);refresh();$('#view [aria-invalid="true"]')?.focus();return null}return a}
document.addEventListener('submit',e=>{const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();FORMS[f.dataset.form]?.(f)});
document.addEventListener('input',e=>{const t=e.target;
  if(t.id==='shopSearchInput'){shopUI.q=t.value;shopUI.limit=SHOP_PAGE;setQuery(shopHref());renderShop()}
  if(t.id==='recipeQ'){recipesUI.q=t.value;$('#recipeGrid').innerHTML=recipeGrid()}
  if(t.id==='recQ'){recUI.q=t.value;$('#recPick').innerHTML=recPick()}
  if(t.id==='codeIn'&&t.hasAttribute('aria-invalid')){t.removeAttribute('aria-invalid');$('#codeErr').textContent=''}});
document.addEventListener('change',e=>{if(e.target.id==='tSort'){shopUI.sort=e.target.value;shopUI.limit=SHOP_PAGE;setQuery(shopHref());renderShop()}});

/* ---------- Drawer ---------- */
let drawerReturn=null;const drawer=$('#tDrawer');
function renderDrawer(){const n=current?.name,c=Cart.count(),link=(href,ic,l,on,extra='')=>`<a href="${href}"${on?' aria-current="page"':''}>${icon(ic)}${l}${extra}</a>`;
  $('#tDrawerNav').innerHTML=link('#/','home','خانه',n==='home')+link('#/products','bag','محصولات',n==='shop'||n==='product')+link('#/recipes','bowl','غذاها و دستورپخت‌ها',n==='recipes'||n==='recipe')+link('#/bundles','gift','پکیج‌های آماده',n==='bundles'||n==='bundle')+link('#/recurring','repeat','خرید دوره‌ای',n==='recurring')+link('#/cart','cart','سبد خرید',n==='cart',c?`<span class="n">${faNum(c)}</span>`:'')+link('#/account','user','حساب کاربری',n==='account'||n==='accountSub');
  $('#tDrawerCats').innerHTML=Catalog.collections.map(x=>`<a href="#/products?c=${x.handle}">${esc(x.title)}</a>`).join('')}
function openDrawer(){renderDrawer();drawerReturn=document.activeElement;drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');drawer.inert=false;$('.t-menu-btn').setAttribute('aria-expanded','true');document.documentElement.classList.add('t-lock');setTimeout(()=>$('.t-drawer-panel').focus({preventScroll:true}),60)}
function closeDrawer(viaNav){if(!drawer.classList.contains('open'))return;drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');drawer.inert=true;$('.t-menu-btn').setAttribute('aria-expanded','false');if(!$('.t-sheet.open'))document.documentElement.classList.remove('t-lock');if(!viaNav)drawerReturn?.focus?.({preventScroll:true})}

/* ---------- Confirm sheet ---------- */
let sheetReturn=null,sheetYes=null;const sheet=$('#tSheet');
function confirmSheet(title,text,yes,onYes){$('#tSheetT').textContent=title;$('#tSheetP').textContent=text;$('#tSheetYes').textContent=yes;sheetYes=onYes;sheetReturn=document.activeElement;sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');sheet.inert=false;document.documentElement.classList.add('t-lock');setTimeout(()=>$('#tSheetNo').focus({preventScroll:true}),60)}
function closeSheet(){if(!sheet.classList.contains('open'))return;sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');sheet.inert=true;if(!drawer.classList.contains('open'))document.documentElement.classList.remove('t-lock');sheetReturn?.focus?.({preventScroll:true})}
$('#tSheetYes').addEventListener('click',()=>{const f=sheetYes;closeSheet();f?.()});
function trap(container,e){const f=$$('a[href],button:not([disabled])',container).filter(x=>x.offsetParent!==null);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
document.addEventListener('keydown',e=>{
  if(sheet.classList.contains('open')){if(e.key==='Escape')closeSheet();if(e.key==='Tab')trap(sheet,e);return}
  if(drawer.classList.contains('open')){if(e.key==='Escape')closeDrawer();if(e.key==='Tab')trap(drawer,e)}});

/* ---------- footer current-page marker ---------- */
function markFooter(){const h=location.hash||'#/';$$('.t-links a,.t-fcol a').forEach(a=>{if(a.getAttribute('href')===h)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}

/* ---------- init ---------- */
drawer.inert=true;sheet.inert=true;
updateBadge();
route(history.state?.y);
})();
