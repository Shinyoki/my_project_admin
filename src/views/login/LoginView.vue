<template>
  <div class="back_container">
    <div class="right_view">
      <el-card
          id="login_card"
          class="animate__animated animate__bounceInRight"
      >
        <div style="margin: 30px 0;font-size: 1.3rem; text-align: center">
          <i class="el-icon-user-solid"/>
          <strong> 登录</strong>
        </div>
        <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="myForm"
        >
          <el-form-item prop="username" style="margin: 20px 0;">
            <el-input
                prefix-icon="el-icon-user"
                v-model="loginForm.username"
                placeholder="用户名"
                clearable
                @keyup.enter.native="login"
            />
          </el-form-item>
          <el-form-item prop="password" >
            <el-input
                prefix-icon="el-icon-lock"
                v-model="loginForm.password"
                placeholder="密码"
                clearable
                show-password
                @keyup.enter.native="login"
            />
          </el-form-item>

          <el-form-item style="display: flex; flex-direction: row-reverse">
            <el-button
                type="primary"
                @click="login"
                style="margin-right: 20px"
                :loading="loading"
            >提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {generateMenus} from "@/assets/js/utils/menus";
import store from "@/store";
import {getToken, removeToken} from "@/assets/js/utils/token-util";

export default {
  name: 'LoginView',
  created() {
  },
  mounted() {
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      loginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 登录
    login() {
      this.$refs.myForm.validate((valid) => {
        if (valid) {

          this.loading = true
          this.$store.dispatch("doLogin", this.loginForm).then(res => {
            this.loading = false
            if (res.data.flag) {

              // 登录成功，设置路由等信息
              // 清空历史记录
              store.commit("refreshHistory");
              generateMenus()

              // push到主页
              this.$router.push({path: '/'})

            } else {
              if (getToken()) {
                removeToken();
              }
              this.$message.error(res.data.message);
            }

          }).catch(() => {
            this.loading = false;
          })
        } else {
          this.$notify({
            type: 'error',
            title: '错误',
            message: '请完整填写需要输入的内容',
          })
          return false
        }
      })
    },
  },
  computed: {},
}
</script>

<style scoped>
.back_container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url(https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/wenzhangliebiao.jpg) center center / cover no-repeat;
}

.right_view {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F2F3F4;

  box-shadow: 0 0 103px #fff;
}

#login_card {
  min-width: 400px;
  border-radius: 10px;
  box-shadow: 0 0 103px #fff;
}
</style>