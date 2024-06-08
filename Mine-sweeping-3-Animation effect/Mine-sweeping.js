var board = new Array();

function set_board_html(flag) {
    var board_str = "";
    if(flag) {
        for(var i = 0; i < 9; ++i) {
            board_str += board[i];
            if(i % 3 == 1) {
                board_str += "秒";
                for(var j = board[i].length; j < 4; ++j) {
                    board_str += "&nbsp;&nbsp;";
                }
            } else if(i % 3 == 2) {
                board_str += "<br />";
            }
        }
    }
    $("#statistics_data").html(board_str);
}

function set_option_html(flag) {
    if(flag) {
        $("#option_data_1").html('<input type="radio" name="option" value="初级"> 初级');
        $("#option_data_2").html('<input type="radio" name="option" value="中级"> 中级');
        $("#option_data_3").html('<input type="radio" name="option" value="高级"> 高级');
    } else {
        $("#option_data_1").html("");
        $("#option_data_2").html("");
        $("#option_data_3").html("");
    }
}

function set_new_game_html(flag) {
    if(flag) {
        $("#new_game").html("新游戏");
    } else {
        $("#new_game").html("");
    }
}

$(document).ready(function() {
    if(localStorage.board) {
        board = localStorage.board.split(",");
    } else {
        board[0] = "初级：";
        board[1] = "999";
        board[2] = "匿名";

        board[3] = "中级：";
        board[4] = "999";
        board[5] = "匿名";
        
        board[6] = "高级：";
        board[7] = "999";
        board[8] = "匿名";
    }

    set_new_game_html(true);

    $(".menu").mouseover(function() {
        $(this).css("opacity","0.6");
    });
    
    $(".menu").mouseout(function() {
        $(this).css("opacity","1.0");
    });

    $("#new_game").click(function() {
        $("#start").animate({bottom: "650"});
    });

    $("#statistics").click(function() {
        set_new_game_html(false);
        set_option_html(false);
        set_board_html(true);
        $("#new_game").hide("slow");
        $("#option_data").hide("slow");
        $("#statistics_data").show("slow");
    });

    $("#statistics_data").click(function() {
        set_board_html(false);
        set_new_game_html(true);
        $("#statistics_data").hide("slow");
        $("#new_game").show("slow");
    });

    $("#option").click(function() {
        set_new_game_html(false);
        set_board_html(false);
        set_option_html(true);
        $("#new_game").hide("slow");
        $("#statistics_data").hide("slow");
        $("#option_data").show("slow");
    });
    
    $("#option_data").click(function() {
        set_option_html(false);
        set_new_game_html(true);
        $("#option_data").hide("slow");
        $("#new_game").show("slow");
    });
});