import request from '@/utils/request'
// 在后期统一网关的时候添加 eduService
import {eduService} from '@/config'
// 统一网关的url
const baseUrl = eduService+'/admin/edu/student'
// 单体测试
// const student_pre = '/student'
// const baseUrl = student_pre + '/admin/edu/student'


export const studentPageList = function (page, size, params) {
  return request({
    url: `${baseUrl}/${page}/${size}`,
    method: 'post',
    data: params,
  })
};

export const deleteStudentById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })

}

export const addStudent = function (data) {
  return request({
    url: `${baseUrl}`,
    method: 'post',
    data: data
  })
}

export const getStudent = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })

}

export const updateStudent = function (data) {
  return request({
    url: `${baseUrl}`,
    method: 'put',
    data: data
  })

}

