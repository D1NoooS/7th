$('document').ready(function() {
    get_infos();
    get_info();
    $("#to_main").click(function() {
        window.location.replace('../index.html');
    });
    $("#2_lk").click(function() {
        window.location.replace('../html/lk.html');
    });
});

function get_infos() {
    $.ajax({
        url: "../php/lk.php",
        dataType: "JSON",
        type: "POST",
        success: function(data) {
            if (!data["successful"]) {
                window.location.replace('login.html');
            } else {
                let login_html = document.createElement("span");
                login_html.innerHTML = data["login"];
                document.getElementById("login_lk").replaceWith(login_html);
            };
        },
        error: function() {}
    });
};

function get_info() {
    $.ajax({
        url: "../php/results.php",
        dataType: "JSON",
        type: "POST",
        success: function(data) {
            all_data = data["all"];
            login = data["login"];
            if (all_data.length === 0) {
                let no_history = document.createElement("div");
                no_history.innerHTML = "Список пока пуст!";
                document.getElementById("result_table").replaceWith(no_history);
                } else {
                let table = document.createElement("table");
                table.setAttribute("class", "table");
                let thead = document.createElement("thead");
                let thead_tr = document.createElement("tr");
                let names = ["Место", "Логин", "Максимальное время", "Кол-во игр"];
                for (let i = 0; i < names.length; i++) {
                    let td = document.createElement("th");
                    td.innerHTML = names[i];
                    thead_tr.append(td);
                }
                thead.append(thead_tr);
                table.append(thead);
                let tbody = document.createElement("tbody");
                all_data.forEach(element => {
                    let tbody_tr = document.createElement("tr");
                    let td1 = document.createElement("td");
                    let td2 = document.createElement("td");
                    let td3 = document.createElement("td");
                    let td4 = document.createElement("td");
                    td1.innerHTML = all_data.indexOf(element) + 1;
                    td2.innerHTML = element["login"];
                    td3.innerHTML = element["max_time"];
                    td4.innerHTML = element["games_count"];
                    tbody_tr.append(td1);
                    tbody_tr.append(td2);
                    tbody_tr.append(td3);
                    tbody_tr.append(td4);
                    tbody.append(tbody_tr);
                });
                table.append(tbody);
                document.getElementById("result_table").replaceWith(table);
            };
        },
        error: function() {}
    });
};