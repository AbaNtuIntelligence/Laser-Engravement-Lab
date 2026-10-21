<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Laser Engraving Store - Quote API
|--------------------------------------------------------------------------
|
| Endpoint:
|   POST /api/quote.php
|
| Database:
|   jrnyhytq_laserquotes
|
| Tables:
|   quotes
|   quote_items
|
| This endpoint is designed to work with the existing Next.js
| request-quote frontend.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| CORS / Response
|--------------------------------------------------------------------------
*/

header("Content-Type: application/json; charset=utf-8");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");


/*
|--------------------------------------------------------------------------
| Handle browser preflight
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}


/*
|--------------------------------------------------------------------------
| Helper: JSON response
|--------------------------------------------------------------------------
*/

function json_response(
    bool $success,
    array $data = [],
    int $status = 200
): never {

    http_response_code($status);

    echo json_encode(
        array_merge(
            ["success" => $success],
            $data
        ),
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}


/*
|--------------------------------------------------------------------------
| Only POST is allowed
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    json_response(
        false,
        [
            "error" => "Method not allowed."
        ],
        405
    );
}


/*
|--------------------------------------------------------------------------
| Database configuration
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Replace DB_PASSWORD with the actual Axxess database password.
|
| Do NOT put the password into the frontend.
|
|--------------------------------------------------------------------------
*/

const DB_HOST = "localhost";
const DB_NAME = "jrnyhytq_laserquotes";
const DB_USER = "jrnyhytq_laserquotesapi";
const DB_PASSWORD = "LaserEngraving@12345";


/*
|--------------------------------------------------------------------------
| Store configuration
|--------------------------------------------------------------------------
|
| Replace STORE_EMAIL with the actual email address that should receive
| new quote notifications.
|
| If you do not want email notification temporarily, leave it empty.
|
|--------------------------------------------------------------------------
*/

const STORE_EMAIL = "sales@engravinglapgiftstore.co.za";
const STORE_NAME = "Laser Engraving Store";


/*
|--------------------------------------------------------------------------
| Read JSON request
|--------------------------------------------------------------------------
*/

$rawInput = file_get_contents("php://input");

if ($rawInput === false || trim($rawInput) === "") {

    json_response(
        false,
        [
            "error" => "Request body is empty."
        ],
        400
    );
}


$data = json_decode(
    $rawInput,
    true
);


if (!is_array($data)) {

    json_response(
        false,
        [
            "error" => "Invalid JSON request."
        ],
        400
    );
}


/*
|--------------------------------------------------------------------------
| Read customer fields
|--------------------------------------------------------------------------
*/

$customerName = trim(
    (string)($data["customer_name"] ?? "")
);

$company = trim(
    (string)($data["company"] ?? "")
);

$email = trim(
    (string)($data["email"] ?? "")
);

$phone = trim(
    (string)($data["phone"] ?? "")
);

$engravingRequirements = trim(
    (string)($data["engraving_requirements"] ?? "")
);

$additionalRequirements = trim(
    (string)($data["additional_requirements"] ?? "")
);

$items = $data["items"] ?? null;


/*
|--------------------------------------------------------------------------
| Validate customer information
|--------------------------------------------------------------------------
*/

if ($customerName === "") {

    json_response(
        false,
        [
            "error" => "Customer name is required."
        ],
        422
    );
}


if ($email === "") {

    json_response(
        false,
        [
            "error" => "Email address is required."
        ],
        422
    );
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    json_response(
        false,
        [
            "error" => "Please provide a valid email address."
        ],
        422
    );
}


if ($phone === "") {

    json_response(
        false,
        [
            "error" => "Phone number is required."
        ],
        422
    );
}


/*
|--------------------------------------------------------------------------
| Validate items
|--------------------------------------------------------------------------
*/

if (!is_array($items) || count($items) === 0) {

    json_response(
        false,
        [
            "error" => "At least one quote item is required."
        ],
        422
    );
}


/*
|--------------------------------------------------------------------------
| Prepare items
|--------------------------------------------------------------------------
*/

$preparedItems = [];


foreach ($items as $item) {

    if (!is_array($item)) {
        continue;
    }


    $product = $item["product"] ?? null;

    if (!is_array($product)) {
        continue;
    }


    $productId = trim(
        (string)($product["id"] ?? "")
    );

    $productName = trim(
        (string)($product["name"] ?? "")
    );

    $sku = trim(
        (string)($product["sku"] ?? "")
    );


    $quantity = (int)(
        $item["quantity"] ?? 0
    );


    /*
    |--------------------------------------------------------------------------
    | Validate required product fields
    |--------------------------------------------------------------------------
    */

    if ($productId === "") {
        continue;
    }

    if ($productName === "") {
        continue;
    }

    if ($quantity < 1) {
        continue;
    }


    /*
    |--------------------------------------------------------------------------
    | Store a snapshot of the product information
    |--------------------------------------------------------------------------
    |
    | The quote keeps the product name, SKU and quantity submitted
    | at the time the customer requested the quote.
    |
    |--------------------------------------------------------------------------
    */

    $preparedItems[] = [
        "product_id" => $productId,
        "sku" => ($sku !== "" ? $sku : null),
        "product_name" => $productName,
        "quantity" => $quantity
    ];
}


if (count($preparedItems) === 0) {

    json_response(
        false,
        [
            "error" => "No valid quote items were supplied."
        ],
        422
    );
}


/*
|--------------------------------------------------------------------------
| Generate quote reference
|--------------------------------------------------------------------------
|
| Example:
|
| LQ-20260923-A7F31C9D
|
|--------------------------------------------------------------------------
*/

function generate_quote_reference(): string
{
    return "LQ-" .
        date("Ymd") .
        "-" .
        strtoupper(
            bin2hex(
                random_bytes(4)
            )
        );
}


/*
|--------------------------------------------------------------------------
| Database connection
|--------------------------------------------------------------------------
*/

try {

    $dsn =
        "mysql:host=" .
        DB_HOST .
        ";dbname=" .
        DB_NAME .
        ";charset=utf8mb4";


    $pdo = new PDO(
        $dsn,
        DB_USER,
        DB_PASSWORD,
        [
            PDO::ATTR_ERRMODE =>
                PDO::ERRMODE_EXCEPTION,

            PDO::ATTR_DEFAULT_FETCH_MODE =>
                PDO::FETCH_ASSOC,

            PDO::ATTR_EMULATE_PREPARES =>
                false
        ]
    );

} catch (Throwable $e) {

    error_log(
        "Laser Engraving Quote API: " .
        $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}


/*
|--------------------------------------------------------------------------
| Create quote
|--------------------------------------------------------------------------
*/

try {

    $pdo->beginTransaction();


    /*
    |--------------------------------------------------------------------------
    | Generate a unique reference
    |--------------------------------------------------------------------------
    */

    do {

        $reference =
            generate_quote_reference();


        $checkReference = $pdo->prepare(
            "
            SELECT id
            FROM quotes
            WHERE reference = ?
            LIMIT 1
            "
        );


        $checkReference->execute(
            [$reference]
        );


        $referenceExists =
            $checkReference->fetch() !== false;

    } while ($referenceExists);


    /*
    |--------------------------------------------------------------------------
    | Insert quote header
    |--------------------------------------------------------------------------
    */



    $quoteId =
        (int)$pdo->lastInsertId();


    /*
    |--------------------------------------------------------------------------
    | Insert quote items
    |--------------------------------------------------------------------------
    */

    $itemStatement = $pdo->prepare(
        "
        INSERT INTO quote_items (
            quote_id,
            product_id,
            sku,
            product_name,
            quantity
        )
        VALUES (
            :quote_id,
            :product_id,
            :sku,
            :product_name,
            :quantity
        )
        "
    );


    foreach ($preparedItems as $item) {

        $itemStatement->execute(
            [
                ":quote_id" =>
                    $quoteId,

                ":product_id" =>
                    $item["product_id"],

                ":sku" =>
                    $item["sku"],

                ":product_name" =>
                    $item["product_name"],

                ":quantity" =>
                    $item["quantity"]
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Commit transaction
    |--------------------------------------------------------------------------
    */

    $pdo->commit();


} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }


    error_log(
        "Laser Quote API database error: " .
        $e->getMessage()
    );


    $itemStatement = $pdo->prepare(
        "
        INSERT INTO quote_items (
            quote_id,
            product_id,
            sku,
            product_name,
            quantity
        )
        VALUES (
            :quote_id,
            :product_id,
            :sku,
            :product_name,
            :quantity
        )
        "
    );


    foreach ($preparedItems as $item) {

        $itemStatement->execute(
            [
                ":quote_id" =>
                    $quoteId,

                ":product_id" =>
                    $item["product_id"],

                ":sku" =>
                    $item["sku"],

                ":product_name" =>
                    $item["product_name"],

                ":quantity" =>
                    $item["quantity"]
            ]
        );
    }
    $emailLines[] =
        "New quote request received.";


    $emailLines[] =
        "";


    $emailLines[] =
        "Reference: " .
        $reference;


    $emailLines[] =
        "Customer: " .
        $customerName;


    if ($company !== "") {

        $emailLines[] =
            "Company: " .
            $company;
    }


    $emailLines[] =
        "Email: " .
        $email;


    $emailLines[] =
        "Phone: " .
        $phone;


    $emailLines[] =
        "";


    $emailLines[] =
        "Items:";


    foreach ($preparedItems as $item) {

        $line =
            "- " .
            $item["product_name"] .
            " x " .
            $item["quantity"];


        if ($item["sku"] !== null) {

            $line .=
                " (" .
                $item["sku"] .
                ")";
        }


        $emailLines[] =
            $line;
    }


    $emailLines[] =
        "";




    if ($engravingRequirements !== "") {

        $emailLines[] =
            "";


        $emailLines[] =
            "Engraving requirements:";


        $emailLines[] =
            $engravingRequirements;
    }


    if ($additionalRequirements !== "") {

        $emailLines[] =
            "";


        $emailLines[] =
            "Additional requirements:";


        $emailLines[] =
            $additionalRequirements;
    }


    $emailBody =
        implode(
            PHP_EOL,
            $emailLines
        );


    $headers = [];


    $headers[] =
        "From: " .
        STORE_NAME .
        " <" .
        STORE_EMAIL .
        ">";


    $headers[] =
        "Reply-To: " .
        $email;


    $headers[] =
        "Content-Type: text/plain; charset=UTF-8";


    $emailSent =
        mail(
            STORE_EMAIL,
            $subject,
            $emailBody,
            implode(
                PHP_EOL,
                $headers
            )
        );
}


/*
|--------------------------------------------------------------------------
| Success response
|--------------------------------------------------------------------------
|
| This matches the existing Next.js request-quote page:
|
| response.quote.reference
|
|--------------------------------------------------------------------------
*/

json_response(
    true,
    [
        "message" =>
            "Quote request submitted successfully.",

        "quote" => [
            "id" =>
                $quoteId,

            "reference" =>
                $reference,

            "status" =>
                "pending",

                    2,
                    ".",
                    ""

