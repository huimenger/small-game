define(["components/search", "commons/Browser", "commons/Download", "commons/StatisticsTool", "commons/Config"], function (search, browser, download, stat, config) {
    if (browser.isWeixin) {
        $('#qrcode').show();
        $('#concern').hide();
    } else {
        $('#qrcode').hide();
        $('#concern').show();
    }

    $(".footer_download").mousedown(function () {
        download.download();
    });

    var height = $(window).height();

    if (config.get("noFollowWX")) {
        $("#concern").remove();
    }

    $(function () {
        if (config.get("noFloatFooter")) {
            $("#footer-download").remove();
            return;
        }
        $(document.body).css('height', 'auto');
        $('#footer-download').hide();

        var self = this;
        self.isHide = true;

        $(window).scroll(function () {
            if ($(this).scrollTop() >= $(document.body).height() - $(window).height() - 150 || $(this).scrollTop() <= 150) {
                if ($('#footer-download').hasClass('active')) {
                    $('#footer-download').removeClass('active');
                }
                return;
            }

            if (!this.notscroll) {
                $('input,textarea').off('focus').on('focus', function () {
                    if ($('#footer-download').hasClass('active')) {
                        $('#footer-download').removeClass('active').hide();
                    }
                }).off('blur').on('blur', function () {
                    $('#footer-download').show();
                });
                this.notscroll = true;
            }

            if (!stat.getAppId() || stat.getAppId().indexOf("vivo") === -1) {
                this.prevScrollTop = this.prevScrollTop ? this.prevScrollTop : 0;
                if (this.prevScrollTop > $(this).scrollTop() && height == $(window).height()) {
                    if (!$('#footer-download').hasClass('active')) {
                        if (self.isHide) {
                            $('#footer-download').show();
                            self.isHide = false;
                            setTimeout(function () {
                                $('#footer-download').addClass('active');
                            }, 0);
                        } else {
                            $('#footer-download').addClass('active');
                        }
                    }
                } else {
                    if ($('#footer-download').hasClass('active')) {
                        $('#footer-download').removeClass('active');
                    }
                }
            }
            this.prevScrollTop = $(this).scrollTop();
        });
    });
});