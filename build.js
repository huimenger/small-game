var colors = require("colors");
var readline = require('readline');
var child_process = require("child_process");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

begin();

rl.prompt();
rl.on('line', function(line) {
    rl.prompt();
    switch (line.trim()) {
        case 'hello':
            console.log('world!');
            break;
        case '1':
            execSpa();
            break;
        default:
            console.log('Say what? I might have heard `' + line.trim() + '`');
            break;
    }

}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});

function begin(){
    console.log(
        "===========================================================================\n".green +
        "欢迎使用" + "[书香云集]".green + "前端构建系统" + "1.0".red
    );
    showMenu();
}

function showMenu() {
    console.log(
        "\n输入以下" + "序号".yellow + "，运行相应功能：\n\n" +
        "\t1.单页应用开发\n".yellow
    );
}

function execSpa() {
    console.log("SPA单页应用开发已启动".green);
    var child = child_process.spawn("gulp.cmd", ["spa"], {
        env: process.env,
        stdio: "inherit"
    });
}
