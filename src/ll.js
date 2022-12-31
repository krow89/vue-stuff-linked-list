import { customRef, reactive } from 'vue';

/**
 * Iterator per linked-list
 */
export class LLIterator {
  constructor(l) {
    this._curr = l._root;
  }

  next() {
    if (this._curr) {
      let value = this._curr.data;
      this._curr = this._curr._next;
      return { done: false, value };
    } else {
      return { done: true, value: undefined };
    }
  }
}

/**
 * Nodo linked-list
 */
class _LLNode {
  constructor(d, prev = null, next = null) {
    this._prev = prev;
    this._next = next;
    this.data = d;
  }
}

/**
 * Semplice (e incompleta) implementazione di una linked-list
 */
export class LinkedList {
  constructor() {
    this._root = null;
    this._last = null;
    this._size = 0;
  }

  get size() {
    return this._size;
  }

  /**
   * Questo metodo andrà a creare i nodi internamente
   */
  _nodeBuilder(d) {
    return new _LLNode(d);
  }

  /**
   * Aggiunge un nodo alla lista. Ritorna un riferimento al nodo
   */
  add(d) {
    let node = this._nodeBuilder(d);
    if (this._root === null) {
      this._root = node;
    }
    if (this._last !== null) {
      this._last._next = node;
      node._prev = this._last;
    }
    this._last = node;
    this._size++;
    return node;
  }

  [Symbol.iterator]() {
    return new LLIterator(this);
  }

  /**
   * Rimuove un nodo dalla lista
   */
  remove(node) {
    if (!node) return;
    let prev = node._prev;
    let next = node._next;
    if (prev === null) {
      this._root = next;
    } else {
      prev._next = next;
    }
    if (next) next._prev = prev;
    if (node === this._root) this._root = next;
    if (node === this._last) this._last = prev;
    node._prev = node._next = null;
    this._size--;
  }
}

/**
 * Implementazione di una linked-list reattiva (con Vue).
 * Il costruttore prende 2 funzioni come parametri per tracciare e aggiornare
 * gli observer di Vue.
 */
class _ReactiveLL extends LinkedList {
  constructor(triggerFn, trackFn) {
    super();
    this._trigger = triggerFn;
    this._track = trackFn;
  }

  add(d) {
    let ret = super.add(d);
    // Indichiamo a Vue che qualcosa è cambiato
    this._trigger();
    return ret;
  }

  remove(n) {
    super.remove(n);
    // Indichiamo a Vue che qualcosa è cambiato
    // Non viene fatto nessun controllo sul nodo
    this._trigger();
  }

  _nodeBuilder(d) {
    // Importante: il nodo creato deve essere reattivo per poter
    // osservare i dati del nodo
    return reactive(new _LLNode(d));
  }
}

/**
 * Funzione che crea una nuova lista reattiva e ne inizializza i riferimenti
 * per vue... Usare questa funzione per creare la lista reattiva
 * (il costruttore è da considerare privato).
 *
 * la funzione customRef di Vue effettua tutta la magia
 */
export function newReactiveLL() {
  let obj;
  let ref = customRef((track, trigger) => {
    obj = new _ReactiveLL(trigger, track);
    return {
      get() {
        track();
        return obj;
      },
      set(v) {
        obj = v;
        trigger();
      },
    };
  });

  return ref;
}
