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
        >添加
        </el-button>
        <el-button
            type="danger"
            icon="el-icon-circle-close"
            size="mini"
            :disabled="selectedUserIdList.length === 0"
            @click="handleDeleteSelected"
        >批量取消授权
        </el-button>
        <RightToolbar
            @queryTable="doSearch"
            :show-search.sync="showSearch"/>
      </div>
    </div>

    <el-card>
      <el-empty v-loading="loading" v-if="userList == null || userList.length === 0" description="暂无数据"/>
      <!--      数据渲染-->
      <el-table
          v-else
          v-loading="loading"
          ref="userTable"
          :data="userList"
          @selection-change="handleSelectionChange"
      >
        <!--        多选-->
        <el-table-column type="selection" align="center" width="50"/>
<!--        用户头像-->
        <el-table-column align="center" label="头像" width="50">
          <template slot-scope="scope">
            <el-avatar
                :src="scope.row.avatar"
                size="small"
                />
          </template>
        </el-table-column>
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
                v-show="scope.row.id != -1"
                icon="el-icon-delete"
            >取消授权
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-if="userList && userList.length > 0"
          background
          class="pagination-container"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="size"
          :current-page.sync="current"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
      />
    </el-card>

<!--    新增授权用户dialog-->
    <AssignUserDialog
        ref="assignUserDialog"
        @refreshSearch="refreshSearch"
        :roleId="roleId"
    />
  </div>
</template>

<script>
import RightToolbar from "@/components/RightToolbar";
import AssignUserDialog from "@/components/AssignUserDialog";

export default {
  name: 'UserAssignment',
  components: {AssignUserDialog, RightToolbar},
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
      // 主分页
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
      unAssignedUserList: [],
      selectedUserIdList: [],
    }
  },
  methods: {
    handleCurrentChange(newCur) {
      this.current = newCur;
      this.doSearch();
    },
    handleSizeChange(newSize) {
      this.size = newSize;
      this.doSearch();
    },
    handleSelectionChange(newVals) {
      this.selectedUserIdList = newVals.map(item => item.id);
    },
    // 取消授权
    handleUnAssign(userIds) {
      // 如果是单独的对象，则转换为数组
      if (!Array.isArray(userIds)) {
        userIds = [userIds];
      }
      if (userIds.findIndex(userIds => userIds == -1) != -1) {
        // 存在超级管理员，则不允许取消授权
        this.$notify.error("超级管理员不允许取消授权 O.o");
        return false;
      }
      this.deleteRequest("/admin/role/assignment/" + this.roleId ,userIds).then(({data}) => {
        if (data.flag) {
          this.$notify.success("取消授权成功 ^_^");
          this.doSearch();
        } else {
          this.$notify.error("取消授权失败 O.o");
        }
      })
    },
    // 批量删除
    handleDeleteSelected() {
      this.handleUnAssign(this.selectedUserIdList);
    },
    // 新增授权用户
    handleAdd() {
      this.$refs.assignUserDialog.toggleDialogVisible();
    },
    // 搜索角色授权的用户
    doSearch() {
      this.loading = true
      let params = {
        roleId: this.roleId,
        current: this.current,
        size: this.size,
        ...this.searchForm
      }
      this.getRequest("/admin/role/assignment", params).then(({data}) => {
        if (data.flag) {
          this.userList = data.data.records;
          this.total = data.data.total;
        } else {
          this.$notify.error(data.message);
        }
        this.loading = false
      }).catch(() => {
        this.loading = false;
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
    initPage() {
      this.current = 0;
      this.size = 10;
      this.total = 0;
    },
    refreshSearch() {
      this.initSearchForm();
      this.initPage();
      this.doSearch()
    },
  },
  computed: {},
}
</script>

<style scoped>

</style>