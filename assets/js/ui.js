/* =====================================================================
   TAHDIG — presentational components
   Pure functions: data in, HTML string out. No state, no data fetching.
   Each maps 1:1 to a future React component (noted in the comments).
   Interactions are declared with data-action attributes and handled by
   the delegated dispatcher in app.js.
   ===================================================================== */
(function(){
const FA='۰۱۲۳۴۵۶۷۸۹';
const faNum=n=>String(n).replace(/\d/g,d=>FA[d]).replace(/\./g,'٫');
const toEn=s=>String(s).replace(/[۰-۹]/g,d=>FA.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
/* 45 → ۴۵ · 44.8 → ۴۴٫۸۰ */
const amount=n=>{const r=Math.round(n*100)/100,str=Number.isInteger(r)?String(Math.round(r)):r.toFixed(2),[i,d]=str.split('.');return faNum(i.replace(/\B(?=(\d{3})+(?!\d))/g,',').replace(/,/g,'٬')+(d?'.'+d:''))};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attr=o=>Object.entries(o).filter(([,v])=>v!==undefined&&v!==null&&v!==false).map(([k,v])=>v===true?k:`${k}="${esc(v)}"`).join(' ');

/* <Icon> */
const icon=(n,cls='')=>`<svg class="t-ic${cls?' '+cls:''}" aria-hidden="true"><use href="#t-${n}"/></svg>`;
/* <Placeholder> — neutral stand-in for Shopify media */
const ph=(cls='',ic='image')=>`<span class="t-ph ${cls}" aria-hidden="true">${icon(ic)}</span>`;
/* <Money> */
const money=(n,cls='')=>`<span class="t-money ${cls}"><span>${amount(n)}</span> <span class="cur">€</span></span>`;
/* <Price> — current price, currency, optional compare-at */
const price=(v,o={})=>`<div class="t-price"${o.label?` aria-label="${esc(o.label)}"`:''}><span>${amount(v.price*(o.qty||1))}</span><span class="cur">€</span>${v.compareAt&&!o.noCompare?`<s>${amount(v.compareAt*(o.qty||1))} €</s>`:''}</div>`;

/* <QtyStepper> — plus · value · minus (plus sits on the reading-start side) */
function stepper({scope,vid,qty,name,size='',min=0,enter=false,tone=''}){
  const d=`data-scope="${scope}" data-v="${esc(vid)}"`;
  const minusLabel=qty<=1&&min===0?'حذف':'کم کردن یکی';
  return `<div class="t-stepper${size?' is-'+size:''}${tone?' '+tone:''}${enter?' enter':''}" role="group" aria-label="تعداد ${esc(name)}">`+
   `<button type="button" class="plus" data-action="qty" data-d="1" ${d} aria-label="افزودن یکی دیگر">${icon('plus')}</button>`+
   `<output aria-live="polite">${faNum(qty)}</output>`+
   `<button type="button" class="minus" data-action="qty" data-d="-1" ${d} aria-label="${minusLabel}"${qty<=min?' disabled':''}>${icon('minus')}</button></div>`;
}
/* <AddToCartControl> — cart button that becomes a stepper once added */
function addControl(p,v,qty,enter){
  if(!v.available)return `<a class="t-bell-btn" href="#/product/${p.handle}?notify=1" aria-label="وقتی ${esc(p.title)} موجود شد خبرم کن">${icon('bell')}</a>`;
  if(!qty)return `<button type="button" class="t-add-btn" data-action="qty" data-d="1" data-scope="cart" data-v="${esc(v.id)}" aria-label="افزودن ${esc(p.title)} به سبد">${icon('cart')}</button>`;
  return stepper({scope:'cart',vid:v.id,qty,name:p.title,enter});
}
/* <UnitPrice> — comparison price (€/kg, €/L), shown when the pack is not already 1 kg / 1 L */
const unitPrice=(v,cls='t-unit')=>v.unitPrice&&!(v.pack&&v.pack.qty===1&&(v.pack.unit==='kg'||v.pack.unit==='l'))?`<span class="${cls}">هر ${v.unitPrice.unit==='لیتر'?'لیتر':'کیلو'} ${amount(v.unitPrice.value)} €</span>`:'';
/* <ProductCard> */
function productCard(p,qty){
  const v=p.defaultVariant,href=`#/product/${p.handle}`;
  return `<article class="t-card${p.available?'':' is-oos'}"><a class="t-card-media t-ph" href="${href}" tabindex="-1" aria-hidden="true">${icon('image')}</a>`+
  `<div class="t-card-info"><h3 class="t-card-name"><a class="t-card-link" href="${href}">${esc(p.title)}</a></h3><span class="t-card-weight">${esc(v.title)}</span></div>`+
  `<div class="t-card-foot">${p.available?`<div class="t-card-price">${price(v)}${unitPrice(v)}</div>`:'<span class="t-oos">ناموجود</span>'}<div data-qty-for="${esc(v.id)}">${addControl(p,v,qty)}</div></div></article>`;
}
/* <Breadcrumbs> */
function crumbs(items,cls=''){
  return `<nav class="t-crumbs${cls?' '+cls:''}" aria-label="مسیر صفحه"><a href="#/">${icon('home')}صفحه اصلی</a>`+items.map((it,i)=>`${icon('chev-left','sep')}${i===items.length-1?`<span aria-current="page">${esc(it[0])}</span>`:`<a href="${it[1]}">${esc(it[0])}</a>`}`).join('')+`</nav>`;
}
/* <RecipeMeta> */
const recipeMeta=r=>`<div class="t-rmeta"><span>${icon('bolt')}${esc(r.difficulty)}</span><span>${icon('person')}${faNum(r.servings)} نفر</span><span>${icon('timer')}${esc(r.time)}</span></div>`;
/* <RecipeCard> */
function recipeCard(r,h='h3'){
  const href=`#/recipe/${r.handle}`;
  return `<article class="t-rcard"><a class="t-rcard-media t-ph" href="${href}" tabindex="-1" aria-hidden="true">${icon('bowl')}</a>${recipeMeta(r)}<${h}><a href="${href}">${esc(r.title)}</a></${h}><a class="t-btn is-primary is-block" href="${href}" aria-label="مشاهده مواد لازم ${esc(r.title)}">مشاهده مواد لازم ${icon('arrow-left')}</a></article>`;
}
/* <BundleCard> */
function bundleCard(b){
  const href=`#/bundle/${b.handle}`,pct=b.saving?Math.round(b.saving/b.separatePrice*100):0;
  return `<article class="t-bcard"><a class="t-bcard-media t-ph" href="${href}" tabindex="-1" aria-hidden="true">${icon('gift')}${pct?`<span class="t-badge is-gold">${faNum(pct)}٪ صرفه‌جویی</span>`:''}</a>`+
  `<h3><a href="${href}">${esc(b.title)}</a></h3><p>${esc(b.description)}</p><div class="contents">${faNum(b.components.length)} محصول: ${b.components.map(c=>esc(c.product.title)).join('، ')}</div>`+
  `<div class="t-bcard-foot">${b.variant.available?price(b.variant):'<span class="t-oos">فعلاً ناموجود</span>'}<a class="t-btn is-primary is-sm" href="${href}">مشاهده پکیج</a></div></article>`;
}
/* <EmptyState> */
const empty=({ic='bag',title,text='',action=''})=>`<div class="t-empty">${icon(ic)}<b>${esc(title)}</b>${text?`<p>${esc(text)}</p>`:''}${action}</div>`;
/* <Accordion> item */
const accItem=({ic,title,body,open})=>`<details${open?' open':''}><summary>${icon(ic,'lead')}<span>${esc(title)}</span>${icon('down','chev')}</summary><div class="body">${body}</div></details>`;
const specList=rows=>`<ul class="t-spec">${rows.map(([k,v])=>`<li><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></li>`).join('')}</ul>`;
/* <PaymentLogos> — neutral placeholders for the provider marks */
const payLogos=()=>`<div class="t-paylogos" aria-label="روش‌های پرداخت">${['VISA','Mastercard','MobilePay','Apple Pay','Google Pay','Klarna'].map(n=>`<span>${n}</span>`).join('')}</div>`;
/* <HelpPanel> */
const helpPanel=()=>`<section class="t-help" aria-labelledby="tHelpT"><h2 id="tHelpT">${icon('question')}هنوز پاسخ را پیدا نکردی؟</h2><p>پیامت را برای ما بفرست تا پس از بررسی راهنمایی‌ات کنیم.</p><a class="t-btn is-white is-block" href="#/page/support">تماس با پشتیبانی</a></section>`;
/* Dates shown in the Gregorian calendar with Persian digits (Nordic market) */
const date=(d,o={day:'numeric',month:'long'})=>{try{return new Intl.DateTimeFormat('fa-IR-u-ca-gregory-nu-arabext',o).format(d)}catch(e){return faNum(d.toISOString().slice(0,10))}};

window.UI={unitPrice,faNum,toEn,amount,esc,attr,icon,ph,money,price,stepper,addControl,productCard,crumbs,recipeMeta,recipeCard,bundleCard,empty,accItem,specList,payLogos,helpPanel,date};
})();
