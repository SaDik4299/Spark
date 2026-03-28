<?php
// ── API/AUTH/ME.PHP — Returns current logged-in user ──

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/session.php';

setCORSHeaders();
startSession();

if (empty($_SESSION['user'])) {
    respond(['authenticated' => false]);
}

respond([
    'authenticated' => true,
    'user'          => $_SESSION['user'],
]);
