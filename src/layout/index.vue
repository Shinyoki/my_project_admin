<template>

  <el-container>
    <!--    侧边栏-->
    <el-aside width="auto">
      <SideBar/>
    </el-aside>
    <!--    右侧容器-->
    <el-container style="min-height: 100vh">
      <el-header style="height: auto; padding: 0">
        <!--        顶部标题-->
        <TopNavBar :key="$route.fullPath"/>
      </el-header>
      <el-main>
        <!--        主体内容-->
        <!-- transition动画：https://blog.csdn.net/Superman_H/article/details/122851610  -->
        <transition name="fade-transform" mode="out-in">
          <router-view :key="$route.fullPath"/>
        </transition>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import SideBar from "@/layout/side/SideBar";
import TopNavBar from "@/layout/right/TopNavBar";

export default {
  name: 'HomeView',
  components: {TopNavBar, SideBar},
  created() {
  },
  mounted() {
  },
  data() {
    return {}
  },
  methods: {},
  computed: {},
}
</script>

<style scoped>
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s ease 0s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>