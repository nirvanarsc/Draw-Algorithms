<template>
  <div id="app">
    <router-view :key="this.$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
}
</script>

<style lang="scss">
</style>
