define([
    'commons/Http',
    'commons/Browser',
    'eui/Toast',
    'commons/BookStore'
], function (http, browser, Toast, BookStore) {
    var key = {
        user: 'sxyj:session:l',
        coin: 'sxyj:session:c',
        server: 'D1142934A40D586346ADEC9D12490828'
    }
    var store = {
        setItem: BookStore.setCookie,
        getItem: BookStore.getCookie
    }

    var send = {
        sync: function () {
            // 如果没有客户端cookie且服务端cookie存在
            if (!store.getItem(key.user) && store.getItem(key.server)) {
                var exp = new Date();
                var cval = key.server + "=null;expires=" + exp.toGMTString();
                store.setItem(key.server, cval);
                window.location.reload();
                return true;
            }

            // 如果没有服务端cookie且客户端cookie存在
            if (!store.getItem(key.server) && store.getItem(key.user)) {
                store.setItem(key.user, null);
                window.location.reload();
                return true;
            }
        },
        set: {
            // 用户信息
            user: function (info) {
                if (!info) {
                    var exp = new Date();
                    var cval = store.getItem(key.user);
                }
                info = JSON.stringify(info);
                store.setItem(key.user, info);
            },
            // 用户金币数
            coin: function (info) {
                info = JSON.stringify(info);
                var k = !send.get.user() ? '' : send.get.user().userID;
                store.setItem(key.coin + k, info);
            }
        },
        get : {
            user: function () {
                send.sync();
                return store.getItem(key.user);
            },
            coin: function (error) {
                // 判断是否存在
                if (!send.get.user()) return null;
                var k = !send.get.user() ? '' : send.get.user().userID;
                return store.getItem(key.coin + send.get.user().userID);
            }
        },
        cache: {}
    }

    // 验证跳转
    send.validate = function (callback,c) {
        if (!send.get.user()) {
            if(callback){
                callback && callback(c);
                return true;
            }
            window.history.back(-1);
            return true;
        }
        return false;
    }
    
    // 获取用户余额
    send.residual = function (callback, error, status) {
        if (send.validate(error,callback)) return;
        http.get('https://api.ireadercity.com:4430/u/main/GetBalance', {
            UserId: send.get.user().userID
        }, function (info) {
            if (info.status === 200) {
                send.set.coin(info);
                callback && callback(info);
            } else {
                Toast.showError(info.msg);
            }
        });
    }
    send.cache.residual = function (callback, error) {
        if (send.get.coin()) {
            callback && callback(send.get.coin());
            return;
        }
        send.residual(callback, error);
    }
    return send;
});