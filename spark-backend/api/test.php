<?php
// Quick connection test
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../config/db.php';

$result = [];

// Test 1 — PHP working
$result['php'] = 'OK';
$result['php_version'] = phpversion();

// Test 2 — DB connection
try {
    $db = getDB();
    $result['database'] = 'Connected OK';
} catch (Exception $e) {
    $result['database'] = 'FAILED: ' . $e->getMessage();
}

// Test 3 — Tables exist
try {
    $db = getDB();
    $r = $db->query("SHOW TABLES");
    $tables = [];
    while ($row = $r->fetch_row()) $tables[] = $row[0];
    $result['tables'] = $tables;
} catch (Exception $e) {
    $result['tables'] = 'FAILED: ' . $e->getMessage();
}

// Test 4 — Session
session_start();
$_SESSION['test'] = 'working';
$result['session'] = isset($_SESSION['test']) ? 'OK' : 'FAILED';

echo json_encode($result, JSON_PRETTY_PRINT);
