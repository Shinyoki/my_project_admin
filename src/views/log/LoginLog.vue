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
        <!--        操作用户-->
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="searchForm.username"
              placeholder="请输入用户名"
              clearable
              @keyup.enter.native="doSearch"
          />
        </el-form-item>
        <!--        操作状态-->
        <el-form-item label="登录状态" prop="status">
          <el-select v-model="searchForm.status">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="失败" :value="0"></el-option>
            <el-option label="成功" :value="1"></el-option>
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
        <!--        操作用户-->
        <el-table-column
            prop="username"
            label="用户名"
            align="center"
            show-overflow-tooltip
        />
        <!--        填写密码-->
        <el-table-column
            prop="password"
            label="填写密码"
            align="center"
            show-overflow-tooltip
        />
        <!--        登录状态-->
        <el-table-column
            prop="status"
            label="登录状态"
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
            prop="message"
            label="登录消息"
            align="center"
            show-overflow-tooltip
        />
        <!--        登录地址-->
        <el-table-column
            prop="location"
            label="登录地址"
            align="center"
            show-overflow-tooltip
        />
        <!--        浏览器-->
        <el-table-column
            prop="browser"
            label="浏览器"
            align="center"
            show-overflow-tooltip
        />
        <!--        操作系统-->
        <el-table-column
            prop="os"
            label="操作系统"
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
  </div>
</template>

<script>
import RightToolbar from "@/components/RightToolbar";

export default {
  name: 'LoginLog',
  components: {RightToolbar},
  created() {
    this.doSearch();
  },
  mounted() {
  },
  data() {
    return {
      showSearch: true,
      logInfoForm: {
        id: null,
        username: '',
        message: '',
        status: '',
        ip: '',
        location: '',
        browser: '',
        os: '',
        createTime: '',
      },
      loading: false,
      current: 0,
      size: 10,
      total: 0,
      searchForm: {
        username: '',
        status: null,
        datePickerVals: []
      },
      selectedOperationLogIds: [],
      logList: [],
    }
  },
  methods: {
    // 搜索
    doSearch() {
      this.loading = true;
      let params = {
        current: this.current,
        size: this.size,
        username: this.searchForm.username.trim().length === 0 ? null : this.searchForm.username,
        status: this.searchForm.status,
        startTime: this.searchForm.datePickerVals[0],
        endTime: this.searchForm.datePickerVals[1]
      }
      this.getRequest("/admin/log/login", params).then(({data}) => {
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
        this.deleteRequest("/admin/log/login", logIds).then(res => {
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
  computed: {},
}
</script>

<style scoped>

</style>