<template>
	<view class="mainContent" @tap="handleClick">
		<!-- <button class="button" type="primary" @click="toggle('center')"><text class="button-text">居中</text></button> -->
			<view class="scanInput">请扫描PCS码!</view>
			<view class="storageLocationItem">
				<view class="storageLocation">
					<text style="color: red;">*</text><text class="storageTitle">产品款号</text>
					<view class="line"></view>
					<input class="uni-input storageInput" placeholder-style="font-size: 30rpx;line-height:32rpx" v-model="productNum" confirm-type="search" disabled placeholder="请输入产品款号"/>
					<view class="queryBtn" id="proBtn">搜索</view>
				</view>
			</view>
			<view class="storageLocationItem">
				<view class="storageLocation">
					<view class="storageTitle">
						<text style="color: red;">*</text><text>供应商简称</text>
					</view>
					<view class="line"></view>
					<input class="uni-input storageInput" placeholder-style="font-size: 30rpx;line-height:32rpx" v-model="supplierName" confirm-type="search" disabled placeholder="请输入供应商简称"/>
					<view class="queryBtn" id="supplierBtn">搜索</view>
				</view>
		</view>
		<view class="pannelContent">
			<uni-swipe-action>
			<view v-for="(item, index) in outStorageArr" :key="item.id" class="AllStorage">
			<uni-swipe-action-item :right-options="options" @click="onClick($event,item)" @change="swipeChange($event, index)"
				  :disabled="!item.isSelectScan" >
				<view :class="item.isSelectScan ? 'selectLine': ''" class="storageWrap">
					<text class="serialNumber">{{ index + 1 }}.</text>
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
							<view>
								<text class="label">数量：</text>
								<text class="value">{{ item.count }}</text>
							</view>
						</view>
						<view class="storageNum">
							<text class="label">库位：</text>
							<text class="value">{{ item.locationCode }}</text>
						</view>
					</view>	
					<view class="storageArrow">
						<image class="arrowImage" src="../../static/cutWarehouse/leftArrow.png" mode="aspectFit" v-if="!item.arrowFlag&&item.isSelectScan"></image>
						<image class="arrowImage" src="../../static/cutWarehouse/rightArrow.png" mode="aspectFit" v-if="item.arrowFlag&&item.isSelectScan"></image>
						<!-- <view class="iconfont icon-a-bianzu4" v-if="item.isSelectScan"></view> -->
						<view class="t-icon t-icon-a-bianzu4" v-if="item.isSelectScan"></view>
					</view>
				</view>
			</uni-swipe-action-item>
			</view>
			</uni-swipe-action>
		</view>
		<u-action-sheet :actions="deletelist" :show="showMore" @select="handleEmpty" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="showMore=false"></u-action-sheet>
		<view class="bottom">
			<view class="bottom-left" @tap="showMore=true" id="moreBtn">更多 <text class="iconfont icon-gengduo"></text></view>
			<view class="bottom-right">
				<view class="count">已选：{{ alreadyOutStorageArr.length }}/{{ outStorageArr.length }},数量{{alreadyCount}}</view>
				<view class="btn btnActive" @click="handleOutStorage" v-if="alreadyCount > 0 ">出库并打印</view>
				<view class="btn btnDisable" v-else >出库并打印</view>
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
		<!-- 普通弹窗 -->
		<uni-popup ref="popup">
			<view class="productNumModel"  id="productNumModel" >
				<view class="delCx">
					查询
				</view>
				<view class="del" @click="closeProduct">
					<view class="del-1"></view>
					<view class="del-2"></view>
				</view>
				<view class="productNumSelect">
					<input placeholder-style="font-size: 28rpx" v-model="productForm.proNum" confirm-type="search" placeholder="产品款号" class="productNumInput"/>
					<input placeholder-style="font-size: 28rpx" v-model="productForm.clientNum" confirm-type="search" placeholder="客户款号" class="productNumInput"/>
					<view class="queryBtn" @tap="queryProduct">查询</view>
				</view>
				<view class="productTable">
					<view class="miniHeight-table">
						<view class="tableColumn firstLine" >
							<view class="td firstTd">产品款号</view>
							<view class="td">客户款号</view>
						</view>
						<view class="tableColumn" v-for="(item,index) in productData" @tap="getProductNum(item)" :key="index" :class="item.active?'active':''">
							<view class="td firstTd" :class="item.active?'active':''">{{item.proNum}}</view>
							<view class="td" :class="item.active?'active':''">{{item.clientNum}}</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup1">
		<view class="productNumModel"  id="supplierModel">
			<view class="delCx">
				查询
			</view>
			<view class="del" @tap="closeSupplier">
				<view class="del-1"></view>
				<view class="del-2"></view>
			</view>
			<view class="productNumSelect">
				<input placeholder-style="font-size: 28rpx" v-model="supplierForm.supplierAbbreviation" confirm-type="search" placeholder="供应商简称" class="productNumInput"/>
				<view class="queryBtn" @tap="querySupplier">查询</view>
			</view>
			<view class="productTable">
				<view class="tableColumn firstLine">
					<view class="td firstTd">供应商简称</view>
					<view class="td">供应商全称</view>
				</view>
				<view class="tableColumn" v-for="(item,index) in supplierData" :key="index" @tap="getSupplier(item)" :class="item.active?'active':''">
					<view class="td firstTd" :class="item.active?'active':''" style="display: flex;align-items: center;justify-content: center;">{{item.supplierAbbreviation}}</view>
					<view class="td" :class="item.active?'active':''">{{item.supplierName}}</view>
				</view>
			</view>
		</view>
		</uni-popup>
		<scan-code></scan-code>
	</view>
</template>

<script>
const tsc=require('../../utils/ble/tsc.js')
import { arrayToHeavy, toasting,useDebounce} from '../../utils/index.js'
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
	components: {
		scanCode,
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
			options: [{
			     text: '删除',
				 style: {
				 	backgroundColor: '#F4333F',
				 	width:"180rpx",
				 	fontSize:"32rpx",
				 	color:'#fff'
				 }
			}],
			deletelist:[{name:'清空',color:'#FC361D'}],
			showMore:false,
			type:'center'
		}
	},
	computed: mapState(['is_b_link']),
	methods:{
		onClick(e,i){   //删除按钮
			if(e.content.text==='删除'){
				i.isSelectScan=false
				this.alreadyOutStorageArr = this.alreadyOutStorageArr.filter(item =>item.id !== i.id)
				this.alreadyCount-=i.count
			}
		},
		swipeChange(e,index){   //控制滑动箭头
			if(e=='right'){
				this.outStorageArr[index].arrowFlag=true
			}else{
				this.outStorageArr[index].arrowFlag=false
			}
		},
		//事件委托全局按钮
		async handleClick(e){
			 if(e.target.id==="proBtn"){
				//产品查询
				this.$refs.popup.open('center');
					const res=await Api.productQuery()
					this.productData=res.data
			}else if(e.target.id==="supplierBtn"){
				//查询供应商
				if(this.productNum!==""){
					this.$refs.popup.close()
					this.$refs.popup1.open('center')
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
				//更多按钮
				this.showModal=false
			}
		},
		//搜索产品信息
		async queryProduct(){
			const res=await Api.productQuery({proNum:this.productForm.proNum,clientNum:this.productForm.clientNum})
			this.productData=res.data
		},
		//
		closeProduct(){ //关闭产品选择
			this.$refs.popup.close()
		},
		// 获取产品款号
		getProductNum(item){
			if(item.proNum!==this.productNum&&this.productNum){
				this.outStorageArr=[]
				this.supplierName=""
			}
			item.active=true
			this.productNum=item.proNum
			setTimeout(()=>{
				this.$refs.popup.close()
			},100)
		},
		closeSupplier(){    //关闭供应商弹窗
			this.$refs.popup1.close()
		},
		//搜索供应商
		async querySupplier(){
			const res=await Api.supplierQuery({supplierAbbreviation:this.supplierForm.supplierAbbreviation,proNum:this.productNum})
			this.supplierData=res.data
		},
		//获取供应商
		async getSupplier(item){
			item.active=true
			this.supplierName=item.supplierAbbreviation
			this.supplierId=item.id
			const res=await Api.pickingDet({proNum:this.productNum,outProcessSupplier:item.id})
			this.outStorageArr=res.data.map((item)=>{return{...item,arrowFlag:false,isSelectScan:false,show:false}})
			setTimeout(()=>{
				this.$refs.popup1.close()
			},100)
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
		handleScanPCS(pcsNum){ // 扫描PCS码
			Api.outScanPCS({
				pcsNum,// 'PD20211110090285439-0-00000116'
				proNum: this.productNum,
				outProcessSupplier:""+this.supplierId
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
						this.alreadyOutStorageArr.forEach((item, index) => {
							setTimeout(() => {
								this.senBleLabel(item.locationCode)
							}, index * 2000)
						})
					}
					for (let i = 0; i < this.alreadyOutStorageArr.length; i++) {
					        let val = this.alreadyOutStorageArr;
					        // 获取选中行的索引的方法
					        // 遍历表格中tableData数据和选中的val数据，比较它们的rowNum,相等则输出选中行的索引
					        // rowNum的作用主要是为了让每一行有一个唯一的数据，方便比较，可以根据个人的开发需求从后台传入特定的数据
					        val.forEach((val) => {
					          this.outStorageArr.forEach((v, i) => {
					            if (val.packageNum === v.packageNum) {
					              // i 为选中的索引
					              this.outStorageArr.splice(i, 1);
					            }
					          });
					        });
					      }
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
		
		handleEmpty(e){ // 清空
		if(e.name == '清空'){
			this.outStorageArr = []
			this.PCSData=[]
			this.showModal = false
			this.productNum = ''
			this.supplierName=""
			this.alreadyCount=0
			this.alreadyOutStorageArr=[]
			}
		},
		
		//蓝牙连接
		close_back() {
				uni.navigateBack({
					delta: 1
				})
			},
			OpenBluetoothAdapter() {
				console.log(1111)
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
				console.log(2222)
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
				console.log(3333)
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
				console.log(4444)
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
				console.log(5555)
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
				console.log(6666)
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
				console.log(7777)
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
				console.log(8888)
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
	created(){  //防抖
		this.handleOutStorage = useDebounce(this.handleOutStorage);
	}
};
</script>

<style lang="scss" scoped>
	@mixin delSty {
		position:absolute;
		top:10rpx;
		width: 40rpx;
		height: 1px;
		background-color: #0C99F2;
	}
	.mainContent {
	position: relative;
	background-color: #F3F3F3;
	//搜索框样式
	.storageLocationItem{
		padding: 14rpx 30rpx;
		background-color: #FFFFFF;
		width: 750rpx;
		height: 100rpx;
		.storageLocation {
			border: 1px solid #0C99F2;
			border-radius: 8rpx;
			display: flex;
			padding: 4rpx 4rpx 4rpx 20rpx;
			justify-content: flex-start;
			align-items: center;
			.storageTitle {
				font-size: 30rpx;
				font-weight: 900;
				color: #151515;
				line-height: 42rpx;
				white-space: nowrap;
			}
			.line{
				width: 2rpx;
				height: 36rpx;
				background-color: #C4C4C4;
				margin: 0 20rpx;
			}
			.queryBtn{
				margin-left: auto;
			}
		}
	}
	//查询按钮样式
	.queryBtn{
		background-color: $theme-color;
		width: 100rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 64rpx;
		color: white;
		font-weight: 600;
		font-family: PingFangSC-Medium;
		color: #FFFFFF;
		font-size: 30rpx;
		line-height: 42rpx;
	}
	
	//外发加工裁片样式
	.pannelContent {
		height: calc(100vh - 386rpx);
		overflow: auto;
			.AllStorage{
				margin-top: 20rpx;
			}
			.storageWrap{
				display: flex;
				height: 260rpx;
				padding: 30rpx 0rpx;
				overflow: hidden;
				background-color: #FFFFFF;
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
				// padding: 10rpx;
				font-family: PingFang-SC-Bold;
				.storageCode{
					font-size: 36rpx;
					color: #333333;
					line-height: 32rpx;
					font-weight: 600;
				}
				.storageContent {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					.storageNum {
						font-weight: bold;
					}
				}
			}
			.storageArrow{
				width: 154rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				// position: relative;
				.arrowImage{
					width:36rpx;
					height: 32rpx;
				}
				.t-icon-a-bianzu4{
					position: absolute;
					top: 20rpx;
					right: -50rpx;
					width: 137rpx;
					height: 70rpx;
				}
			}
			
			
	}
	.bottom{
		#moreBtn{
			font-size: 32rpx;
		}
	}
	//清空按钮样式
	.emptyBtn {
		display: inline-block;
		text-align: center;
		color: #fff;
		padding: 24rpx 55rpx;
		border-radius: 15rpx;
		font-size: 14px;
		margin-right: initial;
		font-size: 14px;
		background-color: #FC361D;
		position: absolute;
		left: 65rpx;
		top: 30rpx
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
	//产品款号弹出框
	.productNumModel{
		width:600rpx;
		// position: absolute;
		// top: 107rpx;
		// left: 72rpx;
		// z-index: 99;
		padding-bottom: 66rpx;
		border-radius: 16rpx;
		background-color: #fff;
		overflow: hidden;
		.delCx{
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #E4F4FF;
			color: #0C99F2;
			font-size:32rpx;
			font-family: PingFang-SC-Bold;
			letter-spacing: 0;
			font-weight: 600;
		}
		.del{
			position: absolute;
			top: 40rpx;
			right: 30rpx;
			width: 42rpx;
			height: 42rpx;
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
			height: 110rpx;
			padding: 18rpx 20rpx;
			.productNumInput{
				width: 220rpx;
				height: 72rpx;
				border: 1px solid #C4C4C4;
				background-color: #FFFFFF;
				border-radius: 8rpx;
				padding: 16rpx 0 16rpx 20rpx;
				margin-right: 8rpx;
			}
			.queryBtn{
				height: 72rpx;
			}
		}
		.productTable{
			.miniHeight-table{
				max-height: 528rpx;
				overflow: auto;
			}
			.active{
				background: #E4F4FF;
				color: #0C99F2 !important;
			}
			.firstLine{
				background-color: #EFEFEF;
				font-weight: 800;
				font-family: PingFang-SC-Bold;
				font-size: 16px;
				color: #333333;
				letter-spacing: 0;
				line-height: 16px;
			}
			.tableColumn{
				display: flex;
				height: 88rpx;
				width: 100%;
				align-items: center;
				border-bottom: 1px solid #D8D8D8;
				.td{
					flex: 1;
					text-align: center;
					line-height: 88rpx;
					font-family: PingFangSC-Regular;
					font-size: 16px;
					color: #585858;
					letter-spacing: 0;
				}
				.firstTd{
					flex: 0.7;
				}
			}
		}
	}
}
</style>
