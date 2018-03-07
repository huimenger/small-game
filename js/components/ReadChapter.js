define(["jquery", "vue", "text!components/template/ReadChapter.html", "commons/Browser", "store", "commons/Query", "commons/Config", 'commons/StatisticsTool'], function ($, vue, tpl, browser, store, query, config, stat) {
    var component = vue.extend({
        props: {
            chapter: {},
            isShowBtns: false
        },
        data: function () {
            return {
                isWexin: browser.isWeixin,
                wx_tips: "关注书香云集公众号即送100代金券",
                noFollowWX: !config.isShowFollowWx(stat.getAppId()),
                autoBuyChapter: store.get("AutoBuyChapter" + query.get("bookId")) === false ? false : true,
                noqrcode: !!query.get("noqrcode")
            };
        },
        template: tpl,
        created: function () {
            if (stat.getAppId() && stat.getAppId().toLowerCase() == "huanglitianqi") {
                this.wx_tips = "关注书香云集小说公众号即送100代金券";
            }
        },
        methods: {
            nextChapter: function () {
                this.$dispatch("nextChapter");
            },
            showMenu: function () {
                this.$dispatch("showMenu");
            },
            buySingleChapter: function () {
                this.$dispatch("buySingleChapter");
                this.setAutoBuyChapter(this.autoBuyChapter);
            },
            buyMultiChapter: function () {
                this.$dispatch("buyMultiChapter");
                this.setAutoBuyChapter(this.autoBuyChapter);
            },
            toggleAutoBuyChapter: function () {
                this.autoBuyChapter = !this.autoBuyChapter;
                this.setAutoBuyChapter(this.autoBuyChapter);
            },
            setAutoBuyChapter: function (bool) {
                store.set("AutoBuyChapter" + query.get("bookId"), bool);
            },
            concernWx: function () {
                console.log("关注公众号");
                window._czc.push( [ "_trackEvent" , "点击下载" , stat.getAppId() , "关注公众号" ] );
                location.href = "/StaticPages/wxhelp.html";
            }
        },
        events: {
            changeLoadMode: function (mode) {
                this.isShowBtns = (mode === 0);
                console.log(mode);
            }
        }
    });
    vue.component("read-chapter", component);
    return component;
});