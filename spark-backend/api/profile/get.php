<?php
// ── API/PROFILE/GET.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
$sessionUser = requireAuth();

$db     = getDB();
$userId = $sessionUser['id'];

$stmt = $db->prepare("
    SELECT u.name, u.email, p.*
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.id = ?
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result  = $stmt->get_result();
$profile = $result->fetch_assoc();
$stmt->close();

if (!$profile) {
    respondError('Profile not found.', 404);
}

// Decode interests JSON array
if (!empty($profile['interests'])) {
    $profile['interests'] = json_decode($profile['interests'], true);
}

// Remove internal fields
unset($profile['id'], $profile['user_id']);

respond(['success' => true, 'profile' => $profile]);
