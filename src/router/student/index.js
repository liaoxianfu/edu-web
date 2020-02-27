import Layout from "@/layout/index";

export const studentRouter = {
  path: '/student',
  component: Layout,
  redirect: '/student/list',
  name: 'Student',
  meta: {title: '学生管理', icon: 'user'},
  children: [
    {
      path: 'list',
      name: 'EduStudentList',
      component: () => import('@/views/student/list'),
      meta: {title: '学生列表'}
    }, {
      path: 'add',
      name: 'EduStudentAdd',
      component: () => import('@/views/student/add'),
      meta: {title: '添加学生'}
    },
    {
      path: 'import',
      name: 'EduStudentImport',
      component: () => import('@/views/student/import'),
      meta: {title: '导入学生'}
    }, {
      path: 'edit/:id',
      name: 'EduStudentEdit',
      component: () => import('@/views/student/edit'),
      hidden: true
    },
  ]
}
