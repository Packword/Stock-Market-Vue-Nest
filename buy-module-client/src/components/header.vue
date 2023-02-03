<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/market" class="nav-link">Торги</router-link>
        </li>
        <li v-if="isAdmin" class="nav-item">
          <router-link to="/admin" class="nav-link" >Админка</router-link>
        </li>
        <li class="nav-item login-field">
          <router-link v-if="isLogin" v-on:click="logout()" to="/login" class="nav-link"> Выйти </router-link>
          <router-link v-if="!isLogin" to="/login" class="nav-link"> Войти </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "header-component",
  data() {
    return {
    }
  },
  computed: {
    isLogin() {
      return this.$store.getters.LOGIN;
    },
    isAdmin() {
      return this.$store.getters.ADMIN;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("CHANGE_LOGIN_FOR_USER", this.$store.getters.USER_ID);
    }
  }
}
</script>

<style scoped>
nav{
  background-color: rgb(120, 120, 120) !important;
  font-size: 20pt !important;
  color: black;
  padding-left: 30px;
}

.login-field{
  position: absolute;
  right: 30px;
}
</style>