<template>
  <div class="main-container">
    <!--    操作区-->
    <div class="operation-container">
      <!--      搜索-->
      <el-form
          ref="searchForm"
          :model="searchForm"
          :inline="true"
          size="small"
      >
        <!--        角色名称-->
        <el-form-item label="角色名称" prop="name">
          <el-input
              v-model="searchForm.name"
              placeholder="请输入角色名称"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--        角色标签-->
        <el-form-item label="角色标签" prop="label">
          <el-input
              v-model="searchForm.label"
              placeholder="请输入角色标签"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--        角色状态-->
        <el-form-item label="角色状态" prop="isDisabled">
          <el-select v-model="searchForm.isDisabled">
            <el-option label="全部" :value="null">全部</el-option>
            <el-option label="正常" :value="0">正常</el-option>
            <el-option label="禁用" :value="1">禁用</el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doSearch" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="refreshSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <!--      新增， 删除，刷新-->
      <div>
        <!--        新增-->
        <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(null)"
        >添加
        </el-button>
        <!--        批量删除-->
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDeleteAll"
        >批量删除
        </el-button>
      </div>
    </div>

    <el-card>
      <!--      空展示-->
      <el-empty
          v-loading="loading"
          v-if="roleList == null || roleList.length <= 0"
          description="暂无数据"
      />
      <!--      数据-->
      <el-table
          v-else
          v-loading="loading"
          :data="roleList"
          @selection-change="handleSelectChange"
      >
        <!--        多选-->
        <el-table-column
            type="selection"
            width="50"
            align="center"
        />
        <!--        角色名-->
        <el-table-column label="角色名" prop="roleName" align="center"/>
        <!--        角色标签-->
        <el-table-column label="角色标签" prop="roleLabel" align="center">
          <template slot-scope="scope">
            <el-tag
                v-if="scope.row.roleLabel"
                :type="scope.row.isDisabled === 1 ? 'danger' : 'success'"
                size="mini"
            >{{ scope.row.roleLabel }}
            </el-tag>
          </template>
        </el-table-column>
        <!--        禁用状态-->
        <el-table-column label="角色状态" prop="isDisabled" align="center">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.isDisabled"
                :active-value="0"
                :inactive-value="1"
                @change="handleDisableUpdate(scope.row)"
            />
          </template>
        </el-table-column>
<!--        创建时间-->
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time mr-2" />
            <span>{{ scope.row.createTime | date }}</span>
          </template>
        </el-table-column>
<!--        操作-->
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleEditMenu(scope.row)"
              icon="el-icon-edit"
              >编辑菜单</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleEditResource(scope.row)"
              icon="el-icon-s-operation"
              >编辑资源</el-button>
            <el-button
              type="text"
              style="color: red"
              icon="el-icon-delete"
              @click="handleDeleteRole(scope.row.id)"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        hide-on-single-page
        class="pagination-container"
        @size-change="onSizeChange"
        @current-change="onCurChange"
        :current-page="current"
        :page-size="size"
        :total="total"
        :page-sizes="[10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        />
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'RoleView',
  created() {
    this.doSearch();
  },
  mounted() {
  },
  data() {
    return {
      loading: true,
      current: 0,           // 分页请求
      size: 10,
      total: 0,
      searchForm: {
        // 搜索条件
        name: '',           // 角色名
        label: '',          // 角色标签 如 admin
        isDisabled: null,   // 角色状态
      },
      selectedRoleIds: [],  // 选中的roles
      roleList: [],         // 数据
      statusOptions: {
        // 角色状态
        0: '启用',
        1: '禁用',
      },
      showAddOrEditDialog: false, // 新增或编辑弹窗
    }
  },
  methods: {
    // page
    onSizeChange(newSize) {
      this.size = newSize
    },
    onCurChange(newCur) {
      this.current = newCur;
    },
    // 修改 disabled 状态
    handleDisableUpdate(row) {
      this.$confirm('确定要修改角色状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = {
          roleId: row.id,
          isDisabled: row.isDisabled,
        }
        this.putRequest("/admin/role/disable", params).then(res => {
          if (res.data.flag) {
            this.$notify.success("修改成功");
            this.doSearch();
          } else {
            this.$notify.error("修改失败");
            row.isDisabled = row.isDisabled === 1 ? 0 : 1;
          }
        });
      }).catch(() => {
        row.isDisabled = row.isDisabled === 1 ? 0 : 1;
      });
    },
    // 多选事件
    handleSelectChange(newVals) {
      this.selectedRoleIds = newVals.map(role => role.id)
    },
    // TODO 删除角色
    handleDeleteRole(id) {
      this.$confirm("确定要删除该角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let roleIds = [id];
        this.deleteRequest("/admin/roles", roleIds).then(res => {
          if (res.data.flag) {
            this.$notify.success("删除成功");
            this.doSearch();
          } else {
            this.$notify.error(res.data.message);
          }
        });
      }).catch(() => {
      });
    },
    // TODO 编辑资源
    handleEditResource(row) {
      console.log(row)
    },
    // 批量删除
    handleDeleteAll() {
      if (!this.selectedRoleIds || this.selectedRoleIds.length <= 0) {
        this.$notify.error("请至少选择一个再删除吧");
        return false;
      }
      this.$confirm('此操作将永久删除选中的角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deleteRequest("/admin/roles", this.selectedRoleIds).then(res => {
          if (res.data.flag) {
            this.$notify.success("删除成功");
            this.doSearch();
          } else {
            this.$notify.error(res.data.message);
          }
        })
      }).catch(() => {

      });

    },
    // TODO 添加
    handleAdd(role) {
      console.log(role)
    },
    // TODO 编辑
    handleEditMenu(role) {
      console.log(role)
    },
    // 重置
    refreshSearch() {
      this.current = 0;
      this.searchForm.name = '';
      this.searchForm.label = '';
      this.searchForm.isDisabled = null;
      this.doSearch();
    },
    // 搜索结果
    doSearch() {
      this.loading = true;
      let params = {
        current: this.current,
        size: this.size,
        ...this.searchForm,
      }
      this.getRequest("/admin/roles", params).then(res => {
        if (res.data.flag) {
          this.roleList = res.data.data.records;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.message);
        }

        this.loading = false;
      });
    },
  },
  computed: {},
}
</script>

<style scoped>

</style>