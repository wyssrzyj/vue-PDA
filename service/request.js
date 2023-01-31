import { toasting, hasToken } from '../utils/index.js'

export const requestApi = async (url, method, options = {}) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '加载中...'
    })
	let header = {
		// 'content-type':'application/x-www-form-urlencoded',
		'Content-Type': 'application/json;charset=UTF-8',
		"X-AjaxPro-Method": "ShowList",
		'Access-Control-Allow-Origin': '*',
		'Origin-Terminal': 'PDA',
	  }
	if (uni.getStorageSync('token')) header['token']= uni.getStorageSync('token')
	//系统id判断新恒还是可祺员工
	if (!header['systemId']&&options['systemId']) header['systemId']=options.systemId
	//租户的编码
	if (!header['tenantCode']&&options['tenantCode']) header['tenantCode']=options.tenantCode
    uni.request({
      method: method ? method : "GET",
      header:header,
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
            toasting('登录过期，请重新登录')
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
        await reject(res)
        uni.hideLoading()
      }
    })
  })
}

// 上传文件
export const upload = (url, options = {}) => {
	// resolve 正常响应，reject异常响应
	return new Promise((resolve, reject) => {
		uni.showLoading({
		  title: '上传中...'
		})
		uni.uploadFile({
		    url:url + `?token=${uni.getStorageSync('token')}`,// 服务器 url
		    filePath: options.filePath, // 要上传文件资源的路径。
		    name: options.name || 'file', // File 对象对应 key
			formData: options.data || {}, //额外的 form data 
			timeout: 8000, // 8秒超时时间，单位ms
			success: (res) => {
				if(res.statusCode === 200) {
					resolve(JSON.parse(res.data))
				}else {
					reject(res)
				}
				uni.hideLoading()
			},
			fail: (err) => {
				message.toast('请求接口失败','error')
				reject(err)
			},
		})
	}) 
}