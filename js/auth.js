/**
 * js/auth.js - Modul Autentikasi Pengguna
 */

// 1. Fungsi Registrasi User Baru
async function registerUser(username, password, email = '') {
    try {
        const response = await fetch('register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Registrasi berhasil! Silakan login.');
            return true;
        } else {
            alert('Registrasi gagal: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error saat registrasi:', error);
        alert('Terjadi kesalahan koneksi ke server.');
        return false;
    }
}

// 2. Fungsi Login User
async function loginUser(username, password) {
    try {
        const response = await fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Simpan data sesi user di browser (localStorage)
            localStorage.setItem('user_session', JSON.stringify(result.user));
            alert('Login berhasil! Selamat datang, ' + result.user.username);
            
            // Redirect ke halaman dashboard atau index
            window.location.href = 'index.php';
            return true;
        } else {
            alert('Login gagal: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error saat login:', error);
        alert('Terjadi kesalahan sistem saat mencoba login.');
        return false;
    }
}

// 3. Fungsi Logout
function logoutUser() {
    // Hapus sesi lokal
    localStorage.removeItem('user_session');
    
    // Opsional: Panggil endpoint PHP untuk membuang session jika menggunakan session_start()
    fetch('logout.php').finally(() => {
        alert('Anda telah keluar.');
        window.location.href = 'index.php';
    });
}

// 4. Fungsi Cek Status Login (Guard Halaman)
function getCurrentUser() {
    const session = localStorage.getItem('user_session');
    return session ? JSON.parse(session) : null;
}

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        console.warn('Pengguna belum terautentikasi.');
        return false;
    }
    return true;
}