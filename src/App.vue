<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {generateMenus} from "@/assets/js/utils/menus";

// import Layout from "@/layout";
// import Setting from "@/views/setting/Setting";

export default {
  name: 'App',
  created() {
    generateMenus();
    // let route = {
    //   name: '首页',
    //   path: '/',
    //   component: Layout,
    //   children: [
    //     // {
    //     //   name: '日志',
    //     //   path: '/log',
    //     //   component: null,
    //     //   children: [
    //         {
    //           name: '操作日志',
    //           path: '/optLog',
    //           component: resolve => require(['@/views/log/OptLog.vue'], resolve)
    //         },
    //     {
    //       name: '登录日志',
    //       path: '/loginLog',
    //       component: resolve => require(['@/views/log/LoginLog.vue'], resolve)
    //     }
    //       // ]
    //     // }
    //   ]
    // }
    // console.log("添加前")
    // console.log(this.$router.getRoutes())
    // // this.$router.addRoute(route)
    // console.log("添加后")
    // console.log(this.$router.getRoutes())
  },
  methods: {}
}
</script>
