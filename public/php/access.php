<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$user     = isset($_POST['user']) ? $_POST['user'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$database = isset($_POST['database']) ? $_POST['database'] : '';
$query    = isset($_POST['query']) ? $_POST['query'] : '';
$server   = "45.76.184.55";

// Log received parameters
error_log("Received request - User: $user, Password: $password, Database: $database, Query: $query");

// Create connection
$con = mysqli_connect($server, $user, $password, $database);

// Check connection
if (!$con) {
    $error_message = mysqli_connect_error();
    error_log("Connection failed: $error_message");
    echo json_encode(['error' => "Connection failed: $error_message"]);
    die();
}

// Perform query
$queryResult = mysqli_query($con, $query);

// Check for query execution errors
if (!$queryResult) {
    $error_message = mysqli_error($con);
    error_log("Query execution failed: $error_message");
    echo json_encode(['error' => "Query execution failed: $error_message"]);
    die();
}

// Fetch results
$json = array();
while($row = mysqli_fetch_assoc($queryResult)){
    foreach ($row as $key => $value) {
        if ($value === null) {
            $row[$key] = '';
        }
    }
    $json[] = $row;
}

// Output results
echo json_encode($json);

// Close connection
mysqli_close($con);
?>
