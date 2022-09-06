<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {getToken} from "@/assets/js/utils/token-util";
export default {
  name: 'App',
  created() {

  },
  methods: {
    checkValid() {
      var token = getToken();
      if (this.$route.name != '登录' && token && token.trim().length > 0) {
        // token 存在，校验token是否有效
        let data = {
          token: token
        }
        let header = {
          ignoreToken: true
        }
        this.postRequest("validToken", data, header).then(res => {
          if (res.data.code == 4001) {
            // token 无效，友好提示是否要跳转
            this.$confirm('检测到您的登录状态已过期，是否要重新登录？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push({name: '登录'})
            })
          }
        })
      }
    },
  }
}
</script>
