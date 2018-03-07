import BookShelf from "./views/book-shelf.vue";
import Recharge from "./views/recharge.vue";
import Index from "./views/index.vue";
import HomeLayout from "./layouts/home-layout.vue";

export default {
	"/bookShelf": {
		component: BookShelf
	},
	"/": {
		component: HomeLayout,
		subRoutes: {
			"/recharge": {
				component: Recharge
			},
			"/": {
				component: Index
			}
		}
	}
}
