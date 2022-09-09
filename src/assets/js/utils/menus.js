import router from "@/router";
import {getRequest} from "@/assets/js/utils/axios-api";
import Layout from "@/layout";
import store from "@/store"
import Vue from "vue"

export function generateMenus() {
    getRequest("/admin/menus").then(res => {
        if (res.data.flag) {

            // 清空菜单
            store.commit("refreshMenus");

            // 获取成功
            let menus = res.data.data;
            // 添加菜单
            store.commit("setMenus", menus);
            // 添加路由
            let routes = buildRoutes(menus);
            // router.addRoutes(routes);
            router.addRoute({
                path: '*',
                redirect: '/404',
                component: resolve => require(['@/views/Global404.vue'], resolve),
                meta: {
                    title: '404',
                }
            });
            store.commit("setRoutes", routes)

        } else {

            Vue.prototype.$message.error(res.data.message);
            router.push({path: '/login'})

        }
    })
}

function buildRoutes(menus) {

    let newRoutes = [];
    // 遍历菜单，添加路由
    menus.forEach(menu => {

        // 让category的Component为Layout，之后遍历树的所有节点，将menu设置为Layout的children
        let route = {
            path: menu.path,
            name: menu.name,
            component: loadView(menu),
            children: [],
            meta: {
                title: menu.name,
            }
        };
        if (menu.children && menu.children.length > 0) {
            let child = findChildrenRoutes(menu.children);
            console.log(child)
            route.children.push(...child);
        }
        // 添加路由
        router.addRoute(route);
        newRoutes.push(route);

    })
    return newRoutes;

}

function findChildrenRoutes(routes) {
    let res = [];
    routes.forEach(item => {
        if (isMenu(item)) {
            let route = {
                name: item.name,
                path: item.path,
                component: loadView(item),
                meta: {
                    title: item.name
                }
            }
            console.log(route)
            res.push(route);
        } else {
            if (item.children != null && item.children.length > 0) {
                res.push(...findChildrenRoutes(item.children));
            }
        }
    })
    return res;
}

function isMenu(menu) {
    return menu.menuType === 1;
}

export const loadView = view => {
    // 路由懒加载
    if (view.component == "Layout") {
        return Layout;
    }
    return resolve => require([`@/views${view.component}.vue`], resolve)
};