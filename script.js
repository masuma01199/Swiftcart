// Central function to fetch data from the API
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

const categoryContainer = document.getElementById('category-container');

const loadCategories = async () => {
    const categories = await fetchApiData('https://fakestoreapi.com/products/categories');
    
    // Add an "All" button first to show all products
    const allBtn = document.createElement('button');
    allBtn.innerText = 'All';
    allBtn.className = "category-btn px-4 py-2 m-2 border rounded-full transition-colors duration-300 bg-indigo-600 text-white active-btn";; // Add your CSS classes here
    allBtn.onclick = () => loadProducts('all');
    categoryContainer.appendChild(allBtn);

    // Create buttons for each category from the API
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        btn.className = "px-4 py-2 m-2 border rounded-full transition-colors duration-300";
        btn.onclick = () => {
            // Logic to highlight active state
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            loadProducts(category);
        };
        categoryContainer.appendChild(btn);
    });
};

const productContainer = document.getElementById('product-container');

const loadProducts = async (category) => {
    // 1. Show Loading Spinner
    productContainer.innerHTML = '<div class="spinner">Loading...</div>';

    let url = 'https://fakestoreapi.com/products';
    if (category !== 'all') {
        url = `https://fakestoreapi.com/products/category/${category}`;
    }

    const products = await fetchApiData(url);
    productContainer.innerHTML = ''; // Clear spinner

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
       productCard.innerHTML = `
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
    </div>
`;
        productContainer.appendChild(productCard);
    });
};

// Initialize the app
loadCategories();
loadProducts('all');

const modal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('close-modal');

// Function to show modal with full details
const showDetails = async (id) => {
    // Fetch single product data
    const product = await fetchApiData(`https://fakestoreapi.com/products/${id}`);
    
    // Inject full details into the modal
    modalBody.innerHTML = `
        <div class="modal-detail-wrapper">
            <img src="${product.image}" alt="${product.title}" class="modal-img">
            <div class="modal-info">
                <h2>${product.title}</h2>
                <p class="modal-category">Category: ${product.category}</p>
                <p class="modal-description">${product.description}</p>
                <p class="modal-rating">⭐ ${product.rating.rate} / 5</p>
                <p class="modal-price">$${product.price}</p>
                <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
    
    // Show the modal
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // Using flex to center it
};

// Close modal logic
closeBtn.onclick = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

// Close modal if user clicks outside the content box
window.onclick = (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

let cart = [];
const cartCountElement = document.getElementById('cart-count');

// Function to handle adding items to cart
const addToCart = async (id) => {
    // 1. Fetch the product details
    const product = await fetchApiData(`https://fakestoreapi.com/products/${id}`);
    
    // 2. Add to the cart array
    cart.push(product);
    
    // 3. Update the UI Count
    updateCartUI();
    
    // 4. Bonus: Save to LocalStorage
    localStorage.setItem('swiftCart', JSON.stringify(cart));
};

const updateCartUI = () => {
    cartCountElement.innerText = cart.length;
};

const calculateTotal = () => {
    // Uses .reduce() to sum up all product prices
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    return total.toFixed(2);
};

// Example function to remove an item
const removeFromCart = (index) => {
    cart.splice(index, 1); // Remove 1 item at that index
    updateCartUI();
    // Re-render your cart list here to reflect changes
};
const loadTrendingProducts = async () => {
    const products = await fetchApiData('https://fakestoreapi.com/products?limit=3');
    const trendingContainer = document.getElementById('trending-container');
    
    products.forEach(product => {
        // You can reuse your product card generation logic here
        const card = createProductCard(product); 
        trendingContainer.appendChild(card);
    });
};

// Call this in your initialization
loadTrendingProducts();