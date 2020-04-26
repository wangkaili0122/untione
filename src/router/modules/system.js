/**
 * 系统设置的路由
 */
const systemRouter = [
  {
    path: '/',
    name:'main',
    // redirect: '/personalCenter',
    component: () => import('@/views/home/components/personalCenter/personal-center.vue'),
    meta: {
      title:'首页',
      auth: false,
      keepAlive: false
    }
  },
  {
    path: '/menus',
    component: () => import('@/views/system/menus/menus.vue'),
    name: 'sys_menus',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/role',
    component: () => import('@/views/system/role/role.vue'),
    name: 'sys_role',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/user',
    component: () => import('@/views/system/user/user.vue'),
    name: 'sys_user',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/dept',
    component: () => import('@/views/system/department/department.vue'),
    name: 'sys_dept',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/post',
    component: () => import('@/views/system/post/post.vue'),
    name: 'sys_post',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/loginLog',
    component: () => import('@/views/system/log/login-log.vue'),
    name: 'sys_login_log',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/operationLog',
    component: () => import('@/views/system/log/operation-log.vue'),
    name: 'sys_operation_log',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/dictType',
    component: () => import('@/views/system/dict/dict-type.vue'),
    name: 'sys_dict_type',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/dictValue',
    name: 'sys_dict_value',
    component: () => import('@/views/system/dict/dict-value.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/config',
    name: 'sys_config',
    component: () => import('@/views/system/config/config.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/app',
    name: 'sys_app',
    component: () => import('@/views/system/app/app.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/task',
    name: 'sys_task',
    component: () => import('@/views/system/task/task.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/taskLog',
    name: 'sys_task_log',
    component: () => import('@/views/system/task-log/task-log.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/monitor',
    name: 'sys_monitor',
    component: () => import('@/views/system/monitor/monitor.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/appmount',
    name: 'sys_app_mount',
    component: () => import('@/views/system/app/app-mount.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/notice',
    name: 'sys_notice',
    component: () => import('@/views/system/notice/notice.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/noticeAdd',
    name: 'sys_notice_add',
    component: () => import('@/views/system/notice/notice-add.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/file',
    name: 'sys_file',
    component: () => import('@/views/system/file/file.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/message',
    name: 'sys_message',
    component: () => import('@/views/system/message/message.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/messageAdd',
    name: 'sys_message_add',
    component: () => import('@/views/system/message/message-add.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/appStatistics',
    name: 'sys_app_statistics',
    component: () => import('@/views/system/app-statistics/app-statistics.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/serviceStatistics',
    name: 'sys_service_statistics',
    component: () => import('@/views/system/service-statistics/service-statistics.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/authentication',
    name: 'sys_authentication',
    component: () => import('@/views/system/authentication/authentication.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/link',
    name: 'sys_link',
    component: () => import('@/views/system/link/link.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/sysSetting',
    name: 'sys-setting',
    component: () => import('@/views/system/sys-setting/index.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/dataSource',
    name: 'data_source',
    component: () => import('@/views/system/data-source/data-source.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/customComponentManager',
    name: 'cust_comp_manager',
    component: () => import('@/views/system/custom-component/index.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/userStatistics',
    name: 'user-statistics',
    component: () => import('@/views/system/user-statistics/index.vue'),
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '*', /* 路由匹配不到的就跳转到404页面 */
    redirect: {path: '/'},
    name:'无路径',
    meta: {
      auth: false,
      showInMenu: false
    }
  },
  {
    path: 'dataBackup',
    name: 'data-backup',
    component: () => import('@/views/system/data-backup'),
    meta: {
      auth: true,
      permission: true,
      keepAlive: true
    }
  },
  {
    path: 'backupList',
    name: 'backup-list',
    component: () => import('@/views/system/data-backup/backup-list'),
    meta: {
      auth: true,
      permission: true,
      keepAlive: false
    }
  }
]

export default systemRouter
