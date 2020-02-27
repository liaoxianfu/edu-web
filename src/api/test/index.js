import {resourceService, videoUrl} from "@/config";
import request from '@/utils/request'

const baseUrl = resourceService + videoUrl

export const getSignature = function () {
  return request({
    url: baseUrl + "/tencent/signature",
    method: "post"
  })
}
