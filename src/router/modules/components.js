export const localMap = {
  /* login: require('login/index').default // 同步的方式
  login:()=> import('login/index')      // 异步的方式 */
  menu: () => import('@/views/menu/index'), // 权限管理
  role: () => import('@/views/role/index'), // 角色管理
  admin: () => import('@/views/admin/index') // 管理员管理
}
