define(["jquery"], function ($) {
    var scale = function () {
        var doms = $("[data-img-ratio]");
        doms.each(function () {
            var $this = $(this);
            var ratio = parseFloat($this.attr("data-img-ratio"));
            var imgs = $this.find("img");
            imgs.each(function () {
                var $img = $(this);
                $img.height($img.width() * ratio);
            });
        });
    }
    scale();
    $(window).resize(scale);
});