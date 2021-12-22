
import { requestApi } from './request.js';

// const API_ADDRESS = 'http://192.168.68.10:8081' // 周扬ip
// const API_ADDRESS = 'http://172.26.0.56:8081' // 蔡鹏志ip
const API_ADDRESS = 'http://192.168.99.140/proxyApi' // 线上地址
// const API_ADDRESS = '/proxyApi'

const Api = {
	// 登录
	login(reqData) {
	  return requestApi(`${API_ADDRESS}/login`, 'POST', reqData)
	},
	// 扫描库位
	getLocation(reqData) {
	  return requestApi(`${API_ADDRESS}/MesLocationManagement/meslocationmanagement/getLocation`, 'GET', reqData)
	},
	// 扫描pcs码获取扎包信息
	getInfoBySearch(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getInfoBySearch`, 'GET', reqData)
	},
	// 添加入库和撤销入库记录
	addPiecesMarket(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/addPiecesMarket`, 'POST', reqData)
	},
	// 撤销入库原因记录
	getReason(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getReason`, 'GET', reqData)
	},
	
	// 扫描缝制任务单号
	getSewingExecution(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getSewingExecution`, 'GET', reqData)
	},
	// 扫描pcs码
	getPiecesByPCSNum(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getPiecesByPCSNum`, 'GET', reqData)
	},
	// 出库
	outOfStock(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outOfStock`, 'POST', reqData)
	}
}

export default Api