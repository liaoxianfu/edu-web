import Layout from "@/layout/index";

export const testRouter = {
  path: '/test-manger',
  name: '测试管理',
  meta: {title: "测试", icon: 'user'},
  redirect: '/test/test-list',
  component: Layout,
  children: [
    {
      path: 'test-list',
      component: () => import('@/views/test/index'),
      name: 'test-list',
      meta: {title: '腾讯视频测试'}
    }]
}
