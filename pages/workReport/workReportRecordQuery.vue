<template>
	<view class="page-list">
		<view :style="{height:statusHeight + 'px'}" />
		<view class="top">
			<view class="top-back">
				<u-icon name="arrow-left" size="50" color="#fff" @click="back"></u-icon>
			</view>
			<view class="top-title">报工记录查询</view>
		</view>
		<view class="QR-main" v-if="total === null">
			<view class="QR-code-box">
				<image class="QR-code" src="../../static/qualityTesting/QR-code.png"></image>
				<view class="tip">请扫描二维码</view>
			</view>
		</view>
		<view class="cart-main" v-else>
			<view class="cart-left"> 
				<view class="left-title">扎包信息</view>
				<view class="left-info">
					<view>包号：{{info.packageNum}}</view>
					<view>颜色：{{info.colorName}}</view>
					<view>尺码：{{info.sizeCode}}</view>
					<view>数量：{{info.count}}</view>
				</view>
			</view>
			<view class="cart-right">
				<view class="cart">
					<view class="cart-tip" v-if="dataList.length === 0">———  暂无数据  ———</view>
					<table class="cart-table" v-else>
					  <thead>
						<tr>
							<th class="cart-table-th" style="width: 60rpx;" v-if="checkPermission($store.state.permissions, 'mes:mesengineeringmanagement:recordDelete')"></th>
							<th class="cart-table-th">姓名</th>
							<th class="cart-table-th">工段</th>
							<th class="cart-table-th">工序</th>
							<th class="cart-table-th">数量</th>
							<th class="cart-table-th">提交时间</th>
							<th class="cart-table-th" v-if="checkPermission($store.state.permissions, 'mes:mesengineeringmanagement:recordDelete')">操作</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-for="(item, index) in dataList" :key="index">
							<td class="cart-table-td" style="width: 60rpx;" v-if="checkPermission($store.state.permissions, 'mes:mesengineeringmanagement:recordDelete')">
								<checkbox-group @change='e=>checkboxChange(e,item.id)'>
									<checkbox :value="item.id" :checked="deleteList.includes(item.id)" />
								</checkbox-group>
							</td>
							<td class="cart-table-td">
								<view>{{item.realName}}</view>
							</td>
							<td class="cart-table-td">
								<view>{{item.section}}</view>
							</td>
							<td class="cart-table-td">
								<view>{{item.productName}}</view>
							</td>
							<td class="cart-table-td">
								<view>{{item.count}}</view>
							</td>
							<td class="cart-table-td">
								<view>{{item.engineeringManagementDate}}</view>
							</td>
							<td class="cart-table-td" v-if="checkPermission($store.state.permissions, 'mes:mesengineeringmanagement:recordDelete')">
								<button type="warn" class="btn" style="width: 140rpx;background-color: #FF4A4A;" @click="deleteItem(item)">删除</button>
							</td>
						</tr>
					  </tbody>
					</table>
				</view>
				<view class="pages">
					<button type="warn"
						:disabled="deleteList.length === 0"
						class="btn"
						style="position: absolute;left:40rpx;background-color: #FF8F48;"
						@click='deleteItem(null)'
						v-if="checkPermission($store.state.permissions, 'mes:mesengineeringmanagement:recordDelete')"
					>
						批量删除
					</button>
					<uni-pagination name="pagination" :total="total" v-model="dataForm.page" @change="getDataList" />
				</view>
			</view>
		</view>
		<view class="bottom">
			<view>
				<text style="margin-right: 40rpx;"><text class="lab">姓名：</text>{{employeeName?employeeName:'未绑定'}}</text>
			</view>
			<!-- <view><text class="lab">IP：</text>{{ip}}</view> -->
			<view>{{nowDate}}</view>
		</view>
	</view>
</template>

<script>
	import  Api from '../../service/api'
	import {formateDate} from "../../utils/index.js"
	import { checkPermission } from '../../utils/index.js'
	import {KEY_MAP} from "../../constant/index.js"
	const longyoungKeyEventListen = uni.requireNativePlugin('longyoung-KeyEventListen')
	
	let message = (msg) => uni.showToast({icon:'none', duration:3000, title: msg})
	var preKeyCode = '';
	var allKeyCodeTemp = '';
	
	export default {
		data() {
			return {
				checkPermission,
				total: null, //总数
				timer:'', //时间
				nowDate:'',
				statusHeight:'',
				employeeName:'',
				ip:'',
				group:'',
				dataList: [],//数据列表
				deleteList: [], //删除的列表
				info: {}, //左侧信息对象
				dataForm:{ //搜索内容
					page: 1, //当前页数
					limit: 10, 	//每页数量
					packageCode: '' //扫码信息
				},
				resultStr: ''
			}
		},
		onShow() {
			// 刷新当前时间
			this.timer = setInterval(()=>{
				this.nowDate = formateDate()
			}, 1000)
			
			let res = uni.getSystemInfoSync()
			// 获取状态栏高度
			this.statusHeight = res.statusBarHeight
			// 获取ip
			this.ip = uni.getStorageSync('pda-api')
			
			this.getUserInfo()
			
			// 开启监听
			// this.getDataList()
			this.setOnKeyEventListener()
		},
		onUnload() {
			//取消所有监听
			clearInterval(this.timer)
			this.timer = ''
			this.nowDate = ''
			this.disableAllOnKeyEventListener()
		},
		methods: {
			setOnKeyEventListener() {
				let that = this;
				//设置监听，可设置多个，回调按 tag 区分哪个监听返回。
				longyoungKeyEventListen.setOnKeyEventListenerLy({
					tag: 1 //不必理会，固定 1 就好
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
							that.dataForm.packageCode = allKeyCodeTemp; //最终拼接的字符串赋值
							allKeyCodeTemp = '';
							preKeyCode = '';
							this.dataForm.page = 1
							this.getDataList()
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
			// 获取检验员和班组信息
			async getUserInfo(){
				// 获取检验员
				let username = await Api.productionGetAdmin()
				if(username.code=="0") this.employeeName = username.data.realName
			},
			// 获取列表详情
			async getDataList(){
				this.deleteList = []
				let res = await Api.getWorkReportRecordQueryList(this.dataForm)
				if (res.code == 0) {
					if(res.data.total === 0) message('此条码暂无报工记录！')
					this.total = res.data.mesEngineeringReportRecordDTOS.total
					this.dataList = res.data.mesEngineeringReportRecordDTOS.list
					this.info = res.data.mesOrderSubpackageItemDTO
				} else {
					message(res.msg)
				}
			},
			// 删除
			deleteItem(item){
				uni.showModal({
					title: '确认删除？',
					success: async (result) => {
						if (result.confirm) {
							let list = item ? [item.id] : this.deleteList
							let res = await Api.deleteIndividualWorkReportRecordList(list)
							if (res.code === 0) {
								message('删除成功')
								this.getDataList()
							} else {
								message('删除失败')
							}
						}
					}
				})
			},
			// 复选框
			checkboxChange(e,value){
				if(!!e.detail.value.length){
					this.deleteList.push(value)
				} else {
					this.deleteList = this.deleteList.filter(item => item !== value)
				}
			},
			// 返回
			back(){
				clearInterval(this.timer)
				this.timer = ''
				this.nowDate = ''
				this.disableAllOnKeyEventListener()
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="less">
/deep/.u-calendar-month__days__day__select__buttom-info{
	width: max-content;
	margin-left: 40rpx;
}
/deep/.uni-date__x-input{
	height: 68rpx;
}
.btn{
	padding: 0 30rpx;
	height: 60rpx;
	font-size: 32rpx;
	line-height: 60rpx;
	border-radius: 4rpx;
	text-align: center;
}
.page-list{
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	.top{
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 120rpx;
		background-color: #0C99F2;
		.top-title{
			font-size: 40rpx;
			color: #FFFFFF;
			display: flex;
			margin-left: 20rpx;
		}
		.top-back{
			position: absolute;
			 left: 0;
			 width: 100rpx;
			 height: 100rpx;
			 display: flex;
			 align-items: center;
			 justify-content: center;
		}
		.top-select{
			font-size: 28rpx;
			position: absolute;
			right: 40rpx;
			height: 70rpx;
			width: 240rpx;
			line-height: 70rpx;
			border: 1px solid rgba(0, 0, 0, 0.15);
			border-radius: 4rpx;
			background-color: #fff;
		}
	}
	.QR-main{
		width: 100%;
		height: calc(100vh - 120rpx - 48rpx - 140rpx);
		background: #fff;
		margin-bottom: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.QR-code-box{
			width: 500rpx;
			height: 300rpx;
			.QR-code{
				display: block;
				width: 180rpx;
				height: 180rpx;
				margin: 0 auto;
			}
			.tip{
				margin-top: 44rpx;
				text-align: center;
				font-size: 40rpx;
				color: #989898;
			}
		}
	}
	.cart-main{
		width: 100%;
		height: calc(100vh - 120rpx - 48rpx - 140rpx);
		padding: 20rpx;
		background-color: #e6ecf3;
		display: flex;
		justify-content: space-between;
		.cart-left{
			width: 240px;
			background: #F5F6F8;
			height: 100%;
			margin-right: 20rpx;
			padding: 20rpx;
			box-shadow: 3px 3px 5px #bababa;
			.left-title{
				font-size: 14px;
				font-weight: bold;
				line-height: 28rpx;
				border-left: 10rpx solid #3E8FF7;
				padding-left: 10rpx;
				margin-bottom: 20rpx;
			}
			.left-info{
				background-color: #fff;
				padding: 0 30rpx;
				view{
					padding: 30rpx 0;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #EAEAEA;
				}
				view:last-child{
					border-bottom: none;
				}
			}
		}
		.cart-right{
			flex: 1;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.cart{
				width: 100%;
				height: calc(100vh - 120rpx - 48rpx - 140rpx - 40rpx - 120rpx);
				background: #FFFFFF;
				padding: 40rpx;
				overflow: scroll;
				box-shadow: 3px 3px 5px #bababa;
				.cart-table{
					width: 100%;
					border-collapse: collapse;
					border-spacing: 0;
					margin-top: 30rpx;
					.cart-table-th{
						min-width: min-content;
						height: 80rpx;
						color: #666666;
						border: solid 2px #EBEBEB;
						vertical-align: center;
						font-size: 30rpx;
						text-align: center;
						background-color: #fafafa;
					}
					.cart-table-td{
						// min-height: 180rpx;
						border: solid 2px #EBEBEB;
						color: #666666;
						padding: 10rpx;
						vertical-align: center;
						.cart-repair-list{
							height: 180rpx;
							overflow: scroll;
						}
						view{
							text-align: center;
						}
					}
				}
				.cart-tip{
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 36rpx;
					font-weight: bold;
					color: #989898;
				}
			}
			.pages{
				position: relative;
				height: 100rpx;
				width: 100%;
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 1px 3px 5px #bababa;
				/deep/.uni-pagination__num-tag{
					width: 60rpx;
					height: 60rpx;
				}
				/deep/.page--active{
					background-color: #0c99f2;
				}
				/deep/.uni-pagination--enabled{
					background-color: #d6d6d6;
				}
				/deep/.uni-pagination--disabled{
					background-color: #e6e6e6;
				}
			}
		}
	}
	.bottom{
		width: 100%;
		height: 140rpx;
		display: flex;
		justify-content: space-between;
		background: #FFF;
		font-size: 24rpx;
		line-height: 140rpx;
		font-size: 28rpx;
		padding: 0 20px;
		border-top: 1px solid #e6e6e6;
	}
}
</style>
