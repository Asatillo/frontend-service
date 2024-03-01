import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupView.vue')
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: () => import('../views/SubscriptionsView.vue')

  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/SalesView.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/UsersView.vue')
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../views/CustomersView.vue')
  },
  {
    path: '/customers/:id',
    name: 'Customer',
    component: () => import('../views/CustomerView.vue')
  },
  {
    path: '/plans',
    name: 'Plans',
    component: () => import('../views/PlansView.vue')
  },
  {
    path: '/devices',
    name: 'Devices',
    component: () => import('../views/DevicesView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  },
  {
    path: '/my-profile',
    name: 'MyProfile',
    component: () => import('../views/MyProfileView.vue')
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/ServicesView.vue')
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: () => import('../views/PromotionsView.vue')
  },
  {
    path: '/offered-promotions',
    name: 'OfferedPromotions',
    component: () => import('../views/OfferedPromotionsView.vue')
  },{
    path: '/network-entities',
    name: 'NetworkEntities',
    component: () => import('../views/NetworkEntitiesView.vue')
  },
  {
    path: '/error',
    name: 'Forbidden',
    props: {
      errorMessage: "Access Denied", 
      errorStatus: "403", 
      errorText: "SORRY, YOU DON'T HAVE THE PERMISSION TO ACCESS THIS PAGE"
    },
    component: () => import('../views/ErrorTemplate.vue')
  },
  {
    path: '/error',
    name: 'ServiceUnavailable',
    props: {
      errorMessage: "Service Unavailable", 
      errorStatus: "503", 
      errorText: "SORRY, THE SERVICE YOU ARE TRYING TO ACCESS IS CURRENTLY UNAVAILABLE"
    },
    component: () => import('../views/ErrorTemplate.vue')
  },
  {
    path: '/error',
    name: 'Unhandled',
    props: {
      errorMessage: "An error occurred", 
      errorStatus: "???", 
      errorText: "SORRY, AN ERROR OCCURRED WE HAVEN'T HANDLED YET"
    },
    component: () => import('../views/ErrorTemplate.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    props: {
      errorMessage: "This page could not be found", 
      errorStatus: "404", 
      errorText: "SORRY, BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN REMOVED, NAME CHANGED OR IS TEMPORARILY UNAVAILABLE"
    },
    component: () => import('../views/ErrorTemplate.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
