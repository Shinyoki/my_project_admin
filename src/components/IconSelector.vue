<template>
  <div>
    <el-input
        v-model="icon"
        placeholder="请输入图标名称"
        clearable
        @input="searchIcons"
    />
    <el-row class="icon-list">
      <el-col
          class="icon-item"
          v-for="(item, index) in iconList"
          @click.native="select(item)"
          :key="index"
          :span="2"
          style="text-align: center"
      >
        <el-tooltip
            style="width: 100%"
            placement="top"
            :content="item"
        >
          <i :class="'iconfont ' + item"/>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import IconList from "@/assets/js/constants/icon_names"

export default {
  name: 'IconSelector',
  created() {
  },
  mounted() {
  },
  data() {
    return {
      icon: '',
      iconList: Object.keys(IconList)
    }
  },
  methods: {
    // 搜索图标
    searchIcons() {
      if (this.icon && this.icon.length > 0) {
        this.iconList = this.iconList
            .filter(item => item.includes(this.icon))
      } else {
        this.iconList = Object.keys(IconList)
      }
    },
    // 重置
    reset() {
      this.icon = ''
      this.iconList = Object.keys(IconList)
    },
    // 点击事件
    select(icon) {
      // 回调给父组件
      this.$emit('selected', icon)
    },
  },
  computed: {},
}
</script>

<style scoped>
.icon-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.icon-list .el-button {
  width: 26px;
  margin-top: 3px;
  margin-left: 0 !important;
}

.icon-item {
  margin-bottom: 10px;
  cursor: pointer;
  transition: all .5s;
}

.icon-item:hover {
  color: #409EFF;
}
</style>