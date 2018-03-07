define([
    'vue',
    'libs/vue-router.min',
    "models/Home/App/App",
    'models/Home/App/Index',
    'models/Home/App/Rank',
    'models/Home/App/Category',
    'models/Home/App/Recharge',
    'models/Home/App/BookShelf',
    'models/Home/App/Timeline',
    'models/Home/App/Vouchers',
    'models/Home/App/VouchersDetails',
    'models/Home/App/Consume'
], function (
    Vue,
    VueRouter,
    App,
    Index,
    Rank,
    Category,
    Recharge,
    BookShelf,
    Timeline,
    Vouchers,
    VouchersDetails,
    Consume
   ) {
    // 声明路由
    Vue.use(VueRouter);
    // 实例化
    var router = new VueRouter({
        hashbang: false
    });

    // 配置路径
    router.map({
        /* 书架 */
        '/BookShelf': {
            component: BookShelf
        },
        "/Timeline": {
            component: Timeline
        },
        '/Vouchers/details': {
            component: VouchersDetails
        },
        /* 代金券 */
        "/Vouchers": {
            component: Vouchers
        },
        /* 账单 */
        "/Consume/:current": {
            component: Consume
        },
        '/': {
            component: App,
            subRoutes: {
                /* 排行榜 */
                '/Rank': {
                    component: Rank
                },
                /* 分类 */
                '/Category': {
                    component: Category
                },
                /* 充值 */
                '/Recharge': {
                    component: Recharge
                },
                /* 首页 */
                '/': {
                    component: Index,
                    bgClass: "Boy"
                }
            }
        }
    });

    // 运行
    router.start(Vue.extend({}), 'body');
    return router;
});