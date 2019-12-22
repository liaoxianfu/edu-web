import request from '@/utils/request'
import {eduService} from '@/config'

const baseUrl = eduService + '/admin/edu/teacher'


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

// 获取所有的教师

export const getAllTeacher = function () {
  return request({
    url: baseUrl,
    method: 'get'
  })
}

// 获取教师map信息


export const getAllTeacherMap = function () {
  return request({
    url: baseUrl + '/map',
    method: 'get'
  })
}
