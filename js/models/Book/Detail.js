define([
    'jquery',
    'vue',
    'eui/Toast',
    "commons/Download",
    "commons/Browser",
    'models/Home/App/Footer',
    "commons/StatisticsTool",
    "commons/Config"
], function (jquery, vue, Toast, download, browser, Footer, stat, config) {

    var vm = new vue({
        el: 'body',
        data: {
            isShowDownload: config.isShowDownload(stat.getAppId()),
            DescFold: true,
            comments: []
        },
        components: {
            "app-footer": Footer
        },
        created: function () {

        },
        methods: {
            openBook: function (bookid) {
                // 下载
                download.download();
                //window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.ireadercity';
            },
            AddToBookrack: function (bookid, cid) {
                $.post('/webapi/shelf/addshelf', {
                    bookId: bookid,
                    ChapterId: cid || ''
                }, function (data) {
                    if (data.isSuccess) {
                        console.log(Toast);
                        Toast.showSuccess('已成功加入书架');
                    } else {
                        Toast.showWarn(data.message);
                        if (data.code == '1001') {
                            setTimeout(function () {
                                window.location.href = '/webapp/account/login.html?redirect=/Book/Detail.html?bookId=' + bookid;
                            }, 2000);
                        }
                    }
                });
            },
            DownloadBook: function () {
                download.download();

                //window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.ireadercity';
            },
            DescFoldShow: function () {
                this.DescFold = !this.DescFold;
            }
        }
    });

});