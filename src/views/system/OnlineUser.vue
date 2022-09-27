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
        <el-form-item label="用户名称" prop="username">
          <el-input
              v-model="searchForm.username"
              placeholder="请输入用户名称"
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
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="!selectedSessionIdList || selectedSessionIdList.length === 0"
            @click="handleKickOutAll">
          批量下线
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
          v-if="userList == null || userList.length <= 0"
          description="暂无数据"
      />
      <el-table
          v-else
          v-loading="loading"
          :data="users2Render"
          @selection-change="handleSelectChange"
      >
        <!--        多选-->
        <el-table-column type="selection" align="center" width="55"/>
        <el-table-column label="会话编号" prop="sessionUID" show-overflow-tooltip/>
        <el-table-column label="用户名" prop="username" show-overflow-tooltip/>
        <el-table-column label="用户昵称" prop="nickname" show-overflow-tooltip/>
        <el-table-column label="最后登录时间" prop="lastLoginTime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.lastLoginTime | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作系统" prop="os" show-overflow-tooltip/>
        <el-table-column label="浏览器" prop="browser" show-overflow-tooltip/>
        <el-table-column label="登录IP" prop="ip" show-overflow-tooltip/>
        <el-table-column label="登录地点" prop="location" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="!scope.row.location">尚未记录</span>
            <span v-else>{{ scope.row.location }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                style="color: red"
                icon="el-icon-edit"
                @click="handleKickOut(scope.row.sessionUID)"
            >下线
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          hide-on-single-page
          class="pagination-container"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
  name: 'OnlineUser',
  created() {
    this.doSearch();
  },
  mounted() {
  },
  data() {
    return {
      loading: false,
      showSearch: true,
      searchForm: {
        username: '',
      },
      userList: [],
      current: 1,
      size: 10,
      total: 0,
      selectedSessionIdList: [],
      users2Render: [],
    }
  },
  methods: {
    doSearch() {
      this.loading = true;
      this.getRequest("/admin/online/users", this.searchForm).then(res => {
        this.loading = false;
        if (res.data.data) {
          this.userList = res.data.data;
          this.total = this.userList.length
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.msg
          });
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    handleSizeChange(newSize) {
      this.size = newSize;
      this.users2Render = this.userList.slice((this.current - 1) * this.size, this.current * this.size);
    },
    handleCurrentChange(newPage) {
      this.current = newPage;
      this.users2Render = this.userList.slice((this.current - 1) * this.size, this.current * this.size);
    },
    refreshSearch() {
      this.searchForm = {
        username: '',
      }
      this.doSearch();
    },
    handleSelectChange(newVals) {
      this.selectedSessionIdList = newVals.map(item => item.sessionUID);
    },
    handleKickOutAll() {
      this.handleKickOut(this.selectedSessionIdList);
    },
    handleKickOut(sessionUID) {
      if (!Array.isArray(sessionUID)) {
        sessionUID = [sessionUID];
      }
      this.deleteRequest("/admin/online/users", sessionUID).then(({data}) => {
        if (data.flag) {
          this.$notify.success("踢出成功");
          this.doSearch();
        } else {
          this.$notify.error(data.message)
        }
      })
    },
  },
  computed: {},
  components: {RightToolbar},
  watch: {
    userList: {
      handler(newVal) {
        this.users2Render = newVal.slice((this.current - 1) * this.size, this.current * this.size);
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>