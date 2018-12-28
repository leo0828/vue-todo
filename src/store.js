import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: []
  },
  mutations: {
    REMOVE_TODO(state, todo) {
      state.list.splice(state.list.indexOf(todo), 1)
    },
    ADD_TODO(state, todo) {
      state.list.push(todo)
    },
    EDIT_TODO(state, {
      todo,
      text = todo.text,
      done = todo.done
    }) {
      console.log(todo);

      todo.text = text
      todo.done = done
    },
    SET_TODOS(state, todos) {
      state.list = todos
    },
  },
  actions: {
    getTodos({
      commit
    }) {
      axios.get('todos').then(res => {
        console.log(res);
        let todos = res.data.data
        commit('SET_TODOS', todos.data)
      }).catch(err => {
        console.log(err);
      })
    },
    addTodo({
      commit
    }, text) {
      axios.post('todos', {
        text: text,
        done: false
      }).then(res => {
        var todo = res.data.data
        console.log(res);
        
        commit('ADD_TODO', todo)
      }).catch(err => {
        console.log(err);
      })
    },
    removeTodo({
      commit
    }, todo) {
      axios.delete('todos/' + todo.id).then(res => {
        commit('REMOVE_TODO', todo)
      }).catch(err => {
        console.log(err);
      })
    },
    toggleTodo({
      commit
    }, todo) {
      axios.put('todos/' + todo.id, {
        done: todo.done
      }).then(res => {
        console.log(res);
        var todo = res.data.data
        console.log(todo);

        commit('EDIT_TODO', {
          todo,
          done: todo.done
        })
      }).catch(err => {
        console.log(err);
      })
    },
    removeDoneTodo({
      state,
      commit
    }) {
      var doneTodos = state.list.filter(todo => todo.done)
      var doneIds = doneTodos.map(todo => todo.id)

      axios.post('todos/delete', {
        ids: doneIds
      }).then(res => {
        doneIds.forEach(todo => {
          commit('REMOVE_TODO', todo)
        })
      }).catch(err => {
        console.log(err);
      })
    }
  },
})