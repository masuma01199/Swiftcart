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
        
        // Use Template Literals for the Card UI
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <span class="badge">${product.category}</span>
                <p class="rating">⭐ ${product.rating.rate} (${product.rating.count})</p>
                <h3 title="${product.title}">${product.title.slice(0, 20)}...</h3>
                <p class="price">$${product.price}</p>
                <div class="card-buttons">
                    <button onclick="showDetails(${product.id})" class="btn-details">Details</button>
                    <button onclick="addToCart(${product.id})" class="btn-add">Add to Cart</button>
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