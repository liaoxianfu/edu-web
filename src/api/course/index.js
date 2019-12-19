import request from '@/utils/request'
import {eduService} from '@/config'

const baseUrl = eduService + '/admin/edu/course'

export const saveCourseInfo = function (data) {
  return request({
    url: baseUrl,
    method: 'post',
    data: data
  })
}

export const getCourseInfoById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get',
  })
}


export const updateCourseInfoById = function (data) {
  return request({
    url: baseUrl,
    method: 'put',
    data: data
  })
}


export const getAllCourseInfo = function (current, size, queryData) {
  return request({
    url: `${baseUrl}/${current}/${size}`,
    method: 'post',
    data: queryData
  })
}

export const deleteCourseById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
}

export const getPublishData = function (id) {
  return request({
    url: `${baseUrl}/publish/${id}`,
    method: 'get'
  })
}

export const publishCourse = function (data) {
  return request({
    url: `${baseUrl}/publish`,
    method: 'post',
    params:data
  })

}



