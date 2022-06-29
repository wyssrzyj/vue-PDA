<template>
	<view class="mainContent">
		<view class="borderBottom">
			<view class="scanInput">请扫描扎包条码!</view>
			<view class="storage">
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>报工工段</text>
					<view class="storage-item-right" @click="show = true">
						<text class="info">{{productNum?productNum:'请选择报工工段'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<text class="storage-item-left"><text class="requier">*</text>报工工序</text>
					<view class="storage-item-right" @click="showMultiple">
						<text class="info">{{supplierName?supplierName:'请选择报工工序'}}</text>
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>
				<view class="storage-item">
					<text class="storage-item-left">当前员工</text>
					<view class="storage-item-right">
						<text class="info">{{employeeName?employeeName:'未绑定'}}</text>
					</view>
				</view>
			</view>
			<u-picker :show="show" :visibleItemCount="4" :itemHeight="92" :columns="columns" @confirm="handleConfirm" @cancel="handleCancel"></u-picker>
		</view>
		<view class="pannelContent">
			<view class="storageItem" v-for="(item,index) in outStorageArr" :key="index" :class="index == 0?'selectStorage':''">
				<text class="serialNumber">{{ index + 1 }}.</text>
				<view class="storageInfo">
					<text class="storageCode">{{ item.proNum }}</text>
					<view class="storageColor">
						<text>颜色尺码：</text>
						<text>{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeCode }}</text>
					</view>
					<view class="storageContent">
						<view class="number">
							<text>扎号：</text>
							<text>{{ item.packageNum }}</text>
						</view>
						<view class="count">
							<text>数量：</text>
							<input v-model="item.count"/>
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
			<view style="margin-left: 20rpx;">{{ showSuccessMessage }}</view>
		</view>
		<view class="errorPopup remindPopup" v-if="showErrorPop">
			<view class="errorImage"></view>
			<view style="margin-left: 20rpx;">{{ showErrorMessage }}</view>
		</view>
		<select-code-multiple :visible="showM" :checkedValue="checkedList" :optionList="coutryList"
			@confirm="getCodeMu"></select-code-multiple>
		<scan-code></scan-code>
	</view>
</template>

<script>
	import {formateDate,findKey,useDebounce} from "@/utils/index.js"
	import Api from '../../service/api'
	import scanCode from "@/components/scan/scan.vue"
	import selectCodeMultiple from '@/components/mulSelection/mulSelection.vue'
	
	export default{
		components: {
			selectCodeMultiple,
			scanCode
		},
		onLoad() {
		},
		onShow() {
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				// 扫描PCS码
				this.handleScanPCS(data.code)
			})
		},
		mounted(){
			Api.productionGetAdmin().then(res=>{
				if(res.code=="0"){
					this.employeeName=res.data.realName
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
				supplierName:'',
				supplierId:'',
				outStorageArr: [],
				PCSData:[],
				selectIndex: 0,
				columns:[],
				show:false,
				employeeName:"",
				showM: false,
				coutryList: [],
				//选中的值
				checkedList: [],
				workshopObj:{},
				// 更多组件
				showMore:false,
				list:[{name:'清空',color:'#FC361D'}]
			}
		},
		methods:{
			//打开多选
			showMultiple() {
				this.showM = true
			},
			//获取多选的值
			getCodeMu(event) {
				this.checkedList=[]
				event.forEach(item=>{
					this.checkedList.push({name:item.value,value:item.value})
				})
				this.supplierName=this.checkedList.map(item=>item.name).join(",")
				this.showM = false
			},
			async handleConfirm(e){	//报工工段确认
				if(this.productNum!==e.value[0]){
					this.supplierName=""
				}
				this.productNum=e.value[0]
				const res=await Api.productionReportingGetProcess({
					productId:this.productId,
					section:findKey(this.workshopObj,this.productNum)
				})
				this.coutryList=res.data.map(item=>{
					return {value:item.productName,name:item.productName}
				})
				this.show=false
			},
			handleCancel(){		//报工工段取消
				this.show=false
			},
			//封装函数
			scanPCSEncapsulation(res){
				uni.showToast({
					title: '扫描扎包条码成功！',
					icon: 'none',
					duration: 3000
				})
				this.outStorageArr.push(res.data)
				//生产单号
				this.productId=res.data.produceOrderId
				//报工工段
				this.workshopObj={}
				res.data.sectionAndSectionNames.forEach(item=>{
					this.workshopObj=Object.assign(item,this.workshopObj)
				})
				this.columns=[Object.values(this.workshopObj)]
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
				this.outStorageArr = this.outStorageArr.reverse()
			},
			
			// 报工页面前端逻辑
			// 报工分为组码报工和pcs码报工，新增组码报工，不能不同的报工类型，不同的生产单，
			// 相同组码编号累加，不同组码编号相加
			handleScanPCS(pcs){ // 扫描PCS码
				this.outStorageArr = this.outStorageArr.reverse()
				Api.productionReportingPCS({
					pcs, // 'PD20211118073139826-0-00153638'
				}).then(res => {
					console.log(res)
					if (res.code === 0) {
						if(this.outStorageArr.length===0){
							this.scanPCSEncapsulation.call(this,res)
						}else{
							const pcsTypeFind=this.outStorageArr.find(item=>item.pcsType==res.data.pcsType)
							if(pcsTypeFind){
								//PCS码报工
								if(res.data.pcsType==0){
									const Find=this.outStorageArr.find((item)=>item.produceOrderId===res.data.produceOrderId)
									if(Find){ //同一生产单不能重复扫描
										const newFind=this.outStorageArr.find((item)=>item.packageCode===res.data.packageCode)
										if(!newFind){ //同一扎包不能重复扫描
											const find=this.outStorageArr.find(item=>item.snNum===res.data.snNum)
											if(find){ //同一个PCS码不能重复扫描
												this.showErrorMessage = '扎包条码已被扫描'
												this.showErrorPop = true
												let timer = setTimeout(() => {
													clearTimeout(timer)
													this.showErrorPop = false
												}, 2000)
											}else{
												this.scanPCSEncapsulation.call(this,res)
											}
										}else{
											this.showErrorMessage = '同一扎单不能重复扫描！'
											this.showErrorPop = true
											let timer = setTimeout(() => {
												clearTimeout(timer)
												this.showErrorPop = false
											}, 2000)
										}
									}else{
										this.showErrorMessage = '扎包条码不属于该生产单！'
										this.showErrorPop = true
										let timer = setTimeout(() => {
											clearTimeout(timer)
											this.showErrorPop = false
										}, 2000)
									}
								//组码报工
								}else if(res.data.pcsType==1){
									//组码报工
									const produceOrderFind=this.outStorageArr.find((item)=>item.produceOrderId===res.data.produceOrderId)
									if(produceOrderFind){ //组码扫描必须同一生产单下
										const codeGroup=this.outStorageArr.find(item=>item.snNum==res.data.snNum)
										if(codeGroup){ //同一组码编号数量相加
											codeGroup.count+=res.data.count
											this.outStorageArr = this.outStorageArr.reverse()
											const index=this.outStorageArr.findIndex(item=>item.snNum===codeGroup.snNum)
											const obj=this.outStorageArr.splice(index,1)
											this.outStorageArr.unshift(...obj)
										}else{  //不同组码编号添加记录
											this.scanPCSEncapsulation.call(this,res)
										}
									}else{
										this.showErrorMessage = '组码编号不属于该生产单！'
										this.showErrorPop = true
										let timer = setTimeout(() => {
											clearTimeout(timer)
											this.showErrorPop = false
										}, 2000)
									}
								}
							}else{
								this.showErrorMessage = '请扫描同一类型的扎包条码'
								this.showErrorPop = true
								let timer = setTimeout(() => {
									clearTimeout(timer)
									this.showErrorPop = false
								}, 2000)
							}
							
						}
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
					this.supplierName=""
				}
			},
			
			handleOutStorage(){ // 出库
				if(!this.productNum){ //工段必填
					this.showErrorMessage = '请选择报工工段'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
				if(!this.supplierName){ //工序必填
					this.showErrorMessage = '请选择报工工序'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
				const find=this.outStorageArr.find(item=>item.count=='')
				if(find){
					this.showErrorMessage = '报工数量不能为空！'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
				let mesEngineeringManagementDTOS=this.outStorageArr.map(item=>{
					return {...item,section:+findKey(this.workshopObj,this.productNum),productName:this.supplierName,engineeringManagementDate:formateDate()}
				});
				Api.productionReporting({
					mesEngineeringManagementDTOS,
				}).then(res => {
					if (res.code === 0) {
						this.outStorageArr=[]
						this.productNum = ''
						this.supplierName=""
						this.coutryList=[]
						this.columns=[]
						this.checkedList=[]
						this.showSuccessMessage = '报工成功！'
						this.showSuccessPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showSuccessPop = false
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
			overflow: auto;
			width: 100%;
			.first_item {
				color: #0C99F2;
			
			}
			.storageItem {
				height: 214rpx;
				width: 100%;
				display: flex;
				margin: 10rpx 0;
				padding: 0 30rpx ;
				background-color: #FFFFFF;
				overflow: hidden;
				.serialNumber{
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
					line-height: 214rpx;
					margin-right: 30rpx;
				}
				.storageInfo{
					font-size: 34rpx;
					color: #333333;
					.storageCode{
						line-height: 80rpx;
						font-weight: bold;
					}
					.storageColor{
						margin-bottom: 20rpx;
						text:first-child{
							font-weight: bold;
						}
						text:last-child{
							color: #666666;
						}
					}
					.storageContent{
						display: flex;
						justify-content: space-between;
						.number{
							width: 320rpx;
							text:first-child{
								font-weight: bold;
							}
							text:last-child{
								color: #666666;
							}
						}
						.count{
							width: 360rpx;
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
