define(['vue','jquery'], function (vue,jquery) {
    
    var vm = new vue({
        el: 'body',
        data: {
            // 登录进度
            LoginSchedule: 1,
            // 手机验证码
            vCode: {
                value: '',
                array: ['', '', '', '', '', '']
            }
        },
        ready: function () {
            
        },
        methods: {
            Focus: function () {
                this.$els.vcode.focus();
                alert();
            },
            insertCode: function () {
                console.log(this.vCode.value);
                this.replaceCode();
                
            },
            replaceCode: function () {
                this.vCode.array = this.vCode.value.split('');
                while (this.vCode.array.length >= 6) {
                    this.vCode.array.push("");
                }
            }
        }
    });

});