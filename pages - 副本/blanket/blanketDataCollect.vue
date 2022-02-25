<template>
	<view class="mainContent" @click="closeModal">
		<u-toast ref="uToast"></u-toast>
		
		<view class="search">
			<u-input
				v-model="scanValue"
				placeholder="请扫描布条码"
				prefixIcon="search"
				prefixIconStyle="font-size: 22px;color: #909399"
				clearable
				:disabled="isSearch"
			>
				<template slot="suffix">
					<u-icon 
						name="scan"
						size="80"
						@tap="onScanCode"
					></u-icon>
				</template>
			</u-input>
			<u-input 
				v-model="clothCodeValue"
				placeholder="请扫描布条码"
				disabled
			>	
				<u-text
					text="布条码:"
					slot="prefix"
					size="40"
					margin="0 10rpx 0 0"
					type="tips"
				></u-text>
			</u-input>
		</view>
		<view class="content">
			<view class="titleContent">
				<text class="title">收货数据</text>
				<text class="unit">数量单位：米</text>
			</view>
			<u-cell-group>
				<u-cell
					:value="materialColor"
					label="物料代码、颜色:" 
					center
					size="large"
				></u-cell>
				<u-cell
					:value="larghezza"
					label="幅宽(cm):" 
					center
					size="large"
				></u-cell>
				<u-cell
					:value="weight"
					label="克重(g/㎡):" 
					center
					size="large"
				></u-cell>
				<u-cell
					:value="sendQty"
					label="库存数量:" 
					center
					size="large"
				></u-cell>
				<u-cell
					:value="materialQtyPd"
					label="单耗:" 
					center
					size="large"
				></u-cell>
			</u-cell-group>
		</view>
		<view class="content" style="margin-top: 10px;">
			<view class="titleContent">
				<text class="title">铺布数据</text>
			</view>
			<u--form
				labelPosition="left"
				labelWidth="180"
				labelAlign="right"
				:model="modelData"
			>
				<u-form-item
					label="铺布层数:"
					prop="spreadClothNumberPlies"
					borderBottom
				>
					<u-input
						v-model="modelData.spreadClothNumberPlies"
						placeholder="请输入铺布层数"
						inputAlign="right"
						border="none"
						@change="onClothNumberPlies"
						clearable
					></u-input>
				</u-form-item>
				<u-form-item
					label="段      长:" 
					prop="fragmentExtent"
					borderBottom
				>
					<u-input
						v-model="modelData.fragmentExtent"
						placeholder="请输入段      长" 
						inputAlign="right"
						border="none"
						@change="onFragmentExtent"
						clearable
					></u-input>
				</u-form-item>
				<u-form-item
					label="铺布日期:"
					prop="spreadClothDate"
					borderBottom
				>
					<u-input
						v-model="modelData.spreadClothDate"
						placeholder="请选择铺布日期"
						inputAlign="right"
						border="none"
						clearable
					>
						<template slot="suffix">
							<u-icon 
								name="calendar"
								size="80"
								@tap="onSelectDate"
							></u-icon>
						</template>
					</u-input>
					<u-calendar
						:defaultDate="defaultDate"
						minDate="2021-01"
						maxDate="2024-12"
						monthNum="60"
						round="10"
						:show="showCalendar" 
						@confirm="onConfirmCalendar"
						@close="onCloseCalendar"
					></u-calendar>
				</u-form-item>
				<u-form-item
					label="铺布数量:"
					prop="spreadClothQuantity"
					borderBottom
				>
					<u-input
						v-model="modelData.spreadClothQuantity"
						placeholder="请输入铺布数量"
						inputAlign="right"
						border="none"
						@change="onClothQuantity"
						clearable
					></u-input>
				</u-form-item>
				<u-form-item
					label="剩余数量:"
					prop="spreadClothLeftQuantity"
					borderBottom
				>
					<u-input
						v-model="modelData.spreadClothLeftQuantity"
						placeholder="请输入剩余数量"
						inputAlign="right"
						border="none"
						@change="onClothLeftQuantity"
						clearable
					></u-input>
				</u-form-item>
				<u-form-item
					label="缺料数量:"
					prop="spreadClothLackQuantity"
					borderBottom
				>
					<u-input
						v-model="modelData.spreadClothLackQuantity"
						placeholder="请输入缺料数量"
						inputAlign="right"
						border="none"
						clearable
					></u-input>
				</u-form-item>
			</u--form>
			<view class="gridContent">
				<view style="width: 150rpx;margin: 20rpx 0;">
					<u-button 
						icon="plus" 
						size="small" 
						color="#1F9BEF" 
						type="primary" 
						text="新增" 
						@tap="addGrid"
					></u-button>
				</view>
				<scroll-view scroll-y="true" enable-flex="true" class="scrollClass">
					<view class="table">
					  <view class="tableHeader">
						<text class="tableText">序号</text>
						<text class="tableText">层号</text>
						<text class="tableText">疵点个数</text>
						<text class="tableText">操作</text>
					  </view>
					  <view class="tableContent">
						 <view class="tdContent" v-for="(item, index) in gridList" :key="index">
							<view class="tableText">{{index+1}}</view>
							<view class="tableText">
								<u-input
									v-model="item.pliesNo"
									placeholder="请输入"
									inputAlign="center"
									shape="circle"
									@change="onPliesNo"
									clearable
								></u-input>
							</view>
							<view class="tableText">
								<u-input
									v-model="item.defectQuantity"
									placeholder="请输入"
									inputAlign="center"
									shape="circle"
									@change="onDefectQuantity"
									clearable
								></u-input>
							</view>
							<view class="tableText">
								<u-button 
									shape="circle" 
									size="small"
									color="#DC143C" 
									text="删除" 
									@tap="deleteGrid(index)"
								></u-button>
							</view>
						 </view>
					  </view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="bottomLocation">
			<view class="btnLocation">
				<view class="commonBtn moreBtn" id="moreBtn" @tap="handleMore">更多</view>
				<view class="commonBtn submitBtn" @tap="onSubmit" v-if="isSubmit">提交</view>
				<view class="commonBtn noSubmitBtn" v-else>提交</view>
			</view>
			<view class="btnModal" v-show="showModal">
				<image class="modalImage" src="../../static/blanket/modalImage.png" mode="aspectFit"></image>
				<view class="commonBtn emptyBtn" @tap="handleEmpty">清空</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import Api from '../../service/api'

export default {
	name: 'blanketDataCollect',
	data() {
		return {	
			scanValue: '',
			clothCodeValue: '',
			isSearch: false,
			showCalendar: false,
			gridList: [],
			isSubmit: false,
			showModal: false,
			mesReceiveDataId: '', // 收货数据的id
			materialColor: '', // 物料代码、颜色
			larghezza: '', // 幅宽(cm)
			weight: '', // 克重(g/㎡)
			sendQty: '', // 库存数量
			materialQtyPd: '', // 单耗
			modelData: {
				mesSpreadClothId: '', // 铺布数据的id
				spreadClothNumberPlies: '', // 铺布层数
				fragmentExtent: '', // 段长
				spreadClothDate: '', // 铺布日期
				spreadClothQuantity: '', // 铺布数量
				spreadClothLeftQuantity: '', // 剩余数量
				spreadClothLackQuantity: '' // 缺料数量
			},
		}
	},
	mounted() {
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		month = month < 10 ? ('0' + month) : month
		let day = date.getDate()
		day = day < 10 ? ('0' + day) : day
		let time = year + '-' + month + '-' + day
		this.modelData.spreadClothDate = time
		this.defaultDate = time
	},
	methods: {
		onScanCode() {
			uni.scanCode({
				onlyFromCamera: true,
				success: res => {
					console.log(res.result)
					this.clothCodeValue = res.result
					this.handleScanReceiveCode(res.result)
					this.handleScanClothCode(res.result)
				},
				fail: err => {
					// 需要注意的是小程序扫码不需要申请相机权限
				}
			});
		},
		handleScanReceiveCode(clothBarCode) { // 扫描布条码带出收货数据
			Api.getReceiveData({
				clothBarCode: clothBarCode 
			}).then(res => {
				if (res.code == 0) {
					this.isSearch = true
					this.isSubmit = true
					
					let materialCode = res.data.materialCode || ''
					let colorCode = res.data.colorCode || ''
					let colorName = res.data.colorName || ''
					
					this.mesReceiveDataId = res.data.id || ''
					this.materialColor = `${materialCode} ${colorCode} ${colorName}`
					this.larghezza = res.data.larghezza || ''
					this.weight = res.data.weight || ''
					this.sendQty = res.data.sendQty || ''
					this.materialQtyPd = res.data.materialQtyPd || ''
				}
			})
		},
		handleScanClothCode(clothBarCode) { // 扫描布条码带出铺布数
			Api.getSpreadClothData({
				clothBarCode: clothBarCode 
			}).then(res => {
				if (res.code == 0) {
					this.modelData.mesSpreadClothId = res.data.id || ''
					this.modelData.spreadClothNumberPlies = res.data.spreadClothNumberPlies || ''
					this.modelData.fragmentExtent = res.data.fragmentExtent || ''
					this.modelData.spreadClothDate = res.data.spreadClothDate || ''
					this.modelData.spreadClothQuantity = res.data.spreadClothQuantity || ''
					this.modelData.spreadClothLeftQuantity = res.data.spreadClothLeftQuantity || ''
					this.modelData.spreadClothLackQuantity = res.data.spreadClothLackQuantity || ''
					this.gridList = res.data.spreadClothDefectVOS || []
				}
			})
		},
		onSelectDate() {
			this.showCalendar = true
		},
		onConfirmCalendar(e) {
			this.showCalendar = false
			this.modelData.spreadClothDate = e[0]
		},
		onCloseCalendar() {
			this.showCalendar = false
		},
		isInteger(value) {
			const reg = /^[0-9]*[1-9][0-9]*$/
			return reg.test(value)
		},
		isFloat(value) {
			const reg = /^\d+(\.\d+)?$/
			return reg.test(value)
		},
		onClothNumberPlies(e) { // 铺布层数事件
			if(!this.isInteger(e)) {
				this.$refs.uToast.show({
					type: 'error',
					message: "请输入整数！",
					duration: '2000',
				})
				return
			}
			
			if(this.modelData.fragmentExtent) {
				// 铺布数量
				this.modelData.spreadClothQuantity = (Number(this.modelData.spreadClothNumberPlies) * Number(this.modelData.fragmentExtent)).toFixed(2)
			}
			if(this.sendQty) {
				// 剩余数量
				this.modelData.spreadClothLeftQuantity = Number(this.sendQty) - Number(this.modelData.spreadClothQuantity)
				// 缺料数量
				this.modelData.spreadClothLackQuantity = Number(this.sendQty) - Number(this.modelData.spreadClothQuantity) - Number(this.modelData.spreadClothLeftQuantity)
			}
		},
		onFragmentExtent(e) { // 段长事件
			if(!this.isFloat(e)) {
				this.$refs.uToast.show({
					type: 'error',
					message: "请输入整数或两位小数！",
					duration: '2000',
				})
				return
			}
			
			if(!this.isInteger(e)) {
				this.modelData.fragmentExtent = e.toFixed(2)
			}
		
			if(this.modelData.spreadClothNumberPlies) {
				// 铺布数量
				this.modelData.spreadClothQuantity = (Number(this.modelData.spreadClothNumberPlies) * Number(this.modelData.fragmentExtent)).toFixed(2)
			}
			if(this.sendQty) {
				// 剩余数量
				this.modelData.spreadClothLeftQuantity = Number(this.sendQty) - Number(this.modelData.spreadClothQuantity)
				// 缺料数量
				this.modelData.spreadClothLackQuantity = Number(this.sendQty) - Number(this.modelData.spreadClothQuantity) - Number(this.modelData.spreadClothLeftQuantity)
			}
		},
		onClothQuantity(e) { // 铺布数量事件
			this.modelData.spreadClothQuantity = e.detail
			if(this.sendQty) {
				// 剩余数量
				this.modelData.spreadClothLeftQuantity = Number(this.sendQty) - Number(this.modelData.spreadClothQuantity)
			}
		},
		onClothLeftQuantity(e) { // 剩余数量事件
			this.modelData.spreadClothLeftQuantity = e.detail
			if(this.sendQty) {
				// 缺料数量
				this.modelData.spreadClothLackQuantity = Number(this.sendQty) - Number(this.modelData.spreadClothQuantity) - Number(this.modelData.spreadClothLeftQuantity)
			}
		},
		addGrid() {
			this.gridList.push({
				mesSpreadClothId: this.modelData.mesSpreadClothId,
				id: '',
				pliesNo: '',
				defectQuantity: ''
			})
		},
		deleteGrid(index) {  // 删除表格一行
			this.gridList.splice(index, 1)
		},
		onPliesNo(e) {
			if(!this.isInteger(e)) {
				this.$refs.uToast.show({
					type: 'error',
					message: "请输入整数！",
					duration: '2000',
				})
				return
			}
		},
		onDefectQuantity(e) {
			if(!this.isInteger(e)) {
				this.$refs.uToast.show({
					type: 'error',
					message: "请输入整数！",
					duration: '2000',
				})
				return
			}
		},
		handleMore() { // 更多
			this.showModal = true
		},

		closeModal(e){//点击页面其他地方关闭清空按钮
			if(e.target.id!="moreBtn" && this.showModal){
				this.showModal=false 
			}
		},
		onSubmit() { // 提交
			Api.saveData({
				dto: {
					mesReceiveDataId: this.mesReceiveDataId,
					id: this.modelData.mesSpreadClothId,
					spreadClothNumberPlies: this.modelData.spreadClothNumberPlies,
					fragmentExtent: this.modelData.fragmentExtent,
					spreadClothDate: this.modelData.spreadClothDate,
					spreadClothQuantity: this.modelData.spreadClothQuantity,
					spreadClothLeftQuantity: this.modelData.spreadClothLeftQuantity,
					spreadClothLackQuantity: this.modelData.spreadClothLackQuantity,
					mesSpreadClothDefectDTO: this.gridList
				}
			}).then(res => {
				if (res.code === 0) {
					// 数据提交成功
					this.$refs.uToast.show({
						type: 'success',
						message: "数据提交成功！",
						duration: '2000',
					})
					this.handleEmpty()
				}
			})
		},
		handleEmpty() { // 清空
			this.isSearch = false
			this.showModal = false
			// 布条码清空
			this.clothCodeValue = ''
			// 提交按钮置灰
			this.isSubmit = false
			// 表格清空
			this.gridList = []
			// 收货数据清空
			this.materialColor = ''
			this.larghezza = ''
			this.weight = ''
			this.sendQty = ''
			this.materialQtyPd = ''
			// 铺布数据清空
			this.modelData.spreadClothNumberPlies = ''
			this.modelData.fragmentExtent = ''
			this.modelData.spreadClothDate = ''
			this.modelData.spreadClothQuantity = ''
			this.modelData.spreadClothLeftQuantity = ''
			this.modelData.spreadClothLackQuantity = ''
		}
	}
}
</script>

<style lang="scss" scoped>
.mainContent {
	background-color: #F3F3F3;
	.search {
		.searchStyle {
			color: #999;
			font-size: 44rpx;
		}
		.scanStyle {
			color: #999;
			font-size: 44rpx;
		}
	}
	.content {
		.titleContent {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			background-color: #fff;
			padding: 0 20rpx;
			.title {
				font-size: 34rpx;
				font-weight: bold;
				color: #333;
			}
			.unit {
				font-size: 24rpx;
			}
		}
		.calendarStyle {
			color: #999;
			font-size: 56rpx;
		}
		.gridContent {
			background-color: #fff;
			padding: 40rpx 20rpx;
			.scrollClass {
			  display: flex;
			  width: 100%;
			  height: 100%;
			  white-space: nowrap;
			  background-color: #fff;
			  margin: 40rpx 0 100rpx;
			  flex-direction: row;
			  justify-content: center;
			  align-items: center;
			  overflow-x: auto;
			  .table {
			    width: 100%;
			    border: 2rpx solid #eaeaea;
				box-sizing: border-box;
				.tableHeader {
				  display: flex;
				  justify-content: center;
				  align-items: center;
				  width: 100%;
				  height: 90rpx;
				  background-color: #FAFAFA;
				  color: #000;
				}
				.tableContent {
					background-color: #fff;
					width: 100%;
					height: 320rpx;
					overflow: auto;
					.tdContent {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100rpx;
						border-bottom: 2rpx solid #D8D8D8;
					}
				}
				.tableText {
				  width: 25%;
				  text-align: center;
				}
			  }
			}
		}
	}
	.bottomLocation {
		position: relative;
		width: 92%;
		background-color: #fafafa;
		border-top: 1rpx solid #dcdcdc;
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 15rpx 30rpx 30rpx;
		.btnLocation {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.moreBtn {
				background-color: #fca147;
				cursor: pointer;
			}
			.submitBtn {
				background-color: #4a70f5;
				cursor: pointer;
			}
			.noSubmitBtn {
				background-color: #cccccc;
				cursor: not-allowed;
			}
		}
	}
	.btnModal {
		position: absolute;
		left: 30rpx;
		bottom: 100rpx;
		z-index: 10;
		.modalImage {
			width: 300rpx;
			height: 166rpx;
		}
	}
	.commonBtn {
		display: inline-block;
		text-align: center;
		color: #fff;
		padding: 18rpx 50rpx;
		border-radius: 12rpx;
		font-size: 38rpx;
	}
	.emptyBtn {
		background-color: #FC361D;
		position: absolute;
		left: 65rpx;
		top: 35rpx;
	}
}
</style>