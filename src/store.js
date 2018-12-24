import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    SET_TODOS(state, todos) {
      state.list = todos
    },
  },
  actions: {
    getTodos({
      commit
    }) {
      axios.get('api/todos').then(res => {
        console.log(res);
        commit('SET_TODOS', res.data)
      }).catch(err => {
        console.log(err);
      })
    },
    addItem({
      commit
    }, text) {
      axios.post('api/todos', {
        text: text,
        done: false
      }).then(res => {
        var todo = res.data
        commit('ADD_ITEM', {
          text: todo.text,
          done: todo.done
        })
      }).catch(err => {
        console.log(err);
      })
    },
    removeTodo({
      commit
    }, item) {
      axios.delete('api/todos/' + item.id).then(res => {
        commit('REMOVE_ITEM', item)
      }).catch(err => {
        console.log(err);
      })
    },
    toggleItem({
      commit
    }, item) {
      axios.put('api/todos/' + item.id, {
        done: item.done
      }).then(res => {
        console.log(res);
        var todo = res.data
        commit('EDIT_ITEM', {
          todo,
          done: todo.done
        })
      }).catch(err => {
        console.log(err);
      })
    },
    removeDoneItem({
      state,
      commit
    }) {
      var doneTodos = state.list.filter(item => item.done)
      var doneIds = doneTodos.map(item => item.id)

      axios.post('api/todos/delete', {
        ids: doneIds
      }).then(res => {
        doneIds.forEach(item => {
          commit('REMOVE_ITEM', item)
        })
      }).catch(err => {
        console.log(err);
      })
    }
  },
})