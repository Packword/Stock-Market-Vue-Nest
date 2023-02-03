<template>
  <header-component></header-component>
  <router-view/>
</template>

<style>

</style>
<script>
import HeaderComponent from "@/components/header";
export default {
  components: {HeaderComponent}
}
</script>