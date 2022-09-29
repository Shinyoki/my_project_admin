<template>
  <div>
    <div class="operation-container">
      <el-form
          ref="searchForm"
          :model="searchForm"
          class="operation-search-form"
          v-show="showSearch"
          inline
      >
        <!--      用户名-->
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="searchForm.username"
              placeholder="请输入用户名"
              clearable
              size="mini"
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--      用户昵称-->

        <el-form-item label="用户昵称" prop="nickname">
          <el-input
              v-model="searchForm.nickname"
              placeholder="请输入用户昵称"
              clearable
              size="mini"
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--      用户状态-->
        <el-form-item label="用户状态" prop="isDisabled">
          <el-select size="mini" v-model="searchForm.isDisabled">
            <el-option label="全部" :value="null">全部</el-option>
            <el-option label="正常" :value="0">正常</el-option>
            <el-option label="禁用" :value="1">禁用</el-option>
          </el-select>
        </el-form-item>
        <!--      邮箱地址-->
        <el-form-item label="邮箱地址" prop="email">
          <el-input
              v-model="searchForm.email"
              placeholder="请输入邮箱地址"
              clearable
              size="mini"
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--      搜索按钮-->
        <el-form-item>
          <el-button size="mini" type="primary" @click="doSearch" icon="el-icon-search">搜索</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="refreshSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!--    增删改查-->
      <div class="operation-adu-container">
        <el-button
            size="mini"
            type="success"
            icon="el-icon-plus"
            @click="handleAdd"
        >新增
        </el-button>
        <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDeleteBath"
            :disabled="!selectedUserIdList || selectedUserIdList.length <= 0"
        >批量删除
        </el-button>
        <RightToolbar @queryTable="doSearch" :show-search.sync="showSearch"/>
      </div>
    </div>

    <el-card>
      <el-empty v-loading="loading" v-if="!userList || userList.length === 0" description="没有查询到用户"/>
      <el-table
          :data="userList"
          v-else
          v-loading="loading"
          @selection-change="handleSelectionChange"
      >
        <!--        多选-->
        <el-table-column type="selection" align="center" width="55"/>
        <el-table-column label="用户名" prop="username" show-overflow-tooltip/>
        <el-table-column label="用户昵称" prop="nickname" show-overflow-tooltip/>
        <el-table-column label="邮箱地址" prop="email" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ !scope.row.email ? '无' : scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column label="用户状态" prop="isDisabled" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDisabled === 0" size="mini" type="success">正常</el-tag>
            <el-tag v-else size="mini" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" prop="lastLoginTime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.lastLoginTime | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作系统" prop="os" show-overflow-tooltip/>
        <el-table-column label="浏览器" prop="browser" show-overflow-tooltip/>
        <el-table-column label="登录IP" prop="ip" show-overflow-tooltip/>
        <el-table-column label="登录地点" prop="location" show-overflow-tooltip/>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-if="scope.row.id != -1"
                @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
                size="mini"
                type="text"
                style="color: red"
                v-if="scope.row.id != -1"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.id)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
          hide-on-single-page
          class="pagination-container"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :current-page="current"
          :page-size="size"
          :total="total"
          :page-sizes="[10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>

    <el-dialog
        :visible.sync="showAddOrEditDialog"
        @close="initAddOrEditForm"
        width="400px"
        append-to-body
    >
      <div slot="title" class="dialog-title-container" ref="dialogTitle"/>
      <el-form
          :model="addOrEditForm"
          :rules="rules"
          ref="addOrEditForm"
          label-position="right"
          label-width="110px"
          inline
      >
        <el-row>
          <el-col :span="24">
            <!--        用户名-->
            <el-form-item prop="username">
              <!--              tooltip-->
              <span slot="label">
                <el-tooltip
                    effect="dark"
                    content="用户名，如 admin"
                    placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                用户名
              </span>
              <el-input
                  v-model="addOrEditForm.username"
                  placeholder="请输入用户名"
                  clearable
                  @keyup.enter.native="doSaveOrUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="addOrEditForm.password"
                placeholder="请输入密码"
                clearable
                @keyup.enter.native="doSaveOrUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!--        用户邮箱-->
            <el-form-item label="邮箱地址" prop="email">
              <el-input
                  v-model="addOrEditForm.email"
                  placeholder="请输入邮箱地址"
                  clearable
                  @keyup.enter.native="doSaveOrUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!--        用户状态-->
            <el-form-item label="用户状态" prop="isDisabled">
              <el-radio-group v-model="addOrEditForm.isDisabled">
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!--        用户角色-->
            <el-form-item label="用户角色" prop="roleIds">
              <el-select
                  v-model="addOrEditForm.roleId"
                  placeholder="请选择用户角色"
              >
                <el-option
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.roleLabel"
                    :value="role.id"
                />
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddOrEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="doSaveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RightToolbar from "@/components/RightToolbar";

export default {
  name: 'UserView',
  components: {RightToolbar},
  created() {
    this.doSearch();
    this.listRoleLabels();
  },
  mounted() {
  },
  data() {
    return {
      // page & search
      showSearch: true,
      loading: false,
      current: 0,
      size: 10,
      total: 0,
      searchForm: {
        username: '',
        nickname: '',
        email: '',
        isDisabled: null
      },
      // data
      userList: [],
      roleList: [],
      selectedUserIdList: [],
      showAddOrEditDialog: false,
      addOrEditForm: {
        id: null,
        username: '',
        password: '',
        email: '',
        isDisabled: 0,
        roleId: null,
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        email: [
          {required: false, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    onSizeChange(newSize) {
      this.size = newSize;
      this.doSearch();
    },
    onCurrentChange(newCurrent) {
      this.current = newCurrent;
      this.doSearch();
    },
    initPage() {
      this.current = 0;
      this.total = 0;
      this.size = 10;
    },
    initSearchForm() {
      this.searchForm = {
        username: '',
        nickname: '',
        email: '',
        isDisabled: null
      }
    },
    initAddOrEditForm() {
      this.addOrEditForm = {
        id: null,
        username: '',
        password: '',
        email: '',
        isDisabled: 0,
        roleId: null,
      }
    },
    refreshSearch() {
      this.initSearchForm();
      this.doSearch();
    },
    // 多选
    handleSelectionChange(newVals) {
      this.selectedUserIdList = newVals.map(item => item.id)
    },
    // 查询角色
    listRoleLabels() {
      this.getRequest("/admin/roles/labels").then(res => {
        if (res.data.flag) {
          this.roleList = res.data.data;
        } else {
          this.$notify.error(res.data.message)
        }
      })
    },
    // 编辑
    handleEdit(user) {
      this.$refs.dialogTitle.innerHTML = "编辑用户";
      this.addOrEditForm.id = user.id;
      this.addOrEditForm.email = user.email;
      this.addOrEditForm.username = user.username;
      this.addOrEditForm.isDisabled = user.isDisabled;
      this.showAddOrEditDialog = true;
      this.getRequest("/admin/user/" + user.id + "/role").then(res => {
        if (res.data.flag) {
          this.addOrEditForm.roleId = res.data.data.id;
        }
      })
    },
    // 批量删除
    handleDeleteBath() {
      this.handleDelete(this.selectedUserIdList)
    },
    // 删除
    handleDelete(userIds) {
      if (!Array.isArray(userIds)) {
        userIds = [userIds]
      }
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/admin/user", userIds).then(res => {
          if (res.data.flag) {
            this.$notify.success(res.data.message);
            this.doSearch();
          } else {
            this.$notify.error(res.data.message);
          }
        })
      }).catch(() => {
        this.$notify.info('已取消删除');
      });
    },
    // 新增用户
    handleAdd() {
      this.initAddOrEditForm();
      this.showAddOrEditDialog = true;
      this.$refs.dialogTitle.innerHTML = '新增用户';
    },
    // 新增或修改
    doSaveOrUpdate() {
      this.$refs.addOrEditForm.validate((valid) => {
        if (valid) {
          this.postRequest("/admin/user", this.addOrEditForm).then(res => {
            if (res.data.flag) {
              this.$notify.success(res.data.message);
              this.doSearch();
            } else {
              this.$notify.error(res.data.message);
            }
            this.showAddOrEditDialog = false;
          });
        } else {
          this.$notify.error("请检查输入项");
          return false;
        }
      })
    },
    // 搜索后台用户
    doSearch() {
      this.loading = true
      let params = {
        current: this.current,
        size: this.size,
        ...this.searchForm
      }
      this.getRequest("/admin/users", params).then(({data}) => {
        if (data.flag) {
          this.userList = data.data.records;
          this.total = data.data.total;
        } else {
          this.$message.error(data.message);
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
  },
  computed: {},
}
</script>

<style scoped>

</style>