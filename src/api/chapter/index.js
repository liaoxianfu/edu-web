import request from '@/utils/request'
import {eduService} from '@/config'

const baseUrl = eduService + '/admin/edu/chapter'

//获取章节信息

export const getChapterByCourse = function (courseId) {
  return request({
    url: baseUrl + '/chapterVoList/' + courseId,
    method: 'get'
  })
}


export const getChapterById = function (chapterId) {
  return request({
    url: baseUrl + '/' + chapterId,
    method: 'get'
  })
}

export const addChapter = function (data) {
  return request({
    url: baseUrl,
    method: 'post',
    data: data
  })
}


export const updateChapter = function (data) {
  console.log("发送的数据为", data)
  return request({
    url: baseUrl,
    method: 'put',
    data: data
  })
}

export const deleteChapter = function (id) {
  return request({
    url: baseUrl + '/' + id,
    method: 'delete',
  })
}

