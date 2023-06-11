$("document").ready(function() {
    $("#login_button").click(function() {
        check_login();
    });
    $("#reg_button").click(function() {
        window.location.replace('../html/registration.html');
    });
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Enter') { 
            check_login();
        }
    });
});

function check_login() {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;
    let login_data = {
        login: login,
        password: password
    };
    $.ajax({
        url: "../php/login.php",
        dataType: "JSON",
        type: "POST",
        data: JSON.stringify(login_data),
        success: function(errors) {
            if (errors['successful']) {
                $('div').css({'min-height': '+=50px'});
                document.getElementById("message").innerHTML = "Авторизация прошла успешно!";
                setTimeout("window.location.replace('../html/lk.html')", 1500);
            } else {
                if (errors['login_err'] !== "") {
                    $('#err_login').html(errors['login_err']);
                } else {
                    $('#err_login').html(errors['password_err']);
                }
                $('div').css({'min-height': '+=50px'});
                $('#err_login').show();
                setTimeout(() => {
                    $('#err_login').hide();
                    $('div').css({'min-height': '330px'});
                }, 1500);
            }
        },
        error: function() {
            $('div').css({'min-height': '+=50px'});
            $('#err_login').html("Произошла ошибка!");
            $(`#err_login`).show();
            setTimeout(() => {
                $('#err_login').hide();
                $('div').css({'min-height': '330px'});
            }, 3000);
        }
    });
}