import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/* import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'*/

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/503',
    component: () => import('@/views/error-page/503'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: '/marketorder',
        component: () => import('@/views/marketorder/index'),
        children: [],
        name: 'marketorder',
        meta: {
          title: '集市订单管理',
          icon: ''
        }
      },
      {
        path: '/orders',
        component: () => import('@/views/orders/index'),
        children: [],
        name: 'orders',
        meta: {
          title: '链上订单管理',
          icon: ''
        }
      },
      {
        path: '/flash-order',
        component: () => import('@/views/flashOrder/index'),
        children: [],
        name: 'flashOrder',
        meta: {
          title: '闪汇订单管理',
          icon: ''
        }
      }
    ],
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'order'
    }
  },

  {
    path: '/servicecharge',
    component: Layout,
    name: 'servicecharge',
    meta: {
      title: '手续费奖励明细',
      icon: 'agent'
    },
    children: [
      {
        path: '/servicecharge',
        component: () => import('@/views/servicecharge/index'),
        name: 'servicecharge',
        meta: {
          title: '手续费奖励明细',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/copyrightfee',
    component: Layout,
    name: 'copyrightfee',
    meta: {
      title: '版权费奖励明细',
      icon: 'box'
    },
    children: [
      {
        path: '/copyrightfee',
        component: () => import('@/views/copyrightfee/index'),
        name: 'copyrightfee',
        meta: {
          title: '版权费奖励明细',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/good',
    component: Layout,
    children: [
      {
        path: '/goods',
        component: () => import('@/views/goods/index'),
        children: [],
        name: 'goods',
        meta: {
          title: '链上藏品管理',
          icon: ''
        }
      },
      {
        path: '/goods-flash',
        component: () => import('@/views/goods-flash/index'),
        children: [],
        name: 'goodsFlash',
        meta: {
          title: '闪汇藏品管理',
          icon: ''
        }
      },
      {
        path: '/lock',
        component: () => import('@/views/configs/locksetting'),
        children: [],
        name: 'lock',
        meta: {
          title: '链上锁单设置',
          icon: ''
        }
      },
      {
        path: '/lock-flash',
        component: () => import('@/views/configs/lock-flash'),
        children: [],
        name: 'lockFlash',
        meta: {
          title: '闪汇锁单设置',
          icon: ''
        }
      }
    ],
    name: 'collection',
    meta: {
      title: '藏品管理',
      icon: 'collection'
    }
  },
  {
    path: '/account_management',
    component: Layout,
    children: [
      {
        path: '/accountmanagement',
        component: () => import('@/views/accountmanagement/index'),
        children: [],
        name: 'accountmanagement',
        meta: {
          title: '收益账单',
          icon: ''
        }
      },
      {
        path: '/billing',
        component: () => import('@/views/billing/index'),
        children: [],
        name: 'billing',
        meta: {
          title: '我的公户信息',
          icon: ''
        }
      }
    ],
    name: 'collection',
    meta: {
      title: '账单管理',
      icon: 'btc'
    }
  },
  {
    path: '/plan',
    component: Layout,
    children: [
      {
        path: '/plans',
        component: () => import('@/views/plans/index'),
        children: [],
        name: 'plans',
        meta: {
          title: '发售计划管理',
          icon: ''
        }
      },
      {
        path: '/topics',
        component: () => import('@/views/topics/index'),
        children: [],
        name: 'topics',
        meta: {
          title: '观点管理',
          icon: ''
        }
      },
      {
        path: '/home',
        component: () => import('@/views/home/index'),
        children: [],
        name: 'home',
        meta: {
          title: '藏友之家管理',
          icon: ''
        }
      }
    ],
    name: 'collection',
    meta: {
      title: '社区管理',
      icon: 'collection'
    }
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
