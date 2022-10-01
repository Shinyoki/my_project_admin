<template>
  <div class="main-container">
    <el-tabs type="border-card">
      <el-tab-pane label="修改信息">
        <div class="user-info-container animate__animated animate__fadeIn">
          <!--          用户头像-->
          <el-row>
            <el-col
                :span="24"
                class="left-container"
            >
              <el-upload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
              >
                <el-image
                    v-if="$store.getters.avatar"
                    :src="$store.getters.avatar"
                    fit="fill"
                    class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="right-container">
              <el-form
                  :model="userInfoForm"
                  ref="userInfoForm"
                  :rules="rules"
                  label-width="110px"
              >
                <el-form-item label="用户昵称" prop="nickname">
                  <el-input v-model="userInfoForm.nickname" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                  <el-input v-model="userInfoForm.email" style="width: 70%"></el-input>
                </el-form-item>
                <el-button
                    type="primary"
                    @click="handleEditUserInfo"
                >
                  修改
                </el-button>
              </el-form>
            </el-col>
          </el-row>

        </div>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <div class="user-auth-container animate__animated animate__fadeIn">
          <el-form
              :model="userAuthForm"
              ref="userAuthForm"
              :rules="rules2"
              label-width="110px"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                  v-model="userAuthForm.oldPassword"
                  show-password
                  style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                  v-model="userAuthForm.newPassword"
                  style="width: 70%"
                  show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                  v-model="userAuthForm.confirmPassword"
                  style="width: 70%"
                  show-password
              ></el-input>
            </el-form-item>
            <el-button
                type="primary"
                style="margin-left: 20px"
                @click="handleEditUserAuth"
            >
              修改
            </el-button>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as imageConversion from "image-conversion";

export default {
  name: 'SettingView',
  created() {
  },
  mounted() {
  },
  data() {
    return {
      userInfoForm: {
        avatar: this.$store.getters.avatar,
        nickname: this.$store.getters.nickname,
        email: this.$store.getters.email
      },
      userAuthForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        nickname: [
          {required: true, message: '请输入用户昵称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ]
      },
      rules2: {
        oldPassword: [
          {required: true, message: '请输入旧密码', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请再次输入新密码', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 修改密码
    handleEditUserAuth() {
      this.$refs.userAuthForm.validate(async (valid) => {
        if (valid) {
          if (this.userAuthForm.newPassword !== this.userAuthForm.confirmPassword) {
            this.$message.error('两次输入的密码不一致')
            return
          }
          this.putRequest("/admin/user/password", this.userAuthForm).then(({data}) => {
            if (data.flag) {
              this.$message.success('修改成功，请重新登录一下吧')
              this.postRequest("/logout")
              this.$store.commit("logout")
              this.$router.push('/login')
            } else {
              this.$message.error(data.message)
            }
          })
        } else {
          return false
        }
      })
    },
    // 修改个人信息
    handleEditUserInfo() {
      this.$refs.userInfoForm.validate((valid) => {
        if (valid) {
          let params = {
            nickname: this.userInfoForm.nickname,
            email: this.userInfoForm.email
          }
          this.putRequest("/admin/userinfo", params).then(({data}) => {
            if (data.flag) {
              this.$message.success(data.message);
              this.getRequest("/admin/userinfo").then(res => {
                if (res.data.flag) {
                  this.$store.commit("updateUserInfo", res.data.data);
                }
              })
            } else {
              this.$message.error(data.message);
            }
          })
        } else {
          this.$notify.error("用户昵称不得为空")
          return false;
        }
      });
    },
    // 上传成功后处理
    handleAfterPostAvatar(res) {
      if (res.data.flag) {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        let params = {
          avatar: res.data.data
        }
        this.$store.commit('updateUserInfo', params)
      } else {
        this.$message.error('上传失败');
      }
    },
    // element ui 携带token上传 https://blog.huati365.com/039fbfd6cbe41006
    beforeAvatarUpload(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.$message.error('上传文件格式错误!');
        return false;
      }
      // 压缩图片
      let _this = this;
      if (file.size / 1024 > this.myConfig.PHOTO_UPLOAD_LIMIT) {
        imageConversion.compressAccurately(file, this.myConfig.PHOTO_UPLOAD_LIMIT)
            .then(res => {
              let formData = new window.FormData();
              let newFile = new window.File([res], file.name, {type: file.type});
              formData.append('file', newFile);
              _this.axios.post("/api/upload/photo/user/avatar", formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': 'Bearer ' + this.$store.getters.token
                }
              }).then(res => {
                this.handleAfterPostAvatar(res)
              })

            });
      } else {
        let formData = new window.FormData();
        formData.append('file', file);
        _this.axios.post("/api/upload/photo/user/avatar", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + this.$store.getters.token
          }
        }).then(res => {
          this.handleAfterPostAvatar(res)
        })
      }
    },
  },
  computed: {},
}
</script>

<style scoped>
.left-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/*上传框*/
.avatar-uploader {
  /*  虚线边框*/
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  display: block;
  margin: auto 20px;
  width: 200px;
  height: 200px;
  transition: all .5s;
}

.right-container {
  padding: 20px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.user-auth-container {

}

@media (max-width: 720px) {
  .user-info-container {
    flex-direction: column;
  }

  .avatar-uploader {
    margin: 0;
  }
}

</style>