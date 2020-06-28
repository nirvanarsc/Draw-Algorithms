<template>
  <div class="container">
    <h3 class="text-center" style="margin-right: 200px">Kruskal's MST</h3>
    <div class="row mt-3">
      <div class="col svg">
      </div>
      <div class="col-2">
        <b-form-select class="mb-3" v-model="selected" :options="options" @change="changeAlgorithm" />
<!--        <p v-html="func2"></p>-->
        <p>Not Explored: <span class="box" style="background-color: red"></span></p>
        <p>Cause Cycle: <span class="box" style="background-color: #34ce57"></span></p>
        <p>MST: <span class="box" style="background-color: #a534ce"></span></p>
        <label for="sleep">Delay {{ sleepTime }} millis</label>
        <b-input class="mb-2" id="sleep" v-model="sleepTime" type="range" min="0" max="2000" step="100" />
        <b-button :disabled="shouldClear" @click="run">Run</b-button>
        <b-button @click="clear" class="ml-2">Clear</b-button>
        <p class="mt-5">
          Legend <a href="https://github.com/nirvanarsc/Draw-Algorithms/blob/master/README.md">here</a>.
        </p>
      </div>
    </div>
    <div class="row mt-3">
      <p>
        <a href="https://en.wikipedia.org/wiki/Kruskal%27s_algorithm">Kruskal's MST Algorithm</a>
        is a greedy algorithm that finds a minimum spanning tree of an undirected graph in O(E log E) time.
        For disconnected graphs it finds a Minimum Spanning Forest. It begins by sorting all the edges by
        their weights and then greedily connects all pairs of vertices that would not cause a cycle.
        Checking whether connecting 2 vertices causes a cycle is done with the help of a
        <a href="https://en.wikipedia.org/wiki/Disjoint-set_data_structure">Disjoint Set Union data structure</a>.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import * as d3 from 'd3';
import { SimulationLinkDatum } from 'd3';
import { SimulationNodeDatum } from 'd3-force';
import { Component, Vue } from 'vue-property-decorator';
import DragVertex from '@/models/DragVertex';
import Vertex from '@/models/Vertex';
import Edge from '@/models/Edge';
import { EdgePair } from '@/models/Utils';
import { DSU } from '@/data-structures/dsu';

@Component
export default class DrawAlgorithms extends Vue {
  width = 900;
  height = 600;
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  svg: any;
  force: any;
  drag: any;
  dragLine: any;
  path: any;
  circle: any;
  weight: any;

  sleepTime = 100;
  weighted = true;

  vertices: Vertex[] = [
    { id: 0, reflexive: false, x: 215, y: 95 },
    { id: 1, reflexive: false, x: 116, y: 247 },
    { id: 2, reflexive: false, x: 274, y: 243 },
    { id: 3, reflexive: false, x: 438, y: 143 },
    { id: 4, reflexive: false, x: 131, y: 417 },
    { id: 5, reflexive: false, x: 273, y: 397 },
    { id: 6, reflexive: false, x: 397, y: 339 },
    { id: 7, reflexive: false, x: 524, y: 430 },
    { id: 8, reflexive: false, x: 547, y: 216 },
    { id: 9, reflexive: false, x: 724, y: 321 },
    { id: 10, reflexive: false, x: 745, y: 484 },
    { id: 11, reflexive: false, x: 744, y: 173 },
  ];

  edges: Edge[] = [
    { source: this.vertices[0], target: this.vertices[1], left: true, right: true, weight: 1 },
    { source: this.vertices[0], target: this.vertices[2], left: true, right: true, weight: 5 },
    { source: this.vertices[0], target: this.vertices[3], left: true, right: true, weight: 2 },
    { source: this.vertices[1], target: this.vertices[4], left: true, right: true, weight: 7 },
    { source: this.vertices[1], target: this.vertices[2], left: true, right: true, weight: 14 },
    { source: this.vertices[4], target: this.vertices[5], left: true, right: true, weight: 13 },
    { source: this.vertices[4], target: this.vertices[2], left: true, right: true, weight: 6 },
    { source: this.vertices[2], target: this.vertices[5], left: true, right: true, weight: 9 },
    { source: this.vertices[2], target: this.vertices[3], left: true, right: true, weight: 8 },
    { source: this.vertices[2], target: this.vertices[6], left: true, right: true, weight: 5 },
    { source: this.vertices[5], target: this.vertices[6], left: true, right: true, weight: 21 },
    { source: this.vertices[5], target: this.vertices[7], left: true, right: true, weight: 4 },
    { source: this.vertices[6], target: this.vertices[7], left: true, right: true, weight: 1 },
    { source: this.vertices[6], target: this.vertices[8], left: true, right: true, weight: 12 },
    { source: this.vertices[3], target: this.vertices[8], left: true, right: true, weight: 9 },
    { source: this.vertices[8], target: this.vertices[11], left: true, right: true, weight: 6 },
    { source: this.vertices[8], target: this.vertices[7], left: true, right: true, weight: 2 },
    { source: this.vertices[8], target: this.vertices[9], left: true, right: true, weight: 7 },
    { source: this.vertices[7], target: this.vertices[10], left: true, right: true, weight: 15 },
    { source: this.vertices[10], target: this.vertices[9], left: true, right: true, weight: 3 },
    { source: this.vertices[9], target: this.vertices[11], left: true, right: true, weight: 14 },
  ];

  shortestPath: number[] = [];

  lastKeyDown: string | null = null;
  shouldClear = false;
  lastNodeId = this.vertices.length;

  // mouse event vars
  selectedVertex: Vertex | null = null;
  selectedEdge: Edge | null = null;
  mousedownEdge: Edge | null = null;
  mousedownVertex: DragVertex | null = null;
  mouseupVertex: Vertex | null = null;

  selected = 'Kruskal';
  options = ['Dijkstra', 'BFS', 'DFS', 'Kruskal'];

  get func() {
    return `Shortest Path: <br>${this.shortestPath.join('\t->\t')}`;
  }

  get func2() {
    return this.vertices.map(e => e.x + '\t->\t' + e.y).join('<br>');
  }

  async sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  async clear() {
    this.shouldClear = false;
    this.shortestPath = [];
    this.path.remove();
    this.path = this.svg.append('svg:g').selectAll('path');
    this.restart();
  }

  async run() {
    this.shouldClear = true;
    const copy = new Array<EdgePair>(this.edges.length);
    for (let i = 0; i < this.edges.length; i++) {
      copy[i] = { edge: this.edges[i], id: i };
    }
    copy.sort((a, b) => a.edge.weight - b.edge.weight);
    const dsu = new DSU(this.vertices.length);
    for (let i = 0; i < this.edges.length; i++) {
      const u = copy[i].edge.source.id;
      const v = copy[i].edge.target.id;
      if (dsu.find(u) === dsu.find(v)) {
        this.path
            .filter(d => d.index === copy[i].id)
            .style('stroke', '#34ce57');
      } else {
        dsu.union(u, v);
        this.path
            .filter(d => d.index === copy[i].id)
            .style('stroke', '#a534ce');
      }
      await this.sleep(this.sleepTime);
    }
  }

  changeAlgorithm() {
    this.$router.push(`/draw/${this.selected.toLowerCase()}`);
  }

  resetMouseVars() {
    this.mousedownEdge = null;
    this.mousedownVertex = null;
    this.mouseupVertex = null;
  }

  tick() {
    // draw directed edges with proper padding from node centers
    this.path.attr('d', (d) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.left ? 17 : 12;
      const targetPadding = d.right ? 17 : 12;
      const sourceX = d.source.x + (sourcePadding * normX);
      const sourceY = d.source.y + (sourcePadding * normY);
      const targetX = d.target.x - (targetPadding * normX);
      const targetY = d.target.y - (targetPadding * normY);

      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });

    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  // update graph (called when needed)
  restart() {
    // path (edge) group
    this.path = this.path.data(this.edges);

    // update existing edges
    this.path.classed('selected', (d) => d === this.selectedEdge);

    // remove old edges
    this.path.exit().remove();

    // add new edges
    this.path = this.path.enter()
        .append('svg:path')
        .attr('class', 'link')
        .classed('selected', (d) => d === this.selectedEdge)
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) {
            return;
          }
          // select edge
          this.mousedownEdge = d;
          this.selectedEdge = (this.mousedownEdge === this.selectedEdge) ? null : this.mousedownEdge;
          this.selectedVertex = null;
          this.restart();
        })
        .merge(this.path);

    // circle (node) group
    // Note: the function arg is crucial here! nodes are known by id, not by index!
    this.circle = this.circle.data(this.vertices, (d) => d.id);

    // update existing nodes (reflexive & selected visual states)
    this.circle.selectAll('circle')
        .style('fill', (d) => (d === this.selectedVertex)
            ? d3.rgb(this.colors(d.id)).brighter().toString()
            : this.colors(d.id))
        .classed('reflexive', (d) => d.reflexive);

    // remove old nodes
    this.circle.exit().remove();
    DrawAlgorithms.clearWeights();

    // add new nodes
    const g = this.circle.enter().append('svg:g');

    g.append('svg:circle')
        .attr('class', 'node')
        .attr('r', 12)
        .style('fill', (d) => (d === this.selectedVertex)
            ? d3.rgb(this.colors(d.id)).brighter().toString()
            : this.colors(d.id))
        .style('stroke', (d) => d3.rgb(this.colors(d.id)).darker().toString())
        .classed('reflexive', (d) => d.reflexive)
        .on('mouseover', (d, i, nodes) => {
          if (!this.mousedownVertex || d === this.mousedownVertex) {
            return;
          }
          // focus target node
          d3.select(nodes[i]).attr('transform', 'scale(1.1)');
        })
        .on('mouseout', (d, i, nodes) => {
          if (!this.mousedownVertex || d === this.mousedownVertex) {
            return;
          }
          // clear focus target node
          d3.select(nodes[i]).attr('transform', '');
        })
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) {
            return;
          }
          // select node
          this.mousedownVertex = d;
          this.selectedVertex = (this.mousedownVertex === this.selectedVertex) ? null : this.mousedownVertex;
          this.selectedEdge = null;
          // reposition drag line
          this.dragLine
              .classed('hidden', false)
              .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`);
          this.restart();
        })
        .on('mouseup', (d, i, nodes) => {
          if (!this.mousedownVertex) {
            return;
          }
          // needed by FF
          this.dragLine
              .classed('hidden', true);

          // check for drag-to-self
          this.mouseupVertex = d;
          if (this.mouseupVertex === this.mousedownVertex || !this.mouseupVertex) {
            this.resetMouseVars();
            return;
          }
          // clear focus target node
          d3.select(nodes[i]).attr('transform', '');
          // add edge to graph (update if exists)
          // NB: edges are strictly source < target; arrows separately specified by booleans
          const isRight = this.mousedownVertex.id < this.mouseupVertex.id;
          const source = isRight ? this.mousedownVertex : this.mouseupVertex;
          const target = isRight ? this.mouseupVertex : this.mousedownVertex;

          const edge = this.edges.filter((l) => l.source === source && l.target === target)[0];
          if (edge) {
            edge[isRight ? 'right' : 'left'] = true;
          } else {
            this.edges.push({
              source: source,
              target: target,
              left: true,
              right: true,
              weight: Math.round(Math.random() * 100),
            });
          }
          // select new edge
          this.selectedEdge = edge;
          this.selectedVertex = null;
          this.restart();
        });
    this.drawWeights();

    // show node IDs
    g.append('svg:text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('class', 'id')
        .text((d) => d.id);

    this.circle = g.merge(this.circle);

    // set the graph in motion
    this.force
        .nodes(this.vertices as SimulationNodeDatum[])
        .force('link')
        .links(this.edges);

    this.force.alphaTarget(0.5).restart();
  }

  mousedown() {
    // because :active only works in WebKit?
    this.svg.classed('active', true);
    if (d3.event.ctrlKey || this.mousedownVertex || this.mousedownEdge) {
      return;
    }
    const vertex = { id: ++this.lastNodeId, reflexive: false, x: d3.event.layerX - 15, y: d3.event.layerY };
    this.vertices.push(vertex);
    this.restart();
  }

  mousemove() {
    this.dragLine.attr('d', () => {
      if (this.mousedownVertex) {
        return `M${this.mousedownVertex.x},${this.mousedownVertex.y}L${d3.event.layerX - 15},${d3.event.layerY}`;
      }
    });
  }

  mouseup() {
    if (this.mousedownVertex) {
      this.dragLine
          .classed('hidden', true);
    }
    this.svg.classed('active', false);
    this.resetMouseVars();
  }

  spliceEdgeForVertex(node) {
    const toSplice = this.edges.filter((l) => l.source === node || l.target === node);
    for (const l of toSplice) {
      this.edges.splice(this.edges.indexOf(l), 1);
    }
  }

  keydown() {
    d3.event.preventDefault();
    if (this.lastKeyDown) {
      return;
    }
    const currCode = d3.event.code;
    this.lastKeyDown = d3.event.code;
    if (currCode === 'ControlLeft' || currCode === 'ControlRight') {
      this.circle.call(this.drag);
      this.svg.classed('ctrl', true);
      return;
    }
    if (!this.selectedVertex && !this.selectedEdge) {
      return;
    }
    switch (currCode) {
      case 'Backspace':
      case 'Delete':
        if (this.selectedVertex) {
          this.vertices.splice(this.vertices.indexOf(this.selectedVertex), 1);
          this.spliceEdgeForVertex(this.selectedVertex);
        } else if (this.selectedEdge) {
          this.edges.splice(this.edges.indexOf(this.selectedEdge), 1);
        }
        this.selectedEdge = null;
        this.selectedVertex = null;
        this.restart();
        break;
      case 'KeyB': // B
        if (this.selectedEdge) {
          this.selectedEdge.left = true;
          this.selectedEdge.right = true;
        }
        this.restart();
        break;
      case 'KeyL':
        if (this.selectedEdge) {
          this.selectedEdge.left = true;
          this.selectedEdge.right = false;
        }
        this.restart();
        break;
      case 'KeyR':
        if (this.selectedVertex !== null) {
          this.selectedVertex.reflexive = !this.selectedVertex.reflexive;
        } else if (this.selectedEdge) {
          this.selectedEdge.left = false;
          this.selectedEdge.right = true;
        }
        this.restart();
        break;
      case 'Enter':
        if (this.weighted && this.selectedEdge) {
          let input;
          while (true) {
            input = prompt('Enter new weight: ');
            if (input === null) { // Cancel
              break;
            } else if (input.trim() === '' || isNaN(Number(input)) || Number(input) < 0) {
              alert('Please enter a positive number!');
            } else {
              this.selectedEdge.weight = Number(input);
              break;
            }
          }
          this.selectedEdge = null;
          this.lastKeyDown = null;
          this.restart();
        }
        break;
    }
  }

  keyup() {
    this.lastKeyDown = null;
    const currCode = d3.event.code;
    if (currCode === 'ControlLeft' || currCode === 'ControlRight') {
      this.circle.on('.drag', null);
      this.svg.classed('ctrl', false);
    }
  }

  async mounted() {
    this.svg = d3.select('.svg')
        .append('svg')
        .on('contextmenu', () => d3.event.preventDefault())
        .attr('width', this.width)
        .attr('height', this.height);

    this.force = d3.forceSimulation()
        .force('link', d3
            .forceLink()
            .id((d) => d.index ? d.index.toString() : '0')
            .distance((d: SimulationLinkDatum<SimulationNodeDatum>) => {
              const tar = d.target as SimulationNodeDatum;
              const src = d.source as SimulationNodeDatum;
              if (tar.x && tar.y && src.x && src.y) {
                const deltaX = tar.x - src.x;
                const deltaY = tar.y - src.y;
                return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              }
              return 0;
            }))
        .on('tick', this.tick);

    this.drag = d3.drag<SVGCircleElement, DragVertex>()
        // 0 = Left Click; 2 = Right Click
        .filter(() => d3.event.button === 0 || d3.event.button === 2)
        .on('start', (d) => {
          if (!d3.event.active) this.force.alphaTarget(0.5).restart();
          DrawAlgorithms.clearWeights();
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('drag', (d) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', (d) => {
          if (!d3.event.active) this.force.alphaTarget(0);
          this.drawWeights();
          d.fx = null;
          d.fy = null;
        });

    // line displayed when dragging new vertices
    this.dragLine = this.svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

    // handles to edge and vertex element groups
    this.path = this.svg.append('svg:g').selectAll('path');
    this.circle = this.svg.append('svg:g').selectAll('g');
    this.svg.on('mousedown', this.mousedown)
        .on('mousemove', this.mousemove)
        .on('mouseup', this.mouseup);

    d3.select(window)
        .on('keydown', this.keydown)
        .on('keyup', this.keyup);
    this.restart();
  }

  private static clearWeights() {
    d3.select('svg').selectAll('.weight').remove();
  }

  private drawWeights() {
    if (this.weighted) {
      this.svg.append('svg:g')
          .selectAll('text')
          .data(this.edges)
          .enter()
          .append('svg:text')
          .attr('class', 'weight')
          .attr('x', d => DrawAlgorithms.getWeightPos(d.source, d.target).x)
          .attr('y', d => DrawAlgorithms.getWeightPos(d.source, d.target).y)
          .text(d => d.weight);
    }
  }

  private static getWeightPos(src: SimulationNodeDatum, tar: SimulationNodeDatum) {
    const x1 = src.x;
    const y1 = src.y;
    const x2 = tar.x;
    const y2 = tar.y;
    let resX = 0;
    let resY = 0;
    if (x1 && x2 && y1 && y2) {
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      resX = minX + (Math.abs(x1 - x2) >> 1);
      resY = minY + (Math.abs(y1 - y2) >> 1);
    }
    return { x: resX, y: resY };
  }
}
</script>

<style lang="scss">
svg {
  background-color: #FFF;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: #1d2124 solid 2px;
}

svg:not(.active):not(.ctrl) {
  cursor: crosshair;
}

path.link {
  fill: none;
  stroke: #ee8181;
  stroke-width: 4px;
  cursor: default;
}

svg:not(.active):not(.ctrl) path.link {
  cursor: pointer;
}

path.link.selected {
  stroke-dasharray: 10, 2;
}

path.link.dragline {
  pointer-events: none;
}

path.link.hidden {
  stroke-width: 0;
}

path.link.test {
  stroke: #34ce57;
}

circle.node {
  stroke-width: 1.5px;
  cursor: pointer;
}

circle.node.reflexive {
  stroke: #000 !important;
  stroke-width: 2.5px;
}

text {
  font: 12px sans-serif;
  pointer-events: none;
}

text.id {
  text-anchor: middle;
  font-weight: bold;
}

text.weight {
  cursor: pointer;
  font-weight: bold;
  text-anchor: start;
  font-size: 15px;
}

.box {
  width: 15px;
  height: 15px;
  margin: auto;
  display: inline-block;
  border: 1px solid gray;
  vertical-align: middle;
  border-radius: 2px;
}
</style>
