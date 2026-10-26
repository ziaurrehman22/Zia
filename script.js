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

formal shirts
shirts
trousers
t-shirts
polo shirts
hoodies
other shirts


   2. CLOTHING PRODUCTS
========================================== */

const products = [
    {
        id: 1,
        name: "Classic White Formal Shirt",
        price: 1800,
        category: "formal shirts",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        description: "A timeless formal shirt for a clean, elegant look."
    },
    {
        id: 2,
        name: "Casual Blue Shirt",
        price: 2200,
        category: "shirts",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
        description: "Comfortable style for everyday wear."
    },
    {
        id: 3,
        name: "Classic Trousers",
        price: 2800,
        category: "trousers",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
        description: "Smart trousers for a polished appearance."
    },
    {
        id: 4,
        name: "Casual Graphic T-Shirt",
        price: 1200,
        category: "t-shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
        description: "A versatile essential for daily outfits."
    },
    {
        id: 5,
        name: "Premium Polo Shirt",
        price: 1900,
        category: "polo shirts",
        image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        description: "A refined polo for effortless style."
    },
    {
        id: 6,
        name: "Cozy Fleece Hoodie",
        price: 3200,
        category: "hoodies",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
        description: "Warm and comfortable hoodie for casual days."
    },
    {
        id: 7,
        name: "Printed Resort Shirt",
        price: 2400,
        category: "other shirts",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
        description: "Relaxed fit printed shirt for casual outings."
    },
    {
        id: 8,
        name: "Printed Resort Shirt",
        price: 2400,
        category: "other shirts",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
        description: "Relaxed fit printed shirt for casual outings."
    },
    {
        id: 9,
        name: "Printed Resort Shirt",
        price: 2400,
        category: "other shirts",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
        description: "Relaxed fit printed shirt for casual outings."
    },
    {
        id: 10,
        name: "Printed Resort Shirt",
        price: 2400,
        category: "hoodies",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
        description: "Relaxed fit printed shirt for casual outings."
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
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
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
        const button = event.target.closest("[data-add]");
        if (!button) return;

        addToCart(Number(button.dataset.add));
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
   7. RENDER CART PAGE
========================================== */

function renderCart() {
    const container = document.getElementById("cart-items");

    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <h2>Your Bag Is Empty</h2>
                <p>
                    Discover your next favourite outfit
                    from the ZIA collection.
                </p>
                <br>
                <a class="btn" href="index.html#collection">
                    Explore Collection
                </a>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <article class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${money(item.price * item.quantity)}</p>
                    <div class="quantity">
                        <button
                            data-change="-1"
                            data-id="${item.id}"
                            type="button"
                            aria-label="Decrease quantity"
                        >−</button>
                        <span>${item.quantity}</span>
                        <button
                            data-change="1"
                            data-id="${item.id}"
                            type="button"
                            aria-label="Increase quantity"
                        >+</button>
                    </div>
                </div>
                <button
                    class="remove-btn"
                    data-remove="${item.id}"
                    type="button"
                    aria-label="Remove ${item.name}"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </article>
        `).join("");
    }

    const subtotal = cart.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity),
        0
    );

    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    if (subtotalElement) {
        subtotalElement.textContent = money(subtotal);
    }

    if (totalElement) {
        totalElement.textContent = money(subtotal);
    }

    updateCartCount();
}


/* ==========================================
   8. CHANGE QUANTITY / REMOVE PRODUCT
========================================== */

const cartItems = document.getElementById("cart-items");

if (cartItems) {
    cartItems.addEventListener("click", event => {
        const changeButton = event.target.closest("[data-change]");
        const removeButton = event.target.closest("[data-remove]");

        let cart = getCart();

        if (changeButton) {
            const id = Number(changeButton.dataset.id);

            const item = cart.find(
                product => product.id === id
            );

            if (item) {
                item.quantity += Number(
                    changeButton.dataset.change
                );
            }

            cart = cart.filter(
                product => product.quantity > 0
            );
        }

        if (removeButton) {
            const id = Number(removeButton.dataset.remove);

            cart = cart.filter(
                product => product.id !== id
            );
        }

        saveCart(cart);
        renderCart();
    });

    renderCart();
}


/* ==========================================
   9. SIGNUP
========================================== */

const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", event => {
        event.preventDefault();

        const username = document
            .getElementById("username")
            .value.trim();

        const email = document
            .getElementById("email")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("password")
            .value;

        const message =
            document.getElementById("auth-message");

        const users = JSON.parse(
            localStorage.getItem("ziaUsers") || "[]"
        );

        if (!username || !email || !password) {
            message.textContent = "Please complete all fields.";
            return;
        }

        if (users.some(user => user.email === email)) {
            message.textContent =
                "This email is already registered.";
            return;
        }

        users.push({
            username,
            email,
            password
        });

        localStorage.setItem(
            "ziaUsers",
            JSON.stringify(users)
        );

        message.textContent =
            "Account created! Redirecting to login...";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}


/* ==========================================
   10. LOGIN
========================================== */

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document
            .getElementById("email")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("password")
            .value;

        const message =
            document.getElementById("auth-message");

        const users = JSON.parse(
            localStorage.getItem("ziaUsers") || "[]"
        );

        const user = users.find(
            item =>
                item.email === email &&
                item.password === password
        );

        if (!user) {
            message.textContent =
                "Invalid email or password. Please sign up first.";
            return;
        }

        localStorage.setItem(
            "ziaCurrentUser",
            JSON.stringify({
                username: user.username,
                email: user.email
            })
        );

        message.textContent = "Login successful!";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 700);
    });
}


/* ==========================================
   11. WHATSAPP CHECKOUT
========================================== */

const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        const message =
            document.getElementById("checkout-message");

        const cart = getCart();

        if (cart.length === 0) {
            message.textContent =
                "Your shopping bag is empty!";
            return;
        }

        const phoneNumber = "923710201700";

        let orderText =
            "Hello ZIA Clothing! I would like to place this order:\n\n";

        cart.forEach((item, index) => {
            orderText +=
                `${index + 1}. ${item.name} x ${item.quantity} - ` +
                `${money(item.price * item.quantity)}\n`;
        });

        const subtotal = cart.reduce(
            (sum, item) =>
                sum + Number(item.price) * Number(item.quantity),
            0
        );

        orderText += `\nTotal Amount: ${money(subtotal)}\n`;
        orderText +=
            "\nPlease confirm availability and delivery details.";
        orderText += "\nHow much delivery charges?";
        orderText += "\nThank you!";

        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=` +
            encodeURIComponent(orderText);

        message.textContent =
            "Opening WhatsApp to review your order...";

        const whatsappWindow = window.open(
            whatsappURL,
            "_blank"
        );

        if (!whatsappWindow) {
            window.location.href = whatsappURL;
        }
    });
}


/* ==========================================
   12. INITIALIZE
========================================== */

updateCartCount();