var index = 0;
$('document').ready(function () {
    get_info();
    $("#newGame").click(function () {
        window.location.replace('../html/game.html');
    });
    $("#right_exit").click(function () {
        logout();
    });
    $("#2_results").click(function () {
        window.location.replace('../html/results_table.html');
    });
    $("#lk_2_rules").click(function () {
        window.location.assign('../html/rules.html');
    });
});
function logout() {
    $.ajax(
            {
                url: "../php/logout.php",
                dataType: "JSON",
                type: "POST",
                success: function (response) {
                    console.log('response: ', response);
                    if (!response) {
                        window.location.replace('../index.html');
                    } else {
                        setTimeout(() => {
                            window.location.replace('../index.html');
                        }, 100);
                    }
                    ;
                },
                error: function () {
                    window.location.replace('../index.html');
                }
            }
    );
}
;

function get_info() {
    $.ajax(
            {
                url: "../php/lk.php",
                dataType: "JSON",
                type: "POST",
                success: function (data) {
                    if (!data["successful"]) {
                    } else {
                        let login_html = document.createElement("span");
                        login_html.innerHTML = data["login"];
                        document.getElementById("login_lk").replaceWith(login_html);
                        let name_html = document.createElement("span");
                        name_html.innerHTML = data["name"];
                        document.getElementById("name_lk").replaceWith(name_html);
                    };
                },
                error: function () {
                }
            }
    );
}
;


