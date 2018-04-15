import Vue from 'vue';
import store from './store.js';
import PopUp from './popup/popup.vue';

new Vue({
  el: '#app',
  store,
  components: { PopUp }
})
