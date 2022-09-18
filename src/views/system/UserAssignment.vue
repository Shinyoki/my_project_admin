<template>
  <div class="main-container">
    <!--    操作区-->
    <div class="operation-container">
      <!--      搜索-->
      <el-form
          ref="searchForm"
          :model="searchForm"
          class="operation-search-form"
          v-show="showSearch"
          inline
          size="small"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input
              v-model="searchForm.username"
              placeholder="请输入用户名称"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
              v-model="searchForm.nickname"
              placeholder="请输入用户昵称"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <el-form-item label="用户状态" prop="isDisabled">
          <el-select v-model="searchForm.isDisabled">
            <el-option label="全部" :value="null">全部</el-option>
            <el-option label="正常" :value="0">正常</el-option>
            <el-option label="禁用" :value="1">禁用</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input
              v-model="searchForm.email"
              placeholder="请输入邮箱地址"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doSearch" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="refreshSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="operation-adu-container">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >添加</el-button>
        <el-button
          type="danger"
          icon="el-icon-circle-close"
          size="mini"
          @click="handleDeleteSelected"
          >批量删除</el-button>
        <RightToolbar
            @queryTable="doSearch"
            :show-search.sync="showSearch"/>
      </div>
    </div>

    <el-card>
      <el-empty v-loading="loading" v-if="userList == null || userList.length === 0" description="暂无数据"/>
<!--      数据渲染-->
      <el-table
        ref="userTable"
        :data="userList"
        @selection-change="handleSelectionChange"
        >
<!--        多选-->
        <el-table-column type="selection" align="center" width="50"/>
<!--        用户名-->
        <el-table-column prop="username" label="用户名" align="center" show-overflow-tooltip/>
<!--        用户昵称-->
        <el-table-column prop="nickname" label="用户昵称" align="center" show-overflow-tooltip/>
<!--        用户邮箱-->
        <el-table-column prop="email" label="用户邮箱" align="center" width="200" show-overflow-tooltip/>
<!--        用户状态-->
        <el-table-column prop="isDisabled" label="用户状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDisabled == 0" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
<!--        操作-->
        <el-table-column fixed="right" width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleUnAssign(scope.row.id)"
              v-show="scope.row.id == -1"
              icon="el-icon-delete"
              >取消授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import RightToolbar from "@/components/RightToolbar";

export default {
  name: 'UserAssignment',
  components: {RightToolbar},
  created() {
    this.roleId = this.$route.params.roleId;
    if (this.roleId) {
      this.doSearch();
    } else {
      this.$notify.error("无法解析当前角色捏 O.o")
    }
  },
  mounted() {
  },
  data() {
    return {
      loading: false,
      current: 0,
      size: 10,
      total: 0,
      // 搜索
      searchForm: {
        username: '',
        nickname: '',
        email: '',
        isDisabled: null
      },
      roleId: null,
      showSearch: true,
      // data
      userList: [],
      selectedUserIdList: [],
    }
  },
  methods: {
    handleSelectionChange(newVals) {
      this.selectedUserIdList = newVals.map(item => item.id);
    },
    // TODO 取消授权
    handleUnAssign(userId) {
      this.$notify.success("取消授权" + userId);
    },
    // TODO 批量删除
    handleDeleteSelected() {

    },
    // TODO 新增授权用户
    handleAdd() {

    },
    // TODO 搜索角色授权的用户
    doSearch() {
      let params = {
        roleId: this.roleId,
        current: this.current,
        size: this.size,
        ...this.searchForm
      }
      this.getRequest("/admin/role/assignment", params).then(({data})=> {
        if (data.flag) {
          this.userList = data.data.records;
          this.total = data.data.total;
          console.log("结果")
          console.log(this.userList)
        } else {
          this.$notify.error(data.message);
        }
      })
    },
    initSearchForm() {
      this.searchForm = {
        username: '',
        nickname: '',
        email: '',
        isDisabled: null
      }
    },
    refreshSearch() {
      this.initSearchForm();
      this.doSearch()
    },
  },
  computed: {},
}
</script>

<style scoped>

</style>