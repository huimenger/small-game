define(['jquery', 'vue', 'models/Book/ReadHistoryStore', "commons/Download", "commons/StatisticsTool"], function (jquery, vue, store, download, stat) {
    var vm = new vue({
        el: 'body',
        data: {
            FirstHistory: (store.getBookReadHistory().length ? store.getBookReadHistory()[0] : false),
            hideDownload: (stat.getAppId() && stat.getAppId().indexOf("vivo") > -1)
        },
        methods: {
            download: function () {
                download.download();
            }
        }
    });
    return vm;

});