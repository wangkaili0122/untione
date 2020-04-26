/**
 * 个人中心的路由
 */
const personalCenterRouter = [
  {
    path: '/myMessage',
    component: () => import('@/views/home/components/personalCenter/work-item/my-message.vue'),
    name: 'my-message',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/myHandle',
    component: () => import('@/views/home/components/personalCenter/work-item/my-handle.vue'),
    name: 'my-handle',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/newsNotice',
    component: () => import('@/views/home/components/personalCenter/work-item/news-notice.vue'),
    name: 'news-notice',
    meta: {
      auth: true,
      keepAlive: false
    }
  },
  {
    path: '/fileDownloads',
    component: () => import('@/views/home/components/personalCenter/work-item/file-downloads.vue'),
    name: 'file-downloads',
    meta: {
      auth: true,
      keepAlive: false
    }
  }
]

export default personalCenterRouter
