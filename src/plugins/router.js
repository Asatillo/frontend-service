import { createRouter, createWebHistory } from 'vue-router'
import { useSnackbarStore } from '@/stores/SnackBarStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: () => import('../views/SubscriptionsView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales', 'agent']
    }

  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/SalesView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales']
    }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../views/CustomersView.vue'),
    meta: {
      roleAllowed: ['admin', 'agent']
    }
  },
  {
    path: '/customers/:id',
    name: 'Customer',
    component: () => import('../views/CustomerView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales', 'agent']
    }
  },
  {
    path: '/plans',
    name: 'Plans',
    component: () => import('../views/PlansView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales', 'agent']
    }
  },
  {
    path: '/devices',
    name: 'Devices',
    component: () => import('../views/DevicesView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales', 'agent']
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales', 'agent']
    }
  },
  {
    path: '/my-profile',
    name: 'MyProfile',
    component: () => import('../views/MyProfileView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales', 'agent']
    }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/ServicesView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales', 'agent']
    }
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: () => import('../views/PromotionsView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales']
    }
  },
  {
    path: '/offered-promotions',
    name: 'OfferedPromotions',
    component: () => import('../views/OfferedPromotionsView.vue'),
    meta: {
      roleAllowed: ['admin', 'sales']
    }
  }, {
    path: '/network-entities',
    name: 'NetworkEntities',
    component: () => import('../views/NetworkEntitiesView.vue'),
    meta: {
      roleAllowed: ['admin', 'agent']
    }
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

router.beforeEach((to, from) => {
  if (!to.meta.roleAllowed || (to.meta.roleAllowed && isAllowed(to.meta.roleAllowed))) {
    document.title = to.name
  }else{
    return { name: 'Forbidden'};
  }
})

function isAllowed(rolesAlowed) {
  var user = JSON.parse(localStorage.getItem("user"));
  var setA = new Set(user.roles);
  var setB = new Set(rolesAlowed);
  var intersection = new Set([...setA].filter(x => setB.has(x)));
  return Array.from(intersection).length > 0;
}

export default router
