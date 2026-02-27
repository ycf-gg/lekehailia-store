/* ================================================
   I18N — Arabic (default) / English
   Prices in Algerian Dinar (DZD / دج)
   ================================================ */

const I18n = (() => {
    const STORAGE_KEY = 'natural_store_lang';
    let _currentLang = localStorage.getItem(STORAGE_KEY) || 'ar';

    const translations = {
        'site.name': {
            ar: 'الكحايلية',
            en: "El Kahailia"
        },
        'site.tagline': { ar: '١٠٠٪ طبيعي وعضوي', en: '100% Natural & Organic' },

        // NAV
        'nav.home': { ar: 'الرئيسية', en: 'Home' },
        'nav.categories': { ar: 'الأقسام', en: 'Categories' },
        'nav.cart': { ar: 'السلة', en: 'Cart' },
        'nav.orders': { ar: 'طلباتي', en: 'My Orders' },
        'nav.more': { ar: 'المزيد', en: 'More' },
        'nav.admin': { ar: 'التحكم', en: 'Admin' },

        // HERO
        'hero.badge': { ar: '🌿 ١٠٠٪ منتجات طبيعية', en: '🌿 100% Natural Products' },
        'hero.title': { ar: 'اكتشف محل \nالكحايلية', en: 'Discover El Kahailia' },
        'hero.desc': { ar: 'أعشاب فاخرة، عسل طبيعي، خلطات صحية ومنتجات العناية — كلها من أجود ما تقدمه الطبيعة.', en: 'Premium herbs, raw honey, wellness blends — all sourced from nature\'s finest.' },
        'hero.shop': { ar: 'تسوق الآن', en: 'Shop Now' },

        // SECTIONS
        'sections.categories': { ar: 'تصفح الأقسام', en: 'Browse Categories' },
        'sections.featured': { ar: 'الأكثر مبيعاً', en: 'Best Sellers' },
        'sections.all': { ar: 'عرض الكل', en: 'View All' },
        'sections.why': { ar: 'لماذا نحن؟', en: 'Why Us?' },
        'sections.allcats': { ar: 'جميع الأقسام', en: 'All Categories' },

        // FEATURES
        'feature.natural': { ar: 'طبيعي ١٠٠٪', en: '100% Natural' },
        'feature.natural.text': { ar: 'جميع المنتجات من مصادر طبيعية موثوقة', en: 'All products from trusted natural sources' },
        'feature.tested': { ar: 'مختبر معملياً', en: 'Lab Tested' },
        'feature.tested.text': { ar: 'كل دفعة مختبرة للنقاء والسلامة', en: 'Every batch tested for purity and safety' },
        'feature.delivery': { ar: 'توصيل سريع', en: 'Fast Delivery' },
        'feature.delivery.text': { ar: 'توصيل لجميع ولايات الجزائر', en: 'Delivery to all Algerian wilayas' },
        'feature.eco': { ar: 'صديق للبيئة', en: 'Eco-Friendly' },
        'feature.eco.text': { ar: 'تغليف مستدام وصديق للبيئة', en: 'Sustainable and eco-friendly packaging' },

        // CATEGORIES
        'cat.herbs-spices': { ar: 'أعشاب وبهارات', en: 'Herbs & Spices' },
        'cat.herbs-spices.desc': { ar: 'أعشاب عضوية فاخرة وبهارات عطرية', en: 'Premium organic herbs and aromatic spices' },
        'cat.honey': { ar: 'منتجات العسل', en: 'Honey Products' },
        'cat.honey.desc': { ar: 'عسل طبيعي خام ومنتجات النحل', en: 'Raw honey and bee-derived products' },
        'cat.weight-gain': { ar: 'خلطات التسمين', en: 'Weight Gain' },
        'cat.weight-gain.desc': { ar: 'خلطات طبيعية لزيادة وزن صحية', en: 'Natural blends for healthy weight gain' },
        'cat.detox': { ar: 'ديتوكس وتنقية', en: 'Detox & Cleanse' },
        'cat.detox.desc': { ar: 'أعشاب ومشروبات للتنقية والتطهير', en: 'Herbal cleanses and detox teas' },
        'cat.hair-skin': { ar: 'عناية بالشعر والبشرة', en: 'Hair & Skin' },
        'cat.hair-skin.desc': { ar: 'زيوت وزبدة ومستخلصات طبيعية', en: 'Natural oils, butters and extracts' },
        'cat.wellness': { ar: 'العافية والعلاج', en: 'Wellness' },
        'cat.wellness.desc': { ar: 'علاجات عشبية ومكملات طبيعية', en: 'Herbal remedies and supplements' },

        // PRODUCTS
        'product.add': { ar: 'أضف للسلة', en: 'Add to Cart' },
        'product.added': { ar: 'تمت الإضافة للسلة!', en: 'Added to cart!' },
        'product.removed': { ar: 'تمت الإزالة من السلة', en: 'Removed from cart' },
        'product.desc': { ar: 'وصف المنتج', en: 'Product Description' },
        'product.qty': { ar: 'الكمية', en: 'Quantity' },
        'products': { ar: 'منتجات', en: 'products' },
        'product.all': { ar: 'الكل', en: 'All' },
        'sort.default': { ar: 'الافتراضي', en: 'Default' },
        'sort.price.asc': { ar: 'الأقل سعراً', en: 'Price: Low-High' },
        'sort.price.desc': { ar: 'الأعلى سعراً', en: 'Price: High-Low' },
        'currency': { ar: 'دج', en: 'DZD' },

        // CART
        'cart.title': { ar: 'سلة التسوق', en: 'Shopping Cart' },
        'cart.empty': { ar: 'سلتك فارغة', en: 'Your cart is empty' },
        'cart.empty.text': { ar: 'لم تضف أي منتج بعد. ابدأ التسوق الآن!', en: "You haven't added anything yet!" },
        'cart.start': { ar: 'ابدأ التسوق', en: 'Start Shopping' },
        'cart.total': { ar: 'الإجمالي', en: 'Total' },
        'cart.checkout': { ar: 'إتمام الشراء', en: 'Checkout' },
        'cart.items': { ar: 'المنتجات', en: 'Items' },
        'cart.shipping': { ar: 'التوصيل', en: 'Shipping' },
        'cart.free': { ar: '500 دج', en: '500 DZD' },

        // ORDERS
        'orders.title': { ar: 'طلباتي', en: 'My Orders' },
        'orders.empty': { ar: 'لا توجد طلبات بعد', en: 'No orders yet' },
        'orders.empty.text': { ar: 'ستظهر طلباتك هنا بعد إتمام أول عملية شراء', en: 'Your orders will appear here after your first purchase' },
        'orders.pending': { ar: 'قيد الانتظار', en: 'Pending' },
        'orders.confirmed': { ar: 'تم التأكيد', en: 'Confirmed' },
        'orders.items': { ar: 'عناصر', en: 'items' },

        // CHECKOUT
        'checkout.title': { ar: 'إتمام الطلب', en: 'Checkout' },
        'checkout.details': { ar: 'بياناتك', en: 'Your Details' },
        'checkout.name': { ar: 'الاسم الكامل *', en: 'Full Name *' },
        'checkout.name.ph': { ar: 'أدخل اسمك الكامل', en: 'Enter your full name' },
        'checkout.name.err': { ar: 'الرجاء إدخال اسمك', en: 'Please enter your name' },
        'checkout.phone': { ar: 'رقم الهاتف *', en: 'Phone Number *' },
        'checkout.phone.ph': { ar: 'مثال: 0555 123 456', en: 'e.g. 0555 123 456' },
        'checkout.phone.err': { ar: 'الرجاء إدخال رقم هاتف صحيح', en: 'Please enter a valid phone number' },
        'checkout.wilaya': { ar: 'الولاية *', en: 'Wilaya *' },
        'checkout.wilaya.ph': { ar: 'اختر ولايتك', en: 'Select your wilaya' },
        'checkout.wilaya.err': { ar: 'الرجاء اختيار الولاية', en: 'Please select a wilaya' },
        'checkout.address': { ar: 'عنوان التوصيل *', en: 'Delivery Address *' },
        'checkout.address.ph': { ar: 'البلدية، الحي، الشارع', en: 'Commune, neighborhood, street' },
        'checkout.address.err': { ar: 'الرجاء إدخال عنوان التوصيل', en: 'Please enter your delivery address' },
        'checkout.notes': { ar: 'ملاحظات (اختياري)', en: 'Notes (optional)' },
        'checkout.notes.ph': { ar: 'أي طلبات خاصة', en: 'Any special requests' },
        'checkout.place': { ar: 'تأكيد الطلب', en: 'Confirm Order' },
        'checkout.summary': { ar: 'ملخص الطلب', en: 'Order Summary' },
        'checkout.subtotal': { ar: 'المجموع الفرعي', en: 'Subtotal' },
        'checkout.delivery': { ar: 'التوصيل', en: 'Delivery' },
        'checkout.delivery.price': { ar: 'سعر التوصيل', en: 'Delivery Price' },
        'checkout.grand.total': { ar: 'الإجمالي الكلي', en: 'Grand Total' },
        'checkout.success': { ar: 'تم تقديم الطلب بنجاح!', en: 'Order Placed Successfully!' },
        'checkout.thanks': { ar: 'شكراً لك', en: 'Thank you' },
        'checkout.received': { ar: 'تم استلام طلبك وسنتواصل معك قريباً.', en: 'Your order has been received.' },
        'checkout.orderid': { ar: 'رقم الطلب:', en: 'Order ID:' },
        'checkout.select.wilaya': { ar: 'اختر الولاية لمعرفة سعر التوصيل', en: 'Select wilaya to see delivery price' },

        // ADMIN
        'admin.title': { ar: 'لوحة التحكم', en: 'Admin Dashboard' },
        'admin.login': { ar: 'دخول لوحة التحكم', en: 'Admin Access' },
        'admin.login.ph': { ar: 'كلمة المرور', en: 'Password' },
        'admin.login.btn': { ar: 'دخول', en: 'Login' },
        'admin.login.err': { ar: 'كلمة مرور خاطئة', en: 'Incorrect password' },
        'admin.logout': { ar: 'خروج', en: 'Logout' },
        'admin.products': { ar: 'المنتجات', en: 'Products' },
        'admin.orders': { ar: 'الطلبات', en: 'Orders' },
        'admin.delivery': { ar: 'التوصيل', en: 'Delivery' },
        'admin.delivery.title': { ar: 'أسعار التوصيل', en: 'Delivery Prices' },
        'admin.delivery.subtitle': { ar: 'تعديل أسعار التوصيل لجميع الولايات (دج)', en: 'Edit delivery prices for all wilayas (DZD)' },
        'admin.delivery.saved': { ar: 'تم حفظ أسعار التوصيل!', en: 'Delivery prices saved!' },
        'admin.delivery.reset': { ar: 'إعادة الافتراضي', en: 'Reset Default' },
        'admin.delivery.save.all': { ar: 'حفظ الكل', en: 'Save All' },
        'admin.add': { ar: 'إضافة منتج', en: 'Add Product' },
        'admin.save': { ar: 'حفظ', en: 'Save' },
        'admin.delete': { ar: 'حذف', en: 'Delete' },
        'admin.updated': { ar: 'تم التحديث!', en: 'Updated!' },
        'admin.deleted': { ar: 'تم الحذف', en: 'Deleted' },
        'admin.added': { ar: 'تمت الإضافة!', en: 'Added!' },
        'admin.total.products': { ar: 'المنتجات', en: 'Products' },
        'admin.total.cats': { ar: 'الأقسام', en: 'Categories' },
        'admin.total.orders': { ar: 'الطلبات', en: 'Orders' },
        'admin.revenue': { ar: 'الإيرادات', en: 'Revenue' },
        'admin.no.orders': { ar: 'لا توجد طلبات', en: 'No orders' },
        'admin.delete.confirm': { ar: 'هل تريد حذف هذا المنتج؟', en: 'Delete this product?' },
        'admin.images': { ar: 'صور المنتج', en: 'Product Images' },
        'admin.images.upload': { ar: 'رفع صورة', en: 'Upload Image' },
        'admin.images.add': { ar: 'إضافة صورة', en: 'Add Photo' },
        'admin.images.camera': { ar: 'التقاط بالكاميرا', en: 'Take Photo' },
        'admin.images.gallery': { ar: 'اختيار من المعرض', en: 'Choose from Gallery' },
        'admin.images.max': { ar: 'الحد الأقصى 4 صور', en: 'Max 4 images' },
        'admin.images.full': { ar: 'لا يمكن إضافة أكثر من 4 صور', en: 'Maximum 4 images reached' },
        'admin.images.uploading': { ar: 'جاري الرفع...', en: 'Uploading...' },
        'admin.images.uploaded': { ar: 'تم رفع الصورة!', en: 'Image uploaded!' },
        'admin.images.removed': { ar: 'تم حذف الصورة', en: 'Image removed' },
        'admin.images.error': { ar: 'حدث خطأ أثناء رفع الصورة', en: 'Error uploading image' },

        // FOOTER
        'footer.desc': { ar: 'مصدرك الموثوق للمنتجات الطبيعية الفاخرة في الجزائر.', en: 'Your trusted source for premium natural products in Algeria.' },
        'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },

        // SEARCH
        'search.ph': { ar: 'ابحث عن منتج...', en: 'Search products...' },
        'search.no.results': { ar: 'لا توجد نتائج', en: 'No results found' },

        // MISC
        'back': { ar: 'رجوع', en: 'Back' },
        'loading': { ar: 'جاري التحميل...', en: 'Loading...' },
    };

    // Product name translations
    const productNames = {
        'hs-001': { ar: 'مسحوق الكركم الذهبي', en: 'Golden Turmeric Powder' },
        'hs-002': { ar: 'خيوط الزعفران الكشميري', en: 'Kashmir Saffron Threads' },
        'hs-003': { ar: 'كمون عضوي مطحون', en: 'Organic Ground Cumin' },
        'hs-004': { ar: 'جذور الزنجبيل المجفف', en: 'Dried Ginger Root' },
        'hs-005': { ar: 'أعواد القرفة السيلانية', en: 'Ceylon Cinnamon Sticks' },
        'hp-001': { ar: 'عسل الجبل الطبيعي', en: 'Raw Mountain Honey' },
        'hp-002': { ar: 'عسل المانوكا UMF 15+', en: 'Manuka Honey UMF 15+' },
        'hp-003': { ar: 'كبسولات غذاء الملكات', en: 'Royal Jelly Capsules' },
        'hp-004': { ar: 'صبغة البروبوليس', en: 'Propolis Tincture' },
        'hp-005': { ar: 'شمع العسل الطبيعي', en: 'Honeycomb Slab' },
        'wg-001': { ar: 'خلطة التمر والمكسرات', en: 'Date & Nut Energy Mix' },
        'wg-002': { ar: 'خلطة الحلبة للتسمين', en: 'Fenugreek Powder Blend' },
        'wg-003': { ar: 'خلطة البذور البروتينية', en: 'Protein Seed Mix' },
        'wg-004': { ar: 'أشواغاندا لزيادة الوزن', en: 'Ashwagandha Mass Gainer' },
        'dx-001': { ar: 'شاي الديتوكس الأخضر', en: 'Green Detox Tea Blend' },
        'dx-002': { ar: 'كبسولات الفحم النشط', en: 'Activated Charcoal Capsules' },
        'dx-003': { ar: 'خلطة تنقية الكبد', en: 'Liver Cleanse Herbal Mix' },
        'dx-004': { ar: 'ألياف قشر السيليوم', en: 'Psyllium Husk Fiber' },
        'hc-001': { ar: 'زيت الأرغان المغربي', en: 'Pure Argan Oil' },
        'hc-002': { ar: 'زيت الحبة السوداء', en: 'Black Seed Oil' },
        'hc-003': { ar: 'زيت إكليل الجبل', en: 'Rosemary Essential Oil' },
        'hc-004': { ar: 'جل الصبار العضوي', en: 'Aloe Vera Gel (Organic)' },
        'hc-005': { ar: 'زبدة الشيا الخام', en: 'Raw Shea Butter' },
        'wl-001': { ar: 'كبسولات زيت حبة البركة', en: 'Black Seed Oil Capsules' },
        'wl-002': { ar: 'شاي تقوية المناعة', en: 'Immune Booster Tea' },
        'wl-003': { ar: 'بابونج مهدئ للنوم', en: 'Chamomile Sleep Aid' },
        'wl-004': { ar: 'مسحوق المورينجا', en: 'Moringa Leaf Powder' },
        'wl-005': { ar: 'شراب الخمان الأسود', en: 'Elderberry Syrup' },
    };

    const productDescs = {
        'hs-001': { ar: 'كركم عضوي فاخر غني بالكركمين. مضاد للالتهابات وسوبر فود طبيعي.', en: 'Premium organic turmeric with high curcumin content.' },
        'hs-002': { ar: 'خيوط زعفران نقية مقطوفة يدوياً. رائحة غنية ولون زاهي.', en: 'Hand-picked pure saffron threads. Rich aroma.' },
        'hs-003': { ar: 'كمون مطحون طازج بنكهة دافئة وترابية. أساسي في الطبخ.', en: 'Freshly ground cumin with warm, earthy flavor.' },
        'hs-004': { ar: 'جذور زنجبيل مجففة بالشمس، مثالية للشاي والعلاجات.', en: 'Sun-dried ginger root, perfect for teas.' },
        'hs-005': { ar: 'أعواد قرفة سيلانية حقيقية بنكهة حلوة ورائحة عطرة.', en: 'True Ceylon cinnamon with sweet, delicate flavor.' },
        'hp-001': { ar: 'عسل خام غير معالج من أزهار الجبال. غني بالإنزيمات ومضادات الأكسدة.', en: 'Unprocessed raw honey from mountain wildflowers.' },
        'hp-002': { ar: 'عسل مانوكا نيوزيلندي أصلي معتمد بخصائص مضادة للبكتيريا.', en: 'Authentic NZ Manuka honey with UMF 15+.' },
        'hp-003': { ar: 'مكملات غذاء ملكات النحل للطاقة والمناعة وصحة البشرة.', en: 'Royal jelly supplements for energy and immunity.' },
        'hp-004': { ar: 'مستخلص العكبر الطبيعي. معزز قوي للمناعة ومهدئ للحلق.', en: 'Natural propolis extract. Immune booster.' },
        'hp-005': { ar: 'شمع عسل طبيعي مباشرة من الخلية. عسل محكم الإغلاق بالشمع.', en: 'Natural honeycomb straight from the hive.' },
        'wg-001': { ar: 'خلطة غنية بالسعرات من التمر واللوز والكاجو والعسل لزيادة وزن صحية.', en: 'Calorie-dense blend of dates, almonds, cashews.' },
        'wg-002': { ar: 'خلطة تقليدية بالحلبة لتحفيز الشهية ودعم نمو العضلات.', en: 'Fenugreek blend to stimulate appetite.' },
        'wg-003': { ar: 'بذور اليقطين وعباد الشمس والقنب مجتمعة لبروتين نباتي.', en: 'Pumpkin, sunflower and hemp seeds combined.' },
        'wg-004': { ar: 'مسحوق جذور الأشواغاندا مع الماكا لبناء كتلة طبيعية.', en: 'Ashwagandha root with maca for natural mass.' },
        'dx-001': { ar: 'شاي أخضر عضوي بالهندباء والحرشف والليمون. دعم يومي للكبد.', en: 'Organic green tea with dandelion and lemon.' },
        'dx-002': { ar: 'فحم نشط غذائي للتنقية الهضمية وإزالة السموم.', en: 'Food-grade activated charcoal for detox.' },
        'dx-003': { ar: 'خلطة خرشوف وكركم وأرقطيون لتنقية الكبد بلطف.', en: 'Artichoke, turmeric and burdock blend.' },
        'dx-004': { ar: 'ألياف قابلة للذوبان لتنظيف القولون وانتظام الهضم.', en: 'Natural soluble fiber for colon cleansing.' },
        'hc-001': { ar: 'زيت أرغان مغربي معصور على البارد لترطيب عميق للشعر والبشرة.', en: 'Cold-pressed Moroccan argan oil for hair and skin.' },
        'hc-002': { ar: 'زيت حبة البركة لنمو الشعر والتحكم بحب الشباب وتجديد البشرة.', en: 'Nigella sativa oil for hair growth and skin.' },
        'hc-003': { ar: 'يحفز نمو الشعر والدورة الدموية في فروة الرأس. زيت عطري نقي ١٠٠٪.', en: 'Stimulates hair growth. 100% pure essential oil.' },
        'hc-004': { ar: 'جل صبار عضوي نقي لتهدئة البشرة والترطيب والعناية بالشعر.', en: 'Pure organic aloe vera gel for skin and hair.' },
        'hc-005': { ar: 'زبدة شيا غرب أفريقية غير مكررة. مرطب غني للبشرة والشعر.', en: 'Unrefined West African shea butter.' },
        'wl-001': { ar: 'كبسولات زيت حبة البركة لدعم المناعة والعافية العامة.', en: 'Black seed oil softgels for immune support.' },
        'wl-002': { ar: 'خلطة شاي إشنسا والبلسان والزنجبيل لدفاع مناعي يومي.', en: 'Echinacea, elderberry and ginger tea blend.' },
        'wl-003': { ar: 'خلطة بابونج ولافندر المهدئة لنوم أفضل واسترخاء.', en: 'Chamomile and lavender for better sleep.' },
        'wl-004': { ar: 'مسحوق المورينجا الغني بالمغذيات للطاقة والحيوية.', en: 'Nutrient-dense moringa for energy and vitality.' },
        'wl-005': { ar: 'شراب الخمان المركز بالعسل للوقاية من نزلات البرد والإنفلونزا.', en: 'Elderberry syrup with honey for cold prevention.' },
    };

    function t(key) {
        const entry = translations[key];
        if (!entry) return key;
        return entry[_currentLang] || entry['en'] || key;
    }

    function productName(id) {
        const entry = productNames[id];
        if (!entry) return id;
        return entry[_currentLang] || entry['en'] || id;
    }

    function productDesc(id) {
        const entry = productDescs[id];
        if (!entry) return '';
        return entry[_currentLang] || entry['en'] || '';
    }

    function formatPrice(price) {
        return _currentLang === 'ar' ?
            `${price.toLocaleString('ar-DZ')} دج` :
            `${price.toLocaleString()} DZD`;
    }

    function lang() { return _currentLang; }

    function isRTL() { return _currentLang === 'ar'; }

    function setLang(langCode) {
        _currentLang = langCode;
        localStorage.setItem(STORAGE_KEY, langCode);
        document.documentElement.lang = langCode;
        document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
        // Update page title dynamically
        const siteName = t('site.name');
        if (document.title.includes('—')) {
            const parts = document.title.split('—');
            document.title = parts[0].trim() + ' — ' + siteName;
        } else {
            document.title = siteName;
        }
        window.dispatchEvent(new CustomEvent('lang-changed'));
    }

    function init() {
        document.documentElement.lang = _currentLang;
        document.documentElement.dir = _currentLang === 'ar' ? 'rtl' : 'ltr';
    }

    // Initialize immediately
    init();

    return { t, lang, isRTL, setLang, init, formatPrice, productName, productDesc };
})();