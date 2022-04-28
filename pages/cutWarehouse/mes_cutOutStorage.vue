<template>
	<view class="mainContent" @click="closeModal">
		<view class="location">
			<view class="tip_text"><text>{{sewingTaskRecord ? '请扫描PCS码!': '请扫描缝制任务单号码'}}</text></view>
			<!-- <input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search"
				:placeholder="sewingTaskRecord? '请扫描PCS码': '请扫描缝制任务单号码'"  disabled /> -->
		</view>
		<view class="storageLocation" v-show="sewingTaskRecord">
			<text class="storageTitle">缝制任务单号：<text style="color: #666666; font-size: 36rpx;">{{sewingTaskRecord? sewingTaskRecord: '请扫描缝制任务单号码'}}</text></text>
			<!-- <text class="storageTitle">缝制任务单号：</text>
			<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="sewingTaskRecord"
				confirm-type="search" placeholder="请扫描缝制任务单号码" disabled /> -->
		</view>
		<view class="radioLocation">
			<checkbox-group @change="checkboxChange">
				<view class="checkboxStyle">
					<checkbox value="" :checked="!isSelectCheckbox" style="transform: scale(0.8)" />
				</view>
				<view class="checkboxStyle">展示全部</view>
			</checkbox-group>
		</view>
		<view class="pannelContent">
			<scroll-view  scroll-y="true" class="scroll-Y">
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options1" @click="deleteMember($event,item)" :name="item.id"
						 class="storageItem" v-for="(item, index) in outStorageArr" :key="item.id" v-if="item.isShowScan">
						<view :class="[item.isSelectScan ? 'selectLine': '' , 'touch-list', 'list-touch']"
							class="swipe-action u-border-top u-border-bottom">
								<view class="serialNumber">{{ index + 1 }}.</view>
								<view>
									<view class="storageTop">
										<view class="storageCode">{{ item.proNum }}</view>
										<view v-if="item.packageState=='齐套可用'" class="storageUse">齐套可用</view>
										<view v-else-if="item.packageState=='齐套不可用'" class="storageUnUse">齐套不可用</view>
										<view v-else class="NoStorageUnUse">非齐套不可用</view>
									</view>
								
								
									<view>
										<text>颜色尺码：</text>
										<text decode="true"
											space="true">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeCode }}</text>
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
										<view class="storageArea">
											<text>库位：</text>
											<text>{{ item.locationCode }}</text>
										</view>
									</view>
								</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</scroll-view>
		</view>
		<u-action-sheet :actions="deletelist" :show="showModal" @select="handleEmpty" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showModal=false"></u-action-sheet>
		<view class="bottomLocation">
			<view class="btnLocation">
				<!-- <view class="commonBtn moreBtn" id="moreBtn" @tap="handleMore">更多</view> -->
				<view class="moreBtn">
					<u--text style="padding-right: 10rpx;"  size="32" text="更多" :color="'#333333'" lineHeight="104" @tap="handleMore"></u--text>
					<view class="iconfont icon-gengduo icon_style"></view>
				</view>
				<view class="scanNum">
					<text style="padding-right: 20px;">已扫描行数：{{ outStorageArr.length }}/{{ alreadyOutStorageArr.length }}</text>
					<u-button class="inStorageBtn" type="primary" :class="!alreadyOutStorageArr.length > 0 ?'custom-style' : ''" @tap="handleInStorage" :disabled="!alreadyOutStorageArr.length > 0" text="出库"></u-button>
				</view>
			</view>
		</view>
		<!-- <view class="btnModal" v-show="showModal">
			<image class="modalImage" src="../../static/cutWarehouse/modalImage.png" mode="aspectFit"></image>
			<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
		</view> -->
		<!-- <u-popup :show="showModal" @close="showModal = false" :overlayOpacity="0">
			<view class="btnModal">
				<image class="modalImage-out" src="../../static/cutWarehouse/modalImage.png" mode="aspectFit"></image>
				<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
			</view>
		</u-popup> -->
		<view class="successPopup remindPopup" v-if="showSuccessPop">
			<view class="successImage"></view>
			<view style="margin: 0 20rpx 0 90rpx;">{{ showSuccessMessage }}</view>
		</view>
		<view class="errorPopup remindPopup" v-if="showErrorPop">
			<view class="errorImage"></view>
			<view style="margin: 0 20rpx 0 80rpx;">{{ showErrorMessage }}</view>
		</view>
		<scan-code></scan-code>
		
		
		<u-modal :show="show"  :title="title" :showCancelButton="true" confirmColor="#476bf9" confirmText="确定" @confirm="handleConfirm" @cancel="handleCancel">
					<view class="slot-content">
						<rich-text :nodes="content"></rich-text>
					</view>
		</u-modal>
		<u-modal :show="showM"  :title="title" confirmColor="#476bf9" confirmText="确定" @confirm="handleConfirmM">
				<view class="slot-content">
					<rich-text :nodes="contentM"></rich-text>
				</view>
		</u-modal>
	</view>
</template>

<script>
	// import { defineComponent, ref, reactive, toRefs } from 'vue';
	import {
		arrayToHeavy,
		toasting,
		useDebounce
	} from '../../utils/index.js'
	import Api from '../../service/api'
	import scanCode from "../../components/scan/scan.vue"

	export default {
		// name: 'cutOutStorage',
		onLoad() {
			// console.log('onLoad');
		},
		onShow() {
			// console.log('onShow');
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
			uni.$on('scancodedate', (data) => {
				if (this.sewingTaskRecord) {
					console.log("扫描PCS码")
					// 扫描PCS码
					this.handleScanPCS(data.code)
				} else {
					console.log("扫描缝制任务单号")
					// 扫描缝制任务单号
					this.handleScanTask(data.code)
				}
			})
		},
		watch: {
			'outStorageArr.length': {
				handler(newVal) {
					if (newVal === 0) {
						this.sewingTaskRecord = ""
					}
				}
			}
		},
		data() {
			return {
				isSelectCheckbox: true,
				showModal: false,
				showSuccessPop: false,
				showErrorPop: false,
				showSuccessMessage: '',
				showErrorMessage: '',
				sewingTaskRecord: '',
				outStorageArr: [
				
				],
				alreadyOutStorageArr: [
				
					
				],
				startX: '',
				options1: [{
					text: '删除',
					style: {
						backgroundColor: '#cc3300',
					}
				}],
				scrollTop:0,
				show:false,
				title:'提示',
				content:`存在齐套不可用或非齐套不<br>可用数据，是否继续出库？`,
				deletelist:[{name:'清空',color:'#FC361D'}],
				showM:false,
				contentM:`该任务单已完成拣货，请出<br>库！`,
			}
		},
		methods: {
			// handleScanCodeBox() {
			// 	uni.scanCode({
			// 		onlyFromCamera: true,
			// 		success: res => {
			// 			//这里即拿到了扫描出的数据
			// 			if (this.sewingTaskRecord) {
			// 				// 扫描PCS码
			// 				this.handleScanPCS(res.result)
			// 			} else {
			// 				// 扫描缝制任务单号
			// 				this.handleScanTask(res.result)
			// 			}
			// 		},
			// 		fail: err => {
			// 			// 需要注意的是小程序扫码不需要申请相机权限
			// 		}
			// 	});
			// },
			handleConfirmM(){
				this.showM=false
			},
			handleCancel(){   //关闭提示弹窗
				this.show=false
			},
			handleScanTask(sewingExecutionNum) { // 扫描缝制任务单号
				Api.getSewingExecution({
					sewingExecutionNum: sewingExecutionNum // 'FZ20211116014098380'
				}).then(res => {
					if (res.code === 0) {
						uni.showToast({
							title: '扫描缝制任务单号成功！',
							icon: 'none',
							duration: 3000
						})

						this.sewingTaskRecord = res.data.sewingExecutionNum
						this.outStorageArr = res.data.list.map((item, index) => {
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
								locationCode: item.locationCode || "",
								packageState: item.packageState || "",
								outputNumber: 0,
								storageStatus: 0,
								isShowScan: true,
								isSelectScan: false,
								produceSkuId: item.produceSkuId || "",
								sewingExecutionId: item.sewingExecutionId || "",
								sewingExecutionSkuId: item.sewingExecutionSkuId || "",
								warehouseLocationId: item.warehouseLocationId || ""
							}
						})
					} else {
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
				Api.getPiecesByPCSNum({
					pcsNum: pcsNum, // 'PD20211110090285439-0-00000116'
					sewingExecutionNum: this.sewingTaskRecord
				}).then(res => {
					if (res.code === 0) {
						uni.showToast({
							title: '扫描PCS码成功！',
							icon: 'none',
							duration: 3000
						})
						//背景色变蓝
						this.outStorageArr.forEach(item => {
							if (item.subpackageId === res.data.subpackageId) {
								item.isSelectScan = true
								item.isShowScan=false
								this.alreadyOutStorageArr.push(item)
							}
						})
						if(this.outStorageArr.length===this.alreadyOutStorageArr.length){
							this.showM=true
						}
						// 数组去重
						this.alreadyOutStorageArr = arrayToHeavy(this.alreadyOutStorageArr)
						if (this.isSelectCheckbox) {
							outStorageMethods(false)
						} else {
							outStorageMethods(true)
						}
					} else {
						this.showErrorMessage = res.msg
						this.showErrorPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showErrorPop = false
						}, 2000)
					}
				})
			},
			deleteMember(e,i) { // 点击删除按钮事件
				if(e.content.text==='删除'){
					this.outStorageArr = this.outStorageArr.filter(item => item.id !== i.id)
				}
			},
			checkboxChange(e) { // 全部
				if(this.alreadyOutStorageArr.length===this.outStorageArr.length){
					this.showM=true
				}
				if (this.isSelectCheckbox) {
					this.isSelectCheckbox = false
					this.outStorageMethods(true)
				} else {
					this.isSelectCheckbox = true
					this.outStorageMethods(false)
				}
			},

			handleMore(){ // 更多
				this.showModal = !this.showModal
			},

			closeModal(e){//点击页面其他地方关闭清空按钮
				if(e.target.id!="moreBtn" && this.showModal){
					// this.showModal=false
				}
			},


			handleOutStorage() { // 出库
				const Find=this.alreadyOutStorageArr.find(item=>{
					if(item.packageState==='齐套不可用'||item.packageState==='非齐套不可用'){
						return true
					}
				})
				if(Find){
					this.show=true
				}else{
					this.handleConfirm()
				}
			},
			handleConfirm(){   //确认出库
				Api.outOfStock({
					list: this.outStorageArr
				}).then(res => {
					if (res.code == 0) {
						this.show=false
						this.outStorageArr = []
						this.alreadyOutStorageArr=[]
						this.sewingTaskRecord = ""
						this.showSuccessMessage = '出库成功！'
						this.showSuccessPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showSuccessPop = false
						}, 2000)
					}
				})
			},
			handleEmpty() { // 清空
				this.outStorageArr = []
				this.showModal = false
				this.sewingTaskRecord = ''
			},


			outStorageMethods(bool) {   //全选工具类函数
				for (let i = 0; i < this.outStorageArr.length; i++) {
					for (let j = 0; j < this.alreadyOutStorageArr.length; j++) {
						if (this.outStorageArr[i].subpackageId == this.alreadyOutStorageArr[j].subpackageId) {
							this.outStorageArr[i].isShowScan = bool
							this.outStorageArr[i].isSelectScan = bool
						}
					}
				}
			},
		},
		components: {
			scanCode
		},
		created(){
			this.handleConfirm = useDebounce(this.handleConfirm);
		},
	};
</script>

<style lang="less" scoped>
	.mainContent {
		position: relative;
		background-color: #F3F3F3;
		height: 100%;
		width: 100%;
		.location {
			// position: relative;
			// margin: 20rpx;
			.tip_text {
				background-color: #E4F4FF;
				width: 100%;
				font-family: PingFang-SC-Bold;
				font-size: 18px;
				color: #0C99F2;
				padding: 13px 14px;
				font-weight: 700;
			}

		.u-swipe-action-item__right__button__wrapper {
			background-color: #cc3300 !important;
		}

		.u-page {
			padding: 0;
		}

		.u-demo-block__title {
			padding: 10px 0 2px 15px;
		}

		.swipe-action {
			&__content {
				padding: 25rpx 0;

				&__text {
					font-size: 15px;
					padding-left: 30rpx;
				}
			}
		}
		.scanInput {
				// width: 88%;
				height: 80rpx;
				border: 1px solid #767676;
				background-color: #FFF;
				padding: 0 10rpx;
				text-align: center;
				// margin-left: 70rpx;
			}
		}
		.storageLocation {
			width: 100%;
			display: flex;
			font-size: 36rpx;
			justify-content: flex-start;
			// height: 100rpx;
			padding: 26rpx 30rpx;
			background-color: #ffffff;
			align-items: center;
			.storageTitle {
				// font-size: 25rpx;
				color: #333333;
				font-weight: bold;
			}
			.storageInput {
				width: 65%;
				height: 80rpx;
				display: inline-block;
				border: 1rpx solid #212121;
				background-color: #F2F2F2;
				padding: 0 10rpx;
			}
		}
		.radioLocation {
			text-align: left;
			// margin-right: 20rpx;
			margin-top: 30rpx;

			.checkboxStyle {
				display: inline-block;
			}
		}
		.pannelContent {
			height: calc(100vh - 230px);
			overflow-y: auto;
			.storageItem {
				display: flex;
				width: 375px;
				margin: 20rpx 0;
				overflow: hidden;
				.selectLine {
					width: 375px;
					background-color: #84D3F9 !important;
				}
				.touch-list{
					width: 750rpx;
					padding: 30rpx 26rpx;
					background-color: #fff;
					overflow: hidden;
				}

				.list-touch{
					width: 750rpx;
					transition: left 0.2s ease-in-out;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: flex;
					font-size: 32rpx;
					justify-content: flex-start;
					align-items: center;
					.serialNumber {
						padding-right: 40rpx;
						font-weight: bold;
					}
					.storageTop{
						display: flex;
						justify-content: space-between;
						font-weight: bold;
						// .storageCode {
						// 	font-weight: bold;
						// }
						.storageUse{
							color: #0BC46F;
						}
						.storageUnUse{
							color: #FFA600;
						}
						.NoStorageUnUse{
							color: #F4333F;
						}
					}
					.storageContent {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						.storageArea {
							font-weight: bold;
						}
					}
				}

				.list-delete {
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
			height: 104rpx;
			left: 0;
			bottom: 0;
			padding: 0 30rpx;
			z-index: 99;
			.scanNum {
			
				line-height: 104rpx;
				text-align: center;
				color: #585858;
				font-size: 32rpx;
				// font-weight: bold;
				display: flex;
				justify-content: flex-end;
				align-items:center;
			}
			.btnLocation {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items:center;
				.moreBtn {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					cursor: pointer;
					.icon_style {
						font-size: 20rpx;
						color: #999999;
						
					}
				}
				.inStorageBtn {
					width: 200rpx;
					margin: 0;
				}
				.custom-style {
					color: #999999;
					background-color: #E0E0E0;
					border-color: #E0E0E0;
				}
			}
		}

		.btnModal {
			position: absolute;
			left: 30rpx;
			bottom: 74rpx;
			z-index: 90;
			
			.modalImage-out {
				width: 300rpx;
				height: 166rpx;
				background-color: url('../../static/cutWarehouse/chuku.png')
				// background-color: rgba();
				// color: red;
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
			// width: 500rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			white-space: nowrap;
			z-index: 100;
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
				left: 20rpx;
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
				left: 20rpx;
				top: 20rpx;
			}
		}
	}
</style>
