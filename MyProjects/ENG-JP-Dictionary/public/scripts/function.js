$(document).ready(function() {
    handleDropdownClick();
    handleClearInput();
    handleJltpLevelClick();
    handleSearchClick(); // This is the ONLY trigger for form submission
});

// Dropdown click: update visible text and hidden input
function handleDropdownClick() {
    $(".dropdown-item").on("click", function(e) {
        e.preventDefault();
        const selectedValue = $(this).data("value");
        $("#dropdownMenuButton1").text(selectedValue);
        $("#wordTypeInput").val(selectedValue); // Artık wordTypeInput güncelleniyor
        console.log("Dropdown value:", selectedValue);
    });
}

// Clear input: just clear the text field
function handleClearInput() {
    $(".clear-icon").on("click", function() {
        $("#exampleDataList").val(""); // Clear the search input
    });
}

// JLPT button click: update active class and hidden input
function handleJltpLevelClick() {
    $("#lookup-btn-group .btn").on("click", function(e) {
        e.preventDefault(); // Prevent default button behavior (e.g., form submission)
        $("#lookup-btn-group .btn").removeClass("active"); // Remove active from others
        $(this).addClass("active"); // Add active to clicked button
        const level = $(this).val(); // Get the value from the button
        $("#levelInput").val(level); // Update hidden input
        console.log("Selected JLPT level or Common:", level);
    });
}


// Search icon click: submit the form with all current values
function handleSearchClick() {
    $(".search-icon").on("click", function() {
        // Trigger the form submission. All hidden inputs will carry their values.
        $("form").submit();
    });
}