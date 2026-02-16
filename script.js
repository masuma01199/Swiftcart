const fetchApiData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
};

let cart = [];
const cartCountElement = document.getElementById('cart-count');
const productContainer = document.getElementById('product-container');
const categoryContainer = document.getElementById('category-container');
const trendingContainer = document.getElementById('trending-container');

const createProductCard = (product) => {
    return `
    <div class="bg-white border rounded-xl p-4 flex flex-col h-full hover:shadow-lg transition">
        <div class="h-48 mb-4 overflow-hidden">
            <img src="${product.image}" class="w-full h-full object-contain" alt="${product.title}">
        </div>
        <div class="flex-grow">
            <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">${product.category}</span>
            <div class="flex justify-between items-center my-2">
                <p class="text-yellow-500 text-sm font-bold">⭐ ${product.rating.rate} <span class="text-gray-400 font-normal">(${product.rating.count})</span></p>
            </div>
            <h3 class="font-bold text-gray-800 line-clamp-1" title="${product.title}">${product.title}</h3>
            <p class="text-xl font-bold text-gray-900 mt-2">$${product.price}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4">
            <button onclick="showDetails(${product.id})" class="border border-gray-300 py-2 rounded-md hover:bg-gray-50 text-sm">Details</button>
            <button onclick="addToCart(${product.id})" class="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 text-sm">Add</button>
        </div>
    </div>`;
};

const loadTrending = async () => {
    const products = await fetchApiData('https://fakestoreapi.com/products?limit=3');
    const container = document.getElementById('trending-container');
    container.innerHTML = '';

    products.forEach(product => {
        container.innerHTML += `
            <div class="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
                <img src="${product.image}" class="h-48 w-full object-contain mb-4">
                <h3 class="font-bold line-clamp-1">${product.title}</h3>
                <p class="text-xl font-bold mt-2">$${product.price}</p>
                <div class="flex gap-2 mt-4">
                    <button onclick="showDetails(${product.id})" class="flex-1 border py-2 rounded-md text-sm">Details</button>
                    <button onclick="addToCart(${product.id})" class="flex-1 bg-indigo-600 text-white py-2 rounded-md text-sm">Add</button>
                </div>
            </div>
        `;
    });
};

const loadProducts = async (category) => {
    productContainer.innerHTML = '<div class="spinner col-span-full"></div>';

    let url = (category === 'all')
        ? 'https://fakestoreapi.com/products'
        : `https://fakestoreapi.com/products/category/${category}`;

    const products = await fetchApiData(url);
    productContainer.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.innerHTML = createProductCard(product);
        productContainer.appendChild(div.firstElementChild);
    });
};

window.showPage = (page) => {
    const homeView = document.getElementById('home-view');
    const productsView = document.getElementById('products-view');

    if (page === 'home') {
        homeView.classList.remove('hidden');
        productsView.classList.add('hidden');
    } else if (page === 'products') {
        homeView.classList.add('hidden');
        productsView.classList.remove('hidden');
        loadProducts('all');
    }
};
const loadCategories = async () => {
    const categories = await fetchApiData('https://fakestoreapi.com/products/categories');

    let html = `<button onclick="filterByCategory('all', this)" class="category-btn active-btn px-6 py-2 rounded-full border border-indigo-600 bg-indigo-600 text-white text-sm font-medium">All</button>`;
    categories.forEach(cat => {
        html += `
        <button onclick="filterByCategory(\`${cat}\`, this)" class="category-btn px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition text-sm font-medium">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>`;
    });
    categoryContainer.innerHTML = html;
};

window.filterByCategory = (category, btn) => {
    document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        b.classList.add('border-gray-300', 'bg-white', 'text-black');
    });

    btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
    btn.classList.remove('border-gray-300', 'bg-white', 'text-black');

    loadProducts(category);
};
window.toggleCart = () => {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
};

window.addToCart = async (id) => {
    const product = await fetchApiData(`https://fakestoreapi.com/products/${id}`);

    cart.push(product);

    localStorage.setItem('swiftCart', JSON.stringify(cart));

    updateCartUI();


    toggleCart();
};

const updateCartUI = () => {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartCount.innerText = cart.length;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItemsContainer.innerHTML += `
            <div class="flex items-center gap-3 border-b pb-3">
                <img src="${item.image}" class="w-12 h-12 object-contain">
                <div class="flex-grow">
                    <h4 class="text-sm font-bold line-clamp-1">${item.title}</h4>
                    <p class="text-indigo-600 font-semibold">$${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:bg-red-50 p-1 rounded">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartTotal.innerText = `$${total.toFixed(2)}`;
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('swiftCart', JSON.stringify(cart));
    updateCartUI();
};

document.querySelector('.fa-shopping-cart').parentElement.onclick = toggleCart;


const modal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');

window.showDetails = async (id) => {
    const product = await fetchApiData(`https://fakestoreapi.com/products/${id}`);

    modalBody.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${product.image}" alt="${product.title}" class="w-full md:w-1/2 h-64 object-contain">
            <div class="modal-info">
                <h2 class="text-2xl font-bold mb-2">${product.title}</h2>
                <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">${product.category}</span>
                <p class="text-gray-600 my-4 text-sm leading-relaxed">${product.description}</p>
                <div class="flex justify-between items-center mb-6">
                    <p class="text-2xl font-bold text-gray-900">$${product.price}</p>
                    <p class="text-yellow-500 font-bold">⭐ ${product.rating.rate} / 5</p>
                </div>
                <button class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition" 
                        onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

document.getElementById('close-modal').onclick = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

loadTrending();
loadCategories();
loadProducts('all');