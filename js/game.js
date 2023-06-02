let bowl;
let t = false;
let firework;
let userpoints = 0;
let drop;
$('document').ready(function () {
    drop = new Audio('../sounds/drop.mp3');
    get_infos();
    $("#starts").click(function () {
        start_game();
    });
    $("#2_lk").click(function () {
        window.location.replace('../html/lk.html');
    });
    $("#right_exit").click(function () {
        window.location.replace('../index.html');
    });
    document.addEventListener('keydown', function (event) {
        if (t) {
            if (event.code === 'ArrowDown' || event.code === 'KeyS') {
                if (bowl['y'] > 1)
                    get_info(bowl['y'] - 1);
            }
            if (event.code === 'ArrowUp' || event.code === 'KeyW') {
                if (bowl['y'] < 5)
                    get_info(bowl['y'] + 1);
            }
        }
    });
    firework = JS_FIREWORKS.Fireworks({
        id: 'fireworks-canvas',
        hue: 1200,
        particleCount: 50,
        delay: 0,
        minDelay: 10,
        maxDelay: 30,
        boundaries: {// of respawn and target
            top: 0,
            bottom: document.documentElement.clientHeight * 0.1,
            left: 0,
            right: document.documentElement.clientWidth * 0.2
        },
        fireworkSpeed: 1,
        fireworkAcceleration: 1.05,
        particleFriction: .95,
        particleGravity: 1.0
    });
});

let game;
let speed = 100;
let answered = [];
let lose;

function start_game() {
    clearInterval(lose);
    $("#timer").css(
            {
                "backgroundColor": 'greenyellow'
            });
    $("#div_game").css(
            {
                "backgroundColor": 'pink'
            });
    if (!t) {
        game = setInterval(() => {
            if (t) {
                get_info(-1);
            }
        }, speed);
        document.getElementById("starts").innerHTML = "Игра уже начата!";
    }
    t = true;
}

function get_info(number) {
    let data_to_send = {
        "answered": number};
    $.ajax(
            {
                url: "../php/game.php",
                dataType: "JSON",
                type: "POST",
                data: JSON.stringify(data_to_send),
                success: function (resived_data) {
                    document.getElementById("timer").innerHTML = resived_data["time" ];
                    document.getElementById("game_question").innerHTML = resived_data["question"];
                    bowl = resived_data["balloon"];
                    for (let drop of resived_data['clouds']) {
                        movedrop(drop);
                        $("#drop" + drop["y"] + "_number").html(drop["number"]);
                    }
                    $("#bowl").animate(
                            {
                                top: ((-resived_data["balloon"]["y"] + 1)* ($("#game").height() + $("#game").height()/10)/ 5 - $("#bowl").height() ).toString(),
                                left: (0).toString()
                            }, 0);
                    userpoints = resived_data["user_points"];
                    if (resived_data["message"] === "Неправильно!" || resived_data["message"] === "Время вышло!") {
                        clearInterval(game);
                        t = false;
                        document.getElementById("starts").innerHTML = "Начать заново!";
                        $("#div_game").css(
                                {
                                    "backgroundColor": 'red',
                                });
                        document.getElementById("message").innerHTML = "Игра окончена";
                        $("#message").animate(
                                {
                                    opacity: 100
                                }, 1000)
                        $("#message").animate(
                                {
                                    opacity: 0
                                }, 1000)

                        lose = setInterval(() => {
                            $("#message").animate(
                                    {
                                        opacity: 100
                                    }, 1000)
                            $("#message").animate(
                                    {
                                        opacity: 0
                                    }, 1000)

                        }, 2000);
                    } else if (resived_data["message"] === "Правильно!") {
                        clearInterval(game);
                        t = false
                        $("#timer").css(
                                {
                                    "backgroundColor": 'greenyellow',
                                });
                        firework.start();
                        setTimeout(() => {
                            start_game();
                        }, 6000);
                        setTimeout(() => {
                            firework.stop();
                        }, 6000);
                    }
                },
                error: function () {
                    $("#message").show();
                    document.getElementById("message").innerHTML = "Произошла непредвиденная ошибка! Сообщите о проблеме разработчикам!";
                    setTimeout(() => {
                        $("#message").hide();
                    }, 1500);
                }
            }
    );
}

function movedrop(drop) {
    if (0 < drop["x"] && drop["x"] < 100) {
        $("#drop" + drop["y"]).fadeIn().animate(
                {
                    opacity: 100,
                    left: ((drop["x"]) * $("#game").width() / 100).toString(),
                }, 0).css(
                {
                    "background-image": color(drop['color']),
                });
    } else if (drop["x"] > 100) {
        $("#drop" + drop["y"]).animate(
                {
                    opacity: 0,
                }, 0);
    } else if (drop["x"] <= 0) {
        $("#drop" + drop["y"]).animate(
                {
                    opacity: 0
                }, 0);
        $("#drop" + drop["y"]).animate(
                {
                    left: ($("#game").width()()).toString()
                }, 0);
    }
}

function color(color) {
    switch (color)
    {
        case 1 :
            return 'url("../image/cloud_1.png")';
        case 2 :
            return 'url("../image/cloud_2.png")';
        case 3:
            return 'url("../image/cloud_3.png")';
        default :
            return 'url("../image/cloud_2.png")';
    }
}

function get_infos() {
    let data_to_send = {
        "answered": -1,
    };
    $.ajax(
            {
                url: "../php/lk.php",
                dataType: "JSON",
                type: "POST",
                data: JSON.stringify(data_to_send),
                success: function (data) {
                    if (!data["successful"]) {
                        //    window.location.replace('login.html')
                    } else {
                        let login_html = document.createElement("span");
                        login_html.innerHTML = data["login"];
                        document.getElementById("login_lk").replaceWith(login_html);
                    }
                    ;
                },
                error: function () {
                    //   window.location.replace('login.html');
                }
            }
    );
    $("#bowl").animate(
            {
                top: (-3* ($("#game").height()+ $("#game").height()/10)/ 5 ).toString(),
                left: (0).toString()
            }, 0);
}
