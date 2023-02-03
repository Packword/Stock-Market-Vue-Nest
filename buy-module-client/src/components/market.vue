<template>
  <div class="parent">
    <div class="emul">
      <div v-if="!isEmulating" class="beforeEmulate">
        <h2>Торги ещё не начались!</h2>
      </div>
      <div v-if="isEmulating && stocks" class="emulate">
        Дата: {{ stocks[0].Date }}
        Ваши средства: <p id="user-balance">{{ user.curBalance }}</p>
        <table>
          <thead>
          <tr>
            <td class="label">Название</td>
            <td class="price">Стоимость</td>
            <td class="actions">Действия</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(stock, index) in stocks" :key="stock.id">
            <td class="label">{{ stock.Name }}</td>
            <td class="price">{{ stock.Open }}</td>
            <td class="actions" :id="stock.Name+1">
              <input class="form-control" placeholder="Купить..." type="number" :id="stock.Name + 'buy'" min="0"
                     v-model="buyValue[index]"/>
              <button class="btn btn-primary" :id="stock.Name + 'buyBut'" v-on:click="buyStocks(index)">Купить</button>
              <input class="form-control" placeholder="Продать..." type="number" min="0" v-model="soldValue[index]"/>
              <button class="btn btn-danger" v-on:click="sellStocks(index)">Продать</button>
              <button class="btn btn-secondary" v-on:click="showChart(index, stock.Name)">История</button>
              <canvas style="display: none" :id="stock.Name" width="100%" height="100%"></canvas>
              <p class="error" v-if="errors[index]">Ошибка!</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);
export default {
  name: "market-component",
  data() {
    return {
      buyValue: [],
      soldValue: [],
      errors: [],
      charts: []
    }
  },
  computed: {
    isEmulating() {
      return this.$store.getters.EMULATING;
    },
    stocks() {
      return this.$store.getters.STOCKS;
    },
    user() {
      return this.$store.getters.USER;
    },
    histData() {
      return this.$store.getters.HIST_DATA;
    }
  },
  created() {
    this.$store.dispatch('GET_SETTINGS');
  },
  methods: {
    showChart(index, label) {
      const ctx = document.getElementById(label);
      const tds = document.getElementById(label + 1);
      console.log(ctx.style.display);
      if (ctx.style.display === 'block') {
        console.log('here');
        this.hideChart(index, label);
        return;
      }
      console.log('nothere');
      ctx.style.display = "block";
      tds.style.height = "400px";
      console.log(this.histData.find(d => d.name === label));
      let labelData = this.histData.find(d => d.name === label).stocks;
      const labels = labelData.map(s => {
        return s.Date;
      });
      const values = labelData.map(s => {
        return s.Open;
      });
      const data = {
        labels: labels,
        datasets: [{
          label: label,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: values,
        }]
      }
      this.charts[index] = new Chart(ctx, {
        type: 'line',
        data
      });
      console.log(this.charts[index], registerables);
    },
    hideChart(index, label) {
      const ctx = document.getElementById(label);
      const tds = document.getElementById(label + 1);
      ctx.style.display = "none";
      tds.style.height = "auto";
      this.charts[index].destroy();
    },
    buyStocks(index) {
      let stock = this.stocks[index];
      if (this.user.curBalance >= this.buyValue[index] * stock.Open) {
        this.errors[index] = false;
        this.$store.dispatch('BUY_STOCKS', {name: stock.Name, price: stock.Open, count: this.buyValue[index]});
        this.buyValue[index] = '';
        console.log(this.user.stocks);
      } else {
        this.errors[index] = true;
      }
    },
    sellStocks(index) {
      let stock = this.stocks[index];
      let stocksAmount = this.user.stocks.find(s => s.label === stock.Name).purchasePrices.length;
      if (stocksAmount >= this.soldValue[index]) {
        this.errors[index] = false;
        this.$store.dispatch('SELL_STOCKS', {name: stock.Name, price: stock.Open, count: this.soldValue[index]});
        this.soldValue[index] = '';
        console.log(this.user.stocks);
      } else {
        this.errors[index] = true;
      }
    }
  }
}
</script>

<style scoped>
.parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  overflow: auto;
  z-index: -100;
}

.emul {
  margin: auto;
  padding: 50px;
  background-color: antiquewhite;
  border: lightcoral solid 3px;
  border-radius: 10px;
  font-size: 16pt;
}

.error {
  color: red;
}

.label {
  width: 120px;
}

.price {
  width: 150px;
}

.actions {
  width: 800px;
}

input {
  width: 150px;
  display: inline-block;
  margin-left: 10px;
}

button {
  margin-left: 10px;
  width: 120px;
}

thead td {
  text-align: center;
}

td {
  padding: 5px;
}

table {
  background-color: aquamarine;
  border: solid darkseagreen 3px;
  border-radius: 10px;

}
</style>