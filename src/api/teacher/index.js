import request from '@/utils/request'

const baseUrl = '/admin/edu/teacher'




export const teacherPageList = function (page, size, params) {
  return request({
    url: `${baseUrl}/${page}/${size}`,
    method: 'get',
    params: params,
  })
};


export const deleteTeacherById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
};

export const postTeacher = function (data) {

  return request({
    url: baseUrl,
    method: 'post',
    data: data
  })
};

export const getTeacherById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get',
  })
};

export const updateTeacherById = function (id, data) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'put',
    data: data
  })
}
