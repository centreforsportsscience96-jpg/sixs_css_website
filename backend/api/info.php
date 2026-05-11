<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';

echo json_encode([
    'success' => true,
    'message' => 'Centre for Sports Science API is running',
    'db_type' => 'MySQL'
]);
?>
