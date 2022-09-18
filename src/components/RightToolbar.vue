<template>
  <div class="right-toolbar-container">
<!--    搜索栏显示切换-->
    <el-tooltip
      class="toolbar-item"
      effect="dark"
      :content="showSearch ? '隐藏搜索' : '显示搜索'"
      placement="top"
      v-if="showSearchItem"
      >
      <el-button
          icon="el-icon-search"
          @click="toggleSearch"
          size="mini"
          circle
          />
    </el-tooltip>
<!--    更新-->
    <el-tooltip
      class="toolbar-item"
      effect="dark"
      content="刷新"
      placement="top"
      >
      <el-button
        icon="el-icon-refresh"
        @click="refresh"
        size="mini"
        circle
        />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'RightToolbar',
  props:{
    // 显示搜索区域
    showSearch: {
      type: Boolean,
      default: true
    },
    // 是否显示搜索切换按钮
    showSearchItem: {
      type: Boolean,
      default: true,
    }
  },
  created() {
  },
  mounted() {
  },
  data() {
    return {}
  },
  methods: {
    // 更新搜索区域显示状态
    toggleSearch() {
      this.$emit('update:showSearch', !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit('queryTable');
    },
  },
  computed: {},
}
</script>

<style scoped>
.right-toolbar-container {
  margin-left: auto;
}
</style>