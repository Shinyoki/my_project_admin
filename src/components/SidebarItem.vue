<template>
  <!--  因为在<el-menu>里加入<div>导致menu收缩时无法隐藏文字，所以需要用到 vue-fragment-->
  <!--  https://blog.csdn.net/xixiyuguang/article/details/120289766-->
  <fragment>
<!--    遍历菜单-->
    <template v-for="item in menus">

<!--      如果是目录，则设置好icon & title，并继续递归-->
      <el-submenu
          v-if="isCategory(item) && item.children && item.children.length > 0"
          :key="item.path"
          v-show="notHidden(item)"
          :index="item.path">
<!--        icon & title-->
        <template slot="title">
          <i
              :class="'iconfont ' + item.icon"
              style=" font-size:1.1rem;margin-right: 7px"
          ></i>
          <span slot="title">{{ item.name }}</span>
        </template>
        <!--  递归Child -->
        <SidebarItem :menus="item.children"/>
      </el-submenu>

<!--      如果是菜单，则直接设置icon & title-->
      <el-menu-item
          v-else
          v-show="notHidden(item)"
          :index="item.path"
          :key="item.path">
        <i
            :class="'iconfont ' + item.icon"
            style=" font-size:1.1rem;margin-right: 7px"
        ></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </fragment>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: ['menus'],
  created() {
  },
  mounted() {
  },
  data() {
    return {}
  },
  methods: {
    notHidden(menu) {
      return menu.isHidden === 0
    },
    isCategory(menu) {
      return menu.menuType === 0;
    },
  },
  computed: {

  },
}
</script>

<style scoped>

</style>