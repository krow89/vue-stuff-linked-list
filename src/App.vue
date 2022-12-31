<template>
  <input v-model="newData" />
  <button @click="add" :disabled="newData.trim() == ''">ADD</button>
  <button @click="removeFirst">REMOVE FIRST</button>
  <button @click="removeLast">REMOVE LAST</button>
  <div class="tests">
    <input type="number" v-model="testsSize" />
    <button @click="test_array">TEST ARRAY</button>
    <button @click="test_ll">TEST LINKED LIST</button>
    <div>{{ testMsg }}</div>
    <div style="margin: 5px; background-color: white">
      Il test si basa sull' aggiunta di <i>n</i> dati e la loro eliminazione
      (item by item) misurandone i tempi. Nel caso di TEST ARRAY, l'
      eliminazione viene effettuata tramite slice(0, 1)
    </div>
  </div>

  <div>
    <div v-for="it in testStruct">{{ it }}</div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { LL, LLNode, RLL, newReactiveLL } from './ll.js';
export default {
  name: 'App',
  setup() {
    // linked-list reattiva
    const ll = newReactiveLL();
    ll.value.add('a');
    ll.value.add('b');

    ll.value.add('c');
    const iWillChange = ll.value.add('d');

    // Solo per accedere alla linked-list da console :)
    window.ll = ll;

    // cambiamo i dati di un nodo con un delay
    setTimeout(() => {
      iWillChange.data = 'Ikecess';
    }, 1500);
    return {
      l: ll,
      newData: ref(''),
      testStruct: ref(null),
      testMsg: ref(null),
      inArrayTest: ref(false),
      testsSize: ref(50),
    };
  },

  methods: {
    add() {
      this.l.add(this.newData);
    },
    test_remove() {
      this.l.remove(this.n);
    },
    removeFirst() {
      let n = this.l._root;
      this.l.remove(n);
    },
    removeLast() {
      let n = this.l._last;
      this.l.remove(n);
    },

    test_array() {
      this.testStruct = [];
      this.inArrayTest = true;
      let s = new Date().getTime();

      for (let i = 0; i < this.testsSize; i++) {
        this.testStruct.push(i);
      }
      let timeAdd = new Date().getTime() - s;
      let a = this.testStruct;
      while (a.length) {
        a.splice(0, 1);
      }

      this.testStruct = a;
      this.testMsg = `time: ${
        new Date().getTime() - s
      } ms (insert time ${timeAdd} ms)`;
    },

    test_ll() {
      this.testStruct = this.l;
      this.inArrayTest = false;
      let s = new Date().getTime();
      for (let i = 0; i < this.testsSize; i++) {
        this.testStruct.add(i);
      }
      let timeAdd = new Date().getTime() - s;
      let c = this.testStruct._root;
      while (this.testStruct._root) {
        this.testStruct.remove(this.testStruct._root);
      }
      this.testMsg = `time: ${
        new Date().getTime() - s
      } ms (insert time ${timeAdd} ms)`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.tests {
  background-color: red;
}
</style>
