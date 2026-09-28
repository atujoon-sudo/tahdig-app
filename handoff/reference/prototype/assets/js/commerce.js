/* =====================================================================
   TAHDIG — commerce layer
   The only module that knows where commerce data comes from. UI code talks
   to `Catalog`, `Cart`, `Recurring`, `Customer` and never to raw data.

   Production mapping (Shopify):
   - Catalog.*        → Storefront API: products, collections, metaobjects
   - Cart.*           → Storefront API Cart (cartCreate / cartLinesAdd /
                        cartLinesUpdate / cartDiscountCodesUpdate); totals
                        come from cart.cost, checkout goes to cart.checkoutUrl
   - Recurring.*      → selling plans + subscription contracts (Shopify
                        Subscriptions or a subscriptions app), managed via
                        the Customer Account API
   - Customer.*       → Customer Account API (addresses, orders)
   This prototype keeps state in localStorage and computes totals locally.
   ===================================================================== */
(function(){
const RAW=window.TAHDIG_MOCK;
const money=m=>m?Number(m.amount):null;
const UNIT={g:['weight',1],kg:['weight',1000],mg:['weight',.001],ml:['volume',1],l:['volume',1000]};

/* ---------- Catalog (normalised view models) ---------- */
function normVariant(raw,product){
  const pack=raw.metafields?.pack||null;
  const price=money(raw.price),compareAt=money(raw.compareAtPrice);
  let unitPrice=null;
  if(pack&&UNIT[pack.unit]){const [type,f]=UNIT[pack.unit],base=pack.qty*f;unitPrice={value:price/(base/1000),unit:type==='weight'?'کیلوگرم':'لیتر'}}
  return{id:raw.id,sku:raw.sku,title:raw.title,price,compareAt,available:raw.availableForSale,pack,unitPrice,productHandle:product.handle,kind:'product'};
}
function normProduct(raw){
  const p={id:raw.id,legacyId:raw.legacyResourceId,handle:raw.handle,title:raw.title,latinTitle:raw.latinTitle||'',searchTerms:raw.searchTerms||'',vendor:raw.vendor,collection:raw.collections[0],tags:raw.tags||[],badge:raw.badge||null,
    description:raw.description||'',recurringEligible:!!raw.recurring,optionName:raw.options?.[0]?.name||'وزن',
    stockNote:raw.metafields?.stockNote||'',specs:raw.metafields?.specs||[],storage:raw.metafields?.storage||'',cooking:raw.metafields?.cooking||'',related:raw.related||[]};
  p.variants=raw.variants.map(x=>normVariant(x,p));
  p.defaultVariant=p.variants.find(x=>x.id===raw.defaultVariant)||p.variants.find(x=>x.available)||p.variants[0];
  p.available=p.variants.some(x=>x.available);
  return p;
}
const products=RAW.products.map(normProduct);
const byHandle=new Map(products.map(p=>[p.handle,p]));
const variants=new Map();products.forEach(p=>p.variants.forEach(x=>variants.set(x.id,{variant:x,product:p})));

const bundles=RAW.bundles.map(b=>{
  const components=b.components.map(c=>({product:byHandle.get(c.handle),qty:c.qty}));
  const separate=components.reduce((s,c)=>s+c.product.defaultVariant.price*c.qty,0);
  const bundle={id:b.id,handle:b.handle,title:b.title,description:b.description,components,separatePrice:separate,kind:'bundle'};
  bundle.variant={id:b.variantId,title:'پکیج',price:money(b.price),compareAt:separate>money(b.price)?separate:null,available:components.every(c=>c.product.available),productHandle:b.handle,kind:'bundle'};
  bundle.saving=Math.max(0,separate-bundle.variant.price);
  variants.set(bundle.variant.id,{variant:bundle.variant,product:bundle});
  return bundle;
});
const bundleByHandle=new Map(bundles.map(b=>[b.handle,b]));

const recipes=RAW.recipes.map(r=>({...r,ingredients:r.ingredients.map(i=>({...i,product:byHandle.get(i.handle)})),pantry:r.pantry.map(name=>({name,product:RAW.pantryMatches[name]?byHandle.get(RAW.pantryMatches[name]):null}))}));

const collections=RAW.collections;
const Catalog={
  shop:RAW.shop,collections,products,bundles,recipes,pages:RAW.pages,
  allDescription:RAW.allProductsDescription,
  product:h=>byHandle.get(h)||null,
  bundle:h=>bundleByHandle.get(h)||null,
  recipe:h=>recipes.find(r=>r.handle===h)||null,
  collection:h=>collections.find(c=>c.handle===h)||null,
  variant:id=>variants.get(id)||null,
  inCollection:h=>h&&h!=='all'?products.filter(p=>p.collection===h):products.slice(),
  related(p,n=4){const list=p.related.map(h=>byHandle.get(h)).filter(Boolean);products.forEach(x=>{if(list.length<n&&x!==p&&!list.includes(x)&&x.collection===p.collection)list.push(x)});products.forEach(x=>{if(list.length<n&&x!==p&&!list.includes(x))list.push(x)});return list.slice(0,n)},
  /* matches Persian, English and Finnish names, tags and collection names; every word must match */
  search(q,list=products){const words=normFa(q).split(' ').filter(Boolean);if(!words.length)return list;return list.filter(p=>{const c=collections.find(x=>x.handle===p.collection),hay=normFa([p.title,p.latinTitle,p.searchTerms,p.vendor,p.tags.join(' '),c?.title,c?.latinTitle].join(' '));return words.every(w=>hay.includes(w))})},
  /* restrained cart complements: related products of what is in the cart, in stock, not already added */
  complements(lines,n=3){const inCart=new Set(lines.map(l=>l.product.handle)),seen=new Set(),out=[];lines.forEach(l=>{const rel=l.product.kind==='bundle'?[]:l.product.related;rel.forEach(h=>{const p=byHandle.get(h);if(p&&p.available&&!inCart.has(h)&&!seen.has(h)&&out.length<n){seen.add(h);out.push(p)}})});return out},
  sort(list,mode){const l=list.slice(),pr=p=>p.defaultVariant.price;if(mode==='cheap')l.sort((a,b)=>pr(a)-pr(b));if(mode==='expensive')l.sort((a,b)=>pr(b)-pr(a));if(mode==='new')l.sort((a,b)=>b.legacyId-a.legacyId);return l},
  /* recipe helper: packs needed for an ingredient at a serving count */
  packsFor(ing,servings,baseServings){const v=ing.product.defaultVariant,need=Math.round(ing.qty*servings/baseServings);if(!v.pack||!UNIT[ing.unit]||!UNIT[v.pack.unit]||UNIT[ing.unit][0]!==UNIT[v.pack.unit][0])return{need,packs:null};return{need,packs:Math.max(1,Math.ceil(need*UNIT[ing.unit][1]/(v.pack.qty*UNIT[v.pack.unit][1])))}}
};
function normFa(s){return (s||'').trim().toLowerCase().replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/ـ/g,'').replace(/‌/g,' ').replace(/\s+/g,' ')}

/* ---------- persistence + change events ---------- */
const KEY='tahdig.v2.';
const load=(k,d)=>{try{const s=localStorage.getItem(KEY+k);return s?JSON.parse(s):d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}};
const listeners=new Set();
const emit=topic=>listeners.forEach(fn=>fn(topic));
const onChange=fn=>listeners.add(fn);

/* migrate the old prototype cart (keyed by numeric product id) */
(function migrate(){try{const old=localStorage.getItem('tahdig_cart');if(old&&!localStorage.getItem(KEY+'cart')){const o=JSON.parse(old),lines={};Object.entries(o).forEach(([id,q])=>{const p=products.find(x=>x.legacyId==id);if(p&&q>0)lines[p.defaultVariant.id]=q});save('cart',{lines,codes:[]})}}catch(e){}})();

/* ---------- Cart ---------- */
const cartState=load('cart',{lines:{},codes:[]});
const Cart={
  qty:vid=>cartState.lines[vid]||0,
  count:()=>Object.values(cartState.lines).reduce((a,b)=>a+b,0),
  add(vid,n=1){const e=variants.get(vid);if(!e||!e.variant.available)return false;cartState.lines[vid]=(cartState.lines[vid]||0)+n;commit();return true},
  set(vid,n){if(n<=0)delete cartState.lines[vid];else cartState.lines[vid]=n;commit()},
  remove(vid){delete cartState.lines[vid];commit()},
  clear(){cartState.lines={};cartState.codes=[];commit()},
  lines(){return Object.entries(cartState.lines).map(([vid,qty])=>{const e=variants.get(vid);return e?{id:vid,qty,variant:e.variant,product:e.product,total:e.variant.price*qty}:null}).filter(Boolean)},
  codes:()=>cartState.codes.slice(),
  applyCode(code){const c=normFa(code).toUpperCase().replace(/\s/g,'');if(!RAW.shop.discountCodes[c])return false;cartState.codes=[c];commit();return true},
  removeCode(c){cartState.codes=cartState.codes.filter(x=>x!==c);commit()},
  /* mirrors Shopify cart.cost: subtotal, discount allocations, shipping estimate */
  totals(){const lines=this.lines(),subtotal=lines.reduce((s,l)=>s+l.total,0);let discount=0;cartState.codes.forEach(c=>{const d=RAW.shop.discountCodes[c];if(d?.type==='percentage')discount+=subtotal*d.value});
    const after=subtotal-discount;
    /* shipping stays null (= calculated at checkout) until the business confirms its rules */
    const fee=RAW.shop.standardShippingFee,free=RAW.shop.freeShippingThreshold,known=fee!=null;
    const shipping=!known?null:(free!=null&&after>=free?0:fee);
    return{subtotal,discount,shipping,shippingKnown:known,total:after+(shipping||0),freeThreshold:free,freeRemaining:free!=null?Math.max(0,free-after):null,count:this.count()}}
};
function commit(){save('cart',cartState);emit('cart')}

/* ---------- Recurring list (خرید دوره‌ای) ----------
   A customer-owned, editable list of products delivered on a schedule.
   Deliberately separate from fixed bundles. */
const FREQS=[['2w','هر ۲ هفته',14],['1m','هر ماه',30],['2m','هر ۲ ماه',60]];
const recState=load('recurring',{items:{},frequency:'1m',status:'draft',skipNext:false,startedAt:null});
const Recurring={
  FREQS,
  state:()=>recState,
  qty:vid=>recState.items[vid]||0,
  items(){return Object.entries(recState.items).map(([vid,qty])=>{const e=variants.get(vid);return e?{id:vid,qty,variant:e.variant,product:e.product,total:e.variant.price*qty}:null}).filter(Boolean)},
  set(vid,n){if(n<=0)delete recState.items[vid];else recState.items[vid]=n;if(!Object.keys(recState.items).length&&recState.status==='draft')recState.skipNext=false;commitRec()},
  add(vid,n=1){this.set(vid,(recState.items[vid]||0)+n)},
  setFrequency(f){recState.frequency=f;commitRec()},
  activate(){if(!Object.keys(recState.items).length)return false;recState.status='active';recState.skipNext=false;recState.startedAt=recState.startedAt||new Date().toISOString();commitRec();return true},
  pause(){recState.status='paused';commitRec()},
  resume(){recState.status='active';commitRec()},
  cancel(){recState.status='cancelled';recState.skipNext=false;commitRec()},
  toggleSkip(){if(recState.status!=='active')return;recState.skipNext=!recState.skipNext;commitRec()},
  estimate(){const items=this.items(),subtotal=items.reduce((s,l)=>s+l.total,0);return{subtotal,count:items.reduce((s,l)=>s+l.qty,0)}},
  nextDelivery(){const f=FREQS.find(x=>x[0]===recState.frequency)||FREQS[1],d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+(recState.status==='draft'?7:f[2]*(recState.skipNext?2:1)));return d}
};
function commitRec(){save('recurring',recState);emit('recurring')}

/* ---------- Customer (guest prototype) ---------- */
const custState=load('customer',{address:{name:'',contact:'',street:'',postal:'',city:''},orders:[],favorites:[],notify:{}});
custState.notify=custState.notify||{};
const Customer={
  address:()=>({...custState.address}),
  saveAddress(a){custState.address={...a};save('customer',custState);emit('customer')},
  hasAddress(){const a=custState.address;return !!(a.name&&a.street&&a.postal&&a.city)},
  orders:()=>custState.orders.slice().reverse(),
  isFav:h=>custState.favorites.includes(h),
  toggleFav(h){const i=custState.favorites.indexOf(h);i<0?custState.favorites.push(h):custState.favorites.splice(i,1);save('customer',custState);emit('favorites');return i<0},
  favorites:()=>custState.favorites.map(h=>byHandle.get(h)).filter(Boolean),
  /* back-in-stock request for a variant; stored locally in the prototype */
  notifyEmail:vid=>custState.notify[vid]||'',
  requestNotify(vid,email){custState.notify[vid]=email;save('customer',custState);emit('notify')},
  /* prototype only: Shopify creates the order after checkout */
  placeOrder(meta){const t=Cart.totals(),o={id:'TD-'+Math.floor(100000+Math.random()*900000),lines:Cart.lines().map(l=>({title:l.product.title,variant:l.variant.title,qty:l.qty,total:l.total})),total:t.total,placedAt:new Date().toISOString(),status:'در حال آماده‌سازی',...meta};custState.orders.push(o);save('customer',custState);Cart.clear();emit('customer');return o}
};

window.Tahdig={Catalog,Cart,Recurring,Customer,onChange,normFa};
})();
