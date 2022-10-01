<template>
  <div>
    <el-row :gutter="20">
<!--      网站信息-->
      <el-col
          class="animate__animated animate__fadeInLeft"
        :sm="24"
        :md="12"
        style="padding-left: 20px"
        >
        <h2>个人项目后台模板</h2>
        <p>以前要么跟着抄，要么直接拿别的后台管理项目，总得顺着别人的鉴权、分页来，当然现在有很多其他的优秀快速开发框架很好用，但总是有些学习成本在里面，我很懒，所以就自己根据经验做了一套，也算是检验了一次自己的技术。</p>
        <p>界面和众多代码参考自Ruoyi_Vue项目，如有雷同，甚为惭愧</p>
        <p>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="push('https://github.com/Shinyoki')"
            >
            <i class="iconfont icon-github"/>访问作者的Github
          </el-button>
        </p>
      </el-col>
<!--            项目技术选型-->
      <el-col
          class="animate__animated animate__fadeInRight"
        :sm="24"
        :md="12"
        style="padding-left: 20px"
        >
        <el-row>
          <el-col :span="12"><h2>技术选型</h2></el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h3>前端</h3>
            <ul>
              <li>Vue</li>
              <li>ElementUI</li>
              <li>Vue-Router</li>
              <li>VueX</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h3>后端</h3>
            <ul>
              <li>SpringBoot</li>
              <li>MyBatisPlus</li>
              <li>SpringSecurity</li>
              <li>JWT</li>
              <li>Redis</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'IndexView',
  created() {
  },
  mounted() {
  },
  data() {
    return {}
  },
  methods: {
    push(url) {
      window.open(url, '_blank');
    },
  },
  computed: {},
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  color: #606f7b;
}
</style>