
import { requestApi, upload } from './request.js';

// const API_ADDRESS = 'http://10.18.56.96:8081'// 周扬ip
// const API_ADDRESS = 'http://192.168.1.100:8081' // 蔡鹏志ip
// const API_ADDRESS = 'http://192.168.213.49:8081' // 周志建ip
// const API_ADDRESS = 'http://172.26.1.38:8081' // 周志建ip
// const API_ADDRESS = 'http://172.26.0.56:8081' // 盛宝利线上地址
// const API_ADDRESS = 'http://192.168.68.58:8081' // 国庆
// let API_ADDRESS = 'http://192.168.31.89:8081'//测试
// let API_ADDRESS = 'http://192.168.31.89:8081'//盛宝丽
// let API_ADDRESS = 'http://192.168.0.235:8081'
let API_ADDRESS = ''

export const changeApi=(api)=>{
	API_ADDRESS = `http://${api}`
	console.log("当前环境:"+API_ADDRESS)
}

const Api = {
	// 登录
	login(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/pdalogin/login`, 'POST', reqData)
	},
	//扫码登录
	scanLogin(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-admin-api/loginForQRCode`, 'POST', reqData)
	},
	getUserInfo(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/user`, 'GET', reqData)
	},
	// 导航窗格接口
	pdaNav(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/pdalogin/nav`, 'GET', reqData)
	},
	// 权限标识
	getPermissions(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/pdalogin/permissions`, 'GET', reqData)
	},
	// 功能标识
	getFunc() {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/sysconfigpage/selectAllAuthorization`, 'GET')
	},
	// 扫描库位
	getLocation(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/MesLocationManagement/meslocationmanagement/getLocation`, 'GET', reqData)
	},
	// 扫描pcs码获取扎包信息
	getInfoBySearch(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/getInfoBySearch`, 'GET', reqData)
	},
	// 添加入库和撤销入库记录
	addPiecesMarket(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/addPiecesMarket`, 'POST', reqData)
	},
	// 撤销入库原因记录
	getReason(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/getReason`, 'GET', reqData)
	},
	
	// 扫描缝制任务单号
	getSewingExecution(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/getSewingExecution`, 'GET', reqData)
	},
	// 扫描pcs码
	getPiecesByPCSNum(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/getPiecesByPCSNum`, 'GET', reqData)
	},
	// 出库
	outOfStock(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/outOfStock`, 'POST', reqData)
	},
	//查询产品款号
	productQuery(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/MesSewingExecutionMessage/messewingexecutionmessage/fromSewGetProduce`, 'POST', reqData)
	},
	//查询产品款号
	supplierQuery(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/MesSewingExecutionMessage/messewingexecutionmessage/fromSewGetSupplier`, 'POST', reqData)
	},
	//获取领料明细
	pickingDet(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/MesSewingExecutionMessage/messewingexecutionmessage/getPickingDetails`, 'POST', reqData)
	},
	//外发出库
	outboundDelivery(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/MesSewingExecutionMessage/messewingexecutionmessage/getPickingDetails`, 'POST', reqData)
	},
	//扫描PCS码
	outScanPCS(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/getOutwardProcessByPCSNum`, 'GET', reqData)
	},
	//外发加工出库
	outOutsourcingDelivery(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/outwardProcessoutOfStock`, 'POST', reqData)
	},
	//外发加工入库扫描库位
	outReceiptScanLocation(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/getOutwardProcessByLocationCode`, 'GET', reqData)
	},
	//外发加工入库扫描PCS码
	outReceiptScanPCS(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/outwardProcessWarehousingByPcsNum`, 'GET', reqData)
	},
	//外发加工入库
	outReceipt(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/outwardProcessWarehousingOfStock`, 'POST', reqData)
	},
	//报工管理扫描PCS码
	productionReportingPCS(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/inquire`, 'GET', reqData)
	},
	//报工管理选中工序获取工段信息
	productionReportingGetProcess(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/getProductNames`, 'GET', reqData)
	},
	//报工管理报工
	productionReporting(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/saveEngineeringManagement`, 'POST', reqData)
	},
	//报工管理获取当前员工
	productionGetAdmin(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/user`, 'GET', reqData)
	},
	//根据id获取员工信息
	getStaffInfo(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesemployee/${reqData}`, 'GET')
	},
	// 根据包条码和员工ID获取员工信息和工段工序缓存
	getStaffInfoCache(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/getEmployeeLastReport`, 'GET',reqData)
	},
	// 获取组码报工今日报工数量
	getReportNum(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/getEmployeeTodayReport`, 'GET', reqData)
	},
	//获取所有员工列表
	getAlluser(url,reqData){
		return requestApi(`${API_ADDRESS}${url}`, 'GET', reqData)
	},
	// 根据布条码获取收货数据
	getReceiveData(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/messpreadcloth/getReceiveData`, 'GET', reqData)
	},
	// 根据布条码获取铺布数据
	getSpreadClothData(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/messpreadcloth/getSpreadClothData`, 'GET', reqData)
	},
	// 提交铺布数据
	saveData(reqData) {
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/messpreadcloth/saveData`, 'POST', reqData)
	},
	
	// 裁片出库
	//查询生产单号
	// queryProductionNum(reqData){
	//   return requestApi(`${API_ADDRESS}/mes/mespiecesmarket/outWarehouseProduce`, 'GET', reqData)
	// },
	queryProductionNum(reqData){
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/outWarehouseProduce`, 'GET', reqData)
	},
	//查询出库班组
	queryIssueTeam(reqData){
	  return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesteammanager/list`, 'GET', reqData)
	},
	//扫描包条码
	scanPackageBarcode(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/getPiecesByPCSNum2`, 'GET', reqData)
	},
	//裁片出库
	cuttingStockOut(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespiecesmarket/outOfStock2`, 'POST', reqData)
	},
	//获取班组信息
	groupInfo(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/user`, 'GET', reqData)
	},
	//质检获取数据
	mesqualityInspection(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/scanningGroupCode`, 'GET', reqData)
	},
	//质检新增自定义标签
	updateTag(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesdefectsgruop/addCustom`, 'GET', reqData)
	},
	//质检删除自定义标签
	deleteTag(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesdefectsgruop/delectCustom`, 'GET', reqData)
	},
	//质检上传文件
	uploadFile(reqData){
		return upload(`${API_ADDRESS}/njp-plus-mes-api/mes/oss/upload`, reqData)
	},
	//质检提交
	// submitMesqualit(reqData){
	// 	return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/submitPad`, 'POST', reqData)
	// },
	//质检提交，只有数量和质检原因
	submitMesqualit(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/savaOrderSubpackageCodeInfo`, 'POST', reqData)
	},
	//返修获取数据
	mesRepairInfo(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/scanningReworkCode`, 'GET', reqData)
	},
	// 修改返修状态
	// updateRepairStatus(url,reqData){
	// 	return requestApi(`${API_ADDRESS}/${url}`, 'GET', reqData)
	// },
	// 获取瑕疵点
	getDefects(){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesdefectsgruop/selectDefectsToPda`, 'GET')
	},
	// 修改返修
	updateRepairStatus(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesreworkscrapinfo/reworkSubmit`, 'POST', reqData)
	},
	// 获取单个生产单购物车信息
	getCartList(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesreworkscrapcart/selectReworkCart`, 'GET', reqData)
	},
	// 获取全部返修车信息
	getAllCartList(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/hengReworkPage`, 'GET', reqData)
	},
	// 获取质检记录
	getDefectsRecordList(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/qualityRecordPage`, 'GET', reqData)
	},
	// 提交某个生产单的购物车
	submitCart(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesqualityinspection/reworkCartSubmit`, 'POST', reqData)
	},
	// 外协列表
	outsourcingReceipt(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/assist/page`, 'GET', reqData)
	},
	// 外协收货信息
	outsourcingReceiptassistinfo(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/assist/assistinfo`, 'GET', reqData)
	},
	// 外协收货保存
	outsourcingReceiptreceiveSave(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/assist/receiveSave`, 'POST', reqData)
	},
	// 外协收货编辑
	outsourcingReceiptreceiveUpdate(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/assist/receiveUpdate`, 'POST', reqData)
	},
	// 外协收货列表
	outsourcingReceiptreceivePage(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/assist/receivePage`, 'GET', reqData)
	},
	// 外协收货头部信息
	outsourcingReceiptheadinfo(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/assist/headinfo`, 'GET', reqData)
	},
	changeVersoin(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/softwareversion/getnewver`, 'GET', reqData)
	},
	getDicts(){
		return requestApi(`${API_ADDRESS}/njp-plus-admin-api/sys/dict/type/all`, 'GET')
	},
	// 获取所有生产单
	allProduce(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesproduceorder/listWithProNum`, 'GET', reqData)
	},
	// 获取sku颜色尺码
	produceSku(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesordersubpackage/getSku`, 'GET', reqData)
	},
	// 获取生产单工段工序
	produceSection(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespdproductprocess/getProcessByProduce`, 'GET', reqData)
	},
	// 保存手动报工
	submitManualReporting(url,reqData){
		return requestApi(`${API_ADDRESS}${url}`, 'POST', reqData)
	},
	// 获取个人报工记录
	getIndividualWorkReportRecordList(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/page`, 'get', reqData)
	},
	// 删除个人报工记录,组长报工记录
	deleteIndividualWorkReportRecordList(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement`, 'delete', reqData)
	},
	// 查询组长报工记录
	getWorkReportRecordQueryList(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mesengineeringmanagement/selectReportRecord`, 'get', reqData)
	},
	// 根据员工id查询对应工段信息
	getProcessByUser(reqData){
		return requestApi(`${API_ADDRESS}/njp-plus-mes-api/mes/mespdproductprocess/getProcessByProduce`, 'get', reqData)
	}
}

export default Api
