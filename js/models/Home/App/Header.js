define([
    'vue',
    "jquery",
    "commons/InitData",
    'text!models/Home/App/Tpl/Header.html',
    'models/Home/App/Search',
    'commons/Download',
    'commons/StatisticsTool',
    "store",
    "commons/Send"
], function (Vue, $, InitData, Tpl, Search, Download, stat, store,send) {
    // 状态同步
    if (send.sync()) return;

    InitData = JSON.parse(InitData);

    return Vue.extend({
        template: Tpl,
        components: {
            //'view-search': Search
        },
        props: {
            userico: {
                default: true,
                type: Boolean
            }
        },
        data: function () {
            return {
                FirstHistory: store.get('bookReadHistory') && store.get('bookReadHistory')[0] || {},
                cover: InitData.cover || "",
                coin: InitData.coin || 0
            };
        },
        methods: {
            download: function () {
                Download.download();
            }
        }
    });
});