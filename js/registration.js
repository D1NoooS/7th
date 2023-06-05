$('document').ready(function(){
    $("#reg_button").click(function(){
        check_registration();
    });
    $("#reg_2_log").click(function(){
        window.location.replace('login.html');
    });
    document.addEventListener('keydown', function(event) {
        if(event.code === 'Enter'){ 
            check_registration();
        }
    });
});

function check_registration(){
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;
    let gender = document.getElementById("gender").value;
    let reg_data = {
        name: name,
        surname: surname,
        login: login,
        password: password,
        gender: gender
    };
    $.ajax({
        url: "../php/registration.php",
        dataType: "JSON",
        type: "POST",
        data: JSON.stringify(reg_data),
        success: function(errors){
            replace(errors, 'name_err', 'reg_err_name');
            replace(errors, 'surname_err', 'reg_err_surname');
            replace(errors, 'login_err', 'reg_err_login');
            replace(errors, 'password_err', 'reg_err_password');
            if (errors['successful']){
                document.getElementById("message").innerHTML = "Регистрация прошла успешно! <br> Теперь войдите в аккаунт!";
                setTimeout("window.location.replace('../index.html')", 1500);
            };
        },
        error: function () {
            var msg = 'Прооизошла ошибка!';
            $("#message").show();
            document.getElementById("message").innerHTML = msg;
            setTimeout(() => {
                $("#message").hide();
            }, 3000);
        }
    });
}

function replace(data, field_id, span_id){
    let log_err = document.getElementById(span_id);
    if (data[field_id] !== ""){
        log_err.innerHTML = data[field_id];
        $(`#${span_id}`).show();
        setTimeout(() => {
            $(`#${span_id}`).hide();
        }, 2500);
    };
}
