(function (callback) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = callback(require('jquery'), require('libs/md5'), require('commons/Browser'));
        return;
    }
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'libs/md5', 'commons/Browser'], callback);
        return;
    }
    window.http = callback(window.$, window.md5, window.browser);
})(function ($, md5, browser) {
    var dtp = browser ? browser.platform : '';
    var http = {
        md5: {}
    };

    http.get = function (url, data, callback) {
        var args = {
            dtp: dtp
        }
        if (!dtp) {
            delete args['dtp'];
        }
        data = $.extend({}, data, args);

        var xVeri = '';
        for (var attr in data) {
            if (xVeri.length !== 0) {
                xVeri += '&';
            }
            xVeri += (attr + '=' + data[attr]);
        }

        xVeri = encodeURI(xVeri);

        $.ajax({
            type: 'get',
            url: url + (url.indexOf('?') != -1 ? '&' : '?') + xVeri,
            headers: {
                'xVeri': md5.hex_md5('69CV0fn7Q1FZp-' + xVeri + '_fnGyCEo56n')
            },
            success: callback
        });
    }

    http.md5.post = function (url, data, callback) {
        var type = (typeof data).toLocaleLowerCase();
        // 如果没有携带数据
        if (type === 'function') {
            $.post(url, data, callback);
            return;
        }
        var ver1 = md5.hex_md5('69CV0fn7Q1FZp-' + JSON.stringify(data) + '_fnGyCEo56n');
        var ver2 = md5.hex_md5('jIkLLKdk7G7_' + ver1);
        $.ajax({
            type: 'post',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json;charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("xVeri1", ver1);
                xhr.setRequestHeader("xVeri2", ver2);
            },
            success: callback
        });
    }
    return http;
});