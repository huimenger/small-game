define(['vue', 'jquery', 'commons/query', 'eui/Toast'], function (vue, $, query, toast) {
    var vm = new vue({
        el: 'body',
        data: {
            bookId: query.get('bookid') || '',
            // 评论信息
            content: '',
            count: 0,
            // 评分
            grade: {
                on: 0,
                all: 5
            },
            // 分页
            page: {
                active: query.get('page') || 1,
                pageSize: 10
            },
            loading: {
                // 是否正在ajax请求
                status: false,
                // ajax是否生效
                ajax: true,
                text: '点击加载更多',
                scrollTop: 0
            },
            // 评论列表
            CommentItem: []
        },
        ready: function () {
            if (this.AreBookid()) return;
            // 获取数据
            this.GetComment();
        },
        methods: {
            // 提交评论
            SubComment: function () {
                var self = this;
                // redirect
                if (this.content == '') {
                    toast.showError('评论不能为空');
                    return false;
                }
                if (this.grade.on == 0) {
                    toast.showError('评分不能为空');
                    return false;
                }

                toast.showProgress('加载中');
                $.post('/webapi/comment/AddComment', {
                    BookId: this.bookId,
                    Intro: this.content,
                    Point: (this.grade.on * 2)
                }, function (data) { 
                    toast.hide();
                    if (data.isSuccess) {
                        // 成功
                        toast.showSuccess('评论成功');
                        // 添加一条最新评论的信息
                        self.CommentItem.unshift({
                            bookComments: self.content,
                            nickName: data.data.nickname,
                            bookCommentsDate: data.data.addTime,
                            //bookCommentsDate: self.getTime(data.data.addTime),
                            userIconURL: data.data.cover
                        });
                        self.count++;
                        self.content = "";
                    } else { 
                        toast.showWarn(data.message);
                        if (data.code == '1001') {
                            setTimeout(function () { 
                                window.location.href = '/webapp/Account/Login.html?redirect=/WebApp/Book/comment.html?bookid=' + self.bookId;
                                //window.location.href = '/webapp/Account/Login.html'; 
                            }, 2000);
                        }
                    }
                });
            },
            AreBookid: function () {
                if (this.bookId != '') return false;
                toast.showError('非法操作');
                return true;
            },
            gradeStart: function (index) {
                this.grade.on = index;
            },
            load: function (ev) {
                var ev = ev || event;
                this.page.active++;
                this.GetComment();
            },
            GetComment: function () {
                var self = this;
                if (self.loading.status || !self.loading.ajax) return;
                self.loading.status = true;
                toast.showProgress('加载中');

                // 滚动时记录scrollTop 在渲染完成后跳到对应的scroll
                self.loading.scrollTop = $(window).scrollTop();

                $.get('/WebApi/Comment/CommentList', {
                    bookid: self.bookId,
                    page: self.page.active,
                    pageSize: self.page.pageSize
                }, function (data) {
                    self.loading.status = false;
                    if (data.isSuccess) {
                        self.CommentItem = self.CommentItem.concat(data.data.data);
                        if (!data.data.data.length || self.CommentItem.length > self.page.pageSize && data.data.data.length < self.page.pageSize) {
                            self.loading.text = '已经是最后一页了';
                            self.loading.ajax = false;
                        } else if (data.data.data.length < self.page.pageSize) {
                            self.loading.text = '';
                            self.loading.ajax = false;
                        }
                        if (self.count == 0) {
                            self.count = data.data.totalCount;
                        }
                    } else {
                        toast.showError(data.message);
                    }

                    // 加入列队
                    vm.$nextTick(function () {
                        $(window).scrollTop(self.loading.scrollTop);
                        toast.hide();
                    });
                });
            }
        }
    });

});