// Data produk
const produkList = [
    {
        id: 1,
        nama: 'Orange Juice',
        harga: 25000,
        deskripsi: 'Jus jeruk segar 100% alami',
        emoji: '🍊'
    },
    {
        id: 2,
        nama: 'Apple Juice',
        harga: 22000,
        deskripsi: 'Jus apel manis dan segar',
        emoji: '🍎'
    },
    {
        id: 3,
        nama: 'Watermelon Juice',
        harga: 20000,
        deskripsi: 'Jus semangka dingin menyegarkan',
        emoji: '🍉'
    },
    {
        id: 4,
        nama: 'Mango Juice',
        harga: 28000,
        deskripsi: 'Jus mangga tropis premium',
        emoji: '🥭'
    },
    {
        id: 5,
        nama: 'Strawberry Juice',
        harga: 30000,
        deskripsi: 'Jus strawberry manis dan lembut',
        emoji: '🍓'
    },
    {
        id: 6,
        nama: 'Pineapple Juice',
        harga: 24000,
        deskripsi: 'Jus nanas asam segar',
        emoji: '🍍'
    },
    {
        id: 7,
        nama: 'Grape Juice',
        harga: 26000,
        deskripsi: 'Jus anggur kaya antioksidan',
        emoji: '🍇'
    },
    {
        id: 8,
        nama: 'Banana Juice',
        harga: 21000,
        deskripsi: 'Jus pisang creamy dan bergizi',
        emoji: '🍌'
    },
    {
        id: 9,
        nama: 'Carrot Juice',
        harga: 23000,
        deskripsi: 'Jus wortel sehat untuk mata',
        emoji: '🥕'
    }
];

// Keranjang belanja
let cart = [];

// Inisialisasi halaman
function init() {
    renderProduk();
    loadCartFromStorage();
    updateCartUI();
}

// Render daftar produk
function renderProduk() {
    const produkGrid = document.getElementById('produk-grid');
    produkGrid.innerHTML = '';

    produkList.forEach(produk => {
        const produkCard = document.createElement('div');
        produkCard.className = 'produk-card';
        produkCard.innerHTML = `
            <div class="produk-image">${produk.emoji}</div>
            <div class="produk-info">
                <div class="produk-nama">${produk.nama}</div>
                <div class="produk-harga">Rp ${formatRupiah(produk.harga)}</div>
                <div class="produk-deskripsi">${produk.deskripsi}</div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="changeQty(${produk.id}, -1)">-</button>
                    <input type="number" class="qty-input" id="qty-${produk.id}" value="1" min="1" max="99">
                    <button class="qty-btn" onclick="changeQty(${produk.id}, 1)">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${produk.id})">
                    Tambah ke Keranjang
                </button>
            </div>
        `;
        produkGrid.appendChild(produkCard);
    });
}

// Ubah quantity
function changeQty(produkId, change) {
    const qtyInput = document.getElementById(`qty-${produkId}`);
    let newQty = parseInt(qtyInput.value) + change;
    if (newQty < 1) newQty = 1;
    if (newQty > 99) newQty = 99;
    qtyInput.value = newQty;
}

// Tambah ke keranjang
function addToCart(produkId) {
    const produk = produkList.find(p => p.id === produkId);
    const qtyInput = document.getElementById(`qty-${produkId}`);
    const qty = parseInt(qtyInput.value);

    const existingItem = cart.find(item => item.id === produkId);
    
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({
            id: produk.id,
            nama: produk.nama,
            harga: produk.harga,
            emoji: produk.emoji,
            qty: qty
        });
    }

    saveCartToStorage();
    updateCartUI();
    showNotification(`${produk.nama} ditambahkan ke keranjang!`);
    qtyInput.value = 1;
}

// Update tampilan keranjang
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Hitung total item
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    // Render item keranjang
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang kosong</p>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-nama">${item.emoji} ${item.nama}</div>
                    <div class="cart-item-harga">Rp ${formatRupiah(item.harga)}</div>
                    <div class="cart-item-qty">Jumlah: ${item.qty}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Hitung total harga
    const total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    cartTotal.textContent = `Rp ${formatRupiah(total)}`;
}

// Hapus dari keranjang
function removeFromCart(produkId) {
    cart = cart.filter(item => item.id !== produkId);
    saveCartToStorage();
    updateCartUI();
}

// Kosongkan keranjang
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Yakin ingin mengosongkan keranjang?')) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
        showNotification('Keranjang dikosongkan');
    }
}

// Toggle cart panel
function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.toggle('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const itemList = cart.map(item => `${item.emoji} ${item.nama} x${item.qty}`).join('\n');
    
    const message = `Pesanan Anda:\n\n${itemList}\n\nTotal: Rp ${formatRupiah(total)}\n\nTerima kasih telah berbelanja di Juicy Shop!`;
    
    alert(message);
    
    // Kosongkan keranjang setelah checkout
    cart = [];
    saveCartToStorage();
    updateCartUI();
    toggleCart();
}

// Format rupiah
function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Notifikasi
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Simpan cart ke localStorage
function saveCartToStorage() {
    localStorage.setItem('juicyShopCart', JSON.stringify(cart));
}

// Load cart dari localStorage
function loadCartFromStorage() {
    const saved = localStorage.getItem('juicyShopCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// CSS untuk animasi notifikasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Jalankan inisialisasi saat halaman dimuat
window.addEventListener('DOMContentLoaded', init);

// Tutup cart panel saat klik di luar
document.addEventListener('click', function(event) {
    const cartPanel = document.getElementById('cart-panel');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartPanel.classList.contains('active') && 
        !cartPanel.contains(event.target) && 
        !cartIcon.contains(event.target)) {
        cartPanel.classList.remove('active');
    }
});
