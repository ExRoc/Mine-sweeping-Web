# Web 版扫雷

## 说明

### 1 引言

#### 1.1 目的

- 扫雷可以训练智力、反应能力，提高鼠标操作速度，也非常耐玩，是一款经久不衰的游戏。
- 扫雷的算法逻辑实现有一定难度，可以提高 JavaScript 逻辑实现能力。

#### 1.2 背景

- 扫雷是一款大众类的益智小游戏，于 1992 年发行。游戏目标是在最短的时间内根据点击格子出现的数字找出所有非雷格子，同时避免踩雷，踩到一个雷即全盘皆输。
- 本人从初中开始接触扫雷，对扫雷的兴趣十分浓厚，并且对扫雷的各项鼠标点击事件以及响应方式都十分了解。
- 上学期已经用 Java 实现了扫雷，对扫雷的代码实现比较熟悉。

#### 1.3 参考网址

| [CSDN 博客](http://blog.csdn.net/) | [W3Cschool](http://www.w3school.com.cn/) | [包图网](http://ibaotu.com/) | [在线流程图](https://www.processon.com/) | [软件设计文档](http://www.doc88.com/p-6919951883650.html) |

### 2 总体设计

#### 2.1 网页描述

本网页主要内容为扫雷小游戏，游戏开始界面主要采用来自 “包图网”的素材：

![](/img/包图网素材.jpg)

游戏界面主要采用 Win 7 版扫雷游戏界面：

<center>![rVf8J0.png](https://s3.ax1x.com/2020/12/12/rVf8J0.png)</center>

　　网页包含排行榜、难度选择、游戏帮助、主游戏这四项功能。
　　主游戏部分，除 win 7 扫雷上的基本功能，考虑到只有触板（没有鼠标）的笔记本玩家，另增加了 Ctrl + 鼠标左击功能，在不同情况下，可以代替右击、双击提示功能，使游戏更加流畅。

#### 2.2 网页结构

<center>![rVfGWV.png](https://s3.ax1x.com/2020/12/12/rVfGWV.png)</center>

### 3 程序描述
#### 3.1 初始菜单模块
##### 3.1.1 功能描述
> 1) 作为打开网页的初始界面，显示“统计”、“选项”以及“帮助”三个主要功能菜单。
> 2) 中心区域用于显示“新游戏”、排行榜、难度选择、游戏结束提示等内容。
> 3) 中心区域在显示排行榜、难度选择情况下，再点击一次，即可返回开始界面。

##### 3.1.2 界面设计

<center>![](https://s3.ax1x.com/2020/12/12/rVfcQO.png)</center>

##### 3.1.3 元素描述
| 类型 |        id        |     class     |     alt/type     |
| :--: | :--------------: | :-----------: | :--------------: |
| img  | start_background |   absolute    | start_background |
| img  |    statistics    | menu absolute |    statistics    |
| img  |      option      | menu absolute |      option      |
| img  |       help       | menu absolute |       help       |
| img  |     new_game     | menu absolute |     new game     |

##### 3.1.4 事件描述
|     id     | 事件  |              功能               |
| :--------: | :---: | :-----------------------------: |
| statistics | click |    隐藏其他label，显示排行榜    |
|   option   | click | 隐藏其他label，显示难度等级选择 |
|  new_game  | click | 主菜单界面上滑，显示主游戏界面  |

#### 3.2 排行榜模块
##### 3.2.1 功能描述
> 1) 点击“统计”菜单时，显示三个难度等级的最高分。
> 2) 三个等级的最高分都初始化为：“999 秒 匿名”。
> 3) 当玩家成功完成某一难度等级游戏时，若所消耗时间小于排行榜上对应等级的时间，则出现输入玩家姓名界面，待玩家输入姓名，点击“确认”或“回车”，更新排行榜。
> 4) 姓名栏为空时，输入框背景显示“英雄留名”。
> 5) 为保证排行榜美观，姓名栏最多允许输入 3 个字符。
> 6) 若玩家破纪录但输入姓名栏为空，则默认为“匿名”玩家，若之前已经输入过一次姓名，则默认填入上一次输入的玩家姓名。
> 7) 在查看排行榜状态下，点击排行榜数据，则返回到“新游戏”主菜单界面。
> 8) 重新打开网页时，排行榜仍然保留。

##### 3.2.2 界面设计

<center>![](https://s3.ax1x.com/2020/12/12/rVfWeH.png)</center>

<center>![](https://s3.ax1x.com/2020/12/12/rVf7Sf.png)</center>

##### 3.2.3 数据描述
|  数据类型  |       变量名       |       含义       | 取值范围 |
| :--------: | :----------------: | :--------------: | :------: |
|    整型    |       level        |     难度等级     | $[0,2]$  |
| 字符串数组 |       board        |      排行榜      |          |
| 字符串数组 | localStorage.board | 排行榜的本地储存 |          |

##### 3.2.4 元素描述
| 类型  |       id        |     class     |  alt/type  |
| :---: | :-------------: | :-----------: | :--------: |
|  img  |   statistics    | menu absolute | statistics |
| label | statistics_data | menu absolute |            |
| label |  hero_message   |   absolute    |            |
| input |    hero_name    |   absolute    |    text    |
|  img  |     submit      | nemu absolute |   submit   |
| label | success_message |   absolute    |            |
|  img  |     confirm     | menu absolute |  confirm   |

##### 3.2.5 事件描述
|       id        |  事件   |                          功能                          |
| :-------------: | :-----: | :----------------------------------------------------: |
|   statistics    |  click  |               隐藏其他label，显示排行榜                |
| statistics_data |  click  |               隐藏排行榜，显示主菜单界面               |
|    hero_name    | keydown |      输入回车时，相当于触发 submit 的 click 事件       |
|     submit      |  click  | 玩家输入名字后提交玩家纪录，若字段为空则玩家名为“匿名” |
|     confirm     |  click  |                 确认并退回到主菜单界面                 |

#### 3.3 难度选择模块
##### 3.3.1 模块结构

<center>![](https://s3.ax1x.com/2020/12/12/rVfOmQ.png)</center>

##### 3.3.2 功能描述
> 1) 点击“选项”菜单时，显示“初级”、“中级”、“高级”三个难度等级的单选按钮。
> 2) 最初选择难度等级为“初级”，且每次重新打开页面，难度等级都被重置为“初级”。
> 3) 若未选择即退出，则认为按原难度等级。
> 4) 选择难度等级后，界面退回到主菜单界面。
> 5) “初级”对应“9×9  10 个雷”，“中级”对应“16×16  40 个雷”，“高级”对应“16×30  99 个雷”。

##### 3.3.3 界面设计

<center>![](https://s3.ax1x.com/2020/12/12/rVhSf0.png)</center>

##### 3.3.4 数据描述
| 数据类型 |    变量名     |        含义        |    取值范围    |
| :------: | :-----------: | :----------------: | :------------: |
| 整型数组 |   row_list    | 不同难度对应的行数 | $\{9,16,16\}$  |
| 整型数组 |   col_list    | 不同难度对应的列数 | $\{9,16,30\}$  |
| 整型数组 | mine_cnt_list | 不同难度对应的雷数 | $\{10,40,99\}$ |
|   整型   |     level     |      不同等级      |    $[0,2]$     |

##### 3.3.5 元素描述
| 类型  |   id   |     class     |    name    | alt/type |
| :---: | :----: | :-----------: | :--------: | :------: |
|  img  | option | menu absolute |            |  option  |
| input |  easy  | menu absolute | difficulty |  radio   |
| input | normal | menu absolute | difficulty |  radio   |
| input |  hard  | menu absolute | difficulty |  radio   |

##### 3.3.6 事件描述
|   id   | 事件  |              功能               |
| :----: | :---: | :-----------------------------: |
| option | click | 隐藏其他label，显示难度等级选择 |
|  easy  | click |         选择“初级”难度          |
| normal | click |          选择“中级”难           |
|  hard  | click |         选择“高级”难度          |

#### 3.4 帮助模块
##### 3.4.1 功能描述
> 点击“帮助”菜单时，跳转到新页面[帮助](https://jingyan.baidu.com/article/7f766daf9231e84101e1d03d.html)。

##### 3.4.2 元素描述
| 类型 |  id  |     class     | alt/type |
| :--: | :--: | :-----------: | :------: |
| img  | help | menu absolute |   help   |

#### 3.5 新游戏模块
##### 3.5.1 游戏逻辑流程图

<center>![](https://s3.ax1x.com/2020/12/12/rVhP6U.png)</center>

##### 3.5.2 状态说明
> 在主游戏界面，雷区内不同的方格有不同的状态，如：翻开、插旗等，为方便后面说明，在此先对方格内所有状态进行说明，以下都采用该说明。
> 游戏中：

> - 未翻开：![](https://s3.ax1x.com/2020/12/12/rVhA0J.png)
- 提示：![](https://s3.ax1x.com/2020/12/12/rVhup6.png)
- 疑惑：![](https://s3.ax1x.com/2020/12/12/rVhM6O.png)
- 插旗：![](https://s3.ax1x.com/2020/12/12/rVhQXD.png)
- 空白/翻开：![](https://s3.ax1x.com/2020/12/12/rVh1ne.png)
- 数字 n/翻开：![](https://s3.ax1x.com/2020/12/15/rQlMHU.png)![](https://s3.ax1x.com/2020/12/15/rQlJ3R.png)![](https://s3.ax1x.com/2020/12/15/rQldHO.png)![](https://s3.ax1x.com/2020/12/15/rQl0ED.png)![](https://s3.ax1x.com/2020/12/15/rQ1ZIe.png)![](https://s3.ax1x.com/2020/12/15/rQ1uRA.png)![](https://s3.ax1x.com/2020/12/15/rQ18Z8.png)![](https://s3.ax1x.com/2020/12/15/rQ1JIg.png)

> 游戏失败结束：

> - 成功插旗：![](https://s3.ax1x.com/2020/12/15/rQ1wMq.png)
- 未插旗：![](https://s3.ax1x.com/2020/12/15/rQ10s0.png)
- 爆炸：![](https://s3.ax1x.com/2020/12/15/rQ1rZT.png)

##### 3.5.3 功能描述
> 1) 点击“新游戏”时，主菜单界面上滑，主游戏界面淡出。
> 2) 雷区大小以及地雷个数，由难度等级确定。
> 3) 刚进入游戏时，计时器显示为 0，计数器个数为地雷个数，雷区未确定，所有方格状态为未翻开。
> 4) 雷区中第一次左击鼠标时，开始设置雷区，设雷保证在第一次点击到的方格中没有地雷，计时器开始按秒计时，进入正常游戏流程，计时器到 999 停止。
> 5) 正常游戏流程：
> 　　a) 左击未翻开/疑问方格，若为雷，则游戏失败结束，停止计时，翻开当前方格为爆炸，以及其他成功插旗与未插旗方格，点击雷区退回到主菜单界面；若不为雷，则进行宽度优先搜索，停止进入宽搜队列条件为：方格状态为数字 n，判断翻开的方格数量是否等于(总方格数-总地雷数)，若等于，则游戏成功结束，点击雷区后，若成绩小于对应难度等级纪录，则退回到破纪录输入玩家姓名界面，否则退回到游戏成功提示界面。
> 　　b) 右击未翻开方格：当计数器非零时，当前方格变为插旗状态，计数器减一。
> 　　c) 右击插旗方格：当前方格变为疑惑状态，计数器加一。
> 　　d) 右击疑惑方格：当前方格变为未翻开状态。
> 　　e) 双击数字 n 方格：判断周围 8 个方格插旗状态方格数量是否等于 n，若等于，则对周围 8 个方格中未翻开/疑惑方格进行宽搜点击；若不等于，则对周围 8 个方格中未翻开方格进行提示。
> 　　f) Ctrl + 左击未翻开/插旗/疑惑：等效于右击该方格。
> 　　g) Ctrl + 左击数字 n 方格：等效于双击该方格。
> 　　h) 其他情况不做响应。
> 6) 无论何时，点击返回按钮可以立即结束游戏以及所有结算，返回主菜单界面。

##### 3.5.4 界面设计

<center>![](https://s3.ax1x.com/2020/12/15/rQ1hsx.png)</center>

<center>![](https://s3.ax1x.com/2020/12/15/rQ14L6.png)</center>

<center>![](https://s3.ax1x.com/2020/12/15/rQ1bJH.png)</center>

##### 3.5.5 数据描述
| 数据类型 |   变量名    |                  取值范围                   |            含义             |
| :------: | :---------: | :-----------------------------------------: | :-------------------------: |
|   整型   |  mine_cnt   |        $[0,mine\_cnt\_list_{level}]$        |       剩余的旗子数量        |
|   整型   |     row     |                $\{9,16,16\}$                |         雷区的行数          |
|   整型   |     col     |                $\{9,16,30\}$                |         雷区的列数          |
|   整型   | pack_remain | $[0,row\times col-mine\_cnt\_list_{level}]$ |        剩余非雷数量         |
|   整型   | clock_time  |                  $[0,999]$                  | 从第一次左击到当前游戏时间  |
| 计时句柄 |  time_out   |                                             |   用于控制开始/结束计时器   |
|   整型   |   playing   |                     $0$                     |         游戏未开始          |
|   整型   |   playing   |                     $1$                     |          游戏开始           |
|   整型   |   playing   |                     $2$                     |          成功结束           |
|   整型   |   playing   |                     $3$                     |          失败结束           |
|   整型   | click_flag  |                     $0$                     |         鼠标未点击          |
|   整型   | click_flag  |                     $1$                     |          鼠标左击           |
|   整型   | click_flag  |                     $3$                     |          鼠标右击           |
|   整型   | click_flag  |                     $4$                     |          鼠标双击           |
| 整型数组 |  pack_data  |                    $-1$                     |         当前格为雷          |
| 整型数组 |  pack_data  |                   $[0,8]$                   | 当前格附近8个方格中雷的数量 |
| 整形数组 |  pack_open  |                     $0$                     |     当前格状态为未翻开      |
| 整形数组 |  pack_open  |                     $1$                     |      当前格状态为插旗       |
| 整形数组 |  pack_open  |                     $2$                     |      当前个状态为疑惑       |
| 整形数组 |  pack_open  |                     $3$                     |      当前个状态为翻开       |

##### 3.5.6 元素描述
| 类型  |         id          |      class       | alt/type |
| :---: | :-----------------: | :--------------: | :------: |
| label | $[0,row\times col]$ |   pack button    |          |
| label | $[0,row\times col]$ |   pack prompt    |          |
| label | $[0,row\times col]$ |    pack doubt    |          |
| label | $[0,row\times col]$ |    pack flag     |          |
| label | $[0,row\times col]$ |    pack none     |          |
| label | $[0,row\times col]$ | pack [one-eight] |          |
| label | $[0,row\times col]$ |    pack boom     |          |
| label | $[0,row\times col]$ |  pack failflag   |          |
| label | $[0,row\times col]$ |   pack failed    |          |
|  img  |     clock_icon      |     absolute     |  clock   |
|  img  |     clock_label     |     absolute     |  label   |
| label |      clock_num      |  absolute word   |          |
|  img  |    mine_cnt_icon    |     absolute     |   mine   |
|  img  |   mine_cnt_label    |     absolute     |  label   |
| label |    mine_cnt_num     |     absolute     |          |
|  img  |     back_label      |     absolute     |   back   |

##### 3.5.7 事件描述
| status |     事件     |                             功能                             |
| :----: | :----------: | :----------------------------------------------------------: |
| 未翻开 |  left_click  |               若为雷，则游戏失败，否则点开宽搜               |
| 未翻开 | right_click  |                   状态变为插旗，计数器减一                   |
|  疑惑  |  left_click  |               若为雷，则游戏失败，否则点开宽搜               |
|  疑惑  | right_click  |                        状态变为未翻开                        |
|  插旗  | right_click  |                   状态变为疑惑，计数器加一                   |
| 数字 n | double_click | 判断周围插旗数量是否等于 n，若等于，则 left_click 周围未翻开/疑惑，否则周围未翻开状态变为提示 |