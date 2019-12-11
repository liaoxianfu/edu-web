import Layout from "@/layout/index";
// 课程分类管理
export const subjectRouter = {
  path: '/subject',
  component: Layout,
  redirect: '/subject/list',
  name: 'Subject',
  meta: {title: '分类管理', icon: 'nested'},
  children: [
    {
      path: 'list',
      name: 'EduSubjectList',
      component: () => import('@/views/subject/list'),
      meta: {title: '分类列表'}
    },
    {
      path: 'import',
      name: 'EduSubjectImport',
      component: () => import('@/views/subject/import'),
      meta: {title: '导入分类'}
    }
  ]
}
