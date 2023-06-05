<?php
    header("Access-Control-Allow-Origin: *");
    $data = json_decode(file_get_contents("php://input"));
    session_start();
    $time1;
    $time2;
    $clouds;
    $balloon;
    $from_begin;
    $aim;
    $game_continue;
    $speed;
    $user_points;
    $message = "";
    $games_count = 0;
    $login = "";
    $password = "";
    if (array_key_exists('login', $_SESSION)) {
        $login = $_SESSION['login'];
    }
    if (array_key_exists('password', $_SESSION)) {
        $password = $_SESSION['password'];
    }
    if (array_key_exists('time1', $_SESSION)) {
        $time1 = $_SESSION["time1"];
    }
    if (array_key_exists('aim', $_SESSION)) {
        $aim = $_SESSION["aim"];
    }
    if (array_key_exists('clouds', $_SESSION)) {
        $clouds = $_SESSION["clouds"];
    }
    if (array_key_exists('from_begin', $_SESSION)) {
        $from_begin = $_SESSION["from_begin"];
    }
    if (array_key_exists('game_continue', $_SESSION)) {
        $game_continue = $_SESSION["game_continue"];
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
    if ($data->k != -1) {
        $balloon["y"] = $data->k;
    }
    $other_users = [];
    $file_datas = json_decode(file_get_contents("../data/stats.json"), true);
    foreach ($file_datas as $element) {
        if ($element["login"] == $login) {
            $max_time = $element["max_time"];
            $games_count = $element["games_count"];
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
        $games_count++;
    } else {
        if (($time2 - $time1) > $max_time) {
            $max_time = ($time2 - $time1);
        }
        $user_points = check();
        if ($data->k == -1) {
            $clouds = generate(true)['clouds'];
        }
        if ($user_points <= $aim && $user_points != -1000) {
            $message = "Конец";
            $from_begin = true;
        }
        echo json_encode([
                "time" => ($time2 - $time1),
                "aim" => $aim,
                "clouds" => $clouds,
                "message" => $message,
                "balloon" => $balloon,
                "user_points" => $user_points
            ]
        );

    }
    $_SESSION["time2"] = $time2;
    $_SESSION["time1"] = $time1;
    $_SESSION["aim"] = $aim;
    $_SESSION["clouds"] = $clouds;
    $_SESSION["from_begin"] = $from_begin;
    $_SESSION["game_continue"] = $game_continue;
    $_SESSION["speed"] = $speed;
    $_SESSION["user_points"] = $user_points;
    $_SESSION["balloon"] = $balloon;
    $statistics_data = [
        "login" => $login,
        "games_count" => $games_count,
        "max_time" => $max_time
    ];
    array_push($other_users, $statistics_data);
    usort($other_users, function ($a, $b) {
        return ($b["max_time"] - $a["max_time"]);
    });
    file_put_contents("../data/stats.json", json_encode(($other_users)));

    function check() {
        global $clouds, $balloon;
        if ($clouds[$balloon["y"] - 1]["x"] <= 0 ) {
            return $clouds[$balloon["y"] - 1]["number"];
        }
        return -1000;
    }

    function generation($move = false) {
        global $time2, $time1, $message, $aim, $clouds, $balloon, $user_points;
        $temp = generate($move);
        $aim = $temp["aim"];
        $clouds = $temp["clouds"];
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

    function generate($move) {
        global $aim;
        $first = rand(-8,8);
        if (!$move) {
            $aim = $first;
        }
        $clouds_ = [];
        for ($i = 1; $i <= 5; $i++) {
            $cloudInfo = generatecloud($i, $move);
            array_push($clouds_, $cloudInfo);
        }
        return [
            "aim" => $aim,
            "clouds" => $clouds_
        ];
    }

    function generatecloud($i, $move) {
        global $speed, $clouds;
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
            "number" => rand(-9,9),
            "color" => rand(1, 7)
        ];
    }
?>