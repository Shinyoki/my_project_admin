<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {generateMenus} from "@/assets/js/utils/menus";
import {getToken} from "@/assets/js/utils/token-util";

export default {
  name: 'App',
  created() {
    let token = getToken();
    if (token) {
      generateMenus();
    }
  },
  methods: {}
}
</script>
