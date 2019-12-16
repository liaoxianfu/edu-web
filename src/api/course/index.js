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

