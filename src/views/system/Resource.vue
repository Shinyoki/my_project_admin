<template>
  <div class="main-container">
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
        <!--        资源名-->
        <el-form-item label="资源名" prop="resourceName">
          <el-input
              v-model="searchForm.resourceName"
              placeholder="请输入资源名"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>

        <!--        资源路径-->
        <el-form-item label="资源路径" prop="url">
          <el-input
              v-model="searchForm.url"
              placeholder="请输入资源路径"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--        请求方式-->
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="searchForm.method">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
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
            type="success"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(null)"
        >新增
        </el-button>
        <RightToolbar
            :show-search.sync="showSearch"
            @queryTable="doSearch"
        />
      </div>
    </div>
    <el-card>
      <el-empty v-loading="loading" v-if="!resourceTree || resourceTree.length === 0" description="没有查询到日志..."/>
      <el-table
          :data="resourceTree"
          v-else
          v-loading="loading"
          row-key="id"
          :stripe="true"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <!--        名称-->
        <el-table-column
            prop="resourceName"
            label="接口名称"
            fixed
            show-overflow-tooltip
            min-width="170"
        />
        <!--        资源路径-->
        <el-table-column
            prop="url"
            label="资源路径"
            show-overflow-tooltip
            min-width="170"
        >
          <template slot-scope="scope">
            <b>{{ scope.row.url }}</b>
          </template>
        </el-table-column>
        <!--        请求方式-->
        <el-table-column
            prop="method"
            label="请求方式"
            show-overflow-tooltip
            min-width="170"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.method === 'GET'" type="success">GET</el-tag>
            <el-tag v-else-if="scope.row.method === 'POST'" type="info">POST</el-tag>
            <el-tag v-else-if="scope.row.method === 'PUT'" type="warning">PUT</el-tag>
            <el-tag v-else-if="scope.row.method === 'DELETE'" type="danger">DELETE</el-tag>
            <el-tag v-else-if="scope.row.method === 'UPDATE'" type="primary">UPDATE</el-tag>
          </template>
        </el-table-column>
        <!--匿名访问-->
        <el-table-column
            prop="isAnonymous"
            label="可匿名访问"
            show-overflow-tooltip
            min-width="170"
        >
          <template slot-scope="scope">
            <el-tooltip
                placement="top"
                :content="scope.row.isAnonymous === 0 ? '不可匿名访问' : '匿名访问'"
            >
              <el-switch
                  v-model="scope.row.isAnonymous"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleUpdateAnonymous(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!--        操作-->
        <el-table-column
            label="操作"
            fixed="right"
            width="200"
        >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="mini"
                icon="el-icon-plus"
                v-if="scope.row.resourceType == 0"
                @click="handleAdd(scope.row)"
            >新增
            </el-button>
            <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                style="color: #F56C6C"
                @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
        title="资源管理"
        :visible.sync="showAddOrEditDialog"
        width="50%"
    >
      <div
          class="dialog-title-container"
          slot="title"
          ref="addOrEditDialogTitle"
      />
      <el-form
          @close="handleCloseDialog"
          ref="addOrEditForm"
          :model="addOrEditForm"
          class="info-dialog-form"
          label-width="120px"
          :rules="rules"
      >
        <el-form-item label="所属模块:" prop="module">
          <el-tag><b>{{ addOrEditForm.module }}</b></el-tag>
        </el-form-item>
        <el-form-item label="资源类型" prop="resourceType">
          <el-select
              v-model="addOrEditForm.resourceType"
              placeholder="请选择资源类型"
          >
            <el-option label="模块" :value="0"></el-option>
            <el-option label="接口" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求方式:" v-if="addOrEditForm.resourceType == 1" prop="method">
          <el-select v-model="addOrEditForm.method" placeholder="请选择请求方式">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="resourceName">
          <span slot="label">
                <el-tooltip :content="addOrEditForm.resourceType == 1? `接口名称，如'获取用户接口'` : `模块名称，如'用户模块'`"
                            placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                {{ addOrEditForm.resourceType == 1 ? '接口名称:' : '模块名称:' }}
          </span>
          <el-input
              v-model="addOrEditForm.resourceName"
              :placeholder="addOrEditForm.resourceType == 1 ? '请输入接口名称' : '请输入模块名称'"
          />
        </el-form-item>
        <!--        用户角色-->
        <el-form-item v-if="addOrEditForm.resourceType == 1" prop="roles">
          <el-select
              v-model="addOrEditForm.roles"
              multiple
              placeholder="请选择角色"
          >
            <el-option
                v-for="(item, index) of roleList"
                :key="index"
                :label="item.roleLabel"
                :value="item.id"
            >
            </el-option>
          </el-select>
          <span slot="label">
                <el-tooltip content="角色集合，指定谁可以访问该菜单，默认是'admin'" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                角色集合
          </span>
        </el-form-item>
        <el-form-item label="资源路径:" v-if="addOrEditForm.resourceType == 1" prop="url">
          <span slot="label">
                <el-tooltip
                    content="资源路径，如'/user/getUser/*'"
                    placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                资源路径
          </span>
          <el-input
              v-model="addOrEditForm.url"
              placeholder="请输入资源路径"
          />
        </el-form-item>
        <el-form-item label="可匿名访问:" prop="isAnonymous">
          <el-tooltip
              placement="top"
              :content="addOrEditForm.isAnonymous === 0 ? '不可匿名访问' : '可匿名访问'"
          >
            <el-switch
                v-model="addOrEditForm.isAnonymous"
                :active-value="1"
                :inactive-value="0"
            />
          </el-tooltip>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleAddOrEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import RightToolbar from "@/components/RightToolbar";

export default {
  name: 'ResourceView',
  components: {RightToolbar},
  created() {
    this.doSearch();
    this.listRoleLabels();
  },
  mounted() {
  },
  data() {
    return {
      loading: false,
      showSearch: true,
      searchForm: {
        resourceName: null,
        url: null,
        method: null,
      },
      roleList: [],
      resourceTree: [],
      dialogForm: {
        id: null,
        resourceName: null,
        url: null,
        method: null,
        isAnonymous: null,
      },
      showAddOrEditDialog: false,
      addOrEditForm: {
        id: null,
        resourceName: null,
        url: null,
        method: 'GET',
        isAnonymous: 0,
        parentId: 0,
        module: null,
        resourceType: 1,
        roles: [],
      },
      rules: {
        resourceName: [
          {required: true, message: '请输入资源名称', trigger: 'blur'},
          {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
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
    handleCloseDialog() {
      this.showAddOrEditDialog = false;
      this.initAddOrEditForm();
    },
    initAddOrEditForm() {
      this.addOrEditForm = {
        id: null,
        resourceName: null,
        url: null,
        method: 'GET',
        isAnonymous: 0,
        parentId: 0,
        module: null,
        resourceType: 1,
        roles: [],
      }
    },
    // 显示全部的树
    doSearch() {
      this.loading = true;
      this.getRequest("/admin/resource/tree", this.searchForm).then(({data}) => {
        if (data.flag) {
          this.resourceTree = data.data;
        } else {
          this.$notify.error(data.message);
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    // 更新匿名访问
    handleUpdateAnonymous(row) {
      this.loading = true;
      let params = {
        id: row.id
      }
      this.putRequest("/admin/resource/anonymous/" + row.isAnonymous, params).then(({data}) => {
        if (data.flag) {
          this.$notify.success(data.message);
        } else {
          this.$notify.error(data.message);
          row.isAnonymous = !row.isAnonymous;
        }
        this.loading = false;
      }).catch(() => {
        row.isAnonymous = !row.isAnonymous;
        this.loading = false;
      })
    },
    // 删除接口
    handleDelete(resource) {
      if (resource.children && resource.children.length > 0) {
        this.$notify.error("请先删除子节点");
        return false;
      }
      this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.deleteRequest("/admin/resource/" + resource.id).then(({data}) => {
          if (data.flag) {
            this.$notify.success(data.message);
            this.doSearch();
          } else {
            this.$notify.error(data.message);
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      }).catch(() => {
      });
    },
    // 编辑接口
    handleEdit(resource) {
      this.initAddOrEditForm();
      this.$refs.addOrEditDialogTitle.innerHTML = "编辑资源";
      this.addOrEditForm.id = resource.id;
      this.addOrEditForm.resourceName = resource.resourceName;
      this.addOrEditForm.url = resource.url;
      this.addOrEditForm.method = resource.method;
      this.addOrEditForm.isAnonymous = resource.isAnonymous;
      this.addOrEditForm.parentId = resource.parentId;
      this.addOrEditForm.module = resource.resourceName;
      this.addOrEditForm.resourceType = resource.resourceType;
      this.getRequest("/admin/resource/" + resource.id + "/roles").then(({data}) => {
        if (data.flag) {
          if (data.data && data.data.length > 0) {
            this.addOrEditForm.roles = data.data.map(item => item.id);
          }
        }
      })
      if (this.addOrEditForm.resourceType == 1) {
        // 是接口，则检查接口
        this.rules = {
          resourceName: [
            {required: true, message: '请输入资源名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请输入接口地址', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
          ],
        };
      } else {
        this.rules = {
          resourceName: [
            {required: true, message: '请输入资源名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
        }
      }
      this.showAddOrEditDialog = true;

    },
    // 新增接口
    handleAdd(resource) {
      // if (resource && !resource.children) {
      //   this.$notify.error("不能为叶子节点添加子节点");
      //   return false;
      // }
      if (this.addOrEditForm.resourceType == 1) {
        // 是接口，则检查接口
        this.rules = {
          resourceName: [
            {required: true, message: '请输入资源名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请输入接口地址', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
          ],
        };
      } else {
        this.rules = {
          resourceName: [
            {required: true, message: '请输入资源名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
        }
      }
      this.initAddOrEditForm();
      this.$refs.addOrEditDialogTitle.innerHTML = "新增接口";
      if (resource) {
        // 存在，给模块添加子节点
        this.addOrEditForm.parentId = resource.id;
        this.addOrEditForm.module = resource.resourceName;
      } else {
        // 不存在，给根节点添加子节点
        this.addOrEditForm.parentId = 0;
        this.addOrEditForm.module = "根节点";
      }
      this.showAddOrEditDialog = true;
    },
    // 添加或删除
    handleAddOrEdit() {
      let params = {
        id: this.addOrEditForm.id,
        parentId: this.addOrEditForm.parentId,
        resourceName: this.addOrEditForm.resourceName,
        url: this.addOrEditForm.resourceType == 1 ? this.addOrEditForm.url : null,
        method: this.addOrEditForm.resourceType == 1 ? this.addOrEditForm.method : null,
        isAnonymous: this.addOrEditForm.isAnonymous,
        resourceType: this.addOrEditForm.resourceType,
        roleIds: this.addOrEditForm.roles,
      };
      if (!this.addOrEditForm.parentId) {
        // 不存在
        params.parentId = 0;
      }

      this.$refs.addOrEditForm.validate((valid) => {
        if (valid) {
          console.log("参数", params)
          this.postRequest("/admin/resource", params).then(({data}) => {
            if (data.flag) {
              this.$notify.success(data.message);
              this.doSearch();
              this.handleCloseDialog();
            } else {
              this.$notify.error(data.message);
            }
          }).catch(() => {
          })
        } else {
          this.$notify.error("请检查输入项是否正确");
          return false;
        }
      });

    },
    refreshSearch() {
      this.searchForm = {
        resourceName: null,
        url: null,
        method: null,
      };
      this.doSearch();
    },
  },
  computed: {},
}
</script>

<style scoped>

</style>