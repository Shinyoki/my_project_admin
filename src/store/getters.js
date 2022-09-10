const getters = {
    nickname: state => state.user.username,
    avatar: state => state.user.avatar,
    roles: state => state.user.roles,
    token: state => state.user.token,
    history: state => state.history.history,
    menus: state => state.history.menus,
    routes: state => state.history.routes,
    isCollapsed: state => state.history.isCollapsed,
    breadList: state => state.history.breadList
}

export default getters