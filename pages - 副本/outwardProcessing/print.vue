<template>
	<!-- <view class="container">
		<view class="c_header" @click="touch_all">
			<checkMine class="check-box" :checked="touch_all_list" /> 全选
		</view>
		<view class="c_main">
			<view class="c_main_item" v-for="(item, index) in dataList" :key='index'>
				<view class="c_main_item_title">
					容器：{{item.containerName}}
					<view class="c_main_item_title_c_box" @click="touch_rq(item)">
						<checkMine class="check-box" :checked="item.checked" /> 全选容器
					</view>
				</view>
				<view class="c_main_item_detail" v-for="(Item, Index) in item.arr" @click="touch_rq_item(Item)"
					:key='Index' v-if="!item.isDisplay">
					<view class="c_main_item_detail_title">
						{{Item.materialCode ? Item.materialCode : '暂无'}}
					</view>
					<view class="c_main_item_detail_area">
						<view class="c_main_item_detail_area_n_box">
							<view class="name">物料名称</view>：
							<view class="name_is">{{Item.materialName ? Item.materialName : '暂无'}}</view>
						</view>
					</view>
					<view class="c_main_item_detail_area">
						<view class="c_main_item_detail_area_n_box">
							<view class="name">长度</view>：
							<view class="name_is">{{Item.length? Item.length : '暂无'}}</view>
						</view>
					</view>
					<view class="c_main_item_detail_area">
						<view class="c_main_item_detail_area_n_box">
							<view class="name">缸号</view>：
							<view class="name_is">{{Item.dyelot? Item.dyelot : '暂无'}}</view>
						</view>
						<view>
							<checkMine class="check-box" :checked="Item.checked" />
						</view>
					</view>
					<view class="line" />
				</view>
				<view class="is_open_a_close">
					<view :class="!item.isDisplay ? 'cuIcon-fold' : 'cuIcon-unfold'" @click="close_rq(index)" />
				</view>
			</view>
		</view>
		<view class="c_footer">
			<button type="default" class="btn-c" @click="close_back">关闭</button> -->
			<button type="default" :class='is_b_link ? "btn-p" : "btn-p-p"' @click="toprint">打印</button>
		<!-- </view> -->
	</view>
</template>

<script>
	// import jpPrinter from "../../utils/ble/tsc.js";
	// import { createRequire } from 'module';
	// const require = createRequire(import.meta.url);
	// const tsc = require("../../utils/ble/tsc.js");
	// import jpPrinter from "../../utils/ble/tsc.js"
	import {
		mapState
	} from 'vuex';
	// import checkMine from '../../components/checkMine.vue'
	// import {
	// 	requestApi
	// } from '../../service/request.js'
	import {
		toasting
	} from '../../utils/index.js'
	export default {
		data() {
			return {
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
		// components: {
		// 	checkMine
		// },
		async onLoad(options) {
			const {
				code
			} = options
			this.code = code
			await this.getList()
			this.OpenBluetoothAdapter()
		},
		onUnload() {
			this.closeBLEConnection()
		},
		methods: {
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
				let deviceId = uni.getStorageSync('DeviceID');
				let serviceId = uni.getStorageSync('ServiceUUIDNew');
				let characteristicId = uni.getStorageSync('CharacteristicId')
				var command = tsc.jpPrinter.createNew()
				command.setSize(40, 100)
				command.setGap(2)
				command.setCls()
				command.setBarCode(130, 300, "EAN8", 120, 2, 4, 3, "123456789")
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

			//获取数据并包装数据
			async getList() {
				this.orderlist = []
				const obj = {
					receiveOrderCode: this.code
				}
				const res = await requestApi('in/receiveorder/getReceiveOrderDetailList', 'GET', obj)
				let n = 0
				for (let key in res) {
					res[key].map(item => {
						item.checked = false //单个容器选中
						item.isDisplay = false
					})
					let obj = {
						containerName: key,
						checked: false, //单个条码被选中
						arr: res[key]
					}
					this.dataList.push(obj)
				}
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

			toprint() {
				if (!this.is_b_link) {
					uni.showToast({
						title: '打印机未连接',
						icon: 'error'
					})
				} else {
					const that = this
					const list = this.dataList.map(item => {
						return item.arr.map(Item => {
							if (Item.checked) {
								return Item.code
							}
						})
					}).reduce((prev, curr) => (prev.concat(curr)), []).filter(item => item != null || undefined)
					if (list.length === 0) {
						uni.showToast({
							title: '请勾选单据',
							icon: 'error'
						})
					} else {
						list.forEach((item, index) => {
							setTimeout(() => {
								console.log(item)
								that.senBleLabel(item)
							}, index * 2000)
						})
					}
				}
			},
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
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;

		.c_header {
			width: 100%;
			display: flex;
			align-items: center;
			padding:25rpx 20rpx;
			font-size:38rpx;
		}

		.c_main {
			width: 100%;
			
			.c_main_item {
				background: #FFFFFF;
				.c_main_item_title {
					font-size: 43rpx;
					font-weight: bold;
					padding: 20rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					border-bottom: 1rpx solid #D9D9D9;
					.c_main_item_title_c_box{
						font-weight: normal;
						color:  #666666;
						font-size: 38rpx;
					}
				}

				.c_main_item_detail {
					padding: 20rpx;
					box-sizing: border-box;

					.c_main_item_detail_title {
						font-weight: bold;
						font-size: 43rpx;
					}

					.c_main_item_detail_area {
						display: flex;
						justify-content: space-between;
						padding: 5rpx 0;
						box-sizing: border-box;
						.c_main_item_detail_area_n_box {
							display: flex;
							font-size: 43rpx;
							align-items: center;
							.name {
								width: 4em;
								text-align: justify;
								text-align-last: justify;
							}

							.name_is {
								margin-left: 10rpx;
								color: #2A2A2A;
							}
						}
					}
				}

				.is_open_a_close {
					display: flex;
					justify-content: center;
					padding: 10rpx 0;
					box-sizing: border-box;
					color: #0c99f2;
					font-size: 38rpx;
					font-weight: bold;
				}
			}
		}

		.c_footer {
			display: flex;
			padding: 20rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;

			.btn-c,
			.btn-p {
				width: 40%;
				font-size: 32rpx;
			}

			.btn-c {
				background-color: #ffffff;
			}

			.btn-p {
				background-color: #0c99f2;
				color: #ffffff;
			}
		}
	}

	.line {
		width: 100%;
		padding: 0 20rpx;
		margin-top: 20rpx;
		box-sizing: border-box;
		height: 1rpx;
		border-bottom: 1px solid #D9D9D9;
	}

	.check-box {
		width: 50rpx;
	}
</style>
