## Visualizing Graph Algorithms

### About
This project uses [D3.js](https://d3js.org/) to visualize famous graph algorithms. 
Loosely based on these samples - [1](http://bl.ocks.org/rkirsling/5001347) and [2](http://bl.ocks.org/tungnk1993/6370bc100d6b23c19c6a).
Currently, the following algorithms are available.
- BFS
- DFS
- Dijkstra's algorithm
- Kruskal's Minimum Spanning Tree

### Sample Runs

![BFS](src/main/ts/assets/run_bfs.gif)

![Dijkstra](src/main/ts/assets/run_dijkstra.gif)

### Legend

- Left clicking a node and holding 'CTRL' allows you to drag the node around.
- Left click + delete allows you to remove nodes and edges
- Left click anywhere in the graph to add a new node.
- Left click a node and hold left click and drag to create a new edge from that node to another node.
- For weighted graphs - left click an edge + 'Enter' allows you to update the edge's weight.

![Actions](src/main/ts/assets/actions.gif)

### TODO

Other algorithms I'm interested in implementing:
- Bellman-Ford
- Strongly Connected Components (Tarjan/Kosajaru)
- Floyd-Warshall
- Topological Sort (Kahn's Algorithm)
- Convex hull (Graham Scan/Monotone chain)
- Prim's MST
