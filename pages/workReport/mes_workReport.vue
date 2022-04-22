<template>
	<view class="mainContent" @tap="handleClick">
		<view class="borderBottom">
			<view class="location">
				<!-- <input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" placeholder="请扫描PCS码" disabled/> -->
				<text class="scanInput">请扫描PCS码!</text>
			</view>
			<view class="box">
				<view class="storage">
					<text class="storage-left">报工工段</text>
					<view class="storage-right" @click="show = true">
						<text class="info">{{productNum?productNum:'请选择报工工段'}}</text>
						<text class="icon">></text>
					</view>
				</view>			
				<view class="storage">
					<text class="storage-left">报工工序</text>
					<view class="storage-right" @click="showMultiple">
						<text class="info">{{supplierName?supplierName:'请选择报工工序'}}</text>
						<text class="icon">></text>
					</view>
				</view>
				<view class="storage">
					<text class="storage-left">当前员工</text>
					<view class="storage-right">
						<text class="info">{{employeeName?employeeName:''}}</text>
						<!-- <text class="icon">></text> -->
					</view>
				</view>
			</view>
			<u-picker :show="show" :visibleItemCount="4" :itemHeight="92" :columns="columns" @confirm="handleConfirm" @cancel="handleCancel"></u-picker>
<!-- 			<view class="storageLocation">
				<text class="storageTitle">报工工段：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="productNum" confirm-type="search" @click="show = true" disabled/>
			</view>
			<view class="storageLocation">
				<text class="storageTitle">报工工序：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="supplierName" confirm-type="search" @click="showMultiple" disabled/>
			</view>
			<view class="storageLocation">
				<text class="storageTitle">当前员工：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="employeeName" confirm-type="search" disabled/>
			</view> -->
		</view>
		<view class="pannelContent">
			<view class="storageItem" v-for="(item,index) in outStorageArr" :key="index" :class="index == 0?'selectLine':''">
				<text class="serialNumber">{{ index + 1 }}.</text>
				<view class="storageInfo">
					<text class="storageCode">{{ item.packageCode }}</text>
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
							<!-- <text>{{ item.count }}</text> -->
							<input v-model="item.count"/>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bottom">
			<view class="bottom-left" @click="handleMore" id="moreBtn">更多 ↓</view>
			<view class="bottom-right">
				<view class="num">已扫描行数：{{outStorageArr.length?outStorageArr.length:'0'}}</view>
				<view class="btn btn1" @click="handleOutStorage" v-if="outStorageArr.length > 0">报工</view>
				<view class="btn btn2" v-else >报工</view>
			</view>
		</view>
<!-- 		<view class="bottomLocation">
			<view class="scanNum"><view><text>已扫描行数：</text><text class="scannedAllNum">{{outStorageArr.length}}</text></view></view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" @tap="handleMore" id="moreBtn">更多</view>
				<view class="commonBtn inStorageBtn" @tap="handleOutStorage" v-if="outStorageArr.length > 0 ">报工</view>
				<view class="commonBtn noInStorageBtn" v-else>报工</view>
			</view>
		</view> -->
		<view class="btnModal" v-if="showModal" id="btnModal">
			<image class="modalImage" src="../../static/cutWarehouse/modalImage.png" mode="aspectFit"></image>
			<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
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
		// name: 'cutOutStorage',
		onLoad() {
		},
		onShow() {
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				// if(this.sewingTaskRecord) {
				// 	console.log("扫描PCS码")
				// 扫描PCS码
				this.handleScanPCS(data.code)
				// }else {
				// 	console.log("扫描缝制任务单号")
				// 	// 扫描缝制任务单号
				// 	this.handleScanTask(data.code)
				// }
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
				showModal: false,
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
			// handleScanCodeBox(){
			// 	uni.scanCode({
			// 		onlyFromCamera: true,
			// 		success: res => {
			// 			console.log(res.result)
			// 			//这里即拿到了扫描出的数据
			// 			// if(this.storageValue) {
			// 				console.log("扫描扫描PCS码")
			// 				// 扫描PCS码
			// 				this.handleScanPCS(res.result)
			// 			// }else {
			// 				// console.log("扫描扫描库位")
			// 				// 扫描库位
			// 				// this.handleScanStorage(res.result)
			// 			// }
			// 		},
			// 		fail: err => {
			// 		    // 需要注意的是小程序扫码不需要申请相机权限
			// 		}
			// 	});
			// },
			//事件委托全局按钮
			handleClick(e){
				if(e.target.id!=="btnModal"&& e.target.id!=="moreBtn"&& this.showModal){
					this.showModal=false
				}
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
					title: '扫描PCS码成功！',
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
							const Find=this.outStorageArr.find((item)=>item.produceOrderId===res.data.produceOrderId)
							if(Find){ //同一生产单不能重复扫描
								const newFind=this.outStorageArr.find((item)=>item.packageCode===res.data.packageCode)
								if(!newFind){
									const find=this.outStorageArr.find(item=>item.snNum===res.data.snNum)
									if(find){ //同一个PCS码不能重复扫描
										this.showErrorMessage = 'PCS码已被扫描'
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
								this.showErrorMessage = 'PCS码不属于该生产单！'
								this.showErrorPop = true
								let timer = setTimeout(() => {
									clearTimeout(timer)
									this.showErrorPop = false
								}, 2000)
							}
						}
					}
				})
			},


			handleMore(){ // 更多
				this.showModal = !this.showModal
			},

			handleOutStorage(){ // 出库

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
						this.coutryList=[]
						this.showSuccessMessage = '报工成功！'
						this.showSuccessPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showSuccessPop = false
						}, 2000)
					}
				})
			},

			handleEmpty(){ // 清空
				this.outStorageArr = []
				this.coutryList=[]
				this.showModal = false
				this.productNum = ''
				this.supplierName=""
			},
		},
		created(){    //防抖
			this.handleOutStorage = useDebounce(this.handleOutStorage);
		},
	};
</script>

<style lang="scss" scoped>
	@mixin delSty {
		position:absolute;
		top:10rpx;
		width: 26rpx;
		height: 2px;
		background-color: #afafaf;
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
		.location {
			width: 100%;
			height: 44px;
			background-color: #E4F4FF;
			.scanInput {
				line-height: 44px;
				font-family: PingFang-SC-Bold;
				font-size: 18px;
				color: #0C99F2;
				font-weight: 700;
				text-align: center;
				margin-left: 15px;
			}
		}
		.box{
			background-color: #FFFFFF;
			width: 100%;
			.storage{
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				margin: 0 30rpx;
				font-size: 32rpx;
				line-height: 100rpx;
				border-bottom: 1px solid #EAEAEA;
				.storage-left{
					font-weight: bold;
					color: #333333;
				}
				.storage-right{
					color: #999999;
					.info{
						margin-right: 15rpx;
					}
				}
			}
		}
		.storage:last-child{
			border-bottom: 0;
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
					font-size: 18px;
					font-weight: bold;
					color: #333333;
					line-height: 214rpx;
					margin-right: 30rpx;
				}
				.storageInfo{
					font-size: 16px;
					color: #333333;
					.storageCode{
						font-size: 18px!important;
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
							width: 360rpx;
							text:first-child{
								font-weight: bold;
							}
							text:last-child{
								color: #666666;
							}
							
							
						}
						
						.count{
							display: flex;
							text:first-child{
								font-weight: bold;
								width: 100rpx;
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
			.selectLine{
				background: #E4F4FF !important;
			}
			.selectLine text{
				color: #0C99F2!important;
			}
			.selectLine input{
				color: #0C99F2!important;
			}

		}
		
		.bottom{
			width: 100%;
			height: 104rpx;
			line-height: 104rpx;
			background-color: #FFFFFF;
			position: fixed;
			left: 0;
			bottom: 0;
			border-top: 1px solid #EAEAEA;
			display: flex;
			justify-content: space-between;
			font-size: 32rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			.bottom-left{
				color: #585858;
			}
			.bottom-right{
				display: flex;
				.num{
					color: #585858;
					margin-right: 15rpx;
				}
				.btn{
					height:80rpx;
					width: 200rpx;
					margin-top: 12rpx;
					line-height: 80rpx;
					text-align: center;
					border-radius: 4px;
				}
				.btn1{
					background: #0C99F2;
					color: #FFFFFF;
				}
				.btn2{
					color: #999999;
					background: #E0E0E0;
				}
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
