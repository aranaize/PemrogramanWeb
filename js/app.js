let currentFilter = 'all';

// Inisialisasi Aplikasi
document.addEventListener("DOMContentLoaded", () => {
    renderReaderBooks();
    checkStaffAuth();
    
    // Set default tanggal pada form transaksi
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('tx-borrow-date').value = today;
    document.getElementById('tx-return-date').value = nextWeek;
});

// Switching Mode utama (Reader / Staff)
function switchMode(mode) {
    const readerSec = document.getElementById('mode-reader');
    const staffSec = document.getElementById('mode-staff');
    const btnReader = document.getElementById('btn-mode-reader');
    const btnStaff = document.getElementById('btn-mode-staff');

    if (mode === 'reader') {
        readerSec.classList.remove('hidden');
        staffSec.classList.add('hidden');
        btnReader.className = "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 bg-white text-blue-600 shadow-sm";
        btnStaff.className = "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 text-gray-600 hover:text-gray-900";
        renderReaderBooks();
    } else {
        readerSec.classList.add('hidden');
        staffSec.classList.remove('hidden');
        btnStaff.className = "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 bg-white text-blue-600 shadow-sm";
        btnReader.className = "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 text-gray-600 hover:text-gray-900";
    }
}

// Render Katalog Pengunjung
function renderReaderBooks() {
    const books = getStoredBooks();
    const grid = document.getElementById('reader-book-grid');
    const searchVal = document.getElementById('reader-search').value.toLowerCase();
    
    document.getElementById('total-books-count').innerText = books.length;
    grid.innerHTML = '';

    const filtered = books.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(searchVal) || b.author.toLowerCase().includes(searchVal) || b.isbn.includes(searchVal);
        const availableStock = b.stock - b.borrowed;
        if (currentFilter === 'available') return matchSearch && availableStock > 0;
        if (currentFilter === 'borrowed') return matchSearch && b.borrowed > 0;
        return matchSearch;
    });

    filtered.forEach(book => {
        const availableStock = book.stock - book.borrowed;
        const isAvailable = availableStock > 0;

        grid.innerHTML += `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
                <img src="${book.cover}" alt="${book.title}" class="w-full h-48 object-cover">
                <div class="p-4 flex-grow flex flex-col justify-between space-y-2">
                    <div>
                        <span class="text-xs font-semibold px-2 py-0.5 rounded ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            ${isAvailable ? 'Tersedia Dipinjam' : 'Sedang Dipinjam'}
                        </span>
                        <h3 class="font-bold text-base text-gray-900 mt-2">${book.title}</h3>
                        <p class="text-xs text-gray-500">Penulis: ${book.author}</p>
                        <p class="text-xs text-gray-400 font-mono mt-1">ISBN: ${book.isbn}</p>
                    </div>
                    <div class="pt-2 border-t flex justify-between items-center text-xs">
                        <span class="text-gray-600">Stok: <b>${availableStock}</b> / ${book.stock}</span>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterStatus(type) {
    currentFilter = type;
    renderReaderBooks();
}

// Sub Tab Petugas Navigation
function switchStaffTab(tab) {
    ['inventory', 'transaction', 'history'].forEach(t => {
        document.getElementById(`staff-tab-${t}`).classList.add('hidden');
        document.getElementById(`tab-btn-${t}`).className = "pb-3 font-medium text-gray-500 hover:text-gray-800 flex items-center space-x-2";
    });

    document.getElementById(`staff-tab-${tab}`).classList.remove('hidden');
    document.getElementById(`tab-btn-${tab}`).className = "pb-3 font-medium text-blue-600 border-b-2 border-blue-600 flex items-center space-x-2";
}

// Tambah Buku Baru
function handleAddBook(event) {
    event.preventDefault();
    const books = getStoredBooks();
    const isbn = document.getElementById('book-isbn').value;
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const stock = parseInt(document.getElementById('book-stock').value);
    const cover = document.getElementById('book-cover').value || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400';

    const existingIndex = books.findIndex(b => b.isbn === isbn);
    if (existingIndex >= 0) {
        books[existingIndex].stock += stock;
    } else {
        books.push({ isbn, title, author, stock, borrowed: 0, cover });
    }

    saveBooks(books);
    document.getElementById('add-book-form').reset();
    renderInventoryTable();
    alert('Buku berhasil disimpan!');
}

// Render Tabel Stok Petugas
function renderInventoryTable() {
    const books = getStoredBooks();
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';

    books.forEach((book, idx) => {
        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3"><img src="${book.cover}" class="w-10 h-12 object-cover rounded"></td>
                <td class="p-3 font-mono text-xs">${book.isbn}</td>
                <td class="p-3">
                    <div class="font-bold">${book.title}</div>
                    <div class="text-xs text-gray-500">${book.author}</div>
                </td>
                <td class="p-3"><b>${book.stock - book.borrowed}</b> / ${book.stock}</td>
                <td class="p-3 text-center">
                    <button onclick="deleteBook(${idx})" class="text-red-500 hover:text-red-700">
                        <span class="material-icons-outlined text-sm">delete</span>
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteBook(idx) {
    const books = getStoredBooks();
    if (confirm(`Hapus buku "${books[idx].title}"?`)) {
        books.splice(idx, 1);
        saveBooks(books);
        renderInventoryTable();
    }
}

// Simulasi Barcode Scanner
function triggerBarcodeScan() {
    const laser = document.getElementById('scanner-laser');
    const status = document.getElementById('scanner-status');
    const books = getStoredBooks();

    laser.classList.remove('hidden');
    status.innerText = "Memindai Barcode...";

    setTimeout(() => {
        laser.classList.add('hidden');
        const randomBook = books[Math.floor(Math.random() * books.length)];
        document.getElementById('tx-barcode').value = randomBook.isbn;
        status.innerText = `Berhasil Scan ISBN: ${randomBook.isbn}`;
    }, 1500);
}

// Transaksi Peminjaman
function handleTransaction(event) {
    event.preventDefault();
    const books = getStoredBooks();
    const txs = getStoredTransactions();

    const visitorName = document.getElementById('tx-visitor-name').value;
    const barcode = document.getElementById('tx-barcode').value;
    const borrowDate = document.getElementById('tx-borrow-date').value;
    const returnDate = document.getElementById('tx-return-date').value;

    const book = books.find(b => b.isbn === barcode);

    if (!book) {
        alert('Buku dengan ISBN tersebut tidak ditemukan!');
        return;
    }

    if (book.stock - book.borrowed <= 0) {
        alert('Stok buku sedang habis!');
        return;
    }

    // Update Stok
    book.borrowed += 1;
    saveBooks(books);

    // Buat Transaksi
    const newTx = {
        id: 'TRX-' + Date.now().toString().slice(-6),
        visitorName,
        bookIsbn: book.isbn,
        bookTitle: book.title,
        borrowDate,
        returnDate,
        status: 'Dipinjam'
    };

    txs.push(newTx);
    saveTransactions(txs);

    document.getElementById('transaction-form').reset();
    renderHistoryTable();
    openReceiptModal(newTx);
}

// Render Riwayat & Hitung Denda
function renderHistoryTable() {
    const txs = getStoredTransactions();
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';

    txs.forEach((tx, idx) => {
        const today = new Date().toISOString().split('T')[0];
        let denda = 0;

        if (tx.status === 'Dipinjam' && today > tx.returnDate) {
            const diffDays = Math.ceil((new Date(today) - new Date(tx.returnDate)) / (1000 * 60 * 60 * 24));
            denda = diffDays * 2000;
        }

        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 font-mono text-xs font-bold">${tx.id}</td>
                <td class="p-3">${tx.visitorName}</td>
                <td class="p-3">
                    <div class="font-medium">${tx.bookTitle}</div>
                    <div class="text-xs text-gray-400 font-mono">${tx.bookIsbn}</div>
                </td>
                <td class="p-3 text-xs">${tx.borrowDate}</td>
                <td class="p-3 text-xs">${tx.returnDate}</td>
                <td class="p-3">
                    ${tx.status === 'Dipinjam' 
                        ? `<span class="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">Dipinjam</span>` 
                        : `<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">Dikembalikan</span>`}
                    ${denda > 0 ? `<div class="text-xs text-red-600 font-bold mt-1">Denda: Rp ${denda.toLocaleString()}</div>` : ''}
                </td>
                <td class="p-3 text-center">
                    ${tx.status === 'Dipinjam' ? `
                        <button onclick="returnBook('${tx.id}', ${denda})" class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                            Kembalikan
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `;
    });
}

function returnBook(txId, denda) {
    const txs = getStoredTransactions();
    const books = getStoredBooks();
    const tx = txs.find(t => t.id === txId);

    if (tx) {
        if (denda > 0) {
            alert(`Pengunjung terlambat mengembalikan buku. Denda yang wajib dibayar: Rp ${denda.toLocaleString()}`);
        }
        tx.status = 'Dikembalikan';
        const book = books.find(b => b.isbn === tx.bookIsbn);
        if (book && book.borrowed > 0) book.borrowed -= 1;

        saveTransactions(txs);
        saveBooks(books);
        renderHistoryTable();
    }
}

// Modal Struk Peminjaman
function openReceiptModal(tx) {
    const details = document.getElementById('receipt-details');
    details.innerHTML = `
        <div class="flex justify-between"><span>No. Struk:</span><span class="font-mono font-bold">${tx.id}</span></div>
        <div class="flex justify-between"><span>Peminjam:</span><span class="font-bold">${tx.visitorName}</span></div>
        <div class="flex justify-between"><span>Judul Buku:</span><span>${tx.bookTitle}</span></div>
        <div class="flex justify-between"><span>ISBN:</span><span class="font-mono">${tx.bookIsbn}</span></div>
        <div class="flex justify-between"><span>Tgl Pinjam:</span><span>${tx.borrowDate}</span></div>
        <div class="flex justify-between"><span>Batas Kembali:</span><span class="font-bold text-blue-600">${tx.returnDate}</span></div>
    `;
    document.getElementById('receipt-modal').classList.remove('hidden');
}

function closeReceiptModal() {
    document.getElementById('receipt-modal').classList.add('hidden');
}

function printReceipt() {
    window.print();
}