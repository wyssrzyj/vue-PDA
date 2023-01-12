<template>
	<view class="mainContent">
		<view class="borderBottom">
			<view class="scanInput">请扫描包条码!</view>
			<view class="storage">
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>报工工段</text>
					<view class="storage-item-right" @click="clickSection">
					<!-- <view class="storage-item-right" @click="show = true"> -->
						<text class="info">{{ section || '请选择报工工段' }}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>报工工序</text>
					<view class="storage-item-right" @click="showMultiple">
						<!-- <text class="info">{{supplierName||'请选择报工工序'}}</text> -->
						<text class="info">请选择报工工序</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<ul>
					<li v-for="item in checkedList" :key="item.name" style="font-size: 30rpx;">{{`${item.idx?item.idx+' - ':''}${item.value}`}}</li>
				</ul>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>当前员工</text>
					<view class="storage-item-right" @click="selectUser">
						<text class="info">{{realName||'未绑定'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="pannelContent">
			<view class="storageItem" v-for="(item,index) in outStorageArr" :key="index" :class="index == 0?'selectStorage':''">
				<text class="serialNumber">{{ index + 1 }}.</text>
				<view class="storageInfo">
					<!-- <text class="storageCode">{{ item.proNum }}</text> -->
					<text class="storageCode">{{ item.productOrderNum }}</text>
					<view class="storageColor">
						<text>颜色尺码：</text>
						<text>{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeCode }}</text>
					</view>
					<view class="storageContent">
						<!-- <view class="number">
							<text>扎号：</text>
							<text>{{ item.packageNum }}</text>
						</view> -->
						<view class="count">
							<text>数量：</text>
							<input v-model="item.count" type="number" @input="handleInput($event,item)"/>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 更多组件 -->
		<u-action-sheet :actions="list" :show="showMore" @select="selectClick" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showMore=false"></u-action-sheet>
		<view class="bottomTab">
			<view class="bottom-left" @click="showMore = true" id="moreBtn">更多 <view class="iconfont icon-gengduo"></view></view>
			<view class="bottom-right">
				<view class="count">已扫描行数：{{outStorageArr.length?outStorageArr.length:'0'}}</view>
				<view class="btn btnActive" @click="handleOutStorage" v-if="outStorageArr.length > 0">报工</view>
				<view class="btn btnDisable" v-else >报工</view>
			</view>
		</view>
		<view class="successPopup remindPopup" v-if="showSuccessPop">
			<view class="successImage"></view>
			<view style="margin-left: 30rpx;">{{ showSuccessMessage }}</view>
		</view>
		<view class="errorPopup remindPopup" v-if="showErrorPop">
			<view class="errorImage"></view>
			<view style="margin-left: 30rpx;">{{ showErrorMessage }}</view>
		</view>
		<select-code-multiple :visible="showM" :checkedValue="checkedList" :optionList="coutryList" @confirm="getCodeMu"></select-code-multiple>
		<u-action-sheet :actions="sectionList" :show="showSection" @select="sectionSelectClick" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showSection=false"></u-action-sheet>
		<scan-code></scan-code>
		<!-- 选择用户 -->
		<searchSelect ref="userSearchSelect" :options="userList" valKey="id" :showKey="'showKey'" @sure="userSelectSure" />
	</view>
</template>

<script>
	import {formateDate,findKey,useDebounce,checkFunc} from "@/utils/index.js"
	import Api from '../../service/api'
	import scanCode from "@/components/scan/scan.vue"
	import selectCodeMultiple from '@/components/mulSelection/mulSelection.vue'
	import {KEY_MAP} from "../../constant/index.js"
	import searchSelect from "@/components/J-Picker/jPicker.vue"
	var timer;
	var preKeyCode = '';
	var allKeyCodeTemp = '';
	export default{
		components: {
			selectCodeMultiple,
			scanCode,
			searchSelect
		},
		onShow() {
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				// 扫描PCS码
				this.handleScanPCS(decodeURI(data.code))
			})
		},
		mounted(){
			// 获取员工列表
			Api.getAlluser('/njp-plus-mes-api/mes/mesemployee/user').then(res => {
				if(res.code=="0"){
					this.workType = res.data
				}
			})
			Api.getAlluser('/njp-plus-mes-api/mes/mesemployee/packagingListByWorkType', { workType: -1 }).then(ret1 => {
				if(ret1.code=="0"){
					this.dataList.allEmployeeList = ret1.data.map(item => ({id: item.id,showKey:`${item.realName}-${item.staffId}`}))
				}
			})
			Api.getAlluser('/njp-plus-mes-api/mes/mesemployee/packagingListByWorkType', { workType: 4 }).then(ret4 => {
				if(ret4.code=="0"){
					this.dataList.THEmployeeList = ret4.data.map(item => ({id: item.id,showKey:`${item.realName}-${item.staffId}`}))
				}
			})
		},
		data(){
			return{
				isSelectCheckbox: true,
				showSuccessPop: false,
				showErrorPop: false,
				showSuccessMessage: '',
				showErrorMessage: '',
				productNum: '',
				supplierId:'',
				outStorageArr: [],
				PCSData:[],
				selectIndex: 0,
				userId:null,//用户id
				realName:'', //前端用户名称
				userList:[], //用户列表
				canSelectUser: false,//是否可以选择用户
				showM: false,
				coutryList: [],
				showSection: false,
				section: '',	//工段
				canSelectSection: false,
				sectionList: [],//工段列表
				sectionAndCoutry: {},//工段工序组合数据
				//选中的值
				checkedList: [], //选中的工序列表
				workshopObj:{},
				// 更多组件
				showMore:false,
				list:[{name:'清空',color:'#FC361D'}],
				tag: "1", //不必理会，固定 1 就好,
				workType:"", //工序类型
				dataList:{
					allEmployeeList:[], //所有员工列表
					THEmployeeList:[] //包装员工列表
				}
			}
		},
		methods:{
			handleData(result) {
				let that = this;
				if (result.return_type == 'dataBack') {
					if (result.action == 'ACTION_UP') { //只取弹起事件
						let keyCode = result.keyCode;
						if (keyCode == 'KEYCODE_ENTER') { //扫码结束
							that.resultStrFinal = allKeyCodeTemp; //最终拼接的字符串赋值
							allKeyCodeTemp = '';
							preKeyCode = '';
							this.handleScanPCS(decodeURI(that.resultStrFinal))
						} else if (keyCode == 'KEYCODE_SHIFT_LEFT' || keyCode == 'KEYCODE_SHIFT_RIGHT') { //转换键
							preKeyCode = 'KEYCODE_SHIFT_RIGHT';
						} else {
							if (preKeyCode == 'KEYCODE_SHIFT_RIGHT') { //转换键，拿大写
								if (keyCode && KEY_MAP[keyCode]) {
									allKeyCodeTemp += KEY_MAP[keyCode].shiftChar;
								}
							} else {
								if (keyCode && KEY_MAP[keyCode]) {
									allKeyCodeTemp += KEY_MAP[keyCode].normalChar;
								}
							}
							preKeyCode = '';
						}
			
					}
				}
			},
			//打开多选
			showMultiple() {
				this.showM = true
			},
			//获取多选的值
			getCodeMu(event) {
				this.checkedList=[]
				this.checkedList = event
				this.showM = false
			},
			handleCancel(){		//报工工段取消
				this.show=false
			},
			// 弹出工段选择
			clickSection(){
				if(!this.canSelectSection) return
				if(Object.keys(this.sectionAndCoutry).length === 0) {
					this.showErrorMessage = '暂无工段可供选择！'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 3000)
				} else {
					this.showSection = true
				}
			},
			//选择不同的工段
			sectionSelectClick(e){
				this.section = e.name
				this.checkedList = []
				this.coutryList = []
				this.sectionAndCoutry[e.name].forEach(item => {
					this.coutryList.push({name: `${item.idx} - ${item.productName}`, value: item.productName, valid: 1, ...item})
				})
			},
			// 选择用户弹窗
			selectUser(){
				if(!this.canSelectUser) return
				this.$refs.userSearchSelect.showPicker()
			},
			// 选择了某个用户
			userSelectSure(val){
				this.userId = val.id
				this.realName = val.showKey
			},
			handleInput(e,item){
				if(Number(e.target.value)<=Number(item.limitCount)&&e.target.value){
					e.target.value = e.target.value.split('.')[0].replace(/^[^\d]|[.]/g, '')
					this.$nextTick(() => {
						item.count= Number(e.target.value)
					})
				}else if(!e.target.value){
					this.$nextTick(()=>{
						item.count=''
					})
				}else{
					this.$nextTick(()=>{
						item.count=Number(item.limitCount)
					})
					if (item.pcsType) {
						this.showErrorMessage = '数量不能大于上一个报工的件数'
					} else {
						this.showErrorMessage = '报工数量不能大于件数'
					}
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
				}
			},
			//封装函数
			scanPCSEncapsulation(res){
				uni.showToast({
					title: '扫描包条码成功！',
					icon: 'none',
					duration: 3000
				})
				this.outStorageArr.push(res.data)
				//生产单号
				this.productId=res.data.produceOrderId
				//报工工段
				// this.workshopObj={}
				// res.data.sectionAndSectionNames.forEach(item=>{
				// 	this.workshopObj=Object.assign(item,this.workshopObj)
				// })
				// this.columns=[Object.values(this.workshopObj)]
				
				// 扎包报工工序
				if (res.data.pcsType==0) {
					this.sectionAndCoutry = res.data.sectionsAndProcess || {}
					this.sectionList = Object.keys(res.data.sectionsAndProcess).map(item => {
						return {name: item}
					})
					if (this.workType == 4) {
					  this.userList = this.dataList.THEmployeeList
				    } else {
					 this.userList = this.dataList.allEmployeeList
				    }
				// 组码报工工序
				} else {
					this.section = '尾部'
					this.coutryList=res.data.processName.map(i=>{
						return {...i,value:i.productName,name:i.productName}
					})
					this.userList = this.dataList.allEmployeeList
				}
				//报工工序
				// let process=res.data.sectionsAndProductNames[0]
				// let newArr=[]
				// for(let key in process){
				// 	newArr=newArr.concat(process[key])
				// }
				// this.coutryList=newArr.map(item=>{
				// 	return {value:item,name:item}
				// })
				//当前员工
				// this.employeeName=res.data.realName;
				// 数组去重
				
				/**
				 * 判断是否时第一次扫码，第一次扫码才读取缓存
				 * 根据不同条码获取不同缓存
				 * 工段，工序，员工
				 * 如果被删除了缓存需要清除
				 */
				let stateStorage = uni.getStorageSync('productionReport') || {}
				if (stateStorage.canSelectSection === this.canSelectSection) {
					if (this.canSelectSection) {
					  //设置员工
					  this.userList.find((item)=>{
						  if(item.id === stateStorage.userId) {
							  this.userId = stateStorage.userId
							  this.realName = item.showKey
							  return true
						  }
					  })
					  
					  //判断工段是否删除
					  let sectionList = this.sectionList.map(item => item.name)
					  if (sectionList.includes(stateStorage.section)) {
						  this.sectionSelectClick({name:stateStorage.section}) //设置工序列表
						  // 判断工序是否删除,只把没被删除的工序缓存取出来
						  let coutryList = this.coutryList.map(item => item.name)
						  stateStorage.checkedList.forEach(item => {
							if (coutryList.includes(item.name)) this.checkedList.push(item)
						  })
						}
					} else {
						// 判断工序是否可选
						let checkedList = stateStorage.checkedList.map(item => item.name)
						this.coutryList.forEach((item)=>{
							if(checkedList.includes(item.name) && item.valid === 1) this.checkedList.push(item)
						})
					}
				}
				
				this.outStorageArr = this.outStorageArr.reverse()
			},
			// 报工页面前端逻辑
			// 报工分为组码报工和pcs码报工，新增组码报工，不能不同的报工类型，不同的生产单，
			// 相同组码编号累加，不同组码编号相加
			handleScanPCS(pcs){ // 扫描PCS码
				// PD20220630195145651-XK*111-叉L-1
				Api.productionReportingPCS({
					pcs:pcs, // 'PD20211118073139826-0-00153638'
				}).then(res => {
					if (res.code === 0) {
						if(this.outStorageArr.length===0){
							if(checkFunc('codeToWork') && !checkFunc('packBarCodeReportWork')) { // 只有组码报工
								this.canSelectUser = false
								this.canSelectSection = false
								if(Array.isArray(res.data) && res.data[0].workerType===1){ //返修
									if(res.data[0].realName && res.data[0].staffId && res.data[0].userId) {
										this.realName = res.data[0].realName + '—' + res.data[0].staffId
										this.userId = res.data[0].userId
									} else {
										this.realName = ''
										this.userId = ''
									}
									this.outStorageArr = this.outStorageArr.reverse()
									uni.showToast({
										title: '扫描包条码成功！',
										icon: 'none',
										duration: 3000
									})
									this.outStorageArr=this.outStorageArr.concat(res.data)
									this.section = '尾部'
									//生产单号
									this.productId=res.data[0]?.produceOrderId
									this.coutryList=res.data[0]?.processName.map(i=>{
										return {...i,value:i.productName,name:i.productName}
									})
									this.outStorageArr = this.outStorageArr.reverse()
								}else{	//组码
									if(res.data.realName && res.data.staffId && res.data.userId) {
										this.realName = res.data.realName + '—' + res.data.staffId
										this.userId = res.data.userId
									} else {
										this.realName = ''
										this.userId = ''
									}
									this.scanPCSEncapsulation.call(this,res)
								}
							} else if(!checkFunc('codeToWork') && checkFunc('packBarCodeReportWork')) { // 只有扎包条码报工
								this.canSelectUser = true
								this.canSelectSection = true
								this.scanPCSEncapsulation.call(this,res)
							} else if(checkFunc('codeToWork') && checkFunc('packBarCodeReportWork')) { // 扎包条码和组码报工都有
								if(res.data.pcsType==0){
									this.canSelectUser = true
									this.canSelectSection = true
									this.scanPCSEncapsulation.call(this,res)
								} else {
									this.canSelectUser = false
									this.canSelectSection = false
									if(Array.isArray(res.data) && res.data[0].workerType===1){
										if(res.data[0].realName && res.data[0].staffId && res.data[0].userId) {
											this.realName = res.data[0].realName + '—' + res.data[0].staffId
											this.userId = res.data[0].userId
										} else {
											this.realName = ''
											this.userId = ''
										}
										this.outStorageArr = this.outStorageArr.reverse()
										uni.showToast({
											title: '扫描包条码成功！',
											icon: 'none',
											duration: 3000
										})
										this.outStorageArr=this.outStorageArr.concat(res.data)
										this.section = '尾部'
										//生产单号
										this.productId=res.data[0]?.produceOrderId
										this.coutryList=res.data[0]?.processName.map(i=>{
											return {...i,value:i.productName,name:i.productName}
										})
										this.outStorageArr = this.outStorageArr.reverse()
									}else{
										if(res.data.realName && res.data.staffId && res.data.userId) {
											this.realName = res.data.realName + '—' + res.data.staffId
											this.userId = res.data.userId
										} else {
											this.realName = ''
											this.userId = ''
										}
										this.scanPCSEncapsulation.call(this,res)
									}
								}
							}
						}else{
							this.showErrorMessage = '请完成本次提交后再次扫码！'
							this.showErrorPop = true
							let timer = setTimeout(() => {
								clearTimeout(timer)
								this.showErrorPop = false
							}, 2000)
						}
						// else{
						// 	const pcsTypeFind=this.outStorageArr.find(item=>item.pcsType==res.data.pcsType)
						// 	if(pcsTypeFind){
						// 		//PCS码报工
						// 		if(res.data.pcsType==0){
						// 			const Find=this.outStorageArr.find((item)=>item.produceOrderId===res.data.produceOrderId)
						// 			if(Find){ //同一生产单不能重复扫描
						// 				const newFind=this.outStorageArr.find((item)=>item.packageCode===res.data.packageCode)
						// 				if(!newFind){ //同一扎包不能重复扫描
						// 					const find=this.outStorageArr.find(item=>item.snNum===res.data.snNum)
						// 					if(find){ //同一个PCS码不能重复扫描
						// 						this.showErrorMessage = '包条码已被扫描'
						// 						this.showErrorPop = true
						// 						let timer = setTimeout(() => {
						// 							clearTimeout(timer)
						// 							this.showErrorPop = false
						// 						}, 2000)
						// 					}else{
						// 						this.scanPCSEncapsulation.call(this,res)
						// 					}
						// 				}else{
						// 					this.showErrorMessage = '同一扎单不能重复扫描！'
						// 					this.showErrorPop = true
						// 					let timer = setTimeout(() => {
						// 						clearTimeout(timer)
						// 						this.showErrorPop = false
						// 					}, 2000)
						// 				}
						// 			}else{
						// 				this.showErrorMessage = '包条码不属于该生产单！'
						// 				this.showErrorPop = true
						// 				let timer = setTimeout(() => {
						// 					clearTimeout(timer)
						// 					this.showErrorPop = false
						// 				}, 2000)
						// 			}
						// 		//组码报工
						// 		}else if(res.data.pcsType==1){
						// 			//组码报工
						// 			// const produceOrderFind=this.outStorageArr.find((item)=>item.produceOrderId===res.data.produceOrderId)
						// 			// if(produceOrderFind){ //组码扫描必须同一生产单下
						// 			// 	const codeGroup=this.outStorageArr.find(item=>item.snNum==res.data.snNum)
						// 			// 	if(codeGroup){ //同一组码编号数量相加
						// 			// 		uni.showModal({
						// 			// 			title: '提示',
						// 			// 			content: '扫描同一组码编号报工数量是否累加',
						// 			// 			success: (res1)=> {
						// 			// 				if (res1.confirm) {
						// 			// 					codeGroup.count+=res.data.count
						// 			// 					this.outStorageArr = this.outStorageArr.reverse()
						// 			// 					const index=this.outStorageArr.findIndex(item=>item.snNum===codeGroup.snNum)
						// 			// 					const obj=this.outStorageArr.splice(index,1)
						// 			// 					this.outStorageArr.unshift(...obj)
						// 			// 				} else if (res1.cancel) {
						// 			// 					console.log('用户点击取消');
						// 			// 				}
						// 			// 			}
						// 			// 		});
						// 			// 	}else{  //不同组码编号添加记录
						// 			// 		this.scanPCSEncapsulation.call(this,res)
						// 			// 	}
						// 			// }else{
						// 			// 	this.showErrorMessage = '组码编号不属于该生产单！'
						// 			// 	this.showErrorPop = true
						// 			// 	let timer = setTimeout(() => {
						// 			// 		clearTimeout(timer)
						// 			// 		this.showErrorPop = false
						// 			// 	}, 2000)
						// 			// }
						// 			if(this.outStorageArr.length===0){
						// 				this.scanPCSEncapsulation.call(this,res)
						// 			}else{
						// 				this.showErrorMessage = '请完成本次提交后再次扫码！'
						// 				this.showErrorPop = true
						// 				let timer = setTimeout(() => {
						// 					clearTimeout(timer)
						// 					this.showErrorPop = false
						// 				}, 2000)
						// 			}
						// 		}
						// 	}else{
						// 		this.showErrorMessage = '请扫描同一类型的包条码'
						// 		this.showErrorPop = true
						// 		let timer = setTimeout(() => {
						// 			clearTimeout(timer)
						// 			this.showErrorPop = false
						// 		}, 2000)
						// 	}
						// }
					}else{
						this.showErrorMessage = res.msg
						this.showErrorPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showErrorPop = false
						}, 2000)
					}
				})
			},

			//弹出按钮点击事件
			selectClick(e){
				if(e.name=='清空'){
					this.outStorageArr = []
					this.coutryList=[]
					this.productNum = ''
					this.checkedList=[]
					this.section=''
					this.sectionAndCoutry={}
					this.sectionList=[]
					this.canSelectSection=false
					this.realName = ''
					this.userId = null
					this.canSelectUser = false
				}
			},
			
			handleOutStorage(){ // 出库
				if(!this.section){ //工段必填
					this.showErrorMessage = '请选择报工工段'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
				if(this.checkedList.length === 0){ //工序必填
					this.showErrorMessage = '请选择报工工序'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
				const find=this.outStorageArr.find((item)=>item.count===0 || item.count === '')
				if(find){
					this.showErrorMessage = '报工数量不能为0'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
				if(!this.userId){
					this.showErrorMessage = '当前员工不能为空'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
				let mesEngineeringManagementDTOS=this.outStorageArr.map(item=>{
					// return {...item,section:findKey(this.workshopObj,this.productNum),productName:this.supplierName,engineeringManagementDate:formateDate()}
					return {...item,section:this.section,processVoList:this.checkedList,engineeringManagementDate:null,userId:this.userId}
				});
				Api.productionReporting({
					mesEngineeringManagementDTOS,
				}).then(res => {
					if (res.code === 0) {
						// 删除缓存
						uni.removeStorageSync('productionReport')
						//设置缓存
						uni.setStorageSync('productionReport', { 
							canSelectSection: this.canSelectSection,
							userId: this.userId,
							section: this.section,
							checkedList: this.checkedList
						})
						
						this.outStorageArr=[]
						this.productNum = ''
						this.checkedList=[]
						this.coutryList=[]
						this.section = ''
						this.sectionAndCoutry= {}
						this.sectionList = []
						this.canSelectSection = false
						this.realName = ''
						this.userId = null
						this.canSelectUser = false
						this.showSuccessMessage = '报工成功！'
						this.showSuccessPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showSuccessPop = false
						}, 2000)
					}else{
						this.showErrorMessage = res.msg
						this.showErrorPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showErrorPop = false
						}, 2000)
					}
				})
			},
		},
		created(){    //防抖
			this.handleOutStorage = useDebounce(this.handleOutStorage);
		},
	};
</script>

<style lang="scss" scoped>
	::v-deep .uni-actionsheet__menu{
		background-color: #FC361D!important;
		color: #007AFF;
	}
	.requier{
		color: red;
		margin-right: 10rpx;
	}
	.iconfont{
		font-size: 12rpx;
	}
	::v-deep .u-toolbar[data-v-6d25fc6f]{
		border-bottom: 1px solid  #EAEAEA!important;
	}
	.mainContent {
		position: relative;
		background-color: #F3F3F3;
		.borderBottom{
			padding-bottom: 10rpx;
		}

		//查询按钮样式
		.queryBtn{
			background-color: $theme-color;
			width: 130rpx;
			border-radius: 8rpx;
			margin: 0 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60rpx;
			color: white;
			font-weight: 600;
			cursor: pointer;
		}
		.radioLocation {
			text-align: right;
			margin-right: 20rpx;
			.checkboxStyle {
				display: inline-block;
			}
		}
		
		.pannelContent {
			height: calc(100vh - 474rpx);
			margin-bottom: 104rpx;
			overflow: auto;
			width: 100%;
			.first_item {
				color: #0C99F2;
			
			}
			.storageItem {
				// height: 214rpx;
				width: 100%;
				display: flex;
				margin: 10rpx 0;
				padding: 20rpx 30rpx;
				background-color: #FFFFFF;
				// overflow: hidden;
				.serialNumber{
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
					margin: auto;
					padding-right: 30rpx;
				}
				.storageInfo{
					font-size: 34rpx;
					color: #333333;
					.storageCode{
						line-height: 80rpx;
						font-weight: bold;
					}
					
					.storageContent{
						display: flex;
						justify-content: space-between;
						.number{
							// width: 320rpx;
							text:first-child{
								font-weight: bold;
							}
							text:last-child{
								color: #666666;
							}
						}
						.count{
							// width: 360rpx;
							display: flex;
							text:first-child{
								font-weight: bold;
								width: 120rpx;
							}
							input{
								width: 140rpx;
								height: 52rpx;
								border: 1px solid #0C99F2;
								border-radius: 4rpx;
								text-align: center;
							}
						}
					}
				}
			}
			
			//index为1的时候
			.selectStorage{
				background: #E4F4FF !important;
			}
			.selectStorage text{
				color: #0C99F2!important;
			}
			.selectStorage input{
				color: #0C99F2!important;
			}

		}
		.storageColor{
			width: 750rpx;
			overflow: hidden;
			margin-bottom: 20rpx;
		}
		.btnModal {
			position: absolute;
			left: 30rpx;
			bottom: 10rpx;
			z-index: 10;
			.modalImage {
				width: 300rpx;
				height:166rpx;
			}
		}
		.commonBtn {
			display: inline-block;
			text-align: center;
			color: #fff;
			padding: 20rpx 55rpx;
			border-radius: 15rpx;
		}
		.emptyBtn {
			background-color: #FC361D;
			position: absolute;
			left: 65rpx;
			top: 35rpx
		}
		.remindPopup {
			color: #666;
			font-size: 30rpx;
			font-weight: bold;
			border-radius: 10rpx;
			width: 530rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -265rpx;
			margin-top: -40rpx;
			z-index: 999;
		}
		.successPopup {
			background-color: #F6FFEE;
			border: 1px solid #B9EA93;
			.successImage {
				display: inline-block;
				background: url('../../static/cutWarehouse/success.png') no-repeat;
				width: 50rpx;
				height: 50rpx;
				position: absolute;
				left: 40rpx;
				top: 10rpx;
			}
		}
		.errorPopup {
			background-color: #FFF2F1;
			border: 1px solid #FDA4A0;
			.errorImage {
				display: inline-block;
				background: url('../../static/cutWarehouse/error.png') no-repeat;
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				left: 40rpx;
				top: 20rpx;
			}
		}
	}
</style>
