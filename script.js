const products = [
  { id: 1, name: 'Signature Runner', category: 'Accessories', price: 129, rating: 4.9, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', badge: 'Best Seller' },
  { id: 2, name: 'Nova Smartwatch', category: 'Tech', price: 249, rating: 4.8, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80', badge: 'New Arrival' },
  { id: 3, name: 'Glow Lamp', category: 'Home Decor', price: 89, rating: 4.7, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', badge: 'Limited' },
  { id: 4, name: 'Metro Travel Pack', category: 'Accessories', price: 159, rating: 4.9, image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=900&q=80', badge: 'Top Rated' },
  { id: 5, name: 'Luna Headphones', category: 'Tech', price: 199, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', badge: 'Trending' },
  { id: 6, name: 'Arctic Chair', category: 'Home Decor', price: 219, rating: 4.6, image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80', badge: 'Editor Pick' },
  { id: 7, name: 'Aero Bottle', category: 'Lifestyle', price: 49, rating: 4.7, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', badge: 'Fresh' },
  { id: 8, name: 'Atlas Backpack', category: 'Accessories', price: 139, rating: 4.8, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', badge: 'Popular' },
  { id: 9, name: 'Sculpt Desk', category: 'Home Decor', price: 329, rating: 4.9, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', badge: 'Premium' },
  { id: 10, name: 'Flow Hoodie', category: 'Lifestyle', price: 99, rating: 4.7, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', badge: 'Spring' },
  { id: 11, name: 'Halo Camera', category: 'Tech', price: 499, rating: 5, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', badge: 'Hot' },
  { id: 12, name: 'Studio Tote', category: 'Accessories', price: 79, rating: 4.6, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', badge: 'New' },
];

const cart = JSON.parse(localStorage.getItem('northstar-cart')) || [];
let currentPage = 1;
let filteredProducts = [...products];
const pageSize = 8;

function updateCartCount() {
  const counts = document.querySelectorAll('.cart-count');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  counts.forEach((el) => {
    el.textContent = count;
  });
}

function saveCart() {
  localStorage.setItem('northstar-cart', JSON.stringify(cart));
}

function addToCart(name) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, quantity: 1, price: products.find((p) => p.name === name)?.price || 0 });
  }
  saveCart();
  updateCartCount();
  if (window.location.pathname.includes('cart.html')) {
    renderCart();
  }
}

function removeFromCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index >= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function adjustQuantity(name, delta) {
  const item = cart.find((entry) => entry.name === name);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  renderCart();
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const pagination = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');

  if (!grid) return;

  const categories = ['all', ...new Set(products.map((item) => item.category))];
  categoryFilter.innerHTML = categories.map((category) => `<option value="${category}">${category === 'all' ? 'All categories' : category}</option>`).join('');

  const filtered = filteredProducts.filter((product) => {
    const term = searchInput?.value.toLowerCase() || '';
    const matchSearch = product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
    const selectedCategory = categoryFilter?.value || 'all';
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortSelect?.value) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const visibleProducts = sorted.slice(start, start + pageSize);

  grid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="badge">${product.badge}</div>
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="rating"><i class="fa-solid fa-star"></i> ${product.rating}</div>
        <p>$${product.price.toFixed(2)}</p>
        <button class="btn btn-small add-to-cart" data-product="${product.name}">Add to Cart</button>
      </div>
    </article>
  `).join('');

  pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => `
    <button class="${currentPage === index + 1 ? 'active' : ''}" data-page="${index + 1}">${index + 1}</button>
  `).join('');

  document.querySelectorAll('.pagination button').forEach((button) => {
    button.addEventListener('click', () => {
      currentPage = Number(button.getAttribute('data-page'));
      renderProducts();
    });
  });

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.getAttribute('data-product')));
  });
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const subtotal = document.getElementById('subtotal');
  const total = document.getElementById('total');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3><p>Add some premium pieces to continue.</p><a href="products.html" class="btn btn-primary">Browse Products</a></div>';
    if (subtotal) subtotal.textContent = '$0.00';
    if (total) total.textContent = '$0.00';
    return;
  }

  container.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${products.find((p) => p.name === item.name)?.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)} each</p>
        <div class="cart-controls">
          <button data-action="decrease" data-name="${item.name}">-</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-name="${item.name}">+</button>
        </div>
        <button class="remove-btn" data-action="remove" data-name="${item.name}">×</button>
      </div>
    </article>
  `).join('');

  const subtotalValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotal) subtotal.textContent = `$${subtotalValue.toFixed(2)}`;
  if (total) total.textContent = `$${subtotalValue.toFixed(2)}`;

  container.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      const name = button.getAttribute('data-name');
      if (action === 'increase') adjustQuantity(name, 1);
      if (action === 'decrease') adjustQuantity(name, -1);
      if (action === 'remove') removeFromCart(name);
    });
  });
}

function revealOnScroll() {
  document.querySelectorAll('[data-reveal]').forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      section.classList.add('visible');
    }
  });
}

function initTheme() {
  const saved = localStorage.getItem('northstar-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('northstar-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

function initBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;
  window.addEventListener('scroll', () => {
    button.classList.toggle('show', window.scrollY > 480);
  });
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach((element) => {
    const target = Number(element.getAttribute('data-counter'));
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = start.toLocaleString();
      }
    }, 16);
  });
}

function initForms() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Thanks for reaching out! This is a UI-only demo.');
    });
  });
}

function initEvents() {
  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.getAttribute('data-product')));
  });

  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

  document.getElementById('searchInput')?.addEventListener('input', () => {
    currentPage = 1;
    renderProducts();
  });

  document.getElementById('categoryFilter')?.addEventListener('change', () => {
    currentPage = 1;
    renderProducts();
  });

  document.getElementById('sortSelect')?.addEventListener('change', () => {
    currentPage = 1;
    renderProducts();
  });
}

window.addEventListener('load', () => {
  document.querySelector('.loading-screen')?.classList.add('hide');
  setTimeout(() => {
    document.querySelector('.loading-screen')?.remove();
  }, 500);
  initTheme();
  initNavigation();
  initBackToTop();
  initEvents();
  initForms();
  renderProducts();
  renderCart();
  updateCartCount();
  revealOnScroll();
  initCounters();
  window.addEventListener('scroll', revealOnScroll);
});
