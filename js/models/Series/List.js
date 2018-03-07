define(["jquery", "vue", "commons/Query", "commons/InitData", "commons/PageLoader"], function ($, vue, query, initData, loader) {
    var vm = new vue({
        el: "body",
        data: {
            series: JSON.parse(initData),
            page: parseInt(query.get("page") ? query.get("page") : "1"),
            tagId: query.get("tagId"),
            pageSize: 10,
            finish: false
        },
        created: function () {
            console.log(this.series);
            var self = this;
            // 已第一次加载的书籍条目数作为分页大小
            this.pageSize = this.series.length;
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
                    $.get("MoreList.html", {
                        page: self.page,
                        pageSize: self.pageSize,
                        tagId: self.tagId
                    }, function (json) {
                        loader.bottom.hide();
                        if (json.data.length < self.pageSize) {
                            self.finish = true;
                        }
                        self.series = self.series.concat(json.data);
                    }, "json");
                }
            }
        }
    });
    return vm;
});