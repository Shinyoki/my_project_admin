<template>
  <div class="main-container">
<!--    操作区-->
    <div class="operation-container">
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
            <el-option label="全部" :value="null"></el-option>
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
    </div>

<!--    内容-->
    <el-card>

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
      menuList: [],
      searchForm: {
        name: '',
        isHidden: null
      },
    }
  },
  methods: {
    doSearch() {
      let params = {
        keywords: this.searchForm.name,
        isHidden: this.searchForm.isHidden,
      }

      this.getRequest('/admin/menus', params).then(res => {
        if (res.data.flag) {
          this.menuList = this.handleTree(res.data.data);
        } else {
          this.$notify.error("请求菜单列表失败!")
        }
      })
    },
    // 重置搜索
    refreshSearch() {
      this.searchForm = {
        name: '',
        isHidden: 0
      }
    },

  },
  computed: {},
}
</script>

<style scoped>
.operation-container {
  width: 100%;
  display: flex;
}
</style>