
require.config({
    baseUrl: "/webapp/js/",
    paths: {
        jquery: 'libs/jquery-1.11.3.min',
        vue: 'libs/vue.min',
        InitData: "commons/InitData",
        text: "libs/text"
    },
    shim: {
        "jquery": {
            exports: "jQuery"
        },
        vue: {
            exports: "Vue"
        }
    }
});
require(["jquery", "vue", "commons/Query", "eui/Toast"], function($, vue, query, toast) {
    var showHide = function() {
        var hides = $("[data-hide]");
        hides.each(function() {
            $(this).css("visibility", "visible");
        });
    }
    var vm = new vue({
        el: 'body',
        data: {
            cardId: query.get("cardId"),
            folderId: query.get("folderId"),
            books: [],
            page: 1,
            pagesize: 10,
            folderCards: [],

            //数据是否加载完
            isMore: false,
            isLoading: false // 是否下一页加载数据 在这页还没请求完成时，禁止加载。防止数据重复
        },
        created: function() {
            showHide();
        },
        ready: function() {
            var self = this;
            self.load();
            //上拉加载
            $(window).scroll(function(event) {
                if ($(document).scrollTop() <= 0) {
                    // 到顶
                } else if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    // 到底
                    self.load();
                }
            });
        },
        methods: {
            load: function() {
                var self = this;
                if (self.isLoading) return;
                self.isLoading = true;
                if (!self.isMore) {
                    self.isLoadData = false;
                    // toast.showProgress("正在加载中");
                    $.get("/WebApi/Folder/GetCardInfoWithOptionalFolder", {
                        cardId: self.cardId,
                        folderId: self.folderId,
                        page: self.page,
                        pageSize: self.pagesize
                    }, function(json) {
                        toast.hide();
                        self.isLoading = false;
                        if (json.data.books.length <= 0) { //已加载完
                            self.isMore = true;
                        }
                        self.page++;
                        if (json.status === 1) {
                            self.folderCards = json.data.folder.folderCards;
                            self.books = self.books.concat(json.data.books);
                        }
                    }, "json");
                }
            },
            changeRange: function(cardId) {
                cardId = cardId ? cardId : "39d7a59ec835efe91bb254a81cfc68e0";
                location.href = "Special.html?cardId=" + cardId + "&folderId=" + vm.folderId;
            },
            isActive: function(num) {
                if (num === this.cardId) {
                    return true;
                }
                return false;
            },
            enterDetail: function(bookId) {
                window.hostsdk.showBookDetail(
                    bookId,
                    function(msg) {
                        alert(msg);
                    }
                );
                //var link = 'protocol://openbook?jsondata={"bookid":"' + bookId + '"}';
                //window.location.href = link;
            }
        }
    });
    return vm;
});
