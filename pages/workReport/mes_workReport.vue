<template>
	<view class="mainContent">
		<view class="borderBottom">
			<!-- <view class="location"> -->
				<!-- <input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" placeholder="请扫描PCS码" disabled/> -->
			<!-- </view> -->
			<view class="scanInput">请扫描PCS码!</view>
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
			<view class="storageItem" v-for="(item,index) in outStorageArr" :key="index" :class="index == 0?'selectStorage':''">
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
<!-- 			<view class="storageItem selectStorage">
				<text class="serialNumber">1.</text>
				<view class="storageInfo">
					<text class="storageCode">123234345345</text>
					<view class="storageColor">
						<text>颜色尺码：</text>
						<text>{{ 1 }}&emsp;{{ 2 }}&emsp;{{ 3 }}</text>
					</view>
					<view class="storageContent">
						<view class="number">
							<text>扎号：</text>
							<text>{{ 123456 }}</text>
						</view>
						<view class="count">
							<text>数量：</text>
							<input value="123"/>
						</view>
					</view>
				</view>
			</view> -->
		</view>
		<!-- 更多组件 -->
		<u-action-sheet :actions="list" :show="showMore" @select="selectClick" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showMore=false"></u-action-sheet>
		<view class="bottom">
			<view class="bottom-left" @click="showMore = true" id="moreBtn">更多 <view class="iconfont icon-gengduo"></view></view>
			<view class="bottom-right">
				<view class="count">已扫描行数：{{outStorageArr.length?outStorageArr.length:'0'}}</view>
				<view class="btn btnActive" @click="handleOutStorage" v-if="outStorageArr.length > 0">报工</view>
				<view class="btn btnDisable" v-else >报工</view>
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
<!-- 		<view class="btnModal" v-if="showModal" id="btnModal">
			<image class="modalImage" src="../../static/cutWarehouse/modalImage.png" mode="aspectFit"></image>
			<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
		</view> -->
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
