<?php
header("Access-Control-Allow-Origin: *");
$data = json_decode(file_get_contents("php://input"));
session_start();
$level_number;
$time2;
$clouds;
$balloon;
$from_begin;
$aim;
$game_continue;
$wait;
$speed;
$change;
$time1;
$user_points;
$message = "";
$play_number = 0;
$login = "";
$password = "";
if (array_key_exists('login', $_SESSION)) {
    $login = $_SESSION['login'];
}
if (array_key_exists('password', $_SESSION)) {
    $password = $_SESSION['password'];
}
if (array_key_exists('level', $_SESSION)) {
    $level_number = $_SESSION["level"];
}
if (array_key_exists('time1', $_SESSION)) {
    $time1 = $_SESSION["time1"];
}
if (array_key_exists('aim', $_SESSION)) {
    $aim = $_SESSION["aim"];
}
if (array_key_exists('answers', $_SESSION)) {
    $clouds = $_SESSION["answers"];
}
if (array_key_exists('from_begin', $_SESSION)) {
    $from_begin = $_SESSION["from_begin"];
}
if (array_key_exists('game_continue', $_SESSION)) {
    $game_continue = $_SESSION["game_continue"];
}
if (array_key_exists('wait', $_SESSION)) {
    $wait = $_SESSION["wait"];
}
if (array_key_exists('change', $_SESSION)) {
    $change = $_SESSION["change"];
}
if (array_key_exists('speed', $_SESSION)) {
    $speed = $_SESSION["speed"];
}
if (array_key_exists('user_points', $_SESSION)) {
    $user_points = $_SESSION["user_points"];
}
if (array_key_exists('balloon', $_SESSION)) {
    $balloon = $_SESSION["balloon"];
}
if ($data->answered != -1) {
    $balloon["y"] = $data->answered;
}
$other_users = [];
$file_datas = json_decode(file_get_contents("../data/statictics.json"), true);
foreach ($file_datas as $element) {
    if ($element["login"] == $login) {
        $max_time = $element["max_time"];
        $play_number = $element["play_number"];
    } else {
        array_push($other_users, $element);
    }
}
$time2 = ((date('h') * 3600) + (date('i') * 60) + date('s'));
if ($from_begin) {
    $time1 = ((date('h') * 3600) + (date('i') * 60) + date('s'));
    generation();
    $user_points = 0;
    $from_begin = false;
    $play_number++;
} else {
    if (($time2 - $time1) > $max_time) {
        $max_time = ($time2 - $time1);
    }
    $user_points = check();
    if ($data->answered == -1) {
        $clouds = generate($level_number, true)['answers'];
    }
    if (($user_points < $aim && $user_points!=-1000)) {
        $message = "Неправильно!";
        $from_begin = true;
    }
    echo json_encode(
            [
                "level" => $level_number,
                "time" => ($time2 - $time1),
                "aim" => $aim,
                "clouds" => $clouds,
                "message" => $message,
                "balloon" => $balloon,
                "user_points" => $user_points
            ]
    );
    
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
$_SESSION["change"] = $change;
$_SESSION["balloon"] = $balloon;
$statistics_data = [
    "login" => $login,
    "play_number" => $play_number,
    "max_time" => $max_time
];
array_push($other_users, $statistics_data);
usort($other_users, function ($a, $b) {
    return ($b["max_time"] - $a["max_time"]);
});
file_put_contents("../data/statictics.json", json_encode(($other_users)));

function check() {
    global $clouds, $balloon;
    if ($clouds[$balloon["y"] - 1]["x"] <= 0 ) {
        return $clouds[$balloon["y"] - 1]["number"];
    }
    return -1000;
}

function generation($move = false) {
    global $level_number, $time2, $time1, $message,
    $aim, $clouds, $balloon, $user_points;
    $temp = generate($level_number, $move);
    $aim = $temp["aim"];
    $clouds = $temp["answers"];
    echo json_encode(
            [
                "time" => ($time2 - $time1),
                "aim" => $aim,
                "clouds" => $clouds,
                "baloon" => $balloon,
                "user_points" => $user_points,
                "message" => $message
            ]
    );
}

function generate($level, $move) {
    global $aim;
    $first = rand(-8,8);
    if (!$move) {
        $aim = $first;
    }
    $clouds1 = [];
    for ($i = 1; $i <= 5; $i++) {
        $cloudInfo = generatecloud($i, $move);
        array_push($clouds1, $cloudInfo);
    }
    return [
        "aim" => $aim,
        "answers" => $clouds1
    ];
}

function generatecloud($i, $move) {
    global $speed, $clouds, $level;
    if ($move) {
        if ($clouds[$i - 1]['x'] <= 0) {
            return generatecloud($i, !$move);
        }
        return [
            "y" => $clouds[$i - 1]['y'],
            "x" => $clouds[$i - 1]['x'] - $speed,
            "id" => $clouds[$i - 1]['id'],
            "number" => $clouds[$i - 1]['number'],
            "color" => $clouds[$i - 1]['color']
        ];
    }
    return [
        "y" => $i,
        "x" => 100 + rand(1, 10) * 10,
        "id" => $i,
        "number" => rand(-10, 10),
        "color" => rand(1, 5)
    ];
}
