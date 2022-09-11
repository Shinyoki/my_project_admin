<template>
  <div class="main-container">
    <!--    操作区-->
    <div class="operation-container">
      <!--      表单-->
      <el-form
          ref="searchForm"
          :model="searchForm"
          size="small"
          inline
      >
        <!--        搜索框-->
        <el-form-item label="表单名称" prop="name">
          <el-input
              v-model="searchForm.name"
              placeholder="请输入表单名称"
              @keyup.enter.native="doSearch"
              clearable
          />
        </el-form-item>
        <!--        是否隐藏搜索框-->
        <el-form-item label="状态" prop="name">
          <el-select v-model="searchForm.isHidden" placeholder="请选择状态">
            <el-option label="全部" :value="3"></el-option>
            <el-option label="显示" :value="0"></el-option>
            <el-option label="隐藏" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!--        提交搜索-->
        <el-form-item style="margin-right: auto">
          <el-button type="primary" @click="doSearch" size="mini" icon="el-icon-search">搜索</el-button>
          <el-button @click="refreshSearch" size="small" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="ml-auto">
        <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="createTopMenu"
        >新增
        </el-button>
      </div>
    </div>

    <!--    内容-->
    <el-card>
      <el-empty v-loading="loading" v-if="menuList === null || menuList.length === 0" description="暂无数据"></el-empty>
      <el-table
          v-else
          v-loading="loading"
          :data="this.menuList"
          style="width: 100%;margin-bottom: 20px"
          row-key="id"
          :stripe="true"
          :default-expand-all="isExpandAll"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <!--        名称-->
        <el-table-column
            prop="name"
            label="菜单名称"
            fixed
            show-overflow-tooltip
            min-width="170"
        />
        <!--        菜单图标-->
        <el-table-column
            align="center"
            prop="icon"
            label="图标"
            width="50"
        >
          <template slot-scope="scope">
            <i :class="`iconfont ` + scope.row.icon"/>
          </template>
        </el-table-column>
        <!--        路径-->
        <el-table-column
            prop="path"
            label="路径"
            min-width="170"
            resizable
            show-overflow-tooltip
        />
        <!--        所在位置-->
        <el-table-column
            prop="component"
            label="组件路径"
            min-width="170"
            show-tooltip-when-overflow
        />
        <!--        隐藏与否-->
        <el-table-column
            prop="isHidden"
            label="隐藏"
            width="70"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isHidden === 0" type="success">显示</el-tag>
            <el-tag v-else type="danger">隐藏</el-tag>
          </template>
        </el-table-column>
        <!--        排序等级-->
        <el-table-column
            prop="orderNum"
            align="center"
            label="显示优先级"
            width="70"
        />
        <!--        权限-->
        <el-table-column
            prop="roles"
            align="center"
            label="可访角色"
            min-width="120"
        >
          <template slot-scope="scope">
            <el-tag
                v-for="role in scope.row.roles"
                :key="role.id"
                size="mini"
                style="margin-right: 4px; font-weight: bold"
            >{{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <!--        创建时间-->
        <el-table-column
            prop="createTime"
            align="center"
            label="创建时间"
            min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | date }}</span>
          </template>
        </el-table-column>
        <!--        更新时间-->
        <el-table-column
            prop="updateTime"
            align="center"
            label="更新时间"
            min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | date }}</span>
          </template>
        </el-table-column>
        <!--        操作修改-->
        <el-table-column
            align="center"
            label="操作"
            width="100"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="mini"
                @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
                type="text"
                size="mini"
                @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

  </div>
</template>

<script>

export default {
  name: 'MenuView',
  created() {
    this.doSearch();
  },
  mounted() {
  },
  data() {
    return {
      menuList: [],     // 需要被渲染的菜单列表
      searchForm: {     // 搜索表单
        name: '',
        isHidden: 3
      },
      loading: false,     // v-loading 加载状态
      isExpandAll: false, // 默认是否全部展开菜单
    }
  },
  methods: {
    // TODO 创建新表单
    createTopMenu() {
      this.$notify.success("创建")
    },
    // TODO 编辑
    handleEdit(menu) {
      console.log("编辑的menu")
      console.log(menu)
    },
    // 删除
    handleDelete(menu) {
      if (menu.menuType === 0 && menu.children && menu.children.length > 0) {
        this.$notify.error('该目录下存在子菜单，无法删除！');
        return false;
      }
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/admin/menu/' + menu.id).then(res => {
          if (res.data.flag) {
            this.$notify.success('删除成功！');
            this.doSearch();
            //  浏览器刷新
            window.loading.reload()
          } else {
            this.$notify.error(res.data.message);
          }
        });
      }).catch(() => {
        this.$notify.info('取消删除"' + menu.name + '"');
      });
    },
    // 搜索
    doSearch() {
      this.loading = true
      let params = {
        keywords: this.searchForm.name,
        isHidden: this.searchForm.isHidden === 3 ? null : this.searchForm.isHidden
      }

      this.getRequest('/admin/menus', params).then(res => {
        if (res.data.flag) {
          this.menuList = this.handleTree(res.data.data);
        } else {
          this.$notify.error("请求菜单列表失败!")
        }
        this.loading = false
      })
    },
    // 重置搜索
    refreshSearch() {
      this.searchForm = {
        name: '',
        isHidden: 3
      }
      this.doSearch()
    },
  },
  computed: {
  },
}
</script>

<style scoped>

</style>