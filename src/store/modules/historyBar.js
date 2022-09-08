import {getRequest} from "@/assets/js/utils/axios-api";
import router, {refreshRouter} from "@/router";

const historyBar = {
    state: {
        history: [{path: '/', name: '首页'}],
        menus: []
    },
    mutations: {
        // 重置添加历史记录
        refreshHistoryBar(state) {
            state.history = [{path: '/', name: '首页'}]
        },
        // 添加历史记录
        addHistory(state, {path, name}) {
            // 查找是否重复，重复则删掉之后的记录
            let index = state.history.findIndex((history) => history.path == path);
            if (-1 != index && index != state.history.length - 1) {
                // 存在，则删除
                state.history.splice(index + 1);
            } else {
                // 不存在，则添加
                state.history.push({path, name});
            }
        },
        // 删除历史记录
        removeHistory(state, {path}) {
            let index = state.history.findIndex((history) => history.path == path);
            if (-1 != index) {
                // 存在，则删除
                state.history.splice(index);
            }
        },
        // 重置 菜单
        refreshMenus(state) {
            state.menus = [];
        },
        // 设置 菜单
        setMenus(state, menus) {
            state.menus = menus
        }
    },
    actions: {
        // 加载菜单&路由
        loadRoutes(state) {
            return new Promise((resolve) => {
                getRequest("/admin/menus").then(res => {
                    if (res.data.flag) {
                        // 清空路由
                        refreshRouter();
                        // 清空历史记录
                        state.commit("refreshHistoryBar")
                        // 清空菜单
                        state.commit("refreshMenus");
                        // 获取路由成功
                        let menus = res.data.data;
                        // 添加路由
                        addRoutes(menus)
                        router.addRoute({
                            path: '*',
                            redirect: '/404',
                            component: resolve => require(['@/views/Global404.vue'], resolve),
                            meta: {
                                title: '404',
                            }
                        })
                        // 添加菜单
                        state.commit("setMenus", menus);
                    }
                    resolve(res);
                })
            });
        },
    }
}

function addRoutes(menus) {

    // 遍历菜单，添加路由
    return menus.forEach(menu => {

        let route = {
            path: menu.path,
            name: menu.name,
            component: loadView(menu.component),
            meta: {
                title: menu.name,
            }
        }
        if (menu.children && menu.children.length > 0) {
            route.children = addRoutes(menu.children);
        }
        // 添加路由
        router.addRoute(route);
        return route;
    })

}


export const loadView = view => {
    // 路由懒加载
    if (view == "Layout") {
        return resolve => require([`@/views/home/index.vue`], resolve);
    }
    return resolve => require([`@/views${view}.vue`], resolve);
};

export default historyBar;