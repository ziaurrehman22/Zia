/* ==========================================
   ZIA CLOTHING - COMPLETE MAIN SCRIPT (2026)
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
        name: "Black Formal-Shirt",
        price: 1499,
        category: "formal shirts",
        image: "images/black-formal.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "Crisp cotton oxford shirt tailored for executive meetings and formal events.",
        details: "Made from 100% long-staple Egyptian cotton for high durability and breathability. Features a tailored slim fit, button-down collar, and stain-resistant treatment."
    },
    {
        id: 2,
        name: "White Formal-Shirt",
        price: 1499,
        category: "formal shirts",
        image: "images/formal-white.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "A clean, stylish cotton shirt built for work and formal events.",
        details: "Made with 100% pure Egyptian cotton for a soft, breathable feel. Comes in a modern slim fit with a neat button-down collar and stain-resistant fabric."
    },
    {
        id: 3,
        name: "Charcoal-Gray Formal-Shirt",
        price: 1499,
        category: "formal shirts",
        image: "images/charcoal-gray-formal.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "A clean, stylish cotton shirt built for work and formal events.",
        details: "Made with 100% pure Egyptian cotton for a soft, breathable feel. Comes in a modern slim fit with a neat button-down collar and stain-resistant fabric."
    },
    {
        id: 4,
        name: "Light-Gray Formal-Shirt",
        price: 1499,
        category: "formal shirts",
        image: "images/light-gray-formal.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "A clean, stylish cotton shirt built for work and formal events.",
        details: "Made with 100% pure Egyptian cotton for a soft, breathable feel. Comes in a modern slim fit with a neat button-down collar and stain-resistant fabric."
    },
    {
        id: 5,
        name: "Textured Cotton Polo",
        price: 2100,
        category: "polo shirts",
        image: "images/black-polo.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "A stylish polo with a clean texture, perfect for casual outings.",
        details: "Crafted from 100% premium cotton with a soft feel. Designed with a tailored fit, rib-knit cuffs, and fade-resistant fabric."
    },
    {
        id: 6,
        name: "Textured Cotton Polo",
        price: 2100,
        category: "polo shirts",
        image: "images/white-polo.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "A stylish polo with a clean texture, perfect for casual outings.",
        details: "Crafted from 100% premium cotton with a soft feel. Designed with a tailored fit, rib-knit cuffs, and fade-resistant fabric."
    },
    {
        id: 7,
        name: "Textured Cotton Polo",
        price: 2100,
        category: "polo shirts",
        image: "images/blue-polo.jfif",
        sizes: ["S", "M", "L", "XL"],
        description: "A stylish polo with a clean texture, perfect for casual outings.",
        details: "Crafted from 100% premium cotton with a soft feel. Designed with a tailored fit, rib-knit cuffs, and fade-resistant fabric."
    },
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
        <article class="product-card scroll-reveal" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                
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

    initScrollAnimations();
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

/* 5. ADD TO CART WITH MEANINGFUL SWEETALERT */
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

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Added to Shopping Bag!`,
            html: `<strong>${product.name}</strong> (Size: ${size})`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
    }
}

/* 6. UPDATE CART COUNT WITH ANIMATION */
function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (!count) return;

    const totalQuantity = getCart().reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    );

    count.textContent = totalQuantity;

    count.classList.remove("badge-animate");
    void count.offsetWidth;
    count.classList.add("badge-animate");
}

/* 7. QUICK-VIEW MODAL CONTROLLER */
const qvModal = document.getElementById("quick-view-modal");
const qvContent = document.getElementById("qv-modal-content");
const qvCloseBtn = document.getElementById("qv-close-btn");

function openQuickView(productId) {
    const product = products.find(p => p.id === Number(productId));
    if (!product || !qvModal || !qvContent) return;

    const sizes = product.sizes || ["S", "M", "L", "XL"];
    const defaultSize = sizes[0];

    qvContent.innerHTML = `
        <div class="qv-grid">
            <div class="qv-image-box">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="qv-details">
                <span class="detail-category">${product.category.toUpperCase()}</span>
                <h2 class="qv-title">${product.name}</h2>
                <div class="qv-price">${money(product.price)}</div>
                <p class="qv-description">${product.description}</p>
                <p class="qv-description" style="font-size: 12px; color: var(--white); background: var(--soft-blue); padding: 10px; border-radius: 8px;">${product.details}</p>
                
                <div class="card-size-selector" style="margin: 10px 0;">
                    <span style="font-size: 12px; color: var(--muted); display: block; margin-bottom: 6px;">Select Size:</span>
                    <div class="card-sizes" id="qv-size-group">
                        ${sizes.map((sz, i) => `<button type="button" class="card-size-btn ${i === 0 ? 'active' : ''}" data-size="${sz}">${sz}</button>`).join('')}
                    </div>
                </div>

                <div class="qv-actions">
                    <button class="btn full-btn" id="qv-add-btn" type="button" style="margin-top: 0;">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                    </button>
                </div>
            </div>
        </div>
    `;

    qvModal.classList.add("active");

    const sizeGroup = document.getElementById("qv-size-group");
    sizeGroup.addEventListener("click", (e) => {
        const btn = e.target.closest(".card-size-btn");
        if (!btn) return;
        sizeGroup.querySelectorAll(".card-size-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });

    document.getElementById("qv-add-btn").addEventListener("click", () => {
        const activeSizeBtn = sizeGroup.querySelector(".card-size-btn.active");
        const selectedSize = activeSizeBtn ? activeSizeBtn.dataset.size : defaultSize;
        addToCart(product.id, 1, selectedSize);
        closeQuickView();
    });
}

function closeQuickView() {
    if (qvModal) qvModal.classList.remove("active");
}

if (qvCloseBtn && qvModal) {
    qvCloseBtn.addEventListener("click", closeQuickView);
    qvModal.addEventListener("click", (e) => {
        if (e.target === qvModal) closeQuickView();
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
            openQuickView(card.dataset.id);
        }
    });
}

/* 8. CART PAGE RENDER */
function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <h2>Your Shopping Bag Is Empty</h2>
                <p>Discover your next favorite outfit from the ZIA collection.</p>
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
                    <p class="cart-item-price">${money(Number(item.price) * Number(item.quantity))}</p>
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
            const targetItem = cart.find(p => p.id === id && p.size === size);
            cart = cart.filter(product => !(product.id === id && product.size === size));

            if (typeof Swal !== 'undefined' && targetItem) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'info',
                    title: 'Item Removed',
                    html: `<strong>${targetItem.name}</strong> removed from bag`,
                    showConfirmButton: false,
                    timer: 1800
                });
            }
        }

        saveCart(cart);
        renderCart();
    });

    renderCart();
}

/* 9. WHATSAPP CHECKOUT WITH REGEX & MEANINGFUL SWEETALERT */
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        const cart = getCart();

        if (cart.length === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Your Bag is Empty',
                    text: 'Please select items from our collection before proceeding to checkout.',
                    confirmButtonText: 'Explore Collection'
                });
            }
            return;
        }

        const nameInput = document.getElementById("customer-name");
        const phoneInput = document.getElementById("customer-phone");
        const addressInput = document.getElementById("customer-address");

        const name = nameInput?.value.trim();
        const phone = phoneInput?.value.trim();
        const address = addressInput?.value.trim();

        // Clear existing errors
        [nameInput, phoneInput, addressInput].forEach(inp => inp?.classList.remove('error'));

        if (!name || !phone || !address) {
            if (!name && nameInput) nameInput.classList.add('error');
            if (!phone && phoneInput) phoneInput.classList.add('error');
            if (!address && addressInput) addressInput.classList.add('error');

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Missing Required Fields',
                    text: 'Please fill out your Name, Contact Number, and Delivery Address.',
                    confirmButtonText: 'Got It'
                });
            }
            return;
        }

        const flexiblePhoneRegex = /^(\+92|92|0)?3\d{9}$/;
        if (!flexiblePhoneRegex.test(phone.replace(/[\s-]/g, ''))) {
            if (phoneInput) phoneInput.classList.add('error');
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Mobile Number',
                    text: 'Please enter a valid Pakistani mobile number (e.g. 03001234567 or +923001234567).',
                    confirmButtonText: 'Try Again'
                });
            }
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        const itemsSummaryList = cart.map(item => `<li>${item.name} (${item.size}) x ${item.quantity} - <strong>${money(item.price * item.quantity)}</strong></li>`).join("");

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Confirm & Place Order',
                html: `
                    <div style="text-align: left; font-size: 13px; color: var(--white); background: var(--soft-blue); padding: 15px; border-radius: 10px; margin-top: 10px;">
                        <p style="margin-bottom: 6px;"><strong>Deliver to:</strong> ${name}</p>
                        <p style="margin-bottom: 6px;"><strong>Phone:</strong> ${phone}</p>
                        <p style="margin-bottom: 12px;"><strong>Address:</strong> ${address}</p>
                        <hr style="border: 0; border-top: 1px solid var(--border); margin: 8px 0;">
                        <ul style="padding-left: 18px; margin-bottom: 10px;">${itemsSummaryList}</ul>
                        <p style="font-size: 15px; font-weight: bold; color: var(--accent);">Total: ${money(subtotal)} (COD)</p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#25D366',
                cancelButtonColor: '#727D73',
                confirmButtonText: '<i class="fa-brands fa-whatsapp"></i> Open WhatsApp',
                cancelButtonText: 'Modify Order'
            }).then((result) => {
                if (result.isConfirmed) {
                    executeWhatsAppCheckout(cart, { name, phone, address });
                }
            });
        } else {
            executeWhatsAppCheckout(cart, { name, phone, address });
        }
    });
}

function executeWhatsAppCheckout(cart, customer) {
    const phoneNumber = "923710201700";
    let orderText = "*Hello ZIA Clothing!* I would like to place a new order:";

    orderText += "*Customer Details:*";
    orderText += `• Name: ${customer.name}
`;
    orderText += `• Phone: ${customer.phone}
`;
    orderText += `• Address: ${customer.address}

`;

    orderText += "*Order Items:*" ;
    cart.forEach((item, index) => {
        orderText += `${index + 1}. ${item.name} (Size: ${item.size || 'M'}) x ${item.quantity} - ${money(Number(item.price) * Number(item.quantity))}
`;
    });

    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    orderText += `
*Total Amount:* ${money(subtotal)}
`;
    orderText += `• Payment Method: Cash on Delivery (COD)

`;
    orderText += "Please confirm my order. Thank you!";

    const whatsappURL = `https://wa.me/${phoneNumber}?text=` + encodeURIComponent(orderText);

    const whatsappWindow = window.open(whatsappURL, "_blank");
    if (!whatsappWindow) {
        window.location.href = whatsappURL;
    }

    setTimeout(() => {
        localStorage.removeItem("ziaCart");
        window.location.href = "thank-you.html";
    }, 1500);
}

/* 10. THEME TOGGLE & INITIALIZATION */
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

    initScrollAnimations();
    initBackToTop();
});

/* 11. RESET CART */
const resetCartBtn = document.getElementById("reset-cart-btn");

if (resetCartBtn) {
    resetCartBtn.addEventListener("click", () => {
        const cart = getCart();

        if (cart.length === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'info',
                    title: 'Bag is Already Empty',
                    text: 'There are no items to reset in your bag.',
                    confirmButtonText: 'OK'
                });
            }
            return;
        }

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Clear Shopping Bag?',
                text: 'Are you sure you want to remove all selected items from your bag?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#EF4444',
                cancelButtonColor: '#64748B',
                confirmButtonText: 'Yes, Clear All',
                cancelButtonText: 'Keep Items'
            }).then((result) => {
                if (result.isConfirmed) {
                    clearCartData();
                }
            });
        } else {
            if (confirm("Are you sure you want to clear all items from your bag?")) {
                clearCartData();
            }
        }
    });
}

function clearCartData() {
    localStorage.removeItem("ziaCart");
    renderCart();
    updateCartCount();

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Shopping Bag Cleared',
            showConfirmButton: false,
            timer: 1800,
            timerProgressBar: true
        });
    }
}

/* 12. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) */
function initScrollAnimations() {
    const targets = document.querySelectorAll(".scroll-reveal, .fade-in, .slide-left, .slide-right");
    if (!targets.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    targets.forEach(el => observer.observe(el));
}

/* 13. BACK TO TOP BUTTON */
function initBackToTop() {
    const backBtn = document.getElementById("backToTop");
    if (!backBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backBtn.classList.add("visible");
        } else {
            backBtn.classList.remove("visible");
        }
    });

    backBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}