define(function () {
    var tools = {
        // 验证是否为手机号码
        isPhone: function (str) {
            var telReg = !!str.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
            return telReg;
        },
        // 验证笔名
        isPenName: function (str) {
            return /^[\u4E00-\u9FA5a-zA-Z0-9]{2,10}$/.test(str);
        },
        // 验证真实姓名
        isTrueName: function (str) {
            return /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/.test(str);
        },
        // 验证是否是QQ号码
        isQq: function (str) {
            return /^\d{5,12}$/.test(str);
        },
        // 验证是否是身份证号码
        isCardNumber: function (str) {
            return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str);
        },
        // 验证是否是护照
        isPassport: function (str) {
            return /^(P\d{7}|G\d{8}|S\d{7,8}|D\d+|1[4,5]\d{7})$/.test(str);
        },
        // 验证邮箱
        isEmail: function (str) {
            return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(str);
        }
    };
    return tools;
});