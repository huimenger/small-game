define( [
	"jquery" ,
	"vue" ,
	"store" ,
	"text!components/template/ReadFooter.html" ,
	"commons/Browser" ,
	"commons/Download" ,
	"commons/StatisticsTool" ,
	"commons/Config"
] , function ( $ , vue , store , tpl , browser , down , stat , config ) {
	var component = vue.extend( {
		data : function () {
			return {
				isShowAnyDownload : config.isShowDownload( stat.getAppId() ) ,
				isShowSetting : false ,
				isShowOffline : false ,
				isShowFooter : false ,
				isShowDownload : false ,
				currentTheme : 1 ,
				loadMode : 0 ,
				fontSize : 18
			};
		} ,
		template : tpl ,
		ready : function () {
			var self = this;
			this.setFontSize( store.get( "ReadFontSize" ) ? store.get( "ReadFontSize" ) : 18 );
			this.setTheme( store.get( "ReadTheme" ) ? store.get( "ReadTheme" ) : 1 );
			this.setLoadMode( !!store.get( "ChapterLoadMode" ) ? store.get( "ChapterLoadMode" ) : 0 );
		} ,
		methods : {
			toggleSetting : function ( event ) {
				this.isShowSetting = !this.isShowSetting;
				this.isShowOffline = false;
			} ,
			showFooter : function () {
				this.isShowOffline = false;
				this.isShowSetting = false;
				this.isShowFooter = true;
			} ,
			hideFooter : function () {
				this.isShowOffline = false;
				this.isShowSetting = false;
				this.isShowFooter = false;
			} ,
			hideDownload : function () {
				this.isShowDownload = false;
			} ,
			showDownload : function () {
				if ( !config.isShowFloatFooter( stat.getAppId() ) ) {
					this.isShowDownload = false;
					return;
				}
				if ( this.isShowFooter ) {
					return;
				}
				this.isShowDownload = true;
			} ,
			toggleOffline : function ( event ) {
				this.isShowOffline = !this.isShowOffline;
				this.isShowSetting = false;
			} ,
			// 设置字体大小
			setFontSize : function ( size ) {
				this.fontSize = size;
				
				// 持久化保存字体大小
				store.set( "ReadFontSize" , size );
				this.$dispatch( "changeFont" , this.fontSize );
			} ,
			setTheme : function ( index ) {
				this.currentTheme = index;
				
				// 持久化保存主题
				store.set( "ReadTheme" , index );
				this.$dispatch( "changeTheme" , index );
			} ,
			setLoadMode : function ( mode ) {
				this.loadMode = mode;
				store.set( "ChapterLoadMode" , mode );
				this.$dispatch( "changeLoadMode" , mode );
			} ,
			
			// 下载客户端
			download : function () {
				console.log("离线阅读");
				window._czc.push( [ "_trackEvent" , "点击下载" , stat.getAppId() , "离线阅读" ] );
				down.download();
			} ,
			download2 : function () {
				console.log("阅读广告条");
				window._czc.push( [ "_trackEvent" , "点击下载" , stat.getAppId() , "阅读广告条" ] );
				down.download();
			} ,
			preload : function () {
				this.$dispatch( "preloadChapter" );
			} ,
			prevChapter : function () {
				this.$dispatch( "prevChapter" );
			} ,
			nextChapter : function () {
				this.$dispatch( "nextChapter" );
			} ,
			showIndex : function () {
				this.$dispatch( "showIndex" );
			}
		}
	} );
	vue.component( "read-footer" , component );
	return component;
} );
