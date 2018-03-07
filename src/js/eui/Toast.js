/*
 原因：（苹果不能用系统alert提示，因为它的框会显示域名。所以用下面这个）
 单页提示框
 Author: zhaolingli
 具体用法：
 let xx = toast.showText();
 text.show("xxxx");
 text.remove();

 @author 暖炉先生 （修改）
 show方法添加一个是否一直显示的参数 值为布尔值 ， 默认为false

 */
export function showText() {
    let toast = document.createElement( "div" );
    toast.style.cssText = "position: fixed;bottom: 120px;border-radius: 8px;background-color: rgba(51, 51, 51, 0.8);color: #f2f2f2;text-align: center;padding: 10px 15px;" +
        "font-size: 14px;text-align: center;transform: translateX(-50%);-ms-transform: translateX(-50%);-webkit-transform: translateX(-50%);left: 50%";

    let obj = {
        show: function ( msg, isAllShow ) {
            toast.innerHTML = msg;
            isAllShow && (toast.style.bottom = '50%');
            document.body.appendChild( toast );
            if ( !isAllShow ) {
                setTimeout( function () {
                    document.body.removeChild( toast );
                }, 3000 );
            }
        },
        hide: function () {
            document.body.removeChild( toast );
        }
    };
    return obj;
}
