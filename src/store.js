import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: []
  },
  mutations: {
    REMOVE_ITEM(state, item) {
      state.list.splice(state.list.indexOf(item), 1)
    },
    ADD_ITEM(state, item) {
      state.list.push(item)
    },
    EDIT_ITEM(state, {
      item,
      text = item.text,
      done = item.done
    }) {
      item.text = text
      item.done = done
    },
  },
  actions: {
    addItem({
      commit
    }, text) {
      commit('ADD_ITEM', {
        text,
        done: false
      })
    },
    toggleItem({
      commit
    }, item) {
      commit('EDIT_ITEM', {
        item,
        done: item.done
      })
    },
    removeDoneItem({
      state,
      commit
    }) {
      state.list.filter(item => item.done)
        .forEach(item => {
          commit('REMOVE_ITEM', item)
        })
    }
  },
  plugins: [createPersistedState({
    key: 'vue-todo',
  })]
})