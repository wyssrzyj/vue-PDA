<template>
	<view class="mainContent">
		<!-- <view class="commonBtn" @tap="handleScanStorage" style="background-color: #fca147;">扫描库位</view> -->
		<!-- <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">扫描PCS码</view> -->
		<view class="location">
			<image class="scanCodeBox" src="../../static/cutWarehouse/scanCodeBox.png" mode="aspectFit" @tap="handleScanCodeBox"></image>
			<input class="uni-input scanInput" placeholder-style="font-size: 34rpx"  confirm-type="search" :placeholder="storageValue? '请扫描PCS码': '请扫描库位码'" />
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
				<view class="commonBtn inStorageBtn" @tap="handleRepealInStorage" v-if="inStorageArr.length > 0">撤销入库</view>
				<view class="commonBtn noInStorageBtn" v-else>撤销入库</view>
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
		<view class="reasonMask" v-if="showReasonMask">
			<view class="reasonDialog">
				<view class="reasonContent">
					<view class="reasonTitle">原因记录</view>
					<view class="reasonInside">
						<view class="reasonText">
							<text style="color: red;">*</text>撤销入库原因：
						</view>
						<view class="reasonSelect">
							<picker @change="bindPickerChange" :value="selectIndex" :range="selectArr" range-key="selectIndex">
								<view class="uni-input">
									<text>{{selectArr[selectIndex]}}</text>
								</view>
							</picker>
							<image src="../../static/cutWarehouse/selectDownArrow@2x.png" mode="aspectFit" class="selectDownArrow"></image>
						</view>
					</view>
					<view>操作人：{{ username }}</view>
					<view>操作时间：{{ date }}</view>
				</view>
				<view class="btnLocation" style="margin-left: 40rpx;">
					<view class="cancelBtn" @tap="handleCancel">取消</view>
					<view class="confirmBtn" @tap="handleConfirm">确定</view>
				</view>
			</view>
		</view>
		<scanCode></scanCode>
	</view>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue';
import { touchStart, touchMove, touchEnd, arrayToHeavy, toasting } from '../../utils/index.js'
import Api from '../../service/api'
import scanCode from "../../components/scan/scan.vue"

export default defineComponent({
	name: 'repealCutInStorage',
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
	setup() {
		const state = reactive({
			showModal: false,
			showSuccessPop: false,
			showErrorPop: false,
			showReasonMask: false,
			showSuccessMessage: '',
			showErrorMessage: '',
			storageValue: '',
			wareHouseLocation: '',
			typeMode: '2',
			inStorageArr: [],
			startX: '',
			selectIndex: 0,
			selectArr: [],
			username: '',
			date: ''
		});
		
		onMounted(() => {
			Api.getReason({
					
			}).then(res => {
				if (res.code === 0) {
					// 下拉选择
					state.selectArr = res.data.dictList.map(item => {
						return item.dictLabel
					})
					// 操作人
					state.username = res.data.username
					// 操作时间
					state.date = res.data.date
				}
			})
		})
		
		const handleScanCodeBox = () => {
			uni.scanCode({
				onlyFromCamera: true,
				success: res => {
					console.log(res.result)
					//这里即拿到了扫描出的数据
					if(state.storageValue) {
						console.log("扫描扫描PCS码")
						// 扫描PCS码
						handleScanPCS(res.result)
					}else {
						console.log("扫描扫描库位")
						// 扫描库位
						handleScanStorage(res.result)
					}
				},
				fail: err => {
				    // 需要注意的是小程序扫码不需要申请相机权限
				}
			});
		}
		
		const handleScanStorage = (locationCode) => { // 扫描库位
			Api.getLocation({
				locationCode: locationCode // 'A-02'
			}).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '扫描库位成功！',
						icon: 'none',
						duration: 3000
					})
					state.wareHouseLocation = res.data.id
					state.storageValue = res.data.locationCode
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
			state.inStorageArr = state.inStorageArr.reverse()
			
			Api.getInfoBySearch({
				pcsNum: pcsNum, // 'PD20211118073139826-0-00153638'
				type: state.typeMode,
				wareHouseLocation: state.wareHouseLocation
			}).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '扫描PCS码成功！',
						icon: 'none',
						duration: 3000
					})
					state.inStorageArr.push(
						{
							id: res.data.subpackageId || "",
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
					state.inStorageArr = arrayToHeavy(state.inStorageArr)
					
					state.inStorageArr = state.inStorageArr.reverse()
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
		
		const handleTouchStart = (e) => {
			state.startX = touchStart(e)
		}
		
		const handleTouchMove = (e) => {
			state.inStorageArr = touchMove(e, state.startX, state.inStorageArr)
		}
		
		const handleTouchEnd = (e) => {
			state.inStorageArr = touchEnd(e, state.startX, state.inStorageArr)
		}
		
		const deleteMember = (index) => { // 点击删除按钮事件
			state.inStorageArr.splice(index, 1)
		}
		
		const handleMore = () => { // 更多
			state.showModal = true
		}
		
		const handleRepealInStorage = () => { // 撤销入库
			// 显示下拉弹框
			state.showReasonMask = true
		}
		
		const handleEmpty = () => { // 清空
			state.inStorageArr = []
			state.showModal = false
			state.storageValue = ''
		}
		
		const bindPickerChange = (e) => {
			state.selectIndex = e.detail.value
		}
		
		const handleCancel = () => {
			// 隐藏下拉弹框
			state.showReasonMask = false
		}
		
		const handleConfirm = () => {
			let listArr = state.inStorageArr.map((item, index) => {
				return {
					index: state.inStorageArr.length - index,
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
					storageStatus: 2,
					warehouseLocationId: state.wareHouseLocation
				}
			})
					
			Api.addPiecesMarket({
				rollReason: String(state.selectIndex+1),
				list: listArr
			}).then(res => {
				if (res.code === 0) {
					state.inStorageArr = []
					// 隐藏下拉弹框
					state.showReasonMask = false
					state.showSuccessMessage = '撤销入库成功！'
					state.showSuccessPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						state.showSuccessPop = false
					}, 2000)
				}
			})
		}

		return {
			...toRefs(state),
			handleScanCodeBox,
			handleScanStorage,
			handleScanPCS,
			handleTouchStart,
			handleTouchMove,
			handleTouchEnd,
			deleteMember,
			handleMore,
			handleRepealInStorage,
			handleEmpty,
			bindPickerChange,
			handleCancel,
			handleConfirm
		};
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
			font-size: 33rpx;
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
	.cancelBtn {
		display: inline-block;
		text-align: center;
		padding: 20rpx 55rpx;
		background-color: #fff;
		border: 1rpx solid #000;
		color: #000;
		border-radius: 10rpx;
		margin: 20rpx 30rpx;
		cursor: pointer;
	}
	.confirmBtn {
		display: inline-block;
		text-align: center;
		padding: 20rpx 55rpx;
		background-color: #4a70f5;
		color: #fff;
		border-radius: 10rpx;
		margin: 20rpx 30rpx;
		cursor: pointer;
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
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			left: 40rpx; 
			top: 20rpx;
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
	.reasonMask {
		width: 100%;
		height: 100vh;
		background-color: rgba(0,0,0, 0.5);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 5;
		.reasonDialog {
			width: 700rpx;
			height: 440rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-left: -350rpx;
			margin-top: -220rpx;
			background-color: #fff;
			padding: 30rpx 40rpx;
			border-radius: 20rpx;
			text-align: left;
			color: #666;
			font-size: 34rpx;
			.reasonContent {
				.reasonTitle {
					font-size: 45rpx;
					font-weight: bold;
					text-align: center;
				}
				.reasonInside {
					margin: 20rpx 0;
					.reasonText {
						display: inline-block;
						font-size: 40rpx;
						font-weight: bold;
					}
					.reasonSelect {
						position: relative;
						display: inline-block;
						background-color: #fff;
						width: 300rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						border: 1px solid #000;
						.selectDownArrow {
							position: absolute;
							right: 5rpx;
							top: 10rpx;
							width: 40rpx;
							height: 30rpx;
						}
					}
				}
			}
		}
	}
}
</style>
