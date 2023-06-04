<?php
header("Access-Control-Allow-Origin: *");

session_start();
$level_number = null;
$time2 = null;
$time1 = null;
$aim = null;
$clouds = null;
$from_begin = true;
$game_continue = false;
$wait = false;
$change = false;
$login = "";
$password = "";
$speed = 2;
$user_points = 0;
$balloon = ["x" => 0, "y" => 3];
if (array_key_exists('login', $_SESSION)) {
    $login = $_SESSION['login'];
}
if (array_key_exists('password', $_SESSION)) {
    $password = $_SESSION['password'];
}
if ($login == null and $password == null) {
    echo json_encode([
        "successful" => false,
        "login" => "",
        "name" => ""
    ]);
} else {
    $file_data = json_decode(file_get_contents("../data/users.json"));
    foreach ($file_data as $element) {
        if ($element->login == $login) {
            if ($element->password == $password) {
                $name = $element->name;
            }
        }
    }
    $_SESSION["level"] = $level_number;
    $_SESSION["time2"] = $time2;
    $_SESSION["time1"] = $time1;
    $_SESSION["aim"] = $aim;
    $_SESSION["answers"] = $clouds;
    $_SESSION["from_begin"] = $from_begin;
    $_SESSION["game_continue"] = $game_continue;
    $_SESSION["wait"] = $wait;
    $_SESSION["speed"] = $speed;
    $_SESSION["user_points"] = $user_points;
    $_SESSION["balloon"] = $balloon;
    $_SESSION["change"] = $change;
    echo json_encode([
        "successful" => true,
        "login" => $login,
        "name" => $name
    ]);
}