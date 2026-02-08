// Refined states and communes data
const statesList = [];
const communesData = {};
const deliveryData = {};

let stateInput, communeInput, communeGroup, qtyInput, delInput, sizeOpts, colorOpts, officeInput, officeGroup, backBtn, selectedSize = '';
let customStateInput, customCommuneInput, customCommuneGroup, customDelInput, customOfficeInput, customOfficeGroup, customQtyInput;
let selectedColor = '';
const CM_PER_PX = 0.185;
const DESIGN_SIZE_OFFSET_CM = 9;
// Max upload size for design files (10 MB)
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
// Allowed image MIME types for uploads
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
let selectedCustomColor = 'white';
let selectedCustomSide = 'front';
let productImages = [];
let product1Images = [];
const product2Images = ["images/prod2/image1.jpg", "images/prod2/image2.jpg"];
let productGalleryIndex = 0;
let detailGalleryIndex = 0;
let isBackBtnVisible = false;
let activeProductId = 'prod1';

// Accept Unicode letters (including Arabic) and spaces
const NAME_REGEX = /^[\p{L} ]+$/u;
const COUPON_REGEX = /^[A-Za-z]+$/;
const PHONE_REGEX = /^0\d{9}$/;

// Map of recently created/split wilayas to their parent wilaya
const parentWilayaMap = {
    "Aflou": "Laghouat",
    "Barika": "Batna",
    "Ksar Chellala": "Tiaret",
    "Messaad": "Djelfa",
    "Aïn Oussera": "M'Sila",
    "Boussaâda": "M'Sila",
    "El Abiodh Sidi Cheikh": "El Bayadh",
    "El Kantara": "Biskra",
    "Bir El Ater": "Tébessa",
    "Ksar El Boukhari": "Médéa",
    "El Aricha": "Tlemcen",
    "Timimoun": "Adrar",
    "Bordj Badji Mokhtar": "Adrar",
    "Ouled Djellal": "Biskra",
    "Béni Abbès": "Béchar",
    "Aïn Salah": "Tamanrasset",
    "Aïn Guezzam": "Tamanrasset",
    "Touggourt": "Ouargla",
    "Djanet": "Illizi",
    "El M'Ghair": "El Oued",
    "El Meniaa": "Ghardaïa"
};

function normalizeName(str) {
    if (!str) return '';
    return str.normalize ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : str.toLowerCase();
}

// Load data and initialize when DOM is ready
function initializeApp() {
    // Shuffle product cards inside each section (Anime/Automotive/Vibes/Custom)
    // shuffleSectionProducts removed to keep product ordering stable on reload
    // (previously: try { shuffleSectionProducts(); } catch (e) { /* ignore shuffle errors */ })
        // Ensure the page is scrolled to top on initial load/refresh
        try { window.scrollTo(0, 0); } catch (e) {}
        document.body.classList.add('show-greeting');

    // Also ensure when the page is shown via bfcache or navigation we reset scroll to top
    try {
        // Use a short timeout to override browsers that restore scroll position
        window.addEventListener('pageshow', function() {
            setTimeout(() => { try { window.scrollTo(0, 0); } catch (e) {} }, 50);
        });
        window.addEventListener('load', function() {
            setTimeout(() => { try { window.scrollTo(0, 0); } catch (e) {} }, 50);
        });
        // Also attempt to reset scroll just before unloading so reloads start at top
        window.addEventListener('beforeunload', function() {
            try { window.scrollTo(0, 0); } catch (e) {}
        });
    } catch (e) {}
    const greeting = document.querySelector('.site-greeting');
    if (greeting) {
        greeting.classList.add('visible');
    }

    // Initially hide back button (it's on the main page)
    const backBtn = document.getElementById('backHome');
    if (backBtn) {
        backBtn.style.display = 'none';
        isBackBtnVisible = false;
    }
    // Hide floating site logo on the home page by default
    const siteLogoBtn = document.getElementById('siteLogoBtn');
    if (siteLogoBtn) {
        siteLogoBtn.style.display = 'none';
        siteLogoBtn.style.opacity = '0';
        siteLogoBtn.style.pointerEvents = 'none';
    }

    stateInput = document.getElementById('state');
    communeInput = document.getElementById('commune');
    communeGroup = document.getElementById('communeGroup');
    qtyInput = document.getElementById('quantity');
    delInput = document.getElementById('deliveryType');
    // coupon input removed from UI
    officeInput = document.getElementById('office');
    officeGroup = document.getElementById('officeGroup');

    customStateInput = document.getElementById('customState');
    customCommuneInput = document.getElementById('customCommune');
    customCommuneGroup = document.getElementById('customCommuneGroup');
    customDelInput = document.getElementById('customDeliveryType');
    customOfficeInput = document.getElementById('customOffice');
    customOfficeGroup = document.getElementById('customOfficeGroup');
    customQtyInput = document.getElementById('customQuantity');
    // custom coupon input removed from UI
    sizeOpts = document.querySelectorAll('.size-option');
    colorOpts = document.querySelectorAll('.color-option');

    // Enforce maximum quantity of 5 for both normal and custom orders
    try {
        if (qtyInput) {
            qtyInput.max = 5;
            qtyInput.addEventListener('input', () => {
                let v = parseInt(qtyInput.value || '0', 10) || 0;
                if (v > 5) qtyInput.value = 5;
                if (v < 1) qtyInput.value = 1;
                calculate();
            });
        }
        if (customQtyInput) {
            customQtyInput.max = 5;
            customQtyInput.addEventListener('input', () => {
                let v = parseInt(customQtyInput.value || '0', 10) || 0;
                if (v > 5) customQtyInput.value = 5;
                if (v < 1) customQtyInput.value = 1;
                calculateCustom();
            });
        }
    } catch (e) { /* ignore */ }

    initStates();
    initCustomStates();
    try { setupEventListeners(); } catch (e) { console.error('setupEventListeners error', e); }
    try { initGallery(); } catch(e) { console.error('initGallery error', e); }
    try { initCustomizationDefaults(); } catch(e) { console.error('initCustomizationDefaults error', e); }
    calculate();
    calculateCustom();
    // Bind site logo button (refresh) if present
    try {
        const logoBtn = document.getElementById('siteLogoBtn');
        if (logoBtn) {
            logoBtn.addEventListener('click', (ev) => {
                ev.preventDefault();
                try { window.location.reload(); } catch (e) { window.location.href = window.location.href; }
            });
        }
    } catch (e) { console.warn('logo bind failed', e); }
}

// Shuffle product-card-section elements within each product-divider section.
function shuffleSectionProducts() {
    const container = document.querySelector('.cards-container');
    if (!container) return;

    // Gather all divider nodes
    const dividers = Array.from(container.querySelectorAll('.product-divider'));
    // If no dividers, nothing to do
    if (!dividers || dividers.length === 0) return;

    // For each divider, collect following siblings until the next divider
    dividers.forEach((divider, idx) => {
        const items = [];
        let sibling = divider.nextElementSibling;
        while (sibling && !sibling.classList.contains('product-divider')) {
            if (sibling.classList && sibling.classList.contains('product-card-section')) {
                items.push(sibling);
            }
            sibling = sibling.nextElementSibling;
        }

        if (items.length <= 1) return; // nothing to shuffle

        // Fisher-Yates shuffle
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = items[i];
            items[i] = items[j];
            items[j] = tmp;
        }

        // Re-insert shuffled items after the divider in the same container
        items.forEach(item => container.insertBefore(item, divider.nextElementSibling));
    });
}

function initGallery() {
    productImages = window.__productImages || [];
    product1Images = productImages;
    // Render gallery immediately with fallback images (if any) for faster perceived load
    setupGallery('productGalleryInner', 'productPrev', 'productNext', 'card');
    setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');

    // Load actual existing images for prod1 folder in background and refresh gallery when ready
    const prod1Folder = (PRODUCT_CONFIG.prod1 && PRODUCT_CONFIG.prod1.folder) ? PRODUCT_CONFIG.prod1.folder : 'prod1';
    loadImagesForFolder(prod1Folder, 4).then(imgs => {
        if (imgs && imgs.length > 0) {
            productImages = imgs;
            product1Images = imgs;
        } else if (!productImages || productImages.length === 0) {
            productImages = ['image.jpg'];
            product1Images = productImages;
        }
        // refresh galleries with discovered images
        setupGallery('productGalleryInner', 'productPrev', 'productNext', 'card');
        setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
    }).catch(err => {
        console.warn('Failed to load prod1 images', err);
        // ensure galleries still rendered
        setupGallery('productGalleryInner', 'productPrev', 'productNext', 'card');
        setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
    });
}

// Try to detect existing image files in a product folder by preloading common extensions.
function loadImagesForFolder(folder, maxCount = 4) {
    // Probe common raster types in parallel and return up to `maxCount` existing images.
    const exts = ['.jpg', '.jpeg', '.png'];
    const base = `images/${folder}`;

    return new Promise((resolve) => {
        const found = {};
        let pending = 0;
        const overallTimeout = 900; // ms - keep small for snappy UI
        const start = Date.now();

        function checkDone() {
            // Collect results in numeric order
            const keys = Object.keys(found).map(k => parseInt(k, 10)).sort((a,b) => a-b);
            const results = keys.map(i => found[i]).slice(0, maxCount);
            resolve(results);
        }

        for (let i = 1; i <= maxCount; i++) {
            for (const ext of exts) {
                const url = `${base}/image${i}${ext}`;
                pending++;
                const img = new Image();
                let finished = false;
                img.onload = function() {
                    if (finished) return;
                    finished = true;
                    // record the first successful ext for this index
                    if (!found[i]) found[i] = url;
                    pending--;
                    // If we've found images for all indexes or none pending, finish early
                    if (Object.keys(found).length >= maxCount || pending === 0) checkDone();
                };
                img.onerror = function() {
                    if (finished) return;
                    finished = true;
                    pending--;
                    if (pending === 0) checkDone();
                };
                // Start loading; use small cache-busting when debugging removed
                img.src = url;
            }
        }

        // Safety overall timeout to avoid long blocking probes
        setTimeout(() => {
            try { if (pending > 0) { /* ignore remaining errors, resolve with found */ } } catch(e) {}
            checkDone();
        }, overallTimeout);
    });
}

// Product configuration: display name and available colors (lowercase keys)
const PRODUCT_CONFIG = {
    prod1: { name: 'Eldian Empire Hoodie', colors: ['black'], folder: 'prod1', price: 3200, oldPrice: 4200 },
    prod2: { name: 'Rika Hoodie', colors: ['black'], folder: 'prod2', price: 3200, oldPrice: 4200 },
    prod3: { name: 'Shunsui Hoodie', colors: ['black'], folder: 'prod3', price: 3200, oldPrice: 4200 },
    prod4: { name: 'Rika Hoodie', colors: ['black'], folder: 'prod4', price: 3700, oldPrice: 4700 },
    prod5: { name: 'Shunsui Hoodie', colors: ['black'], folder: 'prod5', price: 3700, oldPrice: 4700 },
    prod6: { name: 'F40 Hoodie', colors: ['black'], folder: 'prod6', price: 3700, oldPrice: 4700 },
    prod7: { name: 'GT3RS Hoodie', colors: ['black'], folder: 'prod7', price: 3700, oldPrice: 4700 },
    prod8: { name: 'M2C Hoodie', colors: ['black'], folder: 'prod8', price: 3700, oldPrice: 4700 },
    prod9: { name: 'Corleone Hoodie', colors: ['black'], folder: 'prod9', price: 3700, oldPrice: 4700 },
    prod10: { name: 'Euphoria Hoodie', colors: ['black'], folder: 'prod10', price: 3700, oldPrice: 4700 },
    prod11: { name: 'Guts Tshirt Oversize', colors: ['black','white'], folder: 'prod11', price: 3200, oldPrice: 4200 },
    prod12: { name: 'Ichigo Tshirt Oversize', colors: ['black'], folder: 'prod12', price: 3200, oldPrice: 4200 },
    prod13: { name: 'Yuji Tshirt Oversize', colors: ['black','white'], folder: 'prod13', price: 3200, oldPrice: 4200 },
    prod14: { name: 'Prelude Tshirt Oversize', colors: ['black','white'], folder: 'prod14', price: 3200, oldPrice: 4200 },
    prod15: { name: 'AinoOri Tshirt Oversize', colors: ['black','white'], folder: 'prod15', price: 3200, oldPrice: 4200 }
};

function setOrderColorsForProduct(productId) {
    const orderColorOptions = document.querySelectorAll('#orderDetails .color-option');
    if (!orderColorOptions || orderColorOptions.length === 0) return;
    const cfg = PRODUCT_CONFIG[productId] || null;
    if (!cfg) {
        orderColorOptions.forEach(opt => opt.style.display = 'inline-block');
        return;
    }
    const allowed = cfg.colors || [];
    orderColorOptions.forEach(opt => {
        const val = (opt.dataset.value || opt.dataset.color || '').toLowerCase();
        const show = allowed.indexOf(val) !== -1;
        opt.style.display = show ? 'inline-block' : 'none';
        if (show && allowed.indexOf(val) === 0) {
            // default select first allowed color
            opt.classList.add('selected');
            selectedColor = val;
        } else {
            opt.classList.remove('selected');
        }
    });
}

function setActiveProduct(productId) {
    activeProductId = productId;
    const cfg = PRODUCT_CONFIG[productId] || null;
    // set the product name immediately
    const nameEl = document.getElementById('detailProductName');
    if (nameEl) {
        nameEl.textContent = (cfg && cfg.name) ? cfg.name : (productId === 'prod2' ? 'Eldian Empire Hoodie' : 'R6 Precision Hoodie');
    }

    // Update detail page price display (old/new) to match product config
    try {
        const detailOld = document.querySelector('#orderDetails .price-section .old-price');
        const detailNew = document.querySelector('#orderDetails .price-section .new-price');
        if (cfg) {
            if (detailOld && typeof cfg.oldPrice !== 'undefined') detailOld.textContent = cfg.oldPrice + ' دج';
            if (detailNew && typeof cfg.price !== 'undefined') detailNew.textContent = cfg.price + ' دج';
        } else {
            if (detailOld) detailOld.textContent = '';
            if (detailNew) detailNew.textContent = '';
        }
    } catch (e) { /* ignore DOM errors */ }

    // Immediately clear current gallery images and render a small transparent placeholder
    // while we asynchronously load the real images to avoid flashing the previous product image.
    productImages = [];
    productGalleryIndex = 0;
    detailGalleryIndex = 0;
    setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');

    // Load actual images for this product folder and update gallery when ready
    if (cfg && cfg.folder) {
        loadImagesForFolder(cfg.folder, 4).then(imgs => {
            if (imgs && imgs.length > 0) {
                productImages = imgs;
            } else if (productId === 'prod2') {
                productImages = product2Images;
            } else {
                productImages = product1Images && product1Images.length ? product1Images : (window.__productImages || []);
            }
            productGalleryIndex = 0;
            detailGalleryIndex = 0;
            setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
        }).catch(err => {
            console.warn('Failed to load images for', productId, err);
            if (productId === 'prod2') productImages = product2Images;
            else productImages = product1Images && product1Images.length ? product1Images : (window.__productImages || []);
            productGalleryIndex = 0;
            detailGalleryIndex = 0;
            setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
        });
    } else {
        if (productId === 'prod2') productImages = product2Images;
        else productImages = product1Images && product1Images.length ? product1Images : (window.__productImages || []);
        productGalleryIndex = 0;
        detailGalleryIndex = 0;
        setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
    }

    setOrderColorsForProduct(productId);
}

function setupGallery(innerId, prevId, nextId, which) {
    const inner = document.getElementById(innerId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!inner) return;

    if (!productImages || productImages.length === 0) {
        // show a tiny transparent placeholder instead of requesting a missing file
        inner.innerHTML = '';
        const placeholder = document.createElement('img');
        placeholder.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        inner.appendChild(placeholder);
        // No navigation when there are no images
        if (prevBtn) prevBtn.onclick = null;
        if (nextBtn) nextBtn.onclick = null;
        return;
    }

    const idx = (which === 'card') ? productGalleryIndex : detailGalleryIndex;
    inner.innerHTML = '';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = encodeURI(productImages[idx]);
    inner.appendChild(img);

    let isAnimating = false;

    function slide(dir) {
        if (isAnimating) return;
        isAnimating = true;
        
        const currentImg = inner.querySelector('img');
        const currentIndex = (which === 'card') ? productGalleryIndex : detailGalleryIndex;
        // guard against empty arrays (shouldn't happen here)
        if (!productImages || productImages.length === 0) { isAnimating = false; return; }
        let nextIndex = (currentIndex + dir + productImages.length) % productImages.length;

        const nextImg = document.createElement('img');
        nextImg.loading = 'lazy';
        nextImg.decoding = 'async';
        nextImg.src = encodeURI(productImages[nextIndex]);
        nextImg.style.transform = 'translateX(' + (dir > 0 ? '100%' : '-100%') + ')';
        inner.appendChild(nextImg);

        requestAnimationFrame(() => {
            if (currentImg) currentImg.style.transform = 'translateX(' + (dir > 0 ? '-100%' : '100%') + ')';
            nextImg.style.transform = 'translateX(0)';
        });

        const cleanup = () => {
            if (currentImg && currentImg.parentNode) inner.removeChild(currentImg);
            if (which === 'card') productGalleryIndex = nextIndex; else detailGalleryIndex = nextIndex;
            nextImg.removeEventListener('transitionend', cleanup);
            isAnimating = false;
        };
        nextImg.addEventListener('transitionend', cleanup);
    }

    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); slide(-1); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); slide(1); };
}

// Get communes for a wilaya (with parent fallback)
function getCommunesForWilaya(wilayaName) {
    if (!window.__dynamicData || !window.__dynamicData.communes) {
        return null;
    }
    
    // Try exact match first
    let communes = window.__dynamicData.communes[wilayaName];
    if (communes && communes.length > 0) {
        return communes;
    }
    
    // Try normalized match
    const normalized = normalizeName(wilayaName);
    for (const key in window.__dynamicData.communes) {
        if (normalizeName(key) === normalized) {
            communes = window.__dynamicData.communes[key];
            if (communes && communes.length > 0) {
                return communes;
            }
        }
    }
    
    // Try parent wilaya if this is a new split wilaya
    if (parentWilayaMap[wilayaName]) {
        const parentName = parentWilayaMap[wilayaName];
        console.log(`${wilayaName} is a new wilaya, using communes from parent: ${parentName}`);
        
        // Try exact parent match
        communes = window.__dynamicData.communes[parentName];
        if (communes && communes.length > 0) {
            return communes;
        }
        
        // Try normalized parent match
        const normalizedParent = normalizeName(parentName);
        for (const key in window.__dynamicData.communes) {
            if (normalizeName(key) === normalizedParent) {
                communes = window.__dynamicData.communes[key];
                if (communes && communes.length > 0) {
                    return communes;
                }
            }
        }
    }
    
    return null;
}

// Get delivery price for a wilaya (with parent fallback)
function getDeliveryForWilaya(wilayaName, deliveryType) {
    if (!window.__dynamicData || !window.__dynamicData.delivery) {
        return 800; // default
    }
    
    // Try exact match first
    let delivery = window.__dynamicData.delivery[wilayaName];
    if (delivery && delivery[deliveryType] !== undefined) {
        return delivery[deliveryType];
    }
    
    // Try normalized match
    const normalized = normalizeName(wilayaName);
    for (const key in window.__dynamicData.delivery) {
        if (normalizeName(key) === normalized) {
            delivery = window.__dynamicData.delivery[key];
            if (delivery && delivery[deliveryType] !== undefined) {
                return delivery[deliveryType];
            }
        }
    }
    
    // Try parent wilaya if this is a new split wilaya
    if (parentWilayaMap[wilayaName]) {
        const parentName = parentWilayaMap[wilayaName];
        console.log(`${wilayaName} delivery: using parent ${parentName}`);
        
        // Try exact parent match
        delivery = window.__dynamicData.delivery[parentName];
        if (delivery && delivery[deliveryType] !== undefined) {
            return delivery[deliveryType];
        }
        
        // Try normalized parent match
        const normalizedParent = normalizeName(parentName);
        for (const key in window.__dynamicData.delivery) {
            if (normalizeName(key) === normalizedParent) {
                delivery = window.__dynamicData.delivery[key];
                if (delivery && delivery[deliveryType] !== undefined) {
                    return delivery[deliveryType];
                }
            }
        }
    }
    
    return 800; // default fallback
}

// Function to show greeting only on main page
function showGreeting() {
    const greeting = document.querySelector('.site-greeting');
    if (greeting) {
        document.body.classList.add('show-greeting');
        greeting.classList.add('visible');
        greeting.classList.remove('fade-out');
        const gt = greeting.querySelector('.greet-text');
        if (gt) {
            gt.style.animation = 'none';
            gt.style.transform = '';
            gt.style.opacity = '';
            void gt.offsetWidth;
            gt.style.animation = 'greetIn 650ms cubic-bezier(.2,.9,.3,1) both';
        }
    }
}

// Function to hide greeting when leaving main page
function hideGreeting() {
    const greeting = document.querySelector('.site-greeting');
    if (greeting) {
        document.body.classList.remove('show-greeting');
        greeting.classList.remove('visible');
    }
}

// Function to show/hide back button
function setBackButtonVisible(visible) {
    const backBtn = document.getElementById('backHome');
    if (backBtn) {
        if (visible) {
            backBtn.style.display = 'flex';
            backBtn.style.opacity = '1';
            backBtn.style.pointerEvents = 'auto';
            isBackBtnVisible = true;
            // When entering a non-home page, ensure scroll is at top
            try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) {}
        } else {
            backBtn.style.display = 'none';
            backBtn.style.opacity = '0';
            backBtn.style.pointerEvents = 'none';
            isBackBtnVisible = false;
        }
    }

    // Also toggle the floating site logo: show it whenever back button is visible (non-home pages)
    try {
        const logo = document.getElementById('siteLogoBtn');
        if (logo) {
            if (visible) {
                logo.style.display = 'flex';
                logo.style.opacity = '1';
                logo.style.pointerEvents = 'auto';
            } else {
                logo.style.display = 'none';
                logo.style.opacity = '0';
                logo.style.pointerEvents = 'none';
            }
        }
    } catch (e) { /* ignore */ }
}

// Function to initialize default selections for customization
function initCustomizationDefaults() {
    // Set default side selection to 'front'
    const sideOptions = document.querySelectorAll('.side-option');
    sideOptions.forEach(opt => {
        if (opt.dataset.side === 'front') {
            opt.classList.add('selected');
        }
    });
    
    // Set default color selection to 'white'
    const customColorOptions = document.querySelectorAll('.custom-product-page .color-option');
    customColorOptions.forEach(opt => {
        if (opt.dataset.value === 'white') {
            opt.classList.add('selected');
        }
    });
}

function resetDesignEditorState() {
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const editPanel = document.getElementById('editPanel');
    const designFileInput = document.getElementById('designFileInput');
    const uploadedDesign = document.getElementById('uploadedDesign');
    const designLayer = document.getElementById('designLayer');
    const designSizeValue = document.getElementById('designSizeValue');

    if (editPanel) {
        editPanel.classList.add('hidden');
    }
    if (editBtn) {
        editBtn.style.display = 'inline-block';
    }
    if (saveBtn) {
        saveBtn.style.display = 'none';
    }
    if (designFileInput) {
        designFileInput.value = '';
    }
    if (uploadedDesign) {
        uploadedDesign.src = '';
    }
    if (designLayer) {
        designLayer.style.display = 'none';
        designLayer.classList.remove('locked', 'dragging');
        designLayer.style.transform = 'rotate(0deg)';
        designLayer.style.left = '0px';
        designLayer.style.top = '0px';
        designLayer.style.width = '0px';
        designLayer.style.height = '0px';
        delete designLayer.dataset.xPercent;
        delete designLayer.dataset.yPercent;
        delete designLayer.dataset.wPercent;
        delete designLayer.dataset.hPercent;
        delete designLayer.dataset.rotation;
    }
    if (designSizeValue) {
        designSizeValue.textContent = '0 × 0 cm';
    }
    calculateCustom();
}

// Convert a File object to a Base64 data URL (returns a Promise)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

// Show an English warning inside the edit panel when an uploaded file is too large.
function showUploadSizeWarning() {
    const editPanel = document.getElementById('editPanel');
    const message = 'File is too large. Maximum allowed size is 10 MB.';
    if (editPanel) {
        let container = editPanel.querySelector('.upload-size-warning');
        if (!container) {
            container = document.createElement('div');
            container.className = 'upload-size-warning';
            container.style.color = '#c23';
            container.style.marginTop = '10px';
            container.style.fontSize = '0.95em';
            const content = editPanel.querySelector('.edit-panel-content') || editPanel;
            content.appendChild(container);
        }
        container.textContent = message;
    } else {
        // Fallback to alert if edit panel not found
        try { alert(message); } catch (e) { console.warn(message); }
    }
}

// Safely set an image element from a file input and optionally store Base64 in a hidden input.
// Prevents re-triggering the file input change and leaves the original image if no file provided.
function setProductImageFromInput(fileInput, imgElement, hiddenBase64Input) {
    if (!imgElement) return;
    const file = fileInput && fileInput.files && fileInput.files[0];

    // Enforce max upload size (edit page requirement)
    if (file && file.size > MAX_UPLOAD_BYTES) {
        showUploadSizeWarning();
        if (fileInput) fileInput.value = '';
        return;
    }

    // Enforce allowed file types (only images)
    if (file && ALLOWED_IMAGE_TYPES.indexOf(file.type) === -1) {
        if (fileInput) fileInput.value = '';
        return;
    }

    if (file) {
        fileToBase64(file).then(dataUrl => {
            if (dataUrl) {
                try {
                    imgElement.src = dataUrl;
                } catch (e) {
                    console.error('Error setting image src', e);
                }
                if (hiddenBase64Input) hiddenBase64Input.value = dataUrl;
            }
        }).catch(err => console.error('fileToBase64 failed', err));
    } else {
        // No file selected: restore default if available (set by `data-default-src`), otherwise keep current
        const defaultSrc = imgElement.dataset && imgElement.dataset.defaultSrc;
        if (defaultSrc) imgElement.src = defaultSrc;
    }
}

// Auto-bind the design file input to preview and capture Base64 when DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    const designFileInput = document.getElementById('designFileInput');
    const uploadedDesign = document.getElementById('uploadedDesign');
    const hiddenBase64 = document.getElementById('designBase64'); // optional hidden input to store base64

    if (uploadedDesign && !uploadedDesign.dataset.defaultSrc) {
        uploadedDesign.dataset.defaultSrc = uploadedDesign.src || '';
    }

    if (designFileInput && uploadedDesign) {
        designFileInput.addEventListener('change', (e) => {
            setProductImageFromInput(designFileInput, uploadedDesign, hiddenBase64);
        });
    }
});

// Function to show customization page with selected image
function showCustomizationPage(imagePath) {
    const previewPage = document.getElementById('customizationPreviewPage');
    const previewImage = document.getElementById('previewImage');
    const customProductPage = document.getElementById('customProductPage');
    
    if (previewImage) {
        previewImage.src = imagePath;
    }
    // Adjust preview scale for specific custom products (Tshirt Oversize)
    try {
        const cd = JSON.parse(sessionStorage.getItem('customizationData') || '{}');
        const pname = (cd.productName || '').toLowerCase();
        const isTshirt = /tshirt|oversize/.test(pname);
        const scaleFactor = isTshirt ? 0.78 : 1.0; // SCALE := 78 -> 78%
        if (previewImage) previewImage.style.transform = `scale(${scaleFactor})`;
        const designLayer = document.getElementById('designLayer');
        if (designLayer) designLayer.style.transform = `scale(${scaleFactor})`;
    } catch (e) { /* ignore */ }
    
    // Hide the custom selection page
    if (customProductPage) {
        customProductPage.style.display = 'none';
        customProductPage.style.opacity = '0';
        customProductPage.style.pointerEvents = 'none';
    }
    
    // Reset design editor every time entering the preview
    resetDesignEditorState();

    // Show the preview page
    if (previewPage) {
        previewPage.style.display = 'flex';
        previewPage.style.pointerEvents = 'auto';
        setBackButtonVisible(true);
        setTimeout(() => {
            previewPage.style.opacity = '1';
        }, 10);
        previewPage.classList.add('show');
        // Hide color options and color boxes while in preview/edit mode
        try {
            const hideSelectors = ['.color-option', '.color-swatch', '.color-box'];
            const found = [];
            hideSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    // Only hide visible ones and mark them for restore
                    if (el.style.display !== 'none') {
                        el.dataset._hiddenByPreview = 'true';
                        el.style.display = 'none';
                        found.push(el);
                    }
                });
            });
            window._previewHiddenColorEls = found;
        } catch (e) { /* ignore */ }
        // Set preview price according to selected custom product (Regular Hoodie or Tshirt Oversize)
        try {
            const customNewPriceEl = document.querySelector('#customizationPreviewPage .new-price');
            const customFinalPriceEl = document.getElementById('customFinalPrice');
            let baseCustomPrice = 2800; // default fallback
            try {
                const cd = JSON.parse(sessionStorage.getItem('customizationData') || '{}');
                const pname = (cd.productName || '').toLowerCase();
                // Regular Hoodie specific price
                if (pname && /regular/.test(pname) && /hoodie/.test(pname)) {
                    baseCustomPrice = 2600;
                }
                // Tshirt / Oversize
                else if (pname && (/tshirt/.test(pname) || /oversize/.test(pname))) {
                    baseCustomPrice = 2400;
                }
                // Other hoodies (non-regular)
                else if (pname && /hoodie/.test(pname)) {
                    baseCustomPrice = 2800;
                }
            } catch (e) { /* ignore parse errors */ }
            if (customNewPriceEl) customNewPriceEl.textContent = baseCustomPrice + ' دج';
            if (customFinalPriceEl) customFinalPriceEl.textContent = baseCustomPrice;
            // Set the preview title to the selected product name
            try {
                const cd = JSON.parse(sessionStorage.getItem('customizationData') || '{}');
                const previewTitleEl = document.querySelector('#customizationPreviewPage .product-name-above-gallery');
                const pname = (cd.productName || '').trim();
                if (previewTitleEl) previewTitleEl.textContent = pname || 'صمم بنفسك';
            } catch (e) { /* ignore */ }
        } catch (e) { /* ignore */ }
    }
}

// Initialize design editor
function initDesignEditor() {
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const editPanel = document.getElementById('editPanel');
    const designFileInput = document.getElementById('designFileInput');
    const uploadedDesign = document.getElementById('uploadedDesign');
    const deleteDesignBtn = document.getElementById('deleteDesignBtn');
    const designLayer = document.getElementById('designLayer');
    const productImageWrapper = document.querySelector('.product-image-wrapper');
    const previewContainer = document.querySelector('.preview-container');
    const designSizeValue = document.getElementById('designSizeValue');
    
    let isEditMode = false;
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let offsetX = 0;
    let offsetY = 0;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startLeft = 0;
    let startTop = 0;
    let activeHandle = '';
    let currentRotation = 0;
    let startRotation = 0;
    let startAngle = 0;
    const updateDesignSizeDisplay = () => {
        if (!designLayer || !designSizeValue || designLayer.style.display === 'none') return;
        // On the edit page, reduce reported dimensions: width -6cm, height -9cm
        const rawW = Math.round(designLayer.offsetWidth * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM;
        const rawH = Math.round(designLayer.offsetHeight * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM;
        const wCm = Math.max(0, rawW - 6);
        const hCm = Math.max(0, rawH - 9);
        designSizeValue.textContent = `${wCm} × ${hCm} cm`;
        calculateCustom();
    };

    const getContainerSize = () => {
        if (!productImageWrapper) return { width: 0, height: 0 };
        return {
            width: productImageWrapper.clientWidth,
            height: productImageWrapper.clientHeight
        };
    };

    const clearDesignState = () => {
        if (!designLayer || !uploadedDesign) return;
        uploadedDesign.src = '';
        designLayer.style.display = 'none';
        designLayer.classList.remove('locked');
        designLayer.style.transform = 'rotate(0deg)';
        designLayer.style.left = '0px';
        designLayer.style.top = '0px';
        designLayer.style.width = '0px';
        designLayer.style.height = '0px';
        currentRotation = 0;
        delete designLayer.dataset.xPercent;
        delete designLayer.dataset.yPercent;
        delete designLayer.dataset.wPercent;
        delete designLayer.dataset.hPercent;
        delete designLayer.dataset.rotation;
        calculateCustom();
    };

    const storeDesignState = () => {
        if (!designLayer || designLayer.style.display === 'none') return;
        const { width: cw, height: ch } = getContainerSize();
        if (!cw || !ch) return;

        const left = designLayer.offsetLeft;
        const top = designLayer.offsetTop;
        const width = designLayer.offsetWidth;
        const height = designLayer.offsetHeight;

        designLayer.dataset.xPercent = (left / cw).toString();
        designLayer.dataset.yPercent = (top / ch).toString();
        designLayer.dataset.wPercent = (width / cw).toString();
        designLayer.dataset.hPercent = (height / ch).toString();
        designLayer.dataset.rotation = currentRotation.toString();
    };

    const applyDesignState = () => {
        if (!designLayer || designLayer.style.display === 'none') return;
        const { width: cw, height: ch } = getContainerSize();
        if (!cw || !ch) return;

        const xp = parseFloat(designLayer.dataset.xPercent || '0');
        const yp = parseFloat(designLayer.dataset.yPercent || '0');
        const wp = parseFloat(designLayer.dataset.wPercent || '0');
        const hp = parseFloat(designLayer.dataset.hPercent || '0');

        if (wp > 0 && hp > 0) {
            designLayer.style.left = Math.max(0, Math.min(cw - cw * wp, cw * xp)) + 'px';
            designLayer.style.top = Math.max(0, Math.min(ch - ch * hp, ch * yp)) + 'px';
            designLayer.style.width = Math.max(50, cw * wp) + 'px';
            designLayer.style.height = Math.max(50, ch * hp) + 'px';
            if (uploadedDesign) {
                uploadedDesign.style.width = '100%';
                uploadedDesign.style.height = '100%';
                uploadedDesign.style.objectFit = 'fill';
                uploadedDesign.style.maxWidth = 'none';
                uploadedDesign.style.maxHeight = 'none';
            }
        }

        const rot = parseFloat(designLayer.dataset.rotation || '0');
        if (!Number.isNaN(rot)) {
            currentRotation = rot;
            designLayer.style.transform = `rotate(${currentRotation}deg)`;
        }
    };

    const loadImage = (src) => new Promise((resolve, reject) => {
        if (!src) return reject(new Error('Missing image source'));
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    const trimTransparentCanvas = (sourceCanvas) => {
        const ctx = sourceCanvas.getContext('2d');
        if (!ctx) return sourceCanvas;
        const { width, height } = sourceCanvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        let minX = width;
        let minY = height;
        let maxX = -1;
        let maxY = -1;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4 + 3;
                if (data[idx] !== 0) {
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX === -1 || maxY === -1) {
            return sourceCanvas;
        }

        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;
        const trimmedCanvas = document.createElement('canvas');
        trimmedCanvas.width = cropWidth;
        trimmedCanvas.height = cropHeight;
        const trimmedCtx = trimmedCanvas.getContext('2d');
        if (!trimmedCtx) return sourceCanvas;
        trimmedCtx.drawImage(sourceCanvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        return trimmedCanvas;
    };

    const renderCompositePNG = async () => {
        if (!productImageWrapper) return null;
        const previewImage = document.getElementById('previewImage');
        if (!previewImage || !previewImage.src) return null;

        const wrapperRect = productImageWrapper.getBoundingClientRect();
        if (!wrapperRect.width || !wrapperRect.height) return null;

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(wrapperRect.width);
        canvas.height = Math.round(wrapperRect.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const baseImg = await loadImage(previewImage.src);
        const baseRect = previewImage.getBoundingClientRect();
        const baseX = baseRect.left - wrapperRect.left;
        const baseY = baseRect.top - wrapperRect.top;
        ctx.drawImage(baseImg, baseX, baseY, baseRect.width, baseRect.height);

        if (designLayer && uploadedDesign && uploadedDesign.src && designLayer.style.display !== 'none') {
            const overlayImg = await loadImage(uploadedDesign.src);
            const designRect = designLayer.getBoundingClientRect();
            const dx = designRect.left - wrapperRect.left;
            const dy = designRect.top - wrapperRect.top;
            const dw = designRect.width;
            const dh = designRect.height;
            const rotationDeg = parseFloat(designLayer.dataset.rotation || '0') || 0;

            const cx = dx + dw / 2;
            const cy = dy + dh / 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((rotationDeg * Math.PI) / 180);
            ctx.drawImage(overlayImg, -dw / 2, -dh / 2, dw, dh);
            ctx.restore();
        }

        return trimTransparentCanvas(canvas);
    };

    const downloadComposite = async () => {
        try {
            const canvas = await renderCompositePNG();
            if (!canvas) return;
            const link = document.createElement('a');
            link.download = 'custom-design.png';
            const triggerDownload = (url) => {
                link.href = url;
                document.body.appendChild(link);
                link.click();
                link.remove();
            };

            if (canvas.toBlob) {
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    triggerDownload(url);
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                }, 'image/png');
            } else {
                const dataUrl = canvas.toDataURL('image/png');
                triggerDownload(dataUrl);
            }
        } catch (err) {
            console.error('Failed to generate composite PNG', err);
        }
    };
    
    // Toggle edit mode
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            isEditMode = true;
            editPanel.classList.remove('hidden');
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            if (downloadBtn) downloadBtn.style.display = 'none';
            
            // Make image draggable
            if (designLayer && designLayer.style.display !== 'none') {
                designLayer.classList.remove('locked');
                designLayer.style.cursor = 'grab';
            }
        });
    }
    
    // Save changes
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            isEditMode = false;
            storeDesignState();
            editPanel.classList.add('hidden');
            saveBtn.style.display = 'none';
            editBtn.style.display = 'inline-block';
            if (downloadBtn) downloadBtn.style.display = 'inline-block';
            
            // Lock image
            if (designLayer && designLayer.style.display !== 'none') {
                designLayer.classList.add('locked');
                designLayer.style.cursor = 'default';
            }

            // Re-apply position after layout changes (mobile zoom/resize)
            requestAnimationFrame(() => {
                applyDesignState();
            });
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadComposite();
        });
    }
    
    // Handle file upload - Direct approach
    if (designFileInput) {
        // Click event on the upload button triggers the file input directly
        const fileUploadBtn = document.querySelector('.file-upload-btn');
        if (fileUploadBtn) {
            fileUploadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                designFileInput.click();
            });
        }
        
        // Process the selected file
        designFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            // Enforce max upload size before processing
            if (file && file.size > MAX_UPLOAD_BYTES) {
                showUploadSizeWarning();
                designFileInput.value = '';
                return;
            }
            // Only accept allowed image types
            if (file && ['image/png','image/jpeg','image/gif'].indexOf(file.type) === -1) {
                designFileInput.value = '';
                return;
            }
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (uploadedDesign && designLayer) {
                        const { width: cw, height: ch } = getContainerSize();
                        uploadedDesign.src = event.target.result;
                        designLayer.style.display = 'block';
                        designLayer.style.left = '50px';
                        designLayer.style.top = '50px';
                        const defaultSize = Math.min(220, Math.max(140, Math.min(cw, ch) * 0.35));
                        designLayer.style.width = defaultSize + 'px';
                        designLayer.style.height = defaultSize + 'px';
                        if (uploadedDesign) {
                            uploadedDesign.style.width = '100%';
                            uploadedDesign.style.height = '100%';
                            uploadedDesign.style.objectFit = 'fill';
                            uploadedDesign.style.maxWidth = 'none';
                            uploadedDesign.style.maxHeight = 'none';
                        }
                        currentRotation = 0;
                        designLayer.style.transform = 'rotate(0deg)';

                        if (isEditMode) {
                            designLayer.classList.remove('locked');
                        } else {
                            designLayer.classList.add('locked');
                        }
                    }
                    updateDesignSizeDisplay();
                    storeDesignState();
                    // Clear the input value
                    designFileInput.value = '';
                };
                reader.readAsDataURL(file);
            }
        }, false);
    }

    if (deleteDesignBtn) {
        deleteDesignBtn.addEventListener('click', function() {
            clearDesignState();
        });
    }
    
    // Drag/Resize/Rotate functionality
    if (designLayer && productImageWrapper) {
        const resizeHandles = designLayer.querySelectorAll('.resize-handle');
        const rotateHandle = designLayer.querySelector('.rotate-handle');

        const setLayerTransform = () => {
            designLayer.style.transform = `rotate(${currentRotation}deg)`;
        };

        const getPoint = (evt) => {
            const touch = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
            return { x: touch.clientX, y: touch.clientY };
        };

        designLayer.addEventListener('mousedown', function(e) {
            if (!isEditMode) return;
            if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;

            isDragging = true;
            const rect = designLayer.getBoundingClientRect();
            const containerRect = productImageWrapper.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            startLeft = rect.left - containerRect.left;
            startTop = rect.top - containerRect.top;
            designLayer.classList.add('dragging');
        });

        designLayer.addEventListener('touchstart', function(e) {
            if (!isEditMode) return;
            if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;

            const p = getPoint(e);
            isDragging = true;
            const rect = designLayer.getBoundingClientRect();
            const containerRect = productImageWrapper.getBoundingClientRect();
            offsetX = p.x - rect.left;
            offsetY = p.y - rect.top;
            startLeft = rect.left - containerRect.left;
            startTop = rect.top - containerRect.top;
            designLayer.classList.add('dragging');
            e.preventDefault();
        }, { passive: false });

        resizeHandles.forEach((handle) => {
            handle.addEventListener('mousedown', function(e) {
                if (!isEditMode) return;
                isResizing = true;
                activeHandle = [...handle.classList].find((cls) => cls.startsWith('handle-')) || '';
                const rect = designLayer.getBoundingClientRect();
                const containerRect = productImageWrapper.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                startWidth = rect.width;
                startHeight = rect.height;
                startLeft = rect.left - containerRect.left;
                startTop = rect.top - containerRect.top;
                e.stopPropagation();
            });

            handle.addEventListener('touchstart', function(e) {
                if (!isEditMode) return;
                const p = getPoint(e);
                isResizing = true;
                activeHandle = [...handle.classList].find((cls) => cls.startsWith('handle-')) || '';
                const rect = designLayer.getBoundingClientRect();
                const containerRect = productImageWrapper.getBoundingClientRect();
                startX = p.x;
                startY = p.y;
                startWidth = rect.width;
                startHeight = rect.height;
                startLeft = rect.left - containerRect.left;
                startTop = rect.top - containerRect.top;
                e.stopPropagation();
                e.preventDefault();
            }, { passive: false });
        });

        if (rotateHandle) {
            rotateHandle.addEventListener('mousedown', function(e) {
                if (!isEditMode) return;
                isRotating = true;
                const rect = designLayer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                startRotation = currentRotation;
                e.stopPropagation();
            });

            rotateHandle.addEventListener('touchstart', function(e) {
                if (!isEditMode) return;
                isRotating = true;
                const p = getPoint(e);
                const rect = designLayer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                startAngle = Math.atan2(p.y - centerY, p.x - centerX) * (180 / Math.PI);
                startRotation = currentRotation;
                e.stopPropagation();
                e.preventDefault();
            }, { passive: false });
        }

        document.addEventListener('mousemove', function(e) {
            if (!isEditMode) return;

            const containerRect = productImageWrapper.getBoundingClientRect();

            if (isDragging) {
                let newX = e.clientX - containerRect.left - offsetX;
                let newY = e.clientY - containerRect.top - offsetY;

                newX = Math.max(0, Math.min(newX, containerRect.width - designLayer.offsetWidth));
                newY = Math.max(0, Math.min(newY, containerRect.height - designLayer.offsetHeight));

                designLayer.style.left = newX + 'px';
                designLayer.style.top = newY + 'px';
            }

            if (isResizing) {
                const minSize = 50;
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                if (activeHandle === 'handle-tl') {
                    newWidth = startWidth - dx;
                    newHeight = startHeight - dy;
                    newLeft = startLeft + dx;
                    newTop = startTop + dy;
                } else if (activeHandle === 'handle-tr') {
                    newWidth = startWidth + dx;
                    newHeight = startHeight - dy;
                    newTop = startTop + dy;
                } else if (activeHandle === 'handle-br') {
                    newWidth = startWidth + dx;
                    newHeight = startHeight + dy;
                } else if (activeHandle === 'handle-bl') {
                    newWidth = startWidth - dx;
                    newHeight = startHeight + dy;
                    newLeft = startLeft + dx;
                }

                newWidth = Math.max(minSize, newWidth);
                newHeight = Math.max(minSize, newHeight);

                newLeft = Math.max(0, newLeft);
                newTop = Math.max(0, newTop);

                if (newLeft + newWidth > containerRect.width) {
                    newWidth = containerRect.width - newLeft;
                }
                if (newTop + newHeight > containerRect.height) {
                    newHeight = containerRect.height - newTop;
                }

                designLayer.style.width = newWidth + 'px';
                designLayer.style.height = newHeight + 'px';
                if (uploadedDesign) {
                    uploadedDesign.style.width = '100%';
                    uploadedDesign.style.height = '100%';
                    uploadedDesign.style.objectFit = 'fill';
                    uploadedDesign.style.maxWidth = 'none';
                    uploadedDesign.style.maxHeight = 'none';
                }
                designLayer.style.left = newLeft + 'px';
                designLayer.style.top = newTop + 'px';
                updateDesignSizeDisplay();
            }

            if (isRotating) {
                const rect = designLayer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                currentRotation = startRotation + (currentAngle - startAngle);
                setLayerTransform();
            }
        });

        document.addEventListener('touchmove', function(e) {
            if (!isEditMode) return;

            const containerRect = productImageWrapper.getBoundingClientRect();
            const p = getPoint(e);

            if (isDragging) {
                let newX = p.x - containerRect.left - offsetX;
                let newY = p.y - containerRect.top - offsetY;

                newX = Math.max(0, Math.min(newX, containerRect.width - designLayer.offsetWidth));
                newY = Math.max(0, Math.min(newY, containerRect.height - designLayer.offsetHeight));

                designLayer.style.left = newX + 'px';
                designLayer.style.top = newY + 'px';
                e.preventDefault();
            }

            if (isResizing) {
                const minSize = 50;
                let dx = p.x - startX;
                let dy = p.y - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                if (activeHandle === 'handle-tl') {
                    newWidth = startWidth - dx;
                    newHeight = startHeight - dy;
                    newLeft = startLeft + dx;
                    newTop = startTop + dy;
                } else if (activeHandle === 'handle-tr') {
                    newWidth = startWidth + dx;
                    newHeight = startHeight - dy;
                    newTop = startTop + dy;
                } else if (activeHandle === 'handle-br') {
                    newWidth = startWidth + dx;
                    newHeight = startHeight + dy;
                } else if (activeHandle === 'handle-bl') {
                    newWidth = startWidth - dx;
                    newHeight = startHeight + dy;
                    newLeft = startLeft + dx;
                }

                newWidth = Math.max(minSize, newWidth);
                newHeight = Math.max(minSize, newHeight);

                newLeft = Math.max(0, newLeft);
                newTop = Math.max(0, newTop);

                if (newLeft + newWidth > containerRect.width) {
                    newWidth = containerRect.width - newLeft;
                }
                if (newTop + newHeight > containerRect.height) {
                    newHeight = containerRect.height - newTop;
                }

                designLayer.style.width = newWidth + 'px';
                designLayer.style.height = newHeight + 'px';
                if (uploadedDesign) {
                    uploadedDesign.style.width = '100%';
                    uploadedDesign.style.height = '100%';
                    uploadedDesign.style.objectFit = 'fill';
                    uploadedDesign.style.maxWidth = 'none';
                    uploadedDesign.style.maxHeight = 'none';
                }
                designLayer.style.left = newLeft + 'px';
                designLayer.style.top = newTop + 'px';
                updateDesignSizeDisplay();
                e.preventDefault();
            }

            if (isRotating) {
                const rect = designLayer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const currentAngle = Math.atan2(p.y - centerY, p.x - centerX) * (180 / Math.PI);
                currentRotation = startRotation + (currentAngle - startAngle);
                setLayerTransform();
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                designLayer.classList.remove('dragging');
            }
            if (isResizing) {
                isResizing = false;
                activeHandle = '';
                updateDesignSizeDisplay();
            }
            if (isRotating) {
                isRotating = false;
            }
        });

        document.addEventListener('touchend', function() {
            if (isDragging) {
                isDragging = false;
                designLayer.classList.remove('dragging');
            }
            if (isResizing) {
                isResizing = false;
                activeHandle = '';
                updateDesignSizeDisplay();
            }
            if (isRotating) {
                isRotating = false;
            }
        });
    }

    if (productImageWrapper) {
        window.addEventListener('resize', function() {
            applyDesignState();
        });

        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                applyDesignState();
            });
            ro.observe(productImageWrapper);
        }
    }
}

function setupEventListeners() {
    const productCard = document.getElementById('productCard');
    const productCard2 = document.getElementById('productCard2');
    const customCard = document.getElementById('customCard');
    backBtn = document.getElementById('backHome');
    const fullNameInput = document.getElementById('fullName');
    const customFullNameInput = document.getElementById('customFullName');
    const phoneInput = document.getElementById('phone');
    const customPhoneInput = document.getElementById('customPhone');
    // coupon inputs removed from DOM
    
    // Attach click handlers to all product cards that have a data-product-id
    const productCards = document.querySelectorAll('.product-card-section[data-product-id]');
    if (productCards && productCards.length > 0) {
        productCards.forEach(card => {
            const pid = card.getAttribute('data-product-id');
            card.onclick = () => {
                try {
                    setActiveProduct(pid);
                    // Ensure displayed total is recalculated when opening details
                    try { calculate(); } catch (e) { /* ignore if calculate not ready */ }
                    const cardsContainer = document.querySelector('.cards-container');
                    if (cardsContainer) cardsContainer.style.display = 'none';
                    // hide all cards to match previous behavior
                    document.querySelectorAll('.product-card-section').forEach(c => c.style.display = 'none');
                    const orderDetails = document.getElementById('orderDetails');
                    if (orderDetails) {
                        orderDetails.style.display = 'flex';
                        setTimeout(() => orderDetails.style.opacity = '1', 50);
                    }
                    setBackButtonVisible(true);
                    const greeting = document.querySelector('.site-greeting');
                    if (greeting) {
                        greeting.classList.remove('visible');
                        document.body.classList.remove('show-greeting');
                    }
                } catch (err) {
                    console.error('Error opening product details', err);
                }
            };
        });
    }

    if (customCard) {
        customCard.onclick = () => {
            try {
                const cardsContainer = document.querySelector('.cards-container');
                if (cardsContainer) cardsContainer.style.display = 'none';
                customCard.style.display = 'none';
                const customProductPage = document.getElementById('customProductPage');
                if (customProductPage) {
                    customProductPage.style.display = 'flex';
                    setTimeout(() => customProductPage.style.opacity = '1', 50);
                }
                setBackButtonVisible(true);
                const greeting = document.querySelector('.site-greeting');
                if (greeting) {
                    greeting.classList.remove('visible');
                    document.body.classList.remove('show-greeting');
                }
            } catch (err) {
                console.error('Error opening custom product', err);
            }
        };

        const createBtn = customCard.querySelector('.view-details-btn');
        if (createBtn) {
            createBtn.onclick = (e) => {
                setBackButtonVisible(true);
                const greeting = document.querySelector('.site-greeting');
                if (greeting) {
                    greeting.classList.remove('fade-out');
                    greeting.classList.remove('visible');
                    document.body.classList.remove('show-greeting');
                }
            };
        }
    }

    const sanitizeNameInput = (value) => value.replace(/[^A-Za-z ]+/g, '');
    const sanitizePhoneInput = (value) => value.replace(/\D+/g, '').slice(0, 10);

    if (fullNameInput) {
        fullNameInput.addEventListener('input', () => {
            fullNameInput.value = sanitizeNameInput(fullNameInput.value);
        });
    }
    if (customFullNameInput) {
        customFullNameInput.addEventListener('input', () => {
            customFullNameInput.value = sanitizeNameInput(customFullNameInput.value);
        });
    }
    // coupon inputs removed; no sanitizers or listeners required
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            phoneInput.value = sanitizePhoneInput(phoneInput.value);
        });
    }
    if (customPhoneInput) {
        customPhoneInput.addEventListener('input', () => {
            customPhoneInput.value = sanitizePhoneInput(customPhoneInput.value);
        });
    }
    
    // Handle Customize buttons (supports multiple custom-product-card entries)
    const customizeBtns = document.querySelectorAll('.customize-btn');
    if (customizeBtns && customizeBtns.length > 0) {
        customizeBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const card = btn.closest('.custom-product-card');
                if (!card) return;

                // scoped selectors
                const sideOptions = card.querySelectorAll('.side-option');
                const colorOptions = card.querySelectorAll('.color-option');

                let selectedSide = 'front';
                let selectedColor = 'white';

                sideOptions.forEach(opt => {
                    if (opt.classList.contains('selected')) selectedSide = opt.dataset.side || 'front';
                });
                colorOptions.forEach(opt => {
                    if (opt.classList.contains('selected')) selectedColor = opt.dataset.value || (opt.dataset.color || '').toLowerCase() || 'white';
                });

                const sideNum = selectedSide === 'front' ? '1' : '2';
                const folder = card.dataset.folder || 'dp product 1';
                const imagePath = `images/dp/${folder}/mockup/${selectedColor}${sideNum}.png`;

                const titleEl = card.querySelector('.custom-card-title');
                const imgEl = card.querySelector('img.custom-card-image');
                const productName = titleEl ? titleEl.textContent.trim() : 'Custom Product';
                const productBaseImage = imgEl ? imgEl.src : '';

                sessionStorage.setItem('customizationData', JSON.stringify({
                    productName: productName,
                    productBaseImage: productBaseImage,
                    color: selectedColor,
                    side: selectedSide,
                    imagePath: imagePath
                }));

                showCustomizationPage(imagePath);
            };
        });
    }
    
    sizeOpts.forEach(opt => {
        opt.onclick = () => {
            sizeOpts.forEach(s => s.classList.remove('selected'));
            opt.classList.add('selected');
            selectedSize = opt.dataset.size;
        };
    });

    if (colorOpts) {
        colorOpts.forEach(opt => {
            opt.onclick = () => {
                colorOpts.forEach(c => c.classList.remove('selected'));
                opt.classList.add('selected');
                selectedColor = opt.dataset.color || opt.getAttribute('data-value') || '';
            };
        });
    }
    
    // Handle side & color selection per custom-product-card (scope selections to each card)
    const customCards = document.querySelectorAll('.custom-product-card');
    if (customCards && customCards.length > 0) {
        customCards.forEach(card => {
            const sides = card.querySelectorAll('.side-option');
            const colors = card.querySelectorAll('.color-option');

            // default select first side and first color if none selected
            if (sides && sides.length > 0 && !card.querySelector('.side-option.selected')) {
                sides[0].classList.add('selected');
            }
            if (colors && colors.length > 0 && !card.querySelector('.color-option.selected')) {
                colors[0].classList.add('selected');
            }

            sides.forEach(opt => {
                opt.onclick = () => {
                    sides.forEach(s => s.classList.remove('selected'));
                    opt.classList.add('selected');
                };
            });

            colors.forEach(opt => {
                opt.onclick = () => {
                    colors.forEach(c => c.classList.remove('selected'));
                    opt.classList.add('selected');
                };
            });
        });
    }
    
    if (stateInput) {
        stateInput.onchange = () => {
            const state = stateInput.value;
            
            if (communeInput) {
                communeInput.innerHTML = '<option value="">Select Commune</option>';
                
                console.log('=== Wilaya selected:', state);
                const communes = getCommunesForWilaya(state);
                console.log('=== Found communes:', communes);
                
                if (communes && communes.length > 0) {
                    communes.forEach(c => {
                        let o = document.createElement('option');
                        o.value = c;
                        o.textContent = c;
                        communeInput.appendChild(o);
                    });
                } else {
                    console.warn('No communes found for', state);
                    let o = document.createElement('option'); 
                    o.value = "City Center"; 
                    o.textContent = "City Center";
                    communeInput.appendChild(o);
                }
            }

            if (officeInput) {
                officeInput.innerHTML = '<option value="">Select Office</option>';
                if (delInput && delInput.value === 'office') {
                    populateOffices();
                }
            }

            calculate();
        };
    }
    
    [qtyInput, delInput].forEach(el => {
        if (el) el.oninput = calculate;
    });

    [customQtyInput, customDelInput].forEach(el => {
        if (el) el.oninput = calculateCustom;
    });

    if (communeInput) communeInput.onchange = () => { calculate(); };
    if (officeInput) officeInput.onchange = () => { calculate(); };

    if (delInput) {
        delInput.onchange = () => {
            const type = delInput.value;
            if (type === 'home') {
                if (communeGroup) communeGroup.style.display = 'block';
                if (officeGroup) officeGroup.style.display = 'none';
            } else if (type === 'office') {
                if (communeGroup) communeGroup.style.display = 'none';
                if (officeGroup) officeGroup.style.display = 'block';
                populateOffices();
            } else {
                if (communeGroup) communeGroup.style.display = 'none';
                if (officeGroup) officeGroup.style.display = 'none';
            }
            calculate();
        };
        delInput.onchange();
    }

    if (customStateInput) {
        customStateInput.onchange = () => {
            const state = customStateInput.value;

            if (customCommuneInput) {
                customCommuneInput.innerHTML = '<option value="">Select Commune</option>';
                const communes = getCommunesForWilaya(state);
                if (communes && communes.length > 0) {
                    communes.forEach(c => {
                        let o = document.createElement('option');
                        o.value = c;
                        o.textContent = c;
                        customCommuneInput.appendChild(o);
                    });
                } else {
                    let o = document.createElement('option');
                    o.value = "City Center";
                    o.textContent = "City Center";
                    customCommuneInput.appendChild(o);
                }
            }

            if (customOfficeInput && customDelInput && customDelInput.value === 'office') {
                populateCustomOffices();
            }

            calculateCustom();
        };
    }

    if (customDelInput) {
        customDelInput.onchange = () => {
            const type = customDelInput.value;
            if (type === 'home') {
                if (customCommuneGroup) customCommuneGroup.style.display = 'block';
                if (customOfficeGroup) customOfficeGroup.style.display = 'none';
            } else if (type === 'office') {
                if (customCommuneGroup) customCommuneGroup.style.display = 'none';
                if (customOfficeGroup) customOfficeGroup.style.display = 'block';
                populateCustomOffices();
            } else {
                if (customCommuneGroup) customCommuneGroup.style.display = 'none';
                if (customOfficeGroup) customOfficeGroup.style.display = 'none';
            }
            calculateCustom();
        };
        customDelInput.onchange();
    }
    
    // Unified back button handler for all pages
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                const orderDetails = document.getElementById('orderDetails');
                const customProductPage = document.getElementById('customProductPage');
                const previewPage = document.getElementById('customizationPreviewPage');
                const productCard = document.getElementById('productCard');
                const productCard2 = document.getElementById('productCard2');
                const customCard = document.getElementById('customCard');
                const cardsContainer = document.querySelector('.cards-container');
                
                window.scrollTo({ top: 0, behavior: 'auto' });
                
                // If preview page is showing, go back to custom product page
                if (previewPage && previewPage.style.display === 'flex') {
                    previewPage.style.opacity = '0';
                    previewPage.style.pointerEvents = 'none';
                    setTimeout(() => {
                        previewPage.style.display = 'none';
                        if (customProductPage) {
                            customProductPage.style.display = 'flex';
                            customProductPage.style.pointerEvents = 'auto';
                            customProductPage.style.opacity = '0';
                            setBackButtonVisible(true);
                            setTimeout(() => {
                                customProductPage.style.opacity = '1';
                            }, 10);
                        }
                        // Restore any color elements hidden when entering preview
                        try {
                            if (Array.isArray(window._previewHiddenColorEls)) {
                                window._previewHiddenColorEls.forEach(el => {
                                    try {
                                        if (el && el.dataset && el.dataset._hiddenByPreview === 'true') {
                                            el.style.display = '';
                                            delete el.dataset._hiddenByPreview;
                                        }
                                    } catch(e) {}
                                });
                            }
                            window._previewHiddenColorEls = [];
                        } catch (e) { /* ignore */ }
                    }, 300);
                }
                // If custom product page is showing, go back to cards (show all product cards)
                else if (customProductPage && customProductPage.style.display === 'flex') {
                    customProductPage.style.opacity = '0';
                    setTimeout(() => { 
                        customProductPage.style.display = 'none';
                        // show all product cards
                        const allCards = document.querySelectorAll('.product-card-section');
                        allCards.forEach(c => {
                            c.style.display = 'block';
                            c.style.opacity = '0';
                            setTimeout(() => { c.style.opacity = '1'; }, 10);
                        });
                        if (cardsContainer) cardsContainer.style.display = 'flex';
                        setBackButtonVisible(false);
                        showGreeting();
                    }, 300);
                }
                // If order details page is showing, go back to all product cards
                else if (orderDetails && orderDetails.style.display === 'flex') {
                    orderDetails.style.opacity = '0';
                    setTimeout(() => { 
                        orderDetails.style.display = 'none';
                        // show all product cards
                        const allCards = document.querySelectorAll('.product-card-section');
                        allCards.forEach(c => {
                            c.style.display = 'block';
                            c.style.opacity = '0';
                            setTimeout(() => { c.style.opacity = '1'; }, 10);
                        });
                        if (cardsContainer) cardsContainer.style.display = 'flex';
                        setBackButtonVisible(false);
                        showGreeting();
                    }, 300);
                }
                // Otherwise go back to cards (show all product cards)
                else {
                    const allCards = document.querySelectorAll('.product-card-section');
                    allCards.forEach(c => c.style.display = 'block');
                    if (cardsContainer) cardsContainer.style.display = 'flex';
                    setBackButtonVisible(false);
                    showGreeting();
                }
                
                // Hide back button when returning to cards
                
            } catch (err) {
                console.error('Error in back button handler', err);
            }
        });
    }
    
    // Handle back button from custom product page - uses main back button
    const backHomeCustom = document.getElementById('backHomeCustom');
    if (backHomeCustom) {
        backHomeCustom.addEventListener('click', function(e) {
            e.preventDefault();
            if (backBtn) {
                backBtn.click();
            }
        });
    }
    
    // Handle back button from customization preview page - uses main back button
    const backCustomization = document.getElementById('backCustomization');
    if (backCustomization) {
        backCustomization.addEventListener('click', function(e) {
            e.preventDefault();
            if (backBtn) {
                backBtn.click();
            }
        });
    }
    
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.onclick = handleConfirmOrder;
    }

    const customConfirmBtn = document.getElementById('customConfirmBtn');
    if (customConfirmBtn) {
        customConfirmBtn.onclick = handleConfirmCustomOrder;
    }
    
    // Initialize design editor on preview page
    initDesignEditor();
    
    // Initialize customization defaults
    initCustomizationDefaults();
}

function initStates() {
    if (!stateInput) return;
    stateInput.innerHTML = '<option value="">Select Wilaya</option>';
    
    let list = [];
    let statesWithCodes = [];
    
    if (window.__dynamicData && Array.isArray(window.__dynamicData.states)) {
        statesWithCodes = window.__dynamicData.states.filter(s => s && s.name);
        list = statesWithCodes.map(s => s.name);
    } else {
        list = statesList;
    }
    
    console.log('initStates: loading', list ? list.length : 0, 'states');
    
    if (statesWithCodes.length > 0) {
        // Use data with codes
        statesWithCodes.forEach((state) => {
            let opt = document.createElement('option');
            opt.value = state.name;
            opt.textContent = `${state.code} - ${state.name}`;
            stateInput.appendChild(opt);
        });
    } else {
        // Without codes
        list.forEach((state) => {
            let opt = document.createElement('option');
            opt.value = state;
            opt.textContent = state;
            stateInput.appendChild(opt);
        });
    }
}

function initCustomStates() {
    if (!customStateInput) return;
    customStateInput.innerHTML = '<option value="">Select Wilaya</option>';

    let list = [];
    let statesWithCodes = [];

    if (window.__dynamicData && Array.isArray(window.__dynamicData.states)) {
        statesWithCodes = window.__dynamicData.states.filter(s => s && s.name);
        list = statesWithCodes.map(s => s.name);
    } else {
        list = statesList;
    }

    if (statesWithCodes.length > 0) {
        statesWithCodes.forEach((state) => {
            let opt = document.createElement('option');
            opt.value = state.name;
            opt.textContent = `${state.code} - ${state.name}`;
            customStateInput.appendChild(opt);
        });
    } else {
        list.forEach((state) => {
            let opt = document.createElement('option');
            opt.value = state;
            opt.textContent = state;
            customStateInput.appendChild(opt);
        });
    }
}

function populateOffices() {
    const state = stateInput.value;
    officeInput.innerHTML = '<option value="">Select Office</option>';
    if (!state || !window.__dynamicData || !window.__dynamicData.offices) {
        return;
    }

    let offices = window.__dynamicData.offices[state];

    if (!offices) {
        const target = normalizeName(state);
        for (const key in window.__dynamicData.offices) {
            if (normalizeName(key) === target) {
                offices = window.__dynamicData.offices[key];
                break;
            }
        }
    }

    if ((!offices || offices.length === 0) && parentWilayaMap[state]) {
        const parent = parentWilayaMap[state];
        console.log(`${state} offices: using parent ${parent}`);
        offices = window.__dynamicData.offices[parent];
        if (!offices) {
            const targetParent = normalizeName(parent);
            for (const key in window.__dynamicData.offices) {
                if (normalizeName(key) === targetParent) {
                    offices = window.__dynamicData.offices[key];
                    break;
                }
            }
        }
    }

    if (Array.isArray(offices) && offices.length > 0) {
        offices.forEach(office => {
            let o = document.createElement('option');
            o.value = office;
            o.textContent = office;
            officeInput.appendChild(o);
        });
    }
}

function calculate() {
    const qty = parseInt(qtyInput.value) || 1;
    const state = stateInput.value;
    const type = delInput.value;
    
    // Use product-specific base price if available
    let basePrice = 3700;
    try {
        const cfg = PRODUCT_CONFIG[activeProductId];
        if (cfg && typeof cfg.price === 'number') basePrice = cfg.price;
    } catch (e) { /* ignore */ }
    let productPrice = qty * basePrice;
    
    if(qty >= 2) {
        productPrice -= 500;
        document.getElementById('bulkDiscountMsg').style.display = 'block';
    } else {
        document.getElementById('bulkDiscountMsg').style.display = 'none';
    }

    let delPrice = 0;
    if (state && type) {
        delPrice = getDeliveryForWilaya(state, type);
    }

    // Don't force rounding to nearest 100 — allow delivery to affect units/tens/hundreds
    const finalPrice = Math.round(productPrice + delPrice);
    document.getElementById('delPrice').textContent = delPrice;
    document.getElementById('finalPrice').textContent = finalPrice;
}

function calculateCustom() {
    if (!customQtyInput || !customStateInput || !customDelInput) return;
    const qty = parseInt(customQtyInput.value) || 1;
    const state = customStateInput.value;
    const type = customDelInput.value;

    // Determine base price for customization: per selected custom product
    // default to Regular Hoodie price (2800) unless user selected a tshirt oversize (2400)
    let baseCustomPrice = 2800;
    try {
        const cd = JSON.parse(sessionStorage.getItem('customizationData') || '{}');
        const pname = (cd.productName || '').trim();
        if (pname === 'Regular Hoodie') baseCustomPrice = 2800;
        else if (/tshirt/i.test(pname) || /oversize/i.test(pname)) baseCustomPrice = 2400;
    } catch (e) { /* ignore parse errors */ }
    let productPrice = qty * baseCustomPrice;

    const designLayer = document.getElementById('designLayer');
    let designExtra = 0;
    if (designLayer && designLayer.style.display !== 'none') {
        // Compute design area using preview image natural size so measurements
        // remain consistent across different viewport sizes.
        const previewImage = document.getElementById('previewImage');
        let displayedToNatural = 1;
        if (previewImage && previewImage.naturalWidth && previewImage.clientWidth) {
            displayedToNatural = previewImage.naturalWidth / previewImage.clientWidth;
        }
        const designWidthNaturalPx = designLayer.offsetWidth * displayedToNatural;
        const designHeightNaturalPx = designLayer.offsetHeight * displayedToNatural;
        let wCm = Math.max(0, Math.round(designWidthNaturalPx * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM);
        let hCm = Math.max(0, Math.round(designHeightNaturalPx * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM);
        // If product is Tshirt Oversize, reduce reported size by 5 cm
        try {
            const cd = JSON.parse(sessionStorage.getItem('customizationData') || '{}');
            const pname = (cd.productName || '').toLowerCase();
            if (/tshirt|oversize/.test(pname)) {
                wCm = Math.max(0, wCm - 5);
                hCm = Math.max(0, hCm - 5);
            }
        } catch (e) { /* ignore */ }
        // price per cm^2 updated to 0.4 DZD (10x10 => 40 DZD)
        designExtra = Math.round(wCm * hCm * 0.6);
    }
    productPrice += (designExtra * qty);

    const bulkMsg = document.getElementById('customBulkDiscountMsg');
    const couponMsg = null;

    if (qty >= 2) {
        productPrice -= 500;
        if (bulkMsg) bulkMsg.style.display = 'block';
    } else if (bulkMsg) {
        bulkMsg.style.display = 'none';
    }
    // coupon removed: no coupon discounts applied

    let delPrice = 0;
    if (state && type) {
        delPrice = getDeliveryForWilaya(state, type);
    }

    const delPriceEl = document.getElementById('customDelPrice');
    const finalPriceEl = document.getElementById('customFinalPrice');

    // Floor product component (base + design extras - discounts) to nearest 100,
    // then add delivery exactly so delivery keeps units/tens precision.
    let productComponent = Math.round(productPrice);
    productComponent = Math.floor(productComponent / 100) * 100;
    const finalPrice = productComponent + Math.round(delPrice);

    if (delPriceEl) delPriceEl.textContent = delPrice;
    if (finalPriceEl) finalPriceEl.textContent = finalPrice;
    // Update preview displayed price if present
    try {
        const previewNew = document.querySelector('#customizationPreviewPage .new-price');
        if (previewNew) previewNew.textContent = finalPrice + ' دج';
    } catch (e) { /* ignore */ }
}

function handleConfirmOrder() {
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const state = stateInput.value;
    const commune = communeInput.value;
    const office = officeInput.value;
    const deliveryType = delInput.value;
    const finalPrice = document.getElementById('finalPrice').textContent;
    const err = document.getElementById('errorMessage');

    if (!validateCommonFields({
        name,
        phone,
        size: selectedSize
    }, err)) {
        return;
    }

    if (!state || !deliveryType) {
        showErrorAndScroll(err, 'Please select delivery and wilaya.');
        return;
    }

    if (deliveryType === 'home' && !commune) {
        showErrorAndScroll(err, 'Please select a commune.');
        return;
    }

    if (deliveryType === 'office' && !office) {
        showErrorAndScroll(err, 'Please select an office.');
        return;
    }

    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = true;
    showPleaseWait();

    // إرسال البيانات إلى Google Apps Script Web App
    const formData = new FormData();
    // Date will be handled by the script automatically
    formData.append('product', document.getElementById('detailProductName') ? document.getElementById('detailProductName').textContent : '');
    // priceBeforeFees = السعر الجديد (بدون رسوم)
    formData.append('priceBeforeFees', document.querySelector('.new-price') ? document.querySelector('.new-price').textContent : '');
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('wilaya', state);
    formData.append('deliveryType', deliveryType);
    formData.append('deliveryDestination', deliveryType === 'home' ? commune : office);
    formData.append('size', selectedSize);
    formData.append('color', selectedColor);
    // Ensure quantity is sent to Google Apps Script
    try { formData.append('quantity', (qtyInput && qtyInput.value) ? qtyInput.value : (document.getElementById('quantity') ? document.getElementById('quantity').value : '1')); } catch (e) { formData.append('quantity', '1'); }
    formData.append('finalPrice', finalPrice);

    fetch('https://script.google.com/macros/s/AKfycbyG1VwVaNVb1SeOWqdJNGiQBPSWr9sI7ki42tS9xeGIgaZzyXlBlFcbViHbv6xlO-omsA/exec', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        startProcessing(confirmBtn, name, phone);
    })
    .catch(() => {
        // حتى لو فشل الإرسال، أظهر النجاح للمستخدم
        startProcessing(confirmBtn, name, phone);
    });
}

function handleConfirmCustomOrder() {
    if (!customQtyInput || !customStateInput || !customDelInput) return;

    const nameEl = document.getElementById('customFullName');
    const phoneEl = document.getElementById('customPhone');
    const err = document.getElementById('customErrorMessage');
    const state = customStateInput.value;
    const commune = customCommuneInput ? customCommuneInput.value : '';
    const office = customOfficeInput ? customOfficeInput.value : '';
    const deliveryType = customDelInput.value;
    const name = nameEl ? nameEl.value : '';
    const phone = phoneEl ? phoneEl.value : '';
    const finalPrice = document.getElementById('customFinalPrice') ? document.getElementById('customFinalPrice').textContent : '';

    if (!validateCommonFields({
        name,
        phone,
        size: selectedSize
    }, err)) {
        return;
    }

    if (!state || !deliveryType) {
        showErrorAndScroll(err, 'Please select delivery and wilaya.');
        return;
    }

    if (deliveryType === 'home' && !commune) {
        showErrorAndScroll(err, 'Please select a commune.');
        return;
    }

    if (deliveryType === 'office' && !office) {
        showErrorAndScroll(err, 'Please select an office.');
        return;
    }

    const confirmBtn = document.getElementById('customConfirmBtn');
    confirmBtn.disabled = true;

    showPleaseWait();

    // Send images (composite product image and original PNG) to Google Sheet asynchronously.
    (async function() {
        try {
            if (window.buildCompositeDataUrl) {
                const compositeDataUrl = await window.buildCompositeDataUrl();
                const pngDataUrl = (document.getElementById('uploadedDesign') || {}).src || '';
                // If user didn't add overlay, composite may be same as preview; still okay.
                await window.sendImagesBase64ToSheet(compositeDataUrl || (document.getElementById('previewImage') || {}).src || '', pngDataUrl || '');
            } else if (window.sendImagesBase64ToSheet) {
                const preview = (document.getElementById('previewImage') || {}).src || '';
                const png = (document.getElementById('uploadedDesign') || {}).src || '';
                await window.sendImagesBase64ToSheet(preview, png, new Date().toISOString());
            }
        } catch (err) {
            console.warn('Image send failed', err);
        }
    })();

    // إرسال البيانات النصية فقط مباشرة إلى Google Apps Script باستخدام FormData
    try {
        const gasUrl = 'https://script.google.com/macros/s/AKfycbyG1VwVaNVb1SeOWqdJNGiQBPSWr9sI7ki42tS9xeGIgaZzyXlBlFcbViHbv6xlO-omsA/exec';
        // Prefer the product name stored in sessionStorage (set when user clicked Customize),
        // fall back to known DOM elements, otherwise default to 'Regular Hoodie'.
        let prodName = 'Regular Hoodie';
        try {
            const cd = JSON.parse(sessionStorage.getItem('customizationData') || '{}');
            if (cd && cd.productName) prodName = cd.productName.trim();
        } catch (e) { /* ignore */ }
        const prodTitleEl = document.querySelector('.custom-product-title') || document.querySelector('#customizationPreviewPage .product-name-above-gallery');
        if (prodTitleEl && prodTitleEl.textContent && prodTitleEl.textContent.trim()) {
            prodName = prodTitleEl.textContent.trim();
        }

        const formData = new FormData();
        formData.append('product', 'custom - ' + prodName);
        const customNewPriceEl = document.querySelector('#customizationPreviewPage .new-price');
        const priceBeforeFees = (customNewPriceEl && customNewPriceEl.textContent) ? customNewPriceEl.textContent : '';
        formData.append('priceBeforeFees', priceBeforeFees);
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('wilaya', state);
        formData.append('deliveryType', deliveryType);
        formData.append('deliveryDestination', deliveryType === 'home' ? commune : office);
        formData.append('size', selectedSize);
        formData.append('color', selectedCustomColor);
        // Ensure custom quantity is sent to Google Apps Script
        try { formData.append('quantity', (customQtyInput && customQtyInput.value) ? customQtyInput.value : (document.getElementById('customQuantity') ? document.getElementById('customQuantity').value : '1')); } catch (e) { formData.append('quantity', '1'); }
        formData.append('finalPrice', finalPrice);

        fetch(gasUrl, {
            method: 'POST',
            body: formData
        })
        .then(() => startProcessing(confirmBtn, name, phone))
        .catch(() => startProcessing(confirmBtn, name, phone));
    } catch (e) {
        startProcessing(confirmBtn, name, phone);
    }
}

function startProcessing(buttonEl, nameValue, phoneValue) {
    if (buttonEl) {
        if (buttonEl.dataset.processing === 'true') return;
        buttonEl.dataset.processing = 'true';
        buttonEl.disabled = true;
        buttonEl.dataset.originalText = buttonEl.textContent || '';
        buttonEl.textContent = 'PROCESSING...';
        buttonEl.classList.add('is-processing');
    }

    // Hide the please-wait overlay when moving to success page
    hidePleaseWait();
    setTimeout(() => {
        showSuccessPage(nameValue, phoneValue);
    }, 1200);
}

// Show a simple overlay with Arabic 'انتظر' message while the order is being sent
function showPleaseWait() {
    if (document.getElementById('pleaseWaitOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'pleaseWaitOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '200000';

    const card = document.createElement('div');
    card.style.background = '#fff';
    card.style.padding = '18px 26px';
    card.style.borderRadius = '8px';
    card.style.boxShadow = '0 6px 24px rgba(0,0,0,0.3)';
    card.style.fontSize = '1.1rem';
    card.style.fontWeight = '700';
    card.style.direction = 'rtl';
    card.textContent = 'انتظر...';

    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

function hidePleaseWait() {
    const el = document.getElementById('pleaseWaitOverlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function populateCustomOffices() {
    if (!customStateInput || !customOfficeInput) return;
    const state = customStateInput.value;
    customOfficeInput.innerHTML = '<option value="">Select Office</option>';
    if (!state || !window.__dynamicData || !window.__dynamicData.offices) {
        return;
    }

    let offices = window.__dynamicData.offices[state];

    if (!offices) {
        const target = normalizeName(state);
        for (const key in window.__dynamicData.offices) {
            if (normalizeName(key) === target) {
                offices = window.__dynamicData.offices[key];
                break;
            }
        }
    }

    if ((!offices || offices.length === 0) && parentWilayaMap[state]) {
        const parent = parentWilayaMap[state];
        offices = window.__dynamicData.offices[parent];
        if (!offices) {
            const targetParent = normalizeName(parent);
            for (const key in window.__dynamicData.offices) {
                if (normalizeName(key) === targetParent) {
                    offices = window.__dynamicData.offices[key];
                    break;
                }
            }
        }
    }

    if (offices && offices.length > 0) {
        offices.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o;
            opt.textContent = o;
            customOfficeInput.appendChild(opt);
        });
    }
}

function showSuccessPage(nameValue, phoneValue) {
    let successPage = document.getElementById('successPage');

    if (!successPage) {
        successPage = document.createElement('div');
        successPage.id = 'successPage';
        successPage.className = 'success-container';
        document.body.appendChild(successPage);
    }

    // Ensure the success overlay is attached to body and on top
    try {
        document.body.appendChild(successPage);
        successPage.style.zIndex = '100000';
    } catch (e) { /* ignore */ }

    // Hide preview or order pages so the success overlay is clearly visible
    try {
        const preview = document.getElementById('customizationPreviewPage');
        if (preview) {
            preview.style.display = 'none';
            preview.style.opacity = '0';
            preview.style.pointerEvents = 'none';
        }
        const orderDetails = document.getElementById('orderDetails');
        if (orderDetails) {
            orderDetails.style.display = 'none';
            orderDetails.style.opacity = '0';
        }
        const customProductPage = document.getElementById('customProductPage');
        if (customProductPage) {
            customProductPage.style.display = 'none';
            customProductPage.style.opacity = '0';
        }
    } catch (e) { /* ignore */ }

    successPage.innerHTML = `
        <div class="success-card">
            <div class="success-icon" aria-hidden="true">✓</div>
            <h1>Thank you, ${nameValue}</h1>
            <p>تم استلام الطلب. سنتواصل معك على ${phoneValue}.</p>
            <button class="view-details-btn" id="successReturn">Home</button>
        </div>
    `;

    const returnBtn = successPage.querySelector('#successReturn');
    if (returnBtn) {
        returnBtn.onclick = () => location.reload();
    }

    successPage.style.display = 'flex';
    successPage.style.opacity = '1';
    successPage.style.pointerEvents = 'auto';
}

function showErrorAndScroll(el, message) {
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    try {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
    } catch (e) {}
    setTimeout(() => {
        try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }, 50);
}

function validateCommonFields({ name, phone, coupon, size }, errorEl) {
    if (!size) {
        showErrorAndScroll(errorEl, 'Please select a size.');
        return false;
    }

    if (!name || !name.trim()) {
        showErrorAndScroll(errorEl, 'Please fill in your name.');
        return false;
    }

    if (name.trim().length < 4) {
        showErrorAndScroll(errorEl, 'Name must be at least 4 characters.');
        return false;
    }

    if (!NAME_REGEX.test(name)) {
        showErrorAndScroll(errorEl, 'Please enter a valid name.');
        return false;
    }

    if (!phone || !phone.trim()) {
        showErrorAndScroll(errorEl, 'Please fill in your phone number.');
        return false;
    }

    if (!PHONE_REGEX.test(phone)) {
        showErrorAndScroll(errorEl, 'Please enter a valid phone number.');
        return false;
    }

    if (coupon && !COUPON_REGEX.test(coupon)) {
        showErrorAndScroll(errorEl, 'Please enter a valid discount code.');
        return false;
    }

    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        try { errorEl.removeAttribute('tabindex'); } catch (e) {}
    }

    return true;
}

// --- Google Sheets uploader (standalone) ---
// Usage: call `sendImagesBase64ToSheet(productSrc, pngSrc, dateString)` from your existing save/confirm handler.
// It does NOT modify existing handlers; it only exposes a function you can call.
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzrBQraObOjS7F-4ddVYTJXvDaNM4sGqDANUW1qs6MANywFeH6z2xYh05eLscsrynYL/exec';

function _stripDataUrlPrefix(dataUrlOrBase64) {
    if (!dataUrlOrBase64) return '';
    const idx = dataUrlOrBase64.indexOf('base64,');
    return idx >= 0 ? dataUrlOrBase64.slice(idx + 7) : dataUrlOrBase64;
}

async function sendImagesBase64ToSheet(productImageSrc, pngImageSrc, dateString) {
    const productBase64 = _stripDataUrlPrefix(productImageSrc || '');
    const pngBase64 = _stripDataUrlPrefix(pngImageSrc || '');

    // Use FormData (multipart/form-data) to avoid CORS preflight for JSON
    const form = new FormData();
    form.append('date', dateString || new Date().toISOString());
    form.append('productImageBase64', productBase64);
    form.append('pngImageBase64', pngBase64);
    // Append customer and product names (try custom then regular fields)
    const customerName = (document.getElementById('customFullName') && document.getElementById('customFullName').value) ||
        (document.getElementById('fullName') && document.getElementById('fullName').value) || '';

    // Determine product name with priority:
    // 1) .custom-product-title (custom page)
    // 2) sessionStorage.customizationData present -> 'Regular Hoodie'
    // 3) #detailProductName (detail page)
    // 4) fallback from activeProductId mapping
    let productName = '';
    const customTitleEl = document.querySelector('.custom-product-title');
    const detailTitleEl = document.getElementById('detailProductName');
    if (customTitleEl && customTitleEl.textContent && customTitleEl.textContent.trim()) {
        productName = customTitleEl.textContent.trim();
    } else if (sessionStorage && sessionStorage.getItem && sessionStorage.getItem('customizationData')) {
        try {
            const cd = JSON.parse(sessionStorage.getItem('customizationData') || '{}');
            productName = cd.productName || 'Regular Hoodie';
        } catch (e) {
            productName = 'Regular Hoodie';
        }
    } else if (detailTitleEl && detailTitleEl.textContent && detailTitleEl.textContent.trim()) {
        productName = detailTitleEl.textContent.trim();
    } else if (typeof activeProductId !== 'undefined') {
        productName = (activeProductId === 'prod2') ? 'Eldian Empire Hoodie' : 'R6 Precision Hoodie';
    }

    form.append('customerName', customerName);
    form.append('productName', productName);

    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            body: form,
            mode: 'no-cors'
        });

        console.log('Images sent successfully');
        return { status: 'ok' };

    } catch (err) {
        console.error('Failed sending to Google Sheet', err);
        throw err;
    }
}

// Expose globally so existing code can call it without imports
window.sendImagesBase64ToSheet = sendImagesBase64ToSheet;

// Example (commented): call this from your save/confirm flow
// sendImagesBase64ToSheet(document.getElementById('uploadedDesign').src, pngDataUrlString, new Date().toISOString());

// Build a composite PNG (product preview + positioned/rotated overlay) and return DataURL
async function buildCompositeDataUrl() {
    const productImageWrapper = document.querySelector('.product-image-wrapper');
    const previewImage = document.getElementById('previewImage');
    const uploadedDesign = document.getElementById('uploadedDesign');
    const designLayer = document.getElementById('designLayer');

    if (!productImageWrapper || !previewImage || !previewImage.src) return null;

    const wrapperRect = productImageWrapper.getBoundingClientRect();
    if (!wrapperRect.width || !wrapperRect.height) return null;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(wrapperRect.width);
    canvas.height = Math.round(wrapperRect.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // draw base product preview as it appears inside wrapper
    try {
        const baseImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = previewImage.src;
        });
        // Attempt to draw the preview at the same size as its DOM rect
        const baseRect = previewImage.getBoundingClientRect();
        const baseX = baseRect.left - wrapperRect.left;
        const baseY = baseRect.top - wrapperRect.top;
        ctx.drawImage(baseImg, baseX, baseY, baseRect.width, baseRect.height);
    } catch (e) {
        try { ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height); } catch(e){}
    }

    // draw overlay if present and visible
    try {
        if (designLayer && uploadedDesign && uploadedDesign.src && designLayer.style.display !== 'none') {
            const overlayImg = await new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = uploadedDesign.src;
            });
            const designRect = designLayer.getBoundingClientRect();
            const dx = designRect.left - wrapperRect.left;
            const dy = designRect.top - wrapperRect.top;
            const dw = designRect.width;
            const dh = designRect.height;
            const rotationDeg = parseFloat(designLayer.dataset.rotation || '0') || 0;

            const cx = dx + dw / 2;
            const cy = dy + dh / 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((rotationDeg * Math.PI) / 180);
            ctx.drawImage(overlayImg, -dw / 2, -dh / 2, dw, dh);
            ctx.restore();
        }
    } catch (e) {
        console.warn('overlay draw failed', e);
    }

    try {
        return canvas.toDataURL('image/png');
    } catch (e) {
        return null;
    }
}

window.buildCompositeDataUrl = buildCompositeDataUrl;