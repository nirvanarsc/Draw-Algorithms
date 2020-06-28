export class Queue<T> {
  queue: T[] = [];

  offerLast(val: T) {
    this.queue.push(val);
  }

  removeFirst(): T {
    const res = this.queue.shift();
    if (!res) {
      throw new Error('No elements in queue!');
    }
    return res;
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }
}
