<template>
	<view class="mainContent" @click="closeModal">
		<view class="location">
			<view class="tip_text"><text>{{storageValue ? '请扫描扎包条码!': '请扫描库位码'}}</text></view>
		</view>
		<view class="storageLocation">
			<text class="storageTitle">当前库位：<text style="color: #666666; font-size: 36rpx;">{{storageValue}}</text></text>
		</view>
		<view class="pannelContent">
			<uni-swipe-action>
				 <uni-swipe-action-item :right-options="options1" @click="deleteMember($event,item)" @change="swipeChange($event, index)" :name="item.id" class="storageItem" v-for="(item, index) in inStorageArr" :key="item.id">
					<view :class="[index == 0 ? 'selectLine': '' , 'touch-list', 'list-touch']"
						class="swipe-action u-border-top u-border-bottom">
						<view :class="[index == 0 ? 'selectLine': '' , 'touch-list', 'list-touch']"
							class="swipe-action u-border-top u-border-bottom">
							<text class="serialNumber">{{ inStorageArr.length-index }}.</text>
							<view class="item_content">
								<view class="storageCode">{{ item.proNum }}</view>
								<view class="colorCode_item">
									<text :class="[index == 0 ? 'first-item' :'label_style']">颜色尺码：</text>
									<text :class="[index == 0 ? 'first-item-value' :'value_style']" decode="true" space="true">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeName }}</text>
								</view>
								<view class="storageContent">
									<view>
										<text :class="[index == 0 ? 'first-item' :'label_style']">扎号：</text>
										<text :class="[index == 0 ? 'first-item-value' :'value_style']">{{ item.packageNum }}</text>
									</view>
									<view class="storageNum">
										<text :class="[index == 0 ? 'first-item' :'label_style']">数量：</text>
										<text :class="[index == 0 ? 'first-item-value' :'value_style']">{{ item.inputNumber }}</text>
									</view>
								</view>
							</view>
							<view class="image_style">
								<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="!item.arrowFlag"></image>
								<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-else></image>
							</view>
						</view>
					</view>
				 </uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<u-action-sheet :actions="deletelist" :show="showModal" @select="handleEmpty" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showModal=false"></u-action-sheet>
		<view class="bottomLocation">
			<view class="btnLocation">
				<view class="moreBtn">
					<u--text style="padding-right: 10rpx;"  size="32" text="更多" :color="'#333333'" lineHeight="104" @tap="handleMore"></u--text>
					<view class="iconfont icon-gengduo icon_style"></view>
				</view>
				<view class="scanNum">
					<text style="padding-right: 20px;">已扫描行数：{{ inStorageArr.length }}</text>
					<!-- <u-button class="inStorageBtn" type="primary" :class="!inStorageArr.length > 0 ?'custom-style' : ''" @tap="handleRepealInStorage" :disabled="!inStorageArr.length > 0" text="撤销入库"></u-button> -->
					<view class="inStorageBtn btnActive" @click="handleRepealInStorage" v-if="inStorageArr.length > 0">撤销入库</view>
					<view class="inStorageBtn btnDisable" v-else >撤销入库</view>
				</view>
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
		<view class="reasonMask" v-if="showReasonMask">
			<view class="reasonDialog">
				<view class="reasonTitle">原因记录</view>
				<view class="reasonContent">
					<view class="storage">
						<view class="storage-item">
							<text class="storage-item-left"><text style="color:red">*</text>撤销入库原因</text>
							<view class="storage-item-right" @click="show = true">
								<text class="info">{{reaplReason || '请选择' }}</text>
								<text class="iconfont icon-youjiantou"></text>
							</view>
						</view>
						<view class="storage-item">
							<text class="storage-item-left">操作人</text>
							<view class="storage-item-right" >
								<text class="info">{{ username }}</text>
							</view>
						</view>
						<view class="storage-item lastItem">
							<text class="storage-item-left">操作时间</text>
							<view class="storage-item-right">
								<text class="info">{{ date }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="btnBottomWrap">
					<view class="cancelBtn" @tap="handleCancel">取消</view>
					<view class="confirmBtn" @tap="handleConfirm">确定</view>
				</view>
			</view>
		</view>
		<scan-code></scan-code>
		<u-picker :show="show" :columns="[selectArr]" @confirm="handlePickerConfirm" @cancel="handleCancelPick" itemHeight="135"></u-picker>
	</view>
</template>

<script>
	import { arrayToHeavy, toasting,useDebounce } from '../../utils/index.js'
	import Api from '../../service/api'
	import scanCode from "../../components/scan/scan.vue"
	import {KEY_MAP} from "../../constant/index.js"
	const longyoungKeyEventListen = uni.requireNativePlugin('longyoung-KeyEventListen')
	var timer;
	var preKeyCode = '';
	var allKeyCodeTemp = '';
	export default{
		// name: 'repealCutInStorage',
		onLoad() {
			// console.log('onLoad');
			this.setOnKeyEventListener();
		},
		onUnload(){
			this.disableAllOnKeyEventListener(); //取消所有监听
		},
		onShow() {
			// console.log('onShow');
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				console.log(data)
				if(this.storageValue) {
					console.log("扫描PCS码")
					// 扫描PCS码
					this.handleScanPCS(decodeURI(data.code))
				}else {
					console.log("扫描库位")
					// 扫描库位
					try{
						data=JSON.parse(decodeURI(data.code))
						this.handleScanStorage(data.code)
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
				show: false,
				showModal: false,
				showSuccessPop: false,
				showErrorPop: false,
				showReasonMask: false,
				showSuccessMessage: '',
				showErrorMessage: '',
				storageValue: '',
				wareHouseLocation: '',
				typeMode: '2',
				inStorageArr: [
				],
				startX: '',
				// selectIndex: 0,
				selectArr: [],
				username: '',
				deletelist:[{name:'清空',color:'#FC361D'}],
				date: '',
				options1: [{
				     text: '删除',
					 style: {
					 	backgroundColor: '#cc3300',
					 }
				}],
				reaplReason:"",
				tag: "1", //不必理会，固定 1 就好,
				obj:{}
			}
		},
		methods:{
			setOnKeyEventListener() {
				let that = this;
				// longyoungKeyEventListen = uni.requireNativePlugin('longyoung-KeyEventListen');//引用插件
				//设置监听，可设置多个，回调按 tag 区分哪个监听返回。
				longyoungKeyEventListen.setOnKeyEventListenerLy({
					tag: that.tag //不必理会，固定 1 就好
				}, result => {
					if (!result.keyCode) {
						that.resultStr += '\n' + JSON.stringify(result) + '\n';
					}
					if (result && result.return_code == 'SUCCESS') {
						if (result.return_type == 'dataBack') { //return_type=dataBack是返回数据标识，返回的数据在此获取
			
							//页面只显示1和a，供查看数据结构
							if (result.keyCode == 'KEYCODE_1' || result.keyCode == 'KEYCODE_A') {
								that.resultStr += '\n' + JSON.stringify(result) + '\n';
							}
							that.handleData(result);
						}
					}
				});
			},
			handleData(result) {
				let that = this;
				if (result.return_type == 'dataBack') {
					if (result.action == 'ACTION_UP') { //只取弹起事件
						let keyCode = result.keyCode;
						if (keyCode == 'KEYCODE_ENTER') { //扫码结束
							that.resultStrFinal = allKeyCodeTemp; //最终拼接的字符串赋值
							allKeyCodeTemp = '';
							preKeyCode = '';
							if(this.storageValue) {
								console.log("扫描PCS码")
								// 扫描PCS码
								this.handleScanPCS(decodeURI(that.resultStrFinal))
							}else {
								console.log("扫描库位")
								// 扫描库位
								try{
									this.obj=JSON.parse(decodeURI(that.resultStrFinal))
									// this.handleScanStorage(this.obj.code,this.obj.factoryManagerName)
									this.handleScanStorage(this.obj.code)
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
						} else if (keyCode == 'KEYCODE_SHIFT_LEFT' || keyCode == 'KEYCODE_SHIFT_RIGHT') { //转换键
							preKeyCode = 'KEYCODE_SHIFT_RIGHT';
						} else {
							if (preKeyCode == 'KEYCODE_SHIFT_RIGHT') { //转换键，拿大写
								if (keyCode && KEY_MAP[keyCode]) {
									allKeyCodeTemp += KEY_MAP[keyCode].shiftChar;
								}
							} else {
								if (keyCode && KEY_MAP[keyCode]) {
									allKeyCodeTemp += KEY_MAP[keyCode].normalChar;
								}
							}
							preKeyCode = '';
						}
			
					}
				}
			},
			disableAllOnKeyEventListener() {
				let that = this;
				//取消所有监听
				longyoungKeyEventListen.disableAllOnKeyEventListenerLy({}, result => {
					that.resultStr += '\n' + JSON.stringify(result) + '\n';
					if (result && result.return_code == 'SUCCESS') {
						console.log("取消所有监听成功")
					}
				});
			},
			//滑动箭头变化
			swipeChange(e,index){
					if(e=='right'){
						this.inStorageArr[index].arrowFlag=true
					}else{
						this.inStorageArr[index].arrowFlag=false
					}
			},
			handleScanStorage(locationCode){ // 扫描库位
				Api.getLocation({
					locationCode,// 'A-02'
					// factoryManagerName
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
					pcsNum: pcsNum, // 'PD20211118073139826-0-00153638'
					type: this.typeMode,
					wareHouseLocation: this.wareHouseLocation
				}).then(res => {
					if (res.code === 0) {
						const Find=this.inStorageArr.find(item=>item.id===res.data.subpackageId)
						if(!Find){
							uni.showToast({
								title: '扫描扎包条码成功！',
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
												arrowFlag: false
											}
							)
							// 数组去重
							this.inStorageArr = arrayToHeavy(this.inStorageArr)
							
							this.inStorageArr = this.inStorageArr.reverse()
						}else{
							this.showErrorMessage = '扎包条码无效！'
							this.showErrorPop = true
							let timer = setTimeout(() => {
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
			deleteMember(e,i) { // 点击删除按钮事件
				if(e.content.text==='删除'){
					this.inStorageArr = this.inStorageArr.filter(item =>item.id !== i.id)
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

			handleRepealInStorage(){ // 撤销入库
				// 显示下拉弹框
				this.showReasonMask = true
			},

			handleEmpty(){ // 清空
				this.inStorageArr = []
				this.showModal = false
				this.storageValue = ''
			},
			handleCancelPick(){
				this.show=false
			},

			handlePickerConfirm(e){
				this.reaplReason=e.value[0]
				this.show=false
			},
			handleCancel(){
				// 隐藏下拉弹框
				this.showReasonMask = false
			},

			handleConfirm(){  //确认撤销出库
				if(!this.reaplReason){
					this.showErrorMessage = '请选择撤销入库原因！'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
					return;
				}
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
						storageStatus: 2,
						warehouseLocationId: this.wareHouseLocation
					}
				})

				Api.addPiecesMarket({
					rollReason: String(this.selectIndex+1),
					list: listArr
				}).then(res => {
					if (res.code === 0) {
						this.inStorageArr = []
						this.storageValue=""
						// 隐藏下拉弹框
						this.showReasonMask = false
						this.showSuccessMessage = '撤销入库成功！'
						this.showSuccessPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showSuccessPop = false
						}, 2000)
					}
				})
				this.show=false
			}
		},
		mounted(){
			Api.getReason({

			}).then(res => {
				if (res.code === 0) {
					// 下拉选择
					this.selectArr = res.data.dictList.map(item => {
						return item.dictLabel
					})
					// 操作人
					this.username = res.data.username
					// 操作时间
					this.date = res.data.date
				}
			})
		},
		components: {
			scanCode
		},
		created(){
			this.handleRepealInStorage = useDebounce(this.handleRepealInStorage);
		},
	};
</script>

<style lang="less" scoped>
	/deep/.u-picker__view__column__item{
		font-family: PingFangSC-Regular !important;
		font-size: 22.5px !important;
		color: #666666 !important;
		text-align: center !important;
		font-weight: normal !important;
	}
	/deep/.u-toolbar{
		border-bottom: 1px solid #ccc;
	}
	/deep/ .u-toolbar__wrapper__confirm{
		font-size: 36rpx;
	}
	/deep/ .u-toolbar__wrapper__cancel{
		font-size: 36rpx;
	}
	/deep/ .uni-picker-view-wrapper{
		font-size: 36rpx;
	}
	.mainContent {
		position: relative;
		background-color: #F3F3F3;
		.u-border-bottom {
			border: none !important;
		}
		.location {
			.tip_text {
				background-color: #E4F4FF;
				width: 100%;
				font-family: PingFang-SC-Bold;
				font-size: 36rpx;
				color: #0C99F2;
				padding: 26rpx 28rpx;
				font-weight: 700;
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
				margin: 20rpx 0;
				width: 750rpx;
				height: 208rpx;
				overflow: hidden;
				.selectLine {
					background-color: #E4F4FF !important;
					color: #0C99F2;
				}
				.touch-list{
					width: 750rpx;
					padding: 30rpx 26rpx;
					height: 208rpx;
					overflow: hidden;
				}
				.list-touch{
					width: 100%;
					height: 208rpx;
					z-index: 5;
					font-size: 32rpx;
					transition: left 0.2s ease-in-out;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					
					.serialNumber {
						padding-right: 40rpx;
						font-weight: bold;
					}
					.item_content {
						width: 70%;
						.label_style {
							color:  #333333;
							font-weight: 700;
						}
						.first-item {
							font-weight: 700;
							color: #0C99F2;
						}
						.first-item-value {
							font-weight: 400;
							color: #0C99F2;
						}
						.value_style {
							font-weight: 400;
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
					background-color: #F4333F;
					// border-radius: 0 20rpx 20rpx 0;
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
					display: inline-block;
					text-align: center;
					color: #fff;
					padding: 24rpx 32rpx;
					line-height: 32rpx;
					font-size: 32rpx;
					border-radius: 8rpx;
					width: 200rpx;
					height: 80rpx;
				}
				.btnActive {
					background-color: #4a70f5;
					cursor: pointer;
				}
				.btnDisable {
					background-color: #cccccc;
					cursor: not-allowed;
				}
				.custom-style {
					color: #999999;
					background-color: #E0E0E0;
					border-color: #E0E0E0;
				}
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
			padding: 14rpx 74rpx;
			font-size: 36rpx;
			background-color: #fff;
			border: 1rpx solid #0C99F2;
			color: #0C99F2;
			border-radius: 40rpx;
			// margin: 40rpx 20rpx 40rpx 30rpx;
			cursor: pointer;
		}
		.confirmBtn {
			display: inline-block;
			text-align: center;
			padding: 14rpx 74rpx;
			font-size: 36rpx;
			background-color: #0C99F2;
			border: 1rpx solid #0C99F2;
			color: #fff;
			border-radius: 40rpx;
			// margin: 40rpx 30rpx 40rpx 20rpx;
			cursor: pointer;
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
			// margin-left: -250rpx;
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
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				left: 20rpx;
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
				left: 20rpx;
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
				width: 600rpx;
				height: 560rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				margin-left: -300rpx;
				margin-top: -300rpx;
				background-color: #fff;
				// padding: 30rpx 40rpx;
				border-radius: 16rpx;
				text-align: left;
				color: #666;
				font-size: 34rpx;
				.reasonTitle {
					font-size: 32rpx;
					font-weight: bold;
					text-align: center;
					background-color: #E4F4FF;
					border-radius: 16rpx;
					padding: 28rpx 0;
				}
				.reasonContent {
					padding: 0 30rpx;
					.reason_content {
						padding: 24rpx 0;
						
						border-bottom: 1px #EAEAEA solid;
					}
					.lastItem{border-bottom: 1px solid #EAEAEA;;}
					.reasonInside {
						// margin: 20rpx 0;
						.reasonText {
							display: inline-block;
							font-size: 32rpx;
							font-weight: bold;
						}
						.reasonSelect {
							position: relative;
							display: inline-block;
							background-color: #fff;
							width: 250rpx;
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
			.btnBottomWrap{
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				padding-top: 40rpx;
			}
			}
		}
	}
</style>
