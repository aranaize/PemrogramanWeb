/**
 * js/data.js - Modul Manajemen & Fetch Data dari Database PHP
 */

// 1. Mengambil Semua Data dari Server (Read)
async function fetchData(endpoint = 'get_data.php') {
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success') {
            return result.data;
        } else {
            console.error('Gagal mengambil data:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// 2. Menambah Data Baru ke Database (Create)
async function createData(payload, endpoint = 'add_data.php') {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Data berhasil ditambahkan!');
            return true;
        } else {
            alert('Gagal menambah data: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error creating data:', error);
        alert('Terjadi kesalahan jaringan.');
        return false;
    }
}

// 3. Mengubah Data (Update)
async function updateData(id, payload, endpoint = 'update_data.php') {
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, ...payload })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Data berhasil diperbarui!');
            return true;
        } else {
            alert('Gagal memperbarui data: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error updating data:', error);
        return false;
    }
}

// 4. Menghapus Data (Delete)
async function deleteData(id, endpoint = 'delete_data.php') {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        return false;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Data berhasil dihapus!');
            return true;
        } else {
            alert('Gagal menghapus data: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        return false;
    }
}