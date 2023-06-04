$('document').ready(function () {
     $("#container").fadeIn(1000);
    $("#login_button").click(function () {
        check_login();
    });
    $("#reg_button").click(function () {
        window.location.replace('../html/registration.html');
    });
    document.addEventListener('keydown', function (event) {
        if(event.code === 'Enter' ){ 
            check_login();
        }
    })
     
});

function check_extra(id) {
    let input = document.getElementById(id);
    let testing = new RegExp("^([a-z,A-Z,а-яё,А-ЯЁ,0-9]){1,30}$");
    let result = "";
    for (let element of input.value) {
        if (testing.test(element)) {
            result += element;
        };
    };
    input.value = result;
};

function check_login() {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;
    let login_data = {
        login: login,
        password: password
    };
    $.ajax(
            {
                url: "../php/auth.php",
                dataType: "JSON",
                type: "POST",
                data: JSON.stringify(login_data),
                success: function (errors) {

                    if (errors['successful']) {
                        window.location.replace('../html/lk.html');
                    } else {
                        if (errors['login_err'] !== "") {
                            $('#err_login').html(errors['login_err']);
                        } else {
                            $('#err_login').html(errors['password_err']);
                        }
                        $(`#err_login`).show();
                        setTimeout(() => {
                            $(`#err_login`).hide();
                        }, 1500);
                    }
                },
                error: function () {
                    $('#err_login').html("Произошла ошибка!");
                    setTimeout(() => {
                        $(`#err_login`).show();
                    }, 1500);
                }
            }
    );
}