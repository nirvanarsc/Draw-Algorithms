import Vertex from '@/models/Vertex';

export default interface Edge {
  source: Vertex;
  target: Vertex;
  left: boolean;
  right: boolean;
  weight: number;
}
