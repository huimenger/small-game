<<<<<<< .mine
﻿
define(['vue', 'jquery', 'Eui/Toast', 'commons/Browser', 'models/Home/App/Header', 'models/Home/App/Footer', 'models/Home/App/ActionBar', 'commons/Validate', 'commons/StatisticsTool'], function (vue, $, toast, browser, header, footer, actionbar, validate,tool) {
    (function () {
        var tpl = (function () {
            var strVar = "<div id=\"KeyBoard\">";
            strVar += "<div class=\"KeyBoard\" style=\"display:none;\">";
            strVar += "    <table>";
            strVar += "        <tr>";
            strVar += "            <td key=\"1\">1<\/td>";
            strVar += "            <td key=\"2\">2<\/td>";
            strVar += "            <td key=\"3\">3<\/td>";
            strVar += "        <\/tr>";
            strVar += "        <tr>";
            strVar += "            <td key=\"4\">4<\/td>";
            strVar += "            <td key=\"5\">5<\/td>";
            strVar += "            <td key=\"6\">6<\/td>";
            strVar += "        <\/tr>";
            strVar += "        <tr>";
            strVar += "            <td key=\"7\">7<\/td>";
            strVar += "            <td key=\"8\">8<\/td>";
            strVar += "            <td key=\"9\">9<\/td>";
            strVar += "        <\/tr>";
            strVar += "        <tr>";
            strVar += "            <td key=\"invalid\"><\/td>";
            strVar += "            <td key=\"0\">0<\/td>";
            strVar += "            <td key=\"del\"><\/td>";
            strVar += "        <\/tr>";
            strVar += "    <\/table>";
            strVar += "<\/div>";
            strVar += "</div>";
            return strVar;
        })();

        function isEl(el, Cond) {
            if (Cond.charAt(0) === '#') {
                Cond = Cond.substring(1);
                if (el.id === Cond) {
                    return el;
                }
            }
            else if (Cond.charAt(0) === '.') {
                Cond = Cond.substring(1);
                if (el.className.indexOf(Cond) != -1) {
                    return el;
                }
            }
            else if (el.tagName === Cond) {
                return el;
            }
            else {
                return false;
            }
        }
        // 向上递归查找父级
        function parent(el, Cond) {
            while (el.parentNode) {
                if (isEl(el, Cond)) {
                    return isEl(el, Cond);
                }
                el = el.parentNode;
            }
            return false;
        }

        var Board = function (opt) {
            this.el = opt.el || null;
            this.tpl = opt.tpl || function (key) { return key; };
            this.callback = opt.callback || function () { };
            this.group = opt.group || function () { return []; };
            this._parent = null;
            this._el = null;
            this._item = null;
            this._value = [];
            this._target = null;
            return this;
        }
        Board.prototype = {
            init: function () {
                this.create();
                this.even();
                this.elev();
                return this;
            },
            tpl: function (fn) {
                this._tpl = fn;
                return this;
            },
            create: function () {
                var div = document.createElement('div');
                div.innerHTML = tpl;
                document.body.appendChild(div);
                this._parent = document.getElementById('KeyBoard');
                this._el = this._parent.getElementsByClassName('KeyBoard')[0];
                this._item = this._el.getElementsByTagName('td');
                return this;
            },
            elev: function () {
                var self = this;
                var move = false;
                var sMove = false;
                document.body.addEventListener('touchstart', function () {
                    move = false;
                });
                document.body.addEventListener('touchmove', function (event) {
                    move = true;
                });
                document.body.addEventListener('touchend', function (event) {
                    if (move) return;
                    var target = event.target || event.srcElement;
                    target = isEl(target, self.el) || parent(target, self.el);
                    if (target) {
                        self.show(target);
                    }
                });
                this._el.ontouchstart = function () {
                    sMove = false;
                }
                this._el.ontouchmove = function () {
                    sMove = true;
                }
                this._el.ontouchend = function (event) {
                    //if (sMove) return;
                    (event.target.className.indexOf('KeyBoard') != -1) && self.hide();
                }
                return this;
            },
            show: function (target) {
                this._target = target;
                this._parent.style.display = this._el.style.display = 'block';
                return this;
            },
            empty: function () {
                this._value = [];
                this.upview();
                this.callback.call(this, this._value.join(''));
                return this;
            },
            hide: function () {
                this._target = null;
                this._parent.style.display = this._el.style.display = 'none';
                return this;
            },
            even: function () {
                var self = this;
                for (var i = 0; i < this._item.length; i++) {
                    this._item[i].onclick = function () {
                        self.key(this.getAttribute('key'));
                    };
                }
                return this;
            },
            // 添加值
            key: function (key) {
                if (key === 'invalid') return;
                if (key === 'del') {
                    this.remove();
                } else {
                    // 添加不成功
                    if (!this.add(key)) {
                        return false;
                    }
                }
                this.upview();
                this.callback.call(this, this._value.join(''));
                return this;
            },
            upview: function () {
                var item = this.group.call(this._target);
                for (var i = 0; i < item.length; i++) {
                    item[i].innerHTML = '';
                    if (this._value.length > i) {
                        item[i].innerHTML = this._value[i];
                    }
                }
                return this;
            },
            remove: function () {
                this._value.pop();
            },
            add: function (value) {
                var Cond = this.group.call(this._target).length === 0 || this.group.call(this._target).length !== 0 && this._value.length < this.group.call(this._target).length;
                if (Cond) {
                    this._value.push(this.tpl(value));
                    return true;
                }
                return false;
            }
        }

        window.KeyBoard = function (opt) {
            return new Board(opt);
        }
    })();

||||||| .r9094
﻿define(['vue','jquery'], function (vue,jquery) {
    
=======
﻿define(["jquery", "vue", "eui/dialog", "eui/toast", "commons/Validate", "commons/Browser", "commons/StatisticsTool"], function ($, vue, dialog, toast, validate, browser, tool) {



>>>>>>> .r9154
    var vm = new vue({
        el: "body",
        components: {
            'app-header': header,
            'app-footer': footer,
            'app-actionbar': actionbar
        },
        data: {
<<<<<<< .mine
            // 初始页面加载
            LoadPage: true,
            // 标题
            ActionBarTitle: '',
            // 登录进度
            LoginSchedule: 1,
            // 软键盘
            Board: null,

            // 手机号
            phone: '',
            // 验证码
            code: '',
            // 书香账号
            account: '',
            // 书香密码
            password : '',
            // 密码
            pwd: '',
            repwd : '',
            // 显示验证码输入
            showKey : false,
            // 是否禁止发送验证码
            offSendPhone : false,
            // 是否可以注册
            register: false,
            // 是否可以账号登录
            accountAt : false,
            // 是否是找回密码
            isRetrieve : false,

            validate : {
                phone : false
            },

            countConf: {
                showText: '',
                number: 60,
                timer: null
            }
||||||| .r9094
            // 登录进度
            LoginSchedule: 1,
            // 手机验证码
            vCode: {
                value: '',
                array: ['', '', '', '', '', '']
            }
=======
            //手机号登录
            phone: "",
            identifyCode: "",
            captcha: "获取验证码",
            captchaDisabled: false,
            waitTime: 60,

            isshowLogin: true,
            isshowShuxinagLogin: false,
            isLegalPhone: false,
            islegal: false,

            //书香登录
            userName: "",
            pass: "",
            isComplete: false,

            //通过绑定的手机号找回
            isshowFindPass: false,

            //设置密码
            isshowSetPass: false,
            repass: "",

            //是否注册
            isRegister: true
>>>>>>> .r9154
        },
        created: function () {

        },
        ready: function () {
<<<<<<< .mine
            this.setAction();
            // 触发hash
            // this.hash();
            // 自定义键盘
            this.KeyBoard();
||||||| .r9094
            
=======
            var self = this;
            $("#p_login_shuxiang .back").on("click", function () {
                self.isshowLogin = true;
                self.isshowShuxinagLogin = false;
            });
            $("#p_find_pass .back").on("click", function () {
                self.isshowLogin = false;
                self.isshowShuxinagLogin = true;
                self.isshowFindPass = false;
            });
            $("#p_set_pass .back").on("click", function () {
                self.isshowLogin = false;
                self.isshowShuxinagLogin = false;
                self.isshowFindPass = true;
                self.isshowSetPass = false;
            });
>>>>>>> .r9154
        },
        methods: {
<<<<<<< .mine
            KeyBoard: function () {
                var self = this;
                self.Board = KeyBoard({
                    el: '#insert',
                    group: function () {
                        console.log(self.$els.phonelogin.getElementsByTagName('span'));
                        return self.$els.phonelogin.getElementsByTagName('span');
                    },
                    callback: function (value) {
                        self.code = value;
                        if (self.LoginSchedule === 1) {
                            if (value.length === 6) {
                                this.hide();
                                self.login();
                            }
                        }
                    }
                }).init();
||||||| .r9094
            Focus: function () {
                this.$els.vcode.focus();
                alert();
=======
            //手机号快捷登录
            countdown: function () { //倒计时
                var self = this;
                if (self.waitTime == 0) {
                    //$("#captcha").attr("disabled", "disabled");
                    self.captcha = "获取验证码";
                    self.waitTime = 60;
                    return;
                } else {
                    self.captcha = "剩余" + self.waitTime + "秒";
                    self.waitTime--;
                }
                setTimeout(function () {
                    self.countdown(self.waitTime);
                }, "1000");
>>>>>>> .r9154
            },
<<<<<<< .mine
            setAction: function () {
                switch (this.LoginSchedule) {
                    case 1:
                        if (!this.isRetrieve) {
                            this.ActionBarTitle = '手机号快捷登录';
                        } else {
                            this.ActionBarTitle = '通过绑定的手机号找回';
                        }
                        break;
                    case 2:
                        this.ActionBarTitle = '书香云集账号登录';
                        break;
                    case 4:
                        this.ActionBarTitle = this.isRetrieve ? '通过绑定的手机号找回' : '手机号快捷登录';
                        break;
                }
            },
            reset: function () {
                clearInterval(this.countConf.timer);
                this.Board.empty();
                this.repwd = this.pwd = this.password = this.account = this.code = this.phone = '';
                this.showKey = false;
                this.offSendPhone = false;
                this.register = false;
                this.accountAt = false;
                this.validate.phone = false;
                this.countConf.number = 60;
                this.countConf.showText = '';
                return false;
            },
            tab: function (index) {
                this.LoginSchedule = index;
                // 改变标题
                this.setAction();
                // 还原所有值
                this.reset();
            },
            // 找回密码
            RetrieveTab: function () {
                this.isRetrieve = true;
                this.tab(1);
            },
            // 快捷登录
            QuickLogin: function () {
                this.isRetrieve = false;
                this.tab(1);
            },

            pwdChange: function () {
                // 验证密码同时手机号和验证码不能为空
                this.register = (this.pwd.length >= 6 && this.repwd.length >= 6 && this.pwd === this.repwd && this.repwd.length <= 16 && this.pwd.length <= 16) && this.phone && this.code;
            },
            phoneChange: function () {
                this.validate.phone = validate.isPhone(this.phone);
            },
            accountChange: function () {
                this.accountAt = this.account && this.password.length >= 6 && this.password.length <= 16;
            },
            byUserId: function () {
                this.accountChange();
                if (!this.accountAt) return;
                var self = this;
                $.post("/WebApi/Account/LoginByUserId", {
                    UserId: self.account,
                    Password: self.password,
                    IsRemeber: true,
                    platform: browser.isApple ? "iPhone" : "Android"
                }, function (json) {
                    if (json.status === 1) {
                        toast.showSuccess("登录成功");
                        self.dealRedirect();
                    }else {
                        toast.showError(json.message);
                    }
                }, "json");
            },
            // 找回密码-设置新密码
            ResetPassword: function () {
                var self = this;
                $.post("/WebApi/Account/ResetPassword", {
                    Phone: this.phone,
                    Code: this.code,
                    Password: this.pwd,
                    ConfirmPassword: this.repwd,
                    channelId: tool.getAppId()
                }, function (json) {
                    if (json.status == 1) {
                        toast.showSuccess("密码修改成功");
                        setTimeout(function () {
                            //跳转到 书香账号登录
                            self.tab(2);
                        }, 3000);
                    } else {
                        toast.showError(json.message);
                    }
                    self.registeredIng = false;
                }, "json");
            },
            // 设置新密码
            RegisterByPhone: function () {
                var self = this;
                $.post("/WebApi/Account/RegisterByPhone", {
                    Phone: this.phone,
                    Code: this.code,
                    Password: this.pwd,
                    ConfirmPassword: this.repwd,
                    channelId: tool.getAppId()
                }, function (json) {
                    if (json.status === 1) {
                        toast.showSuccess("密码设置成功");
                        self.dealRedirect();
                    } else {
                        toast.showError(json.message);
                    }
                    self.registeredIng = false;
                }, "json");
            },

            // 注册验证
            registered: function () {
                var self = this;
                this.pwdChange();
                if (!this.register) {
                    toast.showError('操作失误');
                    return false;
                }
                if (self.registeredIng) return;
                self.registeredIng = true;
                if (!this.isRetrieve) {
                    this.RegisterByPhone();
                } else {
                    this.ResetPassword();
                }
            },

            // 登录
            logind: function () {
                var self = this;
                toast.showProgress('正在登录');
                $.post("/WebApi/Account/LoginByPhoneAndCode", {
                    Phone: self.phone,
                    Code: self.code,
                    platform: browser.isApple ? "iPhone" : "Android"
                }, function (json) {
                    toast.hide();
                    if (json.status === 1) {
                        toast.showSuccess("登录成功");
                        self.dealRedirect();
                    } else if (json.code === "1002") {  //用户未注册  进入设置密码界面
                        self.LoginSchedule = 4;
                    } else {
                        toast.showError(json.message);
                    }
                }, "json");
            },

            // 找回密码
            next: function () {
                var self = this;
                $.get("/WebApi/Phone/ValidateCode", {
                    phone: this.phone,
                    code: this.code
                }, function (json) {
                    if (json.status == 1) {
                        if (json.data == false) {
                            toast.showError("验证码错误");
                        } else {
                            //进入设置密码界面
                            self.LoginSchedule = 4;
                        }
                    } else {
                        toast.showError(json.message);
                    }
                }, "json");
            },
            // 手机号登录
            login: function () {
                // 如果是登陆
                if (!this.isRetrieve) {
                    this.logind();
                } else {
                    // 找回密码
                    this.next();
                }
            },

            // 发送验证码
            sendPhone: function (callback) {
                this.phoneChange();
                if (this.offSendPhone) return;
                if (!this.validate.phone) return;
                
||||||| .r9094
            insertCode: function () {
                console.log(this.vCode.value);
                this.replaceCode();
                
=======
            shuxiangPage: function () { //转到书香登录
                var self = this;
                self.isshowLogin = false;
                self.isshowShuxinagLogin = true;
>>>>>>> .r9154
                // 禁止发送
                this.offSendPhone = true;
                var self = this;

                toast.showProgress('加载中');

                $.get("/WebApi/Phone/SendPhone", {
                    phone: self.phone
                }, function (json) {
                    toast.hide();
                    if (json.status == 1) {
                        toast.showSuccess("发送成功");
                        callback && callback.call(self);
                        self.Board.show(self.$els.phonelogin);
                    } else {
                        toast.showError(json.message);
                        self.offSendPhone = false;
                    }
                }, "json");
            },
<<<<<<< .mine
            // 获取验证码
            getcode: function () {
                this.sendPhone(function () {
                    this.showKey = true;
                    this.countdown();
                });
            },
            countdown: function () {
                var self = this;
                self.offSendPhone = true;
                var down = function () {
                    self.countConf.number--;
                    self.countConf.showText = '重新获取(' + self.countConf.number + ')';
                    if (self.countConf.number < 0) {
                        clearInterval(self.countConf.timer);
                        self.countConf.number = 60;
                        self.countConf.showText = '重新获取';
                        self.offSendPhone = false;
                    }
||||||| .r9094
            replaceCode: function () {
                this.vCode.array = this.vCode.value.split('');
                while (this.vCode.array.length >= 6) {
                    this.vCode.array.push("");
=======
            verifyPhone: function () { //验证手机号码
                var self = this;
                if (validate.isPhone(self.phone)) {
                    self.isLegalPhone = true;
                    return;
                } else {
                    toast.showWarn("无效得手机号");
>>>>>>> .r9154
                }
<<<<<<< .mine
                down();
                this.countConf.timer = setInterval(down, 1000);
            },

            weiboLogin: function () {  //微博登陆
                var self = this;
                var url = window.location.href,
                    redirect = "";

                if (url.indexOf("redirect") !== -1) {  //若有redirect参数
                    redirect = self.getRedirect();
                    location.href = "/webapp/Account/WeiboLogin.html?redirect=" + redirect;
                    return;
                }
                location.href = "/webapp/Account/WeiboLogin.html?redirect=/WebApp/home/index.html";   // 无redirect，默认跳转到主页
            },
            // url地址处理
            getRedirect: function () {
                var url = window.location.href;
                var num = url.indexOf("redirect");
                var words = "?" + "redirect";
                var value = url.substring(num + words.length);
                return value;
            },
            dealRedirect: function () {
                var self = this;
                var url = window.location.href;
                if (url.indexOf("redirect") !== -1) {   //若有redirect参数
                    location.href = self.getRedirect();
                } else if (document.referrer) {   //无redirect，有历史记录，跳转到上一页
                    location.href = document.referrer;
                    return;
                } else {   // 无历史记录，跳转到主页
                    location.href = "/webapp/home/index.html";
                }
||||||| .r9094
=======
                self.isLegalPhone = false;
            },
            getCaptcha: function () { //获取验证码
                var self = this;
                if (self.isLegalPhone) { 
                    if (this.waitTime == 60) {
                        $.get("/WebApi/Phone/SendPhone", {
                            phone: self.phone
                        }, function (json) {
                            if (json.status == 1) {
                                toast.showSuccess("发送成功");
                                self.countdown();
                            } else {
                                toast.showSuccess(json.message);
                            }
                        }, "json");
                    }
                }
            },
            verifyCode: function () { //输入验证码后，登录框才可以点（登录框字体 由灰色变为白色 ）
                var self = this;
                if (self.identifyCode !== "" && self.isLegalPhone) {
                    self.islegal = true;
                    return;
                }
                self.islegal = false;
            },
            // url地址处理
            getRedirect: function () {
                var url = window.location.href;
                var num = url.indexOf("redirect");
                var words = "?" + "redirect";
                var value = url.substring(num + words.length);
                return value;
            },

            //登录成功后，实现 返回登录之前的页面
            dealRedirect: function () {
                var self = this;
                var url = window.location.href;
                if (url.indexOf("redirect") !== -1) {   //若有redirect参数
                    location.href = self.getRedirect();
                } else if (document.referrer) {   //无redirect，有历史记录，跳转到上一页
                    location.href = document.referrer;
                    return;
                } else {   // 无历史记录，跳转到主页
                    location.href = "/webapp/home/index.html";
                }
            },
            login: function () {
                var self = this;
                if (self.islegal) {
                    toast.showProgress("加载中");
                    $.post("/WebApi/Account/LoginByPhoneAndCode", {
                        Phone: self.phone,
                        Code: self.identifyCode,
                        platform: browser.isApple ? "iPhone" : "Android"
                    }, function (json) {
                        toast.hide();
                        if (json.status === 1) {
                            toast.showSuccess("登录成功");
                            self.dealRedirect();
                        } else if (json.code === "1002") {  //用户未注册  进入设置密码界面
                            self.isshowLogin = false;
                            self.isshowShuxinagLogin = false;
                            self.isshowFindPass = false;
                            self.isshowSetPass = true;
                            self.isRegister = false;
                        } else {
                            toast.showError(json.message);
                        }
                    }, "json");
                }
            },
            weiboLogin: function () {  //微博登陆
                var self = this;
                var url = window.location.href,
                    redirect = "";

                if (url.indexOf("redirect") !== -1) {  //若有redirect参数
                    redirect = self.getRedirect();
                    location.href = "/webapp/Account/WeiboLogin.html?redirect=" + redirect;
                    return;
                }
                location.href = "/webapp/Account/WeiboLogin.html?redirect=/WebApp/home/index.html";   // 无redirect，默认跳转到主页
            },

            //书香账号登录
            verifyNull: function () {
                var self = this;
                if ((self.userName && self.pass) || (self.pass && self.repass)) {
                    self.isComplete = true;
                    return;
                }
                self.isComplete = false;
            },
            showFindPass: function () {
                var self = this;
                self.isshowLogin = false;
                self.isshowShuxinagLogin = false;
                self.isshowFindPass = true;
            },
            loginShuxiang: function () {
                var self = this;
                //var url = window.location.href;
                if (self.isComplete) {
                    toast.showProgress("加载中");
                    $.post("/WebApi/Account/LoginByUserId", {
                        UserId: self.userName,
                        Password: self.pass,
                        IsRemeber: true,
                        platform: browser.isApple ? "iPhone" : "Android"
                    }, function (json) {
                        toast.hide();
                        if (json.status === 1) {
                            toast.showSuccess("登录成功");
                            self.dealRedirect();
                            //if (url.indexOf("redirect") !== -1) {  //若有redirect参数
                            //    location.href = self.getRedirect();
                            //} else if (document.referrer) {  //无redirect，有历史记录，跳转到上一页
                            //    location.href = document.referrer;
                            //    return;
                            //} else { // 无历史记录，跳转到主页
                            //    location.href = "/webapp/home/index.html";
                            //}
                        } else if (json.code === "1002") {  //用户未注册  进入设置密码界面
                            self.isshowLogin = false;
                            self.isshowShuxinagLogin = false;
                            self.isshowFindPass = false;
                            self.isshowSetPass = true;
                        } else {
                            toast.showError(json.message);
                        }
                    }, "json");
                }
            },

            //通过绑定的手机号找回
            next: function () {
                var self = this;
                if (self.islegal) {
                    $.get("/WebApi/Phone/ValidateCode", {
                        phone: self.phone,
                        code: self.identifyCode
                    }, function (json) {
                        console.log(json);
                        if (json.status == 1) {
                            if (json.data == false) {
                                toast.showError("验证码错误");
                            } else {  //进入设置密码界面
                                self.isshowLogin = false;
                                self.isshowShuxinagLogin = false;
                                self.isshowFindPass = false;
                                self.isshowSetPass = true;
                            }
                        } else {
                            toast.showError(json.message);
                        }
                    }, "json");
                }
            },

            //设置新密码
            setPass: function () {
                var self = this;
                if (self.pass != self.repass) {
                    toast.showError("密码不一样");
                } else {
                    var obj = {
                        Phone: self.phone,
                        Code: self.identifyCode,
                        Password: self.pass,
                        ConfirmPassword: self.repass,
                        channelId: tool.getAppId()
                    };
                    if ( !self.isRegister) { //未注册的  设置密码
                        $.post("/WebApi/Account/RegisterByPhone", obj, function (json) {
                            if (json.status === 1) {
                                toast.showSuccess("密码设置成功");
                                self.dealRedirect();
                            } else {
                                toast.showError(json.message);
                            }
                        }, "json");
                    } else {   // 已注册的  找回密码
                        $.post("/WebApi/Account/ResetPassword", obj, function (json) {
                            console.log(json);
                            if (json.status == 1) {
                                toast.showSuccess("密码修改成功");
                                setTimeout(function () {
                                    //跳转到 书香账号登录
                                    self.isshowLogin = false;
                                    self.isshowShuxinagLogin = true;
                                    self.isshowFindPass = false;
                                    self.isshowSetPass = false;
                                    self.pass = "";
                                }, 3000);
                            } else {
                                toast.showError(json.message);
                            }
                        }, "json");
                    }
                }
>>>>>>> .r9154
            }
        }
    });
    vm.$watch("phone", function (newVal, oldVal) {
        if (newVal.length > 10) {
            vm.verifyPhone();
        } else {
            vm.isLegalPhone = false;
        }
    });
    return vm;
});