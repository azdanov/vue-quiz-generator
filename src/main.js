import 'buefy/dist/buefy.css'
import App from './App.vue'
import Field from 'buefy/dist/components/field'
import Input from 'buefy/dist/components/input'
import Radio from 'buefy/dist/components/radio'
import Toast from 'buefy/dist/components/toast'
import Vue from 'vue'

Vue.use(Field)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Toast)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
