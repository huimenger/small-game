import touchEvent from "../plugins/touch";
import Timer from "../commons/timer";
import Vue from "../libs/vue.min";
import ResLoading from "../commons/loading";

//是否开启纯净模式(不提交数据，以及其他的交互)
const isPure = false;

//创建vue数据模型
let vm = new Vue( {
    el: "#main-controller",
    data: function () {
        return {
            list: [ {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: 50,
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: 50,
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            }, {
                wxNick: "暖炉先生",
                festivalType: 2048,
                costSecond: "00 : 00 : 00",
                rank: 1,
            } ],
            currentScore: "除夕",
            topScore: "暂无",
            isShare: false,
            timeout: "00 : 00 : 00",
            user: null,
            name: null,
            allScore: [],
        }
    },
    methods: {
        showAndHideShare: function () {
            this.isShare = !this.isShare;
        },
        //创建活动说明和排行榜事件
        showDesc: function ( num, isReplay ) {
            game.$( ".game-over" ).className = "game-over over-scene-" + num;
            game.$( "body" ).className = "hiddenBody";
            if ( isReplay ) {
                game.replay();
            }
        },
        //创建关闭事件
        closeDesc: function () {
            dom.closeGameOver();
        },
        goLookBook: function () {
            window.location.href = 'https://m.ireadercity.com/'
        }
    }
} );
let game = {
    //设置节日级别关系
    level: {
        2: "除夕",
        4: "元宵",
        8: "五一",
        16: "端午",
        32: "七夕",
        64: "中秋",
        128: "国庆",
        256: "重阳",
        512: "圣诞",
        1024: "元旦",
        2048: "书香",
    },
    //设置一个二维数组存放每个格子的内容 [[行],[行],[行],[行]]
    grid: [
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ]
    ],
    //游戏状态 ready为准备阶段  play为游戏中 moving为动画执行中
    state: {
        GAME_OVER: -1,
        READY: 1,
        PLAYING: 2,
        MOVING: 3,
    },
    //设置当前所有不为空的格子
    currentGrid: [],
    time: [],
    //当前游戏状态
    cur_state: 0,
    //游戏开始初始化内容
    init(){
        let _m = this;

        //设置为准备阶段
        _m.cur_state = _m.state.READY;

        //创建并赋值随机数 初始化的时候创建2个数
        _m.getAndSetNumber();
        _m.getAndSetNumber();

        //新数创建完成后更新视图
        _m.updateViews();
    },
    //获取并设置一个随机格子的随机数
    getAndSetNumber(){
        let _m = this;
        //创建的时候判断当前格子是否已经满了
        if ( _m.isFull() ) return;
        //循环创建格子当不重复的时候退出循环，反则在来次
        while ( true ) {
            let row = _m.getRandom( 0, 3 );
            let col = _m.getRandom( 0, 3 );
            if ( _m.grid[ row ][ col ] == 0 ) {
                _m.grid[ row ][ col ] = _m.getRandom( 1, 100 ) > 70 ? 4 : 2;
                break;
            }
        }
    },
    //根据格子数据(grid)更新游戏视图
    updateViews(){
        let _m = this,
            _g = _m.grid;
        _m.currentGrid = [];
        for ( let row = 0; row < _g.length; row++ ) {
            for ( let col = 0; col < _g[ row ].length; col++ ) {
                let el = _m.$( "#tile-" + row + col );

                el.className = _g[ row ][ col ] != 0 ? " v" + _g[ row ][ col ] : "";
                _m.currentGrid.push( _g[ row ][ col ] );
            }
        }
        //更新视图时设置当前分数
        vm.currentScore = _m.level[ _m.getMaxScore( _m.currentGrid ) ];
        //创建格子完成后查询是否游戏结束
        if ( _m.isGameOver() ) {
            _m.gameOverScene();
        }

    },
    //设置更新时间
    updateTime( time, msTime ){
        vm.timeout = time;
        this.time = [ time, msTime ];
    },
    //重新开始游戏
    replay(){
        let _m = this;
        _m.grid = [
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ],
            [ 0, 0, 0, 0 ]
        ];
        this.$( ".time" ).innerHTML = "00 : 00 : 00";
        //设置为准备阶段
        _m.cur_state = _m.state.READY;
        //创建并赋值随机数 初始化的时候创建2个数
        _m.getAndSetNumber();
        _m.getAndSetNumber();
        //新数创建完成后更新视图
        _m.updateViews();
    },
    //滑动开始游戏
    moving( direction ){
        let _m = this;
        //如果在执行动画中 或者 已经结束不能滑动
        if ( _m.cur_state == 3 || _m.cur_state < 0 ) return;
        //设置为游戏中
        if ( _m.cur_state == 1 ) {
            _m.cur_state = _m.state.PLAYING;
            _m.timer = new Timer( {
                getTime: 100,
                format: "mm : ss : ms",
                msLength: 10,
                isMinute: true,
                callback: _m.updateTime.bind( this )
            } );
        }
        //判断当前方向是否还可以滑动
        if ( _m.isMove( direction ) ) {
            for ( let row = 0; row < 4; row++ ) {
                _m.moveInRow( row, direction );
            }
            Task.start();
            _m.cur_state = _m.state.MOVING;
            setTimeout( function () {
                _m.cur_state = _m.state.PLAYING;
                _m.getAndSetNumber();
                _m.updateViews();

                //判断是否达到最大
                if ( _m.getMaxScore( _m.currentGrid ) == 2048 ) {
                    //游戏结束
                    _m.gameOverScene( true );
                    return;
                }
                //判断游戏是否结束
                if ( _m.isGameOver() ) {
                    //游戏结束
                    _m.gameOverScene();
                }

            }, Task.steps * Task.speed );
        }
    },
    //移动每一行/列
    moveInRow( row, direction ){
        let _m = this,
            _g = _m.grid,
            _d = direction,
            isRow = (_d == "LEFT" || _d == "RIGHT");
        //原理 每个方向的第一个 开始遍历寻找下一个有值的格子 当等则当前这一个变化否则不变  故每个方向最后一列/行不用遍历
        //左右移动
        if ( isRow ) {
            for ( let col = 0; col < 3; col++ ) {
                let newCol = _d == "LEFT" ? col : 3 - col;
                //获取下一个不为0的格子
                let nextCol = _m.getNextCol( row, newCol, _d );
                if ( nextCol < 0 ) break;
                //判断合并状态 当前为0则后一个替换前一个 否则判断合并
                //用来判断上下 左右的区别
                if ( _g[ row ][ newCol ] == 0 ) {
                    _g[ row ][ newCol ] = _g[ row ][ nextCol ];
                    _g[ row ][ nextCol ] = 0;
                    Task.addTask( '' + row + nextCol, '' + row + newCol );
                    col--;
                } else if ( _g[ row ][ newCol ] == _g[ row ][ nextCol ] ) {
                    _g[ row ][ newCol ] *= 2;
                    _g[ row ][ nextCol ] = 0;
                    Task.addTask( '' + row + nextCol, '' + row + newCol );
                }
            }
        } else {
            //上下移动
            for ( let col = 0; col < 3; col++ ) {
                let newCol = _d == "TOP" ? col : 3 - col;
                //获取下一个不为0的格子
                let nextCol = _m.getNextCol( row, newCol, _d );
                if ( nextCol < 0 ) break;
                //判断合并状态 当前为0则后一个替换前一个 否则判断合并
                //用来判断上下 左右的区别
                if ( _g[ newCol ][ row ] == 0 ) {
                    _g[ newCol ][ row ] = _g[ nextCol ][ row ];
                    _g[ nextCol ][ row ] = 0;
                    Task.addTask( '' + nextCol + row, '' + newCol + row );
                    col--;
                } else if ( _g[ newCol ][ row ] == _g[ nextCol ][ row ] ) {
                    _g[ newCol ][ row ] *= 2;
                    _g[ nextCol ][ row ] = 0;
                    Task.addTask( '' + nextCol + row, '' + newCol + row );
                }
            }
        }
    },
    //判断下一个不为0的格子
    getNextCol( row, col, direction ){
        let _m = this,
            _g = _m.grid,
            _d = direction,
            isRow = (_d == "LEFT" || _d == "RIGHT");

        if ( isRow ) {
            let iVal = _d == "LEFT" ? col + 1 : col - 1;
            for ( let i = iVal; i < 4; i++ ) {
                if ( _g[ row ][ i ] != 0 ) {
                    return i;
                }
                i = _d == "LEFT" ? i : i - 2;
            }
        } else {
            //  row = 0  0
            let iVal = _d == "TOP" ? col + 1 : col - 1;
            for ( let i = iVal; i < 4; i++ ) {
                if ( _g[ i ][ row ] != 0 ) {
                    return i;
                }
                if ( i > 0 ) {
                    i = _d == "TOP" ? i : i - 2;
                } else {
                    break;
                }
            }
        }
        return -1;
    },
    //判断当前滑动方向是否可以滑动
    isMove( direction ){
        let _m = this,
            _g = _m.grid,
            _d = direction,
            isRow = ( _d == "LEFT" || _d == "RIGHT");

        if ( isRow ) {
            //判断left right
            let colVal = _d == "LEFT" ? 1 : _d == "RIGHT" ? 2 : false;
            for ( let row = 0; row < _g.length; row++ ) {
                for ( let col = colVal; col < _g[ row ].length; col++ ) {
                    //判断从第二个格子开始是否为空  不会空则继续
                    //左右
                    if ( _g[ row ][ col ] != 0 ) {
                        //判断当前格子的上一个是否为空 或者等于上一个格子
                        let newCol = _d == "LEFT" ? col - 1 : col + 1;
                        if ( (_g[ row ][ newCol ] == 0) || _g[ row ][ col ] == _g[ row ][ newCol ] ) {
                            return true;
                        }
                    }
                    if ( col > 0 ) {
                        col = _d == "LEFT" ? col : _d == "RIGHT" ? col - 2 : false;
                    } else {
                        break;
                    }
                }
            }
        } else {
            let rowVal = _d == "TOP" ? 1 : _d == "BOTTOM" ? 2 : false;
            for ( let col = 0; col < _g.length; col++ ) {
                for ( let row = rowVal; row < _g[ col ].length; row++ ) {
                    //上下
                    if ( _g[ row ][ col ] != 0 ) {
                        let newRow = _d == "TOP" ? row - 1 : row + 1;

                        if ( (_g[ newRow ][ col ] == 0) || _g[ row ][ col ] == _g[ newRow ][ col ] ) {
                            return true;
                        }
                    }

                    if ( row > 0 ) {
                        row = _d == "TOP" ? row : row - 2;
                    } else {
                        break;
                    }
                }
            }
        }
        return false;
    },
    //判断游戏是否结束
    isGameOver(){
        let _m = this,
            _g = _m.grid;
        //如果还有格子则不用判断 直接继续游 戏
        if ( !_m.isFull() ) return;
        //判断上下左右相邻的格子是否能够叠加
        for ( let row = 0; row < _g.length; row++ ) {       // 2   3
            for ( let col = 0; col < _g[ row ].length; col++ ) {
                if ( col < 3 ) {
                    if ( _g[ row ][ col ] == _g[ row ][ col + 1 ] ) {
                        return false;
                    }
                }
                if ( row < 3 ) {
                    if ( _g[ row ][ col ] == _g[ row + 1 ][ col ] ) {
                        return false;
                    }
                }
            }

        }
        return true;
    },
    //游戏结束执行
    gameOverScene( isPassAll ){
        let _m = this;
        if ( _m.cur_state == -1 ) {
            return;
        }
        _m.cur_state = _m.state.GAME_OVER;
        let endTime = _m.timer.stop();
        let maxScore = _m.getMaxScore( _m.currentGrid );
        setTimeout( function () {
            //是否通关 显示对应的界面
            game.$( "body" ).className = "hiddenBody";
            if ( isPassAll ) {
                _m.$( ".current-time2" ).innerHTML = _m.time[ 0 ];
                _m.$( ".game-over" ).className = "game-over over-scene-2";
            } else {
                _m.$( ".current-time" ).innerHTML = _m.time[ 0 ];
                _m.$( ".current-result" ).innerHTML = _m.level[ maxScore ];
                _m.$( ".game-over" ).className = "game-over over-scene-1";
            }
        }, 100 );
    },
    //创建随机数
    getRandom( min, max ){
        return Math.floor( Math.random() * ((max - min + 1)) + min )
    },
    //判断当前格子是否饱满
    isFull(){
        //判断是否有不为0的格子
        let _g = this.grid;
        for ( let row = 0; row < _g.length; row++ ) {
            for ( let col = 0; col < _g[ row ].length; col++ ) {
                if ( _g[ row ][ col ] == 0 ) {
                    return false
                }
            }
        }
        return true;
    },
    //获取当前分数最值
    getMaxScore( arr ){
        arr.sort( ( a, b ) => {
            if ( a < b ) {
                return 1
            } else {
                return -1
            }
        } );
        return arr[ 0 ];
    },
    //获取元素
    $( str ){
        return document.querySelectorAll( str )[ 0 ];
    }
};
let dom = {
    index: 0,
    init(){
        //加载
        let loader = dom.loader();
        loader.start();
        //兼容小屏幕

        game.init();

        //绑定重新开始游戏
        game.$( ".replay-game" ).onclick = () => {
            game.replay();
            dom.closeGameOver();
        };
    },
    closeGameOver() {
        game.$( ".game-over" ).className = "game-over";
        game.$( "body" ).className = "  ";
    },
    //屏幕适配
    _resize() {
        let width = window.innerWidth;
        let bl = width / 414;
        document.getElementsByTagName( 'html' )[ 0 ].style.fontSize = 16 * bl + "px";
        let scaleDom = document.querySelectorAll( ".scale" );
        for ( let i = scaleDom.length - 1; i >= 0; i-- ) {
            document.querySelectorAll( ".scale" )[ i ].style.webkitTransform = "scale(" + bl + ")";
        }
    },
    loader(){
        //加载动画
        return new ResLoading( {
            res: [
                "content.png?test3",
                "tile.png?test3",
                "shareImg.png?test1",
                "background.jpg?test1",
                "buttons.png?test1",
                "leaderBoard.png?test2",
                "leaderBoard_bg.png?test2",
                "tc_pt.png?test1",
                "leaderBoard_bg.png?test1",
                "tc_tg.png?text2",
            ],
            defaultLoading: ".complete_val",
            baseUrl: "http://d.ireadercity.com/webresource/page/spa/img/merryChristmas/",
            onComplete: function ( total ) {
                setTimeout( function () {
                    game.$( ".load_bg" ).style.display = "none";
                }, 200 )
            }
        } );
    },
    //获取参数
    getQueryString( key ){
        let reg = new RegExp( "(^|&)" + key + "=([^&]*)(&|$)" );
        let r = window.location.search.substr( 1 ).match( reg );
        if ( r != null )return unescape( r[ 2 ] );
        return null;
    },
};

//创建滑动事件
let touch = new touchEvent( document.querySelectorAll( ".map-cont" )[ 0 ] );
touch.left( function () {
    game.moving( "LEFT" );
} );
touch.top( function () {
    game.moving( "TOP" );
} );
touch.right( function () {
    game.moving( "RIGHT" );
} );
touch.bottom( function () {
    game.moving( "BOTTOM" );
} );

/*
 * 创建动画示例
 * 原理  分步实现移动动画 每次移动一步依次叠加
 *
 * */
let Task = {
    steps: 10,            //总共执行的次数
    speed: 10,            //每次移动的时间
    timer: null,          //用来存放定时器
    tasks: [],            //存放所有需要执行的任务（由于是每一行或者每一列为一次）
    //添加方法
    addTask( moveTarget, target ){
        let moveTar = game.$( "#tile-" + moveTarget );
        let tar = game.$( "#tile-" + target );
        let moveTarStyle = window.getComputedStyle( moveTar );
        let tarStyle = window.getComputedStyle( tar );
        //获取每次一次执行的距离
        let topStep = (parseInt( tarStyle.top ) - parseInt( moveTarStyle.top )) / this.steps;
        let leftStep = (parseInt( tarStyle.left ) - parseInt( moveTarStyle.left )) / this.steps;
        //创建一个任务
        let task = new Animation( moveTar, topStep, leftStep );
        this.tasks.push( task );
    },
    //开始动画
    start (){
        let _me = this;
        _me.timer = setInterval( function () {
            for ( let i = 0; i < _me.tasks.length; i++ ) {
                _me.tasks[ i ].move();
            }
            //没循环一次所有的动画次数--
            _me.steps--;
            if ( _me.steps == 0 ) {
                for ( let i = 0; i < _me.tasks.length; i++ ) {
                    //清楚样式
                    _me.tasks[ i ].clear();
                }
                //清除定时器
                clearInterval( _me.timer );
                //恢复默认值
                _me.steps = 10;
                _me.tasks = [];
                _me.timer = null;
            }
        }, this.speed )
    }
};

//创建一个递归来执行动画
function Animation( target, topStep, leftStep ) {
    this.target = target;
    this.topStep = topStep;
    this.leftStep = leftStep;
}
Animation.prototype.move = function () {
    let _me = this;
    let style = window.getComputedStyle( _me.target );
    let left = parseInt( style.left );
    let top = parseInt( style.top );
    this.target.style.left = left + this.leftStep + "px";
    this.target.style.top = top + this.topStep + "px";
};
//清楚样式让这个块回到原位
Animation.prototype.clear = function () {
    this.target.style.left = "";
    this.target.style.top = "";
};


window.onload = function () {
    dom._resize();
    dom.init();
};

window.onresize = function () {
    dom._resize();
};

