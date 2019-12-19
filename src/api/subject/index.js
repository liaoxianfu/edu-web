import request from '@/utils/request'
import {eduService} from '@/config'

const baseUrl = eduService + '/admin/edu/subject'

export const getSubject = function () {
  return request(
    {
      url: baseUrl,
      method: 'get',
    }
  )
}

export const deleteSubject = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
}

export const addSubject = function (data) {
  return request({
    url: baseUrl,
    method: 'post',
    data: data
  })
}

// 获取一级标题的数据
export const getFirstLevelSubList = function () {
  return request({
    url: `${baseUrl}/firstLevel`,
    method: 'get',
  })
}


// 获取二级id
export const getSecondLevelSubList = function (id) {
  return request({
    url: `${baseUrl}/secondLevel/${id}`,
    method: 'get'
  })
}

// 通过id获取Subject

export const getSubjectById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

// 通过二级id获取一级的信息
export const getFirstLevelSubject = function (id) {
  return request({
    url: `${baseUrl}/firstLevel/${id}`,
    method: 'get'
  })
}
