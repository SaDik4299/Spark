<?php
// ── API/PROFILE/SAVE.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
$sessionUser = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError('Method not allowed', 405);
}

$body      = getBody();
$userId    = $sessionUser['id'];
$age       = intval($body['age']       ?? 0);
$city      = trim($body['city']        ?? '');
$gender    = trim($body['gender']      ?? '');
$education = trim($body['education']   ?? '');
$field     = trim($body['field']       ?? '');
$status    = trim($body['status']      ?? '');
$interests = json_encode($body['interests'] ?? []);
$priority  = trim($body['priority']    ?? '');
$extra     = trim($body['extra']       ?? '');

// Update user name if provided
if (!empty($body['name'])) {
    $name = trim($body['name']);
    $db = getDB();
    $stmt = $db->prepare("UPDATE users SET name = ? WHERE id = ?");
    $stmt->bind_param("si", $name, $userId);
    $stmt->execute();
    $stmt->close();
    $_SESSION['user']['name'] = $name;
}

$db = getDB();

// Upsert profile (insert or update if exists)
$stmt = $db->prepare("
    INSERT INTO profiles (user_id, age, city, gender, education, field, status, interests, priority, extra)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        age = VALUES(age), city = VALUES(city), gender = VALUES(gender),
        education = VALUES(education), field = VALUES(field), status = VALUES(status),
        interests = VALUES(interests), priority = VALUES(priority), extra = VALUES(extra)
");
$stmt->bind_param("iisssssss s", $userId, $age, $city, $gender, $education, $field, $status, $interests, $priority, $extra);

if (!$stmt->execute()) {
    respondError('Failed to save profile.', 500);
}
$stmt->close();

respond(['success' => true, 'message' => 'Profile saved.']);
