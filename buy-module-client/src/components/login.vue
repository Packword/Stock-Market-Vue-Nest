<template>
  <div class="login-wrap">
    <div class="login">
      <h2>Вход</h2>
      <input type="text" v-model="name" id="login-field" class="form-control w-50" placeholder="Введите имя..."/>
      <button class="btn btn-primary" id="save-but" v-on:click="doLogin()">Войти</button>
      <p v-if="error">Ошибка!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "login-component",
  data() {
    return {
      name: '',
      error: false,
    }
  },

  created() {
    this.$store.dispatch('SOCKET_BROKERS');
  },

  computed: {
    stocks() {
      return this.$store.getters.STOCKS;
    },

    brokers() {
      return this.$store.getters.BROKERS;
    }
  },
  sockets: {
    connect: function() {
      console.log("connected");
    }
  },
  methods: {
    doLogin: function(){
      let brokerIndex = this.brokers.findIndex(broker => broker.name === this.name);
      console.log(this.name);
      console.log(brokerIndex);
      if(brokerIndex !== -1 && this.brokers[brokerIndex].isLogin === false){
        this.$store.dispatch('CHANGE_LOGIN_FOR_USER', this.brokers[brokerIndex].id);
        this.$router.push('market');
      }
      else{
        this.error = true;
      }
    }
  }
}
</script>

<style>
  .login-wrap{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    overflow: auto;
    z-index: -100;
  }
  .login{
    width: 40%;
    padding: 40px;
    text-align: center;
    margin: auto;
    background-color: bisque;
    border: solid 3px darkgray;
    border-radius: 10px;
  }
  .login h2{
    margin-bottom: 20px;
  }
  #login-field{
    margin-bottom: 20px;
    margin-left: 25%;
  }
</style>