define(['vue', 'text!models/Home/App/Tpl/Footer.html', 'commons/Download', 'commons/StatisticsTool', "commons/Config"], function (Vue, Tpl, Download, stat, config) {
    return Vue.extend({
        template: Tpl,
        data: function () {
            return {
                isShowDownload: config.isShowDownload(stat.getAppId()),
            }
        },
        methods: {
            download: function () {
                console.log("footer",stat.getAppId());
                window._czc.push(["_trackEvent", "点击下载", stat.getAppId(),"footer"]);
                Download.download();
            }
        }
    });
});