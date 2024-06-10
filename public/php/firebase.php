<?php

$to = isset($_POST['target']) ? $_POST['target'] : '';
$title = isset($_POST['title']) ? $_POST['title'] : '';
$body = isset($_POST['detail']) ? $_POST['detail'] : '';

// Firebase Cloud Messaging Authorization Key
define('FCM_AUTH_KEY', 'AAAAUnZrYhw:APA91bHaOGRPWjHFxY0_se7LCwN7aFWYt4eaKaHWrn4NpMqnnzKxtsrTeZIYzQoN4eEI40U3gEzZ-Iq3Ru0UWmWKnRelc5gTyqCCJhj9t3j4ZERX4tBTUE0MyGcY8B1j5r1qptv7LoFY');

$postdata = json_encode(
    [
        'notification' =>
            [
                'title' => $title,
                'body' => $body,
            ]
        ,
        'to' => $to
    ]
);

$opts = array('http' =>
    array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/json'."\r\n"
                    .'Authorization: key='.FCM_AUTH_KEY."\r\n",
        'content' => $postdata
    )
);

$context  = stream_context_create($opts);

$result = file_get_contents('https://fcm.googleapis.com/fcm/send', false, $context);
if ($result) {
    header('Content-Type: application/json');
    echo $result;
} else {
    echo json_encode(["error" => "Failed to send notification"]);
}
?>
