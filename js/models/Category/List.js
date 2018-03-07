define([
    'jquery',
    'vue',
    "commons/Query",
    "eui/Toast",
    "store",
    'models/Home/App/ActionBar',
    'models/Home/App/Footer'
], function ($, vue, query, toast, store, ActionBar, Footer) {

    vue.config.async = false;

    var vm = new vue({
        el: 'body',
        components: {
            "app-footer": Footer,
            "action-bar": ActionBar
        },
        data: {
            category: query.get('id') || false,
            load: false,
            books: [],
            page: {
                // 当前页
                page: (query.get('page') || 1),
                // 总页数
                pageCount: 1,
                pageSize: 10,
                total: 5
            },
            id: query.get("id"),
            finish: false,
            searchValue: '',
            SelectorStatus: false,
            TagStatus: false,

            options: {
                // 标签
                TagListArray: [],
                // 字数
                WordsListArray: [
                    { name: '30万字以下', min: 0, max: 299999 },
                    { name: '30万~50万', min: 300000, max: 499999 },
                    { name: '50万~100万', min: 500000, max: 999999 },
                    { name: '100万以上', min: 1000000, max: 0 }
                ],
                // 是否收费
                typeListArray: [
                    { name: '收费', code: '1' },
                    { name: '免费', code: '0' }
                ],
                // 进度
                progressArray: [
                    { name: '连载', code: '101' },
                    { name: '完结', code: '102' }
                ],
                // 排序
                orderList: [
                    { name: '人气', code: 1 },
                    { name: '最新', code: 2 },
                    { name: '评分', code: 3 },
                ]
            },
            // 上一次操作
            prevActive: {
                // 标签
                tagId: '',
                // 字数
                WordsMin: 0,
                WordsMax: 0,
                // 类型
                typeId: '',
                // 进度
                progressId: '',
                // 排序
                orderId: '1',
                name: {
                    tagId: '',
                    Words: '',
                    typeId: '',
                    progressId: '',
                    orderId: '人气'
                }
            },
            // 本次操作
            active: {
                // 标签
                tagId: '',
                // 字数
                WordsMin: 0,
                WordsMax: 0,
                // 类型
                typeId: '',
                // 进度
                progressId: '',
                // 排序
                orderId: '1',
                // 所有选中字段的名称
                name: {
                    tagId: '',
                    Words: '',
                    typeId: '',
                    progressId: '',
                    orderId: '人气'
                }
            },
        },
        ready: function () {
            this.SetActive();
            // 请求热门标签
            this.ajaxTag();
            // 获取ajax
            this.searchBooks();
        },
        methods: {
            SetActive: function () {
                if (store.get('HotSelectActive' + this.id)) {
                    this.active = store.get('HotSelectActive' + this.id);
                }
            },
            select: function () {
                var self = this;
                var arg = arguments;
                var move = false;

                $(self.$els.shadow).on('touchmove', function () {
                    move = true;
                });

                $(window).on('touchend', function (e) {
                    $(self.$els.shadow).off('touchmove');
                    $(window).off('touchend');
                    if (move) return;

                    var ar = arg[2];
                    if (ar) {
                        if (arg[0]) {
                            for (attr in arg[0]) {
                                var type = typeof self.active[attr];
                                self.active[attr] = type.toLowerCase() == 'number' ? 0 : '';
                            }
                        }
                        //选中的name
                        if (arg[1]) {
                            for (attr in arg[1]) {
                                self.active.name[attr] = '';
                            }
                        }
                    } else {
                        if (arg[0]) {
                            for (attr in arg[0]) {
                                self.active[attr] = arg[0][attr];
                            }
                        }
                        //选中的name
                        if (arg[1]) {
                            for (attr in arg[1]) {
                                self.active.name[attr] = arg[1][attr];
                            }
                        }
                    }
                    e.preventDefault();
                });
            },
            searchBooks: function () {
                var self = this;
                self.load = false;
                toast.showProgress('加载中');
                $.get('/WebApi/Book/Search', {
                    categoryId: this.category,
                    tagId: this.active.tagId,
                    startWordCount: this.active.WordsMin,
                    endWordCount: this.active.WordsMax,
                    writeStatus: this.active.progressId,
                    isFree: this.active.typeId,
                    order: this.active.orderId,
                    page: this.page.page,
                    pageSize: this.page.pageSize
                }, function (data) {
                    if (data.isSuccess) {
                        self.books = data.data.data;
                        self.page = {
                            page: data.data.page,
                            pageCount: data.data.pageCount,
                            pageSize: data.data.pageSize,
                            total: data.data.total
                        }

                        if (!self.books.length) {
                            $('#new-category-details').css('height', $(window).height());
                        }
                        // 加载完成后保存上一次选择的结果

                        self.load = true;
                    } else {
                        alert(data.message);
                    }
                    toast.hide();
                });
            },
            localPage: function (page) {
                this.page.page = page;
                this.searchBooks();
            },
            submit: function () {
                // 是否相等

                // 当点击确定时存储上一次操作
                this.prevActive = $.extend(true, {}, this.active);
                // 重置页码
                this.page.page = 1;
                // ajax请求
                this.searchBooks();

                // 存储当前选择
                store.set('HotSelectActive' + this.id, this.active);

                this.SelectorHide();
            },
            cancel: function () {
                // 点击取消时返回上一次操作
                this.active = $.extend(true, {}, this.prevActive);
                this.SelectorHide();
            },
            Len: function (data, len) {
                data = data.sort(function () {
                    return Math.random() - 0.5;
                });
                var arr = data.concat([]);
                return arr.splice(0, len || 6);
            },
            // 标签请求
            ajaxTag: function (callback) {
                var self = this;

                // 非当天
                if (store.get('HotTag' + self.id)) {
                    // 对比时间戳
                    var time = store.get('HotTag' + self.id).time;
                    var day = Math.floor((new Date().getTime() - time) / 86400000);
                    if (day != 0) {
                        store.clear('HotTag' + self.id);
                    }
                }

                if (store.get('HotTag' + self.id)) {
                    var data = store.get('HotTag' + self.id).data;
                    self.TagStatus = !!data.length;
                    self.options.TagListArray = data;
                    return;
                }

                $.get('/WebApi/Tag/FindByCategoryId', {
                    categoryId: this.category
                }, function (data) {
                    if (data.isSuccess) {
                        var new_data = self.Len(data.data);

                        self.TagStatus = !!new_data.length;
                        store.set('HotTag' + self.id, {
                            data: new_data,
                            time: new Date().getTime()
                        });

                        self.options.TagListArray = new_data;
                        callback && callback.call(self);
                    } else {
                        alert(data.errmsg);
                    }
                });
            },
            SelectorShow: function () {
                this.SelectorStatus = true;
            },
            SelectorHide: function () {
                this.SelectorStatus = false;
            }
        }
    });


});