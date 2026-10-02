<?php
require_once 'koneksi.php';

header('Content-Type: application/json');

// Menerima data JSON yang dikirim dari JS
$input = json_decode(file_get_contents('php://input'), true);

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Username dan password wajib diisi!"]);
    exit;
}

// Menyiapkan Query dengan Prepared Statement (Aman dari SQL Injection)
$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    // Memeriksa password
    if (password_verify($password, $user['password']) || $password === $user['password']) {
        echo json_encode([
            "status" => "success", 
            "message" => "Login berhasil!",
            "user" => [
                "id" => $user['id'],
                "username" => $user['username']
            ]
        ]);
        exit;
    }
}

echo json_encode(["status" => "error", "message" => "Username atau password salah!"]);
?>