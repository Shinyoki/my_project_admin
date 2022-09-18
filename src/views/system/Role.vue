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
          :inline="true"
          size="small"
      >
        <!--        角色名称-->
        <el-form-item label="角色名称" prop="name">
          <el-input
              v-model="searchForm.roleName"
              placeholder="请输入角色名称"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--        角色标签-->
        <el-form-item label="角色标签" prop="label">
          <el-input
              v-model="searchForm.roleLabel"
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
      <div class="operation-adu-container">
        <!--        新增-->
        <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(null)"
        >添加
        </el-button>
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="selectedRoleIds.length !== 1"
          @click="handleEditOne"
          >编辑</el-button>
        <!--        批量删除-->
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDeleteAll"
        >批量删除
        </el-button>

        <RightToolbar
          :show-search.sync="showSearch"
          @queryTable="doSearch"
          />
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
        <el-table-column label="角色名" prop="roleName" align="center" fixed/>
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
            <el-tooltip
                placement="top"
                :content="scope.row.isDisabled === 1 ? '禁用' : '正常'"
            >
              <el-switch
                  v-model="scope.row.isDisabled"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-color="#67C23A"
                  active-color="#F56C6C"
                  @change="handleDisableUpdate(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!--        创建时间-->
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time mr-2"/>
            <span>{{ scope.row.createTime | date }}</span>
          </template>
        </el-table-column>
        <!--        操作-->
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="mini"
                v-if="scope.row.id != -1"
                @click="handleEditMenu(scope.row)"
                icon="el-icon-edit"
            >编辑菜单
            </el-button>
            <el-button
                type="text"
                size="mini"
                v-if="scope.row.id != -1"
                @click="handleEditResource(scope.row)"
                icon="el-icon-s-operation"
            >编辑资源
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleAssignment(scope.row.id)"
              icon="el-icon-s-custom"
              >角色授权
            </el-button>
            <el-button
                type="text"
                style="color: red"
                v-if="scope.row.id != -1"
                icon="el-icon-delete"
                @click="handleDeleteRole(scope.row.id)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      分页栏-->
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

    <!--    新增或编辑对话框-->
    <el-dialog
        :visible.sync="showAddOrEditDialog"
        width="50%"
        :before-close="handleClose"
    >
      <div
          slot="title"
          class="dialog-title-container"
          ref="dialogTitle"/>
      <!--      表单-->
      <el-form
          ref="addOrEditForm"
          :model="dialogForm"
          label-width="100px"
          :rules="dialogRules"
      >
        <el-row>
          <!--          角色名-->
          <el-col :span="24">
            <el-form-item label="角色名" prop="roleName">
              <span slot="label">
                <el-tooltip content="角色名，如 管理员" placement="top">
                  <i class="el-icon-question"/>
                </el-tooltip>
                角色名
              </span>
              <el-input
                  v-model="dialogForm.roleName"
                  placeholder="请输入角色名"
                  :disabled="formLock"
              />
            </el-form-item>
          </el-col>
          <!--          角色标签-->
          <el-col :span="24">
            <el-form-item label="角色标签" prop="roleLabel">
              <span slot="label">
                <el-tooltip content="角色标签，如 admin" placement="top">
                  <i class="el-icon-question"/>
                </el-tooltip>
                角色标签
              </span>
              <el-input
                  v-model="dialogForm.roleLabel"
                  placeholder="请输入角色标签"
                  :disabled="formLock"
              />
            </el-form-item>
          </el-col>
          <!--          角色状态-->
          <el-col :span="24">
            <el-form-item label="角色状态" prop="isDisabled">
              <el-tooltip :content="dialogForm.isDisabled === 1 ? '禁用' : '正常'" placement="top">
                <el-switch
                    v-model="dialogForm.isDisabled"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-color="#67C23A"
                    active-color="#F56C6C"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
<!--          角色菜单-->
          <el-col v-if="dialogForm.menus.length > 0" :span="24">
            <el-form-item label="可访菜单">
              <el-card>
                <el-tree
                    :data="dialogForm.menus"
                    show-checkbox
                    ref="menuTree"
                    node-key="id"
                    :default-checked-keys="selectedMenuIds"
                    :props="defaultProps">
                </el-tree>
              </el-card>
            </el-form-item>
          </el-col>
<!--          角色资源-->
          <el-col v-if="dialogForm.resources.length > 0" :span="24">
            <el-form-item label="可操作资源">
              <el-card>
                <el-tree
                    :data="dialogForm.resources"
                    show-checkbox
                    ref="resourceTree"
                    node-key="id"
                    :default-checked-keys="selectedResourceIds"
                    :props="defaultProps">
                </el-tree>
              </el-card>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import RightToolbar from "@/components/RightToolbar";
export default {
  name: 'RoleView',
  created() {
    this.doSearch();
  },
  components: {
    RightToolbar
  },
  mounted() {
  },
  data() {
    return {
      showSearch: true,
      loading: true,
      current: 0,           // 分页请求
      size: 10,
      total: 0,
      formLock: false,
      dialogForm: {
        id: null,
        roleName: '',
        roleLabel: '',
        isDisabled: 0,
        menus: [],
        resources: [],
      },
      selectedRoleIds: [],  // 选中的roles
      selectedMenuIds: [],
      selectedResourceIds: [],
      rules: {},
      searchForm: {
        // 搜索条件
        roleName: '',           // 角色名
        roleLabel: '',          // 角色标签 如 admin
        isDisabled: null,   // 角色状态
      },
      dialogRules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          {pattern: /^\S+$/, message: '不能包含空格', trigger: 'blur'},
        ],
        roleLabel: [
          {required: true, message: '请输入角色标签', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'},
          {pattern: /^\S+$/, message: '不能包含空格', trigger: 'blur'},
        ],
      },
      roleList: [],         // 数据
      showAddOrEditDialog: false, // 新增或编辑弹窗
      /**
       * Dialog状态：
       * 1：新增角色
       * 2：编辑角色
       * 3: 编辑角色可访菜单
       * 4: 编辑角色可操作资源
       */
      dialogStatus: 1,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 角色授权
    handleAssignment(roleId) {
      this.$router.push({path: '/role/' + roleId + '/users'})
    },
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
      this.selectedRoleIds = newVals.map(role => {
        return {
          id: role.id,
          roleName: role.roleName,
          roleLabel: role.roleLabel,
          isDisabled: role.isDisabled,
        }
      })
    },
    // 删除角色
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
    initDialogForm() {
      this.dialogForm = {
        id: null,
        roleName: '',
        roleLabel: '',
        isDisabled: 0,
        menus: [],
        resources: [],
      }
      this.selectedMenuIds = [];
      this.selectedResourceIds = [];
    },
    // 新增或更新
    saveOrUpdateForm() {
      // TODO 提交表单
      let params = {
        id: this.dialogForm.id,
        roleName: this.dialogForm.roleName,
        roleLabel: this.dialogForm.roleLabel,
        isDisabled: this.dialogForm.isDisabled,
        operateMode: this.dialogStatus
      }
      console.log("状态：" + this.dialogStatus)
      switch (this.dialogStatus) {
        case 3:
          // eslint-disable-next-line no-case-declarations
          params.checkedMenuIds = this.$refs.menuTree.getCheckedNodes(false, true).map(node => {
            return node.id;
          });
          break;
        case 4:
          params.checkedResourceIds = this.$refs.resourceTree.getCheckedNodes(false, true).map(node => {
            return node.id;
          });
          break;
      }
      console.log("提交表单");
      console.log(params)
      this.$refs.addOrEditForm.validate((valid) => {
        if (valid) {
          this.postRequest("/admin/role", params).then(res => {
            if (res.data.flag) {
              this.$notify.success("操作成功");
              this.showAddOrEditDialog = false;
              this.doSearch();
            } else {
              this.$notify.error(res.data.message);
            }
          });
        } else {
          this.$notify.error("请检差表单是否填写完整");
          return false;
        }
      });
    },
    // 凸(艹皿艹 )，你妈的，axios为什么会解析Long时出现精度丢失啊，只能用字符串了
    // 关键是我还没找到其他法解决，真的不想每次都手动加个字符串解析啊 ['1','2']
    parseStringList2IntList(stringIdList) {
      let longIdList = [];
      stringIdList.forEach(id => {
        longIdList.push(parseInt(id));
      });
      return longIdList;
    },
    // 编辑单个
    handleEditOne() {
      this.dialogStatus = 2;
      if (this.selectedRoleIds.findIndex(role => role.id == -1) !== -1) {
        this.$notify.error("不能编辑超级管理员");
        return false;
      }
      this.$refs.dialogTitle.innerHTML = "编辑角色";
      this.initDialogForm();
      const params = this.selectedRoleIds[0]
      this.dialogForm.id = params.id;
      this.dialogForm.roleName = params.roleName;
      this.dialogForm.roleLabel = params.roleLabel;
      this.dialogForm.isDisabled = params.isDisabled;
      this.showAddOrEditDialog = true;
    },
    // 编辑资源
    handleEditResource(role) {
      this.dialogStatus = 4;
      this.initDialogForm();
      this.$refs.dialogTitle.innerHTML = "编辑可访资源";
      this.getRequest("/admin/role/resources/" + role.id).then(res => {
        if (res.data.flag) {
          this.selectedResourceIds = this.parseStringList2IntList(res.data.data.checkedIds);
          this.dialogForm.resources = res.data.data.resourceTree;
        } else {
          this.$notify.error(res.data.message);
        }
      });
      this.basicHandle(role);
    },
    // 编辑
    handleEditMenu(role) {
      this.dialogStatus = 3;
      this.initDialogForm()
      // 设置Menu
      this.getRequest("/admin/role/menus/" + role.id).then(res => {
        if (res.data.flag) {
          this.selectedMenuIds = this.parseStringList2IntList(res.data.data.checkedIds);
          this.dialogForm.menus = res.data.data.menuTree
        } else {
          this.$notify.error(res.data.message);
        }
      })
      this.basicHandle(role);
      this.$refs.dialogTitle.innerHTML = '编辑角色可访菜单'
    },
    basicHandle(role) {
      this.dialogForm.id = role.id
      this.dialogForm.roleName = role.roleName
      this.dialogForm.roleLabel = role.roleLabel
      this.dialogForm.isDisabled = role.isDisabled
      this.showAddOrEditDialog = true
      this.formLock = true;
    },
    // 批量删除
    handleDeleteAll() {
      if (!this.selectedRoleIds || this.selectedRoleIds.length <= 0) {
        this.$notify.error("请至少选择一个再删除吧");
        return false;
      }
      if (this.selectedRoleIds.findIndex(role => role.id == -1) !== -1) {
        this.$notify.error("不能删除超级管理员");
        return false;
      }
      this.$confirm('此操作将永久删除选中的角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let roleIds = this.selectedRoleIds.map(role => {
          return role.id;
        })
        this.deleteRequest("/admin/roles", roleIds).then(res => {
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
    // 添加
    handleAdd() {
      this.dialogStatus = 1
      this.formLock = false
      this.showAddOrEditDialog = true;
      this.$refs.dialogTitle.innerHTML = "新增角色";
      // 初始化数据
      this.initDialogForm()

    },
    handleClose() {
      this.formLock = false
      this.showAddOrEditDialog = false;
    },
    // 重置搜索
    refreshSearch() {
      this.formLock = false;
      this.current = 0;
      this.searchForm.roleName = '';
      this.searchForm.roleLabel = '';
      this.searchForm.isDisabled = null;
      this.doSearch();
    },
    // 搜索结果
    doSearch() {
      this.formLock = false;
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
      }).catch(() => {
        this.loading = false;
      })
    },
  },
  computed: {},
}
</script>

<style scoped>

</style>