
import { requestApi } from './request.js';

// const API_ADDRESS = 'http://172.26.1.38:8081' // 周扬ip
// const API_ADDRESS = 'http://192.168.1.100:8081' // 蔡鹏志ip
// const API_ADDRESS = 'http://192.168.213.49:8081' // 周志建ip
// const API_ADDRESS = 'http://172.26.1.38:8081' // 周志建ip
// const API_ADDRESS = 'http://192.168.1.5/proxyApi' // 盛宝利线上地址
const API_ADDRESS = 'http://172.26.0.56:8081' // 盛宝利线上地址
// const API_ADDRESS = 'http://192.168.99.140:8081'//杰克线上地址

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
	},
	//查询产品款号
	productQuery(reqData){
		return requestApi(`${API_ADDRESS}/MesSewingExecutionMessage/messewingexecutionmessage/fromSewGetProduce`, 'POST', reqData)
	},
	//查询产品款号
	supplierQuery(reqData){
		return requestApi(`${API_ADDRESS}/MesSewingExecutionMessage/messewingexecutionmessage/fromSewGetSupplier`, 'POST', reqData)
	},
	//获取领料明细
	pickingDet(reqData){
		return requestApi(`${API_ADDRESS}/MesSewingExecutionMessage/messewingexecutionmessage/getPickingDetails`, 'POST', reqData)
	},
	//外发出库
	outboundDelivery(reqData){
		return requestApi(`${API_ADDRESS}/MesSewingExecutionMessage/messewingexecutionmessage/getPickingDetails`, 'POST', reqData)
	},
	//扫描PCS码
	outScanPCS(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getOutwardProcessByPCSNum`, 'GET', reqData)
	},
	//外发加工出库
	outOutsourcingDelivery(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outwardProcessoutOfStock`, 'POST', reqData)
	},
	//外发加工入库扫描库位
	outReceiptScanLocation(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getOutwardProcessByLocationCode`, 'GET', reqData)
	},
	//外发加工入库扫描PCS码
	outReceiptScanPCS(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outwardProcessWarehousingByPcsNum`, 'GET', reqData)
	},
	//外发加工入库
	outReceipt(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outwardProcessWarehousingOfStock`, 'POST', reqData)
	}
}

export default Api