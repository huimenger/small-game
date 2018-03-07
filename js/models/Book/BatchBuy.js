define([
    "jquery",
    "vue",
    "eui/dialog",
    "eui/toast",
    "commons/InitData",
    "commons/Query",
    "commons/Send",
    "commons/Browser",
    "commons/StatisticsTool",
    "commons/Http"
], function ($, vue, dialog, toast, initData, query, send, browser,statTool,http) {
    initData = JSON.parse(initData);
    var bookId = query.get('bookid');

    var vm = new vue({
        el: "#p-batchBuy",
        data: {
            user: {
                coin: send.get.coin() ? send.get.coin().data.coin : 0,
                coupon: send.get.coin() ? send.get.coin().data.coupon : 0
            },
            allDataNum: 0,
            freeChapterCount: 0,
            allChapters: [], //n个20条
            hasCheckedChapters: 0, //已经选择的章节数
            isCheckPage: false, //第n到(n+20)章的是否打钩
            checkedMoney: 0,
            discountMoney: 0,
            isPicDown: false,
            isCheckAll: false
        },
        created: function () {
            toast.showProgress("加载中");
            if (!initData.logined) {
                dialog.showAlert({
                    text: "您还没登录额",
                    ok: function (dialog) {
                        dialog.remove();
                        window.location = "/WebApp/Account/Login.html?redirect=" + location.href;
                    }
                });
            }
            $.get("/WebApp/Book/GetAllChapters.html",
                {
                    bookid: bookId
                },
                function (json) { 
                    toast.hide();
                    var num = 0;
                    if (json.status === 1) {
                        vm.allDataNum = json.data.length; 
                        var data = json.data;
                        var chapters = [];
                        for (var i = 1; i <= data.length; i++) {
                            var chapter = data[i-1];
                            chapter.checked = false;
                            if (chapter.chaptercoin === 0) {
                                vm.freeChapterCount++;
                            }
                            chapters.push(chapter);
                            if (i % 20 === 0) {
                                num++;
                                vm.allChapters.push({ list: chapters, checked: false });
                                chapters = [];
                            }
                        }
                        if (chapters.length < 20) {   //最后一页
                            vm.allChapters.push({ list: chapters, checked: false });
                        }
                    }
                },
            "json");
            
        },
        methods: {
            showList: function (e) {
                $(e.target).next("li").find(".list").toggle();
                vm.isPicDown = !vm.isPicDown;
            },
            toggleChekced: function (chapter, chapters) {  //选择打勾与不打勾
                chapter.checked = !chapter.checked;
                var num = 0;
                var freeNum = 0;
                var hasBuyNum = 0;
                if (chapter.checked === false) {
                    chapters.checked = false;
                }
                for (var i = 0; i < chapters.list.length; i++) {
                    var chapter1 = chapters.list[i];
                    if (chapter1.checked === true) {
                        num++;
                    }
                    if (chapter1.chaptercoin === 0) {
                        freeNum++;
                    }
                    if (chapter1.hasPurchased) {
                        hasBuyNum++;
                    }
                }
                if (num === (chapters.list.length - freeNum - hasBuyNum)) {
                    chapters.checked = true;
                }
                if (chapter.checked && chapter.chaptercoin && chapter.hasPurchased === false) {
                    vm.hasCheckedChapters++;
                    vm.checkedMoney = vm.checkedMoney + chapter.chaptercoin;

                    vm.discountMoney = vm.discount(vm.hasCheckedChapters, vm.checkedMoney);  //折扣
                }
                if (chapter.checked === false && chapter.chaptercoin && chapter.hasPurchased === false) {
                    vm.hasCheckedChapters--;
                    vm.checkedMoney = vm.checkedMoney - chapter.chaptercoin;

                    vm.discountMoney = vm.discount(vm.hasCheckedChapters, vm.checkedMoney);  //折扣
                }
            },
            isfree: function (chapters) {  // 值为false表示: 这一页全免费或者全购买（界面显示空白）；值为true表示:有收费章节，并且未购买。
                for (var i = 0; i < chapters.length; i++) {
                    var chapter = chapters[i];
                    if (chapter.chaptercoin > 0 && chapter.hasPurchased === false) {
                        return true;
                    }
                }
                return false;
            },
            checkPage: function (data) {   //多选：选择一页20条
                var isChecked = data.checked;
                // 章节列表
                var chapters = data.list;
                for (var i = 0; i < chapters.length; i++) {
                    var chapter = chapters[i];
                    // 如果是已经购买的或者是免费
                    if (chapter.hasPurchased || chapter.chaptercoin === 0) continue;
                    // 当值相等时不重复计算以免金额叠加
                    if (chapters[i].checked == !isChecked) continue;

                    chapters[i].checked = !isChecked;
                    // 如果当前选中
                    if (chapters[i].checked) {
                        vm.hasCheckedChapters++;
                        vm.checkedMoney += chapter.chaptercoin;
                    } else {
                        // 如果没选中
                        vm.hasCheckedChapters--;
                        vm.checkedMoney -= chapter.chaptercoin;
                    }
                    // 最终折扣金额
                    vm.discountMoney = vm.discount(vm.hasCheckedChapters, vm.checkedMoney);
                }
                data.checked = !isChecked;
            },
            discount: function (chapter, money) {   //折扣
                var discount = 1;
                if (chapter >= 100) {
                    discount = 0.8;
                } else if (chapter >= 40) {
                    discount = 0.9;
                } else if (chapter >= 10) {
                    discount = 0.95;
                }
                return Math.ceil(money * discount);
            },
            checkAll: function () {  //多选：选择所有未购买的
                // 重新计算
                for (var i = 0; i < vm.allChapters.length; i++) {
                    var chapter = vm.allChapters[i];
                    chapter.checked = vm.isCheckAll;
                    vm.checkPage(chapter);
                }
                vm.isCheckAll = !vm.isCheckAll;
            },
            buy: function () {   //购买
                var chapterIds = [];
                for (var i = 0; i < vm.allChapters.length; i++) {
                    var chapters = vm.allChapters[i];
                    for (var j = 0; j < chapters.list.length; j++) {
                        var chapter = chapters.list[j];
                        if (chapter.checked) {
                            chapterIds.push(chapter.chapter);
                        }
                    }
                }

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

                if (!query.get('bookid')) {
                    toast.showError("操作有误");
                    return;
                }

                // 金币数不够
                var money = send.get.coin().data;
                if (money.coin + money.coupon < this.discountMoney) {
                    dialog.showConfirm({
                        text: "剩余金币不足，是否充值？",
                        ok: function (dlg) {
                            dlg.remove();
                            location.href = "/WebApp/User/Recharge.html?redirect=" + toRedirect(self.bookId, self.currentChapter.id);
                        }
                    });
                }

                toast.showProgress("购买中");
                http.md5.post("https://api.ireadercity.com:4430/h/api/User/WapPurchaseChapter", {
                    /*BookId: this.bookId,
                    AppId: statTool.getAppId(),
                    ChapterIds: this.currentChapter.id,
                    IsBuyAll: false*/
                    CSI: {
                        Platform: browser.platform,
                        UserId: send.get.user().userID,
                        Channel: statTool.getAppId()
                    },
                    CBD: {
                        BookId: query.get('bookid'),
                        ChapterIds: chapterIds
                    }
                }, function (json) {
                    toast.hide();
                    if (json.status==200) {
                        // 购买章节后更新代金券
                        send.residual(function () {
                            toast.showSuccess("购买成功");
                            window.location = "/webapp/book/read.html?bookId=" + bookId + "&chapterId=" + query.get('chapterId') || vm.allChapters[0];
                        });
                    } else if (json.code === "1003") {
                        // 金币不足
                        setTimeout(function () {
                            dialog.showConfirm({
                                text: "剩余金币不足，是否充值？",
                                ok: function (dlg) {
                                    dlg.remove();
                                    location.href = "/WebApp/User/Recharge.html?redirect=" + encodeURIComponent(location.href);
                                }
                            });
                        }, 600);
                    } else {
                        toast.showError(json.msg);
                    }
                }, "json");
            }
        }
    });
    return vm;
});