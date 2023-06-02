<?php
header("Access-Control-Allow-Origin: *");
//header('Content-type:application/json;charset=utf-8');

    $data = json_decode(file_get_contents("php://input"));
    $successful = True;
    $file_data = json_decode(file_get_contents("../data/users.json"));
    $name_error = check_name($data);
    if ($name_error != ""){
        $successful = false;
    }
    $surname_err = check_surname($data);
    if ($surname_err != ""){
        $successful = false;
    }
   
    $login_error = check_login($data, $file_data);
    if ($login_error != ""){
       $successful = false;
   }
   
    $password_error = check_password($data);  
    if ($password_error != ""){
        $successful = false;
    }
   
    if ($successful){
        $current_user = array(
            "name" => $data->name,
            "surname" => $data->surname,
            "gender" => $data->gender,
            "login" => $data->login,
            "password" => $data->password,
            "review" => []
        );
        array_push($file_data, $current_user);
        file_put_contents("../data/users.json", json_encode($file_data));
    }
    $errors = array(
        "name_err" => $name_error,
        "surname_err" => $surname_err,
        "login_err" => $login_error,
        "password_err" => $password_error,
        "successful" => $successful
    );
    echo json_encode($errors);
?>

<?php
function check_name($data){
    setlocale(LC_ALL, "ru_RU.UTF-8");
    $name = "";
    if ($data != null){
        if (property_exists($data, 'name')){
            $name = $data->name;
        };
    };
    if ($name == null){
        return "Поле Имя не может быть пустым!";
    };
    if (!preg_match('/^[а-яА-Яa-zA-Z]{0,30}+$/u', $name)){
        return "В поле Имя допустимы лишь буквы";
    };
    if (!preg_match('/^[А-ЯA-Z][а-яА-Яa-zA-Z]{0,30}+$/u', $name)){
        return "Имя должно начинаться с заглавной буквы!";
    };
    if (!preg_match('/^[А-ЯA-Z][а-яa-z]{0,30}+$/u', $name)){
        return "Вторая и последующие буквы должны быть строчными!";
    };
    return '';
};
?>

<?php
function check_surname($data){
    setlocale(LC_ALL, "ru_RU.UTF-8");
    $name = "";
    if ($data != null){
        if (property_exists($data, 'name')){
            $name = $data->surname;
        }
    }
     if ($name == null){
        return "Поле Фамилия не может быть пустым!";
    }
     if (!preg_match('/^[а-яА-Яa-zA-Z]{0,30}+$/u', $name)){
        return "В поле Фамилия допустимы лишь буквы";
    }   
    if (!preg_match('/^[А-ЯA-Z][а-яА-Яa-zA-Z]{0,30}+$/u', $name)){
        return "Фамилия должно начинаться с заглавной буквы!";
    }   
     if (!preg_match('/^[А-ЯA-Z][а-яa-z]{0,30}+$/u', $name)){
        return "Вторая и последующие буквы должны быть строчными!";
    }
    return '';
}
?>

<?php
function check_login($data, $file_data){
    $login = "";
    if ($data != null){
        if (property_exists($data, 'login')){
            $login = $data->login;
        }
    }
    if ($login == null){
        return "Поле Логин не может быть пустым!";
    }   
    foreach ($file_data as $element){
        if (property_exists($element, 'login')){
            if ($element->login == $login){
                return "Пользователь с таким логином уже существует!";
            }
        }
    }    
    return '';
}
?>

<?php
function check_password($data){
    $password = "";
    if ($data != null){
        if (property_exists($data, 'password')){
            $password = $data->password;
        }
    } 
    $password_error ="";
    if ($password == null){
        $password_error = "Поле Пароль не может быть пустым!";
    }
   
    return $password_error;
}
?>