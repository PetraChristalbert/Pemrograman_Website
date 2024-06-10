<?php
	include "connection.php";
	$querys = isset($_POST['query']) ? $_POST['query'] : '';
	$query = mysqli_query($con, $querys);
?>