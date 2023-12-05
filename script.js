$(document).ready(function () {
    // Page 1
    showPage1();

    // Page 2 - Handling user name and pizza order
    $(document).on('click', '#submitName', function () {
        var fullName = $('#fullName').val();
        if (validateName(fullName)) {
            showPage2(fullName);
        } else {
            alert('Please enter a valid name.');
        }
    });

    // Page 3 - Handling pizza order confirmation
    $(document).on('click', '#confirmOrder', function () {
        showPage4($('#fullName').text(), 'confirmed');
    });

    $(document).on('click', '#cancelOrder', function () {
        showPage4($('#fullName').text(), 'cancelled');
    });
});

function showPage1() {
    $('#content').html(`
        <div class="card">
            <div class="front">
                <h1 class="header">SET Pizza Shop</h1>
                <label for="fullName">Enter your full name:</label>
                <input type="text" id="fullName" />
                <button id="submitName">Next</button>
            </div>
            <div class="back"></div>
        </div>
    `);

    // Animation for card flip
    setTimeout(function () {
        $('.card').addClass('flipped');
    }, 500); // Delayed to allow the front card to render first
}

function showPage2(name) {
    $('#content').html(`
        <p>Ciao ${name}!</p>
        <p>At SET Pizza Shop, you can only order one large pizza with sauce and cheese.</p>
        <p>Choose your toppings:</p>
        <input type="checkbox" id="pepperoni" class="topping" value="1.50"> Pepperoni<br>
        <input type="checkbox" id="mushrooms" class="topping" value="1.00"> Mushrooms<br>
        <input type="checkbox" id="greenOlives" class="topping" value="1.00"> Green Olives<br>
        <input type="checkbox" id="greenPeppers" class="topping" value="1.00"> Green Peppers<br>
        <input type="checkbox" id="doubleCheese" class="topping" value="2.25"> Double Cheese<br>
        <p>Total Price: $10.00</p>
        <button id="makeIt">Make It!</button>
    `);

    // AJAX call to calculate the total price dynamically
    $(".topping").change(function () {
        updateTotalPrice();
    });

    $(document).on('click', '#makeIt', function () {
        // Collect selected toppings
        var selectedToppings = [];
        $(".topping:checked").each(function () {
            selectedToppings.push($(this).attr("id"));
        });

        // AJAX call to calculate the total price
        $.ajax({
            type: "POST",
            url: "backend.php",
            data: { action: "calculatePrice", selectedToppings: selectedToppings },
            dataType: "json",
            success: function (response) {
                // Display total price
                $("#content").append("<p>Total Price: $" + response.totalPrice + "</p>");
                // Show confirmation page (Page3)
                showPage3(name, selectedToppings, response.totalPrice);
            },
            error: function () {
                alert("Error calculating the total price.");
            }
        });
    });
}

function showPage3(name, selectedToppings, totalPrice) {
    $('#content').append(`
        <p>Your order summary:</p>
        <ul>
            <li>Name: ${name}</li>
            <li>Toppings: ${selectedToppings.join(", ")}</li>
            <li>Total Price: $${totalPrice}</li>
        </ul>
        <button id="confirmOrder">Confirm</button>
        <button id="cancelOrder">Cancel</button>
    `);
}

function updateTotalPrice() {
    var total = 10.00; // Base price

    $(".topping:checked").each(function () {
        total += parseFloat($(this).val());
    });

    $("p:contains('Total Price')").text("Total Price: $" + total.toFixed(2));
}

function showPage4(name, status) {
    $('#content').html(`
        <p>Ciao ${name}!</p>
        <p>Your order has been ${status}.</p>
    `);
}

function validateName(name) {
    return /^[a-zA-Z]+$/.test(name);
}
