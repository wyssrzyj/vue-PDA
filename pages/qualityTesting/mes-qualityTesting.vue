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
						<view>返工：</view>
						<image class="btn" src="../../static/qualityTesting/decrease.png" @click="decrease"/>
						<input class="inp-num" type="number" v-model="dataForm.reworkNum" disabled />
						<image class="btn" src="../../static/qualityTesting/increase.png" @click="increase"/>
						<view class="qualified">
							合格：{{dataForm.qualifiedNum}}
						</view>
					</view>
					<button class="submit-btn" type="default" @click="submit">提交</button>
				</template>
				<image class="back" src="../../static/qualityTesting/back.png" @click="back"></image>
			</view>
		</view>
		<view class="QR-main" v-if="!isScanCode">
			<view class="QR-code-box">
				<image class="QR-code" src="../../static/qualityTesting/QR-code.png"></image>
				<view class="tip">请扫组码二维码</view>
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
				<view class="message-box">
					<scroll-view class="scroll-view-x" scroll-x >
						<!-- 循环 -->
						<view class="scroll-box" v-for="(item,index) in dataForm.mesReworkInfoList" :class="{'active-board': reworkIndex === index}" :key="item.ids" @click="changeRework(index)">
							<view class="bookmark" v-if="reworkIndex === index">
								<span>{{index+1}}</span>
								<image src="../../static/qualityTesting/bookmark-active.png" />
							</view>
							<view class="bookmark" v-else>
								<span>{{index+1}}</span>
								<image src="../../static/qualityTesting/bookmark.png" />
							</view>
							<view class="close" :class="{'active-board': reworkIndex === index}" @click="deleteRework(index)">x</view>
							<view class="same-tags">
								<scroll-view class="scroll-tag-y1" scroll-y>
									<view class="select-tag-box">
										<view class="select-tag" v-for="(flaw,indey) in item.defectsInfoList" :key="indey">
											<view class="del-top" @click="deleteDefect(index,indey)">
												<span>x</span>
												<image src="../../static/qualityTesting/delect.png"/>
											</view>
											<view class="select-message">{{flaw}}</view>
										</view>
									</view>
								</scroll-view>
							</view>
							<!-- 图片上传 -->
							<view class="upload">
								<scroll-view class="scroll-upload-x" scroll-x >
									<view class="upload-image" v-for="(img,indez) in item.mesReworkFileDTOList" :key="indez">
										<image class="img" :src="`http://${img.path}`" @click="previewImage(img.path,item.mesReworkFileDTOList)" />
										<view class="del-top" @click="deleteImg(index,indez)">
											<span>x</span>
											<image src="../../static/qualityTesting/delect.png"/>
										</view>
									</view>
									<image class="upload-btn" src="../../static/qualityTesting/upload.png" @click="uploadImage(index)" />
								</scroll-view>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- tab切换 -->
				<view class="tab-tag-box">
					<view class="tab-box">
						<scroll-view class="scroll-tab-x" scroll-x>
							<view class="tab" v-for="(item,index) in mesDefectsGruopDtoList" :key="index" :class="{'active-background':tabIndex === index}" @click="changeTab(index)">
								<span>{{item.defectsGroupName}}</span>
							</view>
						</scroll-view>
					</view>
					<view class="tag-box" v-for="(item,indey) in mesDefectsGruopDtoList" :key="indey" v-show="tabIndex === indey">
						<scroll-view v-if="item.isCustom === 0" class="scroll-tag-y2" scroll-y>
							<view class="tags">
								<view class="tag" v-for="(defect,indez) in item.defectsStr" :key="indez" @click="handleTag(defect)">
									<view class="tag-message">{{defect}}</view>
								</view>
							</view>
						</scroll-view>
						<view v-else class="diy">
							<view class="diy-control">
								<input class="diy-inp" type="text" v-model="diyTag">
								<button class="diy-btn" type="default" @click="submitDiyTag(item)">提交</button>
							</view>
							<scroll-view class="scroll-tag-y3" scroll-y>
								<view class="tags">
									<view class="tag" v-for="(defect,indez) in item.defectsStr" :key="indez">
										<view class="del-top" @click="deleteDiyTag(item,indez,defect)">
											<span>x</span>
											<image src="../../static/qualityTesting/delect.png"/>
										</view>
										<view class="tag-message" @click="handleTag(defect)">{{defect}}</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
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
	var preKeyCode = '';
	var allKeyCodeTemp = '';
	export default {
		data() {
			return {
				timer:'',
				nowDate:'',
				statusHeight:'',
				isScanCode:false,
				employeeName:'',
				group:'',
				mesProduceQualityVO:{},//生产单信息
				mesGroupCodeDto:{},		//组码信息
				mesDefectsGruopDtoList:[],//标签数组
				// 返回数据
				dataForm:{
					groupCodeId: '',
					produceOrderId: '',
					qualifiedNum: '',	//合格数量
					reworkNum: '',		//返工数量
					totalNum:'',
					groupCodePrinthistId:'',
					mesReworkInfoList:[]		//返工的单子
				},
				tabIndex:0,		//tab索引
				reworkIndex:0,	//返工索引
				diyTag:'',		//自定义输入框
				// 扫码信息
				tag: "1", //不必理会，固定 1 就好,
				resultStrFinal: null
			}
		},
		onLoad() {
			// 重置数据
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
			// this.getInfo('PD20220621124716395-00FF-XS-99')
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
			// 重置所有信息
			resetAllInfo(){
				this.mesProduceQualityVO = {}
				this.mesGroupCodeDto = {}
				this.mesDefectsGruopDtoList = []
				this.dataForm = {
					groupCodeId: '',
					produceOrderId: '',
					qualifiedNum: '',
					reworkNum: '',
					totalNum:'',
					groupCodePrinthistId:'',
					mesReworkInfoList:[]
				}
				this.tabIndex = 0,
				this.reworkIndex = 0,
				this.diyTag = ''
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
			//扫码监听事件
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
									title: '重复扫码，是否删替换所有组码信息？',
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
			async getInfo(groupCode){
				let res = await Api.mesqualityInspection({groupCode})
				if (res.code === 0) {
					if((res.data.qualifiedNum + res.data.mesProduceQualityVO.qualityInspectionNumber) > res.data.mesProduceQualityVO.qtyFinal){
						uni.showToast({
							title: '质检数量已超过生产单数量！',
							icon: 'none',
							duration: 3000
						})
						return
					}
					this.resetAllInfo()
					uni.showToast({
						title: '扫描组码成功！',
						icon: 'none',
						duration: 3000
					})
					this.isScanCode = true
					this.mesProduceQualityVO = res.data.mesProduceQualityVO
					this.mesGroupCodeDto = res.data.mesGroupCodeDto
					this.mesDefectsGruopDtoList = res.data.mesDefectsGruopDtoList
					
					this.dataForm.groupCodeId = res.data.groupCodeId
					this.dataForm.produceOrderId = res.data.produceOrderId
					this.dataForm.qualifiedNum = res.data.qualifiedNum
					this.dataForm.reworkNum = res.data.reworkNum
					this.dataForm.totalNum = res.data.qualifiedNum
					this.dataForm.groupCodePrinthistId = res.data.groupCodePrinthistId
				}else {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 3000
					})
				}
			},
			// 获取uuid
			getUuid() {
			  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			    const r = (Math.random() * 16) | 0,
			      v = c == "x" ? r : (r & 0x3) | 0x8;
			    return v.toString(16);
			  });
			},
			decrease(){
				if(this.dataForm.reworkNum > 0){
					this.deleteRework(this.dataForm.reworkNum - 1,'是否删除最后一条返工？')
				}
			},
			increase(){
				if(this.dataForm.reworkNum < this.dataForm.totalNum){
					this.dataForm.reworkNum += 1
					this.dataForm.qualifiedNum -= 1
					this.dataForm.mesReworkInfoList.push({
						ids:this.getUuid(),
						defectsInfo:'',
						defectsInfoList:[],
						mesReworkFileDTOList:[]
					})
				}
			},
			// 返回
			back(){
				uni.navigateBack()
			},
			// tab切换
			changeTab(index){
				this.tabIndex = index
			},
			//点击一个tag
			  handleTag(tag){
				if(this.dataForm.mesReworkInfoList.length === 0) {
					uni.showToast({
						title: '请先选择返工单！',
						icon: 'none',
						duration: 2000
					})
					return false
				} else {
					let defectsInfoList = this.dataForm.mesReworkInfoList[this.reworkIndex].defectsInfoList
					defectsInfoList.push(tag)
					this.dataForm.mesReworkInfoList[this.reworkIndex].defectsInfo = defectsInfoList.toString()
					return true
				}
			},
			//切换返工
			changeRework(index){
				this.reworkIndex = index
			},
			//删除某个返工
			deleteRework(index,message){
				// 如果有标签或者图片则提示是否删除
				if(this.dataForm.mesReworkInfoList[index].defectsInfoList.length === 0 && this.dataForm.mesReworkInfoList[index].mesReworkFileDTOList.length === 0) {
					this.dataForm.reworkNum -= 1
					this.dataForm.qualifiedNum += 1
					this.dataForm.mesReworkInfoList.splice(index,1)
					setTimeout(() => {
						this.reworkIndex = 0
					},10)
				} else {
					uni.showModal({
						title: message?message:'是否删除此返工？',
						success: (res) => {
							if (res.confirm) {
								this.reworkIndex = 0
								this.dataForm.reworkNum -= 1
								this.dataForm.qualifiedNum += 1
								this.dataForm.mesReworkInfoList.splice(index,1)
							}
						}
					})
				}
			},
			// 删除某个返工的一个tag
			deleteDefect(reworkIndex,index){
				let defectsInfoList = this.dataForm.mesReworkInfoList[reworkIndex].defectsInfoList
				defectsInfoList.splice(index,1)
				this.dataForm.mesReworkInfoList[reworkIndex].defectsInfo = defectsInfoList.toString()
			},
			// 上传图片
			uploadImage(index){
				let imgList = this.dataForm.mesReworkInfoList[index].mesReworkFileDTOList
				if (imgList.length >= 9) {
					uni.showToast({
						title: '最多只能上传9张图片！',
						icon: 'none',
						duration: 3000
					})
					return
				}
				uni.chooseImage({
					// count: 9 - imgList,
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: async (imgInfo) => {
						let res = await Api.uploadFile({
							filePath: imgInfo.tempFilePaths[0]
						})
						if(res.code === 0){
							console.log(res)
							imgList.push({
								fileName: res.data.fileName,
								path: res.data.src,
								thumbnailPath: res.data.thumbnailPath
							})
						} else {
							uni.showToast({
								title: '上传图片失败！',
								icon: 'none',
								duration: 2000
							})
						}
					}
				});
			},
			// 预览图片
			previewImage(url,mesReworkFileDTOList){
				uni.previewImage({
					current: url,
					indicator: 'number',
					urls: mesReworkFileDTOList.map(item => {
						return `http://${item.path}`
					})
				})
			},
			// 新增自定义tag
			async submitDiyTag(item){
				if(this.diyTag.trim()){
					let result = this.handleTag(this.diyTag)
					if(result){
						let res = await Api.updateTag({customs:this.diyTag})
						if (res.code === 0) {
							item.defectsStr.push(this.diyTag)
							this.mesDefectsGruopDtoList[0].defectsStr.push(this.diyTag)
							this.diyTag = ""
						}else {
							uni.showToast({
								title: '提交失败！',
								icon: 'none',
								duration: 3000
							})
						}
					}
				}
			},
			//删除自定义tag
			deleteDiyTag(item,index,defect){
				uni.showModal({
					title: '是否删除此标签？',
					success: async (result) => {
						if (result.confirm) {
							let res = await Api.deleteTag({customs:defect})
							if (res.code === 0) {
								item.defectsStr.splice(index,1)
							}else {
								uni.showToast({
									title: '删除失败！',
									icon: 'none',
									duration: 3000
								})
							}
						}
					}
				})
			},
			//删除某个返工的一个图片
			deleteImg(reworkIndex,index){
				this.dataForm.mesReworkInfoList[reworkIndex].mesReworkFileDTOList.splice(index,1)
			},
			// 质检提交
			submit(){
				// 过滤掉空的返工
				let reworkInfoList = this.dataForm.mesReworkInfoList.filter( item => {
					if(item.defectsInfoList.length !== 0 || item.mesReworkFileDTOList.length !== 0) {
						return true
					}
				})
				console.log(reworkInfoList,'==============')
				if(reworkInfoList.length === 0){
					uni.showToast({
						title: '返工信息不能为空！',
						icon: 'none',
						duration: 3000
					})
					return
				} else {
					this.dataForm.mesReworkInfoList = reworkInfoList
					this.dataForm.reworkNum = reworkInfoList.length
					this.dataForm.qualifiedNum = this.dataForm.totalNum - reworkInfoList.length
				}
				Api.submitMesqualit({...this.dataForm}).then((res)=>{
					if(res.code === 0){
						uni.showToast({
							title: '提交成功！',
							icon: 'none',
							duration: 3000
						})
						this.isScanCode = false
						this.resetAllInfo()
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
.active-background{
	background: #F28F31!important;
}
.active-board{
	border: 4rpx solid #F28F31!important;
	color: #F28F31!important;
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
			justify-content: flex-end;
			.control-info{
				font-size: 44rpx;
				color: #FFFFFF;
				display: flex;
				justify-content: space-around;
				margin-left: 20rpx;
				.btn{
					width: 56rpx;
					height: 56rpx;
				}
				.inp-num{
					width: 120rpx;
					height: 56rpx;
					border-radius: 4rpx;
					background: #0C99F2;
					border: 4rpx solid #FFFFFF;
					text-align: center;
					margin: 0 20rpx;
				}
				.qualified{
					margin-left: 40rpx;
				}
			}
			.submit-btn{
				margin-left: 100rpx;
				width: 180rpx;
				height: 72rpx;
				border-radius: 4rpx;
				background: #F28F31;
				color: #FFFFFF;
				font-size: 44rpx;
				line-height: 78rpx;
			}
			.back{
				width: 64rpx;
				height: 50rpx;
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
			overflow: hidden;
			.message-box{
				width: calc(100vw - 456rpx);
				height: 460rpx;
				background-color: #0C99F2;
				padding: 14rpx;
				margin-bottom: 16rpx;
				.scroll-view-x{
					height: 432rpx;
					white-space: nowrap;
					.scroll-box{
						height: 432rpx;
						width: 450rpx;
						overflow: hidden;
						display: inline-block;
						margin-right: 20rpx;
						border-radius: 4rpx;
						background-color: #FFFFFF;
						position: relative;
						border: 4rpx solid #AFAFAF;
						.bookmark{
							width: 90rpx;
							height: 60rpx;
							position: relative;
							span{
								position: absolute;
								z-index: 1;
								left: 50%;
								transform: translateX(-50%);
								line-height: 60rpx;
								color: #FFFFFF;
							}
							image{
								width: 90rpx;
								height: 60rpx;
							}
						}
						.close{
							position: absolute;
							top: 5rpx;
							right: 5rpx;
							width: 40rpx;
							height: 40rpx;
							border-radius: 20rpx;
							font-size: 28rpx;
							text-align: center;
							line-height: 34rpx;
							border: 4rpx solid #D8D8D8;
							color: #D8D8D8;	
						}
						.same-tags{
							width: 100%;
							height: 250rpx;
							padding: 14rpx;
							border-bottom: 2px dashed #E1E1E1;
							.scroll-tag-y1{
								height: 222rpx;
								.select-tag-box{
									width: 100%;
									height: 222rpx;
									display: flex;
									flex-wrap: wrap;
									align-content: flex-start;
									.select-tag{
										height: 72rpx;
										margin-right: 10rpx;
										padding: 0 30rpx;
										border-radius: 4rpx;
										background: #0C99F2;
										margin-bottom: 14rpx;
										position: relative;
										.select-message{
											font-size: 32rpx;
											line-height: 72rpx;
											text-align: center;
											color: #FFFFFF;
										}
									}
								}
							}
						}
						.upload{
							width: 100%;
							height: 116rpx;
							padding: 8rpx 14rpx;
							.scroll-upload-x{
								white-space: nowrap;
								height: 100rpx;
								.upload-image{
									display: inline-block;
									width: 100rpx;
									height: 100rpx;
									position: relative;
									margin-right: 6rpx;
									.delect{
										position: absolute;
										width: 28rpx;
										height: 28rpx;
										right: 0;
										top: 0;
									}
									.img{
										width: 100rpx;
										height: 100rpx;
									}
								}
								.upload-btn{
									display: inline-block;
									width: 100rpx;
									height: 100rpx;
									// margin-left: 6rpx;
								}	
							}
						}
					}
				}
			}
			.tab-tag-box{
				width: calc(100vw - 456rpx);
				height: calc(100vh - 460rpx - 120rpx - 48rpx);
				.tab-box{
					width: 100%;
					height: 64rpx;
					.scroll-tab-x{
						height: 64rpx;
						white-space: nowrap;
						.tab{
							box-sizing: content-box;
							display: inline-block;
							height: 64rpx;
							padding: 0 44rpx;
							background: #A3A3A3;
							color: #FFFFFF;
							font-size: 18px;
							line-height: 64rpx;
							border-radius: 16rpx 16rpx 0 0;
						}
					}
				}
				.tag-box{
					width: 100%;
					height: calc(100% - 64rpx);
					padding: 16rpx 0;
					background-color: #0C99F2;
					.scroll-tag-y2{
						height: calc(100% - 64rpx);
						.tags{
							width: 100%;
							height: calc(100% - 64rpx);
							display: flex;
							flex-wrap: wrap;
							align-content: flex-start;
							.tag{
								box-sizing: content-box;
								height: 80rpx;
								border-radius: 4rpx;
								padding: 0 30rpx;
								margin: 0 0 16rpx 16rpx;
								background: #4EB5F6;
								.tag-message{
									font-size: 36rpx;
									line-height: 80rpx;
									text-align: center;
									color: #FFFFFF;
								}
							}
						}
					}
					.diy{
						height: calc(100% - 64rpx);
						.diy-control{
							height: 90rpx;
							width: 100%;
							padding: 9rpx 16rpx;
							display: flex;
							.diy-inp{
								width: 340rpx;
								height: 72rpx;
								border: 4rpx solid #FFFFFF;
								
								border-radius: 4rpx;
								text-align: center;
								color: #FFFFFF;
							}
							.diy-btn{
								margin-left: 14rpx;
								width: 180rpx;
								height: 72rpx;
								border-radius: 4rpx;
								background: #F28F31;
								color: #FFFFFF;
								font-size: 44rpx;
								line-height: 78rpx;
							}
						}
						.scroll-tag-y3{
							height: calc(100% - 64rpx - 90rpx);
							.tags{
								width: 100%;
								height: calc(100% - 64rpx - 90rpx);
								display: flex;
								flex-wrap: wrap;
								align-content: flex-start;
								.tag{
									position: relative;
									height: 80rpx;
									border-radius: 4rpx;
									padding: 0 30rpx;
									margin: 0 0 16rpx 16rpx;
									background: #4EB5F6;
									.tag-message{
										font-size: 36rpx;
										line-height: 80rpx;
										text-align: center;
										color: #FFFFFF;
									}
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
