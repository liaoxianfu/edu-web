import request from "@/utils/request";

import {eduService} from '@/config';

const baseUrl = eduService + '/admin/edu/video'

export const saveOrUpdateVideo = function (data) {
  return request({
    url: baseUrl,
    data: data,
    method: 'post'
  })
}

export const getVideoById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'get'
  })
}

export const deleteVideoById = function (id) {
  return request({
    url: `${baseUrl}/${id}`,
    method: 'delete'
  })
}
