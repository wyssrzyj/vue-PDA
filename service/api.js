
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
	// console.log("当前环境:"+API_ADDRESS)
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
	// 功能标识
	getFunc() {
	  return requestApi(`${API_ADDRESS}/mes/sysconfigpage/selectAllAuthorization`, 'GET')
	},
	getDicts(){
		return requestApi(`${API_ADDRESS}/sys/dict/type/all`, 'GET')
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
	//获取所有员工列表
	getAlluser(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesemployee/list`, 'GET', reqData)
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
	//获取班组信息
	groupInfo(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesqualityinspection/user`, 'GET', reqData)
	},
	//质检获取数据
	mesqualityInspection(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesqualityinspection/scanningGroupCode`, 'GET', reqData)
	},
	//质检新增自定义标签
	updateTag(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesdefectsgruop/addCustom`, 'GET', reqData)
	},
	//质检删除自定义标签
	deleteTag(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesdefectsgruop/delectCustom`, 'GET', reqData)
	},
	//质检上传文件
	uploadFile(reqData){
		return upload(`${API_ADDRESS}/mes/oss/upload`, reqData)
	},
	//质检提交
	submitMesqualit(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesqualityinspection/submitPad`, 'POST', reqData)
	},
	//返工获取数据
	mesRepairInfo(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesqualityinspection/scanningReworkCode`, 'GET', reqData)
	},
	// 修改返工状态
	updateRepairStatus(url,reqData){
		return requestApi(`${API_ADDRESS}/${url}`, 'GET', reqData)
	},
	// 外协列表
	outsourcingReceipt(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/page`, 'GET', reqData)
	},
	// 外协收货信息
	outsourcingReceiptassistinfo(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/assistinfo`, 'GET', reqData)
	},
	// 外协收货保存
	outsourcingReceiptreceiveSave(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/receiveSave`, 'POST', reqData)
	},
	// 外协收货编辑
	outsourcingReceiptreceiveUpdate(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/receiveUpdate`, 'POST', reqData)
	},
	// 外协收货列表
	outsourcingReceiptreceivePage(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/receivePage`, 'GET', reqData)
	},
	// 外协收货头部信息
	outsourcingReceiptheadinfo(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/headinfo`, 'GET', reqData)
	},
	//获取版本
	changeVersoin(reqData){
		return requestApi(`${API_ADDRESS}/mes/softwareversion/getnewver`, 'GET', reqData)
	},
	//添加外协外协工厂
	outsourcingFactory(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesfactorymanager/list`, 'GET', reqData)
	},
	//外协单扫码添加外协记录
	outsourcingAddGet(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/getdetailbysn`, 'GET', reqData)
	},
	//修改外协单
	outsourcingAddUpdate(reqData){
		return requestApi(`${API_ADDRESS}//mes/assist/pdaupdate`, 'POST', reqData)
	},
	//新增外协单
	outsourcingAddSave(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/pdasave`, 'POST', reqData)
	},
	//获取外协单信息
	outsourcingAddGetInfo(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/assistinfo`, 'GET', reqData)
	},
	//外协保存部位
	outsourcingAddSavePort(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespartsinfo/save`, 'POST', reqData)
	},
	//外协获取部位
	outsourcingAddGetPort(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespartsinfo/getAllPartsInfo`, 'GET', reqData)
	},
	//外协收货保存(扫码收货)
	outsourcingTakeDelieverySave(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/scanCodeReceiveSave`, 'POST', reqData)
	},
	//外协收货修改(扫码收货)
	outsourcingTakeDelieveryUpdate(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/scanCodeReceiveUpdate`, 'POST', reqData)
	},
	//外协收货扫码(扫码收货)
	outsourcingTakeDelieveryPCS(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/scanCodeGoods`, 'GET', reqData)
	},
	//外协收货获取数据
	outsourcingTakeDelieveryGetInfo(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/getScanCodeGoods`, 'GET', reqData)
	},
	// 通过条形码获取外协信息列表
	getScanCodeGoodsList(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/getScanCodeGoodsList`, 'GET', reqData)
	},
	// 通过条形码获取外协多条信息
	scanCodeGoodsAllDetail(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/scanCodeGoodsAllDetail`, 'GET', reqData)
	},
	// 获取所有生产单
	allProduce(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesproduceorder/listWithProNum`, 'GET', reqData)
	},
}

export default Api
