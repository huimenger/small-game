require(['store'], function (store) {

    store.forEach(function (key, val) {
        // 清除缓存
        if (key.indexOf('HotSelectActive') != -1) {
            store.remove(key);
        }
    });

    // 清除标签缓存


});