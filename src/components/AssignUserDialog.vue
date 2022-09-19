<template>
  <div>
    <el-dialog
        :visible.sync="showAddDialog"
        title="新增授权用户"
        width="70%"
    >
      <el-empty v-loading="loading" v-if="!userList || userList.length === 0" description="没有查到尚未分配角色的用户~"/>
      <el-table
          v-else
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
        <el-table-column prop="email" label="用户邮箱" align="center" show-overflow-tooltip/>
        <!--        用户状态-->
        <el-table-column prop="isDisabled" label="用户状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDisabled == 0" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
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
      <span slot="footer" class="dialog-footer">
        <div v-if="userList && userList.length > 0">
          <el-button @click="showAddDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleAssign">确 定</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="showAddDialog = false">退 出</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AssignUserDialog',
  props: {
    roleId: {
      type: String,
      default: null,
    }
  },
  created() {
    this.doSearch()
  },
  mounted() {
  },
  data() {
    return {
      showAddDialog: false,
      loading: false,
      current: 0,
      size: 10,
      total: 0,
      userList: [],
      selectedUserIdList: [],
      searchForm: {
        username: '',
        nickname: '',
        email: '',
        isDisabled: null
      },
    }
  },
  methods: {
    handleCurrentChange(newCur) {
      this.current = newCur
      this.doSearch()
    },
    handleSizeChange(newSize) {
      this.size = newSize
      this.doSearch()
    },
    // 更新
    handleAssign() {
      this.postRequest("/admin/role/assignment/" + this.roleId, this.selectedUserIdList).then(({data}) => {
        if (data.flag) {
          this.$notify.success("授权成功");
          this.doSearch();
        } else {
          this.$notify.error("授权失败");
        }
      })
    },
    // 多选
    handleSelectionChange(newVals) {
      this.selectedUserIdList = newVals.map(item => item.id)
    },
    // 切换dialog显示
    toggleDialogVisible() {
      this.showAddDialog = !this.showAddDialog;
    },
    // 搜索未授权的用户
    doSearch() {
      // 发送请求
      this.loading = true;
      let params = {
        current: this.current,
        size: this.size,
        ...this.searchForm
      }
      this.getRequest("/admin/role/unassignment", params).then(({data}) => {
        if (data.flag) {
          this.userList = data.data.records;
          this.total = data.data.total;
        } else {
          this.$notify.error(data.message)
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })

    },
    refreshSearch() {
      this.$emit("refreshSearch");
    },
  },
  computed: {},
  watch: {}
}
</script>

<style scoped>

</style>