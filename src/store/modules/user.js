import {getToken, removeToken, setToken} from "@/assets/js/utils/token-util";
import {postRequest} from "@/assets/js/utils/axios-api";
import axios from "axios";

const user = {
    state: {
        username: '',
        nickname: '',
        avatar: '',
        email: '',
        roles: null,
        token: getToken()
    },
    // 同步 commit
    mutations: {
        // 设置用户名
        setUsername: (state, username) => {
            state.username = username
        },
        // 设置头像
        setAvatar: (state, avatar) => {
            state.avatar = avatar
        },
        // 设置TOKEN
        setToken: (state, token) => {
            state.token = token
        },
        // 清除缓存
        logout: (state) => {
            state.username = ''
            state.nickname = ''
            state.avatar = ''
            state.email = ''
            state.token = ''
            state.roles = null
            state.isCollapsed = false
            state.breadList = [{name: '首页', path: '/', menuType: 1}]
            state.history = [{path: '/', name: '首页'}]
            state.menus = []
            state.routes = []
            removeToken();
        },
        // 登录
        doLogin: (state, userInfo) => {
            console.log("得到的信息", userInfo)
            state.avatar = userInfo.avatar
            state.username = userInfo.username
            state.nickname = userInfo.nickname
            state.token = userInfo.token
            state.roles = userInfo.roles
            state.email = userInfo.email
            setToken(userInfo.token)
        },
        // 更新用户头像
        updateUserAvatar: (state, avatarAddress) => {
            state.avatar = avatarAddress;
        },
        updateUserInfo: (state, userInfo) => {
            state.username = userInfo.username
            state.nickname = userInfo.nickname
            state.email = userInfo.email
            state.avatar = userInfo.avatar
        }
    },
    // 异步 dispatch
    actions: {
        // 登录
        doLogin(state, loginForm) {
            const data = {
                username: loginForm.username.trim(),
                password: loginForm.password
            }
            const headers = {
                requireToken: false
            }
            // 异步方法，要返回一个Promise对象
            return new Promise((resolve, reject) => {
                axios.post("/api/login", data, {headers: headers})
                    .then(res => {
                        if (res.data.flag) {
                            // 清除缓存
                            state.commit("logout");
                            // 修改
                            state.commit('doLogin', res.data.data)
                        }
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        // 登出
        doLogout(state) {
            return new Promise((resolve, reject) => {
                postRequest("/logout")
                    .then(res => {
                        if (res.data.flag) {
                            // 清空历史记录
                            state.commit("refreshHistory")
                            // 清空菜单
                            state.commit("refreshMenus")
                            // 提交登出请求
                            state.commit("logout");
                        }
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
    }
}


export default user;