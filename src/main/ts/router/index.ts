import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/draw/dijkstra',
    component: () => import(
        /* webpackChunkName: "dijkstra" */
        '@/pages/Dijkstra.vue'),
    props: true,
    meta: { title: 'Directed Graph' },
  },
  {
    path: '/draw/bfs',
    component: () => import(
        /* webpackChunkName: "bfs" */
        '@/pages/BFS.vue'),
    props: true,
    meta: { title: 'Directed Graph' },
  },
  {
    path: '/draw/dfs',
    component: () => import(
        /* webpackChunkName: "dfs" */
        '@/pages/DFS.vue'),
    props: true,
    meta: { title: 'Directed Graph' },
  },
  {
    path: '/draw/kruskal',
    component: () => import(
        /* webpackChunkName: "kruskal" */
        '@/pages/Kruskal.vue'),
    props: true,
    meta: { title: 'Directed Graph' },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
