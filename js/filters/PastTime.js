define(["vue"], function (vue) {
    vue.filter("pasttime", function (value) {
        var timer = value.replace('-', '/');
        var date = new Date(timer).getTime();
        var current = new Date().getTime();
        var time = current - date;
        // 秒
        time = time / 1000;
        if (time < 60) {
            if (time < 10) {
                return '刚刚';
            }
            return Math.floor(time) + '秒前';
        }

        // 分钟
        time = time / 60;
        if (time < 60) {
            return Math.floor(time) + '分钟前';
        }

        // 小时
        time = time / 60;
        if (time < 24) {
            return Math.floor(time) + '小时前';
        }

        // 天
        time = time / 24;
        if (time < 30) {
            return Math.floor(time) + '天前';
        }

        // 月
        time = time / 12;
        if (time < 12) {
            return value.substring(5, 10);
        }

        return value.substring(0, 10);
    });
});