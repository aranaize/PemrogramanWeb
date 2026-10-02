<?php
// Mengambil kredensial dari Railway Environment Variables
$host     = getenv('MYSQLHOST')     ?: 'host_dari_railway.railway.app';
$user     = getenv('MYSQLUSER')     ?: 'root';
$pass     = getenv('MYSQLPASSWORD') ?: 'password_database_anda';
$db_name  = getenv('MYSQLDATABASE') ?: 'railway';
$port     = getenv('MYSQLPORT')     ?: '3306';

// Membuat koneksi ke MySQL Railway
$conn = new mysqli($host, $user, $pass, $db_name, $port);

// Cek status koneksi
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error", 
        "message" => "Koneksi ke database gagal: " . $conn->connect_error
    ]));
}
?>