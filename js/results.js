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
                let gen_table = document.createElement("table");
                gen_table.setAttribute("class", "table");
                let gen_thead = document.createElement("thead");
                let gen_thead_tr = document.createElement("tr");
                let gen_names = ["Место", "Логин", "Макс. время", "Кол-во игр", "Макс. уровень", "Уровень в послед. игре"];     
                for (let i = 0; i < gen_names.length; i++) {
                    let gen_td = document.createElement("th");
                    gen_td.innerHTML = gen_names[i];
                    gen_thead_tr.append(gen_td);
                }
                gen_thead.append(gen_thead_tr);
                gen_table.append(gen_thead);
                let gen_tbody = document.createElement("tbody");
                all_data.forEach(element => {
                    let tbody_tr = document.createElement("tr");
                    let gen_td1 = document.createElement("td");
                    let gen_td2 = document.createElement("td");
                    let gen_td3 = document.createElement("td");
                    let gen_td4 = document.createElement("td");
                    let gen_td5 = document.createElement("td");
                    let gen_td6 = document.createElement("td");
                    gen_td1.innerHTML = all_data.indexOf(element) + 1;
                    gen_td2.innerHTML = element["login"];
                    gen_td3.innerHTML = element["max_time"];
                    gen_td4.innerHTML = element["games_count"];
                    gen_td5.innerHTML = element["max_cloud_count"];
                    gen_td6.innerHTML = element["cloud_count"];
                    tbody_tr.append(gen_td1);
                    tbody_tr.append(gen_td2);
                    tbody_tr.append(gen_td3);
                    tbody_tr.append(gen_td4);
                    tbody_tr.append(gen_td5);
                    tbody_tr.append(gen_td6);
                    gen_tbody.append(tbody_tr);
                });
                gen_table.append(gen_tbody);
                document.getElementById("result_table").replaceWith(gen_table);
            };

            for (let i = 0; i < data.all.length; i++) {
                if (data.all[i].login === login){
                    cur_player = data.all[i];
                }
            }
            if (cur_player.length === 0) {
                let no_history = document.createElement("div");
                no_history.innerHTML = "Список пока пуст!";
                document.getElementById("personal_table").replaceWith(no_history);
                } else {
                let pers_table = document.createElement("table");
                pers_table.setAttribute("class", "table");
                let pers_thead = document.createElement("thead");
                let pers_thead_tr = document.createElement("tr");
                let pers_names = ["Логин", "Макс. время", "Кол-во игр", "Макс. уровень", "Уровень в послед. игре"];
                for (let i = 0; i < pers_names.length - 1; i++) {
                    let pers_td = document.createElement("th");
                    pers_td.innerHTML = pers_names[i];
                    pers_thead_tr.append(pers_td);
                }
                pers_thead.append(pers_thead_tr);
                pers_table.append(pers_thead);
                let pers_tbody = document.createElement("tbody");
                
                let tbody_tr = document.createElement("tr");
                let pers_td1 = document.createElement("td");
                let pers_td2 = document.createElement("td");
                let pers_td3 = document.createElement("td");
                let pers_td4 = document.createElement("td");
                //let pers_td5 = document.createElement("td");
                pers_td1.innerHTML = cur_player["login"];
                pers_td2.innerHTML = cur_player["max_time"];
                pers_td3.innerHTML = cur_player["games_count"];
                pers_td4.innerHTML = cur_player["max_cloud_count"];
                //pers_td5.innerHTML = cur_player["cloud_count"];      
                tbody_tr.append(pers_td1);
                tbody_tr.append(pers_td2);
                tbody_tr.append(pers_td3);
                tbody_tr.append(pers_td4);
                //tbody_tr.append(pers_td5);
                pers_tbody.append(tbody_tr);
                
                pers_table.append(pers_tbody);
                document.getElementById("pers_table").replaceWith(pers_table);
            };
        },
        error: function() {}
    });
};