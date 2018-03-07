define([
    'vue',
    'text!models/Home/App/Tpl/BookShelf.html',
    "models/Home/App/Header",
    "models/Home/App/Footer",
    "models/Home/App/ActionBar",
     "eui/Toast",
     "models/Book/ReadHistoryStore",
     "commons/PageLoader",
], function (Vue, Tpl, Header, Footer, ActionBar, Toast, store, loader) {

    // 数据缓存
    var cache = {
        isLoaded: false,

        TabStatus: 1,  // 显示页 1 => 最近阅读 | 2 => 云书架
        pageMsg: {
            page: 0,
            size: 30
        },
        bookReadHistory: store.get('bookReadHistory'),
        ListShelfBooks: [],

        hasHistory: true,
        hasBooks: true,
        isLogin: true,
        finish: false,
        isLeave: false
    };

    return Vue.extend({
        template: Tpl,
        data: function () {
            return cache; 
        },
        components: { 
            "app-header": Header,
            "app-footer": Footer,
            "action-bar": ActionBar
        },
        ready: function () {
            var self = this;
            
            //获取历史记录数据
            if (self.bookReadHistory == null || self.bookReadHistory == undefined) {
                self.hasHistory = false;
            }

            // 已第一次加载的书籍条目数作为分页大小
            
            $(window).scroll(function (event) {
                if (self.isLeave) return;
                if ($(document).scrollTop() <= 0) {
                    // 到顶
                } else if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    // 到底
                    if (self.TabStatus == 1) {
                        return;
                    }

                    self.getList();
                }
            });
        },
        destroyed: function() {
            this.isLeave = true;
        },
        methods: {
            Tab: function (index) {
                var self = this;
                self.TabStatus = index;

                if (index == 2 && !self.isLoaded) {
                    self.getList(); 
                }
            },
            getList: function () {
                var self = this;
                if (self.finish) {
                    return;
                }
                loader.bottom.show();
                self.pageMsg.page ++;
                $.get('/webapi/shelf/ListShelfBooks', {
                    page: self.pageMsg.page,
                    size: self.pageMsg.size
                }, function (result) {
                    loader.bottom.hide();

                    self.isLoaded = true;

                    if (result.status == 1) {
                        self.ListShelfBooks = self.ListShelfBooks.concat(result.data.data);
                        
                        if (result.data.data.length < self.pageMsg.size) {
                            self.finish = true;
                        }

                        //判断书架是否有书 没有则提示：“请在书城中选择您喜欢的书籍加入书架吧”
                        if (self.ListShelfBooks.length <= 0) {
                            self.hasBooks = false;
                        }
                        return;
                    }

                    //未登录 跳转去登录
                    if (result.code === "1001") {
                        self.isLogin = false;
                        return;
                    }

                    Toast.showError(result.message);
                });
            },
            getUrl: function (el) {
                var url = "";
                if (el.lastReadChapter) {
                    url = '/webapp/book/read.html?bookid=' + el.book.bookId + '&chapterId=' + el.lastReadChapter.chapterId;
                }
                else {
                    url = '/webapp/book/read.html?bookid=' + el.book.bookId;
                }
                return url;

            }
        }
    });
});