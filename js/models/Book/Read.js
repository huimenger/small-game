define([
    "jquery",
    "vue",
    "store",
    "commons/BookStore",
    "commons/initData",
    "commons/Query",
    "commons/StatisticsTool",
    "eui/Toast",
    "eui/Dialog",
    "commons/Browser",
    "components/ReadHeader",
    "components/ReadFooter",
    "components/ReadChapter",
    "commons/Send",
    "commons/Http"
], function ($, vue, store, bookStore, initData, query, statTool, toast, dialog, browser, header, footer, chapter, send, http) {
    var toRedirect = function (book, chapter) {
        return location.pathname + encodeURI('?bookid=' + book + '&chapterId=' + chapter);
    }
    // 同步
    vue.config.async = false;
    initData = JSON.parse(initData);
    var vm = new vue({
        el: "body",
        data: {
            // 当前阅读的书籍id
            bookId: initData.BookId,

            existshelf: initData.ExistShelf,

            bookName: initData.BookName,

            // 记录用户是否已经登录
            isLogined: initData.IsLogined,

            // 当前阅读的章节位置索引
            currentChapterIndex: initData.CurrentChapterIndex,

            // 章节Id数组
            chapterIds: initData.Chapters,

            // 当前加载的章节信息
            currentChapter: {},

            // 当前加载的多个章节信息,自动加载模式下
            loadChapters: [],

            // 是否显示第一次触摸区域教程
            isShowFirstMask: !store.get("NotFirstOpenReadPage"),
            //isShowFirstMask: true,

            // 当前阅读自体大小
            currentFont: "read-font" + (store.get("ReadFontSize") ? store.get("ReadFontSize") : "18"),
            fontSize: parseInt(store.get("ReadFontSize") ? store.get("ReadFontSize") : "18"),

            // 加载模式
            chapterLoadMode: parseInt(store.get("ChapterLoadMode") ? store.get("ChapterLoadMode") : 0),

            // 当前使用的主题
            currentTheme: "read-theme" + (store.get("ReadTheme") ? store.get("ReadTheme") : "1"),

            // 触摸屏蔽的过程中是否移动了手指
            isMoving: false,

            // 是否显示了Footer
            isShowFooter: false,

            // 是否显示阅读完毕的推广内容
            isShowEnding: false,

            // 页面是否初始化中
            isLoading: true,

            // 正在加载章节
            isLoadingChapter: false,

            // 上一次滚动的位置
            lastScrollY: -1
        },
        created: function () {
            var self = this;
            // 清缓存
            this.clearCache();
            try {
                store.set("NotFirstOpenReadPage", true);
            } catch (e) {
                console.log(e);
            }

            send.residual(function () {
                self.loadChapter(self.chapterIds[self.currentChapterIndex]);
            }, function (success) {
                success && success({
                    data: {
                        coin: 0,
                        coupon: 0
                    }
                });
            });

            this.initTouch();

        },
        methods: {
            clearCache: function (num) {
                try {
                    num = num ? num : 0;
                    // 缓存限制
                    var len = 0;
                    var ChapterCache = [];
                    store.forEach(function (key, val) {
                        len++;
                        // 缓存章节key值
                        if (key.indexOf('ChapterCache') != -1) {
                            ChapterCache.push(key);
                        }
                    });
                    if (len > 100 - num) {
                        for (var i = 0; i < ChapterCache.length; i++) {
                            console.log(ChapterCache[i]);
                            store.remove(ChapterCache[i]);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            initTouch: function () {
                var self = this;

                var wrapper = $(window);
                wrapper.scroll(function () {
                    var scrollY = wrapper.scrollTop();

                    if (!statTool.getAppId() || statTool.getAppId().indexOf("vivo") === -1) {
                        // 距离顶部小于100px或者距离底部小于100px也要隐藏
                        if (scrollY - self.lastScrollY > 0 || scrollY < 100 || scrollY + 100 > $(document).height() - $(window).height()) {
                            // 往上滚动
                            self.$refs.footer.hideDownload();
                        } else if (scrollY - self.lastScrollY < -5) {
                            // 往下滚动
                            self.$refs.footer.showDownload();
                        }
                    }

                    self.lastScrollY = scrollY;

                    if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                        console.log("Scrolled Bottom");
                        if (self.chapterLoadMode === 1 && !self.currentChapter.locked) {
                            self.toNextChapter();
                        }
                    }
                });

                $(window).on("touchstart", function (event) {
                    // 设置移动标识为false
                    self.isMoving = false;
                });
                $(window).on("touchmove", function (event) {
                    // 设置移动标识为true
                    self.isMoving = true;
                });
                $(window).on("touchend", function (event) {

                    var touch = self.getTouchByEvent(event);

                    // 触摸结束后，检测是否移动过
                    if (self.isMoving) {
                        // 什么也不做
                    } else {
                        // 没有移动过，检测触摸位置
                        var height = $(window).height();

                        var wrapper;

                        if (touch.clientY < height * 0.3) {
                            console.log("点击屏幕上方");
                            // 触摸的是上边
                            if (self.isShowFooter) {
                                self.$refs.footer.hideFooter();
                                self.$refs.header.hideHeader();
                                self.isShowFooter = false;
                            } else {
                                // 向上卷动一屏幕高度 - 字体大小px
                                wrapper = $(window);
                                wrapper.scrollTop(wrapper.scrollTop() - wrapper.height() + self.fontSize);
                            }
                        } else if (touch.clientY > height * 0.7) {
                            console.log("点击屏幕下方");
                            // 触摸的是下边
                            if (self.isShowFooter) {
                                self.$refs.footer.hideFooter();
                                self.$refs.header.hideHeader();
                                self.isShowFooter = false;
                                self.$refs.footer.hideDownload();
                            } else {
                                // 向下卷动一屏幕高度 - 字体大小px
                                wrapper = $(window);
                                wrapper.scrollTop(wrapper.scrollTop() + wrapper.height() - self.fontSize);
                            }
                        } else {
                            console.log("点击屏幕中间");
                            // 触摸的是中间
                            if (self.isShowFooter) {
                                self.$refs.footer.hideFooter();
                                self.$refs.header.hideHeader();
                                self.isShowFooter = false;
                            } else {
                                self.$refs.footer.showFooter();
                                self.$refs.header.showHeader();
                                self.isShowFooter = true;
                                self.$refs.footer.hideDownload();
                            }
                        }
                    }
                });
            },
            // 隐藏第一次阅读时弹出的提示遮罩
            hideFirstMask: function () {
                this.isShowFirstMask = false;
            },
            // 从touch事件中提取touch状态信息
            getTouchByEvent: function (event) {
                var touch = event.originalEvent.touches[0];
                if (!touch) {
                    touch = event.originalEvent.changedTouches[0];
                }
                return touch;
            },
            // 上一章
            toPrevChapter: function () {
                var self = this;
                if (this.currentChapterIndex === 0) {
                    // 已经是第一章了
                    console.log("已经是第一章了");
                } else {
                    if (self.isLoadingChapter) {
                        return;
                    }
                    this.isLoadingChapter = true;
                    this.currentChapterIndex--;
                    this.loadChapter(this.chapterIds[this.currentChapterIndex], function () {
                        self.isLoadingChapter = false;
                    });
                    this.isShowEnding = false;
                }
            },
            // 下一章
            toNextChapter: function () {
                var self = this;
                if (this.currentChapterIndex + 1 >= this.chapterIds.length) {
                    // 已经是最后一章了
                    console.log("已经是最后一章了");
                    this.isShowEnding = true;
                } else {
                    if (self.isLoadingChapter) {
                        return;
                    }
                    this.isLoadingChapter = true;
                    this.currentChapterIndex++;
                    this.loadChapter(this.chapterIds[this.currentChapterIndex], function () {
                        self.isLoadingChapter = false;
                    });
                }
            },
            // 加载章节
            loadChapter: function (chapterId, done) {
                var self = this;

                // 如果章节章已经在加载列表中，则移除掉（特别是在遇到收费章节时，移除为购买的章节，添加已购买章节）
                if (self.loadChapters.length > 0 && self.loadChapters[self.loadChapters.length - 1].id === chapterId) {
                    self.loadChapters.pop();
                }
                self.lastScrollY = -1;

                if (!!store.get("ChapterCache" + chapterId)) {
                    self.currentChapter = store.get("ChapterCache" + chapterId);
                    if (self.chapterLoadMode === 1) {
                        self.loadChapters = self.loadChapters.concat(store.get("ChapterCache" + chapterId));
                    }

                    // 保存本地阅读历史
                    history.replaceState(null, document.title, query.path + "?bookid=" + self.bookId + "&chapterId=" + self.currentChapter.id + location.hash);
                    bookStore.setBookReadHistory(self.bookId, self.bookName, chapterId, self.currentChapter.title);
                    self.isLoading = false;

                    var wrapper = $(window);
                    if (self.chapterLoadMode === 0) {
                        wrapper.scrollTop(0);
                    }
                    done && done();
                    return;
                }

                toast.showProgress("加载章节");

                $.get("/WebApi/Book/GetChapter", { bookId: this.bookId, chapterId: chapterId, tid: new Date().getTime() }, function (json) {
                    toast.hide();
                    self.isLoading = false;
                    if (json.status) {

                        self.clearCache(1);

                        // 2016-12-13
                        // 更新金币代金券
                        json.data.userCoin = send.get.coin() ? send.get.coin().data.coin : 0;
                        json.data.userCoupon = send.get.coin() ? send.get.coin().data.coupon : 0;
                        self.currentChapter = json.data;

                        if (self.chapterLoadMode === 1) {
                            self.loadChapters = self.loadChapters.concat(json.data);
                        }
                        self.isLogined = json.data.logined;

                        // 保存本地阅读历史
                        history.replaceState(null, document.title, query.path + "?bookid=" + self.bookId + "&chapterId=" + self.currentChapter.id + location.hash);
                        bookStore.setBookReadHistory(self.bookId, self.bookName, chapterId, self.currentChapter.title);

                        if (json.data.locked) {
                            // 如果是自动购买
                            if (!!store.get("AutoBuyChapter" + self.bookId)) {
                                self.buyChapter();
                            }
                        } else {
                            // 缓存章节
                            store.set("ChapterCache" + chapterId, json.data);
                        }
                        var wrapper = $(window);
                        if (self.chapterLoadMode === 0) {
                            wrapper.scrollTop(0);
                        }

                        // 隐藏
                        self.$refs.footer.hideFooter();
                        self.$refs.header.hideHeader();
                        self.isShowFooter = false;

                    } else {
                        toast.showError(json.message);
                    }
                    done && done();
                }, "json");
            },
            // 缓存章节，递归调用（要缓存的章节ID数组，当前缓存的下标，缓存成功的计数）
            saveChapter: function (ids) {
                var self = this;
                toast.showProgress("正在缓存章节");
                $.get("/WebApi/Book/GetMultiChapter", { bookId: this.bookId, chapterIds: ids.join(",") }, function (json) {
                    toast.hide();
                    if (json.status) {
                        for (var i = 0; i < json.data.length; i++) {
                            var chapter = json.data[i];
                            // 缓存章节
                            self.clearCache(json.data.length);
                            try {
                                store.set("ChapterCache" + chapter.id, chapter);
                            } catch (e) { }
                        }
                        if (json.data.length > 0) {
                            toast.showSuccess("缓存了" + json.data.length + "章免费章节");
                        } else {
                            toast.showInfo("已经没有可以缓存的章节了");
                        }
                    } else {
                        toast.showError(json.message);
                    }
                }, "json");
            },
            // 购买当前章节
            buyChapter: function (callback) {
                var self = this;
                // 用户id不存在
                if (!send.get.user()) {
                    dialog.showConfirm({
                        text: "该章节为收费章节，请登录后阅读",
                        title: "提示",
                        ok: function (dlg) {
                            dlg.remove();
                            location.href = "/WebApp/Account/Login.html?redirect=" + toRedirect(self.bookId, self.currentChapter.id);
                        }
                    });
                    return;
                }

                // 金币数不够
                var money = send.get.coin().data;
                if (money.coin + money.coupon < self.currentChapter.coin) {
                    dialog.showConfirm({
                        text: "剩余金币不足，是否充值？",
                        ok: function (dlg) {
                            try {
                                window._czc.push(["_trackEvent", "H5", "充值", "阅读金币不足"]);
                            } catch (error) { }
                            dlg.remove();
                            location.href = "/WebApp/User/Recharge.html?redirect=" + toRedirect(self.bookId, self.currentChapter.id);
                        }
                    });
                }

                toast.showProgress("购买中");
                http.md5.post("https://api.ireadercity.com:4430/h/api/User/WapPurchaseChapter", {
                    CSI: {
                        Platform: browser.platform,
                        UserId: send.get.user().userID,
                        Channel: statTool.getAppId()
                    },
                    CBD: {
                        BookId: this.bookId,
                        ChapterIds: [this.currentChapter.id]
                    }
                }, function (json) {
                    if (json.status == 200) {
                        // 购买章节后更新代金券
                        send.residual(function () {
                            toast.hide();
                            self.loadChapter(self.chapterIds[self.currentChapterIndex]);
                        });
                    } else if (json.code === "1003") {
                        toast.hide();
                        // 金币不足
                        setTimeout(function () {
                            dialog.showConfirm({
                                text: "剩余金币不足，是否充值？",
                                ok: function (dlg) {
                                    dlg.remove();
                                    location.href = "/WebApp/User/Recharge.html?redirect=" + toRedirect(self.bookId, self.currentChapter.id);
                                }
                            });
                        }, 600);
                    } else {
                        toast.hide();
                        toast.showError(json.msg);
                    }
                }, "json");
            },
            download: function () {
                this.$refs.footer.download();
            },
            // 添加到书架
            addToShelf: function (callback) {
                var self = this;
                toast.showProgress("正在添加到书架");
                $.post("/WebApi/Shelf/AddShelf", {
                    BookId: self.bookId,
                    ChapterId: self.currentChapter.id
                }, function (json) {
                    toast.hide();
                    if (json.status === 1) {
                        toast.showSuccess("已成功添加到书架");
                        self.existshelf = true;
                        if (callback) {
                            callback();
                        }
                    } else if (json.message.indexOf("登录") !== -1) {
                        // 用户未登录
                        setTimeout(function () {
                            dialog.showConfirm({
                                text: "您还未登录，请先登录",
                                title: "提示",
                                ok: function (dlg) {
                                    dlg.remove();
                                    location.href = "/WebApp/User/Recharge.html?redirect=" + toRedirect(self.bookId, self.currentChapter.id);
                                }
                            });
                        }, 600);
                    } else {
                        toast.showError(json.message);
                    }
                }, "json");
            }
        },
        events: {
            // 收到改变字体大小的事件
            changeFont: function (size) {
                this.currentFont = "read-font" + size;
                this.fontSize = size;
            },
            changeLoadMode: function (mode) {
                this.chapterLoadMode = mode;
                this.loadChapters = [this.currentChapter];
            },
            // 收到改变主题的事件
            changeTheme: function (index) {
                this.currentTheme = "read-theme" + index;
            },
            // 收到上一章的事件
            prevChapter: function () {
                // 最后一章
                if (this.isShowEnding) {
                    this.isShowEnding = false;
                } else {
                    this.loadChapters = [];
                    var wrapper = $(window);
                    wrapper.scrollTop(0);
                    this.toPrevChapter();
                }
            },
            // 收到下一章的事件
            nextChapter: function () {
                this.loadChapters = [];
                this.toNextChapter();
            },
            // 收到显示菜单的事件
            showMenu: function () {
                var self = this;
                if (self.isShowFooter) {
                    self.$refs.footer.hideFooter();
                    self.$refs.header.hideHeader();
                    self.isShowFooter = false;
                } else {
                    self.$refs.footer.showFooter();
                    self.$refs.header.showHeader();
                    self.isShowFooter = true;
                    self.$refs.footer.hideDownload();
                }
            },
            // 缓存后20章节
            preloadChapter: function () {
                var start = this.currentChapterIndex + 1;
                var end = start + 20;
                if (start >= this.chapterIds.length) {
                    toast.showInfo("已经是最后一章了");
                    return;
                }
                end = end > this.chapterIds.length ? this.chapterIds.length : end;
                var ids = this.chapterIds.slice(start, end);

                // 去掉已经缓存的章节
                var i;
                for (i = 0; i < ids.length; i++) {
                    if (!!store.get("ChapterCache" + ids[i])) {
                        ids.splice(i, 1);
                        i--;
                    }
                }

                if (ids.length === 0) {
                    toast.showInfo("已经缓存成功");
                    return;
                }

                // 本地存储是否过大，过大清除章节缓存
                if (localStorage.length > 100) {
                    for (i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        if (key.indexOf("ChapterCache") > -1) {
                            localStorage.removeItem(key);
                            i--;
                        }
                    }
                }

                this.saveChapter(ids, 0, 0);
            },
            // 显示目录事件
            showIndex: function () {
                location.href = "/webapp/book/directory.html?bookid=" + this.bookId + "&chapterId=" + this.currentChapter.id;
            },
            buySingleChapter: function () {
                this.buyChapter();
            },
            buyMultiChapter: function () {
                if (this.isLogined) {
                    location.href = "/WebApp/Book/BatchBuy.html?bookid=" + this.bookId + "&chapterId=" + this.currentChapter.id;
                } else {
                    // 用户未登录
                    setTimeout(function () {
                        dialog.showConfirm({
                            text: "您还未登录，请登录后购买",
                            title: "提示",
                            ok: function (dlg) {
                                dlg.remove();
                                location.href = "/WebApp/Account/Login.html?redirect=" + location.href;
                                //location.href = "/webapp/home/index.html#/Recharge?redirect=" + location.href;
                            }
                        });
                    }, 600);
                }
            },
            addShelf: function () {
                this.addToShelf();
            },
            headerBack: function () {
                var self = this;
                var goback = function () {
                    if (history.length > 1) {
                        history.go(-1);
                    } else {
                        location.href = "/webapp/home/index.html";
                    }
                };
                // 如果没有加入到书架
                if (!this.existshelf && this.isLogined) {
                    dialog.showConfirm({
                        text: "是否将本书添加到书架？",
                        ok: function (dlg) {
                            dlg.remove();
                            self.addToShelf(function () {
                                goback();
                            });
                        },
                        cancel: function (dlg) {
                            dlg.remove();
                            goback();
                        }
                    });
                } else {
                    goback();
                }
            }
        }
    });
    return vm;
});