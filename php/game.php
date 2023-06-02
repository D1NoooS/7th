<?php
header("Access-Control-Allow-Origin: *");
$data = json_decode(file_get_contents("php://input"));
session_start();
$level_number;
$current_time = ((date('h') * 3600) + (date('i') * 60) + date('s'));
$time_on_question;
$question;
$right_answer;
$drops;
$bowl;
$from_begin;
$game_continue;
$wait;
$speed;
$change;
$user_points;
$message = "";
$play_number = 0;
$max_level = 0;
$login = "";
$password = "";
$Time_ = 0;
if (array_key_exists('login', $_SESSION)) {
    $login = $_SESSION['login'];
}
if (array_key_exists('password', $_SESSION)) {
    $password = $_SESSION['password'];
}
if (array_key_exists('level', $_SESSION)) {
    $level_number = $_SESSION["level"];
}
if (array_key_exists('time_on_question', $_SESSION)) {
    $time_on_question = $_SESSION["time_on_question"];
}
if (array_key_exists('question', $_SESSION)) {
    $question = $_SESSION["question"];
}
if (array_key_exists('right_answer', $_SESSION)) {
    $right_answer = $_SESSION["right_answer"];
}
if (array_key_exists('answers', $_SESSION)) {
    $drops = $_SESSION["answers"];
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
if (array_key_exists('bowl', $_SESSION)) {
    $bowl = $_SESSION["bowl"];
}
if ($data->answered != -1) {
    $bowl["y"] = $data->answered;
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

if ($from_begin) {
    $time_on_question = ((date('h') * 3600) + (date('i') * 60) + date('s'));
    $current_time = $time_on_question;
    generation();
    $user_points = 0;
    $from_begin = false;
    $play_number++;
} else {
    if (($current_time - $time_on_question) > $max_time) {
        $max_time = ($current_time - $time_on_question);
    }
    $user_points = check();
    if ($data->answered == -1) {
        $drops = generate($level_number, true)['answers'];
    }
    //проверка условия "> заданного числа" !!!!!!!!!!!
    if (($user_points < $question && $user_points!=-1000)) {
        $message = "Неправильно!";
        $from_begin = true;
    }
    echo json_encode(
            [
                "level" => $level_number,
                "time" => ($current_time - $time_on_question),
                "question" => $question,
                "clouds" => $drops,
                "message" => $message,
                "balloon" => $bowl,
                "user_points" => $user_points
            ]
    );
    
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
$_SESSION["change"] = $change;
$_SESSION["bowl"] = $bowl;
$_SESSION["Time_"] = $Time_;
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

//ПРОВЕРКА НА СТОЛКНОВЕНИЕ
function check() {
    global $drops, $bowl;
    if ($drops[$bowl["y"] - 1]["x"] <= 0 ) {
        return $drops[$bowl["y"] - 1]["number"];
    }
    return -1000;
}

function generation($move = false) {
    global $level_number, $current_time, $time_on_question, $message,
    $question, $drops, $Time_, $bowl, $user_points;
    $temp = generate($level_number, $move);
    $question = $temp["question"];
    $drops = $temp["answers"];
    echo json_encode(
            [
                "time" => ($current_time - $time_on_question),
                "question" => $question,
                "clouds" => $drops,
                "baloon" => $bowl,
                "user_points" => $user_points,
                "message" => $message
            ]
    );
}

//ГЕНЕРАЦИЯ УСЛОВИЯ
function generate($level, $move) {
    global $question;
    $first = rand(-8,8);
    if (!$move) {
        $question = $first;
    }
    $drops1 = [];
    for ($i = 1; $i <= 5; $i++) {
        $dropInfo = generateDrop($i, $move);
        array_push($drops1, $dropInfo);
    }
    return [
        "question" => $question,
        "answers" => $drops1
    ];
}

function generateDrop($i, $move) {
    global $speed, $drops, $level;
    if ($move) {
        if ($drops[$i - 1]['x'] <= 0) {
            return generateDrop($i, !$move);
        }
        return [
            "y" => $drops[$i - 1]['y'],
            "x" => $drops[$i - 1]['x'] - $speed,
            "id" => $drops[$i - 1]['id'],
            "number" => $drops[$i - 1]['number'],
            "color" => $drops[$i - 1]['color']
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
