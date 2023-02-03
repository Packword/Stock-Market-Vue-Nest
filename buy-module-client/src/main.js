import { createApp } from 'vue'
import App from './App.vue'
import io from 'socket.io-client'
import router from './router'
import store from './store'
import VueSocketIO from "vue-socket.io";

const socketIO = new VueSocketIO({
    debug: true,
    connection: io('http://localhost:3001', {transports: ['websocket']}),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
})

createApp(App).use(store)
              .use(router)
              .use(socketIO)
              .mount('#app')
