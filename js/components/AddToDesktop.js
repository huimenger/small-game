define(["jquery", "commons/Browser", "vue", "text!components/template/AddToDesktop.html", "commons/Query"], function ($, browser, vue, tpl, query) {

    function dontShow() {
        if (browser.isMobile) {
            if (browser.isApple) {
                //匹配苹果 微信 、 safire
                if (( /*browser.isWeixin ||*/ browser.isSafari) && !(browser.isQQ)) {
                    return true;
                } else {
                    return false;
                }
            } else if (browser.isAndroid) {
                //匹配安卓 UC 、 谷歌 、 qq 、 小米
                if (browser.isUc || browser.isChrome || browser.isQQ || browser.isXiaoMi) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    var vm = vue.extend({
        template: tpl,
        data: function () {
            return {
                // 显示的文本
                html: "点击<i class='ios'></i>，选择“添加到主屏幕”随时打开看",
                // 显示的位置
                isAndroidWX: dontShow(),
                isXiaoMi: browser.isXiaoMi,
                position: 0,
                isHide: false,
                isShow: true,
                isShowiPhone: browser.isApple && browser.isSafari || browser.isAndroid,
                isShowiAndroid: browser.isAndroid,
                isAndroidChrome: browser.isMobile && browser.isAndroid && browser.isChrome
            }
        },
        created: function () {
            //alert(browser.ua)
            //alert(browser.isUc + "\n" + browser.isChrome + "\n" + browser.isQQ + "\n" + browser.isXiaoMi + "\n" + browser.isApple + "\n" + browser.isWeixin + "\n" + browser.isSafari)
            // 初始化
            if (browser.isMobile && browser.isAndroid) {
                if (browser.isUc) {
                    //alert(1)
                    this.html = '点这里先选择"添加收藏"，再选择"添加到手机桌面"，随时打开看小说';
                } else if (browser.isChrome) {
                    //alert(2)
                    this.html = '点这里选择"添加到主屏幕"随时打开看小说';
                } else if (browser.isQQ) {
                    //alert(3)
                    this.html = '点这里先选择"添加书签"，再保存为"桌面书签"，随时打开看小说 ';
                } else if (browser.isXiaoMi) {
                    //alert(4)
                    this.html = '点这里先选择"加快捷方式"，选择"手机桌面"，随时打开看小说 ';
                }
            }
            if (query.get("showAddDesktop")) {
                this.isAndroidWX = false;
            } else {
                //addHistor();
                var state = { title: "history show" }
                var url = location.href;
                if (url.indexOf("showAddDesktop") === -1) {
                    if (url.indexOf("?") > -1) {
                        url += "&showAddDesktop=true";
                    } else {
                        url += "?showAddDesktop=true";
                    }
                }
                history.pushState(state, "history show", url);
            }

            function GetQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return "";
            }

        },
        methods: {
            hide: function () {
                vm.toggle(false);
            },
            toggle: function (blo) {

                if (blo !== undefined) {
                    vm.isShow = blo;
                } else {
                    vm.isShow = !vm.isShow;
                }
            },
            close: function (event) {
                $(".v-add-top-desktop").hide();
                return false;
            },
            hideCont: function (event) {
                $(".v-add-top-desktop").fadeOut(300);
                return false;
            }
        }
    });
    vue.component("view-add-to-desktop", vm)
});