/* =====================================================================
   TAHDIG — MOCK CATALOG (prototype data only)
   Shaped like Shopify Storefront API responses (edges already flattened)
   so the adapter in commerce.js can later be pointed at the real API
   without touching the UI. Everything here — products, prices, SKUs,
   specs, recipes, bundles — is placeholder data and must be replaced by
   Shopify products, collections, metafields and metaobjects.
   ===================================================================== */
(function(){
const EUR=a=>({amount:Number(a).toFixed(2),currencyCode:'EUR'});
const v=(id,sku,title,price,opts={})=>({id:'gid://shopify/ProductVariant/'+id,sku,title,price:EUR(price),compareAtPrice:opts.compareAt?EUR(opts.compareAt):null,availableForSale:opts.available!==false,selectedOptions:[{name:'وزن',value:title}],metafields:{pack:opts.pack||null}});
const DRY_STORAGE='در جای خشک و خنک، دور از نور مستقیم و رطوبت نگهداری شود. پس از بازکردن بسته، آن را کاملاً بسته نگه دارید.';

const collections=[
{handle:'rice',title:'برنج و غلات',description:'بهترین برنج‌های ایرانی و خارجی، انواع جو، آرد و بلغور با کیفیت عالی و دانه‌های سالم و طبیعی'},
{handle:'spice',title:'ادویه و چاشنی',description:'ادویه‌ها، سبزی‌های خشک و چاشنی‌های معطر برای طعم اصیل غذای ایرانی'},
{handle:'pickle',title:'ترشیجات',description:'ترشی‌ها و شورهای خانگی و محلی برای کنار هر سفره'},
{handle:'legume',title:'حبوبات',description:'حبوبات تمیز و درجه‌یک برای خورشت‌ها، آش‌ها و پلوها'},
{handle:'canned',title:'کنسرو و آماده',description:'کنسروها و مواد آماده برای آشپزی سریع‌تر، بدون کم کردن از کیفیت'},
{handle:'nuts',title:'خشکبار',description:'خشکبار و آجیل تازه و منتخب از بهترین باغ‌ها'}];
const allProductsDescription='مواد غذایی اصیل ایرانی، منتخب و باکیفیت؛ همه محصولات ته‌دیگ در یک‌جا';

const products=[
{id:'gid://shopify/Product/1',legacyResourceId:1,handle:'tarom-hashemi-rice',title:'برنج طارم هاشمی درجه یک',vendor:'ته‌دیگ اورجینال',productType:'rice',collections:['rice'],tags:['برنج','غلات','معطر','اورگانیک','ایرانی'],badge:'پرفروش',
 description:'از یک محصول غذایی با کیفیت بالا که با دقت برای راحتی روزمره انتخاب شده است، لذت ببرید. این محصول برای ارائه طعم عالی و تازگی قابل اعتماد انتخاب شده است.',
 options:[{name:'وزن',values:['۱ کیلوگرم','۵ کیلوگرم','۱۰ کیلوگرم']}],
 variants:[v(101,'GM1000-11','۱ کیلوگرم',5.9,{pack:{qty:1,unit:'kg'}}),v(102,'GM1000-21','۵ کیلوگرم',24.5,{pack:{qty:5,unit:'kg'}}),v(103,'GM1000-41','۱۰ کیلوگرم',45,{pack:{qty:10,unit:'kg'}})],
 defaultVariant:'gid://shopify/ProductVariant/103',recurring:true,
 metafields:{stockNote:'موجود در انبار فنلاند',specs:[['تاریخ تولید','مرداد ۱۴۰۵'],['وزن محصول','۱، ۵، ۱۰ کیلوگرم'],['تاریخ انقضاء','مرداد ۱۴۰۷'],['نوع بسته‌بندی','کیسه نخی'],['مناسب برای','چلو و پلوهای مجلسی']],storage:DRY_STORAGE,cooking:'برنج را چند مرتبه با آب سرد بشویید. در صورت تمایل، پیش از پخت در آب و نمک خیس کنید و سپس به روش کته یا آبکش بپزید. مقدار آب و زمان پخت با توجه به روش انتخابی متفاوت است.'},
 related:['saffron-sargol','polo-spice-mix','dried-ghormeh-herbs']},
{id:'gid://shopify/Product/2',legacyResourceId:2,handle:'saffron-sargol',title:'زعفران سرگل ممتاز',vendor:'مزرعه قائنات',productType:'spice',collections:['spice'],tags:['زعفران','ادویه','ایرانی'],badge:'جدید',
 variants:[v(201,'TD-2001','۱۰ گرم',22,{compareAt:26,pack:{qty:10,unit:'g'}})],recurring:true,
 metafields:{stockNote:'موجود در انبار فنلاند',specs:[['وزن محصول','۱۰ گرم']],storage:DRY_STORAGE},related:['tarom-hashemi-rice','olive-oil-extra-virgin']},
{id:'gid://shopify/Product/3',legacyResourceId:3,handle:'polo-spice-mix',title:'ادویه مخصوص پلویی',vendor:'ته‌دیگ اورجینال',productType:'spice',collections:['spice'],tags:['ادویه','چاشنی'],
 variants:[v(301,'TD-3001','۴۰۰ گرم',12,{pack:{qty:400,unit:'g'}})],recurring:true,
 metafields:{stockNote:'موجود در انبار فنلاند',specs:[['وزن محصول','۴۰۰ گرم']],storage:DRY_STORAGE},related:['tarom-hashemi-rice','dried-ghormeh-herbs']},
{id:'gid://shopify/Product/4',legacyResourceId:4,handle:'olive-oil-extra-virgin',title:'روغن زیتون فرابکر',vendor:'باغ زیتون',productType:'canned',collections:['canned'],tags:['روغن','زیتون'],
 variants:[v(401,'TD-4001','۵۰۰ میلی‌لیتر',14,{pack:{qty:500,unit:'ml'}})],recurring:true,
 metafields:{stockNote:'موجود در انبار فنلاند',specs:[['حجم','۵۰۰ میلی‌لیتر']]},related:['bulgarian-pickles','pistachio-akbari']},
{id:'gid://shopify/Product/5',legacyResourceId:5,handle:'red-kidney-beans',title:'لوبیا قرمز درجه یک',vendor:'ته‌دیگ اورجینال',productType:'legume',collections:['legume'],tags:['حبوبات','لوبیا'],
 variants:[v(501,'TD-5001','۹۰۰ گرم',8,{available:false,pack:{qty:900,unit:'g'}})],recurring:true,
 metafields:{specs:[['وزن محصول','۹۰۰ گرم']],storage:DRY_STORAGE},related:['polo-spice-mix','dried-ghormeh-herbs']},
{id:'gid://shopify/Product/6',legacyResourceId:6,handle:'dried-ghormeh-herbs',title:'سبزی خشک قورمه‌سبزی',vendor:'کوهستان',productType:'spice',collections:['spice'],tags:['سبزی خشک','قورمه‌سبزی'],badge:'پرفروش',
 variants:[v(601,'TD-6001','۲۰۰ گرم',9,{pack:{qty:200,unit:'g'}})],recurring:true,
 metafields:{stockNote:'موجود در انبار فنلاند',specs:[['وزن محصول','۲۰۰ گرم']],storage:DRY_STORAGE},related:['tarom-hashemi-rice','red-kidney-beans']},
{id:'gid://shopify/Product/7',legacyResourceId:7,handle:'bulgarian-pickles',title:'خیارشور بلغاری ممتاز',vendor:'باغ ترشی',productType:'pickle',collections:['pickle'],tags:['ترشی','خیارشور'],
 variants:[v(701,'TD-7001','۷۰۰ گرم',7,{compareAt:9,pack:{qty:700,unit:'g'}})],recurring:true,
 metafields:{stockNote:'موجود در انبار فنلاند',specs:[['وزن محصول','۷۰۰ گرم']]},related:['olive-oil-extra-virgin','pistachio-akbari']},
{id:'gid://shopify/Product/8',legacyResourceId:8,handle:'pistachio-akbari',title:'پسته اکبری درجه یک',vendor:'خشکبار رفسنجان',productType:'nuts',collections:['nuts'],tags:['خشکبار','پسته'],
 variants:[v(801,'TD-8001','۵۰۰ گرم',19,{pack:{qty:500,unit:'g'}})],recurring:true,
 metafields:{stockNote:'موجود در انبار فنلاند',specs:[['وزن محصول','۵۰۰ گرم']],storage:DRY_STORAGE},related:['olive-oil-extra-virgin','bulgarian-pickles']}];

/* Fixed bundles: in Shopify these are bundle products (Shopify Bundles /
   fixed components), sold as ONE cart line with their own price. They are
   not editable and are unrelated to the customer's recurring list. */
const bundles=[
{id:'gid://shopify/Product/901',handle:'ghormeh-sabzi-kit',title:'پکیج قورمه‌سبزی',description:'همه مواد لازم یک خورشت کامل برای ۴ نفر',variantId:'gid://shopify/ProductVariant/90101',price:EUR(26),components:[{handle:'polo-spice-mix',qty:1},{handle:'dried-ghormeh-herbs',qty:1},{handle:'red-kidney-beans',qty:1}]},
{id:'gid://shopify/Product/902',handle:'party-pack',title:'پکیج مهمانی',description:'برنج، زعفران و ادویه برای ۸ نفر',variantId:'gid://shopify/ProductVariant/90201',price:EUR(74),components:[{handle:'tarom-hashemi-rice',qty:1},{handle:'saffron-sargol',qty:1},{handle:'polo-spice-mix',qty:1}]},
{id:'gid://shopify/Product/903',handle:'persian-breakfast',title:'پکیج صبحانه ایرانی',description:'روغن و ترشی محلی',variantId:'gid://shopify/ProductVariant/90301',price:EUR(19),components:[{handle:'olive-oil-extra-virgin',qty:1},{handle:'bulgarian-pickles',qty:1}]}];

/* Recipes: Shopify metaobjects (type "recipe") that reference products. */
const recipes=[
{handle:'sabzi-polo-mahi',title:'سبزی‌پلو با ماهی',category:'برنجی',time:'۱ ساعت و ۳۰ دقیقه',difficulty:'آسان',servings:4,ingredients:[{handle:'tarom-hashemi-rice',qty:600,unit:'g'},{handle:'dried-ghormeh-herbs',qty:200,unit:'g'}],pantry:['نمک','روغن','زردچوبه'],steps:['برنج را خیس کرده و بشویید.','سبزی معطر را آماده کنید.','برنج و سبزی را لایه‌ای دم کنید.','ماهی را جداگانه آماده و سرو کنید.']},
{handle:'ghormeh-sabzi',title:'خورشت قورمه‌سبزی',category:'خورشت‌ها',time:'۲ ساعت',difficulty:'متوسط',servings:4,ingredients:[{handle:'dried-ghormeh-herbs',qty:200,unit:'g'},{handle:'red-kidney-beans',qty:450,unit:'g'},{handle:'polo-spice-mix',qty:120,unit:'g'}],pantry:['نمک','فلفل','روغن','لیمو عمانی'],steps:['سبزی‌ها را با روغن تفت دهید تا معطر شوند.','گوشت را اضافه کرده و کمی تفت دهید.','لوبیا و آب را اضافه کنید و بپزید.','لیمو عمانی را اضافه و روی حرارت ملایم دم کنید.']},
{handle:'gheimeh',title:'خورشت قیمه',category:'خورشت‌ها',time:'۱ ساعت و ۴۵ دقیقه',difficulty:'آسان',servings:4,ingredients:[{handle:'red-kidney-beans',qty:400,unit:'g'},{handle:'polo-spice-mix',qty:80,unit:'g'}],pantry:['پیاز','روغن','آب لیمو'],steps:['پیاز را تفت دهید.','مواد خورشت را اضافه کنید.','با آب بپزید تا نرم شود.','با سیب‌زمینی سرخ‌شده سرو کنید.']},
{handle:'zereshk-polo',title:'زرشک‌پلو',category:'برنجی',time:'۱ ساعت',difficulty:'آسان',servings:4,ingredients:[{handle:'tarom-hashemi-rice',qty:600,unit:'g'},{handle:'saffron-sargol',qty:5,unit:'g'}],pantry:['کره','شکر'],steps:['برنج را دم کنید.','زرشک را تفت دهید.','زعفران دم‌کرده را اضافه کنید.','با مرغ سرو کنید.']},
{handle:'adas-polo',title:'عدس‌پلو',category:'برنجی',time:'۵۰ دقیقه',difficulty:'آسان',servings:4,ingredients:[{handle:'tarom-hashemi-rice',qty:500,unit:'g'},{handle:'red-kidney-beans',qty:300,unit:'g'}],pantry:['خرما','پیاز داغ','دارچین'],steps:['عدس را نیم‌پز کنید.','برنج و عدس را دم کنید.','با خرما و پیاز داغ سرو کنید.']}];
/* Pantry items that can also be bought from the store */
const pantryMatches={'روغن':'olive-oil-extra-virgin'};

/* Online Store pages. Only "payment" has approved copy; the others keep a
   neutral placeholder until the real policy text is supplied. */
const pages={
payment:{title:'روش‌های پرداخت',updated:'۱۵ اوت ۲۰۲۶',intro:'روش‌های پرداخت فعال از ابتدای فرایند سفارش و پیش از تأیید نهایی نمایش داده می‌شوند. فقط روشی را انتخاب کن که برایت مناسب است.',sections:[
 {title:'روش‌های فعال',logos:true},
 {title:'مبلغ قابل پرداخت',body:'قیمت محصولات به یورو و شامل مالیات قابل اعمال است. هزینه ارسال، تخفیف و مبلغ نهایی پیش از تأیید پرداخت در خلاصه سفارش نمایش داده می‌شوند. هزینه‌ای که پیش از سفارش اعلام و تأیید نشده باشد دریافت نمی‌شود.'},
 {title:'زمان برداشت یا رزرو مبلغ',body:'زمان برداشت وجه یا رزرو موقت مبلغ به روش انتخابی بستگی دارد و پیش از ثبت سفارش اعلام می‌شود. ارائه‌دهنده پرداخت ممکن است مطابق شرایط همان روش، مبلغ را موقتاً رزرو کند.'},
 {title:'پردازش پرداخت',body:'پرداخت از طریق ارائه‌دهنده‌ای انجام می‌شود که در فرایند سفارش معرفی شده است. شرایط آن ارائه‌دهنده، مسئولیت Kaveh Oy به‌عنوان فروشنده را از بین نمی‌برد.'},
 {title:'پرداخت ناموفق',body:'اگر پرداخت کامل نشد، وضعیت سفارش و پیام ارائه‌دهنده را بررسی کن و دوباره تلاش کن. اگر مبلغ کسر یا رزرو شد اما تأیید سفارش نگرفتی، ایمیل و «سفارش‌های من» را بررسی کن و سپس رسید و زمان تراکنش را به support@tahdig.fi بفرست.'},
 {title:'برداشت تکراری یا مبلغ نادرست',body:'شماره سفارش، روش پرداخت، مبلغ و مدرک تراکنش را برای پشتیبانی بفرست. موضوع با ارائه‌دهنده پرداخت بررسی و مطابق نتیجه و حقوق قانونی تو رسیدگی می‌شود.'},
 {title:'بازپرداخت',body:'بازپرداخت اصولاً با همان روش پرداخت اولیه انجام می‌شود، مگر اینکه روش دیگری صریحاً توافق شود. زمان نمایش وجه در حساب ممکن است به ارائه‌دهنده پرداخت و بانک بستگی داشته باشد. شرایط قانونی در صفحه «مرجوعی و بازپرداخت» آمده است.'}]},
support:{title:'پشتیبانی'},shipping:{title:'ارسال و تحویل'},returns:{title:'مرجوعی و بازپرداخت'},about:{title:'درباره ته‌دیگ'},contact:{title:'تماس با ما'},privacy:{title:'حریم خصوصی'},terms:{title:'شرایط و قوانین'}};

const shop={name:'ته‌دیگ',currencyCode:'EUR',locale:'fa',country:'FI',
 shippingText:'روش‌ها، هزینه و زمان تقریبی تحویل پس از واردکردن نشانی در مرحله پرداخت نمایش داده می‌شود. پس از ارسال، اطلاعات پیگیری سفارش در اختیارت قرار می‌گیرد.',
 /* In production these come from Shopify shipping profiles and discount rules */
 freeShippingThreshold:40,standardShippingFee:5,discountCodes:{TAHDIG10:{type:'percentage',value:.1}}};

window.TAHDIG_MOCK={shop,collections,allProductsDescription,products,bundles,recipes,pantryMatches,pages};
})();
