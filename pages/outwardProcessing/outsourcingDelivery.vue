<template>
	<view class="mainContent">
		<!-- <view class="commonBtn" @tap="handleScanTask" style="background-color: #fca147;">扫描缝制任务单号</view> -->
		<!-- <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">扫描PCS码</view> -->
		<view class="borderBottom">
			<view class="location">
				<image class="scanCodeBox" src="../../static/cutWarehouse/scanCodeBox.png" mode="aspectFit" @tap="handleScanCodeBox"></image>
				<input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" placeholder="请扫描PCS码" />
			</view>
			<view class="storageLocation">
				<text style="color: red;">*</text><text class="storageTitle">产品款号：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="productNum" confirm-type="search" placeholder="请输入产品款号" disabled/>
				<view class="queryBtn" @tap="productQuery">查询</view>
			</view>
			<view class="storageLocation">
				<text style="color: red;">*</text><text class="storageTitle">供应商简称：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="supplierName" confirm-type="search" placeholder="请输入供应商简称" disabled/>
				<view class="queryBtn" @tap="supplierQuery">查询</view>
			</view>
		</view>
		<!-- <view class="radioLocation">
			<checkbox-group @change="checkboxChange">
				<view class="checkboxStyle">
					<checkbox value="" :checked="!isSelectCheckbox" style="transform: scale(0.8)"/>
				</view>
				<view class="checkboxStyle">全部</view>
			</checkbox-group>
		</view> -->
		<view class="pannelContent">
			<view 
			 class="storageItem" 
			 v-for="(item, index) in outStorageArr" 
			 :key="index"
			>
			<!-- v-show="item.isShowScan" -->
				<view 
				 :class="[item.isSelectScan ? 'selectLine': '' , 'touch-list', 'list-touch']" 
				 :style="item.txtStyle"
				 @touchstart="handleTouchStart($event,item)"
				 @touchmove="handleTouchMove($event,item)" 
				 @touchend="handleTouchEnd($event,item)"
				 :data-index="index"
				 >
					<!-- <text class="serialNumber">{{ index + 1 }}.</text> -->
					<view>
						<view class="storageCode">{{ item.proNum }}</view>
						<view>
							<text>颜色尺码：</text>
							<text decode="true" space="true">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeName }}</text>
						</view>
						<view class="storageContent">
							<view>
								<text>扎号：</text>
								<text>{{ item.packageNum }}</text>
							</view>
							<view>
								<text>数量：</text>
								<text>{{ item.packageNum }}</text>
							</view>
							<view class="storageNum">
								<text>库位：</text>
								<text>{{ item.inputNumber }}</text>
							</view>
						</view>
					</view>	
					<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="item.arrowFlag"></image>
					<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-else></image>
				</view>
				<view class="touch-list list-delete" @click = "deleteMember(item)">
					删除
				</view>
			</view>
		</view>
		<view class="bottomLocation">
			<view class="scanNum"><view><text class="scannedNum">{{ alreadyOutStorageArr.length }}</text>/{{ outStorageArr.length }}</view><view><text>已扫描数量：</text><text class="scannedAllNum">{{alreadyCount}}</text></view></view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" @tap="handleMore">更多</view>
				<view class="commonBtn inStorageBtn" @tap="handleOutStorage" v-if="alreadyCount > 0 ">出库并打印</view>
				<view class="commonBtn noInStorageBtn" v-else>出库并打印</view>
			</view>
		</view>
		<view class="btnModal" v-show="showModal">
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
		<view class="productNumModel" v-if="showProductNumModel">
			<view class="productNumSelect">
				<input placeholder-style="font-size: 34rpx" v-model="productForm.proNum" confirm-type="search" placeholder="产品款号" class="productNumInput"/>
				<input placeholder-style="font-size: 34rpx" v-model="productForm.clientNum" confirm-type="search" placeholder="客户款号" class="productNumInput"/>
				<view class="queryBtn" @tap="queryProduct">查询</view>
			</view>
			<view class="productTable">
				<view class="tableColumn" >
					<view class="td" style="background-color: #bbdef5;max-width: 260rpx;">产品款号</view>
					<view class="td" style="background-color: #bbdef5;max-width: 260rpx;">客户款号</view>
				</view>
				<view class="tableColumn" v-for="item in productData" @tap="getProductNum(item)" :key="item.id">
					<view class="td" style="max-width: 260rpx;">{{item.proNum}}</view>
					<view class="td" style="max-width: 260rpx;">{{item.clientNum}}</view>
				</view>
			</view>
		</view>
		<view class="productNumModel" v-if="showSupplierModel">
			<view class="productNumSelect">
				<input placeholder-style="font-size: 34rpx" v-model="supplierForm.supplierAbbreviation" confirm-type="search" placeholder="供应商简称" class="productNumInput"/>
				<view class="queryBtn" @tap="querySupplier">查询</view>
			</view>
			<view class="productTable">
				<view class="tableColumn" >
					<view class="td firstTd" style="background-color: #bbdef5;">供应商简称</view>
					<view class="td" style="background-color: #bbdef5;">供应商全称</view>
				</view>
				<view class="tableColumn" v-for="item in supplierData" :key="item.id" @tap="getSupplier(item,index)">
					<view class="td firstTd" style="display: flex;align-items: center;justify-content: center;">{{item.supplierAbbreviation}}</view>
					<view class="td">{{item.supplierName}}</view>
				</view>
			</view>
		</view>
		<scanCode></scanCode>
	</view>
</template>

<script>
// import { defineComponent, ref, reactive, toRefs } from 'vue';
import { arrayToHeavy, toasting,touchStart, touchMove, touchEnd} from '../../utils/index.js'
import Api from '../../service/api'
import scanCode from "../../components/scan/scan.vue"

export default defineComponent({
	name: 'cutOutStorage',
	onLoad() {
		// console.log('onLoad');
	},
	onShow() {
		// console.log('onShow');
		uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
		uni.$on('scancodedate', (data) => {
			console.log(data)
			if(this.sewingTaskRecord) {
				console.log("扫描PCS码")
				// 扫描PCS码
				this.handleScanPCS(data.code)
			}else {
				console.log("扫描缝制任务单号")
				// 扫描缝制任务单号
				this.handleScanTask(data.code)
			}
		})
	},
	setup() {
		const state = reactive({
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
			alreadyOutStorageArr: [],
			startX: '',
			showProductNumModel:false,
			showSupplierModel:false,
			productData:[],
			supplierData:[],
			productForm:{
				proNum:"",
				clientNum:"",
			},
			supplierForm:{
				supplierAbbreviation:""
			},
			startX:'',
			alreadyCount:0,
			PCSData:{},
		})
		//产品查询
		const productQuery=async ()=>{
			state.showProductNumModel=true
			const res=await Api.productQuery()
			state.productData=res.data
		};
		//搜索产品信息
		const queryProduct=async ()=>{
			const res=await Api.productQuery({proNum:state.productForm.proNum,clientNum:state.productForm.clientNum})
			state.productData=res.data
		};
		// 获取产品款号
		const getProductNum=(item)=>{
			state.productNum=item.proNum
			state.showProductNumModel=false
		};
		//代理商查询
		const supplierQuery=async ()=>{
			if(state.productNum!==""){
				state.showSupplierModel=true
				const res=await Api.supplierQuery({proNum:state.productNum})
				state.supplierData=res.data
			}else{
				state.showErrorMessage = '请先选择产品款号！'
				state.showErrorPop = true
				let timer = setTimeout(() => {
					clearTimeout(timer)
					state.showErrorPop = false
				}, 2000)
			}
		};
		//搜索供应商
		const querySupplier=async ()=>{
			const res=await Api.supplierQuery({supplierAbbreviation:state.supplierForm.supplierAbbreviation,proNum:state.productNum})
			state.supplierData=res.data
		}
		//获取供应商
		const getSupplier=async (item)=>{
			state.supplierName=item.supplierAbbreviation
			state.supplierId=item.id
			const res=await Api.pickingDet({proNum:state.productNum,outProcessSupplier:item.id})
			state.outStorageArr=res.data.map((item)=>{return{...item,arrowFlag:false}})
			state.showSupplierModel=false
		}
		//扫描PCS码
		const handleScanCodeBox = () => {
			if(state.productNum===""||state.supplierName===""){
				state.showErrorMessage = '请先选择产品款号及供应商！'
				state.showErrorPop = true
				let timer = setTimeout(() => {
					clearTimeout(timer)
					state.showErrorPop = false
				}, 2000)
			}else{
				uni.scanCode({
					onlyFromCamera: true,
					success: res => {
						console.log(res.result)
						//这里即拿到了扫描出的数据
						// if(state.sewingTaskRecord) {
						// 	console.log("扫描扫描PCS码")
						// 扫描PCS码
							handleScanPCS(res.result)
						// }else {
						// 	console.log("扫描扫描缝制任务单号")
						// 	// 扫描缝制任务单号
						// 	handleScanTask(res.result)
						// }
					},
					fail: err => {
					    // 需要注意的是小程序扫码不需要申请相机权限
						console.log(err)
					}
				});
			}
		}
		const handleTouchStart = (e,item) => {
			if(item.isSelectScan){
				state.startX = touchStart(e)
			}
		}
		
		const handleTouchMove = (e,item) => {
			if(item.isSelectScan){
				state.outStorageArr = touchMove(e, state.startX, state.outStorageArr)
			}
		}
		
		const handleTouchEnd = (e,item) => {
			if(item.isSelectScan){
				state.outStorageArr = touchEnd(e, state.startX, state.outStorageArr)
			}
		}
		const deleteMember=(item,index)=>{
			item.isSelectScan=false
			state.alreadyOutStorageArr.splice(index, 1)
			state.alreadyCount-=item.packageNum
		}
		
		const handleScanPCS = (pcsNum) => { // 扫描PCS码
			Api.outScanPCS({
				pcsNum:'PD20211220060584073-0-00000433', // 'PD20211110090285439-0-00000116'
				proNum: state.productNum,
				outProcessSupplier:state.supplierId
			}).then(res => {
				if (res.code === 0) {
						const Find=state.alreadyOutStorageArr.find((item)=>{
								item.subpackageId===res.data.subpackageId
							})
							if(!Find){
								uni.showToast({
									title: '扫描PCS码成功！',
									icon: 'none',
									duration: 3000
								})
								state.outStorageArr.forEach((item)=>{
									if(item.packageNum===res.data.packageCode){
										item.isSelectScan=true
										state.alreadyCount+=+item.packageNum
									}
								})
								state.alreadyOutStorageArr=state.outStorageArr.filter(item=>item.packageNum==res.data.packageCode)
								state.PCSData=res.data
								
								// 数组去重
								// state.alreadyOutStorageArr = arrayToHeavy(state.alreadyOutStorageArr)
								// if(state.isSelectCheckbox) {
								// 	outStorageMethods(false)
								// }else {
								// 	outStorageMethods(true)
								// }
							}else{
								state.showErrorMessage = '该PCS码已扫描！'
								state.showErrorPop = true
								let timer = setTimeout(() => {
									clearTimeout(timer)
									state.showErrorPop = false
								}, 2000)
							}
							
						}else {
							state.showErrorMessage = res.msg
							state.showErrorPop = true
							let timer = setTimeout(() => {
								clearTimeout(timer)
								state.showErrorPop = false
							}, 2000)
					}
			})
		}
		
		
		const handleMore = () => { // 更多
			state.showModal = true
		}
		
		const handleOutStorage = () => { // 出库
			Api.outOutsourcingDelivery({
					mesOrderSubpackageOutwardDTOList :[
						{
						...state.PCSData,
						mesPiecesMarketDTOList:state.alreadyOutStorageArr,
						}
					]
			}).then(res => {
				if (res.code === 0) {
					state.outStorageArr.forEach(item=>{
						const Find=state.alreadyOutStorageArr.find((val)=>{
							return val.packageNum==item.packageNum
						})
						if(Find){
							Find.isSelectScan=false
						}
					})
					state.alreadyOutStorageArr=[]
					state.alreadyCount=0
					state.showSuccessMessage = '出库并打印成功！'
					state.showSuccessPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						state.showSuccessPop = false
					}, 2000)
				}
			})
		}
		
		const handleEmpty = () => { // 清空
			state.outStorageArr = []
			state.showModal = false
			state.productNum = ''
			state.supplierName=""
			state.alreadyCount=0
			state.alreadyOutStorageArr=[]
		}
		
		// const outStorageMethods = (bool) => {
		// 	for(let i = 0; i < state.outStorageArr.length; i++) {
		// 		for(let j = 0; j < state.alreadyOutStorageArr.length; j++) {
		// 			if(state.outStorageArr[i].id == state.alreadyOutStorageArr[j].id) {
		// 				state.outStorageArr[i].isShowScan = bool
		// 				state.outStorageArr[i].isSelectScan = bool
		// 			}
		// 		}
		// 	}
		// }

		return {
			...toRefs(state),
			handleScanCodeBox,
			// handleScanTask,
			handleScanPCS,
			// checkboxChange,
			handleMore,
			handleOutStorage,
			handleEmpty,
			// outStorageMethods,
			productQuery,
			supplierQuery,
			getProductNum,
			getSupplier,
			queryProduct,
			handleTouchStart,
			handleTouchMove,
			handleTouchEnd,
			querySupplier,
			deleteMember
		}
	},
	components: {
		scanCode
	}
});
</script>

<style lang="scss">
	.mainContent {
	position: relative;
	background-color: #F3F3F3;
	.borderBottom{
		padding-bottom: 10rpx;
		border-bottom: 1px solid #ccc;
	}
	.location {
		position: relative;
		margin: 20rpx;
		.scanCodeBox {
			position: absolute;
			left: 2rpx;
			top: 2rpx;
			width: 60rpx;
			height: 60rpx;
		}
		.scanInput {
			width: 88%;
			height: 80rpx;
			border: 1px solid #767676;
			background-color: #FFF;
			padding: 0 10rpx;
			margin-left: 70rpx;
		}
	}
	.storageLocation {
		margin: 10rpx 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.storageTitle {
			font-size: 30rpx;
			font-weight: 900;
			width: 180rpx;
		}
		.storageInput {
			height: 60rpx;
			display: inline-block;
			border: 1rpx solid #212121;
			background-color: #F2F2F2;
			padding: 0 10rpx;
			flex: 1;
		}
		
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
		// margin-bottom: 202rpx;
		overflow: auto;
		.storageItem {
			display: flex;
			border: 1rpx solid #e4e4e4;
			border-radius: 20rpx;
			margin: 10rpx 5rpx;
			position: relative;
			overflow: hidden;
			.selectLine {
				background-color: #84D3F9 !important;
			}
			.touch-list{
				position: absolute; 
				top: 0;
				padding: 20rpx 60rpx;
				background-color: #fff;
				border-radius: 20rpx;
				overflow: hidden;
			}
			.list-touch{
				position: relative;
				width: 100%;   
				z-index: 5;    
				transition: left 0.2s ease-in-out;   
				white-space: nowrap;   
				text-overflow: ellipsis; 
				.serialNumber {
					position: absolute;
					left: 20rpx;
					top: 55rpx;
					font-weight: bold;
					font-size: 35rpx;
				}
				.storageCode {
					font-weight: bold;
				}
				.storageContent {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					.storageNum {
						font-weight: bold;
					}
				}
				.arrowImage {
					position: absolute;
					right: 55rpx;
					top: 55rpx;
					width: 44rpx;
					height: 46rpx;
				}
			}
			.list-delete{
				right: 0; 
				float: left;
				width: 100rpx;
				height: 162rpx;
				line-height: 155rpx;
				padding: 5rpx 16rpx;
				background-color: #EA5863;
				border-radius: 0 20rpx 20rpx 0;
				color: #fff;
				font-size: 35rpx;
				font-weight: lighter;
				text-align: center;
			}
		}
	}
	.bottomLocation {
		width: 100%;
		background-color: #fafafa;
		border-top: 1rpx solid #dcdcdc;
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 15rpx 30rpx 30rpx;
		.scanNum {
			height: 75rpx;
			line-height: 75rpx;
			text-align: right;
			font-size: 30rpx;
			font-weight: bold;
			display: flex;
			justify-content: space-between;
			.scannedNum{
				color: #fca147;
			}
			.scannedAllNum{
				color: $theme-color;
			}
		}
		.btnLocation {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.moreBtn {
				background-color: #fca147;
				cursor: pointer;
			}
			.inStorageBtn {
				background-color: #4a70f5;
				cursor: pointer;
				padding: 20rpx 30rpx;
			}
			.noInStorageBtn {
				background-color: #cccccc;
				cursor: not-allowed;
				padding: 20rpx 30rpx;
			}
		}
	}
	.btnModal {
		position: absolute;
		left: 30rpx;
		bottom: 20rpx;
		z-index: 10;
		.modalImage {
			width: 300rpx;
			height: 166rpx;
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
		width: 500rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -250rpx;
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
	.productNumModel{
		width:600rpx;
		position: absolute;
		top: 250rpx;
		left: 75rpx;
		z-index: 9;
		padding: 40rpx 30rpx;
		background-color: #f2f2f2;
		border: 3px solid #afafaf;
		
		.productNumSelect{
			display: flex;
			margin:0rpx 0rpx 30rpx;
			.productNumInput{
				width: 200rpx;
				height: 55rpx;
				border: 1px solid #ccc;
				background-color: #FFFFFF;
				margin: 0 6rpx;
			}
			.queryBtn{
				height: 55rpx;
			}
		}
		.productTable{
			width:520rpx;
			border-top: 1px solid black;
			border-left: 1px solid black;
			
			.tableColumn{
				display: flex;
				.td{
					flex: 1;
					border-bottom: 1px solid black;
					border-right: 1px solid black;
					text-align: center;
					line-height: 50rpx;
					background-color: white;
					// max-width: 260rpx;
				}
				.firstTd{
					flex: 0.6;
				}
			}
		}
	}
}
</style>
