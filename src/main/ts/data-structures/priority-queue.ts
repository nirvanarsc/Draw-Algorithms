export type Comparator<T> = (a: T, b: T) => number;

export class PriorityQueue<T> {
  pq: T[];
  size = 0;
  comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.pq = Array<T>(2);
    this.comparator = comparator;
  }

  offer(element: T): void {
    if (this.pq.length === this.size) {
      const resize = new Array<T>(this.size * 2);
      for (let i = 0; i < this.size; i++) {
        resize[i] = this.pq[i];
      }
      this.pq = resize;
    }
    this.pq[this.size] = element;
    this.siftUp(this.size, element);
    this.size += 1;
  }

  peek(): T {
    return this.pq[0];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  remove(): T {
    this.size -= 1;
    const result = this.pq[0];
    this.pq[0] = this.pq[this.size];
    this.pq[this.size] = result;
    this.siftDown(0, this.pq[0]);
    return result;
  }

  private siftUp(index: number, element: T): void {
    while (index > 0) {
      const parentIdx = PriorityQueue.getParent(index);
      const parent: T = this.pq[parentIdx];
      if (this.comparator(element, parent) >= 0) {
        break;
      }
      this.pq[index] = parent;
      index = parentIdx;
    }
    this.pq[index] = element;
  }

  private siftDown(index: number, element: T): void {
    const size = this.size - 1;
    const half = size / 2;
    while (index < half) {
      const lChild = PriorityQueue.getLChild(index);
      const rChild = PriorityQueue.getRChild(index);
      let toSwap = lChild;
      if (rChild < size && this.comparator(this.pq[lChild], this.pq[rChild]) > 0) {
        toSwap = rChild;
      }
      if (this.comparator(element, this.pq[toSwap]) <= 0) {
        break;
      }
      this.pq[index] = this.pq[toSwap];
      index = toSwap;
    }
    this.pq[index] = element;
  }

  private static getParent(index: number): number {
    return Math.floor(((index - 1) / 2));
  }

  private static getLChild(index: number): number {
    return (index * 2) + 1;
  }

  private static getRChild(index: number): number {
    return (index * 2) + 2;
  }
}
