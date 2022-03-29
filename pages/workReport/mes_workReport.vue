<template>
	<view class="mainContent" @tap="handleClick">
		<view class="borderBottom">
			<view class="location">
				<input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" placeholder="请扫描PCS码" disabled/>
			</view>
			<view class="storageLocation">
				<text class="storageTitle">报工工段：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="productNum" confirm-type="search" @click="show = true" disabled/>
				<u-picker :show="show" :columns="columns" @confirm="handleConfirm" @cancel="handleCancel"></u-picker>
			</view>
			<view class="storageLocation">
				<text class="storageTitle">报工工序：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="supplierName" confirm-type="search" @click="showMultiple" disabled/>
			</view>
			<view class="storageLocation">
				<text class="storageTitle">当前员工：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="employeeName" confirm-type="search" disabled/>
			</view>
		</view>
		<view class="pannelContent">
			<view
				class="storageItem"
				v-for="(item,index) in outStorageArr"
				:key="index"
			>
				<view
					:class="[index == 0 ? 'selectLine': '' , 'touch-list', 'list-touch']"
				>
					<text class="serialNumber">{{ index + 1 }}.</text>
					<view>
						<view class="storageCode">{{ item.packageCode }}</view>
						<view>
							<text>颜色尺码：</text>
							<text decode="true" space="true">{{ item.colorCode }}&emsp;{{ item.colorName }}&emsp;{{ item.sizeCode }}</text>
						</view>
						<view class="storageContent">
							<view>
								<text>扎号：</text>
								<text>{{ item.packageNum }}</text>
							</view>
							<view style="display: flex;">
								<text>数量：</text>
								<!-- <text>{{ item.count }}</text> -->
								<input class="itemCount" placeholder-style="font-size: 17rpx" v-model="item.count" confirm-type="search"/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottomLocation">
			<view class="scanNum"><view><text>已扫描行数：</text><text class="scannedAllNum">{{outStorageArr.length}}</text></view></view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" @tap="handleMore" id="moreBtn">更多</view>
				<view class="commonBtn inStorageBtn" @tap="handleOutStorage" v-if="outStorageArr.length > 0 ">报工</view>
				<view class="commonBtn noInStorageBtn" v-else>报工</view>
			</view>
		</view>
		<view class="btnModal" v-if="showModal" id="btnModal">
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
		<select-code-multiple :visible="showM" :checkedValue="checkedList" :optionList="coutryList"
			@confirm="getCodeMu"></select-code-multiple>
		<scan-code></scan-code>
	</view>
</template>

<script>
	import {formateDate,findKey,useDebounce} from "@/utils/index.js"
	import Api from '../../service/api'
	import scanCode from "@/components/scan/scan.vue"
	import selectCodeMultiple from '@/components/mulSelection/mulSelection.vue'
	
	export default{
		components: {
			selectCodeMultiple,
			scanCode
		},
		// name: 'cutOutStorage',
		onLoad() {
		},
		onShow() {
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器
			uni.$on('scancodedate', (data) => {
				// if(this.sewingTaskRecord) {
				// 	console.log("扫描PCS码")
				// 扫描PCS码
				this.handleScanPCS(data.code)
				// }else {
				// 	console.log("扫描缝制任务单号")
				// 	// 扫描缝制任务单号
				// 	this.handleScanTask(data.code)
				// }
			})
		},
		mounted(){
			Api.productionGetAdmin().then(res=>{
				if(res.code=="0"){
					this.employeeName=res.data.realName
				}
			})
		},
		data(){
			return{
				isSelectCheckbox: true,
				showModal: false,
				showSuccessPop: false,
				showErrorPop: false,
				showSuccessMessage: '',
				showErrorMessage: '',
				productNum: '',
				supplierName:'',
				supplierId:'',
				outStorageArr: [],
				PCSData:[],
				selectIndex: 0,
				columns:[],
				show:false,
				employeeName:"",
				showM: false,
				coutryList: [],
				//选中的值
				checkedList: [],
				workshopObj:{},
			}
		},
		methods:{
			//打开多选
			showMultiple() {
				this.showM = true
			},
			//获取多选的值
			getCodeMu(event) {
				this.checkedList=[]
				event.forEach(item=>{
					this.checkedList.push({name:item.value,value:item.value})
				})
				this.supplierName=this.checkedList.map(item=>item.name).join(",")
				this.showM = false
			},
			// handleScanCodeBox(){
			// 	uni.scanCode({
			// 		onlyFromCamera: true,
			// 		success: res => {
			// 			console.log(res.result)
			// 			//这里即拿到了扫描出的数据
			// 			// if(this.storageValue) {
			// 				console.log("扫描扫描PCS码")
			// 				// 扫描PCS码
			// 				this.handleScanPCS(res.result)
			// 			// }else {
			// 				// console.log("扫描扫描库位")
			// 				// 扫描库位
			// 				// this.handleScanStorage(res.result)
			// 			// }
			// 		},
			// 		fail: err => {
			// 		    // 需要注意的是小程序扫码不需要申请相机权限
			// 		}
			// 	});
			// },
			//事件委托全局按钮
			handleClick(e){
				if(e.target.id!=="btnModal"&& e.target.id!=="moreBtn"&& this.showModal){
					this.showModal=false
				}
			},
			async handleConfirm(e){	//报工工段确认
				if(this.productNum!==e.value[0]){
					this.supplierName=""
				}
				this.productNum=e.value[0]
				const res=await Api.productionReportingGetProcess({
					productId:this.productId,
					section:findKey(this.workshopObj,this.productNum)
				})
				this.coutryList=res.data.map(item=>{
					return {value:item.productName,name:item.productName}
				})
				this.show=false
			},
			handleCancel(){		//报工工段取消
				this.show=false
			},
			//封装函数
			scanPCSEncapsulation(res){
				uni.showToast({
					title: '扫描PCS码成功！',
					icon: 'none',
					duration: 3000
				})
				this.outStorageArr.push(res.data)
				//生产单号
				this.productId=res.data.produceOrderId
				//报工工段
				this.workshopObj={}
				res.data.sectionAndSectionNames.forEach(item=>{
					this.workshopObj=Object.assign(item,this.workshopObj)
				})
				this.columns=[Object.values(this.workshopObj)]
				//报工工序
				// let process=res.data.sectionsAndProductNames[0]
				// let newArr=[]
				// for(let key in process){
				// 	newArr=newArr.concat(process[key])
				// }
				// this.coutryList=newArr.map(item=>{
				// 	return {value:item,name:item}
				// })
				//当前员工
				// this.employeeName=res.data.realName;
				// 数组去重
				this.outStorageArr = this.outStorageArr.reverse()
			},
			handleScanPCS(pcs){ // 扫描PCS码
				this.outStorageArr = this.outStorageArr.reverse()
				Api.productionReportingPCS({
					pcs, // 'PD20211118073139826-0-00153638'
				}).then(res => {
					if (res.code === 0) {
						if(this.outStorageArr.length===0){
							this.scanPCSEncapsulation.call(this,res)
						}else{
							const Find=this.outStorageArr.find((item)=>item.produceOrderId===res.data.produceOrderId)
							if(Find){ //同一生产单不能重复扫描
								const newFind=this.outStorageArr.find((item)=>item.packageCode===res.data.packageCode)
								if(!newFind){
									const find=this.outStorageArr.find(item=>item.snNum===res.data.snNum)
									if(find){ //同一个PCS码不能重复扫描
										this.showErrorMessage = 'PCS码已被扫描'
										this.showErrorPop = true
										let timer = setTimeout(() => {
											clearTimeout(timer)
											this.showErrorPop = false
										}, 2000)
									}else{
										this.scanPCSEncapsulation.call(this,res)
									}
								}else{
									this.showErrorMessage = '同一扎单不能重复扫描！'
									this.showErrorPop = true
									let timer = setTimeout(() => {
										clearTimeout(timer)
										this.showErrorPop = false
									}, 2000)
								}
							}else{
								this.showErrorMessage = 'PCS码不属于该生产单！'
								this.showErrorPop = true
								let timer = setTimeout(() => {
									clearTimeout(timer)
									this.showErrorPop = false
								}, 2000)
							}
						}
					}
				})
			},


			handleMore(){ // 更多
				this.showModal = !this.showModal
			},

			handleOutStorage(){ // 出库

				let mesEngineeringManagementDTOS=this.outStorageArr.map(item=>{
					return {...item,section:+findKey(this.workshopObj,this.productNum),productName:this.supplierName,engineeringManagementDate:formateDate()}
				});
				Api.productionReporting({
					mesEngineeringManagementDTOS,
				}).then(res => {
					if (res.code === 0) {
						this.outStorageArr=[]
						this.productNum = ''
						this.supplierName=""
						this.coutryList=[]
						this.columns=[]
						this.checkedList=[]
						this.coutryList=[]
						this.showSuccessMessage = '报工成功！'
						this.showSuccessPop = true
						let timer = setTimeout(() => {
							clearTimeout(timer)
							this.showSuccessPop = false
						}, 2000)
					}
				})
			},

			handleEmpty(){ // 清空
				this.outStorageArr = []
				this.coutryList=[]
				this.showModal = false
				this.productNum = ''
				this.supplierName=""
			},
		},
		created(){    //防抖
			this.handleOutStorage = useDebounce(this.handleOutStorage);
		},
	};
</script>

<style lang="scss">
	@mixin delSty {
		position:absolute;
		top:10rpx;
		width: 26rpx;
		height: 2px;
		background-color: #afafaf;
	}
	.u-popup{
		flex: 0 !important;
	}
	.u-picker__view{
		height: 600rpx !important;
	}
	.mainContent {
		position: relative;
		background-color: #F3F3F3;
		.borderBottom{
			padding-bottom: 10rpx;
			border-bottom: 1px solid #ccc;
		}
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
			margin: 10rpx 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.storageTitle {
				font-size: 30rpx;
				font-weight: 900;
				width: 180rpx;
			}
			.storageInput {
				height: 60rpx;
				display: inline-block;
				border: 1rpx solid #212121;
				background-color: #F2F2F2;
				padding: 0 10rpx;
				flex: 1;
			}
		}
		//查询按钮样式
		.queryBtn{
			background-color: $theme-color;
			width: 130rpx;
			border-radius: 8rpx;
			margin: 0 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60rpx;
			color: white;
			font-weight: 600;
			cursor: pointer;
		}
		.radioLocation {
			text-align: right;
			margin-right: 20rpx;
			.checkboxStyle {
				display: inline-block;
			}
		}
		.pannelContent {
			height: calc(100vh - 474rpx);
			// margin-bottom: 202rpx;
			overflow: auto;
			.storageItem {
				display: flex;
				border: 1rpx solid #e4e4e4;
				border-radius: 20rpx;
				margin: 10rpx 5rpx;
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
						.itemCount{
							width: 70rpx;
							border: 1px solid #000000;
							background-color: #ffffcc;
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
					height: 162rpx;
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
				font-size: 30rpx;
				font-weight: bold;
				display: flex;
				justify-content: flex-end;
				.scannedNum{
					color: #fca147;
				}
				.scannedAllNum{
					color: $theme-color;
				}
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
					padding: 20rpx 50rpx;
				}
				.noInStorageBtn {
					background-color: #cccccc;
					cursor: not-allowed;
					padding: 20rpx 50rpx;
				}
			}
		}
		.btnModal {
			position: absolute;
			left: 30rpx;
			bottom: 10rpx;
			z-index: 10;
			.modalImage {
				width: 300rpx;
				height:166rpx;
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
