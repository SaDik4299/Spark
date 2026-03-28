<?php
// ── API/ADMIN/DASHBOARD.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
requireAdmin();

$db = getDB();

// ── STATS ──
$stats = [];

$r = $db->query("SELECT COUNT(*) as total FROM users WHERE role = 'user'");
$stats['total_users'] = $r->fetch_assoc()['total'];

$r = $db->query("SELECT COUNT(*) as total FROM quiz_results");
$stats['total_quizzes'] = $r->fetch_assoc()['total'];

$r = $db->query("SELECT COUNT(*) as total FROM profiles");
$stats['total_profiles'] = $r->fetch_assoc()['total'];

$r = $db->query("SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = CURDATE()");
$stats['signups_today'] = $r->fetch_assoc()['total'];

$r = $db->query("SELECT COUNT(*) as total FROM quiz_results WHERE DATE(taken_at) = CURDATE()");
$stats['quizzes_today'] = $r->fetch_assoc()['total'];

// ── RECENT USERS ──
$result = $db->query("
    SELECT u.id, u.name, u.email, u.created_at,
           COUNT(DISTINCT q.id) AS quiz_count,
           p.city, p.education
    FROM users u
    LEFT JOIN quiz_results q ON q.user_id = u.id
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.role = 'user'
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT 20
");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

// ── POPULAR CAREERS ──
$result = $db->query("
    SELECT careers FROM quiz_results ORDER BY taken_at DESC LIMIT 50
");
$careerCount = [];
while ($row = $result->fetch_assoc()) {
    $careers = json_decode($row['careers'], true) ?? [];
    foreach ($careers as $c) {
        $title = $c['title'] ?? '';
        if ($title) $careerCount[$title] = ($careerCount[$title] ?? 0) + 1;
    }
}
arsort($careerCount);
$topCareers = array_slice($careerCount, 0, 10, true);

respond([
    'success'     => true,
    'stats'       => $stats,
    'users'       => $users,
    'top_careers' => $topCareers,
]);
