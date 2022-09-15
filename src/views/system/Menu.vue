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
            @click="handleAdd(null)"
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
        <el-table-column
            prop="menuType"
            label="菜单类型"
            min-width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.menuType === 0" size="mini" type="primary">目录</el-tag>
            <el-tag v-else-if="scope.row.menuType === 1" size="mini">菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="id"
            label="菜单ID"
            min-width="70"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.id === 0" type="success">根节点</el-tag>
            <span v-else>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
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
            <el-tag v-if="scope.row.isHidden === 0" size="mini" type="success">显示</el-tag>
            <el-tag v-else type="danger" size="mini">隐藏</el-tag>
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
            <i class="el-icon-time mr-2" />
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
            <i class="el-icon-time mr-2"/>
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
                v-if="scope.row.menuType === 0"
                @click="handleAdd(scope.row)"
            >新增
            </el-button>
            <el-button
                type="text"
                size="mini"
                @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
                type="text"
                size="mini"
                style="color: red"
                @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!--    添加表单-->
    <el-dialog
        title="添加菜单"
        :visible.sync="showAddOrEditDialog"
        width="70%"
        :before-close="handleClose"
        append-to-body
    >
<!--      标题-->
      <div
          class="dialog-title-container"
          slot="title"
          ref="addOrEditDialog"
          />
      <el-form
          ref="addOrEditForm"
          :model="dialogForm"
          label-width="120px"
          :rules="rules"
      >
        <el-row>
          <!--          父id：占据一整行-->
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <TreeSelect
                  :disabled="lock"
                  v-model="dialogForm.parentId"
                  :multiple="false"
                  :options="menuOptions"
                  :normalizer="myNormalizer"
              />
            </el-form-item>
          </el-col>
          <!--         菜单类型：占据一整行 -->
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="dialogForm.menuType">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否隐藏" prop="isHidden">
              <el-radio-group v-model="dialogForm.isHidden">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--          菜单图标：占据一整行-->
          <el-col :span="24">
            <el-form-item :label="dialogForm.menuType === 0 ? '目录图标' : '菜单图标'" prop="icon">
              <el-popover
                  placement="bottom-start"
                  width="460"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
              >
                <IconSelector
                    ref="iconSelect"
                    @selected="selected"
                />
                <el-button slot="reference">
                  <span v-if="!dialogForm.icon">选择图标</span>
                  <i v-if="dialogForm.icon" :class="`iconfont ` + dialogForm.icon"/>
                  <span v-if="dialogForm.icon"> {{ dialogForm.icon }}</span>
                </el-button>
              </el-popover>
            </el-form-item>
          </el-col>
          <!--          菜单名称：占据半行-->
          <el-col :span="12">
            <el-form-item prop="name">
              <el-input :placeholder="dialogForm.menuType === 0 ? '请输入目录名称' : '请输入菜单名称'" v-model="dialogForm.name"/>
              <span slot="label">
                <el-tooltip content="菜单/目录的名字，如 '首页'" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                {{ dialogForm.menuType === 0 ? '目录名称' : '菜单名称' }}
              </span>
            </el-form-item>
          </el-col>
          <!--          菜单排序等级：占据半行-->
          <el-col :span="12">
            <el-form-item prop="orderNum">
              <el-input-number v-model="dialogForm.orderNum" :min="0" :max="10"/>
              <span slot="label">
                <el-tooltip content="显示优先级，越低越先于其他菜单显示" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                显示优先级
              </span>
            </el-form-item>
          </el-col>
          <!--          路由地址-->
          <el-col :span="12">
            <el-form-item prop="path">
              <el-input placeholder="请输入路由地址" v-model="dialogForm.path"/>
              <span slot="label">
                <el-tooltip content="菜单的请求地址，如 /menu，用户访问该地址就可以进入到相应的组件" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
            </el-form-item>
          </el-col>
          <!--          组件地址-->
          <el-col v-if="dialogForm.menuType === 1" :span="12">
            <el-form-item label="组件地址" prop="component">
              <el-input placeholder="请输入组件地址" v-model="dialogForm.component"/>
              <span slot="label">
                <el-tooltip content="组件地址，如'Menu.vue'视图的相对路径为'/system/'，那么此处的值就是'/system/Menu'" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                组件地址
              </span>
            </el-form-item>
          </el-col>
          <!--          角色集合-->
          <el-col :span="24">
            <el-form-item label="角色集合" prop="roles">
              <el-select
                  v-model="dialogForm.roles"
                  multiple
                  placeholder="请选择角色"
              >
                <el-option
                    v-for="(item, index) of roles"
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
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrUpdateForm">确定</el-button>
        <el-button @click="showAddOrEditDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// https://blog.csdn.net/qq_60035188/article/details/124936953
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import TreeSelect from "@riophae/vue-treeselect"
import IconSelector from "@/components/IconSelector";

export default {
  name: 'MenuView',
  components: {IconSelector, TreeSelect},
  created() {
    this.doSearch().then(res => {
      this.getTreeSelectOptions(res)
      this.getRoleLabels()
    })
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
      showAddOrEditDialog: false,  // 显示 添加/编辑 菜单的对话框
      dialogForm: {       // 添加/编辑 菜单的对话框表单
        id: null,
        name: '',
        icon: '',
        path: '',
        component: '',
        roles: [],
        menuType: 0,
        parentId: 0,
        isHidden: 0,
        orderNum: 0,
      },
      lock: false,
      roles: [],
      rules: {            // 表单验证规则
        name: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ],
        path: [
          {required: true, message: '请输入路由地址', trigger: 'blur'},
        ],
        component: [
          {required: true, message: '请输入组件地址', trigger: 'blur'},
        ],
        roles: [
          {required: true, message: '请输入角色', trigger: 'blur'},
          {type: 'array', min: 1, message: '至少选择一个角色', trigger: 'blur'}
        ],
        orderNum: [
          {required: true, message: '请输入显示优先级', trigger: 'blur'},
        ],
      },
      menuOptions: [
        {
          id: 0,
          label: '主目录'
        }
      ],
      // define the default value
      value: null,
      // define options
      options: [],
    }
  },
  methods: {
    // 为menu查询角色标签
    getRoleOfMenu(menuId) {
      if (menuId) {
        this.getRequest("/admin/menu/" + menuId + "/roles").then(res => {
          if (res.data.flag) {
            this.dialogForm.roles = []
            res.data.data.forEach(item => {
              this.dialogForm.roles.push(item.id)
            })
          }
        })
      }
    },
    // 新增
    handleAdd(menu) {
      this.lock = false
      this.$refs.addOrEditDialog.innerHTML = "添加菜单"
      this.initDialogForm();
      if (menu) {
        this.lock = true
        // 给自己添加子菜单
        this.dialogForm.parentId = menu.id
      }

      this.showAddOrEditDialog = true;
    },
    // 编辑
    handleEdit(menu) {
      this.lock = true
      this.$refs.addOrEditDialog.innerHTML = "编辑菜单"
      this.dialogForm.icon = menu.icon
      this.dialogForm.name = menu.name
      this.dialogForm.path = menu.path
      this.dialogForm.component = menu.component
      this.dialogForm.menuType = menu.menuType
      this.dialogForm.parentId = menu.parentId
      this.dialogForm.isHidden = menu.isHidden
      this.dialogForm.orderNum = menu.orderNum
      this.dialogForm.id = menu.id

      this.getRoleOfMenu(menu.id)
      this.showAddOrEditDialog = true;
    },
    // 关闭 添加/编辑 菜单的对话框
    handleClose() {
      this.showAddOrEditDialog = false
      this.initDialogForm()
    },
    // 提交表单
    saveOrUpdateForm() {

      this.$refs.addOrEditForm.validate(valid => {
        if (valid) {

          // 配置默认参数
          if (this.dialogForm.parentId === undefined || this.dialogForm.parentId < 0) {
            // 改回主目录
            this.dialogForm.parentId = 0;
          }
          if (this.dialogForm.menuType === 0) {
            this.dialogForm.component = 'Layout';
          }
          if (!this.dialogForm.icon || this.dialogForm.icon.length <= 0) {
            this.dialogForm.icon = 'icon-zhuye'
          }

          // valid
          this.postRequest("/admin/menu", this.dialogForm).then(res => {
            let h = this.$createElement;
            if (res.data.flag) {
              this.$notify({
                title: '操作成功',
                message:
                    h('div', null, [
                      h('div', null, '检测到您更新了表单，是否选择刷新页面以更新侧边栏？'),
                      h('span',
                          {
                            class: {
                              'my-button': true
                            },
                            on: {
                              click: () => {
                                window.location.reload();
                              }
                            }
                          },
                          '刷新')
                    ]),
                position: 'bottom-right',
              })

              this.doSearch();
              this.showAddOrEditDialog = false
            } else {
              this.$message.error(res.data.message)
            }
          });
        } else {
          this.$notify.warning("请填写完整表单")
        }
      })
    },
    // 关闭 添加/编辑 菜单的对话框
    cancelSaveOrUpdateForm() {
      this.$notify.success("取消了")
      this.showAddOrEditDialog = false
      this.initDialogForm();
    },
    // 查询角色集合
    getRoleLabels() {
      this.getRequest("/admin/roles/labels").then(res => {
        if (res.data.flag) {
          this.roles = res.data.data
        }
      })
    },
    // 选择icon的回调函数
    selected(icon) {
      this.dialogForm.icon = icon
      this.$forceUpdate();
    },
    // 为treeSelect组件准备数据
    getTreeSelectOptions(menus) {
      if (menus) {
        this.handleSelectionOptions(menus);
      } else {
        const _this = this;
        this.getRequest('/admin/menus').then(res => {
          if (res.data.flag) {
            _this.handleSelectionOptions(res.data.data);
          }
        });
      }
    },
    handleSelectionOptions(menus) {
      // 获取菜单成功
      const menu = {id: 0, name: '主目录', children: []};
      // 构建树形菜单
      menu.children = this.handleTree(menus);
      this.menuOptions = [menu]
    },
    // 我的数据格式化器
    myNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      if (node.menuType === 1) {
        return null
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    // 初始化Dialog表单
    initDialogForm() {
      this.dialogForm = {
        name: '',
        value: '',
        path: '',
        menuType: 0,
        component: '',
        isHidden: 0,
        parentId: 0,
        orderNum: 0,
        roles: []
      }
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
            // window.loading.reload()
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
      return new Promise(resolve => {
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
          resolve(res.data.data)
        })
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
  computed: {},
}
</script>

<style scoped>
.my-button {

  color: #fff;
  background-color: #409EFF;
  border-radius: 4px;
  transition: all .5s;
  cursor: pointer;
  padding: 10px 20px;
  float: right;
}

.my-button:hover {
  background-color: #66B1FF;
}
</style>