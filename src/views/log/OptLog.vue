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
        <!--        所属模块-->
        <el-form-item label="所属模块" prop="module">
          <el-input
              v-model="searchForm.module"
              placeholder="请输入模块名"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--        操作用户-->
        <el-form-item label="操作用户" prop="username">
          <el-input
              v-model="searchForm.username"
              placeholder="请输入用户名"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--        操作状态-->
        <el-form-item label="操作状态" prop="status">
          <el-select v-model="searchForm.status">
            <el-option label="全部" :value="null">全部</el-option>
            <el-option label="正常" :value="0">正常</el-option>
            <el-option label="禁用" :value="1">禁用</el-option>
          </el-select>
        </el-form-item>
        <!--        操作时间-->
        <el-form-item label="操作时间" prop="datePickerVals">
          <el-date-picker
              v-model="searchForm.datePickerVals"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doSearch" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="refreshSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <!--      新增， 删除，刷新-->
      <div class="operation-adu-container">
        <!--        批量删除-->
        <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="selectedOperationLogIds.length === 0"
            @click="handleDeleteAll"
        >{{ selectedOperationLogIds.length > 1 ? '批量删除' : '删除' }}
        </el-button>

        <RightToolbar
            :show-search.sync="showSearch"
            @queryTable="doSearch"
        />
      </div>
    </div>
    <el-card>
      <el-empty v-loading="loading" v-if="!logList || logList.length === 0" description="没有查询到日志..."/>
      <el-table
          :data="logList"
          v-else
          v-loading="loading"
          @selection-change="handleSelectionChange"
      >
        <!--        多选-->
        <el-table-column
            type="selection"
            width="50"
            align="center"
        />
        <!--        用户ID-->
        <el-table-column
            prop="userId"
            label="用户ID"
            align="center"
            show-overflow-tooltip
        />
        <!--        操作用户-->
        <el-table-column
            prop="username"
            label="操作用户"
            align="center"
            show-overflow-tooltip
        />
        <!--        操作模块-->
        <el-table-column
            prop="module"
            label="操作模块"
            align="center"
            show-overflow-tooltip
        />
        <!--        操作类型-->
        <el-table-column
            prop="type"
            label="操作类型"
            align="center"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type && scope.row.type.length > 0" type="success">{{ scope.row.type }}</el-tag>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <!--        请求方法-->
        <el-table-column
            prop="method"
            label="请求方法"
            align="center"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.method === 'POST'">
              <el-tag type="success">POST</el-tag>
            </span>
            <span v-else-if="scope.row.method === 'PUT'">
              <el-tag type="warning">PUT</el-tag>
            </span>
            <span v-else-if="scope.row.method === 'DELETE'">
              <el-tag type="danger">DELETE</el-tag>
            </span>
            <span v-else-if="scope.row.method === 'GET'">
              <el-tag type="info">GET</el-tag>
            </span>
            <span v-else>
              <el-tag>未知</el-tag>
            </span>
          </template>
        </el-table-column>
        <!--        请求资源-->
        <el-table-column
            prop="url"
            label="请求资源"
            align="center"
            show-overflow-tooltip
        />
        <!--        处理方法-->
        <el-table-column
            prop="handler"
            label="处理方法"
            align="center"
            show-overflow-tooltip
        />

        <!--        操作状态-->
        <el-table-column
            prop="status"
            label="操作状态"
            align="center"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
                v-if="scope.row.status === 1"
                type="success"
            >成功
            </el-tag>
            <el-tag
                v-else
                type="danger"
            >失败
            </el-tag>
          </template>
        </el-table-column>
        <!--        操作描述-->
        <el-table-column
            prop="des"
            label="操作描述"
            align="center"
            show-overflow-tooltip
        />
        <!--        操作时间-->
        <el-table-column
            prop="createTime"
            label="操作时间"
            align="center"
            width="180"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateTime }}</span>
          </template>
        </el-table-column>

        <!--        操作-->
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="mini"
                icon="el-icon-search"
                @click="openLogInfoDialog(scope.row)"
            >详细信息
            </el-button>
            <el-button
                type="text"
                style="color: red"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.id)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页栏-->
      <el-pagination
          class="pagination-container"
          hide-on-single-page
          @size-change="onSizeChange"
          @current-change="onCurChange"
          :current-page="current"
          :page-size="size"
          :total="total"
          :page-sizes="[10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>
    <el-dialog
        :visible.sync="showLogInfoDialog"
        title="日志详细信息"
        width="70%"
    >
      <el-form
          class="info-dialog-form"
          :model="logInfoForm"
          label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户ID:">
              {{ logInfoForm.userId }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作用户:">
              <el-tag type="primary">{{ logInfoForm.username }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作模块:">
              {{ logInfoForm.module }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作类型:">
              <el-tag type="primary">{{ logInfoForm.type }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方法:">
              <el-tag type="primary">{{ logInfoForm.method }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求资源:">
              <el-tag type="primary">{{ logInfoForm.url }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理方法:">
              <span v-html="calMethodHtml"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态:">
              <el-tag
                  v-if="logInfoForm.status === 1"
                  type="success"
              >成功
              </el-tag>
              <el-tag
                  v-else
                  type="danger"
              >失败
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作描述:">
              {{ logInfoForm.des }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间:">
              {{ logInfoForm.createTime | dateTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作IP:">
              {{ logInfoForm.ip }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作地点:">
              {{ logInfoForm.location }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浏览器:">
              {{ logInfoForm.browser }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作系统:">
              {{ logInfoForm.os }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数:">
              <el-input
                  type="textarea"
                  :rows="4"
                  :value="logInfoForm.params"
                  readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回结果:">
              <el-input
                  type="textarea"
                  :rows="4"
                  :value="logInfoForm.result"
                  readonly
              />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import RightToolbar from "@/components/RightToolbar";

export default {
  name: 'OptLog',
  components: {RightToolbar},
  created() {
    this.doSearch();
  },
  mounted() {
  },
  data() {
    return {
      showSearch: true,
      showLogInfoDialog: false,
      logInfoForm: {
        userId: '',
        username: '',
        module: '',
        type: '',
        method: '',
        url: '',
        handler: '',
        status: '',
        des: '',
        createTime: '',
        params: '',
        result: '',
      },
      loading: false,
      current: 0,
      size: 10,
      total: 0,
      searchForm: {
        module: '',
        username: '',
        status: null,
        datePickerVals: []
      },
      selectedOperationLogIds: [],
      logList: [],
    }
  },
  methods: {
    // 打开日志详情对话框
    openLogInfoDialog(log) {
      this.showLogInfoDialog = true;
      this.initLogInfoDialog();
      this.logInfoForm = {
        ...log
      };
    },
    // 搜索
    doSearch() {
      this.loading = true;
      let params = {
        current: this.current,
        size: this.size,
        module: this.searchForm.module.trim().length === 0 ? null : this.searchForm.module,
        username: this.searchForm.username.trim().length === 0 ? null : this.searchForm.username,
        status: this.searchForm.status,
        startTime: this.searchForm.datePickerVals[0],
        endTime: this.searchForm.datePickerVals[1]
      }
      this.getRequest("/admin/log/operation", params).then(({data}) => {
        if (data.flag) {
          this.logList = data.data.records;
          this.total = data.data.total;
        } else {
          this.$message.error(data.message);
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleDeleteAll() {
      this.handleDelete(this.selectedOperationLogIds);
    },
    handleDelete(logIds) {
      if (!Array.isArray(logIds)) {
        logIds = [logIds];
      }
      this.$confirm(this.selectedOperationLogIds.length > 0 ? '此操作将永久删除所选用户, 是否继续?' : '此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/admin/log/operation", logIds).then(res => {
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
    refreshSearch() {
      this.initPage();
      this.initSearchForm();
      this.doSearch()
    },
    initPage() {
      this.current = 0;
      this.size = 10;
      this.total = 0;
    },
    initSearchForm() {
      this.searchForm = {
        module: '',
        username: '',
        status: null,
        datePickerVals: []
      }
    },
    initLogInfoDialog() {
      this.logInfoForm = {
        userId: '',
        username: '',
        module: '',
        type: '',
        method: '',
        url: '',
        handler: '',
        status: '',
        des: '',
        createTime: '',
        params: '',
        result: '',
      }
    },
    handleSelectionChange(newVals) {
      this.selectedOperationLogIds = newVals.map(item => item.id);
    },
    onSizeChange(newSize) {
      this.size = newSize;
      this.doSearch();
    },
    onCurChange(newCur) {
      this.current = newCur;
      this.doSearch();
    },
  },
  computed: {
    calMethodHtml() {
      const handler = this.logInfoForm.handler;
      let index = handler.lastIndexOf('#');
      return `${handler.substring(0, index)}<b>${handler.substring(index)}()</b>`
    },
  },
}
</script>

<style scoped>

</style>