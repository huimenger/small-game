define(['jquery', 'vue', 'commons/Query', "eui/Toast", "store"], function ($, vue, query, toast, store) {

    var vm = new vue({
        el: 'body',
        data: {
            oldSearchValue: '',
            searchValue: window.decodeURI(query.get('key') || ''),
            searchArray: [],
            searchCount: 1,
            searchPageSize: 10,
            loadingNull: false,
            loadingNullTxt: '',
            searchStatus: !query.get('key'),
            loadingStatus: true,

            HotBook: {
                AllTag: [],
                ActiveTag: [],
                // 是否请求过
                ajax: false,
                // 热门标签个数
                size: 6,
                // 当前选中热门标签第几页
                count: 1
            },
        },
        created: function () {
            if (query.get('key')) {
                this.searchStatus = false;
            } else {
                this.searchShow();
            }
            // 请求热门标签
            this.getHotBook();
            this.getSearch();
            this.scrollEvent();
        },
        methods: {
            scrollEvent: function () {
                var self = this;
                $(window).scroll(function (ev) {
                    var ev = ev || event;
                    var el = $(this);
                    var top = el.scrollTop();
                    var h = el.height();
                    var offset = $('#new-book-search').outerHeight();
                    // 到达底部
                    if (offset - h - 10 <= top) {
                        if (this.ajax) return;
                        this.ajax = true;
                        var This = this;
                        self.searchCount++;
                        self.getSearch(true, function () {
                            This.ajax = false;
                        });
                    }
                });
            },
            getHotBook: function () {
                var self = this;
                // 缓存内是否存在
                if (store.get('HotTagMessage')) {
                    self.HotBook.AllTag = store.get('HotTagMessage');
                    self.HotBook.ajax = true;
                    self.TabHotBook();
                } else {
                    $.get('/WebApi/HotKey/FindKeyList', {}, function (data) {
                        if (data.isSuccess) {
                            try {
                                store.set('HotTagMessage', data.data);
                            } catch (e) { }
                            self.HotBook.AllTag = data.data;
                            self.HotBook.ajax = true;
                            self.TabHotBook();
                        } else {
                            alert(data.message);
                        }
                    });
                }
            },
            ShowSearchTerm: function (data) {
                // 替换函数
                function re(str) {
                    if (str.indexOf(this.searchValue) != -1) {
                        str = str.split(this.searchValue).join('<span style="color:red;">' + this.searchValue + '</span>');
                    } else {
                        // 中文
                        for (var j = 0; j < this.searchValue.length; j++) {
                            var t = this.searchValue.charAt(j);
                            if (/[\u4e00-\u9fa5]/.test(t)) {
                                str = str.split(t).join('<span style="color:red;">' + t + '</span>');
                            }
                        }
                    }
                    return str;
                }
                for (var i = 0; i < data.length; i++) {
                    data[i].title = re.call(this, data[i].title);
                    data[i].description = re.call(this, data[i].description);
                    data[i].writer = re.call(this, data[i].writer);
                }
                return data;
            },
            TabHotBook: function () {
                this.HotBook.ActiveTag = [];
                var min = (this.HotBook.count - 1) * this.HotBook.size;
                for (var i = 0; i < this.HotBook.size; i++) {

                    var n = (i + min) % this.HotBook.AllTag.length;
                    this.HotBook.ActiveTag.push(this.HotBook.AllTag[n]);
                }
                this.HotBook.count++;
            },
            loadingShow: function () {
                this.loadingStatus = true;
            },
            loadingHide: function () {
                this.loadingStatus = false;
            },
            searchShow: function () {
                this.searchStatus = true;
                vue.nextTick(function () {
                    document.getElementById('search').focus();
                });
            },
            searchHide: function (type) {
                if (type) {
                    this.searchStatus = !type;
                } else {
                    var target = event.target || event.srcElement;
                    if (target.className == 'search_shadow') {
                        this.searchStatus = false;
                        this.searchValue = this.oldSearchValue;
                    }
                }
            },
            validate: function (type) {
                type = type ? type : '';
                if (this.searchValue == '') {
                    return type + '不能为空';
                }
                if (this.searchValue.length == 1 && !/^[\w\u4E00-\u9FA5\uF900-\uFA2D]*$/.test(this.searchValue)) {
                    return type + '输入有误';
                }
                return false;
            },
            getSearch: function (next, callBack) {
                // 语法检查
                if (this.validate()) { return; }
                if (this.loadingNull) return;

                toast.showProgress('加载中');

                var self = this;
                self.loadingShow();
                $.get('/WebApp/Book/GetBookSearch.html', {
                    keyword: this.searchValue,
                    page: this.searchCount,
                    size: this.searchPageSize
                }, function (data) {
                    // 请求成功
                    window.history.replaceState(null, false, 'search.html?key=' + self.searchValue);

                    self.oldSearchValue = self.searchValue;

                    if (data.data.length) {
                        var new_data = self.searchArray.concat(self.ShowSearchTerm(data.data));
                        self.searchArray = new_data;// 请求完成将原始值赋值给上一次
                        // 不为空
                        self.loadingNull = false;
                    } else {
                        if (self.searchArray.length) {
                            self.loadingNullTxt = '当前已经是最后一页了';
                        } else {
                            self.loadingNullTxt = '没有搜索到结果';
                        }
                        self.loadingNull = true;
                    }

                    toast.hide();
                    self.loadingHide();

                    self.searchStatus = false;

                    callBack && callBack(data);
                });
            },
            searchHotTag: function (tag) {
                if (tag != this.searchValue) {
                    this.loadingNull = false;
                    this.searchValue = tag;
                    this.searchCount = 1;
                    this.searchArray = [];
                    this.getSearch();
                }
                this.searchStatus = false;
            },
            search: function () {
                // 搜索
                var msg = this.validate('搜索内容');
                if (msg) {
                    alert(msg);
                } else {
                    if (this.oldSearchValue != this.searchValue) {
                        this.loadingNull = false;
                        this.searchCount = 1;
                        this.searchArray = [];
                        this.getSearch();
                    }
                    this.searchStatus = false;
                }
            },
        },
        events: {
            "search-change": function (val) {
                this.value = val;
            }
        }
    });


});