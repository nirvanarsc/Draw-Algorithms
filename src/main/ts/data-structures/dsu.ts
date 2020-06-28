export class DSU {
  parent: number[];
  size: number[];
  count: number;

  constructor(n: number) {
    this.parent = new Array<number>(n);
    this.size = new Array<number>(n);
    this.count = n;
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }

  find(p: number): number {
    // path compression
    while (p !== this.parent[p]) {
      this.parent[p] = this.parent[this.parent[p]];
      p = this.parent[p];
    }
    return p;
  }

  union(p: number, q: number): void {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    if (rootP === rootQ) {
      return;
    }
    // union by size
    if (this.size[rootP] > this.size[rootQ]) {
      this.parent[rootQ] = rootP;
      this.size[rootP] += this.size[rootQ];
    } else {
      this.parent[rootP] = rootQ;
      this.size[rootQ] += this.size[rootP];
    }
    this.count--;
  }

  getCount(): number {
    return this.count;
  }

  getSize(): Array<number> {
    return this.size;
  }
}
