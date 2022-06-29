
import { requestApi } from './request.js';

// const API_ADDRESS = 'http://10.18.56.96:8081'// 周扬ip
// const API_ADDRESS = 'http://192.168.1.100:8081' // 蔡鹏志ip
// const API_ADDRESS = 'http://192.168.213.49:8081' // 周志建ip
// const API_ADDRESS = 'http://172.26.1.38:8081' // 周志建ip
// const API_ADDRESS = 'http://172.26.0.56:8081' // 盛宝利线上地址
// const API_ADDRESS = 'http://192.168.68.58:8081' // 国庆
// let API_ADDRESS = 'http://192.168.31.89:8081'//测试
// let API_ADDRESS = 'http://192.168.31.89:8081'//盛宝丽
let API_ADDRESS = 'http://10.18.34.6:8081'

export const changeApi=(api)=>{
	API_ADDRESS = `http://${api}`
	console.log("当前环境:"+API_ADDRESS)
}

const Api = {
	// 登录
	login(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/pdalogin/login`, 'POST', reqData)
	},
	// 导航窗格接口
	pdaNav(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/pdalogin/nav`, 'GET', reqData)
	},
	// 权限标识
	getPermissions(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/pdalogin/permissions`, 'GET', reqData)
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
	},
	//报工管理扫描PCS码
	productionReportingPCS(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesengineeringmanagement/inquire`, 'GET', reqData)
	},
	//报工管理选中工序获取工段信息
	productionReportingGetProcess(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesengineeringmanagement/getProductNames`, 'GET', reqData)
	},
	//报工管理报工
	productionReporting(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesengineeringmanagement/saveEngineeringManagement`, 'POST', reqData)
	},
	//报工管理获取当前员工
	productionGetAdmin(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesengineeringmanagement/user`, 'GET', reqData)
	},
	// 根据布条码获取收货数据
	getReceiveData(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/messpreadcloth/getReceiveData`, 'GET', reqData)
	},
	// 根据布条码获取铺布数据
	getSpreadClothData(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/messpreadcloth/getSpreadClothData`, 'GET', reqData)
	},
	// 提交铺布数据
	saveData(reqData) {
	  return requestApi(`${API_ADDRESS}/mes/messpreadcloth/saveData`, 'POST', reqData)
	},
	
	// 裁片出库
	//查询生产单号
	// queryProductionNum(reqData){
	//   return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outWarehouseProduce`, 'GET', reqData)
	// },
	queryProductionNum(reqData){
	  return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outWarehouseProduce`, 'GET', reqData)
	},
	//查询出库班组
	queryIssueTeam(reqData){
	  return requestApi(`${API_ADDRESS}/mes/mesteammanager/list`, 'GET', reqData)
	},
	//扫描包条码
	scanPackageBarcode(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/getPiecesByPCSNum2`, 'GET', reqData)
	},
	//裁片出库
	cuttingStockOut(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outOfStock2`, 'POST', reqData)
	},
}

export default Api
