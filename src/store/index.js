import Vue from 'vue'
import Vuex from 'vuex'
// vuex 的持久化策略插件，防止刷新页面后vuex数据丢失
import vuexPersistedstate from "vuex-persistedstate";
// 导入自定义模块
import user from "@/store/modules/user";
import historyBar from "@/store/modules/historyBar";
import getters from "@/store/getters";

Vue.use(Vuex)

export default new Vuex.Store({
    // 模块化不同组的数据
    modules: {
        user,
        historyBar
    },
    // 简化获取操作
    getters,
    plugins: [
        vuexPersistedstate({
            storage: window.localStorage
        })
    ]
})
