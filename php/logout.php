<?php
    header("Access-Control-Allow-Origin: *");
    $data = json_decode(file_get_contents("php://input"));
    session_id($data->sessionId);
    session_start();
    $login = "";
    $password = "";
    if (array_key_exists('login', $_SESSION)) {
        $login = $_SESSION['login'];
    }
    if (array_key_exists('password', $_SESSION)) {
        $password = $_SESSION['password'];
    }
    if ($login == null and $password == null) {
        echo false;
    } else {
        session_start();
        session_reset();
        session_destroy();
        echo true;
    }
?>