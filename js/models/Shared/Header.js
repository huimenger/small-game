define(["jquery", "models/Book/ReadHistoryStore", "store"], function ($, readstore, store) {

    // 检测是否具有data-user-logined属性，如果有，绑定事件
    $("[data-user-logined]").on("click", function () {
        // 打开右侧菜单
        $(".right-menu").attr("class", "right-menu showAni");
        $(".mask").removeClass("hide");
    });
    // 绑定遮罩层事件，关闭右侧菜单
    $(".mask").on("click", function () {
        $(".right-menu").attr("class", "right-menu hideAni");
        setTimeout(function () {
            $(".mask").addClass("hide");
        }, 300);
    });

    $.get("/WebApi/User/FindUserCoint", {}, function (json) {
        if (json.status === 1) {
            $(".right-menu .coin").html(json.data);
        }
    }, "json");

    var books = readstore.getBookReadHistory();
    if (books && books[0]) {
        var book = books[0];
        $(".read_history .book").text("接着读：《" + book.bname + "》");
        $(".read_history .book").attr("href", "/webapp/book/read.html?bookid=" + book.bid + "&chapterid=" + book.cid);
    }

    var clickCount = 0;

    $(".header .logo").click(function () {
        clickCount++;
        if (clickCount > 9) {
            location.href = "/webapp/page/debug.html";
        }
    });
});