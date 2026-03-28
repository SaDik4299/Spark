<?php
// ── API/AUTH/SIGNUP.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';
require_once __DIR__ . '/../../emails/welcome.php';

setCORSHeaders();
startSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError('Method not allowed', 405);
}

$body = getBody();
$name     = trim($body['name']     ?? '');
$email    = trim($body['email']    ?? '');
$password = trim($body['password'] ?? '');

// ── VALIDATE ──
if (empty($name))                      respondError('Name is required.');
if (strlen($name) < 2)                 respondError('Name must be at least 2 characters.');
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL))
                                       respondError('Valid email is required.');
if (empty($password))                  respondError('Password is required.');
if (strlen($password) < 8)             respondError('Password must be at least 8 characters.');

$db = getDB();

// ── CHECK DUPLICATE EMAIL ──
$stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    respondError('An account with this email already exists.');
}
$stmt->close();

// ── HASH PASSWORD ──
$hashed = password_hash($password, PASSWORD_BCRYPT);

// ── INSERT USER ──
$stmt = $db->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed);

if (!$stmt->execute()) {
    respondError('Failed to create account. Try again.', 500);
}

$userId = $stmt->insert_id;
$stmt->close();

// ── SET SESSION ──
$_SESSION['user'] = [
    'id'    => $userId,
    'name'  => $name,
    'email' => $email,
    'role'  => 'user',
];

// ── SEND WELCOME EMAIL ──
sendWelcomeEmail($email, $name);

respond([
    'success' => true,
    'message' => 'Account created successfully.',
    'user'    => ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => 'user'],
], 201);
