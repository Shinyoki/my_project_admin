import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局样式
import "@/assets/css/global.css"
// 引入animate css
import 'animate.css'
// 引入Element ui  & 样式
import ElementUI, {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// Axios & plugin
import Axios from "axios"
import VueAxios from "vue-axios";
// 加载进度条
import NProgress from "nprogress"
import "nprogress/nprogress.css"
// 自定义API
import {getRequest, postRequest, putRequest, deleteRequest} from "@/assets/js/utils/axios-api";
// 自定义配置
import myConfig from "@/assets/js/myConfig"
// dayJS
import dayjs from "dayjs";
// Cookie API
import {getToken} from "@/assets/js/utils/token-util";
// iconfont
import "./assets/css/iconfont/iconfont.css"

/**
 * Router跳转
 */
router.beforeEach((to, from, next) => {
    NProgress.start();
    var token = getToken();
    if (to.path == '/login') {
        // 有token则直接访问
        next();
    } else if (token == null) {
        // 无token则跳转到登录页
        next('/login');
    }

    next();
});
router.afterEach((to) => {
    window.document.title = to.meta.title || myConfig.defaultTitle;
    NProgress.done();
});

/**
 * Axios 请求拦截器
 */
Axios.defaults.headers['Content-Type'] = "application/json;charset=utf-8"
Axios.interceptors.request.use(
    // 原始发送
    config => {
        // 是否需要携带TOKEN
        const requireToken = (config.headers || {}).requireToken === false
        if (getToken() && !requireToken) {
            // 从cookie中获取Token
            config.headers["Authorization"] = getToken()
        }

        // 进度条开始加载
        NProgress.start();
        return config;
    },
    // 错误发送
    error => {
        console.debug("Axios.interceptors.request.use error: ", error);
        return Promise.reject(error);
    }
)

function handleError(status, message) {
    if (myConfig.isDebugMode) {
        Message({
            dangerouslyUseHTMLString: true,
            message: `<strong style="color: red">触发错误：</strong><br/><div>${message}</div>`
        })
    }
    if (status == 401) {
        // 未登录
        store.dispatch("clearLoginUserCache").then(() => {
            router.push({name: '/login'});
        });
    } else if (status == 404) {
        // 404
        router.push("/404");
    }
}

Axios.interceptors.response.use(
    // 响应回调
    function (response) {
        NProgress.done();
        if (response.data.flag) {
            // 响应为 true， 一切正常
        } else if (response.data.flag != undefined && response.data.flag == false) {
            // 请求失败
            handleError(response.status, response.data.message);
        }

        return response;
    },
    // 错误处理
    function (error) {
        NProgress.done();
        handleError(error.status, error.message);
        return Promise.reject(error);
    });

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAxios, Axios)
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.myConfig = myConfig

/**
 * dayJs 实现的过滤器
 * 使用方法 {{ dateStr | date }}
 */
Vue.filter("date", (dateStr, format = "YYYY-MM-DD") => {
    return dayjs(dateStr).date(format);
})
Vue.filter("dateTime", (dateStr, format = "YYYY-MM-DD HH:mm:ss") => {
    return dayjs(dateStr).date(format);
});
Vue.filter("time", (dateStr, format = "HH:mm:ss") => {
    return dayjs(dateStr).date(format);
});

new Vue({
    // this.$router
    router,
    // this.$store
    store,
    render: h => h(App)
}).$mount('#app')
