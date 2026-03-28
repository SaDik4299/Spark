<?php
// ── API/AUTH/LOGOUT.PHP ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
startSession();

$_SESSION = [];
session_destroy();

respond(['success' => true, 'message' => 'Logged out successfully.']);
