import Edge from '@/models/Edge';

export interface PQObject {
  id: number;
  weight: number;
  left: boolean;
  right: boolean;
  edgeIndex: number;
}

export interface Pair {
  id: number;
  edgeIndex: number;
}

export interface EdgePair {
  edge: Edge;
  id: number;
}
