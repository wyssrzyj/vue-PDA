<template>
	<view class="mainContent" @click="closeModal">
		<view class="location">
			<input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search"
				:placeholder="sewingTaskRecord? '请扫描PCS码': '请扫描缝制任务单号码'"  disabled />
		</view>
		<view class="storageLocation">
			<text class="storageTitle">缝制任务单号：</text>
			<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="sewingTaskRecord"
				confirm-type="search" placeholder="请扫描缝制任务单号码" disabled />
		</view>
		<view class="radioLocation">
			<checkbox-group @change="checkboxChange">
				<view class="checkboxStyle">
					<checkbox value="" :checked="!isSelectCheckbox" style="transform: scale(0.8)" />
				</view>
				<view class="checkboxStyle">全部</view>
			</checkbox-group>
		</view>
		<view class="pannelContent">
			<scroll-view  scroll-y="true" class="scroll-Y">
				<uni-swipe-action>
				<uni-swipe-action-item :right-options="options1" @click="deleteMember($event,item)" :name="item.id"
					 class="storageItem" v-for="(item, index) in outStorageArr" :key="item.id" v-if="item.isShowScan">
					<view :class="[item.isSelectScan ? 'selectLine': '' , 'touch-list', 'list-touch']"
						class="swipe-action u-border-top u-border-bottom">
						<view class="swipe-action__content">
							<text class="serialNumber">{{ index + 1 }}.</text>
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
					</view>
				</uni-swipe-action-item>
				</uni-swipe-action>
			</scroll-view>
		</view>
		<view class="bottomLocation">
			<view class="scanNum">总行数/已扫描行数：{{ outStorageArr.length }}/{{ alreadyOutStorageArr.length }}</view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" id="moreBtn" @tap="handleMore">更多</view>
				<view class="commonBtn inStorageBtn" @tap="handleOutStorage"
					v-if="outStorageArr.length > 0 && outStorageArr.length == alreadyOutStorageArr.length">出库</view>
				<view class="commonBtn noInStorageBtn" v-else>出库</view>
			</view>
		</view>
		<view class="btnModal" v-show="showModal">
			<image class="modalImage" src="../../static/cutWarehouse/modalImage.png" mode="aspectFit"></image>
			<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
		</view>
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
				console.log(data)
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
				outStorageArr: [],
				alreadyOutStorageArr: [],
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
			}
		},
		methods: {
			// handleScanCodeBox() {
			// 	uni.scanCode({
			// 		onlyFromCamera: true,
			// 		success: res => {
			// 			console.log(res.result)
			// 			//这里即拿到了扫描出的数据
			// 			if (this.sewingTaskRecord) {
			// 				console.log("扫描扫描PCS码")
			// 				// 扫描PCS码
			// 				this.handleScanPCS(res.result)
			// 			} else {
			// 				console.log("扫描扫描缝制任务单号")
			// 				// 扫描缝制任务单号
			// 				this.handleScanTask(res.result)
			// 			}
			// 		},
			// 		fail: err => {
			// 			// 需要注意的是小程序扫码不需要申请相机权限
			// 		}
			// 	});
			// },
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
						// console.log(res.data)
						// this.alreadyOutStorageArr.push({
						// 	id: res.data.id || "",
						// 	productId: res.data.productId || "",
						// 	produceId: res.data.produceId || "",
						// 	subpackageId: res.data.subpackageId || "",
						// 	proNum: res.data.proNum || "",
						// 	colorCode: res.data.colorCode || "",
						// 	colorName: res.data.colorName || "",
						// 	sizeCode: res.data.sizeCode || "",
						// 	sizeName: res.data.sizeName || "",
						// 	packageNum: res.data.packageNum || "",
						// 	inputNumber: res.data.inputNumber || "",
						// 	arrowFlag: true,
						// 	packageState:res.data.packageState||""
						// })
						// this.outStorageArr.forEach(item=>{
						// 	if(item.id)
						// })

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
					this.showModal=false
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
					if (res.code === 0) {
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
			this.handleOutStorage = useDebounce(this.handleOutStorage);
		},
	};
</script>

<style lang="less" scoped>
	.mainContent {
		position: relative;
		background-color: #F3F3F3;
		.location {
			position: relative;
			margin: 20rpx;

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
			margin: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.storageTitle {
				// font-size: 25rpx;
				font-size: 33rpx;
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
			text-align: right;
			margin-right: 20rpx;

			.checkboxStyle {
				display: inline-block;
			}
		}
		.pannelContent {
			height: calc(100vh - 460rpx);
			overflow-y: auto;
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

				.list-touch {
					position: relative;
					width: 740rpx;
					// z-index: 2;
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
					.storageTop{
						display: flex;
						justify-content: space-between;
						font-weight: bold;
						// .storageCode {
						// 	font-weight: bold;
						// }
						.storageUse{
							color: #008000;
						}
						.storageUnUse{
							color: #ffcc00;
						}
						.NoStorageUnUse{
							color: #ff0000;
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
			left: 0;
			bottom: 0;
			padding: 15rpx 30rpx 30rpx;
			z-index: 99;
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
