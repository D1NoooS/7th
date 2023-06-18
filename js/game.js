let balloon;
let t = false;
let num_cloud = 0;


$('document').ready(function(){
    get_infos();
    $("#starts").click(function() {
        start_game();
    });
    $("#div_back").click(function() {
        window.location.replace('../html/lk.html');
    });
    $("#2_lk").click(function() {
        window.location.replace('../html/lk.html');
    });
    $("#gameover").animate({
        opacity: 0
    }, 0);
    $('.div_heart').css({'margin': '0 0 10px -40px'});
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Enter') { 
            start_game();
        }
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

let speed = 60;
let game;
let lose;
let k = [];
var myMusic;

function start_game() {
    $('#balloon').animate({
        opacity: 100
    }, 0);
    $('.elements_game').animate({
        opacity: 100
    }, 0);
    document.getElementById("cloud_count").innerHTML = 0;
    $('.div_game').css({'background-image': 'url("../image/rainbow.jpg")'});
    $('.div_game').css({'background-size': '160%'});
    $('#starts').css({'width' : '1100px'});
    $('.main').css({'width' : '16%'});
    $('#div_back').css({'margin-left' : '-2800px'});
    
    $("#heart1").fadeIn().animate({
        opacity: 100
    }, 0);
    $("#heart2").fadeIn().animate({
        opacity: 100
    }, 0);
    $("#heart3").fadeIn().animate({
        opacity: 100
    }, 0);
    $("#gameover").animate({
        opacity: 0
    }, 0);
    $('.div_heart').css({'margin': '0 0 10px 20px'});
    myMusic = new sound("../sounds/bg.mp3");
    myMusic.play();
    clearInterval(lose);
    $("#div_game").css({
        "background": 'linear-gradient(to bottom, rgba(254, 90, 28, 0.9), rgba(255, 225, 52, 0.9)'
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
            get_cloud_count();
            document.getElementById("timer").innerHTML = resived_data["time"];
            k_task = resived_data["k_task"];
            life_count = resived_data["life_count"];
            console.log(life_count);
            if (life_count === 2) {
                $("#heart3").animate({
                    opacity: 0
                }, 0);
            }
            if (life_count === 1) {
                $("#heart3").animate({
                    opacity: 0
                }, 0);
                $("#heart2").animate({
                    opacity: 0
                }, 0);
            }
            if (life_count === 0) {
                $("#heart3").animate({
                    opacity: 0
                }, 0);
                $("#heart2").animate({
                    opacity: 0
                }, 0);
                $("#heart1").animate({
                    opacity: 0
                }, 0);
//                $("#gameover").fadeIn().animate({
//                    opacity: 100
//                }, 0);
                $('.div_heart').css({'margin-left': '-475px'});
            }
            if (k_task === 1) {
                document.getElementById("game_aim").innerHTML = ">" + resived_data["aim"];
                document.getElementById("aim").innerHTML = ">" + resived_data["aim"];   
            }
            else if (k_task === 2) {
                document.getElementById("game_aim").innerHTML = "<" + resived_data["aim"];
                document.getElementById("aim").innerHTML = "<" + resived_data["aim"];  
            }
            else if (k_task === 3) {
                document.getElementById("game_aim").innerHTML = "=" + resived_data["aim"];
                document.getElementById("aim").innerHTML = "=" + resived_data["aim"];  
            }
                     
            balloon = resived_data["balloon"];
            
            for (let cloud of resived_data["clouds"]) {
                movecloud(cloud);
                $("#cloud" + cloud["y"] + "_number").html(cloud["number"]);
            }
            $("#balloon").animate({
                top: ((-resived_data["balloon"]["y"] + 1) * ($("#game").height() + $("#game").height()/10)/5 - $("#balloon").height()).toString()
            }, 0);
            num_cloud = resived_data["num_cloud"];
            if (num_cloud !== null) {
                console.log(speed);
                clearInterval(game);
                speed += -3;
                game = setInterval(() => {
                    if (t) {
                        get_info(-1);
                    }
                }, speed);
                t = true;
            }
            if (resived_data["message"] === "Конец") {
                $('.div_game').css({'background-image': 'url("../image/game_over.png")'});
                $('.div_game').css({'background-size': '100%'});
                $('#balloon').animate({
                    opacity: 0
                }, 0);
                $('.elements_game').animate({
                    opacity: 0
                }, 0);
                myMusic.stop();
                clearInterval(game);
                t = false;
                speed = 60;
                document.getElementById("starts").innerHTML = "Начать заново!";
                $("#div_game").css({
                    "background": 'red'
                });
//                $("#gameover").animate({
//                    opacity: 100
//                }, 1500);
//                $("#gameover").animate({
//                    opacity: 0
//                }, 1500);
//                lose = setInterval(() => {
//                    $("#gameover").animate({
//                        opacity: 100
//                    }, 1000);
//                    $("#gameover").animate({
//                        opacity: 0
//                    }, 1000);
//                }, 2000);
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
            left: ($("#game").width()).toString()
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

function get_cloud_count() {
    $.ajax({
        url: "../php/results.php",
        dataType: "JSON",
        type: "POST",
        success: function(data) {
            login = data["login"];
            for (let i = 0; i < data.all.length; i++) {
                if (data.all[i].login === login){
                    cur_player = data.all[i];
                }
            }
            
            if (cur_player["cloud_count"] === 0) {
                return;
            }
            document.getElementById("cloud_count").innerHTML = cur_player["cloud_count"];


        },
        error: function() {}
    });
};