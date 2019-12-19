import {ossService} from "@/config";
import {editor_image_host} from "@/config";
import axios from 'axios'

export const uploadImage = function (file) {
  const config = {
    headers: {"Content-Type": "multipart/form-data"}
  };
  const formData = new FormData();
  formData.append("file", file)
  return axios.post(ossService + editor_image_host, formData, config)
}
