import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router";

Vue.use( VueRouter );

// 开启debug模式
Vue.config.debug = true;

// 路由配置
let router = new VueRouter( {
	hashbang: false
} );

router.map( routes );
router.redirect( {
	'*': "/"
} );

router.start( Vue.extend( {} ), "#app" );