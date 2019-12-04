import Layout from "@/layout/index";

export const teacherRouter =
  {
    path: '/teacher-manger',
    name: '教师管理',
    meta: {title: "教师管理", icon: 'user'},
    redirect: '/teacher-manger/teacher-list',
    component: Layout,
    children: [
      {
        path: 'teacher-list',
        component: () => import('@/views/teacher/teacher-list'),
        name: 'teacher-list',
        meta: {title: '教师列表'}
      }, {
        path: 'teacher-add',
        component: () => import('@/views/teacher/teacher-add'),
        name: 'teacher-add',
        meta: {title: '添加教师'}
      }, {
        path: 'teacher-edit/:id',
        component: () => import('@/views/teacher/teacher-edit'),
        name: 'teacher-edit',
        meta: {title: '修改教师'},
        hidden: true
      },
    ]
  };
