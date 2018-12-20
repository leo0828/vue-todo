<template>
  <div class="home">
    <el-row>
      <el-col :xs="24" :sm="{offset:6,span:12}">
        <el-input v-model="input" placeholder="今天做点什么？" @keyup.enter.native="add"></el-input>
        <ul v-if="list.length>0">
          <li v-for="item in filteredTodos" class="todo">
            <div class="todo-check">
              <el-checkbox v-model="item.done" @change="toggleItem(item)"></el-checkbox>
              <span class="todo-text" :class="item.done?'done-text':''">{{item.text}}</span>
            </div>
            <el-button type="text" icon="el-icon-close" @click="removeItem(item)" circle></el-button>
          </li>
        </ul>
        <div class="result">
          <span>未完成{{doneCount}}项</span>
          <el-radio-group v-model="filter">
            <el-radio label="all">全部</el-radio>
            <el-radio label="todo">未完成项</el-radio>
            <el-radio label="done">已完成项</el-radio>
          </el-radio-group>
          <el-button type="text" @click="removeDoneItem">清除已完成项</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // @ is an alias to /src
  import {
    mapState,
    mapActions
  } from 'vuex'

  export default {
    name: 'home',
    computed: {
      ...mapState({
        list: state => state.list
      }),
      doneCount() {
        return this.list.filter(item => !item.done).length
      },
      filteredTodos() {
        return this.list.filter(item => {
          switch (this.filter) {
            case 'done':
              return item.done
              break;
            case 'todo':
              return !item.done
              break;
            default:
              return item
              break;
          }
        })
      }
    },
    data() {
      return {
        input: '',
        filter: 'all',
      }
    },
    methods: {
      ...mapActions(['addItem', 'toggleItem', 'removeDoneItem']),
      removeItem(item) {
        this.$store.commit('REMOVE_ITEM', item)
      },
      add() {
        if (this.input.trim()) {
          this.addItem(this.input)
        }
        this.input = ''
      },
    },
  }
</script>
<style lang="scss">
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .todo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0;
    border-bottom: 1px solid #dcdfe6;

    .todo-text {
      font-size: 22px;
      padding-left: 15px;
    }

    .done-text {
      text-decoration: line-through;
      color: #999;
    }
  }

  .result {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
</style>