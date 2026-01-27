// بيانات الولايات والبلديات المنقحة
const statesList = [];
const communesData = {};
const deliveryData = {};

let stateInput, communeInput, communeGroup, qtyInput, delInput, couponInput, sizeOpts, colorOpts, officeInput, officeGroup, backBtn, selectedSize = '';
let customStateInput, customCommuneInput, customCommuneGroup, customDelInput, customOfficeInput, customOfficeGroup, customQtyInput, customCouponInput;
let selectedColor = '';
const CM_PER_PX = 0.185;
const DESIGN_SIZE_OFFSET_CM = 9;
let selectedCustomColor = 'white';
let selectedCustomSide = 'front';
let productImages = [];
let productGalleryIndex = 0;
let detailGalleryIndex = 0;
let isBackBtnVisible = false;

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
    document.body.classList.add('show-greeting');
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
    
    stateInput = document.getElementById('state');
    communeInput = document.getElementById('commune');
    communeGroup = document.getElementById('communeGroup');
    qtyInput = document.getElementById('quantity');
    delInput = document.getElementById('deliveryType');
    couponInput = document.getElementById('couponCode');
    officeInput = document.getElementById('office');
    officeGroup = document.getElementById('officeGroup');

    customStateInput = document.getElementById('customState');
    customCommuneInput = document.getElementById('customCommune');
    customCommuneGroup = document.getElementById('customCommuneGroup');
    customDelInput = document.getElementById('customDeliveryType');
    customOfficeInput = document.getElementById('customOffice');
    customOfficeGroup = document.getElementById('customOfficeGroup');
    customQtyInput = document.getElementById('customQuantity');
    customCouponInput = document.getElementById('customCouponCode');
    sizeOpts = document.querySelectorAll('.size-option');
    colorOpts = document.querySelectorAll('.color-option');
    
    Promise.all([
        fetch('data.json').then(r => r.json()).catch(() => null),
        fetch('offices.json').then(r => r.json()).catch(() => null)
    ])
    .then(([dataJson, officesJson]) => {
        // Merge offices into main data if they exist
        if (officesJson && officesJson.offices) {
            if (!window.__dynamicData.offices) {
                window.__dynamicData.offices = {};
            }
            window.__dynamicData.offices = { ...window.__dynamicData.offices, ...officesJson.offices };
        }
        initStates();
        initCustomStates();
        try { setupEventListeners(); } catch (e) { console.error('setupEventListeners error', e); }
        try { initGallery(); } catch(e) { console.error('initGallery error', e); }
        try { initCustomizationDefaults(); } catch(e) { console.error('initCustomizationDefaults error', e); }
        calculate();
        calculateCustom();
    })
    .catch(err => {
        console.error('Failed to load data files', err);
        initStates();
        initCustomStates();
        try { setupEventListeners(); } catch (e) { console.error('setupEventListeners error', e); }
        try { initGallery(); } catch(e) { console.error('initGallery error', e); }
        try { initCustomizationDefaults(); } catch(e) { console.error('initCustomizationDefaults error', e); }
        calculateCustom();
    });
}

function initGallery() {
    productImages = window.__productImages || [];
    if ((!productImages || productImages.length === 0)) {
        fetch('product-images-card1.json').then(r => r.json()).then(j => {
            productImages = (j && j.images) ? j.images : [];
            window.__productImages = productImages;
            setupGallery('productGalleryInner', 'productPrev', 'productNext', 'card');
            setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
        }).catch(err => {
            console.warn('No product images found, using default image.jpg', err);
            productImages = ['image.jpg'];
            setupGallery('productGalleryInner', 'productPrev', 'productNext', 'card');
            setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
        });
    } else {
        setupGallery('productGalleryInner', 'productPrev', 'productNext', 'card');
        setupGallery('productDetailGalleryInner', 'detailPrev', 'detailNext', 'detail');
    }
}

function setupGallery(innerId, prevId, nextId, which) {
    const inner = document.getElementById(innerId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!inner) return;

    if (!productImages || productImages.length === 0) productImages = ['image.jpg'];

    const idx = (which === 'card') ? productGalleryIndex : detailGalleryIndex;
    inner.innerHTML = '';
    const img = document.createElement('img');
    img.src = encodeURI(productImages[idx]);
    inner.appendChild(img);

    let isAnimating = false;

    function slide(dir) {
        if (isAnimating) return;
        isAnimating = true;
        
        const currentImg = inner.querySelector('img');
        const currentIndex = (which === 'card') ? productGalleryIndex : detailGalleryIndex;
        let nextIndex = (currentIndex + dir + productImages.length) % productImages.length;

        const nextImg = document.createElement('img');
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
        } else {
            backBtn.style.display = 'none';
            backBtn.style.opacity = '0';
            backBtn.style.pointerEvents = 'none';
            isBackBtnVisible = false;
        }
    }
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

// Function to show customization page with selected image
function showCustomizationPage(imagePath) {
    const previewPage = document.getElementById('customizationPreviewPage');
    const previewImage = document.getElementById('previewImage');
    const customProductPage = document.getElementById('customProductPage');
    
    if (previewImage) {
        previewImage.src = imagePath;
    }
    
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
    }
}

// Initialize design editor
function initDesignEditor() {
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
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
        const wCm = Math.max(0, Math.round(designLayer.offsetWidth * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM);
        const hCm = Math.max(0, Math.round(designLayer.offsetHeight * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM);
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
        }

        const rot = parseFloat(designLayer.dataset.rotation || '0');
        if (!Number.isNaN(rot)) {
            currentRotation = rot;
            designLayer.style.transform = `rotate(${currentRotation}deg)`;
        }
    };
    
    // Toggle edit mode
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            isEditMode = true;
            editPanel.classList.remove('hidden');
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            
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
            
            // Lock image
            if (designLayer && designLayer.style.display !== 'none') {
                designLayer.classList.add('locked');
                designLayer.style.cursor = 'default';
            }
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
            if (file && file.type === 'image/png') {
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
    }
}

function setupEventListeners() {
    const productCard = document.getElementById('productCard');
    const customCard = document.getElementById('customCard');
    backBtn = document.getElementById('backHome');
    
    if (productCard) {
        productCard.onclick = () => {
            try {
                const cardsContainer = document.querySelector('.cards-container');
                if (cardsContainer) cardsContainer.style.display = 'none';
                productCard.style.display = 'none';
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

        const buyBtn = productCard.querySelector('.view-details-btn');
        if (buyBtn) {
            buyBtn.onclick = (e) => {
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
    
    // Handle Customize button
    const customizeBtn = document.getElementById('customizeBtn');
    if (customizeBtn) {
        customizeBtn.onclick = (e) => {
            e.preventDefault();
            
            // Get selected values from custom product page
            const sideOptions = document.querySelectorAll('.side-option');
            const customColorOptions = document.querySelectorAll('.custom-product-page .color-option');
            
            let selectedSide = 'front';
            let selectedColor = 'white';
            
            // Find selected side
            sideOptions.forEach(opt => {
                if (opt.classList.contains('selected')) {
                    selectedSide = opt.dataset.side || 'front';
                }
            });
            
            // Find selected color
            customColorOptions.forEach(opt => {
                if (opt.classList.contains('selected')) {
                    selectedColor = opt.dataset.value || 'white';
                }
            });
            
            // Build image path
            const sideNum = selectedSide === 'front' ? '1' : '2';
            const imagePath = `images/dp1/mockup/${selectedColor}${sideNum}.png`;
            
            // Store in sessionStorage for the customization page
            sessionStorage.setItem('customizationData', JSON.stringify({
                color: selectedColor,
                side: selectedSide,
                imagePath: imagePath
            }));
            
            // Show customization page with the selected image
            showCustomizationPage(imagePath);
        };
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
    
    // Handle side selection in custom product page
    const sideOptions = document.querySelectorAll('.side-option');
    sideOptions.forEach(opt => {
        opt.onclick = () => {
            sideOptions.forEach(s => s.classList.remove('selected'));
            opt.classList.add('selected');
            selectedCustomSide = opt.dataset.side || 'front';
        };
    });
    
    // Handle color selection in custom product page
    const customPageColorOptions = document.querySelectorAll('.custom-product-page .color-option');
    customPageColorOptions.forEach(opt => {
        opt.onclick = () => {
            customPageColorOptions.forEach(c => c.classList.remove('selected'));
            opt.classList.add('selected');
            selectedCustomColor = opt.dataset.value || 'white';
        };
    });
    
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
                    o.value = "Centre Ville"; 
                    o.textContent = "Centre Ville";
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
    
    [qtyInput, delInput, couponInput].forEach(el => {
        if (el) el.oninput = calculate;
    });

    [customQtyInput, customDelInput, customCouponInput].forEach(el => {
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
                    o.value = "Centre Ville";
                    o.textContent = "Centre Ville";
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
                    }, 300);
                }
                // If custom product page is showing, go back to cards
                else if (customProductPage && customProductPage.style.display === 'flex') {
                    customProductPage.style.opacity = '0';
                    setTimeout(() => { 
                        customProductPage.style.display = 'none';
                        if (customCard) {
                            customCard.style.display = 'block';
                            customCard.style.opacity = '0';
                            setTimeout(() => {
                                customCard.style.opacity = '1';
                            }, 10);
                        }
                        if (cardsContainer) cardsContainer.style.display = 'flex';
                        setBackButtonVisible(false);
                        showGreeting();
                    }, 300);
                }
                // If order details page is showing, go back to product card
                else if (orderDetails && orderDetails.style.display === 'flex') {
                    orderDetails.style.opacity = '0';
                    setTimeout(() => { 
                        orderDetails.style.display = 'none';
                        if (productCard) {
                            productCard.style.display = 'block';
                            productCard.style.opacity = '0';
                            setTimeout(() => {
                                productCard.style.opacity = '1';
                            }, 10);
                        }
                        if (cardsContainer) cardsContainer.style.display = 'flex';
                        setBackButtonVisible(false);
                        showGreeting();
                    }, 300);
                }
                // Otherwise go back to cards
                else {
                    if (productCard) productCard.style.display = 'block';
                    if (customCard) customCard.style.display = 'block';
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
        // استخدم البيانات مع الأكواز
        statesWithCodes.forEach((state) => {
            let opt = document.createElement('option');
            opt.value = state.name;
            opt.textContent = `${state.code} - ${state.name}`;
            stateInput.appendChild(opt);
        });
    } else {
        // بدون أكواز
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
    const coupon = couponInput.value.trim().toLowerCase();
    
    let productPrice = qty * 3700;
    
    if(qty >= 2) {
        productPrice -= 500;
        document.getElementById('bulkDiscountMsg').style.display = 'block';
    } else {
        document.getElementById('bulkDiscountMsg').style.display = 'none';
    }

    if(coupon === 'stitchx') {
        productPrice -= 200;
        document.getElementById('couponDiscountMsg').style.display = 'block';
    } else {
        document.getElementById('couponDiscountMsg').style.display = 'none';
    }

    let delPrice = 0;
    if (state && type) {
        delPrice = getDeliveryForWilaya(state, type);
    }

    const finalPrice = Math.round((productPrice + delPrice) / 100) * 100;
    document.getElementById('delPrice').textContent = delPrice;
    document.getElementById('finalPrice').textContent = finalPrice;
}

function calculateCustom() {
    if (!customQtyInput || !customStateInput || !customDelInput || !customCouponInput) return;
    const qty = parseInt(customQtyInput.value) || 1;
    const state = customStateInput.value;
    const type = customDelInput.value;
    const coupon = customCouponInput.value.trim().toLowerCase();

    let productPrice = qty * 2500;

    const designLayer = document.getElementById('designLayer');
    let designExtra = 0;
    if (designLayer && designLayer.style.display !== 'none') {
        const wCm = Math.max(0, Math.round(designLayer.offsetWidth * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM);
        const hCm = Math.max(0, Math.round(designLayer.offsetHeight * CM_PER_PX) + DESIGN_SIZE_OFFSET_CM);
        designExtra = Math.round(wCm * hCm * 0.600);
    }
    productPrice += (designExtra * qty);

    const bulkMsg = document.getElementById('customBulkDiscountMsg');
    const couponMsg = document.getElementById('customCouponDiscountMsg');

    if (qty >= 2) {
        productPrice -= 500;
        if (bulkMsg) bulkMsg.style.display = 'block';
    } else if (bulkMsg) {
        bulkMsg.style.display = 'none';
    }

    if (coupon === 'stitchx') {
        productPrice -= 200;
        if (couponMsg) couponMsg.style.display = 'block';
    } else if (couponMsg) {
        couponMsg.style.display = 'none';
    }

    let delPrice = 0;
    if (state && type) {
        delPrice = getDeliveryForWilaya(state, type);
    }

    const delPriceEl = document.getElementById('customDelPrice');
    const finalPriceEl = document.getElementById('customFinalPrice');

    const finalPrice = Math.round((productPrice + delPrice) / 100) * 100;
    if (delPriceEl) delPriceEl.textContent = delPrice;
    if (finalPriceEl) finalPriceEl.textContent = finalPrice;
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

    let missingFields = false;
    if (!selectedSize || !name || !phone || !state || !deliveryType) {
        missingFields = true;
    }
    
    if (deliveryType === 'home' && !commune) {
        missingFields = true;
    }
    
    if (deliveryType === 'office' && !office) {
        missingFields = true;
    }
    
    if (missingFields) {
        if (err) {
            err.textContent = "Please fill all fields!";
            err.style.display = 'block';
        }
        return;
    }

    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = true;
    document.getElementById('orderDetails').style.display = 'none';
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