<template>
	<view class="mainContent" @tap="handleClick">
		<view class="borderBottom">
			<view class="location">
				<!-- <image class="scanCodeBox" src="../../static/cutWarehouse/scanCodeBox.png" mode="aspectFit" @tap="handleScanCodeBox"></image> -->
				<input class="uni-input scanInput" placeholder-style="font-size: 34rpx" confirm-type="search" placeholder="请扫描PCS码" disabled/>
			</view>
			<view class="storageLocation">
				<text style="color: red;">*</text><text class="storageTitle">产品款号：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="productNum" confirm-type="search" placeholder="请选择产品款号" disabled/>
				<view class="queryBtn" id="proBtn">查询</view>
			</view>
			<view class="storageLocation">
				<text style="color: red;">*</text><text class="storageTitle">供应商简称：</text>
				<input class="uni-input storageInput" placeholder-style="font-size: 34rpx" v-model="supplierName" confirm-type="search" placeholder="请选择供应商简称" disabled/>
				<view class="queryBtn" id="supplierBtn">查询</view>
			</view>
		</view>
		<!-- <view class="radioLocation">
			<checkbox-group @change="checkboxChange">
				<view class="checkboxStyle">
					<checkbox value="" :checked="!isSelectCheckbox" style="transform: scale(0.8)"/>
				</view>
				<view class="checkboxStyle">全部</view>
			</checkbox-group>
		</view> -->
		<view class="pannelContent">
			<view 
			 class="storageItem" 
			 v-for="(item,index) in outStorageArr"
			 :key="index"
			>
			<!-- v-show="item.isShowScan" -->
				<view 
				 :class="[item.isSelectScan ? 'selectLine': '' , 'touch-list', 'list-touch']" 
				 @touchstart="handleTouchStart($event,item)"
				 @touchmove="handleTouchMove($event,item)" 
				 @touchend="handleTouchEnd($event,item)"
				 :data-index="index"
				 :style="item.txtStyle"
				 >
					<text class="serialNumber">{{ index + 1 }}.</text>
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
							<view>
								<text>数量：</text>
								<text>{{ item.count }}</text>
							</view>
							<view class="storageNum">
								<text>库位：</text>
								<text>{{ item.locationCode }}</text>
							</view>
						</view>
					</view>	
					<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="item.arrowFlag&&item.isSelectScan"></image>
					<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-if="!item.arrowFlag&&item.isSelectScan"></image>
				</view>
				<view class="touch-list list-delete" @click = "deleteMember(item)">
					删除
				</view>
			</view>
		</view>
		<view class="bottomLocation">
			<view class="scanNum"><view><text class="scannedNum">{{ alreadyOutStorageArr.length }}</text>/{{ outStorageArr.length }}</view><view><text>已扫描数量：</text><text class="scannedAllNum">{{alreadyCount}}</text></view></view>
			<view class="btnLocation">
				<view class="commonBtn moreBtn" @tap="handleMore" id="moreBtn">更多</view>
<!-- 				<view class="commonBtn inStorageBtn" @tap="handleOutStorage" v-if="alreadyCount > 0 ">出库并打印</view>
				<view class="commonBtn noInStorageBtn" @tap="handleOutStorage"  v-else>出库并打印</view> -->
				<button type="default" class='commonBtn inStorageBtn' @click="handleOutStorage" v-if="alreadyCount > 0 ">出库并打印</button>
				<button type="default" class='commonBtn noInStorageBtn '   @click="handleOutStorage" v-else>出库并打印</button>
			</view>
		</view>
		<view class="btnModal" v-if="showModal" id="btnModal">
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
		<view class="productNumModel" v-if="showProductNumModel" id="productNumModel">
			<view class="del" @click="closeProduct">
				<view class="del-1"></view>
				<view class="del-2"></view>
			</view>
			<view class="productNumSelect">
				<input placeholder-style="font-size: 34rpx" v-model="productForm.proNum" confirm-type="search" placeholder="产品款号" class="productNumInput"/>
				<input placeholder-style="font-size: 34rpx" v-model="productForm.clientNum" confirm-type="search" placeholder="客户款号" class="productNumInput"/>
				<view class="queryBtn" @tap="queryProduct">查询</view>
			</view>
			<view class="productTable">
				<view class="miniHeight-table">
					<view class="tableColumn" >
						<view class="td" style="background-color: #bbdef5;max-width: 260rpx;">产品款号</view>
						<view class="td" style="background-color: #bbdef5;max-width: 260rpx;">客户款号</view>
					</view>
					<view class="tableColumn" v-for="(item,index) in productData" @tap="getProductNum(item)" :key="index">
						<view class="td" style="max-width: 260rpx;">{{item.proNum}}</view>
						<view class="td" style="max-width: 260rpx;">{{item.clientNum}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="productNumModel" v-if="showSupplierModel" id="supplierModel">
			<view class="del" @tap="closeSupplier">
				<view class="del-1"></view>
				<view class="del-2"></view>
			</view>
			<view class="productNumSelect">
				<input placeholder-style="font-size: 34rpx" v-model="supplierForm.supplierAbbreviation" confirm-type="search" placeholder="供应商简称" class="productNumInput"/>
				<view class="queryBtn" @tap="querySupplier">查询</view>
			</view>
			<view class="productTable">
				<view class="tableColumn" >
					<view class="td firstTd" style="background-color: #bbdef5;">供应商简称</view>
					<view class="td" style="background-color: #bbdef5;">供应商全称</view>
				</view>
				<view class="tableColumn" v-for="(item,index) in supplierData" :key="index" @tap="getSupplier(item)">
					<view class="td firstTd" style="display: flex;align-items: center;justify-content: center;">{{item.supplierAbbreviation}}</view>
					<view class="td">{{item.supplierName}}</view>
				</view>
			</view>
		</view>
		<scan-code></scan-code>
	</view>
</template>

<script>
	const tsc=require('../../utils/ble/tsc.js')
// import { defineComponent, ref, reactive, toRefs } from 'vue';
import { arrayToHeavy, toasting,touchStart, touchMove, touchEnd} from '../../utils/index.js'
import Api from '../../service/api'
import scanCode from "../../components/scan/scan.vue"
import {mapState} from 'vuex';

export default{
	// name: 'cutOutStorage',
	onLoad() {
		// console.log('onLoad');
		this.OpenBluetoothAdapter()
	},
	onUnload() {
		this.closeBLEConnection()
	},
	onShow() {
		// console.log('onShow');
		uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
		uni.$on('scancodedate', (data) => {
			console.log(data)
			// if(this.sewingTaskRecord) {
			// 	console.log("扫描PCS码")
			// 	// 扫描PCS码
				this.handleScanPCS(data.code)
			// }else {
			// 	console.log("扫描缝制任务单号")
			// 	// 扫描缝制任务单号
			// 	this.handleScanTask(data.code)
			// }
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
			alreadyOutStorageArr: [],
			startX: '',
			showProductNumModel:false,
			showSupplierModel:false,
			productData:[],
			supplierData:[],
			productForm:{
				proNum:"",
				clientNum:"",
			},
			supplierForm:{
				supplierAbbreviation:""
			},
			startX:'',
			alreadyCount:0,
			PCSData:[],
			list: [],
			services: [],
			serviceId: 0,
			code: '',
			touch_all_list: false,
			dataList: [], //包装后的列表
			orderlist: [], //获得的列表
		}
	},
	computed: mapState(['is_b_link']),
	methods:{
		//事件委托全局按钮
		async handleClick(e){
			 if(e.target.id==="proBtn" && !this.showProductNumModel){
				//产品查询
				this.showProductNumModel=true
					const res=await Api.productQuery()
					this.productData=res.data
			}else if(e.target.id==="supplierBtn" && !this.showSupplierModel){
				if(this.productNum!==""){
					this.showSupplierModel=true
					this.showProductNumModel=false
					const res=await Api.supplierQuery({proNum:this.productNum})
					this.supplierData=res.data
				}else{
					this.showErrorMessage = '请先选择产品款号！'
					this.showErrorPop = true
					let timer = setTimeout(() => {
						clearTimeout(timer)
						this.showErrorPop = false
					}, 2000)
				}
			}else if(e.target.id!=="btnModal"&& e.target.id!=="moreBtn"&& this.showModal){
				this.showModal=false
			}
		},
		//搜索产品信息
		async queryProduct(){
			const res=await Api.productQuery({proNum:this.productForm.proNum,clientNum:this.productForm.clientNum})
			this.productData=res.data
		},
		closeProduct(){
			this.showProductNumModel=false
		},
		// 获取产品款号
		getProductNum(item){
			if(item.proNum!==this.productNum&&this.productNum){
				this.outStorageArr=[]
				this.supplierName=""
			}
			this.productNum=item.proNum
			this.showProductNumModel=false
		},
		closeSupplier(){
			this.showSupplierModel=false
		},
		//搜索供应商
		async querySupplier(){
			const res=await Api.supplierQuery({supplierAbbreviation:this.supplierForm.supplierAbbreviation,proNum:this.productNum})
			this.supplierData=res.data
		},
		//获取供应商
		async getSupplier(item){
			this.supplierName=item.supplierAbbreviation
			this.supplierId=item.id
			const res=await Api.pickingDet({proNum:this.productNum,outProcessSupplier:item.id})
			this.outStorageArr=res.data.map((item)=>{return{...item,arrowFlag:false,isSelectScan:false}})
			this.showSupplierModel=false
		},
		//扫描PCS码
		// handleScanCodeBox(){
		// 	if(this.productNum===""||this.supplierName===""){
		// 		this.showErrorMessage = '请先选择产品款号及供应商！'
		// 		this.showErrorPop = true
		// 		let timer = setTimeout(() => {
		// 			clearTimeout(timer)
		// 			this.showErrorPop = false
		// 		}, 2000)
		// 	}else{
		// 		uni.scanCode({
		// 			onlyFromCamera: true,
		// 			success: res => {
		// 				console.log(res.result)
		// 				//这里即拿到了扫描出的数据
		// 				// if(this.sewingTaskRecord) {
		// 				// 	console.log("扫描扫描PCS码")
		// 				// 扫描PCS码
		// 					this.handleScanPCS(res.result)
		// 				// }else {
		// 				// 	console.log("扫描扫描缝制任务单号")
		// 				// 	// 扫描缝制任务单号
		// 				// 	handleScanTask(res.result)
		// 				// }
		// 			},
		// 			fail: err => {
		// 			    // 需要注意的是小程序扫码不需要申请相机权限
		// 				console.log(err)
		// 			}
		// 		});
		// 	}
		// },
		//右滑删除
		handleTouchStart(e,item){
			if(item.isSelectScan){
				this.startX = touchStart(e)
			}
		},
		
		handleTouchMove(e,item){
			if(item.isSelectScan){
				this.outStorageArr = touchMove(e, this.startX, this.outStorageArr)
			}
		},
		
		handleTouchEnd(e,item){
			if(item.isSelectScan){
				this.outStorageArr = touchEnd(e, this.startX, this.outStorageArr)
			}
		},
		//删除按钮
		deleteMember(item,index){
			item.isSelectScan=false
			this.alreadyOutStorageArr.splice(index, 1)
			this.alreadyCount-=item.count
			item.txtStyle=0
		},
		
		handleScanPCS(pcsNum){ // 扫描PCS码
			Api.outScanPCS({
				pcsNum,// 'PD20211110090285439-0-00000116'
				proNum: this.productNum,
				outProcessSupplier:this.supplierId
			}).then(res => {
				if (res.code === 0) {
					const find=this.outStorageArr.find((item)=>{
						return item.packageCode==res.data.packageCode
					})
					if(find){
						const Find=this.alreadyOutStorageArr.find(item=>{
									return item.packageCode==res.data.packageCode
								})
								if(!Find){
									uni.showToast({
										title: '扫描PCS码成功！',
										icon: 'none',
										duration: 3000
									})
									this.outStorageArr.forEach((item)=>{
										if(item.packageCode===res.data.packageCode){
											item.isSelectScan=true
											this.alreadyCount+=+item.count
										}
									})
									this.outStorageArr.forEach(item=>{
										if(item.packageCode==res.data.packageCode){
											this.alreadyOutStorageArr=this.alreadyOutStorageArr.concat(item)
											this.PCSData=this.PCSData.concat({
												...res.data,
												mesPiecesMarketDTOList:[item]
											})
										}
									})
								}else{
									this.showErrorMessage = '该PCS码已扫描！'
									this.showErrorPop = true
									let timer = setTimeout(() => {
										clearTimeout(timer)
										this.showErrorPop = false
									}, 2000)
								}
								
							}else {
								this.showErrorMessage = "该PCS码不属于当前列表！"
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
		
		handleOutStorage(){ // 出库
			Api.outOutsourcingDelivery({
				mesOrderSubpackageOutwardDTOList:this.PCSData
			}).then(res => {
				
				if (res.code === 0) {
					if (!this.is_b_link) {
						uni.showToast({
							title: '打印机未连接',
							icon: 'error'
						})
					} else {
						this.outStorageArr.forEach((item, index) => {
							setTimeout(() => {
								console.log(item)
								this.senBleLabel(item.locationCode)
							}, index * 2000)
						})
					}
					this.outStorageArr=this.outStorageArr.filter(item=>{
						this.alreadyOutStorageArr.forEach(val=>{
							return item.packageNum!==val.packageNum
						})
					})
					this.alreadyOutStorageArr=[]
					this.PCSData=[]
					if(this.outStorageArr.length===0){
						this.productNum = ""
						this.supplierName = ""
					}
					this.alreadyCount=0
					this.showSuccessMessage = '出库并打印成功！'
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
			this.PCSData=[]
			this.showModal = false
			this.productNum = ''
			this.supplierName=""
			this.alreadyCount=0
			this.alreadyOutStorageArr=[]
		},
		
		close_back() {
				uni.navigateBack({
					delta: 1
				})
			},
			OpenBluetoothAdapter() {
				uni.openBluetoothAdapter({
					success: (res) => {
						// 初始化完毕开始搜索
						this.StartBluetoothDeviceDiscovery()
					},
					fail: (res) => {
						if (res.errCode == 10001) {
							uni.showToast({
								title: '蓝牙未打开',
								duration: 2000,
							})
						} else {
							uni.showToast({
								title: res.errMsg,
								duration: 2000,
							})
						}
					}
				});
			},
		
			StartBluetoothDeviceDiscovery() {
				uni.startBluetoothDevicesDiscovery({
					success: res => {
						this.OnBluetoothDeviceFound();
					},
					fail: res => {
						uni.showToast({
							icon: "none",
							title: "查找设备失败！",
							duration: 3000
						})
					}
				});
			},
		
			OnBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound(res => {
					res.devices.forEach(device => { //这一步就是去筛选找到的蓝牙中,有没有你匹配的名称  
						if (device.name == 'Printer_1078_BLE') { //匹配蓝牙名称
							uni.setStorageSync("DeviceID", device.deviceId) //把已经连接的蓝牙设备信息放入缓存
							this.DeviceID = device.deviceId
							let DeviceID = device.deviceId //这里是拿到的uuid 
							this.StopBluetoothDevicesDiscovery() //当找到匹配的蓝牙后就关掉蓝牙搜寻,因为蓝牙搜寻很耗性能 
							this.CreateBLEConnection(DeviceID) //创建蓝牙连接,连接低功耗蓝牙设备  
		
						}
					})
				});
			},
		
			StopBluetoothDevicesDiscovery() {
				uni.stopBluetoothDevicesDiscovery({
					success: res => {
						console.log(res)
					},
					fail: res => {
						console.log(res.errCode);
					}
				});
			},
		
			CreateBLEConnection(DeviceID, index) {
				let doc = this
				uni.createBLEConnection({ //创建蓝牙连接,连接低功耗蓝牙设备  
					deviceId: DeviceID, //传入刚刚获取的uuid  
					success(res) {
						console.log("创建蓝牙连接成功")
						doc.GetBLEDeviceServices(DeviceID) //获取蓝牙设备所有服务(service)。
		
					},
					fail(res) {
						console.log(res)
					}
				})
			},
		
			GetBLEDeviceServices(DeviceID, index) {
				let doc = this
				setTimeout(function() {
					uni.getBLEDeviceServices({ //获取蓝牙设备所有服务  
						deviceId: DeviceID,
						success(res) {
							console.log(res)
							const {
								uuid
							} = res.services[2]
							uni.setStorageSync("ServiceUUID", uuid)
							uni.setStorageSync("ServiceUUIDNew", uuid)
							let ServiceUUIDNew = uuid
							this.ServiceUUID = uuid
							doc.GetBLEDeviceCharacteristics(DeviceID)
						},
						fail(res) {
							const {
								errCode
							} = res
							doc.errorCodeTip(errCode)
						}
					})
				}, 2000)
			},
		
			// 第七步 获取蓝牙特征值
			GetBLEDeviceCharacteristics(DeviceID) {
				const that = this
				setTimeout(() => {
					uni.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值  
						deviceId: DeviceID,
						serviceId: uni.getStorageSync('ServiceUUIDNew'),
						success(res) {
							uni.showToast({
								title: '开启蓝牙连接',
								duration: 1000
							});
							const {
								uuid
							} = res.characteristics[1]
							uni.setStorageSync("CharacteristicId", uuid) //把某个服务中所有特征值信息放入缓存
							that.characteristicId = uuid
							that.$store.commit('set_is_b_link', true)
						},
						fail(res) {
							console.log("获取蓝牙设备某个服务中所有特征值失败:", JSON.stringify(res))
						}
					})
				}, 2000)
			},
			// 第八步 发送二进制数据
			senBlData(deviceId, serviceId, characteristicId, uint8Array) {
				var uint8Buf = Array.from(uint8Array);
		
				function split_array(datas, size) {
					var result = {};
					var j = 0
					for (var i = 0; i < datas.length; i += size) {
						result[j] = datas.slice(i, i + size)
						j++
					}
					return result
				}
				var sendloop = split_array(uint8Buf, 20);
		
				function realWriteData(sendloop, i) {
					var data = sendloop[i]
					if (typeof(data) == "undefined") {
						return
					}
					var buffer = new ArrayBuffer(data.length)
					var dataView = new DataView(buffer)
					for (var j = 0; j < data.length; j++) {
						dataView.setUint8(j, data[j]);
					}
					uni.writeBLECharacteristicValue({
						deviceId,
						serviceId,
						characteristicId,
						value: buffer,
						success(res) {
							realWriteData(sendloop, i + 1);
						}
					})
				}
				var i = 0;
				realWriteData(sendloop, i);
			},
			senBleLabel(content) {
				console.log(content)
				let deviceId = uni.getStorageSync('DeviceID');
				let serviceId = uni.getStorageSync('ServiceUUIDNew');
				let characteristicId = uni.getStorageSync('CharacteristicId')
				var command = tsc.jpPrinter.createNew()
				command.setSize(40, 100)
				command.setGap(2)
				command.setCls()
				command.setBarCode(130, 300, "EAN8", 120, 2, 4, 3, `${content}`)
				command.setText(130, 425, "TSS24.BF2", 1, 1, `${content}`)
				command.setPagePrint()
				this.senBlData(deviceId, serviceId, characteristicId, command.getData())
			},
			//错误码提示
			errorCodeTip(code) {
				let doc = this
				if (code == 0) {
					//正常
				} else if (code == 10000) {
					uni.showToast({
						title: '未初始化蓝牙适配器',
						icon: 'none'
					})
				} else if (code == 10001) {
					uni.showToast({
						title: '当前蓝牙适配器不可用',
						icon: 'none'
					})
				} else if (code == 10002) {
					uni.showToast({
						title: '没有找到指定设备',
						icon: 'none'
					})
				} else if (code == 10003) {
					uni.showToast({
						title: '连接失败',
						icon: 'none'
					})
				} else if (code == 10004) {
					uni.showToast({
						title: '没有找到指定服务',
						icon: 'none'
					})
				} else if (code == 10005) {
					uni.showToast({
						title: '没有找到指定特征值',
						icon: 'none'
					})
				} else if (code == 10006) {
					uni.showToast({
						title: '当前连接已断开',
						icon: 'none'
					})
				} else if (code == 10007) {
					uni.showToast({
						title: '当前特征值不支持此操作',
						icon: 'none'
					})
				} else if (code == 10008) {
					uni.showToast({
						title: '其余所有系统上报的异常',
						icon: 'none'
					})
				} else if (code == 10009) {
					uni.showToast({
						title: 'Android 系统特有，系统版本低于 4.3 不支持 BLE',
						icon: 'none'
					})
				}
				if (code != 0) {
					//正常
					//在页面加载时候初始化蓝牙适配器
					doc.OpenBluetoothAdapter()
				}
			},
			getBluetoothDevices() {
				uni.getBluetoothDevices({
					success: res => {
						this.bluetooth = res.devices;
						this.bluetooth.forEach((item) => {
							this.isLink.push(0)
						})
					}
				});
			},
			//断开蓝牙连接
		
			closeBLEConnection(deviceId, index) {
				uni.closeBLEConnection({
					deviceId: deviceId,
					success: res => {
						this.isLink.splice(index, 1, 4)
						console.log(res)
					}
				})
			},
		
			touch_all() {
				const list = this.dataList
				const ls = list.map(item => {
					item.checked = !this.touch_all_list
					item.arr.map(Item => {
						Item.checked = !this.touch_all_list
					}).reduce((prev, curr) => (prev.concat(curr)), [])
					return item
				})
				this.dataList = ls
				this.touch_all_list = !this.touch_all_list
			},
		
			async check_all_list() {
				const list = this.dataList
				let types = []
				list.forEach(item => {
					types.push(item.checked)
					item.arr.forEach(Item => {
						types.push(Item.checked)
					})
				})
				this.touch_all_list = !types.includes(false)
			},
		
			async touch_rq(i) {
				const {
					containerName
				} = i
				const list = this.dataList
				const ls = list.map(item => {
					if (item.containerName === containerName) {
						item.checked = !item.checked
						if (!item.checked) {
							this.touch_all_list = false
						}
						item.arr.map(Item => {
							Item.checked = item.checked
						})
					}
					return item
				}).reduce((prev, curr) => (prev.concat(curr)), [])
				this.dataList = ls
				await this.check_all_list()
			},
		
			async touch_rq_item(im) {
				const {
					containerCode: containerName,
					code,
					checked
				} = im
				const list = this.dataList
				const ls = list.map(item => {
					if (item.containerName === containerName) {
						item.arr.map(Item => {
							if (Item.code === code) {
								Item.checked = !checked
							}
							if (!Item.checked) {
								item.checked = false
							} else {
								item.checked = true
							}
						})
					}
					return item
				}).reduce((prev, curr) => (prev.concat(curr)), [])
				this.dataList = ls
				await this.check_all_list()
			},
		
			// toprint() {
			// 	if (!this.is_b_link) {
			// 		uni.showToast({
			// 			title: '打印机未连接',
			// 			icon: 'error'
			// 		})
			// 	} else {
			// 		const that = this
			// 		const list = this.dataList.map(item => {
			// 			return item.arr.map(Item => {
			// 				if (Item.checked) {
			// 					return Item.code
			// 				}
			// 			})
			// 		}).reduce((prev, curr) => (prev.concat(curr)), []).filter(item => item != null || undefined)
			// 		if (list.length === 0) {
			// 			uni.showToast({
			// 				title: '请勾选单据',
			// 				icon: 'error'
			// 			})
			// 		} else {
			// 			list.forEach((item, index) => {
			// 				setTimeout(() => {
			// 					console.log(item)
			// 					that.senBleLabel(item)
			// 				}, index * 2000)
			// 			})
			// 		}
			// 	}
			// },
			close_rq(id) {
				const dis = this.dataList[id].isDisplay
				const list = this.dataList
				this.dataList = list.map((item, index) => {
					if (index == id) {
						item.isDisplay = !dis
					}
					return item
				})
			}
	},
	components: {
		scanCode
	}
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
			justify-content: space-between;
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
				padding: 20rpx 30rpx;
			}
			.noInStorageBtn {
				background-color: #cccccc;
				cursor: not-allowed;
				padding: 20rpx 30rpx;
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
	.productNumModel{
		width:600rpx;
		position: absolute;
		top: 250rpx;
		left: 75rpx;
		z-index: 9;
		padding: 40rpx 30rpx;
		background-color: #f2f2f2;
		border: 3px solid #afafaf;
		.del{
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			width: 30rpx;
			height: 30rpx;
			.del-1{
				@include delSty;
				transform: rotateZ(45deg);
			}
			.del-2{
				@include delSty;
				transform: rotateZ(130deg);
			}
		}
		.productNumSelect{
			display: flex;
			margin:0rpx 0rpx 30rpx;
			.productNumInput{
				width: 200rpx;
				height: 55rpx;
				border: 1px solid #ccc;
				background-color: #FFFFFF;
				margin: 0 6rpx;
			}
			.queryBtn{
				height: 55rpx;
			}
		}
		.productTable{
			width:520rpx;
			border-top: 1px solid black;
			border-left: 1px solid black;
			.miniHeight-table{
				max-height: 500rpx;
				overflow: auto;
			}
			.tableColumn{
				display: flex;
				.td{
					flex: 1;
					border-bottom: 1px solid black;
					border-right: 1px solid black;
					text-align: center;
					line-height: 50rpx;
					background-color: white;
				}
				.firstTd{
					flex: 0.6;
				}
			}
		}
	}
}
</style>
