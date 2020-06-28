export class Stack<T> {
  stack: T[] = [];

  addFirst(val: T) {
    this.stack.push(val);
  }

  removeFirst(): T {
    const res = this.stack.pop();
    if (!res) {
      throw new Error('No elements in stack!');
    }
    return res;
  }

  size(): number {
    return this.stack.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }
}
