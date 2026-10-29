/* ==========================================
   ZIA CLOTHING
   The Art of Dressing
   Complete JavaScript
========================================== */


/* ==========================================
   1. MIGRATE OLD CART DATA
========================================== */

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
                        quantity: Math.max(
                            1,
                            Number(item.quantity) || 1
                        )
                    }))
                )
            );

            console.log("Old cart data migrated successfully.");
        }
    } catch (error) {
        console.error("Cart migration failed:", error);
    }
})();


/* ==========================================
   2. CLOTHING PRODUCTS
========================================== */

const products = [
    {
        id: 1,
        name: "Minimalist Oxford Shirt",
        price: 2400,
        category: "formal shirts",
        image: "images/white-shirt.jfif",
        description: "Crisp cotton oxford shirt tailored for executive meetings and formal events."
    },
    {
        id: 2,
        name: "Vintage Washed Denim Shirt",
        price: 2600,
        category: "shirts",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
        description: "Soft indigo wash denim shirt built for rugged everyday styling."
    },
    {
        id: 3,
        name: "Pleated Tailored Trousers",
        price: 3100,
        category: "trousers",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
        description: "Relaxed-yet-sharp pleated trousers designed with premium stretch fabric."
    },
    {
        id: 4,
        name: "Monochrome Streetwear Tee",
        price: 1400,
        category: "t-shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
        description: "Heavyweight cotton tee featuring a clean, modern chest graphic."
    },
    {
        id: 5,
        name: "Structured Knit Polo",
        price: 2100,
        category: "polo shirts",
        image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        description: "Breathable knit polo shirt offering a sophisticated smart-casual silhouette."
    },
    {
        id: 6,
        name: "Oversized Heritage Hoodie",
        price: 3500,
        category: "hoodies",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
        description: "Plush fleece oversized hoodie crafted for supreme comfort and cozy layering."
    },
    {
        id: 7,
        name: "Botanical Silk-Blend Cabana Shirt",
        price: 2700,
        category: "casual shirts",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
        description: "Lightweight resort shirt featuring an artistic tropical leaf pattern."
    },
    {
        id: 8,
        name: "Cuban Collar Striped Shirt",
        price: 2500,
        category: "casual shirts",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        description: "Retro-inspired vertical stripe shirt with an open camp collar."
    },
    {
        id: 9,
        name: "Sueded Finish Overshirt",
        price: 3400,
        category: "jackets",
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
        description: "Luxurious faux-suede overshirt designed for transitional weather layering."
    },
    {
        id: 10,
        name: "Essential Charcoal Pullover",
        price: 3200,
        category: "hoodies",
        image: "images/black-hoodie.jfif",
        description: "Clean, minimalist dark charcoal hoodie with a double-lined hood."
    }
];


/* ==========================================
   3. LOCAL STORAGE HELPERS
========================================== */

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem("ziaCart") || "[]"
        );

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("ziaCart", JSON.stringify(cart));
}

function money(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK");
}


/* ==========================================
   4. DISPLAY & FILTER PRODUCTS
========================================== */

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

    productGrid.innerHTML = itemsToDisplay.map(product => `
        <article class="product-card" data-card-id="${product.id}">
            <div class="product-image" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 style="cursor: pointer;">${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-bottom">
                    <span class="price">${money(product.price)}</span>
                    <button class="add-btn" data-add="${product.id}" type="button">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Initial display
displayProducts();

// Category button selection handling
if (categorySection) {
    categorySection.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-btn");
        if (!btn) return;

        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedCategory = btn.dataset.category;
        displayProducts(selectedCategory);
    });
}

if (productGrid) {
    productGrid.addEventListener("click", event => {
        const addButton = event.target.closest("[data-add]");

        if (addButton) {
            addToCart(Number(addButton.dataset.add));
            return;
        }

        const card = event.target.closest(".product-card");
        if (card) {
            const productId = Number(card.dataset.cardId);
            openProductModal(productId);
        }
    });
}


/* ==========================================
   5. ADD PRODUCT TO CART
========================================== */

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    const button = document.querySelector(
        `[data-add="${id}"]`
    );

    if (button) {
        const originalHTML = button.innerHTML;

        button.innerHTML =
            '<i class="fa-solid fa-check"></i> Added';

        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 1000);
    }
}


/* ==========================================
   6. UPDATE CART COUNT
========================================== */

function updateCartCount() {
    const count = document.getElementById("cart-count");

    if (!count) return;

    const totalQuantity = getCart().reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    );

    count.textContent = totalQuantity;
}


/* ==========================================
   7. PRODUCT DETAIL MODAL LOGIC
========================================== */

const modal = document.getElementById("product-modal");
const modalCloseBtn = document.getElementById("modal-close");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const modalAddBtn = document.getElementById("modal-add-btn");

function openProductModal(productId) {
    if (!modal) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalImg.src = product.image;
    modalImg.alt = product.name;
    modalTitle.textContent = product.name;
    modalCategory.textContent = product.category.toUpperCase();
    modalDescription.textContent = product.description;
    modalPrice.textContent = money(product.price);

    if (modalAddBtn) {
        modalAddBtn.onclick = () => {
            addToCart(product.id);
        };
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeProductModal);
}

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeProductModal();
        }
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
        closeProductModal();
    }
});


/* ==========================================
   8. DARK / LIGHT THEME TOGGLE
========================================== */

(function initTheme() {
    const savedTheme = localStorage.getItem("ziaTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

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