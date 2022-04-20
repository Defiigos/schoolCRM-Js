import { createRouter, createWebHistory } from 'vue-router'

const authGuard = function(to, from, next) {
  if (!localStorage.hasOwnProperty('token')) 
    next('login')
  else
    next()
}

const adminAuthGuard = function(to, from, next) {
  if (!localStorage.hasOwnProperty('token')) 
    next('login')
  else if (!(localStorage.getItem('userRoles').includes('ROLE_ADMIN') || 
    localStorage.getItem('userRoles').includes('ROLE_SUPERADMIN'))) 
      next('/')
    else 
      next()
}

const superAuthGuard = function(to, from, next) {
  if (!localStorage.hasOwnProperty('token')) 
    next('login')
  else if (!localStorage.getItem('userRoles').includes('ROLE_SUPERADMIN')) 
      next('/')
    else 
      next()
}

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {layout: 'auth'},
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/',
    name: 'home',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/requests',
    name: 'request',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/RequestView.vue')
  },
  {
    path: '/lessons',
    name: 'lessons',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/LessonsView.vue')
  },
  {
    path: '/payments',
    name: 'payments',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/PaymentsView.vue')
  },
  {
    path: '/students',
    name: 'students',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/StudentsView.vue')
  },
  {
    path: '/studentsGroups',
    name: 'studentsGroups',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/LessonsGroups.vue')
  },
  {
    path: '/locations',
    name: 'locations',
    meta: {layout: 'app'},
    beforeEnter: adminAuthGuard,
    component: () => import('../views/LocationsView.vue')
  },
  {
    path: '/lessonDurations',
    name: 'lessonDurations',
    meta: {layout: 'app'},
    beforeEnter: adminAuthGuard,
    component: () => import('../views/LessonsDurations.vue')
  },
  {
    path: '/paymentAmounts',
    name: 'paymentAmounts',
    meta: {layout: 'app'},
    beforeEnter: adminAuthGuard,
    component: () => import('../views/PaymentAmountsView.vue')
  },
  {
    path: '/users',
    name: 'users',
    meta: {layout: 'app'},
    props: {entity: 'users'},
    beforeEnter: superAuthGuard,
    component: () => import('../views/UsersView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/ProfileView.vue')
  },
  { 
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: {layout: 'app'},
    beforeEnter: authGuard,
    component: () => import('../views/PageNotFoundView.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
