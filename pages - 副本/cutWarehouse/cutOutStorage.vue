<template>
	<view class="mainContent">
		<!-- <view class="commonBtn" @tap="handleScanTask" style="background-color: #fca147;">扫描缝制任务单号</view> -->
		<!-- <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">扫描PCS码</view> -->
		<view class="location">
			<image class="scanCodeBox" src="../../static/cutWarehouse/scanCodeBox.png" mode="aspectFit" @tap="handleScanCodeBox"></image>
			<input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" :placeholder="sewingTaskRecord? '请扫描PCS码': '请扫描缝制任务单号'" />
		</view>
		<view class="storageLocation">
			<text class="storageTitle">缝制任务单号：</text>
			<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="sewingTaskRecord" confirm-type="search" placeholder="请输入缝制任务单号" disabled/>
		</view>
		<view class="radioLocation">
			<checkbox-group @change="checkboxChange">
				<view class="checkboxStyle">
					<checkbox value="" :checked="!isSelectCheckbox" style="transform: scale(0.8)"/>
				</view>
				<view class="checkboxStyle">全部</view>
			</checkbox-group>
		</view>
		<view class="pannelContent">
			<view 
			 class="storageItem" 
			 v-for="(item, index) in outStorageArr" 
			 :key="index"
			>
				<view 
				 v-show="item.isShowScan"
				 :class="[item.isSelectScan ? 'selectLine': '' , 'touch-list', 'list-touch']" 
				 :style="item.txtStyle"
				 >
					<text class="serialNumber">{{ index + 1 }}.</text>
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
							<view class="storageNum">
								<text>数量：</text>
								<text>{{ item.inputNumber }}</text>
							</view>
						</view>
					</view>	
				</view>
			</view>
		</view>
		<view class="bottomLocation">
			<view class="scanNum">总行数/已扫描行数：{{ outStorageArr.length }}/{{ alreadyOutStorageArr.length }}</view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" @tap="handleMore">更多</view>
				<view class="commonBtn inStorageBtn" @tap="handleOutStorage" v-if="outStorageArr.length > 0 && outStorageArr.length == alreadyOutStorageArr.length">出库</view>
				<view class="commonBtn noInStorageBtn" v-else>出库</view>
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
		<scanCode></scanCode>
	</view>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { arrayToHeavy, toasting } from '../../utils/index.js'
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
			sewingTaskRecord: '',
			outStorageArr: [],
			alreadyOutStorageArr: [],
			startX: ''
		});
		
		const handleScanCodeBox = () => {
			uni.scanCode({
				onlyFromCamera: true,
				success: res => {
					console.log(res.result)
					//这里即拿到了扫描出的数据
					if(state.sewingTaskRecord) {
						console.log("扫描扫描PCS码")
						// 扫描PCS码
						handleScanPCS(res.result)
					}else {
						console.log("扫描扫描缝制任务单号")
						// 扫描缝制任务单号
						handleScanTask(res.result)
					}
				},
				fail: err => {
				    // 需要注意的是小程序扫码不需要申请相机权限
				}
			});
		}
		
		const handleScanTask = (sewingExecutionNum) => { // 扫描缝制任务单号
			Api.getSewingExecution({
				sewingExecutionNum: sewingExecutionNum // 'FZ20211116014098380'
			}).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '扫描缝制任务单号成功！',
						icon: 'none',
						duration: 3000
					})
					
					state.sewingTaskRecord = res.data.sewingExecutionNum
					state.outStorageArr = res.data.list.map((item, index) => {
						return {
							id: item.id || "",
							productId: item.productId || "",
							produceId: item.produceId || "",
							subpackageId: item.subpackageId || "",
							proNum: item.proNum || "",
							colorCode: item.colorCode || "",
							colorName: item.colorName || "",
							sizeCode: item.sizeCode || "",
							sizeName: item.sizeName || "",
							packageNum: item.packageNum || "",
							inputNumber: item.inputNumber || "",
							outputNumber: 0,
							storageStatus: 0,
							isShowScan: true,
							isSelectScan: false
						}
					})
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
		
		const handleScanPCS = (pcsNum) => { // 扫描PCS码
			Api.getPiecesByPCSNum({
				pcsNum: pcsNum, // 'PD20211110090285439-0-00000116'
				sewingExecutionNum: state.sewingTaskRecord
			}).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '扫描PCS码成功！',
						icon: 'none',
						duration: 3000
					})
					state.alreadyOutStorageArr.push(
						{
							id: res.data.id || "",
							productId: res.data.productId || "",
							produceId: res.data.produceId || "",
							subpackageId: res.data.subpackageId || "",
							proNum: res.data.proNum || "",
							colorCode: res.data.colorCode || "",
							colorName: res.data.colorName || "",
							sizeCode: res.data.sizeCode || "",
							sizeName: res.data.sizeName || "",
							packageNum: res.data.packageNum || "",
							inputNumber: res.data.inputNumber || "",
							arrowFlag: true
						}
					)
					
					// 数组去重
					state.alreadyOutStorageArr = arrayToHeavy(state.alreadyOutStorageArr)
					if(state.isSelectCheckbox) {
						outStorageMethods(false)
					}else {
						outStorageMethods(true)
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
		
		const checkboxChange = (e) => { // 全部
			if(state.isSelectCheckbox) { 
				state.isSelectCheckbox = false
				outStorageMethods(true)
			}else {
				state.isSelectCheckbox = true
				outStorageMethods(false)
			}
		}
		
		const handleMore = () => { // 更多
			state.showModal = true
		}
		
		const handleOutStorage = () => { // 出库
			Api.outOfStock({
				list: state.outStorageArr
			}).then(res => {
				if (res.code === 0) {
					state.outStorageArr = []
					state.showSuccessMessage = '出库成功！'
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
			state.sewingTaskRecord = ''
		}
		
		const outStorageMethods = (bool) => {
			for(let i = 0; i < state.outStorageArr.length; i++) {
				for(let j = 0; j < state.alreadyOutStorageArr.length; j++) {
					if(state.outStorageArr[i].id == state.alreadyOutStorageArr[j].id) {
						state.outStorageArr[i].isShowScan = bool
						state.outStorageArr[i].isSelectScan = bool
					}
				}
			}
		}

		return {
			...toRefs(state),
			handleScanCodeBox,
			handleScanTask,
			handleScanPCS,
			checkboxChange,
			handleMore,
			handleOutStorage,
			handleEmpty,
			outStorageMethods
		}
	},
	components: {
		scanCode
	}
});
</script>

<style lang="less" scoped>
.mainContent {
	position: relative;
	background-color: #F3F3F3;
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
		margin: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.storageTitle {
			font-size: 25rpx;
			font-weight: bold;
		}
		.storageInput {
			width: 75%;
			height: 80rpx;
			display: inline-block;
			border: 1rpx solid #212121;
			background-color: #F2F2F2;
			padding: 0 10rpx;
		}
	}
	.radioLocation {
		text-align: right;
		margin-right: 20rpx;
		.checkboxStyle {
			display: inline-block;
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
		width: 500rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -250rpx;
		margin-top: -40rpx;
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
