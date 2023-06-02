<?php
header("Access-Control-Allow-Origin: *");

session_start();
$level_number = null;
$current_time = null;
$time_on_question = null;
$question = null;
$right_answer = null;
$drops = null;
$from_begin = true;
$game_continue = false;
$wait = false;
$change = false;
$login = "";
$password = "";
$speed = 2;
$user_points = 0;
$bowl = ["x" => 0, "y" => 3];
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
    $_SESSION["current_time"] = $current_time;
    $_SESSION["time_on_question"] = $time_on_question;
    $_SESSION["question"] = $question;
    $_SESSION["right_answer"] = $right_answer;
    $_SESSION["answers"] = $drops;
    $_SESSION["from_begin"] = $from_begin;
    $_SESSION["game_continue"] = $game_continue;
    $_SESSION["wait"] = $wait;
    $_SESSION["speed"] = $speed;
    $_SESSION["user_points"] = $user_points;
    $_SESSION["bowl"] = $bowl;
    $_SESSION["change"] = $change;
    echo json_encode([
        "successful" => true,
        "login" => $login,
        "name" => $name
    ]);
}