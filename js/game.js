let balloon;
let t = false;
let num_cloud = 0;
let firework;

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
    $("#trash").animate({
        opacity: 0
    }, 0);
    $("#lid").animate({
        opacity: 0
    }, 0);
    $('.div_heart').css({'margin': '0 0 10px -120px'}); 
    $('#game_aim').css({'justify-content': 'start'});
    $('#timer').css({'justify-content': 'start'});
    
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
    
    firework = JS_FIREWORKS.Fireworks({
        id: 'fireworks-canvas',
        hue: 360,
        particleCount: 200,
        delay: 0,
        minDelay: 10,
        maxDelay: 30,
        boundaries: {// of respawn and target
            top: 0,
            bottom: document.documentElement.clientHeight * 0.1,
            left: 0,
            right: document.documentElement.clientWidth * 0.2
        },
        fireworkSpeed: 2,
        fireworkAcceleration: 1.05,
        particleFriction: .95,
        particleGravity: 1.0
    });
});

let speed = 50;
let game;
let lose;
let k = [];
var myMusic;
var wasted;         

function start_game() {
    $('.main').css({"background" : "linear-gradient(to bottom, rgba(254, 90, 28, 0.9), rgba(255, 225, 52, 0.9))"}); 
    $('html').css({"background" : "url('../image/bg_balloons.jpg') no-repeat center fixed"});
    $('html').css({"background-size" : "100%"});
    $("#trash").animate({
        opacity: 0
    }, 0);
    $("#lid").animate({
        opacity: 0
    }, 0);
    $("#span_aim").fadeIn(0);
    $("#game_aim").fadeIn(0);
    $('#starts').prop('disabled', true);
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
    
    $("#heart1").fadeIn(0).animate({
        opacity: 100
    }, 0);
    $("#heart2").fadeIn(0).animate({
        opacity: 100
    }, 0);
    $("#heart3").fadeIn(0).animate({
        opacity: 100
    }, 0);
    $("#gameover").animate({
        opacity: 0
    }, 0);
    $('.div_heart').css({'margin': '0 0 10px 20px'});
    myMusic = new sound("../sounds/bg2.mp3", 0.4);
    
    myMusic.play();
    clearInterval(lose);
    $("#div_game").css({"background": 'linear-gradient(to bottom, rgba(254, 90, 28, 0.9), rgba(255, 225, 52, 0.9)'});
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

function sound(src, volume) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = volume;
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
            animate = resived_data["animate"];

            if (animate === 1) {
                $('.game').css({'background': 'linear-gradient(to bottom, rgba(255, 212, 0), rgba(255, 234, 97))'});
                nice = new sound("../sounds/lets_go.mp3", 1);
                nice.play();
                
                firework.start();
                setTimeout(() => {
                    firework.stop();
                }, 1500);
                
                
                if (life_count > 0) {
                    setTimeout(function(){
                        $('.game').css({'background': 'linear-gradient(to bottom, rgba(254, 90, 28, 0.9), rgba(255, 225, 52, 0.9))'});
                        console.log("после");
                    }, 700);   
                }
            }
            else if (animate === -1) {
                $('.game').css({'background': 'linear-gradient(to bottom, rgba(254, 39, 18, 0.9), rgba(193, 20, 20, 0.9))'});
                ugh = new sound("../sounds/ugh.mp3", 1);
                ugh.play();
                if (life_count > 0) {
                    setTimeout(function(){
                        $('.game').css({'background': 'linear-gradient(to bottom, rgba(254, 90, 28, 0.9), rgba(255, 225, 52, 0.9))'});
                        console.log("после");
                    }, 700); 
                }
                  
            }

            if (life_count === 2 && animate === -1) {
                $("#trash").animate({
                    opacity: 100
                }, 100);
                $("#lid").animate({
                    opacity: 100
                }, 100);
                $("#lid").animate({
                    left: "-=400px"
                }, 250);
                $("#heart3").animate({
                    left: "-=2600px"
                }, 200);
                $("#heart3").animate({
                    top: "+=1550px"
                }, 200);
                $("#heart3").animate({
                    opacity: 0
                }, 200);
                $("#lid").animate({
                    left: "+=400px"
                }, 400);
                
                setTimeout(function(){
                    $("#trash").animate({
                        opacity: 0
                    }, 500);
                }, 750);
                $("#lid").animate({
                    opacity: 0
                }, 500);
            }
            if (life_count === 1 && animate === -1) {
                $("#trash").animate({
                    opacity: 100
                }, 100);
                $("#lid").animate({
                    opacity: 100
                }, 100);
                $("#lid").animate({
                    left: "-=400px"
                }, 250);
                $("#heart3").animate({
                    opacity: 0
                }, 0);
                $("#heart2").animate({
                    left: "-=2440px"
                }, 200);
                $("#heart2").animate({
                    top: "+=1550px"
                }, 200);
                $("#heart2").animate({
                    opacity: 0
                }, 200);
                $("#lid").animate({
                    left: "+=400px"
                }, 400);
                setTimeout(function(){
                    $("#trash").animate({
                        opacity: 0
                    }, 500);
                }, 750);
                $("#lid").animate({
                    opacity: 0
                }, 500);
            }
            if (life_count === 0 && animate === -1) {
                $("#trash").animate({
                    opacity: 100
                }, 100);
                $("#lid").animate({
                    opacity: 100
                }, 100);
                $("#lid").animate({
                    left: "-=400px"
                }, 250);
                $("#heart3").animate({
                    opacity: 0
                }, 0);
                $("#heart2").animate({
                    opacity: 0
                }, 0);
                $("#heart1").animate({
                    left: "-=1650px"
                }, 200);
                $("#heart1").animate({
                    top: "+=1550px"
                }, 200);
                $("#heart1").animate({
                    opacity: 0
                }, 200);
                $("#lid").animate({
                    left: "+=400px"
                }, 400);
                setTimeout(function(){
                    $("#trash").animate({
                        opacity: 0
                    }, 100);
                }, 750);
                $("#lid").animate({
                    opacity: 0
                }, 100);
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
                wasted = new sound("../sounds/wasted.mp3", 1);
                wasted.play();
                
                $("#heart3").animate({
                    left: "+=2600px"
                }, 0);
                $("#heart3").animate({
                    top: "-=1550px"
                }, 0);
                
                $("#heart2").animate({
                    left: "+=2440px"
                }, 0);
                $("#heart2").animate({
                    top: "-=1550px"
                }, 0);
                
                $("#heart1").animate({
                    left: "+=1650px"
                }, 0);
                $("#heart1").animate({
                    top: "-=1550px"
                }, 0);
                
                $("#span_aim").fadeOut(0);
                $("#game_aim").fadeOut(0);
                
                $('#starts').prop('disabled', true);
                $('.div_game').css({'background-image': 'none'});
                $('html').css({"background":"url('../image/rain2.gif') left center"});
                $('html').css({"background-size":"100%"});
                $('.game').css({'background': 'rgba(128, 128, 128, 0.1)'});
                $('.main').css({"background" : "rgba(128, 128, 128, 0.1)"}); 
                setTimeout(function(){
                    $('.div_game').css({'background-image': 'url("../image/game_over.png")'});
                    $('.div_game').css({'background-size': '100%'});
                    $('#starts').prop('disabled', false);
                }, 2300);
                
                $('#balloon').animate({
                    opacity: 0
                }, 0);
                $('.elements_game').animate({
                    opacity: 0
                }, 0);
                myMusic.stop();
                clearInterval(game);
                t = false;
                speed = 50;
                document.getElementById("starts").innerHTML = "Начать заново!";
                
                $("#starts").click(function() {
                    wasted.stop();
                });
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