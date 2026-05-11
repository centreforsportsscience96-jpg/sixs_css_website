<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = $data['fullName'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $location = $data['location'] ?? '';
    $source = $data['source'] ?? '';
    $message = $data['message'] ?? '';

    // Validation
    if (!$fullName || !$email || !$phone || !$location || !$source || !$message) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'All fields are required'
        ]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO enquiries (full_name, email, phone, location, source, message) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fullName, $email, $phone, $location, $source, $message]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Enquiry Submitted Successfully'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database Error: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed'
    ]);
}
?>
