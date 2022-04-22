<template>
	<view class="mainContent" @click="closeModal">
		<!-- <view class="commonBtn" @tap="handleScanStorage" style="background-color: #fca147;">扫描库位</view> -->
		<!-- <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">扫描PCS码</view> -->
		<view class="location">
			<!-- <input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" :placeholder="storageValue? '请扫描PCS码': '请扫描库位码'" disabled/> -->
			<view class="placeholderInput">{{storageValue? '请扫描PCS码！': '请扫描库位码！'}}</view>
		</view>
		<view class="storageLocation">
			<text>库位：</text>
			<!-- <input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="storageValue" confirm-type="search" placeholder="请扫描库位码" disabled/> -->
			<text class="locationText">{{storageValue}}</text>
		</view>
		<view class="pannelContent">
			<uni-swipe-action>
				<uni-swipe-action-item :right-options="options1" @click="deleteMember($event,item)" @change="swipeChange($event, index)" :name="item.id" class="storageItem" v-for="(item, index) in inStorageArr" :key="item.id">
					<view :class="[index == 0 ? 'selectLine': '' , 'touch-list', 'list-touch']"
						class="swipe-action u-border-top u-border-bottom">
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
						<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="!item.arrowFlag"></image>
						<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-else></image>
					</view>
				 </uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<view class="bottomLocation">
			<view class="scanNum">已扫描行数：{{ inStorageArr.length }}</view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" id="moreBtn" @tap="handleMore">更多</view>
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
			<view style="margin: 0 20rpx 0 90rpx;">{{ showSuccessMessage }}</view>
		</view>
		<view class="errorPopup remindPopup" v-if="showErrorPop">
			<view class="errorImage"></view>
			<view style="margin: 0 20rpx 0 80rpx;">{{ showErrorMessage }}</view>
		</view>
		<scan-code></scan-code>
	</view>
</template>

<script>
	// import { defineComponent, ref, reactive, toRefs } from 'vue';
	import { arrayToHeavy, toasting,useDebounce } from '../../utils/index.js'
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
					try{
						data=JSON.parse(data.code)
						this.handleScanStorage(data.code,data.warehouseFileName)
					}catch(error){
						this.showErrorMessage = '请扫描正确的库位码！'
						this.showErrorPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showErrorPop = false
						}, 2000)
					}finally{
						console.log("解决JSON.parse报错")
					}
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
				beforeTime:0,
				options1: [{
				     text: '删除',
					 style: {
					 	backgroundColor: '#cc3300',
					 }
				}]
			}
		},
		methods:{
			// handleScanCodeBox(){
			// 	uni.scanCode({
			// 		onlyFromCamera: true,
			// 		success: res => {
			// 			// console.log(res.result)
			// 			//这里即拿到了扫描出的数据
			// 			if(this.storageValue) {
			// 				console.log("扫描扫描PCS码")
			// 				// 扫描PCS码
			// 				this.handleScanPCS(res.result)
			// 			}else {
			// 				console.log("扫描扫描库位")
			// 				// 扫描库位
			// 				res=JSON.parse(res.result)
			// 				this.handleScanStorage(res.code,res.warehouseFileName)
			// 			}
			// 		},
			// 		fail: err => {
			// 		    // 需要注意的是小程序扫码不需要申请相机权限
			// 		}
			// 	});
			// },
			
			handleScanStorage(locationCode,warehouseFileName){ // 扫描库位
				Api.outReceiptScanLocation({
					locationCode,// 'A-01'
					warehouseFileName,//库位名
				}).then(res => {
					if (res.code === 0) {
						uni.showToast({
							title: '扫描库位成功！',
							icon: 'none',
							duration: 3000
						})
						this.wareHouseLocation = res.data.warehouseLocationId
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
					warehouseLocationId: this.wareHouseLocation,
					// locationCode:this.storageValue,
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
							this.inStorageArr=this.inStorageArr.concat(res.data.mesPiecesMarketDTOList.map(item=>{return {...item,arrowFlag:false}}))
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
			//滑动箭头变化
			swipeChange(e,index){
						if(e=='right'){
							this.inStorageArr[index].arrowFlag=true
						}else{
							this.inStorageArr[index].arrowFlag=false
						}
					},
			//删除按钮
			deleteMember(e,i) { // 点击删除按钮事件
				if(e.content.text==='删除'){
					this.inStorageArr = this.inStorageArr.filter(item =>item.id !== i.id)
					this.copyInStorageArr=this.copyInStorageArr.filter(item=>item.mesPiecesMarketDTOList[0].id!==i.id)
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
					outProcessList:this.copyInStorageArr,
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
		},
		created(){
			this.handleInStorage = useDebounce(this.handleInStorage);
		},
	};
</script>

<style lang="less" scoped>
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
	                 color: black;
	                 padding-left: 30rpx;
	             }
	        }
	    }
	.mainContent {
		position: relative;
		background-color: #F3F3F3;
		.location {
			position: relative;
			.placeholderInput{
				height: 88rpx;
				padding: 26rpx 474rpx 26rpx 28rpx;
				color: rgba(12,153,242,1);
				font-family: PingFang-SC-Bold;
				font-size: 36rpx;
				line-height: 36rpx;
				background-color: rgba(228,244,255,1);
				font-weight: bold;
			}
		}
		.storageLocation {
			padding:26rpx  482rpx 24rpx 30rpx;
			color: rgba(51,51,51,1);
			font-family: PingFang-SC-Bold;
			font-size: 36rpx;
			line-height: 50rpx;
			font-weight: 500;
			background-color: rgba(255,255,255,1);
			.locationText{
				font-size: 36rpx;
				font-family: Helvetica-Bold;
				color: rgba(42,42,42,1);
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
					width: 740rpx;
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
			// width: 530rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			// margin-left: -265rpx;
			// margin-top: -40rpx;
			transform: translate(-50%,-50%);
			white-space:nowrap;
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
