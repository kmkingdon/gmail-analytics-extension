import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
    msg:"Welcome to the app!"
};

const mutations = {

};

const actions = {

};

const getters = {
    msg: state => state.msg,
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
});