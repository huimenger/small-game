define(['vue', 'eui/Toast', 'models/Book/ReadHistoryStore'], function (vue, Toast, store) {
    var vm = new vue({
        el : 'body',
        data: {
            // 显示页 1 => 最近阅读 | 2 => 云书架
            TabStatus: 1,
            pageMsg : {
                page : 1,
                size: 9,
                status : false
            },
            LoadStatus: {
                // 0 => 允许加载 1 => 正在加载中 2 => 加载完毕
                code: 0,
                error : false,
                msg: ['下拉加载更多','正在加载中','加载完毕']
            },
            bookReadHistory: store.get('bookReadHistory'),
            ListShelfBooks: [],

            hasHistory: true,
            hasBooks: true
        },
        ready: function () {
            var self = this;
            self.isLoad();
            self.scrollEvent();
            if (self.bookReadHistory == null || self.bookReadHistory == undefined) {
                self.hasHistory = false;
            }
            
        },
        methods: {
            isLoad: function () {
                if (!this.pageMsg.status) {
                    this.getList();
                }
            },
            Tab: function (index) {
                this.TabStatus = index;
                this.isLoad();
            },
            scrollEvent: function () {
                var self = this;
                $(window).scroll(function () {
                    var top = $(window).scrollTop();
                    var height = $(this).height();
                    var outer = $('body').outerHeight();
                    if (top >= outer - height - 10) {
                        self.pageMsg.page++;
                        self.getList();
                    }
                });
            },
            getList: function () {
                var self = this;
                if (self.TabStatus == 1 || self.LoadStatus.code == 1 || self.LoadStatus.code == 2) return;
                self.LoadStatus.code = 1;   
                Toast.showProgress('加载中');
                $.get('/webapi/shelf/ListShelfBooks', {
                    page: this.pageMsg.page,
                    size: this.pageMsg.size
                }, function (data) {
                    Toast.hide();
                    if (data.isSuccess) {
                        if (data.data.data.length == 0 || data.data.data.length < self.pageMsg.size) {
                            self.LoadStatus.code = 2;
                        }
                        self.ListShelfBooks = self.ListShelfBooks.concat(data.data.data);
                    } else {
                        self.LoadStatus.error = (data.code == '1001');
                        !self.LoadStatus.error && Toast.showError(data.message);
                    }
                    // 已经加载过
                    if (!self.pageMsg.status) {
                        self.pageMsg.status = true;
                    }
                    if (self.LoadStatus.code == 1) {
                        self.LoadStatus.code = 0;
                    }
                    console.log(888888888888)
                    if (self.ListShelfBooks.length <= 0) {
                        self.hasBooks = false;
                    }
                });
            },
            getUrl: function (el) {
                console.log(el);
                var url = "";
                if (el.lastReadChapter) {
                    url = '/webapp/book/read.html?bookid=' + el.book.bookId + '&chapterId=' + el.lastReadChapter.chapterId;
                }
                else {
                    url = '/webapp/book/read.html?bookid=' + el.book.bookId;
                }
                console.log(url);
                return url;
                
            }
        }
    });
});