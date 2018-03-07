define([
    "jquery",
    "vue",
    "eui/Toast",
    "commons/Query",
    "commons/InitData",
    "commons/PageLoader",
    'models/Home/App/Header',
    'models/Home/App/ActionBar',
    'models/Home/App/Footer',
    "commons/Browser"
], function ($, vue, toast, query, initData, loader, Header, ActionBar, Footer, browser) {
    var vm = new vue({
        el: "body",
        components: {
            "app-footer": Footer,
            "action-bar": ActionBar
        },
        data: {
            books: JSON.parse(initData),
            page: parseInt(query.get("page") ? query.get("page") : "1"),
            type: query.get("type"),
            categoryId: query.get("categoryId"),
            pageSize: 10,
            range: 1,
            finish: false
        },
        created: function () {
            var self = this;
            // 已第一次加载的书籍条目数作为分页大小
            this.pageSize = this.books.length;
            $(window).scroll(function (event) {
                if ($(document).scrollTop() <= 0) {
                    // 到顶
                } else if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    // 到底
                    self.load();
                }
            });
        },
        methods: {
            load: function () {
                var self = this;
                if (!self.finish) {
                    if (self.page > 0) {
                        loader.bottom.show();
                    }
                    self.page++;
                    $.get("MoreSub.html", {
                        page: self.page,
                        pageSize: self.pageSize,
                        type: self.type,
                        categoryId: self.categoryId,
                        range: self.range
                    }, function (json) {
                        loader.bottom.hide();
                        toast.hide();
                        if (json.data.length < self.pageSize) {
                            self.finish = true;
                        }
                        self.books = self.books.concat(json.data);
                    }, "json");
                } else {

                }
            },
            // 切换榜单范围（周月总）
            changeRange: function (range) {
                this.books = [];
                this.range = range;
                this.page = 0;
                toast.showProgress("加载中...");
                this.load();
                history.replaceState(null, document.title, "/webapp/rank/sub.html?categoryId=" + this.categoryId + "&type=" + this.type + "&range=" + this.range);
            }
        }
    });
    return vm;
});