let balloon;
let t = false;
let userpoints = 0;

$('document').ready(function(){
    $("#to_main").click(function(){
        window.location.replace('../index.html');
    });
    get_infos();
    $("#starts").click(function() {
        start_game();
    });
    $("#2_lk").click(function() {
        window.location.replace('../html/lk.html');
    });
    document.addEventListener('keydown', function(event) {
        if (t) {
            if (event.code === 'ArrowDown' || event.code === 'KeyS') {
                if (balloon['y'] > 1) {
                    get_info(balloon['y'] - 1);
                }
            }
            if (event.code === 'ArrowUp' || event.code === 'KeyW') {
                if (balloon['y'] < 5)
                    get_info(balloon['y'] + 1);
            }
        }
    });
});

let game;
let speed = 80;
let k = [];
let lose;
var myMusic;

function start_game() {
    myMusic = new sound("../sounds/bg.mp3");
    myMusic.play();
    clearInterval(lose);
    $("#div_game").css({
        "backgroundColor": 'rgba(16,58,158,0.6)'
    });
    if (!t) {
        game = setInterval(() => {
            if (t) {
                get_info(-1);
            }
        }, speed);
        document.getElementById("starts").innerHTML = "Игра уже идет!";
    }
    t = true;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };   
}

function get_info(number) {
    let data_to_send = {
        "k": number
    };
    $.ajax({
        url: "../php/game.php",
        dataType: "JSON",
        type: "POST",
        data: JSON.stringify(data_to_send),
        success: function(resived_data) {
            document.getElementById("timer").innerHTML = resived_data["time"];
            document.getElementById("game_aim").innerHTML = ">" + resived_data["aim"];
            document.getElementById("user_points").innerHTML = ">" + resived_data["aim"];            
            balloon = resived_data["balloon"];
            for (let cloud of resived_data["clouds"]) {
                movecloud(cloud);
                $("#cloud" + cloud["y"] + "_number").html(cloud["number"]);
            }
            $("#balloon").animate({
                top: ((-resived_data["balloon"]["y"] + 1) * ($("#game").height() + $("#game").height()/10)/5 - $("#balloon").height()).toString()
            }, 0);
            userpoints = resived_data["user_points"];
            if (resived_data["message"] === "Конец") {
                myMusic.stop();
                clearInterval(game);
                t = false;
                document.getElementById("starts").innerHTML = "Начать заново!";
                $("#div_game").css({
                    "backgroundColor": 'red'
                });
                document.getElementById("message").innerHTML = "Игра окончена";
                $("#message").animate({
                    opacity: 100
                }, 1000);
                $("#message").animate({
                    opacity: 0
                }, 1000);
                lose = setInterval(() => {
                    $("#message").animate({
                        opacity: 100
                    }, 1000);
                    $("#message").animate({
                        opacity: 0
                    }, 1000);
                }, 2000);
            } else if (resived_data["message"] === "Ок") {
                clearInterval(game);
                t = false;
            }
        },
        error: function() {}
    });
}

function movecloud(cloud) {
    if (0 < cloud["x"] && cloud["x"] < 100) {
        $("#cloud" + cloud["y"]).fadeIn().animate({
                    opacity: 100,
                    left: ((cloud["x"]) * $("#game").width() / 100).toString()
                }, 0).css({
                    "background-image": color(cloud['color'])
                });
    } else if (cloud["x"] > 100) {
        $("#cloud" + cloud["y"]).animate({
            opacity: 0
        }, 0);
    } else if (cloud["x"] <= 0) {
        $("#cloud" + cloud["y"]).animate({
            opacity: 0
        }, 0);
        $("#cloud" + cloud["y"]).animate({
            left: ($("#game").width()()).toString()
        }, 0);
    }
}

function color(color) {
    switch(color) {
        case 1:
            return 'url("../image/cloud1.png")';
        case 2:
            return 'url("../image/cloud2.png")';
        case 3:
            return 'url("../image/cloud3.png")';
        case 4:
            return 'url("../image/cloud4.png")';
        case 5:
            return 'url("../image/cloud5.png")';
        case 6:
            return 'url("../image/cloud6.png")';
        case 7:
            return 'url("../image/cloud7.png")';
        default:
            return 'url("../image/cloud2.png")';
    }
}

function get_infos() {
    let data_to_send = {
        "k": -1
    };
    $.ajax({
        url: "../php/lk.php",
        dataType: "JSON",
        type: "POST",
        data: JSON.stringify(data_to_send),
        success: function(data) {
            if (!data["successful"]) {
            } else {
                let login_html = document.createElement("span");
                login_html.innerHTML = data["login"];
                document.getElementById("login_lk").replaceWith(login_html);
            };
        },
        error: function(){}
    });
    $("#balloon").animate({
            top: (-2.71 * ($("#game").height() + $("#game").height()/10)/5).toString()
    }, 0);
}
