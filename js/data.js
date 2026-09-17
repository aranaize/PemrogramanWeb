// Database Awal / Default (Menggunakan var untuk mencegah error redeclaration)
var DEFAULT_BOOKS = [
    {
        isbn: "9786020332957",
        title: "Hujan",
        author: "Tere Liye",
        stock: 3,
        borrowed: 1,
        cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"
    },
    {
        isbn: "9789792280302",
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        stock: 5,
        borrowed: 0,
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"
    },
    {
        isbn: "9786020633177",
        title: "Bumi Manusia",
        author: "Pramoedya Ananta Toer",
        stock: 2,
        borrowed: 2,
        cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400"
    }
];

// Helper Mengambil Data Buku dengan Pengaman Try-Catch
function getStoredBooks() {
    try {
        const books = localStorage.getItem('semesta_books');
        if (!books) {
            localStorage.setItem('semesta_books', JSON.stringify(DEFAULT_BOOKS));
            return DEFAULT_BOOKS;
        }
        return JSON.parse(books);
    } catch (e) {
        console.error("Error membaca data buku dari localStorage:", e);
        return DEFAULT_BOOKS;
    }
}

// Helper Menyimpan Data Buku
function saveBooks(books) {
    try {
        localStorage.setItem('semesta_books', JSON.stringify(books));
    } catch (e) {
        console.error("Error menyimpan data buku ke localStorage:", e);
    }
}

// Helper Mengambil Data Transaksi dengan Pengaman Try-Catch
function getStoredTransactions() {
    try {
        const txs = localStorage.getItem('semesta_transactions');
        return txs ? JSON.parse(txs) : [];
    } catch (e) {
        console.error("Error membaca data transaksi dari localStorage:", e);
        return [];
    }
}

// Helper Menyimpan Data Transaksi
function saveTransactions(transactions) {
    try {
        localStorage.setItem('semesta_transactions', JSON.stringify(transactions));
    } catch (e) {
        console.error("Error menyimpan data transaksi ke localStorage:", e);
    }
}