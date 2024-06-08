var board = new Array();
var delay_time = 300;
var row_list = [9, 16, 16];
var col_list = [9, 16, 30];
var mine_cnt_list = [10, 40, 99];
var button_width = 30;
var button_height = 30;
var row, col, level;
var mine_cnt, pack_remain, clock_time, time_out;
var str;
var playing;    // 0: 未开始   1: 开始   2: 成功结束   3: 失败结束
var click_flag; // 0: 未点击   1: 左击   2: 右击   3: 左右连击
var pack_data = new Array();  //  -1: 雷    0~8: 附近雷的个数   // 这是一个数组
var pack_open = new Array();  // 0: 没翻开没标记  1: 没翻开，标记为旗  2: 没翻开，标记为'?'  3. 翻开     // 这是一个数组
var quex = new Array();
var quey = new Array();
var num_english = ["none", "one", "two", "three", "four", "five", "six", "seven", "eight"];
var dir = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];

function set_board_html() {
    var board_str = "";
    for(var i = 0; i < 9; ++i) {
        board_str += board[i];
        if(i % 3 == 0) {
            board_str += "：";
        } else if(i % 3 == 1) {
            board_str += "秒";
            for(var j = board[i].length; j < 4; ++j) {
                board_str += "&nbsp;&nbsp;";
            }
        } else if(i % 3 == 2) {
            board_str += "<br />";
        }
    }
    $("#statistics_data").html(board_str);
}

function back_to_menu() {
    $("#game_interface").animate({opacity: "0.0"}, delay_time * 2);
    $("#start").animate({top: "0px"}, delay_time * 2);
    setTimeout('$("#game_interface").hide();', delay_time * 2);
}

function judge_in(x, y) {
    if(x >= 0 && x < row && y >= 0 && y < col) {
        return true;
    } else {
        return false;
    }
}

function set_mines(x, y) {
    var rand, xx, yy, dx, dy;
    var cnt = 0;
    while(cnt < mine_cnt) {
        rand = parseInt(Math.random() * (row * col));
        xx = Math.floor(rand / col);
        yy = rand % col;
        if(xx != x && yy != y && pack_data[rand] != -1) {
            pack_data[rand] = -1;
            ++cnt;
        }
    }
    for(var i = 0; i < row * col; ++i) {
        if(pack_data[i] != -1) {
            xx = Math.floor(i / col);
            yy = i % col;
            for(var j = 0; j < 8; ++j) {
                dx = xx + dir[j][0];
                dy = yy + dir[j][1];
                if(judge_in(dx, dy) && pack_data[dx * col + dy] == -1) {
                    ++pack_data[i];
                }
            }
        }
    }
}

function open_one_pack(x, y, has_over) {
    var itself = $("#" + (x * col + y).toString());
    var the_open = pack_open[x * col + y];
    var the_data = pack_data[x * col + y];
    pack_open[x * col + y] = 3;
    if(has_over) {
        if(the_open == 0 || the_open == 2) {
            itself.attr("class", "pack failed");
        } else {
            itself.attr("class", "pack failflag");
        }
    } else {
        if(the_open == 0 || the_open == 2) {
            if(the_data == -1) {
                playing = 3;
                itself.attr("class", "pack boom");
            } else {
                --pack_remain;
                itself.attr("class", "pack " + num_english[the_data]);
                if(pack_remain == 0) {
                    playing = 2;
                }
            }
        }
    }
}

function bfs_open_pack(x, y) {
    var xx, yy;
    quex.push(x);
    quey.push(y);
    while(quex.length != 0) {
        var tmpx = quex.shift();
        var tmpy = quey.shift();
        open_one_pack(tmpx, tmpy, false);
        if(pack_data[tmpx * col + tmpy] != 0) {
            continue;
        }
        for(var i = 0; i < 8; ++i) {
            xx = tmpx + dir[i][0];
            yy = tmpy + dir[i][1];
            if(judge_in(xx, yy) && (pack_open[xx * col + yy] == 0 || pack_open[xx * col + yy] == 2)) {
                quex.push(xx);
                quey.push(yy);
            }
        }
    }
}

function open_pack_safely(x, y) {
    var the_id = x * col + y;
    if(pack_data[the_id] == -1) {
        open_one_pack(x, y, false);
        for(var i = 0; i < col * row; ++i) {
            if(pack_data[i] == -1 && pack_open[i] != 3) {
                open_one_pack(Math.floor(i / col), i % col, true);
            }
        }
    } else {
        bfs_open_pack(x, y);
    }
}

function give_prompt(the_id) {
    var x = Math.floor(the_id / col);
    var y = the_id % col;
    var xx, yy;
    var ccnt = 0;
    var the_data;
    if(pack_open[the_id] != 3) {
        the_data = -1;
    } else {
        the_data = pack_data[the_id];
    }
    for(var i = 0; i < 8; ++i) {
        xx = x + dir[i][0];
        yy = y + dir[i][1];
        if(judge_in(xx, yy) && pack_open[xx * col + yy] == 1) {
            ++ccnt;
        }
    }
    if(ccnt == the_data) {
        // 已经完成标记，翻开所有问号与空格
        for(var i = 0; i < 8; ++i) {
            xx = x + dir[i][0];
            yy = y + dir[i][1];
            if(judge_in(xx, yy) && (pack_open[xx * col + yy] == 0 || pack_open[xx * col + yy] == 2)) {
                open_pack_safely(xx, yy);
            }
        }
    } else {
        // 没有完成标记，只给提示
        for(var i = 0; i < 8; ++i) {
            xx = x + dir[i][0];
            yy = y + dir[i][1];
            if(judge_in(xx, yy) && pack_open[xx * col + yy] == 0) {
                $("#" + (xx * col + yy).toString()).attr("class", "pack prompt");
            }
        }
    }
}

function end_the_game() {
    back_to_menu();
    if(playing == 2) {
        // 成功结束
        if(clock_time < parseInt(board[level * 3 + 1])) {
            // 破纪录
            $("#hero_message").html("已破" + board[level * 3] + "记录，请留下您的大名：");
            $("#new_game").hide();
            $("#new_game").css({opacity: "0.0"});
            $("#submit_record").show();
            $("#submit_record").css({opacity: "1.0"});
        } else {
            // 未破纪录
            $("#success_message").html("恭喜您！以 " + (clock_time).toString() + " 秒的成绩完成游戏");
            $("#new_game").hide();
            $("#new_game").css({opacity: "0.0"});
            $("#success").show();
            $("#success").css({opacity: "1.0"});
        }
    }
}

function start_clock() {
    if(playing == 1) {
        if(clock_time == 999) {
            clearTimeout(time_out);
            return ;
        }
        time_out = setTimeout("start_clock();", 1000);
        clock_time += 1;
        str = clock_time.toString();
        $("#clock_num").html(str);
        if(str.length == 1) {
            $("#clock_num").css({"left": "57px", "top": "4px"});
        } else if(str.length == 2) {
            $("#clock_num").css({"left": "52px", "top": "4px"});
        } else if(str.length == 3) {
            $("#clock_num").css({"left": "49px", "top": "4px"});
        }
    } else if(playing == 2 || playing == 3) {
        clearTimeout(time_out);
    }
}

function set_click_pack() {
    playing = 0;
    click_flag = 0;
    for(var i = 0; i < row * col; ++i) {
        pack_data[i] = 0;
        pack_open[i] = 0;
    }
    $(".pack").bind("contextmenu", function(){ return false; });
    $(".pack").mousedown(function(e) {
        click_flag += e.which;
        // 提示事件
        if(click_flag == 4) {
            click_flag = 0;
            if(playing == 1) {
                give_prompt($(this).attr("id"));
            }
        }
    });
    $(".pack").mouseup(function(e) {
        var the_id = $(this).attr("id");
        var x = Math.floor(the_id / col);
        var y = the_id % col;
        var xx, yy;
        click_flag -= e.which;
        if(click_flag < 0) {
            // 提示消失，恢复原样
            click_flag = 0;
            for(var i = 0; i < 8; ++i) {
                xx = x + dir[i][0];
                yy = y + dir[i][1];
                if(judge_in(xx, yy) && pack_open[xx * col + yy] == 0) {
                    $("#" + (xx * col + yy).toString()).attr("class", "pack button");
                }
            }
        } else if(e.which == 1) {
            // 按下了左键
            if(playing == 0) {
                // 布置雷区，点开当前pack
                playing = 1;
                start_clock();
                set_mines(x, y);
                open_pack_safely(x, y);
            } else if(playing == 1) {
                // 点击当前pack
                open_pack_safely(x, y);
            } else if(playing == 2 || playing == 3) {
                end_the_game();
                return ;
            }
        } else if(e.which == 3) {
            if(pack_open[the_id] != 3) {
                // 根据情况判断，是插旗还是取消插旗
                if(pack_open[the_id] == 0) {
                    if(mine_cnt != 0) {
                        pack_open[the_id] = 1;
                        $(this).attr("class", "pack flag");
                        --mine_cnt;
                    }
                } else if(pack_open[the_id] == 1) {
                    pack_open[the_id] = 2;
                    $(this).attr("class", "pack doubt");
                    ++mine_cnt;
                } else if(pack_open[the_id] == 2) {
                    pack_open[the_id] = 0;
                    $(this).attr("class", "pack button");
                }
                // 输出剩余旗子数
                str = mine_cnt.toString();
                if(str.length == 1) {
                    $("#mine_cnt_num").css({"left": "21px", "top": "4px"});
                } else {
                    $("#mine_cnt_num").css({"left": "18px", "top": "4px"});
                }
                $("#mine_cnt_num").html(str);
            }
        }
    });
}

function show_minefield() {
    str = "";
    for(var i = 0; i < row; ++i) {
        for(var j = 0; j < col; ++j) {
            str += '<label name="pack" class="pack button"> &nbsp;&nbsp;&nbsp;&nbsp;<br />&nbsp; </label>';
        }
    }
    $("#minefield").html(str);
    var begin_left = 683 - (col * button_width / 2);
    var begin_top = 270 - (row * button_height / 2);
    var pac = document.getElementsByName("pack");
    for(var i = 0; i < row; ++i) {
        for(var j = 0; j < col; ++j) {
            pac[i * col + j].id = (i * col + j).toString();
            pac[i * col + j].style.left = (j * button_width + begin_left).toString() + "px";
            pac[i * col + j].style.top = (i * button_height + begin_top).toString() + "px";
        }
    }
    
    $("#clock").html('<img id="clock_icon" src="image/clock.png" alt="clock" class="absolute" />\
                    <img id="clock_label" src="image/label.png" alt="label" class="absolute" />\
                    <label class="absolute word" id="clock_num"> ' + clock_time + ' </label>');
    $("#clock").css({"left": (begin_left).toString() + "px", "top": (begin_top + row * button_height + 20).toString() + "px"});
    $("#clock_label").css({"left": "35px"});
    $("#clock_num").css({"left": "57px", "top": "4px"});

    $("#mine_cnt").html('<img id="mine_cnt_label" src="image/label.png" alt="label" class="absolute" />\
                        <img id="mine_cnt_icon" src="image/mine.png" alt="mine" class="absolute" />\
                        <label class="absolute word" id="mine_cnt_num"> ' + mine_cnt +' </label>');
    $("#mine_cnt").css({"left": (begin_left + col * button_width - 85).toString() + "px" , "top": (begin_top + row * button_height + 20).toString() + "px"})
    $("#mine_cnt_icon").css({"left": "57px"});
    $("#mine_cnt_num").css({"left": "18px", "top": "4px"});

    $("#back").html('<img id="back_label" src="image/back.png" alt="back" class="absolute" />');
    $("#back").css({"left": (658).toString() + "px", "top": (begin_top + row * button_height + 20).toString() + "px"});
    $("#back").click(back_to_menu);

    set_click_pack();
}

$(document).ready(function() {
    if(localStorage.board) {
        board = localStorage.board.split(",");
    } else {
        board[0] = "初级";
        board[1] = "999";
        board[2] = "匿名";

        board[3] = "中级";
        board[4] = "999";
        board[5] = "匿名";
        
        board[6] = "高级";
        board[7] = "999";
        board[8] = "匿名";
    }

    $("#game_interface").hide();
    $("#statistics_data").hide();
    $("#option_data").hide();
    $("#submit_record").hide();
    $("#success").hide();
    $("#new_game").click(function() {
        var radios = document.getElementsByName("difficulty");
        for(var i = 0; i < radios.length; ++i) {
            if(radios[i].checked) {
                row = row_list[i];
                col = col_list[i];
                mine_cnt = mine_cnt_list[i];
                pack_remain = row * col - mine_cnt;
                clock_time = 0;
                level = i;
                break;
            }
        }
        show_minefield();
        $("#game_interface").show();
        $("#game_interface").animate({opacity: "1.0"}, delay_time * 2);
        $("#start").animate({top: "-650px"}, delay_time * 2);
    });

    $("#statistics").click(function() {
        set_board_html();
        $("#new_game").animate({opacity: "0.0"}, delay_time);
        $("#option_data").animate({opacity: "0.0"}, delay_time);
        $("#submit_record").animate({opacity: "0.0"}, delay_time);
        $("#success").animate({opacity: "0.0"}, delay_time);
        setTimeout('$("#new_game").hide(); $("#option_data").hide(); $("#submit_record").hide(); $("#success").hide();', delay_time);
        $("#statistics_data").show();
        $("#statistics_data").animate({opacity: "1.0"})
    });

    $("#statistics_data").click(function() {
        $("#statistics_data").animate({opacity: "0.0"}, delay_time);
        setTimeout('$("#statistics_data").hide();', delay_time);
        $("#new_game").show();
        $("#new_game").animate({opacity: "1.0"}, delay_time);
    });

    $("#option").click(function() {
        $("#new_game").animate({opacity: "0.0"}, delay_time);
        $("#statistics_data").animate({opacity: "0.0"}, delay_time);
        $("#submit_record").animate({opacity: "0.0"}, delay_time);
        $("#success").animate({opacity: "0.0"}, delay_time);
        setTimeout('$("#new_game").hide(); $("#statistics_data").hide(); $("#submit_record").hide(); $("#success").hide();', delay_time);
        $("#option_data").show();
        $("#option_data").animate({opacity: "1.0"}, delay_time);
    });
    
    $("#option_data").click(function() {
        $("#option_data").animate({opacity: "0.0"}, delay_time);
        setTimeout('$("#option_data").hide();', delay_time);
        $("#new_game").show();
        $("#new_game").animate({opacity: "1.0"}, delay_time);
    });


    $("#submit").click(function() {
        board[level * 3 + 2] = $("#hero_name").val();
        if(board[level * 3 + 2] == "") {
            board[level * 3 + 2] = "匿名";
        }
        board[level * 3 + 1] = clock_time.toString();
        localStorage.board = board;
        $("#submit_record").animate({opacity: "0.0"}, delay_time);
        setTimeout('$("#submit_record").hide();', delay_time);
        set_board_html();
        $("#statistics_data").show();
        $("#statistics_data").animate({opacity: "1.0"}, delay_time);
    });

    $("#hero_name").keydown(function(e) {
        if(e.which == 13) {
            $("#submit").trigger("click");
        }
    });

    $("#confirm").click(function() {
        $("#success").animate({opacity: "0.0"}, delay_time);
        setTimeout('$("#success").hide();', delay_time);
        $("#new_game").show();
        $("#new_game").animate({opacity: "1.0"}, delay_time);
    });
});
