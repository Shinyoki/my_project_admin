<template>
  <div class="header-container">
    <div class="top-header-container">
      <!--    控制侧边栏伸缩的按钮-->
      <div class="header-icon" @click="changeCollapse">
        <i
            :class="isCollapsed"
            style="font-size: 1.5rem;"
        />
      </div>
      <!--      面包屑-->
      <div class="breadcrumb-container animate__animated animate__fadeIn">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in breadList" :key="index">
            <span v-if="item.menuType === 1"><a class="link" :href="item.path">{{ item.name }}</a> </span>
            <span v-else>{{ item.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

    </div>
  </div>

</template>

<script>

export default {
  name: 'TopNavBar',
  created() {
    this.getBreadList()
  },
  mounted() {

  },
  data() {
    return {
      breadList: [{name: '首页', path: '/', menuType: 1}]
    }
  },
  methods: {
    getBreadList() {

      let firstRoute = this.$route.matched[0];
      let curPath = this.$route.path
      let menus = this.$store.getters.menus;
      this.breadList = [{name: '首页', path: '/', menuType: 1}];

      for (let item of menus) {
        if (item.name === firstRoute.name) {
          // 如果第一级是，则查看是否为目录，如果是目录就进行递归
          if (item.menuType === 0) {
            // 目录
            let result = this.recursionForPath(item.children, curPath);
            this.breadList.push({name: item.name, path: item.path, menuType: 0});
            this.breadList.push(...result)
          } else {
            // 菜单
            this.breadList.push({name: firstRoute.name, path: firstRoute.path})
          }
        }
      }

      return this.breadList;
    },
    recursionForPath(menus, path) {
      let paths = [];
      // 遍历菜单
      for (let item of menus) {
        if (item.path === path) {
          // 如果找到，则直接添加
          paths.push({name: item.name, path: item.path, menuType: item.menuType})
          return paths;
        } else {
          // 没有找到，则从child中寻找
          if (item.children && item.children.length > 0) {
            let result = this.recursionForPath(item.children, path);
            if (result.length > 0) {
              // 如果找到，则length > 0，此时添加当前菜单，并拼接之后的菜单
              paths.push({name: item.name, path: item.path, menuType: item.menuType})
              paths.push(...result)
              return paths;
            }
          }
        }
      }
      return paths;
    },
    changeCollapse() {
      this.$store.commit("changeCollapse")
    },

  },
  computed: {
    isCollapsed() {
      return this.$store.getters.isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    }
  },
}
</script>

<style scoped>
.header-container {
  /*height: 50px;*/
}

.top-header-container {
  align-items: center;
  display: flex;
}

.header-icon {
  height: 50px;
  padding: 0 15px;
  /*  文字垂直居中*/
  display: flex;
  align-items: center;
  cursor: pointer;
}

/*给header-icon添加悬浮阴影效果*/
.header-icon:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

/*给breadcrumb transition group加上过渡动画*/
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
/*面包屑breadcrumb-container占据所有元素*/
.breadcrumb-container{
  flex: 1;
}
.router-link-exact-active{
  font-weight: bold!important;
}
.link {
  font-weight: bold !important;
  cursor: pointer !important;
}
.link:hover {
  color: #409eff !important;
}
</style>