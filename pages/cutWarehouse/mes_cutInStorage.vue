<template>
	<view class="mainContent" @click="closeModal">
		<view class="location">
			<view class="tip_text"><text>{{storageValue ? '请扫描扎包条码!': '请扫描库位码'}}</text></view>
		</view>
		<view class="storageLocation">
			<text class="storageTitle">当前库位：<text style="color: #666666; font-size: 54rpx;">{{storageValue}}</text></text>
		</view>
		<view class="pannelContent" >
			 <uni-swipe-action>
				 <uni-swipe-action-item style="width: 750rpx;border: none;" :right-options="options1" @click="deleteMember($event,item)"  @change="swipeChange($event, index)" :name="item.id" class="storageItem" v-for="(item, index) in inStorageArr" :key="item.id">
				 	<view :class="[index == 0 ? 'selectLine-in': '' , 'touch-list', 'list-touch']"
				 		class="swipe-action u-border-top u-border-bottom">
				 		<text class="serialNumber">{{ inStorageArr.length-index }}.</text>
				 		<view class="item_content">
				 			<view class="storageCode">{{ item.proNum }}</view>
				 			<view class="colorCode_item">
				 				<text :class="[index == 0 ? 'first-item' :'label_style']">颜色尺码：</text>
				 				<text :class="[index == 0 ? '.first-item-value' :'value_style']" decode="true" space="true">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeName }}</text>
				 			</view>
				 			<view class="storageContent">
				 				<view>
				 					<text :class="[index == 0 ? 'first-item' :'label_style']">扎号：</text>
				 					<text :class="[index == 0 ? '.first-item-value' :'value_style']">{{ item.packageNum }}</text>
				 				</view>
				 				<view class="storageNum">
				 					<text :class="[index == 0 ? 'first-item' :'label_style']">数量：</text>
				 					<text :class="[index == 0 ? '.first-item-value' :'value_style']">{{ item.inputNumber }}</text>
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
				<view class="moreBtn">
					<u--text style="padding-right: 15rpx;"  size="48" text="更多" :color="'#333333'" lineHeight="156" @tap="handleMore"></u--text>
					<view class="iconfont icon-gengduo icon_style"></view>
				</view>
				<view class="scanNum">
					<text style="padding-right: 30px;">已扫描行数：{{ inStorageArr.length }} </text>
					<u-button class="inStorageBtn" type="primary" :class="!inStorageArr.length > 0 ?'custom-style' : ''" @tap="handleInStorage" :disabled="!inStorageArr.length > 0" text="入库"></u-button>
				</view>
			</view>
		</view>
		<view class="successPopup remindPopup" v-if="showSuccessPop">
			<view class="successImage"></view>
			<view style="margin: 0 30rpx 0 135rpx;">{{ showSuccessMessage }}</view>
		</view>
		<view class="errorPopup remindPopup" v-if="showErrorPop">
			<view class="errorImage"></view>
			<view style="margin: 0 30rpx 0 120rpx;">{{ showErrorMessage }}</view>
		</view>
		<scan-code></scan-code>
	</view>
</template>

<script>
	import { arrayToHeavy, toasting,useDebounce } from '../../utils/index.js'
	import  Api from '../../service/api'
	import scanCode from "../../components/scan/scan.vue"
	const longyoungKeyEventListen = uni.requireNativePlugin('longyoung-KeyEventListen')
	var timer;
	var preKeyCode = '';
	var allKeyCodeTemp = '';
	var KEY_MAP = {
		"KEYCODE_GRAVE": {
			"normalChar": "`",
			"shiftChar": "~"
		},
		"KEYCODE_0": {
			"normalChar": "0",
			"shiftChar": ")"
		},
		"KEYCODE_1": {
			"normalChar": "1",
			"shiftChar": "!"
		},
		"KEYCODE_2": {
			"normalChar": "2",
			"shiftChar": "@"
		},
		"KEYCODE_3": {
			"normalChar": "3",
			"shiftChar": "#"
		},
		"KEYCODE_4": {
			"normalChar": "4",
			"shiftChar": "$"
		},
		"KEYCODE_5": {
			"normalChar": "5",
			"shiftChar": "%"
		},
		"KEYCODE_6": {
			"normalChar": "6",
			"shiftChar": "^"
		},
		"KEYCODE_7": {
			"normalChar": "7",
			"shiftChar": "&"
		},
		"KEYCODE_8": {
			"normalChar": "8",
			"shiftChar": "*"
		},
		"KEYCODE_9": {
			"normalChar": "9",
			"shiftChar": "("
		},
		"KEYCODE_MINUS": {
			"normalChar": "-",
			"shiftChar": "_"
		},
		"KEYCODE_EQUALS": {
			"normalChar": "=",
			"shiftChar": "+"
		},
		"KEYCODE_LEFT_BRACKET": {
			"normalChar": "[",
			"shiftChar": "{"
		},
		"KEYCODE_RIGHT_BRACKET": {
			"normalChar": "]",
			"shiftChar": "}"
		},
		"KEYCODE_BACKSLASH": {
			"normalChar": "\\",
			"shiftChar": "|"
		},
		"KEYCODE_SEMICOLON": {
			"normalChar": ";",
			"shiftChar": ":"
		},
		"KEYCODE_APOSTROPHE": {
			"normalChar": "'",
			"shiftChar": "\""
		},
		"KEYCODE_COMMA": {
			"normalChar": ",",
			"shiftChar": "<"
		},
		"KEYCODE_PERIOD": {
			"normalChar": ".",
			"shiftChar": ">"
		},
		"KEYCODE_SLASH": {
			"normalChar": "/",
			"shiftChar": "?"
		},
		"KEYCODE_A": {
			"normalChar": "a",
			"shiftChar": "A"
		},
		"KEYCODE_B": {
			"normalChar": "b",
			"shiftChar": "B"
		},
		"KEYCODE_C": {
			"normalChar": "c",
			"shiftChar": "C"
		},
		"KEYCODE_D": {
			"normalChar": "d",
			"shiftChar": "D"
		},
		"KEYCODE_E": {
			"normalChar": "e",
			"shiftChar": "E"
		},
		"KEYCODE_F": {
			"normalChar": "f",
			"shiftChar": "F"
		},
		"KEYCODE_G": {
			"normalChar": "g",
			"shiftChar": "G"
		},
		"KEYCODE_H": {
			"normalChar": "h",
			"shiftChar": "H"
		},
		"KEYCODE_I": {
			"normalChar": "i",
			"shiftChar": "I"
		},
		"KEYCODE_J": {
			"normalChar": "j",
			"shiftChar": "J"
		},
		"KEYCODE_K": {
			"normalChar": "k",
			"shiftChar": "K"
		},
		"KEYCODE_L": {
			"normalChar": "l",
			"shiftChar": "L"
		},
		"KEYCODE_M": {
			"normalChar": "m",
			"shiftChar": "M"
		},
		"KEYCODE_N": {
			"normalChar": "n",
			"shiftChar": "N"
		},
		"KEYCODE_O": {
			"normalChar": "o",
			"shiftChar": "O"
		},
		"KEYCODE_P": {
			"normalChar": "p",
			"shiftChar": "P"
		},
		"KEYCODE_Q": {
			"normalChar": "q",
			"shiftChar": "Q"
		},
		"KEYCODE_R": {
			"normalChar": "r",
			"shiftChar": "R"
		},
		"KEYCODE_S": {
			"normalChar": "s",
			"shiftChar": "S"
		},
		"KEYCODE_T": {
			"normalChar": "t",
			"shiftChar": "T"
		},
		"KEYCODE_U": {
			"normalChar": "u",
			"shiftChar": "U"
		},
		"KEYCODE_V": {
			"normalChar": "v",
			"shiftChar": "V"
		},
		"KEYCODE_W": {
			"normalChar": "w",
			"shiftChar": "W"
		},
		"KEYCODE_X": {
			"normalChar": "x",
			"shiftChar": "X"
		},
		"KEYCODE_Y": {
			"normalChar": "y",
			"shiftChar": "Y"
		},
		"KEYCODE_Z": {
			"normalChar": "z",
			"shiftChar": "Z"
		}
	};
	export default{
		onLoad() {
			// console.log('onLoad');
			this.setOnKeyEventListener();
		},
		onUnload(){
			this.disableAllOnKeyEventListener(); //取消所有监听
		},
		onShow() {
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				console.log(data)
				if(this.storageValue) {
					// console.log("扫描扎包条码")
					// 扫描PCS码
					this.handleScanPCS(data.code)
				}else {
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
				inStorageArr: [
				],
				startX: '',
				deletelist:[{name:'清空',color:'#FC361D'}],
				options1: [{
				     text: '删除',
					 style: {
					 	backgroundColor: '#F4333F',
					 }
				}],
				tag: "1", //不必理会，固定 1 就好,
				obj:{},
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
								// 扫描PCS码
								this.handleScanPCS(that.resultStrFinal)
							}else {
								// 扫描库位
								try{
									this.obj=JSON.parse(that.resultStrFinal)
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
			deleteMember(e,i) { // 点击删除按钮事件
				if(e.content.text==='删除'){
					this.inStorageArr = this.inStorageArr.filter(item =>item.id !== i.id)
				}
			},
			handleScanStorage(locationCode){ // 扫描库位
				Api.getLocation({
					locationCode,	// 'A-01'
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
					pcsNum: pcsNum, // 'PD20211110090285439-0-00000116'
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
										arrowFlag: false,
									}
								)
							
								// 数组去重
								this.inStorageArr = arrayToHeavy(this.inStorageArr)
							
								this.inStorageArr = this.inStorageArr.reverse()
							}else {
								this.showErrorMessage = '扎包条码无效！'
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
				this.showModal = !this.showModal
			},

			closeModal(e){//点击页面其他地方关闭清空按钮
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
	height: 66px;
	line-height: 66px;
	padding: 0 22.5px;
	position: relative;
	background-color: #fff;
	border: 1px solid #f5f5f5;
}
.u-border-bottom {
	border: none !important;
}
	.u-page {
	        padding: 0;
	    }
	
	    .u-demo-block__title {
	        padding: 15px 0 3px 22.5px;
	    }
	
	    .swipe-action {
	        &__content {
	             padding: 37.5rpx 0;
	    
	            &__text {
	                 font-size: 22.5px;
	                 color: black;
	                 padding-left: 45rpx;
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
			.tip_text {
				background-color: #E4F4FF;
				width: 100%;
				font-family: PingFang-SC-Bold;
				font-size: 27px;
				color: #0C99F2;
				padding: 21px 23px;
				font-weight: 700;
			}
		}
		.storageLocation {
			width: 100%;
			display: flex;
			font-size: 54rpx;
			justify-content: flex-start;
			padding: 39rpx 45rpx;
			background-color: #ffffff;
			align-items: center;
			.storageTitle {
				color: #333333;
				font-weight: bold;
			}
		}
		.pannelContent {
			height: calc(100vh - 525rpx);
			overflow: auto;
			.selectLine-in {
				width: 750rpx;
				background-color: #E4F4FF !important;
				color: #0C99F2;
			}
			.storageItem {
				margin: 30rpx 0;
				width: 750rpx;
				overflow: hidden;
				.touch-list{
					width: 750rpx;
					padding: 45rpx 39rpx;
					overflow: hidden;
					background-color: #ffffff;
				}
				.list-touch{
					width: 100%;
					z-index: 5;
					font-size: 48rpx;
					transition: left 0.2s ease-in-out;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.serialNumber {
						padding-right: 60rpx;
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
							padding-bottom: 24rpx;
						}
						.colorCode_item {
							padding-bottom: 12rpx;
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
							width: 66rpx;
							height: 69rpx;
						}
					}
				}
				.list-delete{
					right: 0;
					float: left;
					width: 150rpx;
					height: 230rpx;
					line-height: 230rpx;
					padding: 8rpx 24rpx;
					background-color: #EA5863;
					border-radius: 0 30rpx 30rpx 0;
					color: #fff;
					font-size: 52.5rpx;
					font-weight: lighter;
					text-align: center;
				}
			}
		}
		.bottomLocation {
			width: 100%;
			height: 156rpx;
			background-color: #fafafa;
			border-top: 1rpx solid #dcdcdc;
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 0 45rpx;
			
			.scanNum {
				line-height: 156rpx;
				text-align: center;
				color: #585858;
				font-size: 48rpx;
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
						font-size: 30rpx;
						color: #999999;
						
					}
				}
				.inStorageBtn {
					width: 300rpx;
					height: 120rpx;
					margin: 0;
					font-size: 96rpx;
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
			left: 45rpx;
			bottom: 55px;
			z-index: 90;
			.modalImage {
				width: 450rpx;
				height: 249rpx;
			}
		}
		.commonBtn {
			display: inline-block;
			text-align: center;
			color: #fff;
			padding: 30rpx 82.5rpx;
			border-radius: 22.5rpx;
		}
		.emptyBtn {
			background-color: #FC361D;
			position: absolute;
			left: 97.5rpx;
			top: 52.5rpx
		}
		.remindPopup {
			color: #666;
			font-size: 45rpx;
			font-weight: bold;
			border-radius: 15rpx;
			height: 120rpx;
			text-align: center;
			line-height: 120rpx;
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
				width: 75rpx;
				height: 75rpx;
				position: absolute;
				left: 30rpx;
				top: 15rpx;
			}
		}
		.errorPopup {
			background-color: #FFF2F1;
			border: 1px solid #FDA4A0;
			.errorImage {
				display: inline-block;
				background: url('../../static/cutWarehouse/error.png') no-repeat;
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				left: 30rpx;
				top: 30rpx;
			}
		}
	}
</style>
