<?php
// ── API/QUIZ/SAVE.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
$sessionUser = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError('Method not allowed', 405);
}

$body               = getBody();
$userId             = $sessionUser['id'];
$personalityType    = trim($body['personality_type']    ?? '');
$personalitySummary = trim($body['personality_summary'] ?? '');
$careers            = json_encode($body['careers']       ?? []);
$closingNote        = trim($body['closing_note']         ?? '');
$quizMode           = in_array($body['quiz_mode'] ?? '', ['medium','long']) ? $body['quiz_mode'] : 'medium';

if (empty($personalityType) || empty($careers)) {
    respondError('Missing required fields.');
}

$db   = getDB();
$stmt = $db->prepare("
    INSERT INTO quiz_results (user_id, personality_type, personality_summary, careers, closing_note, quiz_mode)
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("isssss", $userId, $personalityType, $personalitySummary, $careers, $closingNote, $quizMode);

if (!$stmt->execute()) {
    respondError('Failed to save quiz results.', 500);
}

$resultId = $stmt->insert_id;
$stmt->close();

respond(['success' => true, 'message' => 'Quiz results saved.', 'result_id' => $resultId], 201);
