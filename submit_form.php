<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $description = $_POST["description"];

    // Perform some action with the form data (e.g., save to a database)
    
    // Send a response message
    $response = "Thank you for submitting the form, $name! We will get back to you soon.";
} else {
    $response = "Form submission failed. Please try again.";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Form Submission Result</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h2>Form Submission Result</h2>
    <p><?php echo $response; ?></p>
    <p><a href="index.html">Back to Form</a></p>
</body>
</html>
