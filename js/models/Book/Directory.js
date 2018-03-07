define(["jquery", "vue", "store", "commons/Query"], function ($, vue, store, query) {
    var vm = new vue({
        el: 'body',
        data: {
            autobuy: !!store.get("AutoBuyChapter" + query.get("bookId")),
            isShowAsc: true
        },
        ready: function () {
            // 阻止ios下默认滚动
            $(window).on('touchmove', function (ev) {
                var ev = ev || event;
                var target = ev.target || ev.srcElement;
                if ($(target).parents('.content').length < 1) {
                    ev.preventDefault();
                }
            });
        },
        methods: {
            asce: function () {
                this.isShowAsc = true;
            },
            desc: function () {
                this.isShowAsc = false;
            },
            read: function (bookid, chapterid, c) {
                if (c) return;
                window.location.href = '/webapp/book/read.html?bookid=' + bookid + '&chapterid=' + chapterid;
            },
            autoBuyToggle: function () {
                this.autobuy = !this.autobuy;
                store.set("AutoBuyChapter" + query.get("bookId"), this.autobuy);
            }
        }
    });
    return vm;
});