import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './backend/server'

// bootstrap 
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-reboot.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
