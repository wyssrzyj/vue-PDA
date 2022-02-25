import { toasting, hasToken } from '../utils/index.js'

export const requestApi = async (url, method, options = {}) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '加载中...'
    })
    uni.request({
      method: method ? method : "GET",
      header: {
        // 'content-type':'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        "X-AjaxPro-Method": "ShowList",
        'Access-Control-Allow-Origin': '*',
        'Origin-Terminal': 'PDA',
        token: uni.getStorageSync('token')
      },
      url: url,
      data: options,
	  // #ifdef APP
	  sslVerify:false,
	  // #endif
      async success(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 401) {
            // 400: "请求参数错误",
            // 401: "未授权，请登录",
            // 403: "拒绝访问",
            // 404: `请求地址出错: ${getValueByKeys(error, "response.config.url", "")}`,
            // 408: "请求超时",
            // 500: "API接口报500错误",
            // 501: "服务未实现",
            // 502: "网关错误",
            // 503: "服务不可用",
            // 504: "网关超时",
            // 505: "HTTP版本不受支持"
            toasting('登陆过期，请重新登录')
            if (!hasToken()) {
              uni.navigateTo({
                url: '/pages/login/mes_login',
              })
            }
          } else {
            await resolve(res.data)
            uni.hideLoading()
          }
        } else if (res.statusCode == 500) {
          //用switch写不同的情况
          toasting('服务器错误')
          uni.hideLoading()
        } else {
          uni.hideLoading()
        }
      },
      async fail(res) {
		console.log(url)
		console.log(res)
        await reject(res)
        uni.hideLoading()
      }
    })
  })
}
