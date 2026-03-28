<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
?>

<?php
// ── API/AUTH/LOGIN.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
startSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError('Method not allowed', 405);
}

$body     = getBody();
$email    = trim($body['email']    ?? '');
$password = trim($body['password'] ?? '');

if (empty($email) || empty($password)) {
    respondError('Email and password are required.');
}

$db = getDB();

// ── FIND USER ──
$stmt = $db->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user   = $result->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password'])) {
    respondError('Incorrect email or password.', 401);
}

// ── SET SESSION ──
$_SESSION['user'] = [
    'id'    => $user['id'],
    'name'  => $user['name'],
    'email' => $user['email'],
    'role'  => $user['role'],
];

respond([
    'success' => true,
    'message' => 'Logged in successfully.',
    'user'    => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']],
]);
