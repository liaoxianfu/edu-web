import {resourceService, videoUrl} from "@/config";
import request from '@/utils/request'

const baseUrl = resourceService + videoUrl

export const getVideoNameById = function (id) {
  return request({
    url: baseUrl + "/" + id,
    method: 'get'
  })
}

export const removeById = function (id) {
  return request({
    url: baseUrl + '/' + id,
    method: 'delete',
  })
}

export const saveStage = function (eduResource) {
  return request({
    url: baseUrl + "/storage",
    method: 'post',
    data: eduResource
  })
}
