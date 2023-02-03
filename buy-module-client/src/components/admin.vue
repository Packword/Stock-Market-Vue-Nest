<template>
  <div class="parent">
    <h2>Брокеры:</h2>
    <div class="broker" v-for="(broker, index) in brokers" :key="broker.id">
      <h4>{{ broker.name }}</h4>
      Баланс: {{ broker.curBalance }} <br />
      Итог: {{getTotalDif(index).toFixed(2)}} <br />
      Акции:
      <div class="stocks" v-if="stocks.length !== 0">
        <div class="stock" v-for="stock in broker.stocks" :key="stock.id">
          <h5>{{ stock.label }}</h5>
          Количество: {{ stock.purchasePrices.length }} <br />
          Прибыль/убыток: {{ getDifference(stock.label, index).toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin-component",
  computed: {
    brokers() {
      return this.$store.getters.BROKERS;
    },
    stocks() {
      return this.$store.getters.STOCKS;
    }
  },
  methods: {
    getDifference(label, brokerIndex) {
      let prices = this.brokers[brokerIndex].stocks.find(s => s.label === label).purchasePrices;
      let sum = prices.reduce((partialSum, a) => partialSum + a, 0);
      let stock = this.stocks.find(s => s.Name === label);
      let curPrice = stock === undefined ? 0 : stock.Open;
      return curPrice * prices.length - sum;
    },
    getTotalDif(index){
      let result = 0;
      for(let i = 0; i < this.brokers[index].stocks.length; i++){
        result += this.getDifference(this.brokers[index].stocks[i].label, index);
      }
      return result;
    }
  }
}
</script>

<style scoped>
  .parent{
    font-size: 16pt;
    margin-left: 30px;
    margin-top: 30px;
  }
  .stocks{
    margin-left: 50px;
  }
  .stock{
    width: 300px;
    background-color: aquamarine;
    border: solid lightcoral 3px;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 5px;
    margin-top: 5px;
  }
</style>