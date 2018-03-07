/**
 * 资源预加载（待完善）
 * @author 暖炉先生
 * 使用方法 ：
 *          new ResLoader({
                baseUrl: { String },                  //[可选]资源相对路径   [当路径为http开头则忽略该配置]
                res: { Array },                       //资源数组            理论上必传
                onProgress: { Function },             //[可选]资源加载中调用       接收参数 ( curIndex(当前的索引) , total )
                onComplete: { Function },             //[可选]资源加载完成调用     接收参数  (total )
                defaultLoading: { DomSelect },        //[可选]是否启用默认加载样式，0-100的数字累加  值为一个选择器名
*          })
 */

/**
 * 当前运行状态
 * @type {{ON_READY: number, ON_GOING: number, ON_COMPLETE: number}}
 */
const STATUS = {
    //正在准备阶段
    ON_READY: 0,
    //加载中阶段
    ON_GOING: 1,
    //加载完成阶段
    ON_COMPLETE: 2,
}

export default class Preload {
    constructor( props ) {
        console.log( props );
        this.config = Object.assign( {
            baseUrl: '',
            res: [],
        }, props );
        this.init();
    }

    init() {
        let me = this;
        //设置当前状态为准备阶段
        me.status = STATUS.ON_READY;
        //设置总的资源数
        me.total = me.config.res.length;
        //设置当前资源的加载数
        me.currentIndex = 0;
        //加载失败的数量
        me.fialedCont = 0;
        //所有实例化后的资源
        me.allResource = [];
        //设置最大失败次数
        me.maxFialedCont = 5;
        me.num = 0;
    }

    onStart() {
        let me = this,
            res = me.config.res,
            baseUrl = me.config.baseUrl;
        //设置状态为进行中
        me.status = STATUS.ON_GOING;
        for ( let i = 0; i < me.total; i++ ) {
            let _res = baseUrl + res[ i ];
            me._loadRes( _res );
        }
    }
    /**
     * 加载资源
     * @param res 加载的当前资源文件路径
     */
    _loadRes( res, resEvent, e ) {
        //获取文件后缀名
        let me = this,
            _res = null,
            mimeType = (/\.[^\.]+$/.exec( res )[ 0 ]).toLowerCase(),
            type = {
                images: [ '.jpg', '.jpeg', '.gif', '.png', '.bmp' ],
                audio: [ '.mp3', '.midi', '.wma', '.ogg' ],
                video: [ '.mp4', '.swf', '.flv', '.avi' ],
            };
        if ( !resEvent ) {
            let getType = me._getMimeType( mimeType, type );

            if ( !getType ) {
                return me._showError( '不支持次资源类型，或资源链接出错，链接地址为：' + res );
            }

            switch ( getType ) {
                case 'images' :
                    _res = new Image();
                    break;
                case 'audio' :
                    _res = new Audio();
                    break;
                case 'video' :
                    _res = new Video();
                    break;
            }
            //设置当前类型
            _res.type = getType;
            _res.id = me._setId( me.allResource );
            //设置当前加载次数
            _res.loadCont = 1;
            _res.src = res;
        } else {
            e.path[ 0 ].src = res;
            _res = resEvent;
        }
        //当前资源怒加载完成
        _res.onload = () => {
            me._loaded( _res );
        };
        _res.onerror = ( e ) => {
            if ( _res.fialedCont <= me.maxFialedCont ) {
                _res.loadCont++;
                me._loadRes( e.path[ 0 ].src, _res, e )
            } else {
                me.fialedCont++;
                me._loaded( _res );
            }
        };
        me.allResource.push( _res );
    }

    _loaded() {
        let me = this;
        me.config.onProgress && me.config.onProgress( ++me.currentIndex, me.total );
        let loadDom = this.config.defaultLoading;
        if ( loadDom ) {
            me._addNumber( me.currentIndex, me.total, loadDom, me )
        }

        //加载完成
        if ( me.currentIndex === me.total && !loadDom ) {
            me.status = STATUS.ON_COMPLETE;
            me.config.onComplete && me.config.onComplete( me.total );
        }
    }

    /**
     * 数字累加
     * @param current
     * @param total
     * @param dom
     * @param self
     * @private
     */
    _addNumber( current, total, dom, me ) {
        let curMax = ((current / total).toFixed( 2 )) * 100;
        me.num++;
        document.querySelectorAll( dom )[ 0 ].innerHTML = "加载中：" + me.num + "%";
        if ( me.num < curMax ) {
            setTimeout( function () {
                me._addNumber( current, total, dom, me );
            }, 25 )
        } else {
            if ( me.num >= 100 ) {
                me.status = STATUS.ON_COMPLETE;
                me.config.onComplete && me.config.onComplete( me.total );
            }
        }
    }

    /**
     * 获取当前资源的类型
     * @param str    被判断后缀名的字符串
     * @param type   判断什么类型的对象
     */
    _getMimeType( str, type ) {
        for ( let key in type ) {
            let _t = type[ key ];
            for ( let i = 0; i < _t.length; i++ ) {
                if ( _t[ i ] === str ) {
                    return key;
                }
            }
        }
        return false;
    }

    /**
     * 抛出错误
     * @param str
     * @private
     */
    _showError( str ) {
        try {
            throw new Error( str );
        } catch ( e ) {
            console.log( e );
        }
    }

    /**
     * 给资源设置一个id
     * @param allResource 当前所有资源
     * @return {number}
     */
    _setId( allResource ) {
        return allResource.length++;
    }
}
