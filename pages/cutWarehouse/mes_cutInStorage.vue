<template>
	<view class="mainContent" @click="closeModal">
		<!-- <view class="commonBtn" @tap="handleScanStorage" style="background-color: #fca147;">扫描库位</view> -->
		<!-- <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">扫描PCS码</view> -->
		<view class="location">
			<view class="tip_text"><text>{{storageValue ? '请扫描PCS码!': '请扫描库位码'}}</text></view>
			<!-- <image class="scanCodeBox" src="../../static/cutWarehouse/scanCodeBox.png" mode="aspectFit" @tap="handleScanCodeBox"></image> -->
			<!-- <input class="uni-input scanInput" placeholder-style="font-size: 32rpx" confirm-type="search"   :placeholder="storageValue? '请扫描PCS码': '请扫描库位码'" disabled/> -->
		</view>
		<view class="storageLocation" v-if="storageValue">
			<text class="storageTitle">当前库位：<text style="color: #666666; font-size: 36rpx;">{{storageValue? storageValue: '请扫描库位码'}}</text></text>
			<!-- <input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="storageValue" confirm-type="search" placeholder="请扫描库位码" disabled/> -->
		</view>
		<view class="pannelContent">
			 <uni-swipe-action >
				 <uni-swipe-action-item style="width: 375px;" :right-options="options1" @click="deleteMember($event,item)"  @change="swipeChange($event, index)" :name="item.id" class="storageItem" v-for="(item, index) in inStorageArr" :key="item.id">
				 	<view :class="[index == 0 ? 'selectLine': '' , 'touch-list', 'list-touch']"
				 		class="swipe-action u-border-top u-border-bottom">
				 		<text class="serialNumber">{{ inStorageArr.length-index }}.</text>
				 		<view class="item_content">
				 			<view class="storageCode">{{ item.proNum }}</view>
				 			<view class="colorCode_item">
				 				<text class="label_style">颜色尺码：</text>
				 				<text class="value_style" decode="true" space="true">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeName }}</text>
				 			</view>
				 			<view class="storageContent">
				 				<view>
				 					<text class="label_style">扎号：</text>
				 					<text class="value_style">{{ item.packageNum }}</text>
				 				</view>
				 				<view class="storageNum">
				 					<text class="label_style">数量：</text>
				 					<text class="value_style">{{ item.inputNumber }}</text>
				 				</view>
				 			</view>
				 		</view>
						<view class="image_style">
							<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="!item.arrowFlag"></image>
							<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-else></image>
						</view>
				 	</view>
				 </uni-swipe-action-item>
			 </uni-swipe-action>
		</view>
		<u-action-sheet :actions="deletelist" :show="showModal" @select="handleEmpty" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showModal=false"></u-action-sheet>
		<view class="bottomLocation">
			<view class="btnLocation">
				<!-- <view class="commonBtn moreBtn" >
					<u--text id="more_Btn"  type="info"  @click="handleMore"  text="信息"></u--text>
				</view> -->
				<view class="moreBtn">
					<u--text style="padding-right: 10rpx;"  size="32" text="更多" :color="'#333333'" lineHeight="104" @tap="handleMore"></u--text>
					<view class="iconfont icon-gengduo icon_style"></view>
				</view>
				<!-- <view class="commonBtn moreBtn" id="moreBtn" @tap="handleMore">更多</view> -->
				<view class="scanNum"><text style="padding-right: 20px;">已扫描行数：{{ inStorageArr.length }} </text>
				<u-button class="inStorageBtn" type="primary" :class="!inStorageArr.length > 0 ?'custom-style' : ''" @tap="handleInStorage" :disabled="!inStorageArr.length > 0" text="入库"></u-button></view>
				<!-- <view class="commonBtn inStorageBtn" @tap="handleInStorage" v-if="inStorageArr.length > 0">入库</view> -->
				<!-- <view class="commonBtn noInStorageBtn" v-else>入库</view> -->
			</view>
		</view>
		<!-- <u-popup :show="showModal" @close="showModal = false" :overlayOpacity="0">
			<view class="btnModal-cut">
				<image class="modalImage" src="../../static/cutWarehouse/modalImage.png" mode="aspectFit"></image>
				<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
			</view>
		</u-popup> -->
		<!-- <view class="btnModal" v-if="showModal">
			<image class="modalImage" src="../../static/cutWarehouse/modalImage.png" mode="aspectFit"></image>
			<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
		</view> -->
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
	import { arrayToHeavy, toasting,useDebounce } from '../../utils/index.js'
	import  Api from '../../service/api'
	import scanCode from "../../components/scan/scan.vue"
	
	// import uSwipeAction1 from "@/components/u-swipe-action/u-swipe-action.vue"

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
					// 扫描库位
					console.log('扫描库位码')
					try{
						data=JSON.parse(data.code)
						this.handleScanStorage(data.code,data.factoryManagerName)
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
				deletelist:[{name:'清空',color:'#FC361D'}],
				options1: [{
				     text: '删除',
					 style: {
					 	backgroundColor: '#F4333F',
					 }
				}]
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
			// 				let data=JSON.parse(res.result)
			// 				console.log(data.code,data.warehouseFileName)
			// 				this.handleScanStorage(data.code,data.warehouseFileName)
			// 			}
			// 		},
			// 		fail: err => {
			// 		    // 需要注意的是小程序扫码不需要申请相机权限
			// 		}
			// 	});
			// },
			//滑动箭头变化
			swipeChange(e,index){
					if(e=='right'){
						this.inStorageArr[index].arrowFlag=true
					}else{
						this.inStorageArr[index].arrowFlag=false
					}
			},
			deleteMember(e,i) { // 点击删除按钮事件
				if(e.content.text==='删除'){
					this.inStorageArr = this.inStorageArr.filter(item =>item.id !== i.id)
				}
			},
			handleScanStorage(locationCode,factoryManagerName){ // 扫描库位
				Api.getLocation({
					locationCode,	// 'A-01'
					factoryManagerName
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

				Api.getInfoBySearch({
					pcsNum: pcsNum, // 'PD20211110090285439-0-00000116'
					type: this.typeMode,
					wareHouseLocation: this.wareHouseLocation
				}).then(res => {
					if (res.code === 0) {
						const Find=this.inStorageArr.find(item=>item.id===res.data.subpackageId)
						if(!Find){
							uni.showToast({
									title: '扫描PCS码成功！',
									icon: 'none',
									duration: 3000
								})
								this.inStorageArr.push(
												{
													id: res.data.subpackageId || "",
													productId: res.data.productId || "",
													produceId: res.data.produceId || "",
													subpackageId: res.data.subpackageId || "",
													proNum: res.data.proNum || "",
													colorCode: res.data.colorCode || "",
													colorName: res.data.colorName || "",
													sizeCode: res.data.sizeCode || "",
													sizeName: res.data.sizeCode || "",
													packageNum: res.data.packageNum || "",
													inputNumber: res.data.inputNumber || "",
													arrowFlag: false,
												}
								)
							
								// 数组去重
								this.inStorageArr = arrayToHeavy(this.inStorageArr)
							
								this.inStorageArr = this.inStorageArr.reverse()
							}else {
								this.showErrorMessage = 'PCS码无效！'
								this.showErrorPop = true
								let timer = setTimeout(() => {
									clearTimeout(timer)
									this.showErrorPop = false
								}, 2000)
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

			handleMore(){ // 更多
			console.log(this.showModal,'11111111111111111')
				this.showModal = !this.showModal
				console.log(this.showModal, !this.showModal)
			},

			closeModal(e){//点击页面其他地方关闭清空按钮
			console.log(e,'2222222222222',this.showModal)
				if(e.target.id!="moreBtn" && this.showModal){
					// this.showModal=false
				}
			},

			handleInStorage(){ // 入库
				let listArr = this.inStorageArr.map((item, index) => {
					return {
						index: this.inStorageArr.length - index,
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
						warehouseLocationId: this.wareHouseLocation
					}
				})

				Api.addPiecesMarket({
					list: listArr
				}).then(res => {
					if (res.code === 0) {
						this.inStorageArr = []
						this.storageValue=""
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
			scanCode,
		},
		created(){  //防抖
			this.handleInStorage = useDebounce(this.handleInStorage);
		},
	}
</script>

<style lang="less" scoped>
.content-box {
	flex: 1;
	height: 44px;
	line-height: 44px;
	padding: 0 15px;
	position: relative;
	background-color: #fff;
	border: 1px solid #f5f5f5;
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
	                 color: black;
	                 padding-left: 30rpx;
	             }
	        }
	    }
	.mainContent {
		position: relative;
		background-color: #F3F3F3;
		height: 100%;
		width: 100%;
		.location {
			position: relative;
			// margin: 20rpx;
			.scanInput {
				height: 80rpx;
				border: 1px solid #767676;
				background-color: #FFF;
				padding: 0 10rpx;
				text-align: center;
			}
			.tip_text {
				background-color: #E4F4FF;
				width: 100%;
				font-family: PingFang-SC-Bold;
				font-size: 18px;
				color: #0C99F2;
				padding: 13px 14px;
				font-weight: 700;
			}
		}
		.storageLocation {
			width: 100%;
			display: flex;
			font-size: 36rpx;
			justify-content: flex-start;
			padding: 26rpx 30rpx;
			background-color: #ffffff;
			align-items: center;
			.storageTitle {
				color: #333333;
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
			.selectLine {
				width: 375px;
				background-color: #fffFFF;
				 
			}
			.storageItem {
				margin: 20rpx 0;
				width: 375px;
				overflow: hidden;
				.touch-list{
					width: 375px;
					padding: 30rpx 26rpx;
					overflow: hidden;
				}
				.list-touch{
					// position: relative;
					width: 100%;
					z-index: 5;
					font-size: 32rpx;
					transition: left 0.2s ease-in-out;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.serialNumber {
						// left: 20rpx;
						// top: 55rpx;
						padding-right: 40rpx;
						font-weight: bold;
						// font-size: 35rpx;
					}
					.item_content {
						width: 70%;
						.label_style {
							color:  #333333;
							font-weight: 700;
						}
						.value_style {
							color:  #666666;
						}
						.storageCode {
							font-weight: bold;
							padding-bottom: 16rpx;
						}
						.colorCode_item {
							padding-bottom: 8rpx;
						}
						.storageContent {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							
						}
					}
					.image_style {
						width: 30%;
						display: flex;
						justify-content: flex-end;
						.arrowImage {
							// position: absolute;
							// right: 55rpx;
							// top: 55rpx;
							width: 44rpx;
							height: 46rpx;
						}
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
			height: 104rpx;
			background-color: #fafafa;
			border-top: 1rpx solid #dcdcdc;
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 0 30rpx;
			
			.scanNum {
				// height: 75rpx;
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
					// line-height: 52px;
					// background-color: #4a70f5;
					// cursor: pointer;
				}
				.custom-style {
					color: #999999;
					background-color: #E0E0E0;
					border-color: #E0E0E0;
				}
	
			}
		}
		.btnModal-cut {
			position: absolute;
			left: 30rpx;
			bottom: 37px;
			z-index: 90;
			.modalImage {
				width: 300rpx;
				height: 166rpx;
				// background-color: url('../../static/cutWarehouse/chuku.png')
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
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			position: absolute;
			left: 50%;
			top: 50%;
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
