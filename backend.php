<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST["action"];

    switch ($action) {
        case "calculatePrice":
            calculatePrice();
            break;
        default:
            // Handle other actions if needed
            break;
    }
}

function calculatePrice() {
    $selectedToppings = $_POST["selectedToppings"];

    // Define prices
    $basePrice = 10.00;
    $prices = [
        "pepperoni" => 1.50,
        "mushrooms" => 1.00,
        "greenOlives" => 1.00,
        "greenPeppers" => 1.00,
        "doubleCheese" => 2.25
    ];

    $totalPrice = $basePrice;

    foreach ($selectedToppings as $topping) {
        if (isset($prices[$topping])) {
            $totalPrice += $prices[$topping];
        }
    }

    // Return the total price
    echo json_encode(["totalPrice" => number_format($totalPrice, 2)]);
}

?>
