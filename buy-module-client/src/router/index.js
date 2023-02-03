import { createRouter, createWebHistory } from 'vue-router'
import login from "../components/login";
import market from "@/components/market";
import admin from "@/components/admin";

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/market',
    name: 'marker',
    component: market
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
