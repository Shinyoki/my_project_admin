import router from "@/router";
import {getRequest} from "@/assets/js/utils/axios-api";
import Layout from "@/layout";
import store from "@/store"
import Vue from "vue"

export function generateMenus() {
    getRequest("/admin/user/menus").then(res => {
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

        // 设置顶层菜单
        let route = {
            path: menu.path,
            name: menu.name,
            component: Layout,
            children: [],
            meta: {
                title: menu.name,
            }
        };
        addChildForTopMenu(menu, route);
        if (menu.children && menu.children.length > 0) {
            let child = findChildrenRoutes(menu.children);
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
            };
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

function addChildForTopMenu(menu, route) {
    if (menu.component != "Layout") {
        // 没有表明自己是Layout，说明自己是正儿八经的菜单，于是将自己的组件注册为child
        let child = {
            name: menu.name,
            path: menu.path,
            component: resolve => require([`@/views${menu.component}.vue`], resolve),
            meta: {
                title: menu.name
            }
        }
        route.children.push(child)
    }
}

/**
 * 将tb_menu的字段转换成树形结构
 * @param data          字段集合
 * @param id            字段的id名      默认id
 * @param parentId      字段的父id名    默认为parentId
 * @param children      字段的子集合名   默认'children'
 * @returns {*[]}
 */
export function handleTree(data, id, parentId, children) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap = {};   // 存放所有的子集合
    var nodeIds = {};           // 存放所有的节点
    var tree = [];              // 存放最终的树形结构

    // 遍历所有节点，将所有子节点放入childrenListMap
    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            // 如果没有父节点，那么就是根节点
            childrenListMap[parentId] = [];
        }
        // 将当前节点放入父节点的子集合中
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    // 遍历所有节点，将所有子节点放入父节点的childrenList中
    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    // 递归设置子节点
    for (let t of tree) {
        adaptToChildrenList(t);
    }

    // 递归设置子节点
    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }

    return tree;
}