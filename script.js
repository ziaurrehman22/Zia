/* ==========================================
   ZIA CLOTHING - MAIN SCRIPT
========================================== */

/* 1. MIGRATE OLD CART DATA */
(function migrateCartData() {
    const oldCart = localStorage.getItem("fireBiteCart");
    const newCart = localStorage.getItem("ziaCart");

    if (!oldCart || newCart !== null) return;

    try {
        const parsedCart = JSON.parse(oldCart);
        if (Array.isArray(parsedCart)) {
            localStorage.setItem(
                "ziaCart",
                JSON.stringify(
                    parsedCart.map(item => ({
                        ...item,
                        quantity: Math.max(1, Number(item.quantity) || 1),
                        size: item.size || "M"
                    }))
                )
            );
        }
    } catch (error) {
        console.error("Cart migration failed:", error);
    }
})();

/* 2. CLOTHING PRODUCTS DATA */
const products = [
    {
        id: 1,
        name: "Minimalist Oxford Shirt",
        price: 2400,
        category: "formal shirts",
        image: "images/white-shirt.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "Crisp cotton oxford shirt tailored for executive meetings and formal events.",
        details: "Made from 100% long-staple Egyptian cotton for high durability and breathability. Features a tailored slim fit, button-down collar, and stain-resistant treatment."
    },
    {
        id: 2,
        name: "Vintage Washed Denim Shirt",
        price: 2600,
        category: "shirts",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
        sizes: ["M", "L", "XL", "XXL"],
        description: "Soft indigo wash denim shirt built for rugged everyday styling.",
        details: "Hand-washed vintage denim constructed with reinforced twin-needle stitching. Designed with dual flap chest pockets and snap buttons."
    },
    {
        id: 3,
        name: "Pleated Tailored Trousers",
        price: 3100,
        category: "trousers",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
        sizes: ["30", "32", "34", "36", "38"],
        description: "Relaxed-yet-sharp pleated trousers designed with premium stretch fabric.",
        details: "Premium wool-blend chino with subtle flex elasticity. Features double front pleats, hidden expandable waistband, and rear welt pockets."
    },
    {
        id: 4,
        name: "Monochrome Streetwear Tee",
        price: 1400,
        category: "t-shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
        sizes: ["S", "M", "L", "XL"],
        description: "Heavyweight cotton tee featuring a clean, modern chest graphic.",
        details: "240 GSM heavy combed cotton. Relaxed drop-shoulder silhouette with screen-printed minimalist emblem that retains color wash after wash."
    },
    {
        id: 5,
        name: "Structured Knit Polo",
        price: 2100,
        category: "polo shirts",
        image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        sizes: ["M", "L", "XL"],
        description: "Breathable knit polo shirt offering a sophisticated smart-casual silhouette.",
        details: "Fine-gauge cotton piqué blend designed to stay cool under heat. Features rib-knit cuffs, a classic three-button placket, and collar anti-roll ribs."
    },
    {
        id: 6,
        name: "Oversized Heritage Hoodie",
        price: 3500,
        category: "hoodies",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
        sizes: ["S", "M", "L", "XL", "XXL"],
        description: "Plush fleece oversized hoodie crafted for supreme comfort and cozy layering.",
        details: "380 GSM ultra-soft fleece back lining. Heavy-duty double-layered hood, spacious kangaroo front pocket, and pre-shrunk fabric construction."
    },
    {
        id: 7,
        name: "Botanical Silk-Blend Cabana Shirt",
        price: 2700,
        category: "casual shirts",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
        sizes: ["S", "M", "L"],
        description: "Lightweight resort shirt featuring an artistic tropical leaf pattern.",
        details: "Breathable silk-rayon blend tailored with a straight relaxed hem and side vents. Perfect for warm climate events and casual getaways."
    },
    {
        id: 8,
        name: "Cuban Collar Striped Shirt",
        price: 2500,
        category: "casual shirts",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        sizes: ["M", "L", "XL"],
        description: "Retro-inspired vertical stripe shirt with an open camp collar.",
        details: "Soft linen-cotton blend designed with an open relaxed collar structure and natural coconut shell buttons."
    },
    {
        id: 9,
        name: "Sueded Finish Overshirt",
        price: 3400,
        category: "jackets",
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
        sizes: ["M", "L", "XL"],
        description: "Luxurious faux-suede overshirt designed for transitional weather layering.",
        details: "Micro-suede texture with satin inner lining. Fitted with heavy metal button closures and dual functional breast flap pockets."
    },
    {
        id: 10,
        name: "Essential Charcoal Pullover",
        price: 3200,
        category: "hoodies",
        image: "images/black-hoodie.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "Clean, minimalist dark charcoal hoodie with a double-lined hood.",
        details: "Mid-weight cotton poly blend. Includes rib-knit hem and cuffs with anti-pill finishing for long-term wear."
    }
];

/* 3. HELPERS */
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("ziaCart") || "[]");
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("ziaCart", JSON.stringify(cart));
}

function money(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK");
}

/* 4. DISPLAY PRODUCTS IN GRID WITH SIZES */
const productGrid = document.getElementById("product-grid");
const categorySection = document.getElementById("category-section");

function displayProducts(filteredCategory = "all") {
    if (!productGrid) return;

    const itemsToDisplay = filteredCategory === "all"
        ? products
        : products.filter(p => p.category.toLowerCase() === filteredCategory.toLowerCase());

    if (itemsToDisplay.length === 0) {
        productGrid.innerHTML = `
            <p style="grid-column: 1 / -1; text-align: center; color: var(--muted); padding: 40px 0;">
                No products found in this category.
            </p>
        `;
        return;
    }

    productGrid.innerHTML = itemsToDisplay.map(product => {
        const sizes = product.sizes || ["S", "M", "L", "XL"];
        return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image clickable-detail">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="clickable-detail">${product.name}</h3>
                <p class="clickable-detail">${product.description}</p>
                
                <!-- Product Card Size Selector -->
                <div class="card-size-selector">
                    <span style="font-size: 12px; color: var(--muted); display: block; margin-bottom: 5px;">Select Size:</span>
                    <div class="card-sizes">
                        ${sizes.map((sz, i) => `<button type="button" class="card-size-btn ${i === 0 ? 'active' : ''}" data-size="${sz}">${sz}</button>`).join('')}
                    </div>
                </div>

                <div class="product-bottom" style="margin-top: 15px;">
                    <span class="price">${money(product.price)}</span>
                    <button class="add-btn" data-add="${product.id}" type="button">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                    </button>
                </div>
            </div>
        </article>
    `}).join("");
}

displayProducts();

if (categorySection) {
    categorySection.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-btn");
        if (!btn) return;

        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        displayProducts(btn.dataset.category);
    });
}

if (productGrid) {
    productGrid.addEventListener("click", event => {
        const sizeBtn = event.target.closest(".card-size-btn");
        if (sizeBtn) {
            const sizeContainer = sizeBtn.closest(".card-sizes");
            sizeContainer.querySelectorAll(".card-size-btn").forEach(b => b.classList.remove("active"));
            sizeBtn.classList.add("active");
            return;
        }

        const button = event.target.closest("[data-add]");
        if (button) {
            const card = button.closest(".product-card");
            const activeSizeBtn = card.querySelector(".card-size-btn.active");
            const selectedSize = activeSizeBtn ? activeSizeBtn.dataset.size : "M";
            addToCart(Number(button.dataset.add), 1, selectedSize);
            return;
        }

        const card = event.target.closest(".product-card");
        if (card) {
            const productId = card.dataset.id;
            window.location.href = `product-detail.html?id=${productId}`;
        }
    });
}

/* 5. ADD TO CART */
function addToCart(id, qty = 1, size = "M") {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === id && item.size === size);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            ...product,
            quantity: qty,
            size: size
        });
    }

    saveCart(cart);
    updateCartCount();

    const button = document.querySelector(`[data-add="${id}"]`);
    if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 1000);
    }
}

/* 6. UPDATE CART COUNT */
function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (!count) return;

    const totalQuantity = getCart().reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    );

    count.textContent = totalQuantity;
}

/* 7. CART PAGE RENDER WITH SIZE CHANGING DROPDOWN */
function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <h2>Your Bag Is Empty</h2>
                <p>Discover your next favourite outfit from the ZIA collection.</p>
                <br>
                <a class="btn" href="index.html#menu">Explore Collection</a>
            </div>
        `;
    } else {
        container.innerHTML = cart.map((item, index) => {
            const product = products.find(p => p.id === item.id) || { sizes: ["S", "M", "L", "XL"] };
            const availableSizes = product.sizes || ["S", "M", "L", "XL"];

            return `
            <article class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <div style="margin: 6px 0; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 13px; color: var(--muted);">Size:</span>
                        <select class="cart-size-select" data-cart-index="${index}">
                            ${availableSizes.map(sz => `<option value="${sz}" ${sz === (item.size || 'M') ? 'selected' : ''}>${sz}</option>`).join('')}
                        </select>
                    </div>
                    <p>${money(item.price * item.quantity)}</p>
                    <div class="quantity">
                        <button data-change="-1" data-id="${item.id}" data-size="${item.size || 'M'}" type="button" aria-label="Decrease quantity">−</button>
                        <span>${item.quantity}</span>
                        <button data-change="1" data-id="${item.id}" data-size="${item.size || 'M'}" type="button" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-remove="${item.id}" data-size="${item.size || 'M'}" type="button" aria-label="Remove ${item.name}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </article>
        `}).join("");
    }

    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    if (subtotalElement) subtotalElement.textContent = money(subtotal);
    if (totalElement) totalElement.textContent = money(subtotal);

    updateCartCount();
}

const cartItems = document.getElementById("cart-items");
if (cartItems) {
    // Handle size change directly from cart dropdown
    cartItems.addEventListener("change", event => {
        const selectElem = event.target.closest(".cart-size-select");
        if (!selectElem) return;

        const cartIndex = Number(selectElem.dataset.cartIndex);
        const newSize = selectElem.value;
        let cart = getCart();

        if (cart[cartIndex]) {
            cart[cartIndex].size = newSize;
            saveCart(cart);
            renderCart();
        }
    });

    cartItems.addEventListener("click", event => {
        const changeButton = event.target.closest("[data-change]");
        const removeButton = event.target.closest("[data-remove]");
        let cart = getCart();

        if (changeButton) {
            const id = Number(changeButton.dataset.id);
            const size = changeButton.dataset.size;
            const item = cart.find(product => product.id === id && product.size === size);
            if (item) {
                item.quantity += Number(changeButton.dataset.change);
            }
            cart = cart.filter(product => product.quantity > 0);
        }

        if (removeButton) {
            const id = Number(removeButton.dataset.remove);
            const size = removeButton.dataset.size;
            cart = cart.filter(product => !(product.id === id && product.size === size));
        }

        saveCart(cart);
        renderCart();
    });

    renderCart();
}

/* 8. PRODUCT DETAIL PAGE CONTROLLER */
function initProductDetailPage() {
    const detailContainer = document.getElementById("product-detail-container");
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get("id"));
    const product = products.find(p => p.id === productId);

    if (!product) {
        detailContainer.innerHTML = `
            <div style="text-align:center; padding: 60px 0;">
                <h2>Product Not Found</h2>
                <p style="color: var(--muted); margin: 15px 0;">The item you are looking for does not exist.</p>
                <a href="index.html#menu" class="btn"><i class="fa-solid fa-arrow-left"></i> Back to Collection</a>
            </div>
        `;
        return;
    }

    const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
    const defaultSize = availableSizes[0];

    const sizeButtonsHTML = availableSizes.map((size, index) => `
        <label class="size-radio-label ${index === 0 ? 'active' : ''}">
            <input type="radio" name="product_size" value="${size}" ${index === 0 ? 'checked' : ''} style="display: none;">
            <span>${size}</span>
        </label>
    `).join("");

    detailContainer.innerHTML = `
        <div class="product-detail-grid">
            <div class="detail-gallery">
                <div class="main-image-box">
                    <img id="detail-main-img" src="${product.image}" alt="${product.name}">
                </div>
                <div class="thumbnail-list">
                    <img class="thumb active" src="${product.image}" alt="${product.name}">
                    <img class="thumb" src="${product.image}" alt="${product.name} view 2">
                </div>
            </div>

            <div class="detail-info">
                <span class="detail-category">${product.category.toUpperCase()}</span>
                <h1 class="detail-title">${product.name}</h1>
                
                <div class="detail-rating">
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star-half-stroke"></i>
                    </div>
                    <span class="rating-count">4.8 (124 ratings)</span>
                </div>

                <div class="detail-price-box">
                    <span class="detail-price">${money(product.price)}</span>
                    <span class="stock-status" style="color: #27AE60;"><i class="fa-solid fa-check-circle"></i> In Stock</span>
                </div>

                <p class="detail-description">${product.description}</p>
                
                <div class="detail-specifications">
                    <h4>Product Highlights</h4>
                    <p>${product.details}</p>
                </div>

                <div class="detail-options">
                    <label>Select Size: <strong id="selected-size-label" style="color: var(--orange);">${defaultSize}</strong></label>
                    <div class="size-selector" id="size-selector-group">
                        ${sizeButtonsHTML}
                    </div>
                </div>

                <div class="detail-actions">
                    <div class="qty-picker">
                        <button id="qty-minus" type="button">-</button>
                        <input id="detail-qty" type="number" value="1" min="1" readonly>
                        <button id="qty-plus" type="button">+</button>
                    </div>
                    <button class="btn add-to-bag-btn" id="add-to-bag-detail" type="button">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                    </button>
                </div>
            </div>
        </div>
    `;

    const qtyInput = document.getElementById("detail-qty");
    document.getElementById("qty-minus").addEventListener("click", () => {
        let current = parseInt(qtyInput.value) || 1;
        if (current > 1) qtyInput.value = current - 1;
    });

    document.getElementById("qty-plus").addEventListener("click", () => {
        let current = parseInt(qtyInput.value) || 1;
        qtyInput.value = current + 1;
    });

    const sizeGroup = document.getElementById("size-selector-group");
    const sizeLabel = document.getElementById("selected-size-label");

    sizeGroup.addEventListener("click", (e) => {
        const clickedLabel = e.target.closest(".size-radio-label");
        if (!clickedLabel) return;

        sizeGroup.querySelectorAll(".size-radio-label").forEach(l => l.classList.remove("active"));
        clickedLabel.classList.add("active");

        const radioInput = clickedLabel.querySelector("input[type='radio']");
        if (radioInput) {
            radioInput.checked = true;
            if (sizeLabel) sizeLabel.textContent = radioInput.value;
        }
    });

    document.getElementById("add-to-bag-detail").addEventListener("click", (e) => {
        const qty = parseInt(qtyInput.value) || 1;
        const checkedRadio = sizeGroup.querySelector("input[type='radio']:checked");
        const selectedSize = checkedRadio ? checkedRadio.value : defaultSize;

        addToCart(product.id, qty, selectedSize);

        const origBtn = e.currentTarget.innerHTML;
        e.currentTarget.innerHTML = `<i class="fa-solid fa-check"></i> Added (${selectedSize})!`;
        setTimeout(() => {
            e.currentTarget.innerHTML = origBtn;
        }, 1200);
    });
}

document.addEventListener("DOMContentLoaded", initProductDetailPage);

/* 9. WHATSAPP CHECKOUT */
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        const message = document.getElementById("checkout-message");
        const cart = getCart();

        if (cart.length === 0) {
            message.textContent = "Your shopping bag is empty!";
            return;
        }

        const phoneNumber = "923710201700";
        let orderText = "Hello ZIA Clothing! I would like to place this order:\n\n";

        cart.forEach((item, index) => {
            orderText += `${index + 1}. ${item.name} (Size: ${item.size || 'M'}) x ${item.quantity} - ${money(item.price * item.quantity)}\n`;
        });

        const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

        orderText += `\nTotal Amount: ${money(subtotal)}\n`;
        orderText += "\nPlease confirm availability and delivery details.";
        orderText += "\nHow much delivery charges?";
        orderText += "\nThank you!";

        const whatsappURL = `https://wa.me/${phoneNumber}?text=` + encodeURIComponent(orderText);
        message.textContent = "Opening WhatsApp to review your order...";

        const whatsappWindow = window.open(whatsappURL, "_blank");
        if (!whatsappWindow) window.location.href = whatsappURL;
    });
}

/* 10. INITIALIZATION & THEME */
updateCartCount();

(function initTheme() {
    const savedTheme = localStorage.getItem("ziaTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
        const updateIcon = () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            themeToggleBtn.innerHTML = currentTheme === "dark"
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
        };

        updateIcon();

        themeToggleBtn.addEventListener("click", () => {
            let currentTheme = document.documentElement.getAttribute("data-theme");
            let newTheme = currentTheme === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("ziaTheme", newTheme);
            updateIcon();
        });
    }
});