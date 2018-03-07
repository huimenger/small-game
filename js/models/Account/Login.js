define([
    'vue', 'jquery',
    'Eui/Toast',
    'commons/Browser',
    'models/Home/App/Header',
    'models/Home/App/Footer',
    'models/Home/App/ActionBar',
    'commons/Validate',
    'commons/StatisticsTool',
    'commons/Send'
], function (vue, $, toast, browser, header, footer, actionbar, validate, tool,send) {
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
                    (event.target.className.indexOf('KeyBoard') != -1) && self.hide();
                }
                this._el.ontouchmove = function () {
                    sMove = true;
                }
                this._el.ontouchend = function (event) {
                    if (sMove) return;
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
                    this._item[i].ontouchend = function (event) {
                        self.key(this.getAttribute('key'));
                        event.preventDefault();
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
    var vm = new vue({
        el: "body",
        components: {
            'app-header': header,
            'app-footer': footer,
            'app-actionbar': actionbar
        },
        data: {
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
            },
            // 登录进度
            LoginSchedule: 1,
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
        },
        ready: function () {
            this.setAction();
            // 自定义键盘
            this.KeyBoard();
            this.setCenter();
        },
        methods: {
            countWidth: function (size, spacing, str, maxWidth) {
                return (function (span) {
                    var len;
                    var old =  document.getElementById('TextAlignTest');
                    if (old) {
                        old.style.fontSize = size + 'px';
                        old.innerHTML = str;
                        len = old.offsetWidth;
                    } else {
                        span.style.cssText = 'letter-spacing:' + spacing + 'px;max-width:' + maxWidth + ';font-size:' + size + 'px;display:inline-block;height:0px;overflow:hidden;position:absolute;left:0;top:0;z-index:-1;';
                        span.id = 'TextAlignTest';
                        span.innerHTML = str;
                        document.body.appendChild(span);
                        len = span.offsetWidth;
                    }
                    return len === 0 ? '' : len > maxWidth ? maxWidth : len;
                })(document.createElement('span'));
            },
            setCenter: function () {
                var self = this;
                var fontSize, spacing;

                $('[text-align="center"]').focus(function () {
                    fontSize = parseInt($(this).css('font-size'));
                    spacing = parseInt($(this).css('letter-spacing'));
                    var This = this;
                    if ($(This).val().length !== 0) {
                        $(This).css('text-align', 'center').css('width', '');
                    } else {
                        $(This).css('text-align', 'left').css('width', self.countWidth(fontSize, spacing, $(This).attr('placeholder'), $(This).parent()[0].clientWidth));
                    }
                })
                .on('input', function () {
                    var This = this;
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function () {
                        if ($(This).val().length !== 0) {
                            $(This).css('text-align', 'center').css('width', '');
                        } else {
                            $(This).css('text-align', 'left').css('width', self.countWidth(fontSize, spacing, $(This).attr('placeholder'), $(This).parent()[0].clientWidth));
                        }
                    },10);
                });
            },
            KeyBoard: function () {
                var self = this;
                self.Board = KeyBoard({
                    el: '#insert',
                    group: function () {
                        return self.$els.phonelogin.getElementsByTagName('span');
                    },
                    callback: function (value) {
                        if (self.LoginSchedule === 1) {
                            if (value.length === 6) {
                                self.code = value;
                                this.hide();
                                self.login();
                            }
                        }
                    }
                }).init();
            },
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
            },
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
                toast.showProgress('正在登录');

                $.post("/WebApi/Account/LoginByUserId", {
                    UserId: self.account,
                    Password: self.password,
                    IsRemeber: true,
                    platform: browser.isApple ? "iPhone" : "Android"
                }, function (json) {
                    toast.hide();
                    if (json.status === 1) {
                        toast.showSuccess("登录成功");
                        self.dealRedirect(json);
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
                        self.dealRedirect(json);
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
                        self.dealRedirect(json);
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
                }
                down();
                this.countConf.timer = setInterval(down, 1000);
            },
            // url地址处理
            getRedirect: function () {
                var url = window.location.href;
                var num = url.indexOf("redirect");
                var words = "?" + "redirect";
                var value = url.substring(num + words.length);
                return decodeURIComponent(value);
            },
            dealRedirect: function (json) {
                send.set.user(json.data);
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
            weiboLogin: function () {  //微博登陆
                var self = this;
                var url = window.location.href,
                    redirect = encodeURIComponent(self.getRedirect());
                if (url.indexOf("redirect") !== -1) {  //若有redirect参数
                    location.href = "/webapp/Account/WeiboLogin.html?redirect=" + redirect;
                    return;
                }
                location.href = "/webapp/Account/WeiboLogin.html?redirect=/webapp/home/index.html";   // 无redirect，默认跳转到主页
            }
        }
    });
    return vm;
});