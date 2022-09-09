<template>
  <div>
    顶栏
    <el-button
      type="primary"
      @click="changeCollapse"
      >
      点击
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'TopNavBar',
  created() {
  },
  mounted() {
  },
  data() {
    return {}
  },
  methods: {
    changeCollapse() {
      this.$store.commit("changeCollapse")
    },
  },
  computed: {},
}
</script>

<style scoped>

</style>