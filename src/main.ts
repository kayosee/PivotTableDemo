import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vue-enums'

var app=createApp(App);
app.use(ElementPlus);
//app.component('PlainRowItem');
//app.component('FilterDialog');
app.mount('#app')
