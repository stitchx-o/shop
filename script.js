:root {
    --primary-color: #fff;
    --secondary-color: #1a1a1a;
    --text-color: #e0e0e0;
    --light-gray: #2d2d2d;
    --accent-color: #dc3545;
    --success-color: #28a745;
}

body {
    font-family: 'Montserrat', sans-serif;
    margin: 0; background-color: var(--secondary-color);
    color: var(--text-color); direction: ltr;
    display: flex; justify-content: center; align-items: center; min-height: 100vh;
}

.fade-in { animation: fadeInUp 0.6s ease forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.product-card-section {
    background: var(--light-gray); padding: 40px; text-align: center;
    max-width: 400px; border: 1px solid #333; cursor: pointer;
}
.product-card-section img { width: 100%; margin-bottom: 20px; }

.special-offer-badge { font-size: 3.5em; font-weight: 900; line-height: 0.9; margin-bottom: 10px; }

.old-price { text-decoration: line-through; color: #888; margin-right: 10px; }
.new-price { color: var(--accent-color); font-size: 2.2em; font-weight: 900; }

.view-details-btn {
    background: #444; color: white; padding: 15px 30px; border: none;
    font-weight: 700; cursor: pointer; margin-top: 20px; font-family: inherit;
}

.container { display: flex; flex-wrap: wrap; max-width: 1100px; margin: 20px; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
.order-details-section { display: none; opacity: 0; }

.product-image-section { flex: 1; min-width: 300px; background: #111; display: flex; align-items: center; padding: 20px; }
.product-image-section img { width: 100%; }

.product-details-section { flex: 1.2; min-width: 350px; padding: 40px; background: var(--secondary-color); }

.big-offer-title { font-size: 3em; font-weight: 900; color: white; margin-bottom: 5px; }
.promo-banner { background: white; color: black; padding: 10px; font-weight: 900; text-align: center; margin-bottom: 20px; font-size: 1.1em; }

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 700; color: #aaa; font-size: 0.9em; }
.form-group input, .form-group select {
    width: 100%; padding: 12px; background: var(--light-gray); color: white; border: 1px solid #444; font-family: inherit; box-sizing: border-box;
}

.size-options { display: flex; gap: 10px; }
.size-option {
    width: 50px; height: 50px; border: 2px solid #444; display: flex; 
    justify-content: center; align-items: center; cursor: pointer; font-weight: 700;
}
.size-option.selected { background: white; color: black; border-color: white; }

.price-summary { background: #111; padding: 20px; border: 2px dashed #444; margin: 20px 0; }
.discount-label { color: var(--success-color); font-weight: 700; margin-bottom: 5px; display: none; }
.total-final { font-size: 2em; font-weight: 900; }
.total-final span { color: var(--accent-color); }

.order-btn {
    width: 100%; padding: 20px; background: white; color: black; border: none;
    font-size: 1.4em; font-weight: 900; cursor: pointer;
}

.error-msg { background: rgba(220, 53, 69, 0.1); color: #ff5e5e; padding: 10px; margin-bottom: 15px; border-left: 4px solid var(--accent-color); display: none; font-weight: 700; }

.success-container { display: none; text-align: center; padding: 100px 20px; width: 100%; }
.success-card { background: var(--light-gray); padding: 50px; max-width: 500px; margin: auto; }

@media (max-width: 768px) { .container { flex-direction: column; } }
