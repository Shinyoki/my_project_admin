<template>
  <el-container>
    <el-aside>
      <SideBar/>
    </el-aside>
    <el-container>
      <TopNavBar :key="$route.fullPath"/>
      <el-main>
        <keep-alive>
<!--          transition动画：https://blog.csdn.net/Superman_H/article/details/122851610 -->
          <transition name="fade-transform" mode="out-in">
            <router-view :key="$route.fullPath"/>
          </transition>
        </keep-alive>
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
.main-container {
  transition: margin-left 0.45s;
  margin-left: 210px;
  min-height: 100vh;
}
.hideSideBar {
  margin-left: 64px;
}
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