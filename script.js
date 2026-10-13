// ---------- Elements ----------
const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");
const cartItemsBox = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-footer h3 span");
const cartCount = document.getElementById("cart-count");
const orderBtn = document.querySelector(".check-btn");

// ---------- State (saved in localStorage so it works across pages) ----------
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("cremeCart")) || [];
} catch (e) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem("cremeCart", JSON.stringify(cart));
  } catch (e) {}
}

const formatPrice = (n) => n.toLocaleString("en-NG");

// ---------- Open / close panel ----------
if (cartBtn) cartBtn.addEventListener("click", () => cartPanel.classList.add("open"));
if (closeCart) closeCart.addEventListener("click", () => cartPanel.classList.remove("open"));

// ---------- Add to cart ----------
document.querySelectorAll(".product-card button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const name = card.querySelector("h3").textContent.trim();
    const price = parseInt(card.querySelector(".price").textContent.replace(/\D/g, ""), 10);
    const image = card.querySelector("img").getAttribute("src");

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, image, qty: 1 });
    }

    saveCart();
    renderCart();
    cartPanel.classList.add("open"); // show the panel when something is added
  });
});

// ---------- Render the cart panel ----------
function renderCart() {
  cartItemsBox.innerHTML = "";

  if (cart.length === 0) {
    cartItemsBox.innerHTML = "<p>Your cart is empty</p>";
  } else {
    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>&#8358;${formatPrice(item.price)}</p>
          <div class="qty-controls">
            <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove-btn" data-action="remove" data-index="${index}">&times;</button>
      `;
      cartItemsBox.appendChild(row);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = count;
}

// ---------- Plus / minus / remove (event delegation) ----------
cartItemsBox.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const index = Number(btn.dataset.index);
  const action = btn.dataset.action;

  if (action === "increase") {
    cart[index].qty += 1;
  } else if (action === "decrease") {
    cart[index].qty -= 1;
    if (cart[index].qty <= 0) cart.splice(index, 1);
  } else if (action === "remove") {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
});

// ---------- Place order ----------
if (orderBtn) {
  orderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("Thank you! Your order has been placed.");
    cart = [];
    saveCart();
    renderCart();
    cartPanel.classList.remove("open");
  });
}

// Show saved cart when the page loads
renderCart();

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbars");

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("open");
    menuBtn.classList.toggle("fa-bars");
    menuBtn.classList.toggle("fa-xmark");
  });

  navbar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("open");
      menuBtn.classList.add("fa-bars");
      menuBtn.classList.remove("fa-xmark");
    });
  });
}

// ---------- Search toggle on smaller screens ----------
const searchIcon = document.getElementById("search-icon");
const headerIcons = document.querySelector(".header-icons");

if (searchIcon && headerIcons) {
  searchIcon.addEventListener("click", () => {
    headerIcons.classList.toggle("search-open");
    document.getElementById("searchInput").focus();
  });
}