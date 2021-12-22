import {
	http
} from '../utils/http.js';
import {
	toasting
} from '../utils/index.js'
//登录
// export const login = async (options, func) => {
// 	try {
// 		const isLogin = await http('http://192.168.99.140/proxyApi/login', 'POST', options)
		
		
// 		console.log(isLogin)
// 		const { data } = isLogin
// 		const {code, data: resData, msg} = data
// 		console.log(resData)
// 		if (code == '0') {
// 			toasting('登录成功')
// 			uni.removeStorageSync('token')
// 			uni.setStorageSync('token', resData.token)
// 			await func()
// 			return data
// 		} else {
// 			// switch (code){
// 			//     case 1:
// 			//         toasting(msg)
// 			//         break;
// 			//     case 2:
// 			//         toasting(msg)
// 			//         break;
// 			//     default:
// 			// 		toasting(msg)
// 			// }
// 			toasting(msg)
// 		}
// 	} catch (error) {
// 		toasting(error.errMsg)
// 	}
// }
//获取登录用户信息
// export const getUser = async (options = {}, func) => {
// 	try {
// 		const isUserDetail = await http('sys/user/info', 'GET', options)
// 		const {data: {code, msg, data: userData}} = isUserDetail
// 		if (code == 0) {
// 			func ? await func() : console.log('no func')
// 			return userData
// 		} else {
// 			//写不同的情况
			
// 			// switch code case......
// 			toasting(msg)
// 		}
// 	} catch (error) {
// 		toasting(error.errMsg)
// 	}
// }
//修改密码
export const resetPwd = async (options, func) => {
	try {
		const isReset = await http('sys/user/password', 'PUT', options)
		const {data: {code, msg}} = isReset
		if (code == 0) {
			await toasting(msg, async() => {
				func ? await func() : console.log('no func')
			})
		} else {
			toasting(msg)
		}
	} catch (error) {
		toasting(error.errMsg)
	}
}
//退出账号
export const logout = async() => {
	try {
		const isReset = await http('logout', 'POST')
		const {data: {code,data,msg}} = isReset
		if (code == 0) {
			uni.removeStorage('token')
			uni.redirectTo({
				url:'/pages/login/login',
				success() {
					toasting('退出成功')
				}
			})
		} else {
			toasting(msg)
			return code
		}
	} catch (error) {
		toasting(error.errMsg)
	}
}
