<template>
	<view class="quality-testing">
		<view :style="{height:statusHeight + 'px'}" />
		<view class="top">
			<view class="logo">
				<image src="../../static/qualityTesting/image.png"></image>
			</view>
			<view class="num-control">
				<template v-if="isScanCode">	
					<view class="control-info">
						<view>共计：{{mesReworkInfoList.length}}</view>
					</view>
				</template>
				<image class="back" src="../../static/qualityTesting/back.png" @click="back" />
			</view>
		</view>
		<view class="QR-main" v-if="!isScanCode">
			<view class="QR-code-box">
				<image class="QR-code" src="../../static/qualityTesting/QR-code.png"></image>
				<view class="tip">请扫返修二维码</view>
			</view>
		</view>
		<view class="main" v-else>
			<view class="info">
				<view class="info-box">
					<view class="title"><view/><text>生产单信息</text></view>
					<view style="font-weight: bold;">{{mesProduceQualityVO.productOrderNum}}</view>
					<view><text class="lab">款号：</text>{{mesProduceQualityVO.proNum}}</view>
					<view><text class="lab">款名：</text>{{mesProduceQualityVO.name}}</view>
					<view><text class="lab">数量：</text>{{mesProduceQualityVO.qtyFinal}}</view>
					<view><text class="lab">质检：</text>{{mesProduceQualityVO.qualifiedNumber}} / {{mesProduceQualityVO.qualityInspectionNumber}}</view>
					<view><text class="lab">合格率：</text>{{(mesProduceQualityVO.percentPass * 100).toFixed(2)}} %</view>
				</view>
				<view class="info-box">
					<view class="title"><view/><text>组码信息</text></view>
					<view style="font-weight: bold;">{{mesGroupCodeDto.groupCodeNum}}</view>
					<view><text class="lab">颜色：</text>{{mesGroupCodeDto.proColor}}</view>
					<view><text class="lab">尺码：</text>{{mesGroupCodeDto.proSize}}</view>
					<view><text class="lab">数量：</text>{{mesGroupCodeDto.number}}</view>
				</view>
			</view>
			<view class="main-function">
				<scroll-view class="scroll-view-y" scroll-y >
					<view class="repair">
						<view class="repair-box" v-for="(item,index) in mesReworkInfoList" :key="item.id">
							<view class="repair-title">序号{{index + 1}}</view>
							<view class="repair-steps">
								<view class="repair-icon">
									<view class="repair-i">
										<image src="../../static/qualityTesting/dui.png" />
									</view>
									<view class="repair-hr" :style="{borderColor: item.reworkStatus == 0? '#D8D8D8' : '#0C99F2' }" />
									<view class="repair-i" :class="list[item.reworkStatus]">
										<image src="../../static/qualityTesting/dui.png" />
									</view>
								</view>
								<view class="repair-info">
									<text>返修</text>
									<text v-if="item.reworkStatus == 2">报废</text>
									<text v-else-if="item.reworkStatus == 3">取消</text>
									<text v-else>确认</text>
								</view>
							</view>
							<view class="repair-message">
								<scroll-view class="repair-tags-y" scroll-y>
									<view class="repair-tags">
										<view class="repair-tag" v-for="(i,indey) in item.defectsInfoStr" :key="indey">{{i}}</view>
									</view>
								</scroll-view>
								<image v-if="item.mesReworkFileDTOList" :src="`http://${item.mesReworkFileDTOList[0].path}`" @click="previewImage(`http://${item.mesReworkFileDTOList[0].path}`)" />
								<image v-else src="../../static/qualityTesting/default.png" @click="previewImage('../../static/qualityTesting/default.png')" />
							</view>
							<view class="repair-control">
								<view class="control-info">
									<view ><text style="color: #B8B8B8;">检：</text>{{item.qualityName}}</view>
									<view class="control-time">{{item.createDate}}</view>
								</view>
								<view class="control-btn">
									<view class="control-btn-flex" v-if="item.reworkStatus == 0">
										<view class="cancel" @click="changeStatus(item.id, 3, index)">取消</view>
										<view class="fail" @click="changeStatus(item.id, 2, index)">报废</view>
										<view class="confirm" @click="changeStatus(item.id, 1, index)">确认</view>
									</view>
									<view class="control-tip confirm" v-else-if="item.reworkStatus == 1">已确认</view>
									<view class="control-tip fail" v-else-if="item.reworkStatus == 2">已报废</view>
									<view class="control-tip cancel" v-else>已取消</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view class="bottom">
			<view>
				<text style="margin-right: 40rpx;"><text class="lab">检验员：</text>{{employeeName?employeeName:'未绑定'}}</text>
				<text><text class="lab">班组：</text>{{group}}</text>
			</view>
<!-- 			<view>
				<text style="margin-right: 60rpx;">V 1.0.1</text>
				<text>IP：192.168.1.88</text>
			</view> -->
			<view>{{nowDate}}</view>
		</view>
	</view>
</template>

<script>
	import  Api from '../../service/api'
	import {KEY_MAP} from "../../constant/index.js"
	import {formateDate} from "../../utils/index.js"
	const longyoungKeyEventListen = uni.requireNativePlugin('longyoung-KeyEventListen')
	var timer;
	var preKeyCode = '';
	var allKeyCodeTemp = '';
	export default {
		data() {
			return {
				timer:'',
				nowDate:'',
				list: ['repair','confirm','fail','cancel'],
				statusHeight:'',
				isScanCode: false,
				employeeName:'',
				group:'',
				mesProduceQualityVO:{},//生产单信息
				mesGroupCodeDto:{},		//组码信息
				mesReworkInfoList:[],	//返修数组
				// 扫码信息
				tag: "1", //不必理会，固定 1 就好,
				resultStrFinal: null
			}
		},
		onLoad() {
			// 清空数据
			this.resetAllInfo()
			
			// 刷新当前时间
			this.timer = setInterval(()=>{
				this.nowDate = formateDate()
			}, 1000)
			
			let res = uni.getSystemInfoSync()
			// 获取状态栏高度
			this.statusHeight = res.statusBarHeight

			// 获取用户信息
			this.getUserInfo()

			// 开启扫码监听事件
			this.setOnKeyEventListener()
			// this.getInfo('PD20220812090140317-16-M(170/92A)-10-01')
		},
		onUnload(){
			//取消所有监听
			longyoungKeyEventListen.disableAllOnKeyEventListenerLy({}, result => {
				if (result && result.return_code == 'SUCCESS') {
					console.log("取消所有监听成功")
				}
			});
			// 取消定时器
			clearInterval(timer)
			this.timer = ''
			this.nowDate = ''
			this.isScanCode = false
		},
		methods: {
			// 重置信息
			resetAllInfo(){
				this.mesProduceQualityVO = {}
				this.mesGroupCodeDto = {}
				this.mesReworkInfoList = []
				this.resultStrFinal = null
			},
			// 获取检验员和班组信息
			async getUserInfo(){
				// 获取检验员
				let username = await Api.productionGetAdmin()
				if(username.code=="0"){
					this.employeeName = username.data.realName
				}
				let group = await Api.groupInfo()
				if(group.code=="0"){
					this.group = group.data.teamName
				}
			},
			// 监听
			setOnKeyEventListener() {
				let that = this;
				//设置监听，可设置多个，回调按 tag 区分哪个监听返回。
				longyoungKeyEventListen.setOnKeyEventListenerLy({
					tag: that.tag //不必理会，固定 1 就好
				}, result => {
					if (result && result.return_code == 'SUCCESS') {
						if (result.return_type == 'dataBack') { //return_type=dataBack是返回数据标识，返回的数据在此获取
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
							// 判断是否反复扫码
							if(this.isScanCode){
								uni.showModal({
									title: '重复扫码，是否删替换所有返修信息？',
									success: (result) => {
										if (result.confirm) {
											this.getInfo(decodeURI(that.resultStrFinal))
										}
									}
								})
							} else {
								this.getInfo(decodeURI(that.resultStrFinal))
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
			// 获取信息请求
			async getInfo(reworkCode){
				let res = await Api.mesRepairInfo({reworkCode})
				if (res.code === 0) {
					this.resetAllInfo()
					uni.showToast({
						title: '扫描返工码成功！',
						icon: 'none',
						duration: 3000
					})
					this.isScanCode = true
					this.mesProduceQualityVO = res.data.mesProduceQualityVO
					this.mesGroupCodeDto = res.data.mesGroupCodeDto
					this.mesReworkInfoList = res.data.mesReworkInfoList
				}else {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 3000
					})
				}
			},
			// 返回
			back(){
				uni.navigateBack()
			},
			// 预览图片
			previewImage(url){
				uni.previewImage({
					current: url,
					urls:[url]
				})
			},
			// 质检提交
			changeStatus(id,type,index){
				let typeList = ['返修','确认','报废','取消']
				let urlList = ['','mes/mesreworkinfo/updateQualityInspectionStatus','mes/mesreworkinfo/scrapRework','mes/mesreworkinfo/cancelRework']
				uni.showModal({
					title: `${typeList[type]} 返修？`,
					success: (result) => {
						if (result.confirm) {
							Api.updateRepairStatus(urlList[type],{id}).then((res)=>{
								if(res.code === 0){
									uni.showToast({
										title: '修改成功！',
										icon: 'none',
										duration: 3000
									})
									this.mesReworkInfoList[index].reworkStatus = type
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none',
										duration: 3000
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
.del-top{
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 0;
		top: 0;
		span{
			position: absolute;
			color: #FFFFFF;
			font-size: 28rpx;
			left: 75%;
			top: 25%;
			line-height: 28rpx;
			transform: translate(-50%,-50%);
			z-index: 1;
		}
		image{
			width: 40rpx;
			height: 40rpx;
		}
	}

.lab{
	color: #DDDDDD;
}
.quality-testing{
	width: 100%;
	height: 100%;
	background-color: #0576BE;
	box-sizing: border-box;
	.top{
		display: flex;
		margin-bottom: 16rpx;
		.logo{
			min-width: 440rpx;
			height: 120rpx;
			background: #0C99F2;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 16rpx;
			image{
				width: 320rpx;
				height: 52rpx;
			}
		}
		.num-control{
			width: calc(100vw - 456rpx);
			height: 120rpx;
			background: #0C99F2;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			.control-info{
				font-size: 44rpx;
				color: #FFFFFF;
				display: flex;
				justify-content: space-around;
				flex-wrap: nowrap;
				margin-left: 20rpx;
			}
			.back{
				position: absolute;
				width: 64rpx;
				height: 50rpx;
				// left: calc(100% - 84rpx);
				right: 0;
				margin-right: 20rpx;
			}
		}
	}
	
	.QR-main{
		width: 100%;
		height: calc(100vh - 120rpx - 48rpx - 32rpx - 48rpx);
		background: #0C99F2;
		margin-bottom: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.QR-code-box{
			width: 300rpx;
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
				color: #E2E2E2;
			}
		}
	}
	.main{
		display: flex;
		margin-bottom: 16rpx;
		.info{
			min-width: 440rpx;
			max-width: 440rpx;
			height: calc(100vh - 120rpx - 48rpx - 32rpx - 48rpx);
			background: #0C99F2;
			color: #FFFFFF;
			font-size: 32rpx;
			margin-right: 16rpx;
			overflow: hidden;
			.info-box{
				margin: 12rpx 20rpx 0 20rpx;
				display: flex;
				flex-direction: column;
				.title{
					height: 50rpx;
					font-size: 40rpx;
					font-weight: bold;
					display: flex;
					view{
						width: 8rpx;
						height: 36rpx;
						margin-right: 15rpx;
						border-radius: 4rpx;
						margin-top: 10rpx;
						background-color: #FFFFFF;
					}
				}
				view{
					margin-bottom: 14rpx;
				}
			}
		}
		.info-box:first-child{
			border-bottom: 3rpx dashed #E1E1E1;
		}
		.main-function{
			width: calc(100vw - 456rpx);
			height: calc(100vh - 120rpx - 48rpx - 32rpx - 48rpx);
			padding: 20rpx;
			background: #0C99F2;
			.scroll-view-y{
				width: calc(100vw - 456rpx - 40rpx);
				height: calc(100vh - 120rpx - 48rpx - 32rpx - 48rpx - 40rpx);
				.repair{
					width: calc(100vw - 456rpx - 40rpx);
					height: calc(100vh - 120rpx - 48rpx - 32rpx - 48rpx - 40rpx);
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					.repair-box{
						width: calc(100%/2 - 10rpx);
						height: 330rpx;
						margin-bottom: 14rpx;
						padding: 12rpx 20rpx;
						background-color: #FFFFFF;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						border-radius: 4rpx;
						.repair-title{
							width: 100%;
							height: 44rpx;
							font-size: 32rpx;
							line-height: 44rpx;
							color: #2C2B2B;
						}
						.repair-steps{
							width: 100%;
							height: 72rpx;
							.repair-icon{
								width: 100%;
								height: 32rpx;
								display: flex;
								.repair-hr{
									width: calc(100% - 64rpx);
									height: 16rpx;
									border-bottom: 4rpx solid #D8D8D8;
								}
								.repair-i{
									display: inline-block;
									width: 32rpx;
									height: 32rpx;
									border-radius: 16rpx;
									background-color: #0C99F2;
									display: flex;
									justify-content: center;
									align-items: center;
									image{
										width: 17rpx;
										height: 11rpx;
									}
								}
								.repair{
									background-color: #D8D8D8;
								}
								.confirm{
									background-color: #0C99F2;
								}
								.fail{
									background-color: #E02020;
								}
								.cancel{
									background-color: #54A004;
								}
							}
							.repair-info{
								width: 100%;
								height: 40rpx;
								font-size: 24rpx;
								line-height: 40rpx;
								color: #6D6D6D;
								display: flex;
								justify-content: space-between;
							}
						}
						.repair-message{
							width: 100%;
							height: 88rpx;
							display: flex;
							justify-content: space-between;
							.repair-tags-y{
								width: calc(100% - 110rpx);
								height: 88rpx;
								border-radius: 8rpx;
								border: 1px solid #E4E4E4;
								// margin-right: 20rpx;
								.repair-tags{
									width: 100%;
									height: 88rpx;
									padding: 8rpx 14rpx;
									display: flex;
									justify-content: flex-start;
									flex-wrap: wrap;
									.repair-tag{
										height: 40rpx;
										padding: 0 14rpx;
										margin-right: 14rpx;
										margin-bottom: 10rpx;
										line-height: 40rpx;
										border: 1px solid #E4E4E4;
										font-size: 24rpx;
										color: #6D6D6D;
									}
								}	
							}
							image{
								width: 88rpx;
								height: 88rpx;
							}
						}
						.repair-control{
							width: 100%;
							height: 56rpx;
							display: flex;
							justify-content: space-between;
							.control-info{
								width: 340rpx;
								height: 56rpx;
								line-height: 30rpx;
								font-size: 24rpx;
								color: #6D6D6D;
								.control-time{
									margin-left: 45rpx;
								}
							}
							.control-btn{
								width: 330rpx;
								.control-btn-flex{
									display: flex;
									justify-content: space-between;
									view{
										width: 100rpx;
										height: 56rpx;
										font-size: 28rpx;
										line-height: 56rpx;
										text-align: center;
										color: #FFFFFF;
										border-radius: 8rpx;
									}
									.cancel{
										background-color: #54A004;
									}
									.fail{
										background-color: #E02020;
									}
									.confirm{
										background-color: #1794D1;
									}
								}
								.control-tip{
									font-size: 28rpx;
									line-height: 56rpx;
									// font-weight: bold;
									text-align: right;
								}
								.cancel{
									color: #54A004;
								}
								.fail{
									color: #E02020;
								}
								.confirm{
									color: #1794D1;
								}
							}
						}
					}
				}
			}
		}
	}
	
	.bottom{
		width: 100%;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		background: #0C99F2;
		font-size: 24rpx;
		line-height: 48rpx;
		color: #FFFFFF;
		padding: 0 20px;
	}
}

</style>
