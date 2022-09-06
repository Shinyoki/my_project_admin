import axios from "axios";

let baseURL = "/api"

/**
 * 发送Get请求
 */
export function getRequest(url, params, header) {
    return axios({
        method: "get",
        url: `${baseURL}${url}`,
        params,
        headers: header
    })
}

/**
 * 发送Post请求
 */
export function postRequest(url, params, header) {
    return axios({
        method: "post",
        url: `${baseURL}${url}`,
        data: params,
        headers: header
    })
}

/**
 * 发送Put请求
 */
export function putRequest(url, params, header) {
    return axios({
        method: "put",
        url: `${baseURL}${url}`,
        data: params,
        headers: header
    })
}

/**
 * 发送Delete请求
 */
export function deleteRequest(url, params, header) {
    return axios({
        method: "delete",
        url: `${baseURL}${url}`,
        data: params,
        headers: header
    })
}
