import {getToken, setToken} from "@/assets/js/utils/token-util";
import {postRequest} from "@/assets/js/utils/axios-api";

const user = {
    state: {
        username: '',
        avatar: '',
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
                ignoreToken: true
            }
            // 异步方法，要返回一个Promise对象
            return new Promise((resolve, reject) => {
                postRequest("/login", data, headers)
                    .then(res => {
                        if (res.data.flag) {
                            // 修改Cookie的Token
                            setToken(res.data.data);
                            // 修改状态的Token
                            state.commit("setToken", res.data.data);
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