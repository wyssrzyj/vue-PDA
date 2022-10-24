import { requestApi } from './request.js';
export default{
	//添加外协外协工厂
	outsourcingFactory:function(reqData){
		return requestApi(`${API_ADDRESS}/mes/mesfactorymanager/list`, 'GET', reqData)
	},
	//外协单扫码添加外协记录
	outsourcingAddGet:function(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/getdetailbysn`, 'GET', reqData)
	},
	//修改外协单
	outsourcingAddUpdate:function(reqData){
		return requestApi(`${API_ADDRESS}//mes/assist/pdaupdate`, 'POST', reqData)
	},
	//新增外协单
	outsourcingAddSave:function(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/pdasave`, 'POST', reqData)
	},
	//获取外协单信息
	outsourcingAddGetInfo:function(reqData){
		return requestApi(`${API_ADDRESS}/mes/assist/assistinfo`, 'GET', reqData)
	},
	//外协保存部位
	outsourcingAddSavePort:function(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespartsinfo/save`, 'POST', reqData)
	},
	//外协获取部位
	outsourcingAddGetPort:function(reqData){
		return requestApi(`${API_ADDRESS}/mes/mespartsinfo/getAllPartsInfo`, 'GET', reqData)
	},
}