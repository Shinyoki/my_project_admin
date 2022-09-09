
const history = {
    state: {
        history: [{path: '/', name: '首页'}],
        menus: [],
        routes: [],
    },
    mutations: {
        // 重置添加历史记录
        refreshHistory(state) {
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
        },
        // 重置 路由
        refreshRoutes(state) {
            state.routes = []
        },
        // 设置路由
        setRoutes(state, routes) {
            state.routes = routes
        },
    },
    actions: {

    }
}

export default history;