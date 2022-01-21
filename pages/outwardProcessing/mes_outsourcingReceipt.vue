<template>
	<view class="mainContent">
		<!-- <view class="commonBtn" @tap="handleScanStorage" style="background-color: #fca147;">扫描库位</view> -->
		<!-- <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">扫描PCS码</view> -->
		<view class="location">
			<!-- <image class="scanCodeBox" src="../../static/cutWarehouse/scanCodeBox.png" mode="aspectFit" @tap="handleScanCodeBox"></image> -->
			<input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" :placeholder="storageValue? '请扫描PCS码': '请扫描库位码'"/>
		</view>
		<view class="storageLocation">
			<text class="storageTitle">当前库位：</text>
			<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="storageValue" confirm-type="search" placeholder="请输入当前库位" disabled/>
		</view>
		<view class="pannelContent">
			<view 
			 class="storageItem" 
			 v-for="(item, index) in inStorageArr" 
			 :key="index"
			>
				<view 
				 :class="[index == 0 ? 'selectLine': '' , 'touch-list', 'list-touch']" 
				 @touchstart="handleTouchStart" 
				 @touchmove="handleTouchMove" 
				 @touchend="handleTouchEnd"
				 :data-index="index"
				 :style="item.txtStyle"
				 >
					<text class="serialNumber">{{ inStorageArr.length-index }}.</text>
					<view>
						<view class="storageCode">{{ item.proNum }}</view>
						<view>
							<text>颜色尺码：</text>
							<text decode="true" space="true">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeCode }}</text>
						</view>
						<view class="storageContent">
							<view>
								<text>扎号：</text>
								<text>{{ item.packageNum }}</text>
							</view>
							<view class="storageNum">
								<text>数量：</text>
								<text>{{ item.outputNumber }}</text>
							</view>
						</view>
					</view>	
					<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="item.arrowFlag"></image>
					<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-else></image>
				</view>
				<view class="touch-list list-delete" @click = "deleteMember(index)">
					删除
				</view>
			</view>
		</view>
		<view class="bottomLocation">
			<view class="scanNum">已扫描行数：{{ inStorageArr.length }}</view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" @tap="handleMore">更多</view>
				<view class="commonBtn inStorageBtn" @tap="handleInStorage" v-if="inStorageArr.length > 0">入库</view>
				<view class="commonBtn noInStorageBtn" v-else>入库</view>
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
		<scan-code></scan-code>
	</view>
</template>

<script>
// import { defineComponent, ref, reactive, toRefs } from 'vue';
import { touchStart, touchMove, touchEnd, arrayToHeavy, toasting } from '../../utils/index.js'
import Api from '../../service/api'
import scanCode from "../../components/scan/scan.vue"
import throttle from "../../utils/index"

export default{
	// name: 'cutInStorage',
	onLoad() {
		// console.log('onLoad');
	},
	onShow() {
		// console.log('onShow');
		uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
		uni.$on('scancodedate', (data) => {
			console.log(data)
			if(this.storageValue) {
				console.log("扫描PCS码")
				// 扫描PCS码
				this.handleScanPCS(data.code)
			}else {
				console.log("扫描库位")
				// 扫描库位
				this.handleScanStorage(data.code)
			}
		})
	},
	data(){
		return {
			showModal: false,
			showSuccessPop: false,
			showErrorPop: false,
			showSuccessMessage: '',
			showErrorMessage: '',
			storageValue: '',
			wareHouseLocation: '',
			typeMode: '1',
			inStorageArr: [],
			startX: '',
			copyInStorageArr:[],
			nowTime:0,
			beforeTime:0
		}
	},
	methods:{
		// handleScanCodeBox(){
		// 	uni.scanCode({
		// 		onlyFromCamera: true,
		// 		success: res => {
		// 			console.log(res.result)
		// 			//这里即拿到了扫描出的数据
		// 			if(this.storageValue) {
		// 				console.log("扫描扫描PCS码")
		// 				// 扫描PCS码
		// 				this.handleScanPCS(res.result)
		// 			}else {
		// 				console.log("扫描扫描库位")
		// 				// 扫描库位
		// 				this.handleScanStorage(res.result)
		// 			}
		// 		},
		// 		fail: err => {
		// 		    // 需要注意的是小程序扫码不需要申请相机权限
		// 		}
		// 	});
		// },
		
		handleScanStorage(locationCode){ // 扫描库位
			Api.outReceiptScanLocation({
				locationCode,// 'A-01'
			}).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '扫描库位成功！',
						icon: 'none',
						duration: 3000
					})
					this.wareHouseLocation = res.data.id
					this.storageValue = res.data.locationCode
				}else {
					this.showErrorMessage = res.msg
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
				}
			})
		},
		
		handleScanPCS(pcsNum){ // 扫描PCS码
			this.inStorageArr = this.inStorageArr.reverse()
			
			Api.outReceiptScanPCS({
				// pcsNum: 'PD20211220060584073-0-00000433', // 'PD20211110090285439-0-00000116'
				// type: this.typeMode,
				// wareHouseLocation: this.wareHouseLocation
				locationCode:this.storageValue,
				pcsNum,
			}).then(res => {
				if (res.code === 0) {
					const Find=this.copyInStorageArr.find((item)=>{
						return item.packageCode==res.data.packageCode
					})
					if(!Find){
						uni.showToast({
							title: '扫描PCS码成功！',
							icon: 'none',
							duration: 3000
						})
						this.inStorageArr=this.inStorageArr.concat(res.data.mesPiecesMarketDTOList)
						this.copyInStorageArr=this.copyInStorageArr.concat(res.data)
						// 数组去重
						this.inStorageArr = arrayToHeavy(this.inStorageArr)
						
						this.inStorageArr = this.inStorageArr.reverse()
					}else{
						this.showErrorPop = true
						this.showErrorMessage = '该PCS码已扫描！'
						let timer=setTimeout(() => {
							clearTimeout(timer)
							this.showErrorPop = false
						}, 2000)
					}
				}else {
					this.showErrorMessage = res.msg
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
				}
			})
		},
		
		handleTouchStart(e){
			this.startX = touchStart(e)
		},
		
		handleTouchMove(e){
			this.inStorageArr = touchMove(e, this.startX, this.inStorageArr)
		},
		
		handleTouchEnd(e){
			this.inStorageArr = touchEnd(e, this.startX, this.inStorageArr)
		},
		
		
		deleteMember(index){ // 点击删除按钮事件
			this.inStorageArr.splice(index, 1)
		},
		
		handleMore(){ // 更多
			this.showModal = true
		},
		
		handleInStorage(){ // 入库
			// let listArr = this.inStorageArr.map((item, index) => {
			// 	return {
			// 		index: this.inStorageArr.length - index,
			// 		productId: item.productId || "",
			// 		produceId: item.produceId || "",
			// 		subpackageId: item.subpackageId || "",
			// 		proNum: item.proNum || "",
			// 		colorCode: item.colorCode || "",
			// 		colorName: item.colorName || "",
			// 		sizeCode: item.sizeCode || "",
			// 		sizeName: item.sizeName || "",
			// 		packageNum: item.packageNum || "",
			// 		inputNumber: item.inputNumber || "",
			// 		outputNumber: 0,
			// 		storageStatus: 0,
			// 		warehouseLocationId: this.wareHouseLocation
			// 	}
			// })
		
			Api.outReceipt({
				outProcessList:this.copyInStorageArr
			}).then(res => {
				if (res.code === 0) {
					this.inStorageArr = []
					this.showSuccessMessage = '入库成功！'
					this.showSuccessPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showSuccessPop = false
					}, 2000)
				}
			})
		},
		
		handleEmpty(){ // 清空
			this.inStorageArr = []
			this.showModal = false
			this.storageValue = ''
		},
	},
	components: {
		scanCode
	}
};
</script>

<style lang="less" scoped>
.mainContent {
	position: relative;
	background-color: #F3F3F3;
	.location {
		position: relative;
		margin: 20rpx;
		.scanInput {
			height: 80rpx;
			border: 1px solid #767676;
			background-color: #FFF;
			padding: 0 10rpx;
			text-align: center;
		}
	}
	.storageLocation {
		margin: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.storageTitle {
			font-size: 33rpx;
			font-weight: bold;
		}
		.storageInput {
			width: 76%;
			height: 80rpx;
			display: inline-block;
			border: 1rpx solid #212121;
			background-color: #F2F2F2;
			padding: 0 10rpx;
		}
	}
	.pannelContent {
		height: calc(100vh - 350rpx);
		overflow: auto;
		.storageItem {
			display: flex;
			border: 1rpx solid #e4e4e4;
			border-radius: 20rpx;
			margin: 20rpx 5rpx;
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
				height: 155rpx;
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
			color: #4a70f5;
			font-size: 30rpx;
			font-weight: bold;
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
			}
			.noInStorageBtn {
				background-color: #cccccc;
				cursor: not-allowed;
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
