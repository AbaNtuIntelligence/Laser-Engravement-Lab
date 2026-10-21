<?php

header("Content-Type: application/json; charset=utf-8");

const DB_HOST = "localhost";
const DB_NAME = "jrnyhytq_laserquotes";
const DB_USER = "jrnyhytq_laserquotesapi";
const DB_PASS = "LaserEngraving@12345";

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $result = $pdo->query("SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema = " . $pdo->quote(DB_NAME))->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Database connection successful.",
        "database" => DB_NAME,
        "user" => DB_USER,
        "table_count" => (int) $result["table_count"]
    ]);

} catch (Throwable $e) {

    error_log(
        "Laser Engraving DB TEST: " .
        $e->getMessage()
    );

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);
}