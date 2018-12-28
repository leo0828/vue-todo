<template>
  <div class="home">
    <el-row>
      <el-col :xs="24" :sm="{offset:4,span:16}">
        <!-- <div style="margin:15px 0;">你目前有<span>{{doneCount}}</span>项待办事项</div> -->
        <el-input v-model="input" placeholder="今天做点什么？" @keyup.enter.native="add"></el-input>
        <div class="result">
          <el-radio-group v-model="filter">
            <el-radio label="all">共<el-tag size="mini" class="count-tag">{{allCount}}</el-tag>项</el-radio>
            <el-radio label="todo">未完成<el-tag type="danger" size="mini" class="count-tag">{{noDoneCount}}</el-tag>项</el-radio>
            <el-radio label="done">已完成<el-tag type="success" size="mini" class="count-tag">{{doneCount}}</el-tag>项</el-radio>
          </el-radio-group>
          <el-button type="text" @click="removeDoneTodo">清除已完成项</el-button>
        </div>
        <transition-group name="list-complete" tag="ul" class="todo-list" v-if="list.length>0">
          <li v-for="todo in filteredTodos" :key="todo.id" class="todo">
            <div class="todo-check">
              <el-checkbox v-model="todo.done" @change="toggleTodo(todo)"></el-checkbox>
              <span class="todo-text" :class="todo.done?'done-text':''">{{todo.text}}</span>
            </div>
            <el-button type="text" icon="el-icon-close" @click="deleteTodo(todo)" circle></el-button>
          </li>
        </transition-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // @ is an alias to /src
  import {
    mapState,
    mapActions
  } from "vuex";

  export default {
    name: "home",
    computed: {
      ...mapState({
        list: state => state.list
      }),
      allCount() {
        return this.list.length;
      },
      noDoneCount() {
        return this.list.filter(todo => !todo.done).length;
      },
      doneCount() {
        return this.list.filter(todo => todo.done).length;
      },
      filteredTodos() {
        return this.list
          .filter(todo => {
            switch (this.filter) {
              case "done":
                return todo.done;
                break;
              case "todo":
                return !todo.done;
                break;
              default:
                return todo;
                break;
            }
          })
          .sort((a, b) => b.id - a.id);
      }
    },
    data() {
      return {
        input: "",
        filter: "all"
      };
    },
    created() {
      this.getTodos();
    },
    methods: {
      ...mapActions([
        "getTodos",
        "removeTodo",
        "addTodo",
        "toggleTodo",
        "removeDoneTodo"
      ]),
      async deleteTodo(todo) {
        try {
          await this.removeTodo(todo);
          this.$message.success("删除成功");
        } catch (error) {
          this.$message.error("删除失败");
        }
      },
      add() {
        if (this.input.trim()) {
          this.addTodo(this.input);
        }
        this.input = "";
      }
    }
  };
</script>
<style lang="scss">
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .todo-list {
    position: relative;

    .todo {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 0;
      border-bottom: 1px solid #dcdfe6;
      transition: all 0.5s ease-in-out;

      .todo-text {
        font-size: 22px;
        padding-left: 15px;
      }

      .done-text {
        text-decoration: line-through;
        color: #999;
      }
    }
  }

  .result {
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    .count-tag {
      margin: 0 4px;
    }
  }

  .list-complete-enter,
  .list-complete-leave-to

  /* .list-complete-leave-active for below version 2.1.8 */
    {
    opacity: 0;
    transform: translateY(30px);
  }

  .list-complete-leave-active {
    position: absolute;
  }
</style>