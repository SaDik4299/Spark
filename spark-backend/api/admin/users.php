<?php
// ── API/ADMIN/USERS.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
requireAdmin();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// GET — list all users
if ($method === 'GET') {
    $page  = max(1, intval($_GET['page'] ?? 1));
    $limit = 20;
    $offset = ($page - 1) * $limit;
    $search = trim($_GET['search'] ?? '');

    if ($search) {
        $like = "%$search%";
        $stmt = $db->prepare("
            SELECT u.id, u.name, u.email, u.role, u.created_at,
                   COUNT(DISTINCT q.id) AS quiz_count
            FROM users u
            LEFT JOIN quiz_results q ON q.user_id = u.id
            WHERE u.name LIKE ? OR u.email LIKE ?
            GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?
        ");
        $stmt->bind_param("ssii", $like, $like, $limit, $offset);
    } else {
        $stmt = $db->prepare("
            SELECT u.id, u.name, u.email, u.role, u.created_at,
                   COUNT(DISTINCT q.id) AS quiz_count
            FROM users u
            LEFT JOIN quiz_results q ON q.user_id = u.id
            GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?
        ");
        $stmt->bind_param("ii", $limit, $offset);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $users  = [];
    while ($row = $result->fetch_assoc()) $users[] = $row;
    $stmt->close();

    // Total count
    $total = $db->query("SELECT COUNT(*) as c FROM users")->fetch_assoc()['c'];

    respond(['success' => true, 'users' => $users, 'total' => $total, 'page' => $page]);
}

// DELETE — remove a user
if ($method === 'DELETE') {
    $body   = getBody();
    $userId = intval($body['user_id'] ?? 0);

    // Don't allow deleting admin
    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$user) respondError('User not found.', 404);
    if ($user['role'] === 'admin') respondError('Cannot delete admin account.', 403);

    $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->close();

    respond(['success' => true, 'message' => 'User deleted.']);
}

respondError('Method not allowed.', 405);
