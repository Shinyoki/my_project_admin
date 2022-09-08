const getters = {
    nickname: state => state.user.username,
    avatar: state => state.user.avatar,
    roles: state => state.user.roles,
    token: state => state.user.token,
    history: state => state.history.historyBar,
    menus: state => state.history.menus
}

export default getters