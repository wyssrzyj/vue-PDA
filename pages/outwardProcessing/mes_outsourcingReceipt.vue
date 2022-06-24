<template>
	<view class="mainContent" @click="closeModal">
		<!-- <view class="commonBtn" @tap="handleScanStorage" style="background-color: #fca147;">扫描库位</view> -->
		<!-- <view class="commonBtn" @tap="handleScanPCS" style="background-color: #4a70f5;">扫描PCS码</view> -->
		<!-- <view class="location"> -->
			<!-- <input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" :placeholder="storageValue? '请扫描PCS码': '请扫描库位码'" disabled  @click="handleScanCodeBox"/> -->
			<view class="scanInput" >{{storageValue? '请扫描PCS码！': '请扫描库位码！'}}</view>
		<!-- </view> -->
		<view class="locationPrompt">
			<text>库位：</text>
			<!-- <input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="storageValue" confirm-type="search" placeholder="请扫描库位码" disabled/> -->
			<text class="locationPromptText">{{storageValue}}</text>
		</view>
		<view class="pannelContent">
			<uni-swipe-action>
				<view class="AllStorage" v-for="(item, index) in inStorageArr" :key="item.id">
					<uni-swipe-action-item :right-options="options1" @click="deleteMember($event,item)" @change="swipeChange($event, index)" :name="item.id"   >
						<view :class="index == 0 ? 'selectLine': ''" class="storageWrap">
							<text class="serialNumber">{{ inStorageArr.length-index }}.</text>
							<view class="storageItem">
								<view class="storageCode">{{ item.proNum }}</view>
								<view class="storageColorCode">
									<text class="label">颜色尺码：</text>
									<text decode="true" space="true" class="value">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeCode }}</text>
								</view>
								<view class="storageContent">
									<view>
										<text class="label">扎号：</text>
										<text class="value">{{ item.packageNum }}</text>
									</view>
									<view class="storageNum">
										<text class="label">数量：</text>
										<text class="value">{{ item.outputNumber }}</text>
									</view>
								</view>
							</view>
							<view class="storageArrow">
								<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="!item.arrowFlag"></image>
								<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-else></image>
							</view>
						</view>
					 </uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</view>
		<u-action-sheet :actions="deletelist" :show="showMore" @select="handleEmpty" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showMore=false"></u-action-sheet>
		<view class="bottomLocation">
			<view class="bottomLocationLeft">
				<view  id="moreBtn" @tap="showMore=true">更多</view>
				<view class="iconfont icon-gengduo"></view>
			</view>
			<view class="bottomLocationRight">
				<view class="scanNum">已扫描行数：{{ inStorageArr.length}}</view>
				<view class="commonBtn inStorageBtn" @tap="handleInStorage" v-if="inStorageArr.length > 0">入库</view>
				<view class="commonBtn noInStorageBtn" v-else>入库</view>
			</view>
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
	import { arrayToHeavy, toasting,useDebounce } from '../../utils/index.js'
	import Api from '../../service/api'
	import scanCode from "../../components/scan/scan.vue"
	import throttle from "../../utils/index"

	export default{
		onLoad() {
			// console.log('onLoad');
		},
		onShow() {
			// console.log('onShow');
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				// console.log(data)
				if(this.storageValue) {
					console.log("扫描PCS码")
					// 扫描PCS码
					this.handleScanPCS(data.code)
				}else {
					console.log("扫描库位")
					// 扫描库位
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
				copyInStorageArr:[],
				nowTime:0,
				beforeTime:0,
				options1: [{
				     text: '删除',
					 style: {
					 	backgroundColor: '#F4333F',
						width:"180rpx",
						fontSize:"32rpx",
						color:'#fff'
					 }
				}],
				deletelist:[{name:'清空',color:'#FC361D'}],
				showMore:false
			}
		},
		methods:{
			// handleScanCodeBox(){
			// 	uni.scanCode({
			// 		onlyFromCamera: true,
			// 		success: res => {
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
			
			handleScanStorage(locationCode,factoryManagerName){ // 扫描库位
				Api.outReceiptScanLocation({
					locationCode,// 'A-01'
					factoryManagerName,//库位名
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

			handleEmpty(e){ // 清空
			if(e.name == '清空'){
				this.inStorageArr = []
				this.copyInStorageArr=[]
				this.showModal = false
				this.storageValue = ''
				}
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
		.pannelContent {
			height: calc(100vh - 308rpx);
			overflow: auto;
			background-color: ;
			.AllStorage{
				margin-top: 20rpx;
			}
			.storageWrap{
				display: flex;
				height: 208rpx;
				padding: 30rpx 0rpx;
				overflow: hidden;
				// margin-top: 20rpx;
				background-color: #FFFFFF;
				position: relative;
			}
			
			.serialNumber {
					width: 98rpx;
					font-weight: bold;
					font-size: 35rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			.storageItem{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				font-family: PingFang-SC-Bold;
				.storageCode{
					font-size: 36rpx;
					color: #333333;
					line-height: 32rpx;
					font-weight: blod;
				}
				.storageContent {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
			}
			.storageArrow{
				width: 154rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.arrowImage{
					width:36rpx;
					height: 32rpx;
				}
			}
			
		}
		.bottomLocation {
			width: 100%;
			background-color: rgba(255,255,255,1);
			border-top: 1rpx solid #D8D8D8;
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 12rpx 30rpx;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #585858;
			.bottomLocationLeft{
				display: flex;
				align-items: center;
				#moreBtn{
					margin-right: 12rpx;
					font-size: 32rpx;
				}
				.icon-gengduo{
					color: #999;
					font-size: 12rpx;
				}
			}
			.bottomLocationRight{
				display: flex;
				align-items: center;
				font-size: 32rpx;
				line-height: 44rpx;
				font-family: PingFangSC-Regular;
				color:#585858;
				letter-spacing: 0;
				.scanNum{
					margin-right: 20rpx;
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
		.commonBtn {
			display: inline-block;
			text-align: center;
			color: #fff;
			padding: 24rpx 68rpx;
			line-height: 32rpx;
			font-size: 32rpx;
			border-radius: 8rpx;
			width: 200rpx;
			height: 80rpx;
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
