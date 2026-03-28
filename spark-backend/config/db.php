<?php
// ── CONFIG/DB.PHP — MySQL Connection ──

define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_USER', 'root');
define('DB_PASS', 'sadiK@4299');   // ← change this
define('DB_NAME', 'spark_db');

define('GMAIL_USER', 'sadik.sk4299@gmail.com');    // ← change this
define('GMAIL_PASS', 'pgbl jtdh wqrs qzbd'); // ← use Gmail App Password
define('ADMIN_EMAIL', 'sadik.sk4299@gmail.com');

define('SITE_URL', 'http://localhost:8080');      // frontend URL
define('SESSION_NAME', 'spark_session');

function getDB() {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST , DB_USER, DB_PASS, DB_NAME, DB_PORT);
        if ($conn->connect_error) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
        }
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}
