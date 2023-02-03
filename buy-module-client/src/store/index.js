import {createStore} from 'vuex'
import axios from "axios";
import createPersistedState from 'vuex-persistedstate'

const apiPath = 'http://localhost:3001/api/'

export default createStore({
    plugins: [createPersistedState()],
    state: {
        stocks: [],
        isLogin: false,
        brokers: [],
        user: {},
        settings: {},
        histData: [],
    },
    getters: {
        HIST_DATA: state => {
            return state.histData;
        },
        STOCKS: state => {
            return state.stocks;
        },
        SETTINGS: state => {
            return state.settings;
        },
        EMULATING: state => {
            return state.settings.isEmulating;
        },
        LOGIN: state => {
            return state.isLogin;
        },
        ADMIN: state => {
            return (state.isLogin && state.user.role === 'admin');
        },
        BROKERS: state => {
            return state.brokers;
        },
        USER: state => {
            return state.user;
        },
        USER_ID: state => {
            return state.user.id;
        }
    },
    mutations: {
        SET_STOCKS: (state, payload) => {
            state.stocks = payload;
        },
        SET_LOGIN: (state) => {
            state.isLogin = !state.isLogin;
        },
        SET_BROKERS: (state, payload) => {
            state.brokers = payload;
        },
        SET_LOGIN_FOR_BROKER: (state, index) => {
            state.brokers[index].isLogin = !state.brokers[index].isLogin;
        },
        SET_USER: (state, payload) => {
            state.user = payload;
        },
        SET_SETTINGS: (state, payload) => {
            state.settings = payload;
        },
        ADD_USER_STOCK: (state, payload) => {
            state.user.stocks[payload.index].purchasePrices.push(payload.price);
        },
        DELETE_USER_STOCK: (state, payload) => {
            state.user.stocks[payload].purchasePrices.pop();
        },
        SET_USER_BALANCE: (state, difference) => {
            state.user.curBalance = parseInt(state.user.curBalance) + parseInt(difference);
            state.user.curBalance = parseInt(state.user.curBalance);
        },
        SET_HIST_DATA: (state, payload) => {
            state.histData = payload;
        }
    },
    actions: {
        SOCKET_STOCKS(ctx, payload) {
            console.log('getStocks', payload);
            ctx.commit('SET_STOCKS', payload);
        },
        SOCKET_HIST(ctx, payload){
            ctx.commit('SET_HIST_DATA', payload);
        },
        SOCKET_SETTINGS(ctx, payload) {
            ctx.commit('SET_SETTINGS', payload);
        },
        GET_SETTINGS(ctx) {
            axios.get(apiPath + 'settings').then(response => {
                ctx.commit('SET_SETTINGS', response.data);
            });
        },
        CHANGE_LOGIN(ctx) {
            ctx.commit('SET_LOGIN');
        },
        SOCKET_BROKERS(ctx) {
            axios.get(apiPath + 'brokers').then(response => {
                console.log(response.data);
                ctx.commit('SET_BROKERS', response.data);
            })
        },
        CHANGE_LOGIN_FOR_USER(ctx, id) {
            const brokerIndex = this.state.brokers.findIndex(b => b.id === id);
            ctx.commit('SET_LOGIN');
            ctx.commit('SET_LOGIN_FOR_BROKER', brokerIndex);
            if (this.state.isLogin === false)
                ctx.commit('SET_USER', {});
            else
                ctx.commit('SET_USER', this.state.brokers[brokerIndex]);
            axios.put(apiPath + 'brokers', this.state.brokers[brokerIndex]);
        },
        BUY_STOCKS(ctx, payload) {
            const stockIndex = this.state.user.stocks.findIndex(s => s.label === payload.name);
            ctx.commit('SET_USER_BALANCE', -(parseInt(payload.price) * parseInt(payload.count)));
            for (let i = 0; i < parseInt(payload.count); i++)
                ctx.commit('ADD_USER_STOCK', {index: stockIndex, price: parseInt(payload.price)});
            axios.put(apiPath + 'brokers', this.state.user);
        },
        SELL_STOCKS(ctx, payload) {
            const stockIndex = this.state.user.stocks.findIndex(s => s.label === payload.name);
            ctx.commit('SET_USER_BALANCE', parseInt(payload.price) * parseInt(payload.count));
            for (let i = 0; i < parseInt(payload.count); i++)
                ctx.commit('DELETE_USER_STOCK', stockIndex);
            axios.put(apiPath + 'brokers', this.state.user);
        },
    },
    modules: {}
})
