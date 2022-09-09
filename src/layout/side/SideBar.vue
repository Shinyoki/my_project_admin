<template>
  <div>
    <el-menu
        default-active="1-4-1"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#C8C9CA"
        :collapse="$store.getters.isCollapsed"
        router
    >
      <SidebarItem
          :menus="$store.getters.menus"
          :isTopMenus="true"
      />
    </el-menu>
  </div>
</template>

<script>
import SidebarItem from "@/components/SidebarItem";

export default {
  name: 'SideBar',
  components: {SidebarItem},
  created() {
  },
  mounted() {
  },
  data() {
    return {}
  },
  methods: {},
  computed: {
    menus() {
      return this.$store.getters.menus
    }
  },
}
</script>

<style scoped>

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 210px;
}

.el-menu-vertical-demo {
  height: 100vh;

  overflow-x: hidden;
  overflow-y: auto;
}
</style>