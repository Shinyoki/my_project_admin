<template>
  <div class="header-container">
    <div class="top-header-container">
      <!--    控制侧边栏伸缩的按钮-->
      <el-tooltip class="item" effect="dark" :content="collapseMenuMessage" placement="top-end">
        <div class="header-icon" @click="changeCollapse">
          <i
              :class="isCollapsed"
              style="font-size: 1.5rem;"
          />
        </div>
      </el-tooltip>

      <!--      面包屑-->
      <div class="breadcrumb-container animate__animated animate__fadeIn">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in breadList" :key="index">
            <span v-if="item.menuType === 1"><a class="link" :href="item.path">{{ item.name }}</a> </span>
            <span v-else>{{ item.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!--      右侧区域-->
      <div class="top-right-side-container">
        <!--        菜单搜索按钮-->
        <el-tooltip :content="collapseSearchMessage" placement="top-end">
          <i
              class="iconfont icon-sousuoxiao"
              @click="changeSearchCollapse"
              style="margin-right: 8px;font-weight: bold; font-size: 1.05rem;cursor:pointer;"
          />
        </el-tooltip>
        <!--        菜单搜索框-->
        <el-autocomplete
            v-model="searchValue"
            :class="menuSearchClass"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            clearable
            style="margin-right: 8px;"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="搜索菜单"
        />
        <!--        全屏-->
        <el-tooltip content="全屏" placement="top-end">
          <div class="header-icon" @click="click">
            <i :class="'iconfont ' + fullScreenClass" style="font-size: 1.6rem"/>
          </div>
        </el-tooltip>
        <!--        个人-->
        <el-dropdown class="user-dropdown" trigger="click">
          <span class="el-dropdown-link" style="margin-left: 7px">
            <el-avatar
                class="user-dropdown-item"
                :src="$store.getters.avatar"
                size="large"
                style="margin-right: 5px;"/>
            <i class="user-dropdown-item el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push({path: '/settings'})">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="second-header-container">
<!--      历史记录-->
      <div>
        <el-button
            v-for="(item, index) of $store.getters.history"
            :key="index"
            :type="item.path === $route.path ? 'primary' : ''"
            size="mini"
            @click="$router.push({path: item.path})"
            :icon="curIcon(item.path)"
        >
          {{ item.name }}
          <i
              class="iconfont icon-cuowu close-icon"
              @click="removeHistory(item)"
              style="font-size: small; position: relative; top: 1px;"
              v-if="$route.path !== item.path"
          />
        </el-button>
      </div>
      <div style="margin-left: auto">
        <el-button
          @click="refreshHistory"
          size="mini"
          plain
          >全部关闭</el-button>
      </div>
    </div>

  </div>

</template>

<script>
import screenfull from 'screenfull'

function containsStr(menu, queryString) {
  return menu.name.indexOf(queryString) >= 0
}

function isCategory(menu) {
  return menu.menuType === 0;
}

export default {
  name: 'TopNavBar',
  created() {
    this.getBreadList();
    this.$store.commit("addHistory", this.$route)
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy();
  },
  data() {
    return {
      breadList: [{name: '首页', path: '/', menuType: 1}],
      searchValue: '',
      collapseSearch: true,
      isFullScreen: false,
      isFullScreenClass: false
    }
  },
  methods: {
    // 清除历史记录
    refreshHistory() {
      this.$store.commit("refreshHistory")
    },
    removeHistory(menu) {
      this.$store.commit("removeHistory", menu)
    },
    // 退出登录
    handleLogout() {
      this.$confirm('确定退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('doLogout').then((res) => {
          if (res.data.flag) {
            this.$notify.success(res.data.message);
            this.$router.push({path: '/login'});
          } else {
            this.$notify.error(res.data.message);
          }
        })
      })
    },

    // 搜索菜单
    querySearchAsync(queryString, cb) {
      let menus = this.$store.getters.menus;
      // 遍历menus，找到name中包含queryString的menu
      let result = this.generateQueryPath(menus, queryString)
      if (result && result.length > 0) {
        cb(result)
      } else {
        cb([{value: '没有找到匹配的菜单', path: '/没有'}])
      }
    },
    generateQueryPath(menus, queryString) {
      let searchResult = [];
      menus.forEach(menu => {
        if (isCategory(menu)) {
          // 是目录，则继续遍历
          let results = this.generateQueryPath(menu.children, queryString)
          searchResult.push(...results);
        } else if (containsStr(menu, queryString)) {
          // 是菜单，且包含queryString
          searchResult.push({value: menu.name, path: menu.path});
        }
      })
      return searchResult;
    },
    // 选择搜索结果
    handleSelect(item) {
      if (item && item.path != '/没有') {
        this.$router.push(item.path)
      }
    },
    // 设置面包屑
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
    // 修改侧边栏伸缩
    changeCollapse() {
      this.$store.commit("changeCollapse")
    },
    // 修改搜索框伸缩
    changeSearchCollapse() {
      this.collapseSearch = !this.collapseSearch
    },
    // 修改全屏
    click() {
      if (!screenfull.isEnabled) {
        this.$message({message: '你的浏览器不支持全屏', type: 'warning'})
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
      this.isFullScreenClass = !this.isFullScreenClass
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  },
  computed: {
    isCollapsed() {
      return this.$store.getters.isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    },
    collapseMenuMessage() {
      return this.$store.getters.isCollapsed ? '展开' : '收起'
    },
    collapseSearchMessage() {
      return this.collapseSearch ? '展开' : '收起';
    },
    menuSearchClass() {
      return this.collapseSearch ? 'menu-search' : 'menu-search menu-search-active'
    },
    fullScreenClass() {
      return this.isFullScreenClass ? 'icon-tuichuquanping' : 'icon-quanping'
    },
    curIcon() {
      return path => {
        if (path === this.$route.path) {
          return 'el-icon-location'
        } else {
          return ''
        }
      }
    },
  },
}
</script>

<style scoped>
.header-container {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.top-header-container {
  align-items: center;
  display: flex;
}

/*给header-icon添加悬浮阴影效果*/
.header-icon:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

.header-icon {
  height: 40px;
  padding: 0 7px;
  /*  文字垂直居中*/
  display: flex;
  align-items: center;
  cursor: pointer;
}

.top-right-side-icon:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

/*面包屑breadcrumb-container占据所有元素*/
.breadcrumb-container {
  flex: 1;
}

.router-link-exact-active {
  font-weight: bold !important;
}

.link {
  font-weight: bold !important;
  cursor: pointer !important;
}

.link:hover {
  color: #409eff !important;
}

/*顶部的右侧容器*/
.top-right-side-container {
  display: flex;
  align-items: center;
}

/*搜索框缩放动画*/
.menu-search {
  width: 0;
  overflow: hidden;
  transition: all .5s;
}

.menu-search-active {
  width: 200px;
  overflow: hidden;
  transition: all .5s;
}

.menu-search-input {
  width: 200px;
}

/*个人*/
.user-dropdown-item {
  cursor: pointer;
}
/*历史记录*/
.second-header-container {
  display: flex;
  padding: 10px 10px;
  border-bottom: none;
/*  给上方添加阴影，下方没有阴影*/
  box-shadow: 0 1px 4px  rgba(0, 21, 41, 0.08);
}
.close-icon {
  transition: all .5s;
}
.close-icon:hover {
  color: #EF5350;
}
</style>