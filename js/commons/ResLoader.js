define(function () {
    var loader = {
        load: function (url, callback) {
            loader.loadImage(url, callback);
        },
        loadImage: function (url, callback) {
            var img = new Image();
            img.src = url;
            if (img.complete) {
                callback.call(img);
                return;
            }
            img.onload = function () {
                callback.call(img);
            }
        }
    };
    return loader;
});