define([
    'vue',
    'text!components/template/reading.html',
    'store',
    'commons/Download',
    'commons/StatisticsTool',
    "commons/Browser",
    "commons/Config"
], function (vue, tpl, store, Download, stat, browser, config) {
    return vue.extend({
        template: tpl,
        data: function () {
            return {
                isShowDownload: config.isShowDownload(stat.getAppId()),
                FirstHistory: store.get('bookReadHistory') && store.get('bookReadHistory')[0] || {}
            }
        },
        ready: function () {

        },
        methods: {
            download: function () {
                Download.download();
            }
        }
    });

});