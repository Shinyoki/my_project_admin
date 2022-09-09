import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routes = [
    {
        name: '主页',
        path: '/',
        component: resolve => require(['@/layout/index.vue'], resolve),
        children: [
            {
                path: '/',
                name: '主页',
                component: resolve => require(['@/views/home/index.vue'], resolve),
            }
        ],
        meta: {
            title: '首页',
            tokenNeeded: true
        }
    },
    {
        name: '登录',
        path: '/login',
        component: resolve => require(['@/views/login/LoginView.vue'], resolve),
        meta: {
            title: '登录',
            tokenNeeded: false
        }
    }
]

let rawPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(locaition) {
    // 防止连续点击多次路由报错
    return rawPush.call(this, locaition)
        .catch(err => err)
};


const newRouter = () => new VueRouter({
    routes,
    mode: 'history'
})

/**
 * 创建新的Vue Router
 * @returns {VueRouter}
 */
export function refreshRouter() {
    const newRouter = newRouter()
    router.matcher = newRouter.matcher
}

const router = newRouter()

export default router
