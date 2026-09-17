let isRegisterMode = false;

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const nameField = document.getElementById('name-field');
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-btn');
    const toggleBtn = document.getElementById('auth-toggle-btn');

    if (isRegisterMode) {
        nameField.classList.remove('hidden');
        title.innerText = "Register Petugas Baru";
        btn.innerText = "Daftar";
        toggleBtn.innerText = "Sudah punya akun? Login";
    } else {
        nameField.classList.add('hidden');
        title.innerText = "Login Petugas";
        btn.innerText = "Login";
        toggleBtn.innerText = "Belum punya akun? Register";
    }
}

function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value;

    const users = JSON.parse(localStorage.getItem('semesta_staff_users') || '[]');

    if (isRegisterMode) {
        // Proses Register
        users.push({ name, email, password });
        localStorage.setItem('semesta_staff_users', JSON.stringify(users));
        alert("Registrasi berhasil! Silakan login.");
        toggleAuthMode();
    } else {
        // Proses Login
        const user = users.find(u => u.email === email && u.password === password) || 
                     (email === "admin@semestabuku.id" && password === "admin123");

        if (user) {
            const staffObj = { name: user.name || "Petugas Admin", email: user.email };
            localStorage.setItem('semesta_current_staff', JSON.stringify(staffObj));
            checkStaffAuth();
        } else {
            alert("Email atau password salah! (Default: admin@semestabuku.id / admin123)");
        }
    }
}

function checkStaffAuth() {
    const staff = localStorage.getItem('semesta_current_staff');
    const authContainer = document.getElementById('staff-auth-container');
    const dashboard = document.getElementById('staff-dashboard');

    if (staff) {
        const staffObj = JSON.parse(staff);
        authContainer.classList.add('hidden');
        dashboard.classList.remove('hidden');
        document.getElementById('staff-name-display').innerText = staffObj.name;
        document.getElementById('staff-email-display').innerText = staffObj.email;
        document.getElementById('staff-avatar').innerText = staffObj.name.charAt(0).toUpperCase();
        renderInventoryTable();
        renderHistoryTable();
    } else {
        authContainer.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }
}

function logoutStaff() {
    localStorage.removeItem('semesta_current_staff');
    checkStaffAuth();
}