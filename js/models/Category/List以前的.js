define(["jquery", "vue", "commons/Query", "commons/InitData", "commons/PageLoader"], function ($, vue, query, initData, loader) {
    var vm = new vue({
        el: "body",
        data: {
            books: JSON.parse(initData),
            page: parseInt(query.get("page") ? query.get("page") : "1"),
            id: query.get("id"),
            pageSize: 10,
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
                    loader.bottom.show();
                    self.page++;
                    $.get("ListMore.html", {
                        page: self.page,
                        pageSize: self.pageSize,
                        id: self.id
                    }, function (json) {
                        loader.bottom.hide();
                        if (json.data.length < self.pageSize) {
                            self.finish = true;
                        }
                        self.books = self.books.concat(json.data);
                    }, "json");
                } else {

                }
            }
        }
    });
    return vm;
});