<?php
// ── API/QUIZ/HISTORY.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
$sessionUser = requireAuth();

$db     = getDB();
$userId = $sessionUser['id'];

$stmt = $db->prepare("
    SELECT id, personality_type, personality_summary, careers, closing_note, quiz_mode, taken_at
    FROM quiz_results
    WHERE user_id = ?
    ORDER BY taken_at DESC
    LIMIT 10
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result  = $stmt->get_result();
$results = [];

while ($row = $result->fetch_assoc()) {
    $row['careers'] = json_decode($row['careers'], true);
    $results[]      = $row;
}
$stmt->close();

respond(['success' => true, 'results' => $results]);
