import {getToken, removeToken, setToken} from "@/assets/js/utils/token-util";
import {postRequest} from "@/assets/js/utils/axios-api";
import {refreshRouter} from "@/router";
import axios from "axios";

const user = {
    state: {
        username: '',
        avatar: '',
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
            state.avatar = ''
            state.token = ''
            state.roles = null
            removeToken();
        },
        // 登录
        doLogin: (state, userInfo) => {
            state.avatar = userInfo.avatar
            state.username = userInfo.nickname
            state.token = userInfo.token
            state.roles = userInfo.roles
            setToken(userInfo.token)
        },

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
        logout(state) {
            return new Promise((resolve, reject) => {
                postRequest("/logout")
                    .then(res => {
                        if (res.data.flag) {
                            // 清空路由
                            refreshRouter();
                            // 清空历史记录
                            state.commit("refreshHistoryBar")
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