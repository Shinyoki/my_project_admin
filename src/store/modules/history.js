import router from "@/router";

const history = {
    state: {
        // 顶端栏的点击记录
        history: [{path: '/', name: '首页'}],
        // 面包屑内容
        breadList: [{name: '首页', path: '/', menuType: 1}],
        // 后端传回的菜单 缓存
        menus: [],
        // 生成的路由
        routes: [],
        // 侧边栏的开合状态
        isCollapsed: false
    },
    mutations: {
        // 重置添加历史记录
        refreshHistory(state) {
            state.history = [{path: '/', name: '首页'}]
            router.push({path: '/'})
        },
        // 添加历史记录
        addHistory(state, {path, name}) {
            // 查找是否重复，重复则啥也不做
            let index = state.history.findIndex((history) => history.path == path);
            if (index == -1) {
                state.history.push({path, name})
            } else {
                // ignored
            }
        },
        // 删除历史记录
        removeHistory(state, {path}) {
            let index = state.history.findIndex((history) => history.path == path);
            if (index != -1) {
                state.history.splice(index, 1)
            }
        },
        // 重置 菜单
        refreshMenus(state) {
            state.menus = [];
        },
        // 设置 菜单
        setMenus(state, menus) {
            state.menus = menus
        },
        // 重置 路由
        refreshRoutes(state) {
            state.routes = []
        },
        // 设置路由
        setRoutes(state, routes) {
            state.routes = routes
        },
        // 修改开合状态
        changeCollapse(state) {
            state.isCollapsed = !state.isCollapsed
        },
        // 重置面包屑
        refreshBreadList(state) {
            state.breadList = [{name: '首页', path: '/', menuType: 1}]
        },
        // 添加面包屑
        addBread(state, bread) {
            // 触发
            state.breadList.push(bread)
        },
        addBreadList(state, breads) {
            state.breadList.push(...breads)
        }
    },
    actions: {}
}

export default history;